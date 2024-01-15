<template>
   <div class="nav-header">
      <!-- logo -->
      <div class="nav-logo">
         <!-- <img src="" alt=""> -->
         <span style="margin-right: 10px;" class="font-bold">LOGO ICON</span>
      </div>
      <!-- 按钮1 -->
      <div class="nav-btn">
         <AButton shape="circle" type="default">
            <PlusOutlined />
         </AButton>
      </div>
      <a-avatar :size="{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }">
         <template #icon>
            <AntDesignOutlined />
         </template>
      </a-avatar>
      {{ userStore.userInfo }}
   </div>
</template>

<script setup lang="ts">
import { PlusOutlined, AntDesignOutlined } from "@ant-design/icons-vue";
import { useUserStore } from "@/stores/userStore";

const userStore = useUserStore();
</script>

<style lang="less">
.nav-header {
   border: 1px solid orange;
   height: 60px;
   display: flex;
   align-items: center;
   padding: 10px;
}
</style>