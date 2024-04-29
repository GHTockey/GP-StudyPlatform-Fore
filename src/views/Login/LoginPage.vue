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
          <img :src="getAssetsImg(imgName)" class="absolute 
            top-1/2 -translate-y-1/2 scale-110" />
          <!-- <img :src="`src/assets/img/${imgName}`" class="absolute 
            top-1/2 -translate-y-1/2 scale-110" /> -->
        </div>
      </div>
      <!-- 表单 -->
      <div :class="isRegister ? 'toLeft' : 'toLeft-back pt-20'"
        class="w-[350px] flex flex-wrap content-center p-5 z-10 relative">
        <span class="absolute left-1/2 -translate-x-1/2 top-[0px]">
          <IconFont type="icon-logo" class="text-[100px]" />
        </span>
        <!-- <img :src="websiteStore.logoUrl" alt="logo" class="w-32 absolute top-8 left-1/2 -translate-x-1/2"> -->
        <p v-if="!isRegister" class="font-bold text-2xl w-[100%]">欢迎回来，{{ formState.username }}</p>
        <p v-else class="font-bold text-2xl mt-16 w-[100%]">Hi！新朋友，{{ registerForm.username }}</p>
        <!-- 登录表单 -->
        <AForm :model="formState" v-if="!isRegister" class="w-[100%] mt-5" autocomplete="off" @finish="login">
          <AFormItem name="username" :rules="[{ message: '请输入您的用户名!', required: true }]">
            <input placeholder="用户名" v-model="formState.username" type="text"
              class="input input-bordered w-full max-w-xs" />
          </AFormItem>
          <AFormItem name="password" :rules="[{ message: '请输入您的密码!', required: true }]">
            <input placeholder="密码" v-model="formState.password" type="password"
              class="input input-bordered w-full max-w-xs" />
          </AFormItem>
          <AFormItem>
            <a-button :loading="loading" type="primary" html-type="submit"
              class="btn submit-btn w-full rounded-lg">登录</a-button>
          </AFormItem>
        </AForm>
        <!-- 注册表单 -->
        <a-form :model="registerForm" @finish="register" v-else class="w-[100%] mt-2" autocomplete="off">
          <AFormItem name="username" :rules="formRules.registerUname">
            <input placeholder="用户名" v-model="registerForm.username" type="text"
              class="input input-sm input-bordered w-full max-w-xs" />
          </AFormItem>
          <AFormItem name="password" :rules="formRules.registerPwd">
            <input placeholder="密码" v-model="registerForm.password" type="password"
              class="input input-sm input-bordered w-full max-w-xs" />
          </AFormItem>
          <AFormItem name="password2" :rules="formRules.registerPwd2">
            <input placeholder="确认密码" v-model="registerForm.password2" type="password"
              class="input input-sm input-bordered w-full max-w-xs" />
          </AFormItem>
          <AFormItem name="email" :rules="formRules.registerEmail">
            <input placeholder="邮箱" v-model="registerForm.email" class="input input-sm input-bordered w-full max-w-xs" />
          </AFormItem>
          <AFormItem name="code" :rules="[{ message: '请输入验证码!', required: true }]">
            <div class="join w-full">
              <input placeholder="邮箱验证码" v-model="registerForm.code"
                class="input input-sm join-item input-bordered w-full max-w-xs" />
              <button @click.prevent="sendCode" class="btn btn-sm join-item w-26"
                :class="{ 'pointer-events-none': flags.sendCode == 'success' }">
                <template v-if="flags.sendCode == 'default'">发送验证码</template>
                <template v-else-if="flags.sendCode == 'loading'">
                  <span class="loading loading-spinner"></span>
                  发送中
                </template>
                <template v-else-if="flags.sendCode == 'success'">
                  {{ countDown }}秒后重发
                </template>
              </button>
            </div>
          </AFormItem>

          <AFormItem>
            <!-- html-type="submit" 默认事件触发表单验证 -->
            <a-button type="primary" html-type="submit" class="btn btn-sm submit-btn w-full rounded-lg">注册</a-button>
          </AFormItem>
        </a-form>

        <!-- OAuth 登录 -->
        <template v-if="!isRegister">
          <span class="w-full text-right">
            <span class="text-xs hover:text-blue-400 cursor-pointer" @click="isRegister = !isRegister">注册账号</span>
          </span>
          <div class="divider text-gray-200 w-full">联合登录</div>
          <div class="flex justify-center gap-1">
            <a-tooltip placement="top" title="GitHub 登录">
              <button @click="toThirdLogin('github')" class="btn">
                <IconFont type="icon-github" class="text-2xl" />
              </button>
            </a-tooltip>
            <a-tooltip placement="top" title="Gitee 登录">
              <button @click="toThirdLogin('gitee')" class="btn">
                <IconFont type="icon-gitee-fill-round" class="text-2xl" />
              </button>
            </a-tooltip>
            <a-tooltip placement="top" title="QQ 登录">
              <button class="btn">
                <IconFont type="icon-QQ" class="text-2xl" />
              </button>
            </a-tooltip>
            <a-tooltip placement="top" title="微信登录">
              <button class="btn">
                <IconFont type="icon-weixin" class="text-2xl" />
              </button>
            </a-tooltip>
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
import { OtherAPI } from "@/api/other";
import { message } from "ant-design-vue/es";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "@/stores/userStore";
import { useSocketStore } from "@/stores/socketStore";
import IconFont from "@/utils/iconFont";
import type { OAuthLoginType, RequestStatus } from "@/types/other";
import type { Rule, RuleObject } from "ant-design-vue/es/form";
import { MyUtils } from "@/utils";
import { useWebsiteStore } from "@/stores/websiteStore";

const websiteStore = useWebsiteStore();
const route = useRoute();
const userStore = useUserStore();
const router = useRouter();
// 登录表单数据
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
// 注册表单数据
const registerForm = ref({
  username: "",
  password: "",
  password2: "",
  email: "tockey@yeah.net",
  code: "",
});
// 开关
const flags = ref<{
  sendCode: RequestStatus,
}>({
  sendCode: 'default',
});
// 验证码发送倒计时
const countDown = ref(0);
// 表单校验规则
const formRules: { [temporary: string]: RuleObject[] | RuleObject } = {
  registerUname: [
    { message: '请输入您的用户名!', required: true },
    { min: 2, message: '最少输入两位' },
    { max: 12, message: '最多输入12位' }
  ],
  registerPwd: [
    { message: '请输入您的密码!', required: true },
    { min: 5, message: '最少输入5位' }
  ],
  registerPwd2: [{
    validator: async (_rule: Rule, value: string) => {
      if (value === '') {
        return Promise.reject('请输入确认密码');
      } else if (value !== registerForm.value.password) {
        return Promise.reject("两次输入不匹配!");
      } else {
        return Promise.resolve();
      }
    }
  }],
  registerEmail: [
    { message: '请输入您的邮箱!', required: true },
    { type: 'email', message: '请输入正确的邮箱格式' } // 组件内置的邮箱格式校验 (牛逼)
  ]
};




getWebsiteInfo();


// 获取图片路径
function getAssetsImg(name: string) {
  return new URL(`../../assets/img/${name}`, import.meta.url).href;
}


// 注册
async function register() {
  // console.log('register');
  let result = await UserAPI.register(registerForm.value);

  if (result.code === 20000) {
    MyUtils.alert(result.message, 'success', 5000);
    formState.username = registerForm.value.username;
    formState.password = '';
    registerForm.value = {
      username: '',
      password: '',
      password2: '',
      email: '',
      code: '',
    };
    isRegister.value = false;
  } else {
    MyUtils.alert(result.message, 'error');
  }
}
// 发送邮箱验证码
async function sendCode() {
  flags.value.sendCode = 'loading';
  let result = await OtherAPI.sendEmailCode(registerForm.value.email);
  // console.log(result);
  if (result.code == 20000) {
    MyUtils.alert(result.message, 'success', 5000);
    flags.value.sendCode = 'success';
    // 根据接口返回的过期时间计算倒计时
    let expireTime = new Date(result.data);
    countDown.value = Math.floor((expireTime.getTime() - new Date().getTime()) / 1000);
    // 倒计时
    let timer = setInterval(() => {
      countDown.value--;
      // console.log(countDown.value);
      if (countDown.value <= 0) {
        clearInterval(timer);
        flags.value.sendCode = 'default';
      }
    }, 1000);
  }
}

// 跳转至第三方登录页面
async function toThirdLogin(type: OAuthLoginType) {
  let result = await OtherAPI.getOAuthUrl(type);
  if (result.code === 20000) {
    window.location.href = result.data;
    // 新窗口打开
    // window.open(result.data);
  } else {
    message.error(result.message);
  }
};
// 登录
const login = async (loginUser: { username: string, password: string }) => {
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

// 获取网站信息
async function getWebsiteInfo() {
  let result = await OtherAPI.getWebsiteInfo();
  if (result.code == 20000) {
    websiteStore.setWebsiteInfo(result.data);
  } else {
    message.error(result.message);
  }
}

watch(isRegister, () => {
  imgName.value = isRegister.value ? "工作.png" : "读书.png";
  // console.log(imgName.value);
}, { immediate: true });
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