<template>
   <Transition name="chatBox">
      <!-- 聊天窗口 -->
      <div id="onlineBox" v-show="chatWindowShow" class="modal opacity-100 pointer-events-auto">
         <div class="modal-box max-w-[1000px] min-h-[400px]">
            <h3 class="font-bold text-lg mb-3">
               OnlineChat
               <span v-if="currentChatUser" class="text-xs font-[500]">当前与 {{ currentChatUser.username }} 聊天中</span>
            </h3>
            <div class="h-[600px] flex overflow-hidden relative">
               <!-- 切换按钮 -->
               <div class="tooltip tooltip-right transition-all absolute z-10 top-1/2 -translate-x-1/2 hover:translate-x-0"
                  data-tip="用户列表">
                  <button @click="hideUserList = !hideUserList" class="btn btn-circle btn-sm">
                     <IconFont type="icon-celanshouqi" />
                  </button>
               </div>
               <!-- 用户列表 -->
               <div class="w-[280px] overflow-auto transition-all bg-base-200/20"
                  :class="{ 'absolute -translate-x-full': hideUserList }">
                  <!-- 项 -->
                  <div v-for="(item, index) in userListMerge" :key="index" class="bg-base-200/50 transition-all rounded-lg h-[60px] flex items-center justify-between
                   mb-1 hover:bg-base-200 cursor-pointer border border-transparent" @click="selectUser(item);"
                     :class="{ 'myActive': currentChatUser?.id == item.id }">
                     <!-- 头像 -->
                     <div class="avatar mx-2" :class="onlineUidList.includes(item.id) ? 'online' : 'offline'">
                        <div class="size-[50px] rounded-full">
                           <img :src="item.avatar" />
                        </div>
                     </div>
                     <!-- 用户名与信息 -->
                     <div class="flex-1 flex flex-wrap">
                        <p class="w-full">{{ item.username }}</p>
                        <span class="text-gray-500 text-sm">{{ item.email }}</span>
                     </div>
                     <!-- 操作按钮 -->
                     <div class="mr-2">
                        <!-- 未读消息数 -->
                        <div v-if="unreadMsgObj[item.id]" class="badge badge-error">{{ unreadMsgObj[item.id] }}</div>
                     </div>
                  </div>
                  <!-- 班级群 -->
                  <div v-if="classes"
                     class="h-[60px] flex items-center bg-base-200/20 hover:bg-base-200 rounded-md w-full">
                     <!-- 头像组合 -->
                     <div class="flex flex-wrap justify-center w-[65px] h-full rounded-lg mx-1 bg-base-300">
                        <!-- 渲染classesUserList数据最多4次 -->
                        <template v-for="(item, index) in classesUserList.slice(0, 4)" :key="index">
                           <img class="size-[calc((100%-10px)/2)] m-[2px] rounded-lg object-cover bg-white"
                              :src="item.avatar" alt="avatar">
                        </template>
                     </div>
                     <!-- 名称和其它数据 -->
                     <div class="flex-1 flex flex-wrap content-center">
                        <p class="w-full">{{ classes.name }}</p>
                        <span class="text-gray-500 text-sm">班级群</span>
                     </div>
                     <!-- 未读消息数 -->
                     <div class="mr-2">
                        <div class="badge badge-error">1</div>
                     </div>
                  </div>
               </div>
               <!-- 聊天盒 -->
               <div class="flex-1 px-2 flex flex-col">
                  <!-- 未选择显示 -->
                  <div v-if="!currentChatUser" class="flex flex-wrap content-center justify-center size-full">
                     <img class=" max-w-[300px]" src="../assets/img//select-u.svg">
                     <p class="text-center w-full text-gray-500">请选择用户</p>
                  </div>
                  <template v-else>
                     <!-- 聊天记录内容 -->
                     <div class="chatBox flex-1 overflow-y-auto">
                        <div @click="msgSpecialProgram" v-for="(item, index) in targetChat" :key="index" class="chat"
                           :class="item.senderId == currentChatUser.id ? 'chat-start' : 'chat-end'">
                           <div class="chat-image avatar">
                              <div class="w-10 rounded-full">
                                 <!-- 头像 -->
                                 <img alt="头像"
                                    :src="(item.senderId == userStore.userInfo?.id ? userStore.userInfo?.avatar : (userListMerge.find(u => u.id == item.senderId)?.avatar))" />
                              </div>
                           </div>
                           <!-- 内容 -->
                           <!-- <div class="chat-bubble">{{ item.message }}</div> -->
                           <div class="chat-bubble" v-html="item.message"></div>
                           <!-- 反馈 -->
                           <div v-if="item.senderId != currentChatUser.id" class="chat-footer opacity-50">
                              <!-- {{ item.timestamp }} -->
                              {{ item.isRead == 0 ? "已读" : "未读" }}
                           </div>
                        </div>
                     </div>
                     <!-- 输入消息框 -->
                     <div class="flex flex-wrap mb-2">
                        <!-- 离线提示 -->
                        <div v-show="!targetUserStatus"
                           class="flex justify-center items-center gap-2 p-2 w-full text-orange-400">
                           <IconFont type="icon-jinggao" />
                           <span class="text-sm">对方处于离线状态，您发送的消息将会在对方上线后进行推送</span>
                        </div>
                        <!-- 发送的图片预览队列 -->
                        <div v-if="imgFiles.length" id="imgBox"
                           class="border rounded-lg w-full h-[100px] flex gap-2 overflow-x-auto mb-2 relative">
                           <progress v-show="uploadProgress > 0 && uploadProgress < 100"
                              class="progress progress-accent w-full absolute bottom-0" :value="uploadProgress"
                              max="100"></progress>
                           <div v-for="(item, index) in imgFiles" :key="index" class="w-[100px]">
                              <img :src="getFileUrl(item)" />
                           </div>
                        </div>
                        <!-- 按钮 -->
                        <div class="w-full gap-2 flex items-center relative">
                           <!-- 选择表情按钮 -->
                           <button @click.stop="closeMsgBtnContainer($event, 1)" class="btn btn-sm btn-circle">
                              <IconFont type="icon-biaoqing" />
                           </button>
                           <!-- 选择词集按钮 -->
                           <button @click.stop="closeMsgBtnContainer($event, 2)" class="btn btn-sm btn-circle">
                              <IconFont type="icon-xuexiku" />
                           </button>
                           <!-- 选择链接按钮 -->
                           <button class="btn btn-sm btn-circle">
                              <IconFont type="icon-lianjie" />
                           </button>
                           <!-- 选择用户按钮 -->
                           <button class="btn btn-sm btn-circle">
                              <IconFont type="icon-yonghu" />
                           </button>
                           <TransitionGroup name="one">
                              <!-- 表情选择容器 -->
                              <div v-if="inputBoxUpBtns == 1" key="emoji" role="emoji" class="bg-base-200/95 absolute -top-[240px] w-[80%] max-w-[500px] h-[230px] left-0 overflow-y-auto
                                  flex flex-wrap justify-between items-start p-2 rounded-lg gap-2">
                                 <!-- 历史选择 -->
                                 <div v-show="historyEmoji.length" class="w-full border-b border-gray-500/50 pb-2">
                                    <div class="flex flex-wrap gap-2">
                                       <div v-for="( item, index ) in  historyEmoji " :key="index"
                                          @click="handleEmojiClick"
                                          class="size-[35px] cursor-pointer hover:scale-125 transition-all">
                                          <img :src="`/douyinemoji/${item}`" />
                                       </div>
                                    </div>
                                 </div>
                                 <!-- 项 -->
                                 <div v-for="( item, index ) in  emojiFiles " :key="index" @click="handleEmojiClick"
                                    class="size-[35px] cursor-pointer hover:scale-125 transition-all">
                                    <img :src="`/douyinemoji/${item}`" />
                                 </div>
                              </div>
                              <!-- 选择词集容器 -->
                              <div key="voc" role="voc" v-else-if="inputBoxUpBtns == 2"
                                 class="bg-base-200 shadow-md rounded-lg w-[80%] h-[350px] absolute -top-[360px] p-2 flex flex-wrap flex-col">
                                 <div class="flex items-center w-full p-2">
                                    <p class="font-bold text-lg">筛选：</p>
                                    <input class="input input-sm" v-model="filterVocKey" type="text">
                                 </div>
                                 <div class="w-full flex-1 mt-2 flex flex-wrap overflow-y-auto gap-1">
                                    <!-- 项 -->
                                    <div v-for="( voc, index ) in  filterVocList " :key="index"
                                       @click="handleVocClick(voc)"
                                       class="bg-base-300 md:w-[49%] h-[100px] flex rounded-xl overflow-hidden cursor-pointer">
                                       <div class="w-[100px] bg-gray-500/50 flex items-center justify-center text-4xl">📖
                                       </div>
                                       <div class="flex-1 flex flex-wrap content-center pl-2 gap-x-3">
                                          <!-- 标题 -->
                                          <div class="w-full flex items-center">
                                             <p class="font-bold text-lg mb-2">{{ voc.title }}</p>
                                          </div>
                                          <!-- 作者与数量 -->
                                          <div class="avatar placeholder flex items-center">
                                             <div class="bg-neutral text-neutral-content rounded-full size-5 mr-2">
                                                <img :src="voc.author?.avatar" />
                                             </div>
                                             <span>{{ voc.author?.username }}</span>
                                          </div>
                                          <p class="text-sm flex items-center">
                                             <IconFont type="icon-icon-test" />
                                             <span class="ml-1">{{ voc.count }}</span>
                                          </p>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </TransitionGroup>
                        </div>
                        <!-- 输入框 -->
                        <div class="flex w-full mt-2 gap-2">
                           <!-- <textarea v-model="inputMsg" rows="2" placeholder="输入消息" @paste="pasteHandler"
                                 class="textarea bg-base-200 textarea-xs flex-1" @keydown.enter="sendMsg"></textarea> -->
                           <div contenteditable ref="inputMsgBoxRef" @paste.prevent="pasteHandler"
                              class="textarea bg-base-200 textarea-xs flex-1" @keydown.enter="sendMsg">
                           </div>
                           <button v-if="!(uploadProgress > 0 && uploadProgress < 100)" @click="sendMsg"
                              class="btn btn-success">发送</button>
                           <button v-else class="btn">
                              <span class="loading loading-spinner"></span>
                              上传图片中
                           </button>
                        </div>
                     </div>
                  </template>
               </div>
            </div>
            <!-- 关闭窗口 -->
            <button @click="socketStore.chatWindowShow = false"
               class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
         </div>
            <!-- 预览图片 -->
            <a-image :style="{ display: 'none' }" :preview="{
               visible: previewVisible, onVisibleChange: setVisible
            }" :src="previewImage" />
      </div>
   </Transition>
</template>

<script setup lang="ts">
import { ref, watch, computed, onBeforeUnmount } from "vue";
import { useSocketStore } from "@/stores/socketStore";
import { useUserStore } from "@/stores/userStore";
import IconFont from "@/utils/iconFont";
import type { User } from "@/types/user";
import { storeToRefs } from "pinia";
import { UserAPI } from "@/api/user";
import { MyUtils } from "@/utils";
import _ from "lodash";
import type { UserMessage } from "@/types/other";
import router from "@/router";
import type { AxiosProgressEvent } from "axios";
import { OtherAPI } from "@/api/other";
import { useStorage } from '@vueuse/core'
import { VocabularyAPI } from "@/api/vocabulary";
import type { Vocabulary } from "@/types/vocabulary";
import type { Classes } from "@/types/classes";
import { ClassesAPI } from "@/api/classes";


const socketStore = useSocketStore();
const userStore = useUserStore();
// 历史表情 响应式存储
const historyEmoji = useStorage<string[]>('historyEmoji', [])

const { onlineUidList } = storeToRefs(socketStore)

withDefaults(
   defineProps<{
      chatWindowShow?: boolean;
   }>(),
   // 默认值
   {
      chatWindowShow: false,
   }
);
console.log("online-window 程序已加载");
onBeforeUnmount(() => {
   console.log("online-window 程序已卸载");
   // 关闭连接
   socketStore.close()
})
// 当前聊天的用户
const currentChatUser = ref<User>();
// 隐藏用户列表 flag
const hideUserList = ref(false);
// 在线用户列表
const onlineList = ref<User[]>([])
// 班级成员列表
const classesUserList = ref<User[]>([])
// 计算属性：在线用户列表和班级成员列表的合并
const userListMerge = computed(() => {
   let data = _.uniqBy(onlineList.value.concat(classesUserList.value), "id")
   // 排除自己
   data = data.filter(u => u.id != userStore.userInfo!.id)
   return data
})
// 计算属性：与当前选中用户的聊天信息 【聊天记录数据处理】
const targetChat = computed(() => {
   // 滚动到底部 [TODO:临时解决方案，后续优化]
   setTimeout(() => {
      let chatBox = document.querySelector(".chatBox") as HTMLDivElement;
      if (chatBox) {
         chatBox.scrollTop = chatBox.scrollHeight
      }
   });

   // 过滤出当前选中用户的聊天记录
   let data = chatContent.value.filter(item => {
      return item.receiverId == currentChatUser.value!.id && item.senderId == userStore.userInfo!.id
         || item.receiverId == userStore.userInfo!.id && item.senderId == currentChatUser.value!.id
   })

   // 将聊天内容中的图片转换为img标签
   data.forEach(item => {
      // 匹配图片
      let reg = /!\[图片\]\((.*?)\)/g;
      item.message = item.message.replace(reg, `<img style="display: inline-block;" src="$1" class="chat-bubble-img">`)

      // 匹配表情
      let emojiReg = /!\[表情\]\((.*?)\)/g;
      item.message = item.message.replace(emojiReg, `<div class="emoji-div" role="emoji" style="background-image: url(/douyinemoji/$1)"></div>`)

      // 匹配词集 (先提取id，再根据id获取词集信息，然后以模版字符串替换)
      let vocReg = /!\[词集\]\((.*?)\)/g;
      let vocId = vocReg.exec(item.message)?.[1]
      // console.log('vocId', vocId);
      if (vocId) {
         // let voc = userVocList.value.find(v => v.id == vocId)
         VocabularyAPI.getVocabulary(vocId).then(res => { // 由于是异步请求 TODO: 闪屏问题 (后续添加loading)
            if (res.code == 20000) {
               let voc = res.data
               item.message = item.message.replace(vocReg, `
                  <div role="voc" data-cid="${voc.id}" class="bg-base-300 h-[100px] flex rounded-xl overflow-hidden cursor-pointer">
                     <div class="w-[100px] bg-gray-500/50 flex items-center justify-center text-4xl">📖</div>
                     <div class="flex-1 flex flex-wrap content-center pl-2 gap-x-3 text-base-content">
                        <div class="w-full flex items-center">
                           <p class="font-bold text-lg mb-2">${voc.title}</p>
                        </div>
                        <div class="avatar placeholder flex items-center">
                           <div class="bg-neutral text-neutral-content rounded-full size-5 mr-2">
                              <span role="img" class="anticon"><svg width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" class=""><use xlink:href="#icon-yonghu"></use></svg><!----></span>
                           </div>
                           <span>${voc.author?.username}</span>
                        </div>
                        <p class="text-sm flex items-center">
                           <span role="img" class="anticon"><svg width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" class=""><use xlink:href="#icon-icon-test"></use></svg><!----></span>
                           <span class="ml-1">${voc.count}</span>
                        </p>
                     </div>
                  </div>
               `)
            }
         })
      }
   })
   return data;
})
// 计算属性：当前选中用户的状态
const targetUserStatus = computed(() => {
   return onlineUidList.value.includes(currentChatUser.value!.id)
})
// 聊天内容输入框
// const inputMsg = ref("")
// 聊天内容 (总)
const chatContent = ref<UserMessage[]>([]);
// 未读消息对象
const unreadMsgObj = ref<{ [key: string]: number }>({})
// 图片文件队列
const imgFiles = ref<File[]>([])
// 上传进度
const uploadProgress = ref(0)
// 上传完成图片列表 (markdown格式) 【![流汗黄豆](E:\传智课堂\img\流汗黄豆.png)】
const uploadImgMDList = ref<string[]>([])
// 预览图片 flag
const previewVisible = ref(false)
// 显示预览图片
const setVisible = (value: boolean): void => {
   previewVisible.value = value;
};
// 预览的图片地址
const previewImage = ref("")
// 表情文件列表
const emojiFiles = getFilesInPublicFolder()
// 输入内容元素 ref
const inputMsgBoxRef = ref<HTMLDivElement | null>(null)
// 词集列表
const userVocList = ref<Vocabulary[]>([])
// 筛选词集关键词
const filterVocKey = ref("")
// 计算属性：筛选词集列表
const filterVocList = computed(() => {
   return userVocList.value.filter(item => item.title.includes(filterVocKey.value))
})
// 统一：输入框上方按钮开关 (0:关闭 1:表情 2:词集 3:链接 4:用户)
const inputBoxUpBtns = ref<0 | 1 | 2 | 3 | 4>(0)
// 班级
const classes = ref<Classes>()



if (userStore.userInfo) {
   // 添加自己到在线用户列表中
   // onlineList.value.push(userStore.userInfo)
   // 连接
   socketStore.connect(userStore.userInfo.id)
   if (userStore.userInfo.classes) {
      // 获取班级成员
      getUserListByCid(userStore.userInfo.classes.id!)
      // 获取班级数据
      getClasses()
   } else {
      console.log("未加入班级");
   }
   // 获取未读消息
   getUnreadMsg()
   // 获取用户词集列表
   getUserAllVocListByUid()
} else {
   // MyUtils.alert("请先登录")
   // router.push("/login")
}




// 获取班级数据
async function getClasses() {
   let result = await ClassesAPI.getClasses(userStore.userInfo!.classes!.id!)
   classes.value = result.data
}
// 词集点击事件 【发送】
function handleVocClick(voc: Vocabulary) {
   let userMessage: UserMessage = {
      id: 0,
      senderId: userStore.userInfo!.id,
      receiverId: currentChatUser.value!.id,
      message: `![词集](${voc.id})`,
      timestamp: new Date().toLocaleTimeString(), // 仅本地显示 后端会再次处理
      isRead: 1,
      type: 0
   }
   socketStore.send(userMessage)
   // 添加到聊天记录到本地
   chatContent.value.push(userMessage)
   // 关闭词集选择容器
   inputBoxUpBtns.value = 0
}
// 获取用户学习的词集列表
async function getUserAllVocListByUid() {
   // if (userRelevanceVocList.value!.length > 0) return;
   let result = await VocabularyAPI.getUserRelevanceVocListByUid(userStore.userInfo!.id);
   if (result.code == 20000) {
      userVocList.value.push(...result.data);
   } else {
      console.log("获取用户学习的词集列表失败");
   }
   let vocListRes = await VocabularyAPI.getVocabularyListByUid(userStore.userInfo!.id);
   if (vocListRes.code == 20000) {
      userVocList.value.push(...vocListRes.data);
   } else {
      console.log("获取用户发布的词集列表失败");
   }
   // 去重
   userVocList.value = _.uniqBy(userVocList.value, "id")
}
// 处理输入框内容 (将内容里的表情(div role=emoji) 转换为 ![表情](名称.png) 且保持表情和文字的顺序)
function processInputBox() {
   let inputContent = "";
   let inputMsgBox = document.querySelector("[contenteditable]") as HTMLDivElement;
   inputMsgBox.childNodes.forEach((item) => {
      if (item.nodeType == 3) {
         // 文字
         inputContent += item.nodeValue
      } else {
         // 表情
         let div = item as HTMLDivElement;
         // 获取地址
         let url = div.style.backgroundImage?.replace(/url\(\"(.*)\"\)/, "$1")
         // 获取名称
         let name = url?.split("/").pop()?.split(".")[0]
         inputContent += `![表情](${name}.png)`
      }
   })
   return inputContent;
}
// 点击表情事件
function handleEmojiClick(e: Event) {
   if ((<HTMLElement>e.target).tagName == "IMG") {
      let img = e.target as HTMLImageElement;
      // 插入到输入框 (div背景图片)
      let div = document.createElement("div");
      div.className = "emoji-div";
      div.setAttribute("role", "emoji")
      div.style.backgroundImage = `url(${img.src})`;
      div.setAttribute("contenteditable", "false")
      inputMsgBoxRef.value!.innerHTML += div.outerHTML
      // inputBoxUpBtns.value = 0 // 关闭表情选择

      // 保存文件名到本地存储 (最多保存11条数据,不重复，最新的在最前面)
      let emojiName = img.src.split("/").pop() as string;
      let emojiList = historyEmoji.value;
      // 去重
      emojiList = emojiList.filter((item: string) => item != emojiName)
      // 最多11条
      if (emojiList.length >= 11) {
         emojiList.pop()
      }
      // 添加到最前面
      emojiList.unshift(emojiName)
      historyEmoji.value = emojiList
   }
}
// 获取 public 文件夹下的表情文件列表
function getFilesInPublicFolder() {
   const files = import.meta.glob('/public/douyinemoji/*');
   const fileNames = Object.keys(files);
   // 去除路径
   fileNames.forEach((item, index) => {
      fileNames[index] = item.replace("/public/douyinemoji/", "")
   })
   return fileNames;
}
// 聊天消息特殊程序
function msgSpecialProgram(e: Event) { // 事件委托
   let el = e.target as HTMLElement;
   // console.log(el.tagName);
   // 图片
   if (el.tagName == "IMG") {
      const src = el.getAttribute("src");
      if (src) {
         previewImage.value = src;
         setVisible(true);
      }
   }
   // // 词集 (元素递归的去获取role=voc的元素, 得到词集id，然后跳转到词集详情页)
   // if (el.tagName == "DIV") {
   //    while (el.getAttribute("role") != "voc") {
   //       el = el.parentElement as HTMLElement
   //    }
   //    let vocId = el.getAttribute("data-cid")
   //    if (vocId) {
   //       router.push(`/vocabulary/${vocId}`)
   //    }
   // }

   // 处理词集点击 (使用closest方法来查找具有role="voc"属性的祖先元素，以替代原先的循环遍历父元素的方式，提高代码的简洁性和效率)
   let ancestor = el.closest('[role="voc"]');
   if (ancestor) {
      const vocId = ancestor.getAttribute("data-cid");
      if (vocId) {
         router.push(`/vocabulary/${vocId}`);
         socketStore.chatWindowShow = false;
      }
   }


}
// 获取文件的url
function getFileUrl(file: File) {
   return URL.createObjectURL(file);
}
// 批量上传图片
async function uploadImg() {
   if (!imgFiles.value.length) return;
   console.log("开始批量上传图片");
   // forEach 不能使用 async
   for (let index = 0; index < imgFiles.value.length; index++) {
      const file = imgFiles.value[index];
      let fileData = new FormData()
      fileData.append("file", file)
      let result = await OtherAPI.imageUpl(fileData, (e: AxiosProgressEvent) => {
         // 计算上传进度 (根据文件数量计算，此时的进度是所有文件的总进度,包括单文件的进度)
         uploadProgress.value = (index) / imgFiles.value.length * 100 + e.loaded / e.total! / imgFiles.value.length * 100;
         console.log(uploadProgress.value);
      })
      if (result.code != 20000) return new Error(result.message)

      // // 计算上传进度
      // uploadProgress.value = (imgFiles.value.indexOf(file) + 1) / imgFiles.value.length * 100

      // 以markdown格式保存
      uploadImgMDList.value.push(`![图片](${result.data})`)
   }
}
// 输入框粘贴事件 【处理图片】
function pasteHandler(e: ClipboardEvent) {
   let clipboardData = e.clipboardData; //获取粘贴板数据
   // 获取粘贴板文本
   // let text = clipboardData?.getData("text");
   // console.log(text);

   // let imgBox = document.getElementById("imgBox") as HTMLDivElement;
   // 文件对象
   let files = clipboardData?.files as FileList;
   for (const key in files) {
      // 判断是否是图片
      if (typeof files[key] == "object" && files[key].type.includes("image")) {
         // 添加到待上传队列
         imgFiles.value.push(files[key])
         // 预览 (Base64)
         // let img = new Image();
         // let reader = new FileReader();
         // reader.onload = function (e) {
         //    img.src = e.target?.result as string;
         // }
         // img.style.width = "100px";
         // reader.readAsDataURL(files[key]); // 读取文件
         // // 插入到元素
         // imgBox.appendChild(img);
      }
   }
}
// 选择用户事件
async function selectUser(user: User) {
   currentChatUser.value = JSON.parse(JSON.stringify(user))
   // // 关闭用户列表
   hideUserList.value = true
   // 拉取历史聊天记录
   getChatRecord()
   // 将当前用户的消息设置为已读
   // console.log(unreadMsgObj.value);
   if (unreadMsgObj.value[user.id] > 0) {
      await UserAPI.markChatRecordAsRead(user.id, userStore.userInfo!.id)
      // 清空未读消息数
      unreadMsgObj.value[user.id] = 0
      await socketStore.overallSituationUnreadMsgHandler()
   }
}
// 接收聊天消息 【处理】
socketStore.socket?.addEventListener("message", (e) => {
   let userMessage = JSON.parse(e.data) as UserMessage;
   // 【私聊消息】
   if (userMessage.type == 0) {
      console.log("[online-windows] 收到消息:", userMessage.message);
      chatContent.value.push(userMessage)

      // // 通知获取消息
      if (currentChatUser.value) getChatRecord()

      // 【通知提示】 聊天窗口已打开就不再提示
      if (socketStore.chatWindowShow == false) {
         socketStore.receiveMsgNotification()
      }

      // 将当前用户的消息设置为已读
      if (currentChatUser.value?.id == userMessage.senderId) {
         UserAPI.markChatRecordAsRead(userMessage.senderId, userStore.userInfo!.id)
      }

      // 【未读消息程序】
      if (currentChatUser.value?.id != userMessage.senderId) { // 当前信息不是当前聊天对象发送的
         // 未读消息数 +1
         if (unreadMsgObj.value[userMessage.senderId]) {
            unreadMsgObj.value[userMessage.senderId]++
         } else {
            // 不存在则添加
            unreadMsgObj.value[userMessage.senderId] = 1
         }
         // 通知未读消息数变化
         socketStore.overallSituationUnreadMsgHandler()
      }
   }
   // 【已读反馈】
   if (userMessage.type == 4) {
      let data: { msg: string, id: number } = JSON.parse(userMessage.message)
      console.log("已读反馈", data);
      getChatRecord()
   }
});

// 获取聊天记录
async function getChatRecord() {
   if (userStore.userInfo?.id && currentChatUser.value?.id) {
      let result = await UserAPI.getChatRecordList(userStore.userInfo.id, currentChatUser.value.id)
      if (result.code == 20000) {
         chatContent.value.push(...result.data)
         // 去重 (因为在发送时有添加到 chatContent 中，在获取时会和数据库中的重复)
         // chatContent.value = _.uniqBy(chatContent.value, "id")
         // 去重排序 (因为数据会和本地数据合并引发顺序问题)
         // chatContent.value = _.sortBy(_.uniqBy(chatContent.value, "id"), "id")
         // 去重优先级：两条数据id相同，但时间不同，以时间最新的为准

         // 重复数据以时间最新的为准
         // 先排序再去重，这样得到的数据是最新的
         chatContent.value = _.uniqBy(_.sortBy(chatContent.value, "id"), "id")
         // 去除id为0的数据
         chatContent.value = chatContent.value.filter(item => item.id != 0)
      }
   } else {
      console.log("用户未登录或未选择聊天对象");
   }
}

// 发送消息
async function sendMsg() {
   // 去除回车
   // inputMsg.value = inputMsg.value.replace(/\n/g, "")
   let inputMsg = processInputBox()
   if (inputMsg == "" && !imgFiles.value.length) {
      // console.log("消息队列为空", inputMsg.value, imgFiles.value.length);
      console.log("消息队列为空");
      return
   };
   // 上传图片
   await uploadImg()
   if (currentChatUser.value) {
      let userMessage: UserMessage = {
         id: 0,
         senderId: userStore.userInfo!.id,
         receiverId: currentChatUser.value.id,
         message: inputMsg + uploadImgMDList.value.join("\n"),
         timestamp: new Date().toLocaleTimeString(), // 仅本地显示 后端会再次处理
         isRead: 1,
         type: 0
      }
      socketStore.send(userMessage)
      // 清空输入框
      inputMsgBoxRef.value!.innerHTML = ""
      // 添加到聊天记录到本地
      chatContent.value.push(userMessage)
      // 清除图片队列
      imgFiles.value = []
      // 清除上传进度
      uploadProgress.value = 0
      // 清除上传完成markdown图片列表
      uploadImgMDList.value = []
   } else {
      MyUtils.alert("请选择用户")
   }
}
// 获取班级成员列表
async function getUserListByCid(cid: string) {
   let result = await UserAPI.getUserListByCid(cid)
   if (result.code == 20000) {
      classesUserList.value = result.data
   }
}
// 获取未读消息
async function getUnreadMsg() {
   unreadMsgObj.value = {}
   let result = await UserAPI.getUnreadMessage(userStore.userInfo!.id)
   if (result.code == 20000) {
      let data = result.data
      // 未读消息数
      data.forEach((item: any) => {
         if (unreadMsgObj.value[item.senderId]) {
            unreadMsgObj.value[item.senderId]++
         } else {
            unreadMsgObj.value[item.senderId] = 1
         }
      });
      chatContent.value.push(...data)
   }
}

const closeMsgBtnContainerHandler = (e: Event) => {
   let el = e.target as HTMLElement;
   // console.log(el);
   // console.log(el.closest('[role="emoji"]'), el.closest('[role="voc"]'));
   // 使用closest 方法 是否有 role="emoji" 的祖先元素 (没有则关闭)
   if (!el.closest('[role="emoji"]') && !el.closest('[role="voc"]')) {
      inputBoxUpBtns.value = 0;
      document.removeEventListener("click", closeMsgBtnContainerHandler)
   }
};
// 打开选择容器 (0:关闭 1:表情 2:词集 3:链接 4:用户) 点击容器外关闭
function closeMsgBtnContainer(e: Event, type: 0 | 1 | 2 | 3 | 4) {
   inputBoxUpBtns.value = type
   e.stopPropagation()
   // 监听事件
   document.addEventListener("click", closeMsgBtnContainerHandler)
}

watch(
   // 监听在线用户列表变化
   () => onlineUidList.value,
   () => {
      // 更新用户列表
      UserAPI.getUserListByIdList(onlineUidList.value).then(res => {
         console.log("在线用户发生变化");
         onlineList.value = res.data
         // console.log(onlineList.value);
      })
   }
)
// 监听聊天窗口显示状态
watch(
   () => socketStore.chatWindowShow,
   () => {
      currentChatUser.value = undefined;
      hideUserList.value = false;
   }
)
</script>

<style lang="less">
// 用户列表 高亮
.myActive {
   background-color: oklch(var(--b2));
   border: 1px solid oklch(var(--p));
}

// 表情选择容器
.emoji-div {
   background-size: contain;
   background-repeat: no-repeat;
   width: 30px;
   height: 30px;
   margin: 0px 2px;
   vertical-align: middle;
   display: inline-block;
}

// 聊天图片
.chat-bubble-img {
   border-radius: 18px;
   max-width: 180px;

   &:hover {
      cursor: pointer;

      &:after {
         content: "点击预览";
         position: absolute;
         top: 0;
         left: 0;
         width: 100%;
         height: 100%;
         background-color: rgba(0, 0, 0, 0.5);
         color: white;
         display: flex;
         justify-content: center;
         align-items: center;
      }
   }
}

// 窗口动画
.chatBox-enter-active {
   animation: windowsShow 0.3s;
}

.chatBox-leave-active {
   animation: windowsHide 0.3s;
}



@keyframes windowsShow {
   0% {
      transform: scale(0.5);
   }

   100% {
      transform: scale(1);
   }
}

@keyframes windowsHide {
   0% {
      transform: scale(1);
   }

   100% {
      transform: scale(0.5);
   }

}
</style>