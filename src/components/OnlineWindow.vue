<template>
   <!-- 聊天窗口 -->
   <dialog id="onlineBox" class="modal">
      <div class="modal-box max-w-[1000px] min-h-[300px]">
         <h3 class="font-bold text-lg mb-3">Online
            <span v-if="currentChatUser" class="text-xs font-[500]">当前与 {{ currentChatUser.username }} 聊天中</span>
         </h3>
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
               {{ chatContent }}
               <!-- 项 -->
               <div v-for="(item, index) in userListMerge" :key="index" class="bg-base-200/50 transition-all rounded-lg h-[60px] flex items-center justify-between
             mb-1 hover:bg-base-200 cursor-pointer border border-transparent" @click="selectUser(item);"
                  :class="{ 'myActive': currentChatUser?.id == item.id }">
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
                     <!-- <button class="btn btn-circle btn-sm">test</button> -->
                     <!-- 未读消息数 -->
                     <div class="badge badge-error">1</div>
                  </div>
               </div>

            </div>
            <!-- 聊天盒 -->
            <div class="flex-1 px-2 flex flex-col">
               <!-- 未选择显示 -->
               <div v-if="!currentChatUser" class="flex flex-wrap content-center justify-center size-full">
                  <img src="../assets/img//select-u.svg">
                  <p class="text-center w-full text-gray-500">请选择用户</p>
               </div>
               <template v-else>
                  <!-- 聊天内容 -->
                  <div class="chatBox flex-1 overflow-y-auto">
                     <!-- {{ chatContent }} -->
                     <div v-for="(item, index) in targetChat" :key="index" class="chat"
                        :class="item.senderId == currentChatUser.id ? 'chat-start' : 'chat-end'">
                        <div class="chat-image avatar">
                           <div class="w-10 rounded-full">
                              <!-- 头像 -->
                              <img alt="头像"
                                 :src="(item.senderId == userStore.userInfo?.id ? userStore.userInfo?.avatar : (userListMerge.find(u => u.id == item.senderId)?.avatar))" />
                           </div>
                        </div>
                        <!-- 内容 -->
                        <div class="chat-bubble">{{ item.message }}</div>
                        <!-- 反馈 -->
                        <div class="chat-footer opacity-50">
                           {{ item.timestamp }}
                        </div>
                     </div>
                  </div>
                  <!-- 输入消息框 -->
                  <div class="flex flex-wrap mb-2">
                     <div class="w-full gap-2 flex items-center">
                        <button class="btn btn-xs btn-circle">
                           <IconFont type="icon-biaoqing" />
                        </button>
                        <button class="btn btn-xs btn-circle">
                           <IconFont type="icon-xuexiku" />
                        </button>
                        <button class="btn btn-xs btn-circle">
                           <IconFont type="icon-lianjie" />
                        </button>
                     </div>
                     <div class="flex w-full mt-2 gap-2">
                        <textarea v-model="inputMsg" rows="2" placeholder="输入消息"
                           class="textarea bg-base-200 textarea-xs flex-1"></textarea>
                        <button @click="sendMsg" class="btn btn-success">发送</button>
                     </div>
                  </div>
               </template>
            </div>
         </div>
         <!-- 关闭窗口 -->
         <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
         </form>
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
import type { UserMessage } from "@/types/other";
import router from "@/router";

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
// 当前聊天的用户
const currentChatUser = ref<User>();
// 隐藏用户列表 flag
const hideUserList = ref(false);
// 在线用户列表
const onlineList = ref<User[]>([])
// 班级成员列表
const classesUserList = ref<User[]>([])
// 计算属性：在线用户列表和班级成员列表的合并
const userListMerge = computed(() => {
   let data = _.uniqBy(onlineList.value.concat(classesUserList.value), "id")
   // 排除自己
   data = data.filter(u => u.id != userStore.userInfo!.id)
   return data
})
// 计算属性：与当前选中用户的聊天信息
const targetChat = computed(() => {
   // 滚动到底部
   setTimeout(() => {
      let chatBox = document.querySelector(".chatBox") as HTMLDivElement;
      chatBox.scrollTop = chatBox.scrollHeight
   }, 100);
   return chatContent.value.filter(item => {
      return item.receiverId == currentChatUser.value!.id || item.senderId == currentChatUser.value!.id
   })
})
// 聊天内容输入框
const inputMsg = ref("")
// 聊天内容 (总)
const chatContent = ref<UserMessage[]>([]);
// 未读消息对象
const unreadMsgObj = ref({

})


if (userStore.userInfo) {
   // 添加自己到在线用户列表中
   // onlineList.value.push(userStore.userInfo)
   // 连接
   socketStore.connect(userStore.userInfo.id)
   // 获取班级成员
   getUserListByCid(userStore.userInfo.classes!.id!)
} else {
   MyUtils.alert("请先登录")
   router.push("/login")
}


// 选择用户事件
function selectUser(user: User) {
   currentChatUser.value = JSON.parse(JSON.stringify(user))
   // // 关闭用户列表
   hideUserList.value = true
   // 拉取历史聊天记录
   getChatRecord()
}
// 接收聊天消息 处理
socketStore.socket?.addEventListener("message", (e) => {
   let userMessage = JSON.parse(e.data) as UserMessage;
   if (userMessage.type == 0) {
      console.log("[online-windows] 收到消息:", userMessage.message);
      chatContent.value.push(userMessage)

      // 聊天窗口已打开就不在提示
      // dialog 原生组件中有属性 open 来控制弹窗的显示与隐藏
      let dialog = document.querySelector("#onlineBox") as HTMLDialogElement;
      if (!dialog.open) {
         socketStore.receiveMsgNotification()
      }
   }
});

// 获取指定聊天记录
async function getChatRecord() {
   if (userStore.userInfo?.id && currentChatUser.value?.id) {
      let result = await UserAPI.getChatRecordList(userStore.userInfo.id, currentChatUser.value.id)
      if (result.code == 20000) {
         chatContent.value.push(...result.data)
      }
   } else {
      console.log("用户未登录或未选择聊天对象");
   }
}

// 发送消息
async function sendMsg() {
   if (currentChatUser.value) {
      let userMessage: UserMessage = {
         id: 0,
         senderId: userStore.userInfo!.id,
         receiverId: currentChatUser.value.id,
         message: inputMsg.value,
         timestamp: new Date(),
         is_read: 1,
         type: 0
      }
      socketStore.send(userMessage)
      // 清空输入框
      inputMsg.value = ""
      // 添加到聊天记录
      chatContent.value.push(userMessage)
   } else {
      MyUtils.alert("请选择用户")
   }
}
// 获取班级成员列表
async function getUserListByCid(cid: string) {
   let result = await UserAPI.getUserListByCid(cid)
   if (result.code == 20000) {
      classesUserList.value = result.data
   }
}

watch(
   // 监听在线用户列表变化
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

<style lang="less" scoped>
.myActive {
   background-color: oklch(var(--b2));
   border: 1px solid oklch(var(--p));
}
</style>