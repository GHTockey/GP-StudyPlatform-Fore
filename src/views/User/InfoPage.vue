<template>
   <div class="userinfo-container my-type-center">
      <!-- 头像名称box -->
      <div class="my-transition-all h-[400px] sm:h-[300px] flex justify-between items-center sm:pl-10 relative mb-3">
         <!-- 文字信息 -->
         <div class="text-gray-500
          absolute left-1/2 -translate-x-1/2 text-center 
          w-full sm:w-[500px] top-48 sm:left-5 sm:text-left sm:transform-none
          sm:top-20">
            <!-- 用户名 -->
            <p class="font-bold text-4xl text-base-content">{{ currentUserInfo?.username }}</p>
            <!-- ID -->
            <p class="font-semibold text-sm -mt-1">#{{ currentUserInfo?.id }}</p>
            <!-- 邮箱 -->
            <p class="m-[8px_0]">
               <MailOutlined class="mr-[5px]" /> {{ currentUserInfo?.email }}
            </p>
            <!-- 注册时间 -->
            <p class="m-[8px_0]">
               <FieldTimeOutlined class="mr-[8px]" />2022年10月1日加入 todo
            </p>
            <!-- 班级 -->
            <p class="hover:text-blue-500 cursor-pointer my-2 inline"
               @click="currentUserInfo?.classes ? $router.push('/classes/' + currentUserInfo.classes.id) : null">
               <IconFont type="icon-banjixinxi" />&nbsp; {{ currentUserInfo?.classes?.name || '无' }}
            </p>
         </div>
         <!-- 头像 -->
         <div class="size-[120px] sm:size-[200px] absolute top-10 right-1/2 translate-x-1/2 
         sm:right-10 sm:transform-none">
            <img :src="currentUserInfo?.avatar" alt="头像模糊" class=" size-full blur-[30px] my-user-avatar">
            <!-- <img :src="userInfo?.avatar" alt="头像" class="size-[180px] absolute my-user-avatar ring"
               :class="(userInfo?.sex == '1' ? 'ring-blue-500' : (userInfo?.sex == '0' ? 'ring-pink-500' : 'ring-white'))"> -->
            <img :src="currentUserInfo?.avatar" alt="头像" class="size-full absolute my-user-avatar ring"
               :class="'ring-white'">
         </div>
         <!-- 按钮 -->
         <div class="absolute -bottom-3 right-1/2 translate-x-1/2 sm:left-5 sm:transform-none">
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



      <!-- 选项切换 -->
      <div class="flex justify-center sm:justify-end">
         <div role="tablist" class="tabs tabs-boxed mt-10 w-[300px] font-bold" @click="changeTab">
            <a v-for="(item, i) in  ['发布词集', '学习清单', '动态信息'] " :key="i" :data-key="i + 1" role="tab"
               class="tab transition-all" :class="tab == i + 1 ? 'tab-active' : ''">{{ item }}</a>
         </div>
      </div>


      <!-- 发布的词集 -->
      <div v-show="tab == 1" class="my-transition-all p-2 md:p-0">
         <div class="divider divider-start font-semibold text-lg">词集</div>
         <!-- 骨架屏 -->
         <div v-if="vocabularyListLoading" v-for=" item  in  3 " :key="item"
            class="skeleton bg-base-200 w-full h-[100px] mb-2"></div>
         <!-- 词集列表 -->
         <div v-for=" item  in  vocabularyList " :key="item.id" @click="$router.push(`/vocabulary/${item.id}`)" class="bg-base-200 hover:bg-base-300
                        mb-2 cursor-pointer rounded-2xl p-5 h-[100px] ml-5
                        relative flex  justify-between items-center transition-all">
            <!-- 封面 -->
            <img :src="item.cover" alt="封面" class="absolute top-1/2 -translate-y-1/2 w-[120px] h-[80%]
             left-[-20px] rounded-lg border-[5px] border-base-100 shadow-lg shadow-base-300" />
            <!-- 标题/描述 -->
            <div class="ml-24 sm:w-[230px] sm:static sm:pl-0
               absolute left-2 top-3 w-[calc(100%-10rem)] pl-2">
               <!-- 标题 -->
               <p class="text-lg font-[600] truncate text-ellipsis">{{ item.title }}</p>
               <!-- 描述 -->
               <p class="text-xs h-3/4 truncate text-ellipsis">{{ item.desc }}</p>
            </div>
            <!-- 中间内容 -->
            <div class="text-gray-500 text-sm sm:static sm:pl-0 sm:ml-0 sm:gap-3 sm:w-auto
               absolute left-2 bottom-3 w-[calc(100%-6rem)] pl-2 ml-24 flex gap-5">
               <!-- 数量 -->
               <p>
                  <IconFont type="icon-icon-test" /> {{ item.count }}
               </p>
               <!-- 时间 -->
               <p>
                  <IconFont type="icon-shijian" /> {{ item.createTime.slice(0, 10) }}
               </p>
            </div>
            <!-- 结尾操作 -->
            <div class="gap-2 flex items-center sm:static sm:w-auto sm:flex-nowrap
               absolute right-2 flex-wrap w-8">
               <template v-if="isSelf">
                  <!-- 编辑 -->
                  <button class="btn btn-xs w-full sm:w-auto sm:btn-sm btn-info"
                     @click.stop="$router.push(`/vocabulary/edit/${item.id}`)">
                     <IconFont type="icon-xiugai" />
                  </button>
                  <!-- 删除 -->
                  <button class="btn btn-xs w-full sm:w-auto sm:btn-sm btn-error" @click.stop="delVocabulary(item.id)">
                     <IconFont type="icon-shanchu" />
                  </button>
               </template>
            </div>
         </div>
         <!-- 空数据状态 -->
         <a-empty v-if="!vocabularyList?.length && vocabularyListLoading == false" class="mt-20 text-gray-400" />
      </div>

      <!-- 学习的词集 -->
      <div v-show="tab == 2" class="my-transition-all p-2 md:p-0">
         <div class="divider divider-start font-semibold text-lg">参与</div>
         <!-- 空数据状态 -->
         <a-empty v-if="userRelevanceVocList.length == 0 && userRelevanceVocListLoading == false"
            class="mt-20 text-gray-400" />
         <!-- 骨架屏 -->
         <div v-else-if="userRelevanceVocListLoading" class="skeleton bg-base-200 w-full h-[100px] mb-2"></div>
         <!-- 词集列表 -->
         <div @click="$router.push(`/vocabulary/${item.id}`)" v-for="(item, index) in userRelevanceVocList" :key="index"
            class="shadow bg-base-200 hover:bg-base-300 cursor-pointer mb-2 rounded-md py-5 px-6 relative">
            <div>
               <p class="font-bold text-lg mb-2">{{ item.title }}</p>
            </div>
            <div class="flex gap-5 items-center">
               <!-- 标题 -->
               <p class="text-sm">
                  <IconFont type="icon-icon-test" /> {{ item.count }}个词条
               </p>
               <!-- 作者与数量 -->
               <div class="avatar placeholder flex items-center">
                  <div class="bg-neutral text-neutral-content rounded-full size-5 mr-2">
                     <img :src="item.author?.avatar" />
                  </div>
                  <span>{{ item.author?.username }}</span>
               </div>
               <!-- 操作 -->
               <div class="absolute right-5 top-1/2 -translate-y-1/2">
                  <!-- 取消 -->
                  <button class="btn btn-sm w-full btn-warning"
                     @click.stop="MyUtils.modal('移出清单', `将词集 【${item.title}】 移除我的学习清单？`, () => cancelLearnVocabulary(item.id))">
                     <IconFont type="icon-refuse" />
                  </button>
               </div>
            </div>
         </div>
      </div>

      <!-- 动态 -->
      <div v-show="tab == 3" class="my-transition-all p-2 md:p-0">
         <div class="divider divider-start font-semibold text-lg">动态</div>


         <!-- 空数据状态 -->
         <a-empty class="mt-20 text-gray-400" />
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
                  <input type="text" v-model="editUserInfo.username" class="my-form-input-sm" />
               </label>
            </a-form-item>
            <a-form-item>
               <label class="form-control w-full">
                  <div class="label">
                     <span class="label-text">邮箱</span>
                  </div>
                  <input type="text" v-model="editUserInfo.email" disabled class="my-form-input-sm" />
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
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/userStore";
import { VocabularyAPI } from "@/api/vocabulary";
import { UserAPI } from "@/api/user";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import router from "@/router";
import type { Vocabulary } from "@/types/vocabulary";
import type { User } from "@/types/user";
import { message } from "ant-design-vue";
import { MailOutlined, FieldTimeOutlined } from "@ant-design/icons-vue";
import IconFont from "@/utils/iconFont";
import type { FormExpose } from "ant-design-vue/es/form/Form";
import { OtherAPI } from "@/api/other";
import { MyUtils } from "@/utils";

const route = useRoute();
const vocabularyList = ref<Vocabulary[]>();
const currentUserInfo = ref<User>();
const userStore = useUserStore();


// 是否是自己
const isSelf = ref(false);
// 词集列表 loading
const vocabularyListLoading = ref(false);
// 用户学习的词集列表
const userRelevanceVocList = ref<Vocabulary[]>([]);
// 获取用户学习清单时的loading
const userRelevanceVocListLoading = ref(false);
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
// 上传进度
const progress = ref(0);
// 选项卡
const tab = ref(1);



getUserInfoAndVocabularyList();



// 用户取消学习词集
async function cancelLearnVocabulary(vid: string) {
   let data = { vid, uid: userStore.userInfo!.id };
   let result = await VocabularyAPI.cancelLearnVocabulary(data);
   if (result.code == 20000) {
      MyUtils.alert(result.message, "success");
      getUserRelevanceVocListByUid();
   } else {
      MyUtils.alert(result.message, "error");
   }
}
// 选项卡切换
function changeTab(e: Event) {
   let target = e.target as HTMLElement;
   if (target.tagName == "A") {
      tab.value = +target.getAttribute("data-key")! || 1;

      if (tab.value == 2) getUserRelevanceVocListByUid();
   }
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
   let result = await OtherAPI.imageUpl(formData, (p) => {
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
   editUserInfo.value = JSON.parse(JSON.stringify(currentUserInfo.value));
   let editModal = window.document.querySelector('#editModal') as HTMLDialogElement;
   editModal.showModal();
};
// 编辑弹框 【提交】
async function editSubmit() {
   try {
      await editUserInfoFormEl.value?.validate()
      let result = await UserAPI.editUser(editUserInfo.value);
      if (result.code == 20000) {
         MyUtils.alert("操作成功", "success");
         // 关闭EditModal();
         (<HTMLDialogElement>window.document.querySelector('#editModal')).close();
         getUserInfoAndVocabularyList();
      } else {
         MyUtils.alert("操作失败", "error");
      }
   } catch (error) {
      console.log('表单验证失败', error);
   }
};
// 删除词集 【按钮】
async function delVocabulary(id: string) {
   let voc = vocabularyList.value?.find(v => v.id == id);
   MyUtils.modal("操作确认", `您确认要删除词集 ${voc?.title} 吗？`, () => delVocabularyConfirm(id))
};
// 删除词集 【确认】
async function delVocabularyConfirm(id: string) {
   let result = await VocabularyAPI.delVocbulary(id);
   if (result.code == 20000) {
      MyUtils.alert("操作成功", "success");
      getUserInfoAndVocabularyList();
   } else {
      MyUtils.alert("操作失败", "error");
   }
}
// 获取词集列表
async function getUserInfoAndVocabularyList() {
   vocabularyListLoading.value = true; // 显示骨架屏
   // 获取指定用户信息
   if (route.params.id) {
      let userInfoRes = await UserAPI.getUserInfoById(<string>route.params.id);
      currentUserInfo.value = userInfoRes.data;
      let vocListRes = await VocabularyAPI.getVocabularyListByUid(<string>route.params.id);
      vocabularyList.value = vocListRes.data;
      isSelf.value = false;
      // 使用当前登录用户的信息
   } else if (userStore.userInfo) {
      let userInfoRes = await UserAPI.getUserInfoById(userStore.userInfo.id);
      currentUserInfo.value = userInfoRes.data;
      // userInfo.value = userStore.userInfo; // 注意这里的数据是响应式
      // userInfo.value = JSON.parse(JSON.stringify(userStore.userInfo));
      let vocListRes = await VocabularyAPI.getVocabularyListByUid(userStore.userInfo.id);
      vocabularyList.value = vocListRes.data;
      isSelf.value = true; // 走的是当前登录的用户，就是自己
      userStore.userInfo = JSON.parse(JSON.stringify(currentUserInfo.value));
   } else {
      // console.log(route);
      message.error("未登录");
      router.push("/");
   }
   vocabularyListLoading.value = false; // 加载完成 隐藏骨架屏
   editUserInfo.value = JSON.parse(JSON.stringify(currentUserInfo.value)); // 编辑用户信息回显
   // 判断是否是自己
   if (route.params?.id == userStore.userInfo?.id) {
      isSelf.value = true;
      console.log(2);
   }
}
// 获取用户学习的词集列表
async function getUserRelevanceVocListByUid() {
   // if (userRelevanceVocList.value!.length > 0) return;
   userRelevanceVocListLoading.value = true;
   let result = await VocabularyAPI.getUserRelevanceVocListByUid(userStore.userInfo?.id!);
   userRelevanceVocListLoading.value = false;
   if (result.code == 20000) {
      userRelevanceVocList.value = result.data;
   } else {
      message.error("获取用户学习的词集列表失败");
   }
}

// 
watch(() => route.params, () => {
   // vue中多个路由对应同一个组件，页面切换不刷新问题
   getUserInfoAndVocabularyList();
})
</script>

<style lang="less"></style>