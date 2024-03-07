import type { SocketMessageVo } from "@/types/other";
import { defineStore } from "pinia";
import { ref, h, render } from "vue";
import { useUserStore } from "./userStore";
import MyNotification from "@/components/MyNotification.vue"

export const useSocketStore = defineStore("socket", () => {
   const socket = ref<WebSocket | null>(null);
   const onlineUidList = ref<string[]>([]);

   // 连接
   function connect(uid: string | number) {
      if (socket.value != null) return; // 已连接，直接返回
      socket.value = new WebSocket("ws://localhost:8080/webSocket/" + uid)

      socket.value.onopen = () => {
         console.log("连接成功:" + uid);
      }
      socket.value.onmessage = (event) => {
         console.log("[socket-store 主程序] 收到消息：", JSON.parse(event.data));
         let data: SocketMessageVo = JSON.parse(event.data);
         // 在线用户列表
         if (data.type == 3) onlineUidList.value = JSON.parse(data.message);
      }
      socket.value.onerror = (event) => {
         console.log("连接失败：", event);
      }
      socket.value.onclose = (event) => {
         console.log("连接关闭：", event);
      }
   }
   // 关闭连接
   function close() {
      if (socket.value) socket.value.close();
   }
   // 发送消息
   function send(data: SocketMessageVo) {
      let userStore = useUserStore();
      data.sender_id = userStore.userInfo!.id;
      socket.value?.send(JSON.stringify(data));
   }
   // 来信息的全局通知
   function receiveMsgNotification() {
      // 创建虚拟dom
      let nodeDom = h(MyNotification);
      // 创建真实dom 
      let tempDiv = document.createElement("div");
      // 挂载到页面
      document.body.appendChild(tempDiv);
      // 渲染虚拟dom到页面
      render(nodeDom, tempDiv);
   }

   return {
      connect,
      close,
      socket,
      send,
      onlineUidList,
      receiveMsgNotification
   }
});