/**
 * SCSS → CSS 批量转换脚本
 * 把所有 .vue 文件里的 <style scoped lang="scss"> 改为 <style scoped>
 * 同时把嵌套的 SCSS 语法展开为平铺的 CSS 选择器
 * 运行：node scripts/scss-to-css.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

// 递归找所有 .vue 文件
function findVueFiles(dir) {
  const results = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...findVueFiles(full))
    } else if (entry.name.endsWith('.vue')) {
      results.push(full)
    }
  }
  return results
}

// 简单的嵌套展开器（处理 &.xxx / &:hover / .a { .b {} } 这种两层嵌套）
function flattenNesting(selector, body) {
  // body 里可能还有嵌套，先处理
  const nested = [] // [{ inner, innerBody }]
  const simpleLines = [] // 平铺的属性

  // 解析 body：找 { } 结构
  let depth = 0
  let current = ''
  let block = ''
  let inBlock = false

  for (const ch of body) {
    if (ch === '{') {
      depth++
      if (depth === 1) {
        inBlock = true
        block = ''
      } else {
        current += ch
      }
    } else if (ch === '}') {
      depth--
      if (depth === 0) {
        // current 是内部选择器，block 是内部 body
        const innerSel = current.trim().replace(/,$/, '')
        if (innerSel) nested.push({ sel: innerSel, body: block.trim() })
        current = ''
        block = ''
        inBlock = false
      } else {
        current += ch
      }
    } else if (inBlock) {
      block += ch
    } else {
      current += ch
    }
  }

  // 把非嵌套的属性行收集起来
  const props = current
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s && !s.startsWith('//'))

  const results = []

  // 先加当前选择器的属性
  if (props.length > 0) {
    results.push(`${selector} {\n    ${props.join(';\n    ')};\n  }`)
  }

  // 处理嵌套
  for (const { sel, body: innerBody } of nested) {
    // 展开 & 引用
    const expanded = sel
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        if (line.startsWith('&')) {
          return line.replace(/&/g, selector)
        } else if (line.includes('&')) {
          return line.replace(/&/g, selector)
        } else if (line.startsWith('@')) {
          // @media / @keyframes 保持原样
          return line
        } else {
          // .child 直接加在后面
          return line.startsWith(':')
            ? `${selector}${line}`
            : `${selector} ${line}`
        }
      })
      .join(',\n  ')

    // 递归处理更深层的嵌套
    results.push(...flattenNesting(expanded, innerBody))
  }

  return results
}

// 把一段 SCSS 样式文本转为纯 CSS
function scssToCss(scss) {
  // 去掉 // 注释 保留 /* */
  let css = scss.replace(/^\s*\/\/.*$/gm, '')

  // 处理 &:deep() 保持原样（:deep() 在 CSS scoped 中也能用）
  // 跳过 :deep() 块，它们内部的嵌套是 Element Plus 的结构，保持原样
  // 实际上 :deep() 内部的选择器不需要变化

  // 顶层选择器处理
  // 匹配：选择器 { body } 结构
  const blocks = []
  let depth = 0
  let selector = ''
  let body = ''
  let buf = ''

  // 清理空行开头的空格问题
  css = css.replace(/\n{2,}/g, '\n')

  for (let i = 0; i < css.length; i++) {
    const ch = css[i]
    if (ch === '{') {
      depth++
      if (depth === 1) {
        selector = buf.trim()
        buf = ''
      } else {
        buf += ch
      }
    } else if (ch === '}') {
      depth--
      if (depth === 0) {
        body = buf
        buf = ''
        if (selector) {
          blocks.push({ selector, body })
        }
      } else {
        buf += ch
      }
    } else {
      buf += ch
    }
  }

  // 展开每个 block
  const all = []
  for (const block of blocks) {
    all.push(...flattenNesting(block.selector, block.body))
  }

  return all.join('\n\n')
}

// 处理单个文件
function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8')

  // 找所有 <style scoped lang="scss">...</style> 块
  const styleRegex = /<style\s+scoped\s+lang="scss">([\s\S]*?)<\/style>/g

  let newContent = content
  let count = 0
  let match

  while ((match = styleRegex.exec(content)) !== null) {
    count++
    const originalStyle = match[1]
    const converted = scssToCss(originalStyle)
    const replacement = `<style scoped>\n${converted}\n</style>`
    newContent = newContent.replace(match[0], replacement)
  }

  if (count > 0) {
    fs.writeFileSync(filePath, newContent, 'utf-8')
    return count
  }
  return 0
}

// 主流程
const vueFiles = findVueFiles(path.join(root, 'src'))
let totalFiles = 0
let totalBlocks = 0

for (const file of vueFiles) {
  const blocks = processFile(file)
  if (blocks > 0) {
    totalFiles++
    totalBlocks += blocks
    console.log(`  ✔ ${path.relative(root, file)} (${blocks} blocks)`)
  }
}

console.log(`\n完成！处理了 ${totalFiles} 个文件，共 ${totalBlocks} 个样式块`)
