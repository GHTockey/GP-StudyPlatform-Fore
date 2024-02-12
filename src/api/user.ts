import type { User } from "@/types/user";
import { request } from "@/utils/request";


export class UserAPI {
   /** 用户登录 API */
   static login(username: string, password: string) {
      return request<User>("/user-service/user/login", "POST", { username, password })
   };
   /** 添加用户 API */
   static addUser(data: User) {
      return request<null>("/user-service/user", "POST", data)
   };
   /** 删除用户 API */
   static deleteUser(id: number) {
      return request<null>(`/user-service/user/${id}`, "DELETE")
   };
   /** 编辑用户 API */
   static editUser(data: User) {
      return request<null>("/user-service/user", "PUT", data)
   };
   /* 根据用户id获取用户信息API */
   static getUserInfoById(uid: string) {
      return request<User>(`/user-service/user/${uid}`, "GET");
   };
   /* 搜索用户API */
   static searchUser(keyword: string) {
      return request<User[]>("/user-service/user/search/" + keyword, "GET");
   };
}