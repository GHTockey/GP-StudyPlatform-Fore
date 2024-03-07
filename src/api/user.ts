import type { UserMessage, SocketMessageVo } from "@/types/other";
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
   /** 根据ID列表获取用户列表 API */
   static getUserListByIdList(ids: string[]) {
      return request<User[]>(`${cloudServiceURL}/user/list`, "POST", ids);
   }
   /** 根据班级ID获取成员列表 API */
   static getUserListByCid(cid: string) {
      return request<User[]>(`${cloudServiceURL}/user/list/byCid/${cid}`, "GET");
   }
   // 【聊天记录】
   /** 添加聊天记录 API */
   static addChatRecord(data: SocketMessageVo) {
      return request<string>(`${cloudServiceURL}/user/chatRecord`, "POST", data);
   }
   /** 获取聊天记录列表 API */
   static getChatRecordList(uid: string, toUid: string) {
      return request<UserMessage[]>(`${cloudServiceURL}/user/chatRecord/${uid}/${toUid}`, "GET");
   }
}