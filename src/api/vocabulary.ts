import type { VocabularyVo, Vocabulary, Word } from "@/types/vocabulary";
import { request } from "@/utils/request";

// let cloudServiceURL = "/vocabulary-service";
let cloudServiceURL = "";

export class VocabularyAPI {
   /* 添加词集API */
   static addVocabulary(vocbulary: Vocabulary) {
      return request<{ vid: number }>(`${cloudServiceURL}/vocabulary`, "POST", vocbulary);
   };

   /* 获取词集详情API */
   static getVocabulary(id: string) {
      return request<Vocabulary>(`${cloudServiceURL}/vocabulary/${id}`, "GET");
   };

   /* 获取用户的词集列表API */
   static getVocabularyListByUid(uid: string) {
      return request<Vocabulary[]>(`${cloudServiceURL}/vocabulary/list/${uid}`, "GET");
   };

   /* 搜索词集API */
   static searchVocabulary(keyword: string) {
      return request<Vocabulary[]>(`${cloudServiceURL}/vocabulary/search/` + keyword, "GET");
   }

   /* 删除词集API */
   static delVocbulary(id: string) {
      return request<string>(`${cloudServiceURL}/vocabulary/${id}`, "DELETE")
   }

   /* 修改词集API */
   static updVocabulary(vocabulary: Vocabulary) {
      return request<string>(`${cloudServiceURL}/vocabulary`, "PUT", vocabulary)
   }

   /* 用户学习词集 API */
   static userLearnVocabulary(v: { vid: string, uid: string }) {
      return request<string>(`${cloudServiceURL}/vocabulary/learn`, "POST", v)
   }

   /* 用户取消学习词集 API */
   static cancelLearnVocabulary(v: { vid: string, uid: string }) {
      return request<string>(`${cloudServiceURL}/vocabulary/cancel`, "PUT", v)
   }

   /* 获取用户学习的词集列表 API */
   static getUserRelevanceVocListByUid(uid: string) {
      return request<Vocabulary[]>(`${cloudServiceURL}/vocabulary/learn/${uid}`, 'GET')
   }
   /* 获取学习最多的词集列表 (前5个) */
   static getMostStudyVocList() {
      return request<Vocabulary[]>(`${cloudServiceURL}/vocabulary/most`, 'GET')
   }


   // word service
   /* 新增新的词语 API */
   static addNewWord(words: Word) {
      return request<{ id: string }>(`${cloudServiceURL}/words`, "POST", words)
   };
   /* 删除词语 API */
   static delWordsById(id: string) {
      return request<string>(`${cloudServiceURL}/words/${id}`, "DELETE")
   }
}