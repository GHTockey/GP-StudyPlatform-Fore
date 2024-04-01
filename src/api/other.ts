import type { EmailCode, GiteeUser, GithubUser } from "@/types/other";
import type { User } from "@/types/user";
import { request } from "@/utils/request";
import type { AxiosProgressEvent } from "axios";

// let cloudServiceURL = "/other-service";
let cloudServiceURL = "";

export class OtherAPI {
   /* 上传图片 API */
   static imageUpl(imgFile: FormData, uploadHandler?: (p: AxiosProgressEvent) => void) {
      return request<string>(`${cloudServiceURL}/other/image/upload`, "POST", imgFile, uploadHandler);
   }
   /* 获取 OAuth 用户数据 */
   static getOAuthUserData(oKey: String, type: string) {
      return request<GithubUser | GiteeUser | User>(`${cloudServiceURL}/other/oauth/user?type=${type}&oKey=${oKey}`)
   }
   /* 根据 OAuth 类型获取第三方登录地址 */
   static getOAuthUrl(type: string) {
      return request<string>(`${cloudServiceURL}/other/login/${type}`)
   }
   /* 发送邮箱验证码 API*/
   static sendEmailCode(email: string) {
      return request<EmailCode['expireTime']>(`${cloudServiceURL}/other/mail/send?to=${email}`,"POST")
   }
}