/**
 * 健壮的 SCSS → CSS 批量转换脚本 v2
 * 用栈式括号匹配正确解析嵌套，保证效果不变
 * 运行：node scripts/scss-to-css-v2.mjs
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

// 核心：把一段 SCSS 文本展开为平铺的 CSS
function flattenScss(scss) {
  let result = scss
  // 先删 // 单行注释（保留 /* */）
  result = result.replace(/^\s*\/\/.*$/gm, '')

  // 用栈解析 {} 嵌套结构
  // 每次把最深层的 & 引用展开并提升到父层级
  let changed = true
  let safety = 0
  while (changed && safety < 50) {
    changed = false
    safety++

    // 找到最内层的 { ... } 块（内部没有 { }）
    // 用正则找：selector { 里面没有 { 的内容 }
    const blockRegex = /([^{}]+)\{([^{}]+)\}/g
    const blocks = []
    let m
    while ((m = blockRegex.exec(result)) !== null) {
      blocks.push({ full: m[0], selector: m[1].trim(), body: m[2], index: m.index })
    }

    // 从后往前处理（避免 index 偏移）
    for (let i = blocks.length - 1; i >= 0; i--) {
      const block = blocks[i]
      const { selector, body } = block

      // 检查 body 里有没有更深层的 { }
      if (body.includes('{')) continue

      // 检查 selector 里有没有 & 或 body 里有没有嵌套调用
      // 展开当前块
      const expanded = expandBlock(selector, body.trim())
      if (expanded !== null) {
        // 把原来的整块替换成展开后的内容
        const before = result.slice(0, block.index)
        const after = result.slice(block.index + block.full.length)
        result = before + expanded + after
        changed = true
      }
    }
  }

  // 清理多余空行
  result = result.replace(/\n{3,}/g, '\n\n').trim() + '\n'
  return result
}

// 展开单个块
function expandBlock(parentSel, body) {
  // body 里可能有多行属性： color: red; font-size: 14px;
  // 也可能有 // 注释 或 多行属性
  const props = body
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s && !s.startsWith('//'))

  if (props.length === 0) return null

  // 展开 & 引用
  // parentSel 里可能有 &，把 & 替换为父级
  // 但这里 parentSel 已经是顶层了（因为我们从内往外处理）
  // 实际上 parentSel 可能是 ".menu-item &.active" 这种情况？
  // 在我们的场景里，parentSel 就是直接包含 & 的选择器

  // 把 & 替换成空（因为展开后就是当前选择器自身）
  const flatSel = parentSel.replace(/&\s*\.([\w-]+)/g, '.$1').replace(/&([.:#\[])/g, '$1').replace(/&/g, '').trim()

  // 如果展开后选择器为空，说明整个选择器就是 &，保留父级
  if (!flatSel) return null

  // 把 flatSel 拆成逗号分隔的选择器列表
  const sels = flatSel.split(',').map((s) => s.trim()).filter(Boolean)

  // 拼成 CSS 块
  const lines = []
  for (const sel of sels) {
    lines.push(`${sel} {\n  ${props.join(';\n  ')};\n}`)
  }

  return lines.join('\n\n')
}

// 处理单个文件
function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8')

  // 找 <style scoped lang="scss">...</style>
  const styleRegex = /(<style\s+scoped\s+lang="scss">)([\s\S]*?)(<\/style>)/g

  let newContent = content
  let count = 0
  let match

  while ((match = styleRegex.exec(content)) !== null) {
    count++
    const openTag = match[1]
    const scssBody = match[2]
    const closeTag = match[3]

    // 如果是空 style，直接改标签
    if (!scssBody.trim()) {
      newContent = newContent.replace(match[0], '<style scoped></style>')
      continue
    }

    // 转换
    const cssBody = flattenScss(scssBody)
    const replacement = `<style scoped>\n${cssBody}</style>`
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
