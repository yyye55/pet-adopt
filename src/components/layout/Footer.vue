<script setup lang="ts">
/**
 * 页脚组件
 * 品牌介绍 + 版权 + 联系方式
 */
</script>

<template>
  <footer class="yt-footer">
    <div class="container footer-inner">
      <div class="footer-brand">
        <div class="brand-name">青行迹 · Youth Trail</div>
        <p class="brand-desc">青春正当时，一路向山海出发</p>
      </div>

      <div class="footer-links">
        <div class="link-col">
          <h4>关于我们</h4>
          <p>项目介绍</p>
          <p>联系方式</p>
        </div>
        <div class="link-col">
          <h4>帮助中心</h4>
          <p>报名须知</p>
          <p>常见问题</p>
        </div>
      </div>
    </div>

    <div class="copyright">
      © 2026 青行迹 Youth Trail · 仅供学习展示使用
    </div>
  </footer>
</template>

<style scoped lang="scss">
@use '@/styles/variables.scss' as *;

.yt-footer {
  background: darken($color-bg, 2%);
  margin-top: auto;
  padding-top: $spacing-xxl;

  .footer-inner {
    display: flex;
    justify-content: space-between;
    padding-bottom: $spacing-xl;

    .brand-name {
      font-size: 18px;
      font-weight: 700;
      color: $color-primary;
      margin-bottom: $spacing-sm;
    }

    .brand-desc {
      color: $color-text-secondary;
      font-size: 14px;
    }

    .footer-links {
      display: flex;
      gap: $spacing-xxl;

      .link-col h4 {
        color: $color-text-primary;
        font-size: 14px;
        margin-bottom: $spacing-sm;
      }

      .link-col p {
        color: $color-text-secondary;
        font-size: 13px;
        line-height: 1.8;
      }
    }
  }

  .copyright {
    text-align: center;
    padding: $spacing-lg 0;
    border-top: 1px solid $color-border;
    color: $color-text-secondary;
    font-size: 13px;
  }
}
</style>
