<template>
   <!-- 聊天窗口 -->
   <dialog id="onlineBox" class="modal" @close="currentChatUser = undefined; hideUserList = false;">
      <div class="modal-box max-w-[1000px] min-h-[300px]">
         <h3 class="font-bold text-lg mb-3">OnlineChat
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
               <!-- 项 -->
               <div v-for="(item, index) in userListMerge" :key="index" class="bg-base-200/50 transition-all rounded-lg h-[60px] flex items-center justify-between
             mb-1 hover:bg-base-200 cursor-pointer border border-transparent" @click="selectUser(item);"
                  :class="{ 'myActive': currentChatUser?.id == item.id }">
                  <!-- 头像 -->
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
                     <!-- <div class="badge badge-error">1</div> -->
                     <div v-if="unreadMsgObj[item.id]" class="badge badge-error">{{ unreadMsgObj[item.id] }}</div>
                  </div>
               </div>

            </div>
            <!-- 聊天盒 -->
            <div class="flex-1 px-2 flex flex-col">
               <!-- 未选择显示 -->
               <div v-if="!currentChatUser" class="flex flex-wrap content-center justify-center size-full">
                  <img class=" max-w-[300px]" src="../assets/img//select-u.svg">
                  <p class="text-center w-full text-gray-500">请选择用户</p>
               </div>
               <template v-else>
                  <!-- 聊天记录内容 -->
                  <div class="chatBox flex-1 overflow-y-auto">
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
                        <div v-if="item.senderId != currentChatUser.id" class="chat-footer opacity-50">
                           <!-- {{ item.timestamp }} -->
                           {{ item.isRead == 0 ? "已读" : "未读" }}
                        </div>
                     </div>
                  </div>
                  <!-- 输入消息框 -->
                  <div class="flex flex-wrap mb-2">
                     <!-- 离线提示 -->
                     <div v-show="!targetUserStatus"
                        class="flex justify-center items-center gap-2 p-2 w-full text-orange-400">
                        <IconFont type="icon-jinggao" />
                        <span class="text-sm">对方处于离线状态，您发送的消息将会在对方上线后进行推送</span>
                     </div>
                     <div id="imgBox" class="bg-pink-500 w-full h-[100px] flex overflow-x-auto">
                     </div>
                     <!-- 按钮 -->
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
                        <button class="btn btn-xs btn-circle">
                           <IconFont type="icon-lianjie" />
                        </button>
                     </div>
                     <!-- 输入框 -->
                     <div class="flex w-full mt-2 gap-2">
                        <textarea v-model="inputMsg" rows="2" placeholder="输入消息" @paste="pasteHandler"
                           class="textarea bg-base-200 textarea-xs flex-1" @keydown.enter="sendMsg"></textarea>
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
import { ref, watch, computed, onBeforeUnmount } from "vue";
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
console.log("online-window 程序已加载");
onBeforeUnmount(() => {
   console.log("online-window 程序已卸载");
   // 关闭连接
   socketStore.close()
})
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
   });
   return chatContent.value.filter(item => {
      return item.receiverId == currentChatUser.value!.id && item.senderId == userStore.userInfo!.id
         || item.receiverId == userStore.userInfo!.id && item.senderId == currentChatUser.value!.id
   })
})
// 计算属性：当前选中用户的状态
const targetUserStatus = computed(() => {
   return onlineUidList.value.includes(currentChatUser.value!.id)
})
// 聊天内容输入框
const inputMsg = ref("")
// 聊天内容 (总)
const chatContent = ref<UserMessage[]>([]);
// 未读消息对象
const unreadMsgObj = ref<{ [key: string]: number }>({})


if (userStore.userInfo) {
   // 添加自己到在线用户列表中
   // onlineList.value.push(userStore.userInfo)
   // 连接
   socketStore.connect(userStore.userInfo.id)
   // 获取班级成员
   getUserListByCid(userStore.userInfo.classes!.id!)
   // 获取未读消息
   getUnreadMsg()
} else {
   MyUtils.alert("请先登录")
   router.push("/login")
}



// 输入框粘贴事件
function pasteHandler(e: ClipboardEvent) {
   let clipboardData = e.clipboardData; //获取粘贴板数据
   // 获取粘贴板文本
   // let text = clipboardData?.getData("text");
   // console.log(text);
   // 文件对象
   let files = clipboardData?.files;
   if (files?.length && files[0].type.includes("image")) {
      console.log(files);
      // // 转为 img 标签
      // let img = document.createElement("img");
      // img.src = URL.createObjectURL(files[0]);
      // img.style.width = "100px";
      // img.style.height = "100px";
      // // 插入到输入框
      // let textarea = e.target as HTMLTextAreaElement;
      // textarea.value += img.outerHTML;

      // img 
      let img = new Image();
      let reader = new FileReader();
      reader.onload = function (e) {
         img.src = e.target?.result as string;
      }
      reader.readAsDataURL(files[0]);
      // 插入到元素
      let imgBox = document.getElementById("imgBox") as HTMLDivElement;
      img.style.width = "100px";
      imgBox.appendChild(img);



   }
}
// 选择用户事件
async function selectUser(user: User) {
   currentChatUser.value = JSON.parse(JSON.stringify(user))
   // // 关闭用户列表
   hideUserList.value = true
   // 拉取历史聊天记录
   getChatRecord()
   // 将当前用户的消息设置为已读
   // console.log(unreadMsgObj.value);
   if (unreadMsgObj.value[user.id] > 0) {
      await UserAPI.markChatRecordAsRead(user.id, userStore.userInfo!.id)
      // 清空未读消息数
      unreadMsgObj.value[user.id] = 0
      await socketStore.overallSituationUnreadMsgHandler()
   }
}
// 接收聊天消息 【处理】
socketStore.socket?.addEventListener("message", (e) => {
   let userMessage = JSON.parse(e.data) as UserMessage;
   // 【私聊消息】
   if (userMessage.type == 0) {
      console.log("[online-windows] 收到消息:", userMessage.message);
      chatContent.value.push(userMessage)

      // // 通知获取消息
      if (currentChatUser.value) getChatRecord()

      // 【通知提示】 聊天窗口已打开就不再提示
      // dialog 原生组件中有属性 open 来控制弹窗的显示与隐藏
      let dialog = document.querySelector("#onlineBox") as HTMLDialogElement;
      if (!dialog.open) {
         socketStore.receiveMsgNotification()
      }

      // 将当前用户的消息设置为已读
      if (currentChatUser.value?.id == userMessage.senderId) {
         UserAPI.markChatRecordAsRead(userMessage.senderId, userStore.userInfo!.id)
      }

      // 【未读消息程序】
      if (currentChatUser.value?.id != userMessage.senderId) { // 当前信息不是当前聊天对象发送的
         // 未读消息数 +1
         if (unreadMsgObj.value[userMessage.senderId]) {
            unreadMsgObj.value[userMessage.senderId]++
         } else {
            // 不存在则添加
            unreadMsgObj.value[userMessage.senderId] = 1
         }
         // 通知未读消息数变化
         socketStore.overallSituationUnreadMsgHandler()
      }
   }
   // 【已读反馈】
   if (userMessage.type == 4) {
      let data: { msg: string, id: number } = JSON.parse(userMessage.message)
      // 
      getChatRecord()
   }
});

// 获取聊天记录
async function getChatRecord() {
   if (userStore.userInfo?.id && currentChatUser.value?.id) {
      let result = await UserAPI.getChatRecordList(userStore.userInfo.id, currentChatUser.value.id)
      if (result.code == 20000) {
         chatContent.value.push(...result.data)
         // 去重 (因为在发送时有添加到 chatContent 中，在获取时会和数据库中的重复)
         // chatContent.value = _.uniqBy(chatContent.value, "id")
         // 去重排序 (因为数据会和本地数据合并引发顺序问题)
         chatContent.value = _.sortBy(_.uniqBy(chatContent.value, "id"), "id")
         // chatContent.value = _.sortedUniqBy(chatContent.value, "id")
      }
   } else {
      console.log("用户未登录或未选择聊天对象");
   }
}

// 发送消息
async function sendMsg() {
   // 去除回车
   inputMsg.value = inputMsg.value.replace(/\n/g, "")
   if (inputMsg.value == "") return;
   if (currentChatUser.value) {
      let userMessage: UserMessage = {
         id: 0,
         senderId: userStore.userInfo!.id,
         receiverId: currentChatUser.value.id,
         message: inputMsg.value,
         timestamp: new Date().toLocaleTimeString(), // 仅本地显示 后端会再次处理
         isRead: 1,
         type: 0
      }
      socketStore.send(userMessage)
      // 清空输入框
      inputMsg.value = ""
      // 添加到聊天记录到本地
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
// 获取未读消息
async function getUnreadMsg() {
   unreadMsgObj.value = {}
   let result = await UserAPI.getUnreadMessage(userStore.userInfo!.id)
   if (result.code == 20000) {
      let data = result.data
      // 未读消息数
      data.forEach((item: any) => {
         if (unreadMsgObj.value[item.senderId]) {
            unreadMsgObj.value[item.senderId]++
         } else {
            unreadMsgObj.value[item.senderId] = 1
         }
      });
      chatContent.value.push(...data)
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

// #imgBox > img {

// }</style>