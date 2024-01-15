<template>
   <div class="add-classes-container">
      <h1 class="text-2xl">添加班级</h1>
      <form>
         <div class="form-item">
            <label for="cname">班级名称</label>
            <input type="text" placeholder="单机输入" class="input input-bordered w-full" v-model="classes.name" />
         </div>
         <div class="form-item">
            <label for="info">班级描述</label>
            <input type="text" placeholder="单机输入" class="input input-bordered w-full" v-model="classes.info" />
         </div>
         <div class="form-item">
            <label for="annc">班级公告</label>
            <input type="text" placeholder="单机输入" class="input input-bordered w-full" v-model="classes.annc" />
         </div>
         <button @click.prevent="submit">提交</button>
      </form>
   </div>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/userStore";
import { useClassesStore } from "@/stores/classesStore";
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";

// classesStore
const classesStore = useClassesStore();
// userStore
const userStore = useUserStore();
// 路由对象
const router = useRouter();

// 解构
const { classes } = storeToRefs(classesStore);


// 提交表单
async function submit() {
   classes.value.creatorUid = userStore.userInfo?.id as string;
   let classesResult = await classesStore.addClassesHandler(classes.value);
   // console.log(classesResult);
   if (classesResult.code == 20000) {
      // 添加成功
      message.success(classesResult.message);
      // 跳转到班级详情页
      router.push(`/classes/${classesResult.other.id}`);
   } else {
      // 添加失败
      message.error(classesResult.message);
   }
}
</script>

<style lang="less"></style>