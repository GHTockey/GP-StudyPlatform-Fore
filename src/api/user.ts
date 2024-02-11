import type { User } from "@/types/user";
import type { VocabularyData } from "@/types/vocabulary";
import { request } from "@/utils/request";

/* 用户登录API */
export function login(loginUser: { username: string; password: string; }) {
   return request<User>("/user-service//user/login", "POST", loginUser);
};

/* 用户名校验API */
export function checkUsername(username: string) {
   return request<boolean>("/user-service/user/checkUsername", "GET", { username });
};

/* 根据用户id获取用户信息API */
export function getUserInfoById(uid: string) {
   return request<User>(`/user-service/user/${uid}`, "GET");
};

/* 搜索用户API */
export function searchUserAPI(keyword: string) {
   return request<User[]>("/user-service/user/search/" + keyword, "GET");
};

export class UserAPI {
   /** 用户登录 API */
   static login(username: string, password: string) {
      return request<User>("/user-service/user/login", "POST", { username, password })
   };
   /** 根据 UID 获取用户权限列表 API */
   static getPermissionListByUid(uid: number) {
      return request<Permission[]>(`/user-service/permission/user/${uid}`, "GET")
   };
   /** 获取用户列表 API */
   static getUserList(num: number, size: number, userLsitVo: UserListVo) {
      return request<MyBatisPlusPage<User[]>>(`/user-service/user/list/${num}/${size}`, "POST", userLsitVo)
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
}