import type { User } from "@/types/user";
import { request } from "@/utils/request";

// let cloudServiceURL = "/user-service";
let cloudServiceURL = "";

export class UserAPI {
   /** 用户登录 API */
   static login(username: string, password: string) {
      return request<User>(`${cloudServiceURL}/user/login`, "POST", { username, password })
   };
   /** 添加用户 API */
   static addUser(data: User) {
      return request<null>(`${cloudServiceURL}/user`, "POST", data)
   };
   /** 删除用户 API */
   static deleteUser(id: number) {
      return request<null>(`${cloudServiceURL}/user/${id}`, "DELETE")
   };
   /** 编辑用户 API */
   static editUser(data: User) {
      return request<null>(`${cloudServiceURL}/user`, "PUT", data)
   };
   /* 根据用户id获取用户信息API */
   static getUserInfoById(uid: string) {
      return request<User>(`${cloudServiceURL}/user/${uid}`, "GET");
   };
   /* 搜索用户API */
   static searchUser(keyword: string) {
      return request<User[]>(`${cloudServiceURL}/user/search/` + keyword, "GET");
   };
}