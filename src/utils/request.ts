import type { Method, AxiosProgressEvent } from "axios";
import axios from "axios";
import { message } from 'ant-design-vue';
import { useUserStore } from "@/stores/userStore";
import router from "@/router";
import { MyUtils } from "@/utils";

// let baseURL: string = "http://localhost:10010";
// let baseURL: string = "http://192.168.0.108:10010";
// let baseURL: string = "http://localhost:8080"; // 已在 vite 开启代理
let cancelToken = axios.CancelToken.source() // 用于中断请求

const service = axios.create({
   baseURL: '/api',
   // timeout: 3000,
   cancelToken: cancelToken.token
});

// 请求拦截
service.interceptors.request.use(config => {
   let token = localStorage.getItem('token')
   if (token != null) {
      config.headers['Authorization'] = token
   }
   return config
}, err => Promise.reject(err));

// 响应拦截
service.interceptors.response.use(res => {
   // console.log("响应拦截：" + res.config.url, res.data);
   if (res.data.code == 11012) { // https://sa-token.cc/doc.html#/fun/exception-code
      console.log("认证信息已失效");
      cancelToken.cancel("中断")
      // 提示框
      MyUtils.modal("认证信息已失效", "请重新登录；\t[" + res.data.message + "]", () => {
         const userStore = useUserStore();
         // 删除用户信息
         userStore.delUser()
         // 跳转登录，带上接口失效所在页面的地址，登录完成后回跳使用
         router.push({
            path: '/login',
            query: { returnUrl: router.currentRoute.value.fullPath }
         })
         // 取消中断
         cancelToken = axios.CancelToken.source() // 重新生成 cancelToken
         service.defaults.cancelToken = cancelToken.token // 重新设置 axios 的 cancelToken
      })
   }
   if (res.data.code != 20000) {
      message.error("响应拦截：" + res.data.message)
   }

   // 业务逻辑成功，返回响应数据，作为 axios 成功的结果
   return res.data
}, err => {
   // console.log("错误对象：", err);
   if (err.response.status == 401) {
      // console.log("token失效，重新登录");
      message.error("认证已过期，重新登录")
      const userStore = useUserStore();
      // 删除用户信息
      userStore.delUser()
      // 跳转登录，带上接口失效所在页面的地址，登录完成后回跳使用
      router.push({
         path: '/login',
         query: { returnUrl: router.currentRoute.value.fullPath }
      })
      // console.log(router);
      // router.push('/login');
   }
   // return Promise.reject(err)
});

type BaseResult<T> = {
   code: number
   message: string
   data: T,
   other?: any
};
function request<T>(url: string, method: Method = 'GET', submitData?: object, uploadHandler?: (p: AxiosProgressEvent) => void) {
   return service.request<T, BaseResult<T>>({
      url,
      method,
      [method.toLowerCase() === 'get' ? 'params' : 'data']: submitData,
      onUploadProgress: uploadHandler
   })
};

export type { BaseResult };
export { request };