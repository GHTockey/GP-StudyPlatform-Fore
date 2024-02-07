<template>
  <div class="login-container h-[100%] 
              grid place-items-center 
              ">
    <!-- bg-gradient-to-tl from-[#89f7fe] to-[#66a6ff] -->
    <!-- 登录框 -->
    <div class="w-[760px] h-[500px] shadow-tce-shadow rounded-xl flex bg-slate-800 text-white">
      <!-- 图片 -->
      <div class="flex-1 border border-green-500">图片</div>
      <!-- 表单 -->
      <div class=" w-[330px] flex flex-wrap content-center p-5">

        <p class="font-bold text-2xl w-[100%]">Login</p>

        <AForm :model="formState" layout="vertical" class="w-[100%] text-color" autocomplete="off" @finish="onFinish">
          <AFormItem style="color: aliceblue;" label="用户" name="username"
            :rules="[{ message: '请输入您的用户名!', required: true }]">
            <AInput v-model:value="formState.username" />
          </AFormItem>

          <AFormItem label="密码" name="password" :rules="[{ message: '请输入您的密码!', required: true }]">
            <AInputPassword v-model:value="formState.password" />
          </AFormItem>

          <AFormItem>
            <button class="submit-btn rounded-xl w-[80px]">登录</button>
          </AFormItem>
        </AForm>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { login as loginAPI } from "@/api/user";
import { message } from "ant-design-vue/es";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "@/stores/userStore";

const route = useRoute();
const userStore = useUserStore();
const router = useRouter();
const formState = reactive({
  username: "admin",
  password: "114514",
});

const onFinish = async (loginUser: { username: string, password: string }) => {
  let loginResult = await loginAPI(loginUser);
  if (loginResult.code === 20000) {
    userStore.setUserInfo(loginResult.data, loginResult.other.token); // 保存用户信息
    localStorage.setItem("token", loginResult.other.token); // 保存token
    message.success("登录成功"); // 提示登录成功
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
};
</script>

<style lang="less" scoped>
.text-color>div>div>label {
  color: aliceblue;
}

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
</style>