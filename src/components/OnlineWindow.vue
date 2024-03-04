<template>
   <!-- 聊天窗口 -->
   <dialog id="onlineBox" class="modal">
      <div class="modal-box max-w-[1000px] min-h-[700px]">
         <h3 class="font-bold text-lg mb-3">online</h3>

         <div class="border border-red-500 h-[600px] flex overflow-hidden relative">
            <!-- 切换按钮 -->
            <div class="tooltip tooltip-right transition-all absolute z-10 top-1/2 -translate-x-1/2 hover:translate-x-0"
               data-tip="用户列表">
               <button @click="hideUserList = !hideUserList" class="btn btn-circle btn-sm">
                  <IconFont type="icon-celanshouqi" />
               </button>
            </div>
            <!-- 用户列表 -->
            <div class="w-[280px] overflow-auto transition-all" :class="{ 'absolute -translate-x-full': hideUserList }">
               <!-- 项 -->
               <div v-for="(item, index) in 20" :key="index" class="bg-base-200/50 transition-all rounded-lg h-[60px] flex items-center justify-between
             mb-1 hover:bg-base-200">
                  <!-- 头像 -->
                  <div class="avatar offline mx-2">
                     <div class="size-[50px] rounded-full">
                        <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                     </div>
                  </div>
                  <!-- 用户名与信息 -->
                  <div class="flex-1 flex flex-wrap">
                     <p class="w-full">李 {{ index }}</p>
                     <span class="text-gray-500 text-sm">123456789</span>
                  </div>
                  <!-- 操作按钮 -->
                  <div class="mr-2">
                     <button class="btn btn-circle btn-sm">test</button>
                  </div>
               </div>

            </div>
            <!-- 聊天盒 -->
            <div class="flex-1 px-2 flex flex-col">
               <!-- 未选择显示 -->
               <!-- <div>选择用户来聊天</div> -->
               <!-- 聊天内容 -->
               <div class="bg-green-500/50 flex-1 overflow-y-auto">
                  <!-- 条目 -->
                  <div class="chat chat-start">
                     <div class="chat-image avatar">
                        <div class="w-10 rounded-full">
                           <img alt="Tailwind CSS chat bubble component"
                              src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                        </div>
                     </div>
                     <div class="chat-bubble">你是救世之星!</div>
                     <div class="chat-footer opacity-50">
                        已读
                     </div>
                  </div>
                  <div class="chat chat-end" v-for="i in 10">
                     <div class="chat-image avatar">
                        <div class="w-10 rounded-full">
                           <img alt="Tailwind CSS chat bubble component"
                              src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                        </div>
                     </div>
                     <div class="chat-bubble">我恨你!</div>
                     <div class="chat-footer opacity-50">
                        12:46
                     </div>
                  </div>
               </div>
               <!-- 输入消息框 -->
               <div><textarea placeholder="Bio"
                     class="textarea textarea-bordered textarea-xs w-full max-w-xs"></textarea>
               </div>
            </div>
         </div>

         <div class="modal-action">
            <form method="dialog">
               <button class="btn">关闭</button>
            </form>
         </div>
      </div>
   </dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import IconFont from "@/utils/iconFont";

withDefaults(
   defineProps<{
      showWindow?: boolean;
   }>(),
   // 默认值
   {
      showWindow: false,
   }
);

// 显示聊天窗口
const showWindow = ref(false)
// 当前选中的用户
const currentUser = ref();
// 隐藏用户列表 flag
const hideUserList = ref(false);

</script>

<style lang="less"></style>