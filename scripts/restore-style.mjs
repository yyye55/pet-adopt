/**
 * 精准恢复脚本：从 git commit 取出旧版文件的 <style> 块
 * 只替换 style，保留 script/template 的所有后续改动
 */
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const COMMIT = 'b80c58d' // 上一次正确的 commit

// 需要恢复 style 的文件列表（从 git status modified 里挑出被脚本破坏的 .vue）
const filesToRestore = [
  'src/components/about/BrandStory.vue',
  'src/components/about/FeatureList.vue',
  'src/components/about/TechStack.vue',
  'src/components/common/ConfirmDialog.vue',
  'src/components/common/EmptyState.vue',
  'src/components/common/Loading.vue',
  'src/components/common/Pagination.vue',
  'src/components/layout/Sidebar.vue',
  'src/components/login/LoginForm.vue',
  'src/components/login/RegisterForm.vue',
  'src/components/mine/BrowseHistory.vue',
  'src/components/mine/MyFavorites.vue',
  'src/components/order/MyOrders.vue',
  'src/components/order/OrderTable.vue',
  'src/components/route/FeeInfo.vue',
  'src/components/route/Itinerary.vue',
  'src/components/route/RouteCard.vue',
  'src/components/route/RouteForm.vue',
  'src/components/route/RoutePagination.vue',
  'src/components/route/RouteTable.vue',
  'src/components/route/SearchBar.vue',
  'src/components/signup/SignupForm.vue',
  'src/components/signup/SignupTable.vue',
  'src/components/status/StatCard.vue',
  'src/views/admin/index.vue',
  'src/views/admin/orders/index.vue',
  'src/views/admin/routes/index.vue',
  'src/views/admin/signups/index.vue',
  'src/views/admin/users/index.vue',
  'src/views/user/about/index.vue',
  'src/views/user/home/detail.vue',
  'src/views/user/home/list.vue',
  'src/views/user/home/signup.vue',
  'src/views/user/login/index.vue',
  'src/views/user/mine/index.vue',
]

// 从 git 取出旧版文件内容
function getOldFile(relPath) {
  try {
    return execSync(`git show ${COMMIT}:${relPath}`, { cwd: root, encoding: 'utf-8' })
  } catch {
    return null
  }
}

// 精准替换 style 块
function restoreStyle(currentContent, oldContent) {
  // 提取旧版的 <style ...>...</style>
  const styleRegex = /<style[^>]*>[\s\S]*?<\/style>/g
  const oldMatch = oldContent.match(styleRegex)
  if (!oldMatch) return currentContent

  // 用第一个旧版 style 块替换当前所有 style 块
  const newContent = currentContent.replace(styleRegex, oldMatch[0])
  return newContent
}

let restored = 0
for (const relPath of filesToRestore) {
  const fullPath = path.join(root, relPath)
  if (!fs.existsSync(fullPath)) {
    console.log(`  ⏭ ${relPath} (不存在)`)
    continue
  }

  const current = fs.readFileSync(fullPath, 'utf-8')
  const old = getOldFile(relPath)
  if (!old) {
    console.log(`  ⚠ ${relPath} (git 里找不到旧版)`)
    continue
  }

  // 检查旧版有没有 style 块
  if (!/<style[^>]*>/.test(old)) {
    console.log(`  ⏭ ${relPath} (旧版没有 style 块)`)
    continue
  }

  // 如果当前已经没了 lang="scss" 且看起来还是坏的才恢复
  const hasLangScss = /lang="scss"/.test(current)
  if (hasLangScss) {
    console.log(`  ⏭ ${relPath} (已经是 scss，不需要恢复)`)
    continue
  }

  const fixed = restoreStyle(current, old)
  fs.writeFileSync(fullPath, fixed, 'utf-8')
  restored++
  console.log(`  ✔ ${relPath}`)
}

console.log(`\n恢复完成！${restored} 个文件的 style 块已从 git 恢复`)
