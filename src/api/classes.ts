import type { Classes } from "@/types/classes";
import { request } from "@/utils/request";


/* 添加班级API */
export function addClassesAPI(classes: Classes) {
   return request<null>("/classes-service/classes", "POST", classes);
};

/* 获取班级API */
export function getClassesAPI(id: string) {
   return request<Classes>("/classes-service/classes/" + id, "GET");
};