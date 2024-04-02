import type { UserMessage } from "@/types/other";
import type { User, UserRegisterVo } from "@/types/user";
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
   static addChatRecord(data: UserMessage) {
      return request<string>(`${cloudServiceURL}/user/chatRecord`, "POST", data);
   }
   /** 获取聊天记录列表 API */
   static getChatRecordList(uid: string, toUid: string) {
      return request<UserMessage[]>(`${cloudServiceURL}/user/chatRecord/${uid}/${toUid}`, "GET");
   }
   /** 将聊天记录标记为已读 API */
   static markChatRecordAsRead(uid: string, toUid: string) {
      return request<string>(`${cloudServiceURL}/user/chatRecord/read/${uid}/${toUid}`, "PUT");
   }
   /** 获取未读消息 API */
   static getUnreadMessage(uid: string) {
      return request<UserMessage[]>(`${cloudServiceURL}/user/chatRecord/unread/${uid}`, "GET");
   }
   /** 获取学习数前5的用户列表 API */
   static getActiveUserList() {
      return request<User[]>(`${cloudServiceURL}/user/activeUserList`, "GET");
   }
   /** 更新用户的词集学习数 API */
   static updateUserVocLearnCount(data: { uid: string, vid: string }) {
      return request<string>(`${cloudServiceURL}/vocabulary/updateStudyTotal`, "PUT", data);
   }
   /* 第三方用户与本地用户绑定 API */
   static oAuthBind(oAuthUser: User, oKey: string, type: string) {
      return request<User>(`${cloudServiceURL}/user/oauth/bind?type=${type}&oKey=${oKey}`, "POST", oAuthUser);
   }
   /* 通过 token 获取用户信息 API */
   static getUserInfoByToken(token: string) {
      return request<User>(`${cloudServiceURL}/user/token/${token}`, "GET");
   }
   /* OAuth 注册并登录 API */
   static oAuthRegisterLogin(oAuthUser: {
      username: string;
      avatar: string;
      email: string;
      password: string;
   }, oKey: string, type: string) {
      return request<User>(`${cloudServiceURL}/user/oauth/register/login?type=${type}&oKey=${oKey}`, "POST", oAuthUser);
   }
   /* 用户注册 API */
   static register(userRegister: UserRegisterVo) {
      return request<string>(`${cloudServiceURL}/user/register`, "POST", userRegister);
   }
}