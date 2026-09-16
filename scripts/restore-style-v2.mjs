/**
 * 精准恢复：从 git 取出旧版文件的 style 块，只替换 style
 * 保留 script/template 里的所有新改动
 */
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const COMMIT = 'b80c58d'

const vueFiles = []
function find(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name)
    if (e.isDirectory()) find(full)
    else if (e.name.endsWith('.vue')) vueFiles.push(full)
  }
}
find(path.join(root, 'src'))

let ok = 0,
  skip = 0,
  err = 0
for (const fullPath of vueFiles) {
  const rel = path.relative(root, fullPath)
  const cur = fs.readFileSync(fullPath, 'utf-8')
  let old
  try {
    old = execSync(`git show ${COMMIT}:${rel.replace(/\\/g, '/')}`, {
      cwd: root,
      encoding: 'utf-8',
    })
  } catch {
    // 新文件，不在旧 commit 里，跳过
    skip++
    continue
  }

  // 检查当前是否还是坏的（没有 lang="scss" 说明被脚本改坏了）
  if (cur.includes('lang="scss"')) {
    skip++
    continue
  }

  // 从旧版提取 style 块
  const oldMatch = old.match(/<style[^>]*lang="scss"[^>]*>[\s\S]*?<\/style>/)
  if (!oldMatch) {
    console.log(`  ⚠ ${rel} 旧版没找到 style 块`)
    err++
    continue
  }

  // 替换当前文件里的 style 块
  const newContent = cur.replace(/<style[^>]*>[\s\S]*?<\/style>/, oldMatch[0])
  if (newContent === cur) {
    console.log(`  ⚠ ${rel} 没有找到可替换的 style 块`)
    err++
    continue
  }

  fs.writeFileSync(fullPath, newContent, 'utf-8')
  console.log(`  ✔ ${rel}`)
  ok++
}

console.log(`\n恢复完成！成功 ${ok}，跳过 ${skip}（已是 scss），失败 ${err}`)
