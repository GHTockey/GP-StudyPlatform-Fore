import type { Classes, ClassesUser } from "@/types/classes";
import type { Vocabulary } from "@/types/vocabulary";
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
   /* 删除班级 API */
   static deleteClasses(id: string) {
      return request(`/classes-service/classes/${id}`, 'DELETE')
   };
   /* 修改班级 API */
   static updateClasses(classes: Classes) {
      return request('/classes-service/classes', 'PUT', classes)
   };

   /* 搜索班级API */
   static searchClasses(keyword: string) {
      return request<Classes[]>("/classes-service/classes/search/" + keyword, "GET");
   };

   /*根据班级ID获取所有成员的词集列表 API */
   static getVocListByClassesUser(cid: string) {
      return request<Vocabulary[]>(`/classes-service/classes/user/voc/list/${cid}`)
   };

   /* 用户加入班级 API */
   static joinClasses(classesUser: ClassesUser) {
      return request<string>("/classes-service/classes/user/push", "POST", classesUser)
   };
   /* 用户退出班级 API */
   static quitClasses(classesUser: ClassesUser) {
      return request<string>("/classes-service/classes/user/remove", "POST", classesUser)
   };
}