import type { UserMessage } from "@/types/other";
import { defineStore } from "pinia";
import { ref, h, render } from "vue";
import { useUserStore } from "./userStore";
import MyNotification from "@/components/MyNotification.vue"
import { UserAPI } from "@/api/user";

export const useSocketStore = defineStore("socket", () => {
   // socket 对象
   const socket = ref<WebSocket | null>(null);
   // 在线用户的uid列表
   const onlineUidList = ref<string[]>([]);
   // 未读消息
   const unreadMessage = ref<UserMessage[]>([]);
   // 聊天窗口的显示
   const chatWindowShow = ref(false);

   // 连接
   function connect(uid: string | number) {
      if (socket.value != null) return; // 已连接，直接返回
      socket.value = new WebSocket(`ws://${import.meta.env.VITE_BASE_URL}}/webSocket/` + uid)
      // socket.value = new WebSocket("ws://localhost:8080/webSocket/" + uid)

      socket.value.onopen = async () => {
         console.log("[socket-store 主程序] 连接成功:" + uid);

         // 【用户登录未读消息的提示】
         await overallSituationUnreadMsgHandler();
         if (unreadMessage.value.length > 0) {
            setTimeout(() => {
               receiveMsgNotification("您有" + unreadMessage.value.length + "条未读消息，请注意查收！", 8000);
            }, 1000);
         }
      }
      socket.value.onmessage = (event) => {
         let userMessage: UserMessage = JSON.parse(event.data);
         console.log("[socket-store 主程序] 收到消息：", userMessage);
         // 在线用户列表
         if (userMessage.type == 3) onlineUidList.value = JSON.parse(userMessage.message);
      }
      socket.value.onerror = (event) => {
         console.log("[socket-store 主程序] 连接失败");
      }
      socket.value.onclose = (event) => {
         console.log("[socket-store 主程序] 连接断开");
         socket.value = null;
         // 用户是否登录
         let userStore = useUserStore();
         if (userStore.token) {
            console.log("[socket-store 主程序] 将在5秒后尝试重新连接");
            setTimeout(() => {
               connect(userStore.userInfo!.id);
            }, 5000);
         }

      }
   }
   // 关闭连接
   function close() {
      if (socket.value) socket.value.close();
   }
   // 发送消息
   function send(userMessage: UserMessage) {
      let userStore = useUserStore();
      userMessage.senderId = userStore.userInfo!.id;
      socket.value?.send(JSON.stringify(userMessage));
   }
   // 来信息的全局通知
   function receiveMsgNotification(message?: string, duration?: number) {
      // 创建虚拟dom
      let nodeDom = h(MyNotification, { message, duration });
      // 创建真实dom 
      let tempDiv = document.createElement("div");
      // 挂载到页面
      document.body.appendChild(tempDiv);
      // 渲染虚拟dom到页面
      render(nodeDom, tempDiv);
   }
   // 全局的未读消息处理提示
   async function overallSituationUnreadMsgHandler() {
      let userStore = useUserStore();
      let result = await UserAPI.getUnreadMessage(userStore.userInfo!.id);
      if (result.code == 20000) {
         // console.log("[socket-store 主程序] 获取未读消息成功：", result.data.length);
         unreadMessage.value = result.data;
      }
   }


   return {
      connect,
      close,
      socket,
      send,
      onlineUidList,
      receiveMsgNotification,
      unreadMessage,
      overallSituationUnreadMsgHandler,
      chatWindowShow
   }
});