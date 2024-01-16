import { request } from "@/utils/request";
import type { AxiosProgressEvent } from "axios";

/* 图片上传API */
export function imageUplAPI(imgFile: FormData, uploadHandler?: (p: AxiosProgressEvent) => void) {
   return request<string>("other-service/image/upload", "POST", imgFile, uploadHandler);
};
