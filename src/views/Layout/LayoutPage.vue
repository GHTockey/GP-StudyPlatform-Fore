<template>
   <div class="layout-container pt-16">
      <!-- 导航栏 -->
      <NavBar />
      <!-- 路由视图 -->
      <RouterView :key="$route.fullPath" />
   </div>
</template>

<script setup lang="ts">

</script>

<style lang="less" scoped>
.layout-container {
   height: auto;
}
</style>