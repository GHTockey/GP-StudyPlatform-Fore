import type { Vocabulary, VocabularyData } from "@/types/vocabulary";
import { request } from "@/utils/request";


/* 添加词集API */
export function addVocabularyAPI(vocbulary: Vocabulary) {
   return request<{ vid: number }>("/vocabulary-service/vocabulary", "POST", vocbulary);
};

/* 获取词集详情API */
export function getVocabularyAPI(id: string) {
   return request<VocabularyData>(`/vocabulary-service/vocabulary/${id}`, "GET");
};

/* 获取用户的词集列表API */
export function getVocabularyListByUidAPI(uid: string) {
   return request<VocabularyData[]>(`/vocabulary-service/vocabulary/list/${uid}`, "GET");
};

/* 搜索词集API */
export function searchVocabularyAPI(keyword: string) {
   return request<Vocabulary[]>("/vocabulary-service/vocabulary/search/" + keyword, "GET");
}