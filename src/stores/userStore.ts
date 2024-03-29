import type { User } from "@/types/user";
import { defineStore } from "pinia";
import { ref } from "vue";

// 组合式 API
// ref() 就是 state 属性
// computed() 就是 getters
// function() 就是 actions

export const useUserStore = defineStore("userStore", () => {
   // state
   const userInfo = ref<User>();
   const token = ref<string>();

   // actions
   function setUserInfo(userInfoVo: User, tokenVo: string) {
      userInfo.value = userInfoVo;
      token.value = tokenVo;
   };
   function delUser(){
      userInfo.value = undefined;
      token.value = undefined;
   }
   //


   // getters
   

   return {
      userInfo,
      token,
      setUserInfo,
      delUser,
   }
}, { persist: true });