<template>
   <div class="userinfo-container m-auto lg:w-[80%] md:w-[85%]">
      <!-- 头像名称box -->
      <div class="h-[230px] flex justify-between items-center pl-10 relative">
         <!-- 文字信息 -->
         <div class="text-gray-500">
            <!-- 用户名 -->
            <p class="font-bold text-4xl text-base-content">{{ userInfo?.username }}</p>
            <!-- ID -->
            <p class="font-semibold text-sm -mt-1">#{{ userInfo?.id }}</p>
            <!-- 邮箱 -->
            <p class="m-[8px_0]">
               <MailOutlined class="mr-[5px]" /> {{ userInfo?.email }}
            </p>
            <!-- 注册时间 -->
            <p class="m-[8px_0]">
               <FieldTimeOutlined class="mr-[8px]" />2022年10月1日加入
            </p>
         </div>
         <!-- 头像 -->
         <div class="w-[280px] relative">
            <img :src="userInfo?.avatar" alt="头像模糊" class=" size-[200px] blur-[40px] my-user-avatar">
            <!-- <img :src="userInfo?.avatar" alt="头像" class="size-[180px] absolute my-user-avatar ring"
               :class="(userInfo?.sex == '1' ? 'ring-blue-500' : (userInfo?.sex == '0' ? 'ring-pink-500' : 'ring-white'))"> -->
            <img :src="userInfo?.avatar" alt="头像" class="size-[180px] absolute my-user-avatar ring" :class="'ring-white'">
         </div>
         <!-- 按钮 -->
         <div class="absolute bottom-0">
            <a-space>
               <template v-if="isSelf">
                  <button class="btn btn-info text-white btn-sm" @click="openEditModal">
                     <IconFont type="icon-xiugai" />修改信息
                  </button>
               </template>
               <template v-else>
                  <button class="btn btn-success text-white btn-sm">私信</button>
               </template>
            </a-space>
         </div>
      </div>

      <div class="p-10">
         <div class="divider divider-start font-semibold text-lg">词集列表</div>
         <!-- 骨架屏 -->
         <div v-if="vocabularyListLoading" v-for="item in 3" :key="item"
            class="skeleton bg-base-200 w-full h-[100px] mb-2"></div>
         <!-- 词集列表 -->
         <div v-for="item in vocabularyList" :key="item.id" @click="$router.push(`/vocabulary/${item.id}`)" class="bg-base-200 hover:bg-base-300
                        mb-2 cursor-pointer rounded-2xl p-5 h-[100px]
                        relative flex  justify-between items-center transition-all">
            <!-- 封面 -->
            <img :src="item.cover" alt="封面" class="absolute top-1/2 -translate-y-1/2 w-[120px] h-[80%]
             left-[-20px] rounded-lg border-[5px] border-base-100 shadow-lg shadow-gray-400" />
            <div class="ml-24 max-w-[230px]">
               <!-- 标题 -->
               <p class="text-lg font-[600]">{{ item.title }}</p>
               <!-- 描述 -->
               <p class="text-xs text-ellipsis h-3/4">{{ item.desc }}</p>
            </div>
            <!-- 中间内容 -->
            <div class="text-base-center">
               <!-- 数量 -->
               <p>
                  <IconFont type="icon-icon-test" /> {{ item.count }}
               </p>
               <!-- 时间 -->
               <p>
                  <IconFont type="icon-shijian" /> {{ item.createTime }}
               </p>
            </div>
            <!-- 结尾操作 -->
            <div class="gap-2 flex items-center">
               <template v-if="isSelf">
                  <!-- 编辑 -->
                  <button class="btn btn-sm btn-info">
                     <IconFont type="icon-xiugai" />
                  </button>
                  <!-- 删除 -->
                  <button class="btn btn-sm btn-error" @click.stop="delVocabulary(item.id)">
                     <IconFont type="icon-shanchu" />
                  </button>
               </template>
               <p>
                  <RightOutlined />
               </p>
            </div>
         </div>
         <!-- 没有数据 -->
         <a-empty v-if="!vocabularyList?.length" />
      </div>
   </div>

   <!-- 编辑 -->
   <dialog id="editModal" class="modal">
      <div class="modal-box">
         <h3 class="font-bold text-lg mb-5">修改信息</h3>
         <a-form :model="editUserInfo" ref="editUserInfoFormEl">
            <!-- 头像 -->
            <a-form-item name="avatar" :rules="{ required: true, message: '请选择头像' }">
               <div class="flex justify-center">
                  <label class="bg-gray-500 relative rounded-full cursor-pointer">
                     <img :src="editUserInfo.avatar" alt="头像"
                        class="w-[100px] h-[100px] rounded-full border-[5px] border-base-100 shadow">
                     <div class="absolute top-0 left-0 size-full rounded-full transition-all
                     border-[3px] border-dashed border-gray-500 opacity-0 hover:opacity-80
                     bg-gray-400 flex justify-center items-center">
                        <span class="text-base">选择头像</span>
                     </div>
                     <input type="file" class="size-0" @change="handleAvatarChange($event)" />
                     <div v-if="progress > 0 && progress < 100" :style="`--value:${progress};`"
                        class="radial-progress bg-primary text-primary-content border-4 border-primary absolute size-full top-0 left-0"
                        role="progressbar">{{ progress }}%</div>
                  </label>
               </div>
            </a-form-item>
            <a-form-item name="username" :rules="{ required: true, message: '请输入用户名' }">
               <label class="form-control w-full">
                  <div class="label">
                     <span class="label-text">用户名</span>
                  </div>
                  <input type="text" v-model="editUserInfo.username"
                     class="input text-base-content input-sm input-bordered w-full" />
               </label>
            </a-form-item>
            <a-form-item>
               <label class="form-control w-full">
                  <div class="label">
                     <span class="label-text">邮箱</span>
                  </div>
                  <input type="text" v-model="editUserInfo.email" disabled
                     class="input text-base-content input-sm input-bordered w-full" />
               </label>
            </a-form-item>
            <a-form-item name="sex" :rules="{ required: true, message: '请选择性别' }">
               <label class="form-control w-full">
                  <div class="label">
                     <span class="label-text">性别</span>
                  </div>
               </label>
               <div class="join">
                  <input v-model="editUserInfo.sex" value="1" class="join-item btn btn-sm" type="radio" name="options"
                     aria-label="男" />
                  <input v-model="editUserInfo.sex" value="0" class="join-item btn btn-sm" type="radio" name="options"
                     aria-label="女" />
               </div>
            </a-form-item>
         </a-form>
         <!-- {{ editUserInfo }} -->
         <div class="modal-action">
            <form method="dialog">
               <!-- if there is a button in form, it will close the modal -->
               <button class="btn">取消</button>
            </form>
            <button class="btn btn-primary" @click.stop="editSubmit">确定</button>
         </div>
      </div>
   </dialog>
   <component :is="null" />
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/userStore";
import { getVocabularyListByUidAPI } from "@/api/vocabulary";
import { getUserInfoById } from "@/api/user";
import { ref, h } from "vue";
import { useRoute } from "vue-router";
import type { VocabularyData } from "@/types/vocabulary";
import type { User } from "@/types/user";
import { message } from "ant-design-vue";
import router from "@/router";
import { MailOutlined, FieldTimeOutlined, RightOutlined } from "@ant-design/icons-vue";
import IconFont from "@/utils/iconFont";
import type { FormExpose } from "ant-design-vue/es/form/Form";
import { OtherAPI } from "@/api/other";
import { UserAPI } from "@/api/user";
import { MyUtils } from "@/utils";

const route = useRoute();
const vocabularyList = ref<VocabularyData[]>();
const userInfo = ref<User>();
const userStore = useUserStore();


// 是否是自己
const isSelf = ref(false);
// 词集列表 loading
const vocabularyListLoading = ref(false);
// 编辑的用户信息
const editUserInfo = ref<User>({
   id: "",
   username: "",
   avatar: "",
   email: "",
   sex: ""
});
// editUserInfoForm 实例
const editUserInfoFormEl = ref<FormExpose | null>(null);
const progress = ref(0);



getVocabularyList();
if (route.params.id == userInfo.value?.id) {
   isSelf.value = true;
} else {
   isSelf.value = false;
}


function ttt (){
   MyUtils.toast();
}
// 编辑弹框 【选择上传头像事件】
async function handleAvatarChange(e: Event) {
   let file = (<HTMLInputElement>e.target).files?.[0] as File;
   const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
   if (!isJpgOrPng) return message.error('只能上传JPG格式的文件!');
   const isLt2M = file.size / 1024 / 1024 < 2;
   if (!isLt2M) return message.error('头像必须小于2MB!');
   let formData = new FormData();
   formData.append('file', file);
   let result = await OtherAPI.imageUplAPI(formData, (p) => {
      progress.value = Math.floor(p.progress! * 100)
      // console.log(progress.value);
   });
   if (result.code == 20000) {
      editUserInfo.value.avatar = result.data;
      message.success('上传成功');
   } else {
      message.error('上传失败');
   }
}
// 编辑弹框 【打开】
function openEditModal() {
   editUserInfo.value = JSON.parse(JSON.stringify(userInfo.value));
   let editModal = window.document.querySelector('#editModal') as HTMLDialogElement;
   editModal.showModal();
};
// 编辑弹框 【提交】
async function editSubmit() {
   try {
      await editUserInfoFormEl.value?.validate()
      let result = await UserAPI.editUser(editUserInfo.value);
      if (result.code == 20000) {
         message.success('修改成功');
         // 关闭EditModal();
         (<HTMLDialogElement>window.document.querySelector('#editModal')).close();
         getVocabularyList();
      } else {
         message.error('修改失败');
      }
   } catch (error) {
      console.log('表单验证失败', error);
   }
};
// 删除词集
async function delVocabulary(id: number) {
   message.error("删除词集" + id);
};
// 获取词集列表
async function getVocabularyList() {
   vocabularyListLoading.value = true;
   // 获取指定用户信息
   if (route.params.id) {
      let userInfoRes = await getUserInfoById(<string>route.params.id);
      userInfo.value = userInfoRes.data;
      let vocListRes = await getVocabularyListByUidAPI(<string>route.params.id);
      vocabularyList.value = vocListRes.data;
      // 获取当前用户信息
   } else if (userStore.userInfo) {
      let userInfoRes = await getUserInfoById(userStore.userInfo.id);
      userInfo.value = userInfoRes.data;
      let vocListRes = await getVocabularyListByUidAPI(userStore.userInfo.id);
      vocabularyList.value = vocListRes.data;
   } else {
      console.log(route);
      message.error("未登录");
      router.push("/");
   }
   vocabularyListLoading.value = false;
   editUserInfo.value = JSON.parse(JSON.stringify(userInfo.value));
}
</script>

<style lang="less"></style>