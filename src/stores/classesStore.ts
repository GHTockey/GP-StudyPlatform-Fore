import type { Classes } from "@/types/classes";
import { defineStore } from "pinia";
import { ref } from "vue";
import { addClassesAPI, getClassesAPI } from "@/api/classes";

export const useClassesStore = defineStore("classesStore", () => {
   // 班级
   const classes = ref<Classes>({
      annc: "",
      creatorUid: "",
      info: "",
      name: "",
      userList: []
   });




   /* 添加班级Handler */
   async function addClassesHandler(classes: Classes) {
      let result = await addClassesAPI(classes);
      return result
   }
   /* 获取班级Handler */
   async function getClassesHandler(id: string) {
      let result = await getClassesAPI(id);
      classes.value = result.data;
   }

   return {
      classes,
      addClassesHandler,
      getClassesHandler
   }
})