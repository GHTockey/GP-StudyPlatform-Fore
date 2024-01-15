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
import { ref } from "vue";
import { useUserStore } from "@/stores/userStore";
import { addClassesAPI } from "@/api/classes";
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";

// 路由对象
const router = useRouter();
// 用户信息
const userStore = useUserStore();
// 表单数据
const classes = ref({
   "annc": "",
   "creatorUid": "",
   "info": "",
   "name": ""
})


// 提交表单
async function submit() {
   classes.value.creatorUid = userStore.userInfo?.id as string;
   let classesResult = await addClassesAPI(classes.value);
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