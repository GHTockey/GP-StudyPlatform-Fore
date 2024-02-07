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