import type { Vocabulary, VocabularyData } from "@/types/vocabulary";
import { request } from "@/utils/request";


export class VocabularyAPI {
   /* 添加词集API */
   static addVocabulary(vocbulary: Vocabulary) {
      return request<{ vid: number }>("/vocabulary-service/vocabulary", "POST", vocbulary);
   };

   /* 获取词集详情API */
   static getVocabulary(id: string) {
      return request<VocabularyData>(`/vocabulary-service/vocabulary/${id}`, "GET");
   };

   /* 获取用户的词集列表API */
   static getVocabularyListByUid(uid: string) {
      return request<VocabularyData[]>(`/vocabulary-service/vocabulary/list/${uid}`, "GET");
   };

   /* 搜索词集API */
   static searchVocabulary(keyword: string) {
      return request<Vocabulary[]>("/vocabulary-service/vocabulary/search/" + keyword, "GET");
   }
}