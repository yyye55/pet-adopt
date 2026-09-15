<script setup lang="ts">
/**
 * 线路详情页
 * 路由：/detail/:id
 */
import { useRoute } from 'vue-router'

const route = useRoute()
const routeId = Number(route.params.id)
</script>

<template>
  <div class="detail-page">
    <h2>线路详情 #{{ routeId }}</h2>
    <!-- 行程时间线、费用说明、报名按钮待开发 -->
  </div>
</template>

<style scoped lang="scss"></style>
