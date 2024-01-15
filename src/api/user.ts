import type { UserInfo } from "@/types/user";
import type { VocabularyData } from "@/types/word";
import { request } from "@/utils/request";

// 用户登录
export function login(loginUser: { username: string; password: string; }) {
   return request<UserInfo>("/user-service//user/login", "POST", loginUser);
};

// 用户名校验
export function checkUsername(username: string) {
   return request<boolean>("/user-service/user/checkUsername", "GET", { username });
};

// 根据用户id获取用户信息
export function getUserInfoById(uid: string) {
   return request<UserInfo>(`/user-service/user/${uid}`, "GET");
};