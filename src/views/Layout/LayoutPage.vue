<template>
   <div class="layout-container pt-16">
      <!-- 导航栏 -->
      <NavBar />

      <RouterView />
   </div>
</template>

<script setup lang="ts">

</script>

<style lang="less" scoped>
.layout-container {
   height: auto;
}
</style>