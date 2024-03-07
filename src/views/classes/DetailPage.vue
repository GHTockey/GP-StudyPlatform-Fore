<template>
   <!-- 班级详情页 -->
   <div class="my-type-center">
      <!-- 班级信息 -->
      <div class="h-[280px] gradation md:rounded-2xl sm:rounded-none relative overflow-hidden">
         <!-- 文字信息 -->
         <div class="absolute left-8 h-full w-[50%] flex flex-wrap items-center content-center z-10">
            <p class="text-3xl font-[600] text-white">{{ classes.name }}</p>
            <p class="w-full text-gray-400">{{ classes.info }}</p>
         </div>
         <!-- 装饰图片 -->
         <div class="lg:w-[350px] md:w-[300px] w-[280px] h-full absolute right-0">
            <img src="@/assets/img/teaching.png" class="absolute top-1/2 -translate-y-1/2">
         </div>
      </div>
      <!-- 操作栏 -->
      <div class="m-[18px_0] h-16 bg-base-200 rounded-xl p-[0_18px] flex justify-between">
         <div class="avatar h-full min-w-[150px] flex items-center">
            <div class="h-12 rounded-full ring ring-primary/50 ring-offset-base-100 ring-offset-2">
               <img :src="classes.creator?.avatar" />
            </div>
            <div class="ml-3 h-full w-[100px] !flex content-center flex-wrap">
               <p class="font-[600] w-full">{{ classes.creator?.username }}</p>
               <p class="text-gray-500 text-xs">创建者</p>
            </div>
         </div>
         <!-- 按钮 -->
         <div class="flex items-center gap-4">
            <button @click="openChatWindow" v-if="isMember" class="btn btn-sm btn-success">聊天室</button>
            <button v-if="isMember && !isSelf" class="btn btn-sm btn-error"
               @click="MyUtils.modal('操作确认', '您确定要退出该班级吗？', quitClasses)">退出</button>
            <button v-if="!isMember" class="btn btn-sm btn-accent" @click="joinClasses">加入</button>
            <template v-if="isSelf">
               <button class="btn btn-sm btn-secondary" @click="controlsTabEdit">编辑</button>
               <button class="btn btn-sm btn-error"
                  @click="MyUtils.modal('操作确认', '您确定将班级解散吗？该操作不可撤销！', delClassesConfirmHandler)">解散</button>
            </template>
         </div>
      </div>
      <!-- 选项卡切换 -->
      <div role="tablist" class="tabs tabs-boxed w-[230px] transition-all rounded-b-none bg-base-200 font-bold"
         @click="tabSelectHandler($event)">
         <a role="tab" data-key="1" class="tab transition-all" :class="{ 'tab-active': tabValue == '1' }">成员</a>
         <a role="tab" data-key="2" class="tab transition-all" :class="{ 'tab-active': tabValue == '2' }">词集</a>
      </div>
      <!-- 选项卡内容 -->
      <div class="bg-base-200 flex justify-between rounded-lg rounded-tl-none overflow-hidden">
         <!-- 成员 -->
         <Transition appear>
            <div v-show="tabValue == '1'" class="p-2 w-full flex min-h-96">
               <ul class="flex-1">
                  <li class="border-[2px] border-base-300 hover:bg-base-300 rounded-lg mb-1"
                     v-for="user in classes.userList">
                     <div class="h-14 flex relative">
                        <!-- 头像 -->
                        <div :class="onlineUidList.findIndex(uid => uid == user.id) == -1 ? 'offline' : 'online'"
                           class="avatar p-1 shadow-base-content">
                           <div class="rounded-lg">
                              <img :src="user.avatar" />
                           </div>
                        </div>
                        <!-- 用户名 -->
                        <div class="ml-2 flex flex-wrap content-center">
                           <p class="font-semibold mt-1 w-full">{{ user.username }}</p>
                           <span class="text-xs text-gray-500 italic">#{{ user.id }}</span>
                        </div>
                        <!-- 图标 -->
                        <div class="absolute right-4 top-1/2 -translate-y-1/2">
                           <div v-if="isSelf && user.id != userStore.userInfo?.id" class="btn btn-xs btn-error"
                              @click="listRemoveMember(user)">
                              <IconFont type="icon-yichuyonghu" />
                           </div>
                           <!-- <RightOutlined /> -->
                        </div>
                     </div>
                  </li>
               </ul>
               <!-- 公告 -->
               <div class="lg:w-[300px] w-[180px] sm:w-[230px] transition-all ml-2 border-2 border-gray-400">
                  公告{{ classes.annc }}
               </div>
            </div>
         </Transition>
         <!-- 词集 -->
         <Transition appear>
            <div v-show="tabValue == '2'" class="w-full min-h-96 p-2">
               <!-- 加载中 骨架屏 -->
               <div v-if="vocLoading" class="flex flex-wrap justify-between">
                  <div v-for="(item, index) in 4" :key="index" class="skeleton my-class-info-word"></div>
               </div>
               <ul v-else-if="!vocLoading && vocList?.length" class="flex flex-wrap justify-between">
                  <TransitionGroup appear>
                     <li v-for="(voc, index) in vocList" :key="index"
                        class="my-class-info-word flex shadow-md hover:shadow-xl">
                        <!-- 背景图 -->
                        <div class=" w-[45%] md:h-[60%] md:w-full bg-cover bg-center
                              " :style="{ backgroundImage: `url(${voc.cover})` }">
                        </div>
                        <!-- 内容 -->
                        <div
                           class="p-4 w-[65%] md:h-[40%] md:w-full relative flex flex-wrap content-center text-gray-500">
                           <p class="w-full font-[600] text-base-content cursor-pointer hover:text-primary transition-all"
                              @click="$router.push(`/vocabulary/${voc.id}`)">{{ voc.title }}</p>
                           <p class="w-full text-sm mb-4">{{ voc.desc }}</p>
                           <!-- 底部信息 -->
                           <div class="w-full absolute bottom-2 left-0 p-[0_20px] flex justify-between items-end">
                              <!-- 数量/人数 -->
                              <div class="text-sm">
                                 <span class="mr-3">
                                    <IconFont type="icon-icon-test" /> {{ voc.count }}
                                 </span>
                                 <span>
                                    <IconFont type="icon-zongyonghushu" /> {{ voc.userList?.length || 0 }}
                                 </span>
                              </div>
                              <!-- 日期 -->
                              <div class="text-sm">
                                 <p class="text-center">
                                    <IconFont type="icon-shijian" /> {{ voc.createTime.slice(0, 10) }}
                                 </p>
                              </div>
                           </div>
                           <!-- 头像 -->
                           <div class="absolute  right-5 md:-top-4">
                              <div class="avatar flex items-center rounded-full ring ring-base-200">
                                 <div class="w-8 rounded-full">
                                    <img :src="voc.author?.avatar" />
                                 </div>
                                 <!-- <span class="ml-2">34654833</span> -->
                              </div>
                           </div>
                        </div>
                     </li>
                  </TransitionGroup>
               </ul>
               <!-- 空数据状态 -->
               <a-empty v-else class="mt-20 text-gray-400" />
            </div>
         </Transition>
      </div>

      <!-- 编辑弹框 -->
      <dialog id="editClassesEl" class="modal">
         <div class="modal-box">
            <h3 class="font-bold text-lg mb-5">编辑班级信息</h3>
            <div>
               <a-form :model="editClasses" ref="editClassesRef">
                  <a-form-item name="name" :rules="{ required: true, message: '请输入班级名称' }">
                     <label class="form-control w-full">
                        <div class="label"><span class="label-text">名称</span></div>
                        <input type="text" v-model="editClasses.name" class="my-form-input-sm" />
                     </label>
                  </a-form-item>
                  <a-form-item name="info">
                     <label class="form-control w-full">
                        <div class="label"><span class="label-text">描述</span></div>
                        <!-- <input type="text" class="my-form-input-sm" /> -->
                        <textarea v-model="editClasses.info"
                           class="textarea textarea-xs textarea-bordered text-base-content"></textarea>
                     </label>
                  </a-form-item>
                  <a-form-item name="annc">
                     <label class="form-control w-full">
                        <div class="label"><span class="label-text">公告</span></div>
                        <textarea v-model="editClasses.annc"
                           class="textarea textarea-xs textarea-bordered text-base-content"></textarea>
                     </label>
                  </a-form-item>
               </a-form>
            </div>
            <div class="modal-action">
               <form method="dialog">
                  <!-- if there is a button in form, it will close the modal -->
                  <button class="btn">取消</button>
               </form>
               <button class="btn btn-primary" @click="editClassesHandler">确定</button>
            </div>
         </div>
      </dialog>
   </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { ref } from "vue";
import { ClassesAPI } from "@/api/classes";
import type { Classes } from "@/types/classes";
import { useUserStore } from "@/stores/userStore";
import IconFont from "@/utils/iconFont";
import type { Vocabulary } from "@/types/vocabulary";
import type { FormExpose } from "ant-design-vue/es/form/Form";
import { message } from "ant-design-vue";
import router from "@/router";
import type { User } from "@/types/user";
import { MyUtils } from "@/utils";
import { useSocketStore } from "@/stores/socketStore";
import { storeToRefs } from "pinia";

const { onlineUidList } = storeToRefs(useSocketStore());
const userStore = useUserStore();
// 路由对象
const route = useRoute();
// 选项卡的选择
const tabValue = ref('1');
// 是否是自己创建的
const isSelf = ref(false);
// 自己是否是成员
const isMember = ref(false)
// 班级数据
const classes = ref<Classes>({
   id: "",
   annc: "",
   creatorUid: "",
   info: "",
   name: "",
   userList: [],
   creator: {
      id: "",
      username: "",
      avatar: "",
      email: "",
      sex: ""
   }
})
// 班级成员的词集列表
const vocList = ref<Vocabulary[] | null>(null);
// 获取词集时 loading
const vocLoading = ref(false);
// 当前编辑的班级数据
const editClasses = ref<Classes>({
   id: "",
   annc: "",
   creatorUid: "",
   info: "",
   name: "",
   userList: [],
   creator: {
      id: "",
      username: "",
      avatar: "",
      email: "",
      sex: ""
   }
})
// 当前选中的用户
const currentUser = ref<User>({
   id: "",
   username: "",
   avatar: "",
   email: "",
   sex: ""
});
// 组件 form 实例 (用于表单校验)
const editClassesRef = ref<FormExpose | null>(null);
// 是否显示确认框 【解散班级】
const showConfirm = ref(false);
// 是否显示确认框 【移除成员】
const showRemoveMemberConfirm = ref(false);
// 是否显示确认框 【退出班级】
const showQuitConfirm = ref(false);



getClasses()



// 打开聊天窗口
function openChatWindow() {
   let onlineDialog: HTMLDialogElement | null = document.querySelector("#onlineBox")
   if (onlineDialog) {
      onlineDialog.showModal()
   }
}
// 用户退出班级 【确认框确认】
async function quitClasses() {
   let result = await ClassesAPI.quitClasses({ uid: userStore.userInfo!.id, cid: classes.value.id! });
   if (result.code == 20000) {
      MyUtils.alert("退出成功", "success");
      getClasses();
      getVocListByClassesUser(true);
      showQuitConfirm.value = false;
   } else {
      MyUtils.alert(result.message, 'error');
   }
}
// 用户加入班级
async function joinClasses() {
   let result = await ClassesAPI.joinClasses({ uid: userStore.userInfo!.id, cid: classes.value.id! });
   if (result.code == 20000) {
      MyUtils.alert(result.message, 'success')
      getClasses();
      getVocListByClassesUser(true);
   } else {
      MyUtils.alert(result.message, 'error')
   }
}
// 移除成员弹框 【确认】
async function removeMemberConfirmHandler() {
   // console.log({ uid: currentUser.value?.id, cid: classes.value.id });
   let result = await ClassesAPI.quitClasses({ uid: currentUser.value.id, cid: classes.value.id! });
   if (result.code == 20000) {
      // message.success(result.message);
      MyUtils.alert(result.message, 'success')
      getClasses();
      getVocListByClassesUser(true);
      showRemoveMemberConfirm.value = false;
   } else {
      // message.error(result.message);
      MyUtils.alert(result.message, 'error')
   }
}
// 成员列表 【移除按钮】
function listRemoveMember(u: User) {
   currentUser.value = u;
   MyUtils.modal('操作确认', `您确定要移除 ${currentUser.value.username} 吗？`, removeMemberConfirmHandler)
}
// 删除班级 【确认框确认】
async function delClassesConfirmHandler() {
   let result = await ClassesAPI.deleteClasses(classes.value.id!);
   if (result.code == 20000) {
      MyUtils.alert('操作成功', 'success');
      router.push("/user")
   }
}
// 操作栏 【编辑按钮】
function controlsTabEdit() {
   editClasses.value = JSON.parse(JSON.stringify(classes.value));
   delete editClasses.value.userList;
   let editClassesEl = document.querySelector("#editClassesEl") as HTMLDialogElement;
   editClassesEl.showModal();
}
// 编辑弹框 【确定按钮】
async function editClassesHandler() {
   try {
      await editClassesRef.value?.validate()
      let result = await ClassesAPI.updateClasses(editClasses.value);
      if (result.code == 20000) {
         message.success(result.message);
         getClasses();
      }
      let editClassesEl = document.querySelector("#editClassesEl") as HTMLDialogElement;
      if (editClassesEl) {
         editClassesEl.close()
      }
   } catch (error) {
      console.log('表单验证失败');
   }
}
// 选项卡选择 handler
function tabSelectHandler(e: Event) {
   let element = e.target as HTMLElement;
   if (element.tagName == 'A') {
      // console.log(element.getAttribute("data-key"));
      tabValue.value = element.getAttribute("data-key")!;

      if (tabValue.value == '2') {
         getVocListByClassesUser();
      }
   }
}
// 获取班级数据
async function getClasses() {
   isMember.value = false;
   isSelf.value = false;
   let result = await ClassesAPI.getClasses(route.params.id as string)
   classes.value = result.data
   // 是否是自己的班级
   if (classes.value.creator!.id == userStore.userInfo?.id) isSelf.value = true;
   // 是否是成员
   if (classes.value.userList?.find(user => user.id == userStore.userInfo?.id)) isMember.value = true;
}
// 根据班级ID获取所有成员的词集列表
async function getVocListByClassesUser(force?: boolean) {
   if (vocList.value == null || force) {
      vocLoading.value = true;
      let result = await ClassesAPI.getVocListByClassesUser(route.params.id as string)
      vocList.value = result.data;
      vocLoading.value = false;
   }
}
</script>

<style>
.gradation {
   background-image: linear-gradient(to right, #243949 0%, #517fa4 100%);
}
</style>