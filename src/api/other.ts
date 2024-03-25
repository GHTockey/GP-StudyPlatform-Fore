import type { GithubUser } from "@/types/other";
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
      return request<GithubUser| User>(`${cloudServiceURL}/other/oauth/user?type=${type}&oKey=${oKey}`)
   }
}