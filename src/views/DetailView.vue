<script setup lang="ts">
/**
 * 线路详情页 Detail
 * 路由：/detail/:id（动态路由）
 * 功能：根据 id 渲染线路详情、行程时间线、报名、收藏
 */
import { useRoute } from 'vue-router'

const route = useRoute()
const routeId = Number(route.params.id)
</script>

<template>
  <div class="detail-page">
    <!-- 页面内容待开发 -->
    <h2>线路详情 #{{ routeId }}</h2>
  </div>
</template>

<style scoped lang="scss"></style>
