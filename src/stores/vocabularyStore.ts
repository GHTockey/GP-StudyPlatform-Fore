import { defineStore } from "pinia";
import { VocabularyAPI } from "@/api/vocabulary";
import type { VocabularyData } from "@/types/vocabulary";
import { ref } from "vue";

export const useVocabularyStore = defineStore("vocabularyStore", () => {
   // 词集数据
   const vocabularyData = ref<VocabularyData>({
      "authorId": "",
      "count": 0,
      "createTime": "",
      "cover": "",
      "desc": "",
      "id": 0,
      "title": "",
      "updateTime": "",
      "wordsList": [
         {
            "definition": "",
            "id": 0,
            "vid": 0,
            "word": ""
         }
      ]
   });

   // 获取词集数据
   async function getVocabularyData(vid: string) {
      // console.log(route.params.id);
      let res = await VocabularyAPI.getVocabulary(vid);
      vocabularyData.value = res.data;
   };

   return {
      vocabularyData,
      getVocabularyData
   }
})