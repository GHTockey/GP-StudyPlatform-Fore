import type { UserInfo } from "@/types/user";
import { defineStore } from "pinia";
import { ref } from "vue";

// 组合式 API
// ref() 就是 state 属性
// computed() 就是 getters
// function() 就是 actions

export const useUserStore = defineStore("userStore", () => {
   // state
   const userInfo = ref<UserInfo>();
   const token = ref<string>();

   // actions
   function setUserInfo(userInfoVo: UserInfo, tokenVo: string) {
      userInfo.value = userInfoVo;
      token.value = tokenVo;
   }


   // getters
   

   return {
      userInfo,
      token,
      setUserInfo,
   }
}, { persist: true });