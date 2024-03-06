<template>
   <!-- 聊天窗口 -->
   <dialog id="onlineBox" class="modal">
      <div class="modal-box max-w-[1000px] min-h-[700px]">
         <h3 class="font-bold text-lg mb-3">online</h3>

         <div class="border h-[600px] flex overflow-hidden relative">
            <!-- 切换按钮 -->
            <div class="tooltip tooltip-right transition-all absolute z-10 top-1/2 -translate-x-1/2 hover:translate-x-0"
               data-tip="用户列表">
               <button @click="hideUserList = !hideUserList" class="btn btn-circle btn-sm">
                  <IconFont type="icon-celanshouqi" />
               </button>
            </div>
            <!-- 用户列表 -->
            <div class="w-[280px] overflow-auto transition-all bg-base-200/20"
               :class="{ 'absolute -translate-x-full': hideUserList }">
               <!-- 项 -->
               <div v-for="(item, index) in userListMerge" :key="index" class="bg-base-200/50 transition-all rounded-lg h-[60px] flex items-center justify-between
             mb-1 hover:bg-base-200">
                  <!-- 头像 offline -->
                  <div class="avatar mx-2" :class="onlineUidList.includes(item.id) ? 'online' : 'offline'">
                     <div class="size-[50px] rounded-full">
                        <img :src="item.avatar" />
                     </div>
                  </div>
                  <!-- 用户名与信息 -->
                  <div class="flex-1 flex flex-wrap">
                     <p class="w-full">{{ item.username }}</p>
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
               <div class="flex-1 overflow-y-auto">
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
                  <div class="chat chat-end" v-for="i in 1">
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
               <div class="flex p-2">
                  <div class="w-[100px] gap-1 flex items-center">
                     <button class="btn btn-sm btn-circle">
                        <IconFont type="icon-biaoqing" />
                     </button>
                     <button class="btn btn-sm btn-circle">
                        <IconFont type="icon-xuexiku" />
                     </button>
                  </div>
                  <textarea rows="2" placeholder="输入消息"
                     class="textarea textarea-bordered textarea-xs size-full"></textarea>
               </div>
            </div>
         </div>

         <div class="modal-action">
            <form method="dialog">
               <button class="btn">关闭</button>
            </form>
         </div>
         <button @click="sendMsg" class="btn">send</button>
      </div>
   </dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useSocketStore } from "@/stores/socketStore";
import { useUserStore } from "@/stores/userStore";
import IconFont from "@/utils/iconFont";
import type { User } from "@/types/user";
import { storeToRefs } from "pinia";
import { UserAPI } from "@/api/user";
import { MyUtils } from "@/utils";
import _ from "lodash";

const socketStore = useSocketStore();
const userStore = useUserStore();

const { onlineUidList } = storeToRefs(socketStore)

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
// 在线用户列表
const onlineList = ref<User[]>([])
// 班级成员列表
const classesUserList = ref<User[]>([])
// 计算属性：在线用户列表和班级成员列表的合并
const userListMerge = computed(() => {
   // let data = onlineList.value.concat(classesUserList.value)
   let data = _.uniqBy(onlineList.value.concat(classesUserList.value), "id")
   console.log("onlineUidList", data, onlineUidList.value);
   return data
})

async function getUserListByCid(cid: string) {
   let result = await UserAPI.getUserListByCid(cid)
   if (result.code == 20000) {
      classesUserList.value = result.data
   }
}

if (userStore.userInfo) {
   // 添加自己到在线用户列表中
   // onlineList.value.push(userStore.userInfo)
   // 连接
   socketStore.connect(userStore.userInfo.id)
   // 获取班级成员
   getUserListByCid(userStore.userInfo.classes!.id!)
} else {
   MyUtils.alert("请先登录")
}



function sendMsg() {
   socketStore.send({
      receiver_id: '1000006',
      message: 'hello132'
   })
}


watch(
   () => onlineUidList.value,
   () => {
      // 更新用户列表
      UserAPI.getUserListByIdList(onlineUidList.value).then(res => {
         console.log("在线用户发生变化");
         onlineList.value = res.data
         // console.log(onlineList.value);
      })
   }
)
</script>

<style lang="less"></style>