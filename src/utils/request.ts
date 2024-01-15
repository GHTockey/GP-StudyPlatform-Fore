import type { Method, AxiosProgressEvent } from "axios";
import axios from "axios";
import { message } from 'ant-design-vue';

let baseURL: string = "http://localhost:10010";
const service = axios.create({
   baseURL,
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
   console.log("响应拦截："+res.config.url, res.data);
   if (res.data.code != 20000) {
      message.error(res.data.message)
   }

   // 业务逻辑成功，返回响应数据，作为 axios 成功的结果
   return res.data
}, err => {
   // if (err.response.status === 401) {
   //    const userStore = useUserStore();
   //    // 删除用户信息
   //    userStore.delUser()
   //    // 跳转登录，带上接口失效所在页面的地址，登录完成后回跳使用
   //    router.push({
   //       path: '/login',
   //       query: { returnUrl: router.currentRoute.value.fullPath }
   //    })
   // }
   return Promise.reject(err)
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
export { baseURL, request };