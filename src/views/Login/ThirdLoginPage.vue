<template>
   <div class="thirdLogin-box size-full grid place-content-center">
      <!-- 对话窗口容器 -->
      <div class="w-[730px] h-[500px] shadow-tce-shadow rounded-xl  text-white relative overflow-hidden bg-slate-800">
         <!-- 标题 -->
         <h1 class="text-center text-2xl font-bold mt-8">第三方账号绑定</h1>
         <!-- 双方图标 -->
         <div class="flex my-5 justify-center gap-12">
            <!-- 对方 -->
            <div class=" flex items-center">
               <div class="avatar">
                  <!--  ring ring-white -->
                  <div class="w-[72px] p-1 rounded-full bg-white ring ring-gray-300">
                     <img :src="`/logo/${oAuthType.toLocaleLowerCase()}-logo.svg`" />
                  </div>
               </div>
            </div>
            <!-- 连接图标 -->
            <div class="grid place-items-center">
               <p class="text-7xl bg-gradient-to-r">♾️</p>
            </div>
            <!-- 我方 -->
            <div class=" flex items-center">
               <div class="avatar">
                  <div class="w-[72px] p-1 rounded-full bg-white ring ring-gray-300">
                     <img src="/douyinemoji/cde766dbded94bab8cac6f71e9690bc1.png" />
                  </div>
               </div>
            </div>
         </div>
         <!-- 说明 -->
         <p class="text-center">你已通过 <span class="font-bold">{{ oAuthType }}</span> 授权，完善以下信息以继续</p>
         <!-- 表单 -->
         <a-form ref="bindUserFormRef" :model="bindUserForm">
            <div class="grid place-content-center mt-5 text-base-content">
               <a-form-item name="username" :rules="[{ required: true, message: '请输入您的用户名!' }]">
                  <input v-model="bindUserForm.username" type="text" placeholder="用户名"
                     class="input input-bordered input-md w-[350px]" />
               </a-form-item>
               <a-form-item name="password" :rules="[{ required: true, message: '请输入您的密码!' }]">
                  <input v-model="bindUserForm.password" type="password" placeholder="密码"
                     class="input input-bordered input-md w-[350px]" />
               </a-form-item>
            </div>
         </a-form>
         <!-- 按钮 -->
         <div class="grid place-content-center gap-2">
            <button @click="bindLocalUserHandler" :class="`btn btn-primary text-white w-[350px] ${bindLoading ? 'pointer-events-none' : ''}`">
               <span v-if="bindLoading" class="loading loading-spinner loading-md"></span>
               <span>{{ bindLoading ? '处理中' : '绑定已有账号并登录' }}</span>
            </button>
            <button onclick="verifyModal.showModal()" class="btn btn-success text-white w-[350px]">使用你的 {{ oAuthType }}
               用户信息注册并登录</button>
         </div>
      </div>

      <!-- 直接注册确认信息对话框 -->
      <!-- Open the modal using ID.showModal() method -->
      <dialog id="verifyModal" class="modal">
         <div class="modal-box">
            <h3 class="font-bold text-lg">确认你的信息</h3>
            <div class="min-h-[350px]">
               <!-- 头像 -->
               <div class="flex justify-center p-5">
                  <div class="avatar">
                     <div class="w-[68px] rounded-full bg-white ring ring-gray-300">
                        <img :src="oAuthUserData.avatar" />
                     </div>
                  </div>
               </div>
               <!-- 表单 -->
               <a-form ref="registerFormRef" :rules="rules" :model="oAuthUserData" :label-col="{ span: 5 }"
                  :wrapper-col="{ span: 16 }">
                  <a-form-item label="用户名" name="username" :rules="{ required: true, message: '请输入用户名' }">
                     <input v-model="oAuthUserData.username" class="input input-bordered input-sm w-full" type="text">
                  </a-form-item>
                  <a-form-item label="密码" name="password" :rules="{ required: true, message: '请输入密码' }">
                     <input v-model="oAuthUserData.password" class="input input-bordered input-sm w-full"
                        type="password">
                  </a-form-item>
                  <a-form-item label="确认密码" name="passwordConfirm">
                     <input v-model="oAuthUserData.passwordConfirm" class="input input-bordered input-sm w-full"
                        type="password">
                  </a-form-item>
                  <a-form-item label="邮箱">
                     <input v-model="oAuthUserData.email" class="input input-bordered input-sm w-full" type="text">
                  </a-form-item>
               </a-form>
               <!-- <span>数据来自</span> -->

               <Transition name="fade">
                  <!-- 错误信息 -->
                  <div role="alert" class="alert alert-error" v-show="errorMessage">
                     <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                           d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                     </svg>
                     <span>{{ errorMessage }}</span>
                  </div>
               </Transition>

            </div>
            <div class="modal-action">
               <form method="dialog" class="flex gap-2">
                  <button :class="`btn ${registerLoading ? 'btn-disabled' : ''}`">取消</button>
                  <button @click.prevent="registerOAuthUserHandler" :class="`btn btn-primary ${registerLoading ? 'btn-disabled' : ''}`">
                     <span v-if="registerLoading" class="loading loading-spinner loading-md"></span>
                     <span>{{ registerLoading ? '处理中' : '确定' }}</span>
                  </button>
               </form>
            </div>
         </div>
      </dialog>
   </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { OtherAPI } from "@/api/other";
import { UserAPI } from "@/api/user";
import { ref } from "vue";
import type { User } from "@/types/user";
import type { FormExpose } from "ant-design-vue/es/form/Form";
import { MyUtils } from "@/utils";
import { useSocketStore } from "@/stores/socketStore";
import { useUserStore } from "@/stores/userStore";
import router from "@/router";
import type { GiteeUser, GithubUser, OAuthLoginType } from "@/types/other";
import type { Rule } from "ant-design-vue/es/form";

const userStore = useUserStore();

// 用于绑定的第三方登录类型和 key
const oAuthType = useRoute().query.type as OAuthLoginType;
const oAuthKey = useRoute().query.okey as string;

// 绑定本地用户表单数据
const bindUserForm = ref<User>({
   email: "",
   // mobile: "",
   username: "",
   password: "",
   avatar: "",
   sex: "",
   id: "",
   createTime: ""
});
// 第三方用户数据
const oAuthUserData = ref({
   username: "",
   avatar: "",
   email: "",
   password: "",
   passwordConfirm: ""
})

// 绑定本地用户表单实例
const bindUserFormRef = ref<FormExpose | null>(null);
// 注册表单实例
const registerFormRef = ref<FormExpose | null>(null);
// 错误信息
const errorMessage = ref<string>("");
// 错误信息定时器
const errorMessageTimer = ref<number | null>(null);
// 确定绑定 loading
const bindLoading = ref<boolean>(false);
// 确定注册 loading
const registerLoading = ref<boolean>(false);


// 获取第三方登录用户信息
getOAuthUserDataHandler()




// 执行注册
async function registerOAuthUserHandler() {
   try {
      registerLoading.value = true;
      await registerFormRef.value?.validate(); // 表单验证
      let result = await UserAPI.oAuthRegisterLogin(oAuthUserData.value, oAuthKey, oAuthType)
      console.log(result);
      if (result.code == 20000) {
         // 注册成功  跳转
         userStore.setUserInfo(result.data, result.other.token); // 保存用户信息
         MyUtils.alert("注册成功", "success"); // 提示登录成功
         // 初始化 socketStore 连接
         useSocketStore().connect(result.data.id);
         // 跳转到首页
         router.push("/user");
      } else {
         // MyUtils.alert(result.message, "error")
         errorMessage.value = result.message;
         // 清除定时器
         if (errorMessageTimer.value) {
            clearTimeout(errorMessageTimer.value);
         }
         // 设置定时器
         errorMessageTimer.value = setTimeout(() => {
            errorMessage.value = "";
         }, 3000)
      }
   } catch (error) {
      console.log(error);
   } finally {
      registerLoading.value = false;
   }
}

// 执行绑定
async function bindLocalUserHandler() {
   try {
      bindLoading.value = true;
      // 表单验证
      await bindUserFormRef.value?.validate();
      let result = await UserAPI.oAuthBind(bindUserForm.value, oAuthKey, oAuthType)
      if (result.code == 20000) {
         userStore.setUserInfo(result.data, result.other.token); // 保存用户信息
         MyUtils.alert("登录成功", "success"); // 提示登录成功
         // 初始化 socketStore 连接
         useSocketStore().connect(result.data.id);
         // 跳转到首页
         router.push("/user");
      } else {
         MyUtils.alert(result.message, "error")
      }

   } catch (error) {
      console.log(error);
   } finally {
      bindLoading.value = false;
   }

}

// 获取第三方登录用户信息程序
async function getOAuthUserDataHandler() {
   let result = await OtherAPI.getOAuthUserData(oAuthKey, oAuthType)
   console.log('授权用户信息', result.data);
   if (result.code == 20000) {
      if (oAuthType.toLocaleUpperCase() == "GITHUB") {
         let githubUser = result.data as GithubUser
         oAuthUserData.value.avatar = githubUser.avatar_url
         oAuthUserData.value.email = githubUser.email || ''
         oAuthUserData.value.username = githubUser.login
      } else if (oAuthType.toLocaleUpperCase() == "GITEE") {
         let giteeUser = result.data as GiteeUser
         oAuthUserData.value.avatar = giteeUser.avatar_url
         oAuthUserData.value.email = giteeUser.email || ''
         oAuthUserData.value.username = giteeUser.login
      } else {
         console.log("未知的第三方登录类型");
      }
   } else {
      MyUtils.alert(result.message, "error")
   }
}

const validatePass2 = async (_rule: Rule, value: string) => {
   if (value === '') {
      return Promise.reject('请重新输入密码');
   } else if (value !== oAuthUserData.value.password) {
      return Promise.reject("两次输入不匹配!");
   } else {
      return Promise.resolve();
   }
};
const rules: Record<string, Rule[]> = {
   passwordConfirm: [{ validator: validatePass2, trigger: 'change', required: true }]
};
</script>

<style>
.thirdLogin-box {
   background-image: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);
}

/* 文字渐变 */
.bg-gradient-to-r {
   /* 应用背景裁剪到文本 */
   -webkit-background-clip: text;
   /* 将文本颜色设置为透明，以显示背景渐变 */
   -webkit-text-fill-color: transparent;

   /* 无缝效果 */
   background-image: linear-gradient(to right, indigo, violet, red, orange, yellow, indigo, violet);
   /* 设置足够大的背景尺寸，确保无缝循环 */
   background-size: 600% 100%;

   /* 无限循环动画 */
   animation: text-gradient-animation 5s linear infinite;
}

@keyframes text-gradient-animation {
   from {
      background-position: 100% 50%;
   }

   to {
      background-position: 0% 50%;
   }
}

.fade-enter-active,
.fade-leave-active {
   transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
   opacity: 0;
}

</style>