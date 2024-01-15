import type { Classes } from "@/types/classes";
import { request } from "@/utils/request";


/* 添加词集API */
export function addClassesAPI(classes: Classes) {
   return request("/classes-service/classes", "POST", classes);
};