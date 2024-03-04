<template>
   <div class="home-container my-type-center">

      <!-- 主功能模式介绍轮播 -->
      <div class="">
         <p>1</p>
      </div>

      <a-divider />

       <!-- 近期学习的词集列表 -->
      <div class="recent w-full">
         <a-row :gutter="[10, 10]">
            <a-col :xs="24" :md="12" :xl="8" :xxl="6" v-for="(item, i) in 10" :key="i">
               <div @click="$router.push('/detail/11111')">
                  <p>小黑子捕获计划{{ i + 1 }}</p>
                  <p>233 个词条</p>
                  <span>2022.03.26</span>
                  <div>
                     <a-avatar>
                        <template #icon>
                           <UserOutlined />
                        </template>
                     </a-avatar>
                     <span>小明</span>
                  </div>
               </div>
            </a-col>
         </a-row>
      </div>
   </div>
</template>

<script setup lang="ts">
import { UserOutlined } from "@ant-design/icons-vue";
</script>

<style lang="less" scoped>
.home-container {
   .recent {
      >div {
         height: 200px;

         >div {
            height: 100%;
            transition: all 0.3s ease 0s;

            // border: 1px solid red;
            >div {
               transition: all 0.3s ease 0s;
               box-shadow: rgba(136, 165, 191, 0.48) 6px 2px 16px 0px, rgba(255, 255, 255, 0.8) -6px -2px 16px 0px;
               background-image: linear-gradient(120deg, #66a6ff 0%, #89f7fe 100%);
               border-radius: 15px;
               height: 100%;
               position: relative;
               // 悬浮小手
               cursor: pointer;

               // 悬浮阴影
               &:hover {
                  box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
               }

               >p {
                  position: absolute;

                  // 标题
                  &:nth-child(1) {
                     top: 10px;
                     left: 10px;
                     font-size: 20px;
                     font-weight: 600;
                  }

                  // 词条数量
                  &:nth-child(2) {
                     top: 40px;
                     left: 10px;
                     font-size: 14px;
                  }
               }

               // 日期
               >span {
                  position: absolute;
                  bottom: 10px;
                  right: 10px;
                  font-size: 14px;
               }

               // 头像和昵称
               >div {
                  position: absolute;
                  bottom: 10px;
                  left: 10px;
                  font-size: 14px;
                  display: flex;
                  align-items: center;

                  >span:nth-child(2) {
                     margin-left: 10px;
                  }
               }
            }
         }
      }
   }
}
</style>