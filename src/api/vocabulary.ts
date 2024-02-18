import type { VocabularyVo, Vocabulary, Word } from "@/types/vocabulary";
import { request } from "@/utils/request";


export class VocabularyAPI {
   /* 添加词集API */
   static addVocabulary(vocbulary: Vocabulary) {
      return request<{ vid: number }>("/vocabulary-service/vocabulary", "POST", vocbulary);
   };

   /* 获取词集详情API */
   static getVocabulary(id: string) {
      return request<Vocabulary>(`/vocabulary-service/vocabulary/${id}`, "GET");
   };

   /* 获取用户的词集列表API */
   static getVocabularyListByUid(uid: string) {
      return request<Vocabulary[]>(`/vocabulary-service/vocabulary/list/${uid}`, "GET");
   };

   /* 搜索词集API */
   static searchVocabulary(keyword: string) {
      return request<Vocabulary[]>("/vocabulary-service/vocabulary/search/" + keyword, "GET");
   }

   /* 删除词集API */
   static delVocbulary(id: string) {
      return request<string>(`/vocabulary-service/vocabulary/${id}`, "DELETE")
   }

   /* 修改词集API */
   static updVocabulary(vocabulary: Vocabulary) {
      return request<string>("/vocabulary-service/vocabulary", "PUT", vocabulary)
   }


   // word service
   /* 新增新的词语 API */
   static addNewWord(words: Word) {
      return request<{ id: string }>("/vocabulary-service/words", "POST", words)
   };
   /* 删除词语 API */
   static delWordsById(id: string) {
      return request<string>(`/vocabulary-service/words/${id}`, "DELETE")
   }
}