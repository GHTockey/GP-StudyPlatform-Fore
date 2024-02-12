import type { Classes } from "@/types/classes";
import { defineStore } from "pinia";
import { ref } from "vue";
import { ClassesAPI } from "@/api/classes";

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
      let result = await ClassesAPI.addClasses(classes);
      return result
   }
   /* 获取班级Handler */
   async function getClassesHandler(id: string) {
      let result = await ClassesAPI.getClasses(id);
      classes.value = result.data;
   }

   return {
      classes,
      addClassesHandler,
      getClassesHandler
   }
})