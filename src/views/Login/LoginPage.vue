<template>
  <div class="login-container h-[100%] grid place-items-center 
              bg-gradient-to-tl from-[#89f7fe] to-[#66a6ff]">
    <!-- 登录框体 -->
    <div class="w-[730px] h-[500px] shadow-tce-shadow rounded-xl flex 
              text-white relative overflow-hidden bg-slate-800">
      <!-- 模糊背景 -->
      <div class="absolute w-full h-full bg-no-repeat
       bg-[length:500px] bg-[100px] blur-[70px]" :style="`background-image: url(src/assets/img/${imgName});`"></div>
      <!-- 图片 -->
      <div class="flex-1 p-2" :class="isRegister ? 'toRight' : 'toRight-back'">
        <div class="w-full h-full rounded-lg relative bg-[#fff]">
          <img :src="`src/assets/img/${imgName}`" class="absolute 
            top-1/2 -translate-y-1/2 scale-110" />
        </div>
      </div>
      <!-- 表单 -->
      <div :class="isRegister ? 'toLeft' : 'toLeft-back pt-20'"
        class="w-[350px] flex flex-wrap content-center p-5 z-10 relative">
        <span class="absolute left-1/2 -translate-x-1/2 top-[50px]">LOGO ICON</span>
        <p v-if="!isRegister" class="font-bold text-2xl w-[100%]">欢迎回来，{{ formState.username }}</p>
        <p v-else class="font-bold text-2xl w-[100%]">Hi！新朋友，{{ formState.username }}</p>

        <AForm :model="formState" class="w-[100%] mt-5" autocomplete="off" @finish="onFinish">
          <AFormItem name="username" :rules="[{ message: '请输入您的用户名!', required: true }]">
            <input placeholder="用户名" v-model="formState.username" type="text"
              class="input input-bordered w-full max-w-xs" />
          </AFormItem>

          <AFormItem name="password" :rules="[{ message: '请输入您的密码!', required: true }]">
            <input placeholder="密码" v-model="formState.password" type="password"
              class="input input-bordered w-full max-w-xs" />
          </AFormItem>

          <AFormItem>
            <a-button :loading="loading" type="primary" html-type="submit" class="btn submit-btn w-full rounded-lg">{{
              isRegister ? "注册" : "登录" }}</a-button>
          </AFormItem>
        </AForm>
        <!-- OAuth 登录 -->
        <template v-if="!isRegister">
          <span class="w-full text-right">
            <span class="text-xs hover:text-blue-400 cursor-pointer" @click="isRegister = !isRegister">注册账号</span>
          </span>
          <div class="divider text-white w-full">社交登录</div>
          <div class="flex justify-center gap-1">
            <a-button type="primary" class="btn social-btn rounded-lg">
              😋QQ
            </a-button>
            <a-button type="primary" class="btn social-btn rounded-lg">
              😋QQ
            </a-button>
          </div>
        </template>
        <template v-else>
          <span class="text-xs w-full text-right">
            <span class="hover:text-blue-500 cursor-pointer" @click="isRegister = !isRegister">已有账号？</span>
          </span>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import { UserAPI } from "@/api/user";
import { message } from "ant-design-vue/es";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "@/stores/userStore";
import { useSocketStore } from "@/stores/socketStore";

const route = useRoute();
const userStore = useUserStore();
const router = useRouter();
const formState = reactive({
  username: "admin",
  password: "114514",
});
// 登录 loading
const loading = ref(false);
// 是否注册
const isRegister = ref(false);
// 显示的图片
const imgName = ref("读书.png")


const onFinish = async (loginUser: { username: string, password: string }) => {
  loading.value = true;
  if (isRegister.value) {
    message.warning("todo 注册功能待开发");
    loading.value = false;
  } else {
    let loginResult = await UserAPI.login(loginUser.username, loginUser.password);
    loading.value = false;
    if (loginResult.code === 20000) {
      userStore.setUserInfo(loginResult.data, loginResult.other.token); // 保存用户信息
      localStorage.setItem("token", loginResult.other.token); // 保存token
      message.success("登录成功"); // 提示登录成功
      // 初始化 socketStore 连接
      useSocketStore().connect(loginResult.data.id);

      // 如果有 returnUrl 参数则跳转到 returnUrl 参数指定的页面
      if (route.query.returnUrl) {
        router.push(route.query.returnUrl as string);
      } else {
        router.push("/"); // 跳转到首页
      }
    } else {
      // 提示登录失败
      message.error(loginResult.message);
    }
  }
};

watch(isRegister, () => {
  imgName.value = isRegister.value ? "工作.png" : "读书.png";
  // console.log(imgName.value);
})
</script>

<style lang="less" scoped>
/* CSS */
.submit-btn {
  align-items: center;
  appearance: none;
  background-color: #3EB2FD;
  background-image: linear-gradient(1deg, #4F58FD, #149BF3 99%);
  background-size: calc(100% + 20px) calc(100% + 20px);
  border-width: 0;
  box-shadow: none;
  box-sizing: border-box;
  color: #FFFFFF;
  cursor: pointer;
  display: inline-flex;
  font-family: CircularStd, sans-serif;
  font-size: 1rem;
  height: auto;
  justify-content: center;
  line-height: 1.5;
  padding: 6px 20px;
  position: relative;
  text-align: center;
  text-decoration: none;
  transition: background-color .2s, background-position .2s;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  vertical-align: top;
  white-space: nowrap;
}

.button-21:active,
.button-21:focus {
  outline: none;
}

.button-21:hover {
  background-position: -20px -20px;
}

.button-21:focus:not(:active) {
  box-shadow: rgba(40, 170, 255, 0.25) 0 0 0 .125em;
}

.toRight {
  animation: to-right .3s forwards;
}

.toRight-back {
  animation: to-right-back .3s forwards;
}

@keyframes to-right {
  0% {
    transform: translateX(0);
  }

  100% {
    transform: translateX(350px);
  }
}

@keyframes to-right-back {
  0% {
    transform: translateX(350px);
  }

  100% {
    transform: translateX(0);
  }
}


.toLeft {
  animation: to-left .3s forwards;
}

.toLeft-back {
  animation: to-left-back .3s forwards;
}

@keyframes to-left {
  0% {
    transform: translateX(0);
  }

  100% {
    transform: translateX(-380px);
  }
}

@keyframes to-left-back {
  0% {
    transform: translateX(-380px);
  }

  100% {
    transform: translateX(0);
  }
}
</style>