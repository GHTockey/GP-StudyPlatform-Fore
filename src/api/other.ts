import { request } from "@/utils/request";
import type { AxiosProgressEvent } from "axios";

// 图片上传
export function imageUplAPI(imgFile: FormData, uploadHandler?: (p: AxiosProgressEvent) => void) {
   return request<string>("image-upload-service/image/upload", "POST", imgFile, uploadHandler);
};
