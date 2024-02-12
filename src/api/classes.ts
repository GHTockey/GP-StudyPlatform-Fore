import type { Classes } from "@/types/classes";
import { request } from "@/utils/request";


export class ClassesAPI {
   /* 添加班级API */
   static addClasses(classes: Classes) {
      return request<null>("/classes-service/classes", "POST", classes);
   };

   /* 获取班级API */
   static getClasses(id: string) {
      return request<Classes>("/classes-service/classes/" + id, "GET");
   };

   /* 搜索班级API */
   static searchClasses(keyword: string) {
      return request<Classes[]>("/classes-service/classes/search/" + keyword, "GET");
   };
}