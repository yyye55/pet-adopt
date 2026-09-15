<script setup lang="ts">
/**
 * 报名页面
 * 路由：/signup/:id
 */
import { useRoute } from 'vue-router'

const route = useRoute()
const routeId = Number(route.params.id)
</script>

<template>
  <div class="signup-page">
    <h2>报名线路 #{{ routeId }}</h2>
    <!-- 报名表单待开发 -->
  </div>
</template>

<style scoped lang="scss"></style>
