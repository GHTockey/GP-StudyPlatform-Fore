<template>
  <div class="my-type-center my-transition-all relative md:flex md:flex-wrap px-2">

    <!-- 标题 -->
    <h1 class="text-center font-bold text-2xl mb-3 w-full h-8 xl:text-left px-5">{{ vocabulary.title }}</h1>

    <!--卡片-->
    <div class="stack size-full md:w-[80%] lg:w-[60%] xl:w-[70%] xl:h-[380px] max-w-[850px]">
      <div class="tce-card-box p-2 size-full overflow-hidden md:overflow-visible">
        <!--翻转卡片-->
        <div ref="turnCardRef" class="transition-all select-none duration-300 cursor-pointer size-full"
          @click="turnCard">
          <div class="my-card-child">{{ vocabulary.wordsList?.[currentWordIndex]?.word }}</div>
          <div class="my-card-child size-full absolute top-0">{{
            vocabulary.wordsList?.[currentWordIndex].definition }}</div>
        </div>
      </div>
      <!--死卡片用于装饰-->
      <div v-for="i in 2" class="tce-card-box p-2 size-full">
        <!--翻转卡片-->
        <div class="select-none size-full">
          <div class="my-card-child"></div>
          <div class="my-card-child size-full absolute top-0"></div>
        </div>
      </div>
    </div>

    <!--卡片操作栏-->
    <div
      class="mt-8 flex justify-between p-2 border-b-2 border-gray-500 relative md:w-[80%] lg:w-[60%] xl:w-[70%] max-w-[850px]">
      <div>
        <div class="tooltip tooltip-bottom" data-tip="自动">
          <button class="btn btn-sm text-lg rounded-full">
            <IconFont type="icon-kaishi" />
          </button>
        </div>
      </div>
      <div class="flex items-center gap-5 absolute left-1/2 -translate-x-1/2">
        <div class="tooltip tooltip-bottom" data-tip="上一张">
          <button @click="togCard('prev')" class="btn btn-sm text-lg rounded-full">
            <IconFont type="icon-shangyige" />
          </button>
        </div>
        <div>
          {{ currentWordIndex + 1 }} / {{ vocabulary.wordsList?.length }}
        </div>
        <div class="tooltip tooltip-bottom" data-tip="下一张">
          <button @click="togCard('next')" class="btn btn-sm text-lg rounded-full">
            <IconFont type="icon-xiayige" />
          </button>
        </div>
      </div>
      <div>
        <div class="tooltip tooltip-bottom" data-tip="随机">
          <button class="btn btn-sm text-lg rounded-full">
            <IconFont type="icon-suijibofang" />
          </button>
        </div>
      </div>
    </div>

    <!-- 作者-操作栏 -->
    <div class="m-[18px_0] h-16 w-full bg-base-200 rounded-xl p-[0_18px] flex justify-between">
      <div class="avatar h-full min-w-[150px] flex items-center">
        <div class="h-12 rounded-full ring ring-primary/50 ring-offset-base-100 ring-offset-2">
          <img :src="vocabulary.author?.avatar" />
        </div>
        <div class="ml-3 h-full w-[100px] !flex content-center flex-wrap">
          <p class="font-[600] w-full">{{ vocabulary.author?.username }}</p>
          <p class="text-gray-500 text-xs">创建者</p>
        </div>
      </div>
      <div class="flex items-center gap-4">
        <button @click="userLearnVocabulary" :disabled="isLearn" class="btn btn-sm btn-info">{{ isLearn ? '已加入学习清单' :
          '添加至学习清单'
          }}</button>
        <template v-if="isSelf">
          <button @click="$router.push(`/vocabulary/edit/${vocabulary.id}`)"
            class="btn btn-sm btn-secondary">编辑</button>
          <button @click="MyUtils.modal('操作确认', `您确定将词集 【${vocabulary.title}】 删除吗？`, () => delVocabularyConfirm())"
            class="btn btn-sm btn-error">删除</button>
        </template>
        <template v-else>
          <button @click="MyUtils.alert('待开发')" class="btn btn-sm btn-warning">举报</button>
        </template>
      </div>
    </div>

    <!-- 模式选择 -->
    <div 
      class="my-4 flex flex-wrap md:absolute md:right-0 md:top-8 md:w-[20%] md:h-[calc(320px+72px)] lg:w-[40%] xl:w-[300px] xl:h-[calc(385px+72px)]">
      <!--  border-2 border-transparent hover:border-2 hover:border-primary -->
      <div class="tce-mode-select-btn my-voc-mode-box">
        <div @click="$router.push(`/vocabulary/fullscreenMode/${vocabulary.id}`)" class="tce-bg-gradient1 my-voc-mode-item">
          <p class="ml-5 font-bold absolute top-1/2 -translate-y-1/2">全屏</p>
          <IconFont class="my-voc-mode-icon" type="icon-quanping" />
        </div>
      </div>
      <div class="tce-mode-select-btn my-voc-mode-box">
        <div @click="$router.push(`/vocabulary/selectMode/${vocabulary.id}`)" class="tce-bg-gradient2 my-voc-mode-item">
          <p class="ml-5 font-bold absolute top-1/2 -translate-y-1/2">选择</p>
          <IconFont class="my-voc-mode-icon" type="icon-gf-select" />
        </div>
      </div>
      <div class="tce-mode-select-btn my-voc-mode-box">
        <div @click="$router.push(`/vocabulary/writeMode/${vocabulary.id}`)" class="tce-bg-gradient3 my-voc-mode-item">
          <p class="ml-5 font-bold absolute top-1/2 -translate-y-1/2">拼写</p>
          <IconFont class="my-voc-mode-icon" type="icon-kanshipinxie" />
        </div>
      </div>
      <div class="tce-mode-select-btn my-voc-mode-box">
        <div @click="MyUtils.alert('待开发')" class="tce-bg-gradient4 my-voc-mode-item">
          <p class="ml-5 font-bold absolute top-1/2 -translate-y-1/2">复习</p>
          <IconFont class="my-voc-mode-icon" type="icon-peidui" />
        </div>
      </div>
    </div>

    <!-- 词条列表 -->
    <div class="w-full">
      <div class="divider divider-start font-bold">词条列表</div>
      <div>
        <div v-for="(words, i) in vocabulary.wordsList" :key="i"
          class="bg-base-200/60 rounded-lg mb-2 flex justify-between items-center min-h-[100px]">
          <div class="pl-3 text-xl italic text-gray-400/50">{{ i + 1 }}</div>
          <div class="flex-1 ml-2 p-2 pb-3 mb-2">
            <p class="my-word-item-edit before:content-['词语'] border-b">{{ words.word }}</p>
          </div>
          <div class="flex-1 p-2 pb-3  mb-1">
            <p class="my-word-item-edit before:content-['定义'] border-b">{{ words.definition }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 
      TODO: 02/25
      下次进入复习模式
      操作栏按钮换位忘记和已掌握
      切换卡片时，卡片的动画效果
    -->

  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { VocabularyAPI } from "@/api/vocabulary";
import type { Vocabulary, Word } from "@/types/vocabulary";
import { MyUtils } from "@/utils";
import IconFont from "@/utils/iconFont"
import { useUserStore } from "@/stores/userStore";
import { useStorage } from '@vueuse/core';

const userStore = useUserStore();
const route = useRoute();

const isDark = useStorage("isDark", false);

// 词集数据
const vocabulary = ref<Vocabulary>({
  authorId: "", count: 0, cover: "", createTime: "", desc: "", id: "", title: "", updateTime: "",
  stuNum: 0
});
// 是否翻转
const isTurn = ref(false);
// 卡片实例
const turnCardRef = ref<HTMLDivElement | null>(null);
// 当前显示的词条索引
const currentWordIndex = ref(0);
// 是否是自己的词集
const isSelf = ref(false);
// 是否已参与学习
const isLearn = ref(false);


getVocabularyDetail();



// 删除词集 【确认】
async function delVocabularyConfirm() {
  let result = await VocabularyAPI.delVocbulary(vocabulary.value.id);
  if (result.code == 20000) {
    MyUtils.alert("操作成功", "success");
    getVocabularyDetail();
  } else {
    MyUtils.alert("操作失败", "error");
  }
}
// 用户学习词集
async function userLearnVocabulary() {
  let result = await VocabularyAPI.userLearnVocabulary({ vid: vocabulary.value.id, uid: userStore.userInfo?.id as string });
  if (result.code == 20000) {
    MyUtils.alert(result.message, "success");
    getVocabularyDetail();
  } else {
    MyUtils.alert(result.message, "error");
  }
}
// 切换卡片 handler
function togCard(behavior: 'prev' | 'next') {
  // console.log(turnCardRef.value, behavior);
  isTurn.value = false;
  turnCardRef.value!.style.transform = 'rotateX(0deg)';
  if (behavior == 'prev') { // 上一张
    turnCardRef.value!.classList.add('prev');
    currentWordIndex.value = currentWordIndex.value == 0 ? vocabulary.value.wordsList!.length - 1 : currentWordIndex.value - 1;
  } else { // 下一张
    turnCardRef.value!.classList.add('next');
    currentWordIndex.value = currentWordIndex.value == vocabulary.value.wordsList!.length - 1 ? 0 : currentWordIndex.value + 1;
  }
  turnCardRef.value!.addEventListener('animationend', () => {
    turnCardRef.value!.classList.remove('prev', 'next');
  });

}
// 翻转卡片 handler
function turnCard() {
  if (isTurn.value) {
    // 回到正面
    turnCardRef.value!.style.transform = 'rotateX(0deg)';
  } else {
    // 第一次翻转
    turnCardRef.value!.style.transform = 'rotateX(180deg)';
  }
  isTurn.value = !isTurn.value;
}
// 获取词集数据
async function getVocabularyDetail() {
  let result = await VocabularyAPI.getVocabulary(route.params.id as string);
  if (result.code == 20000) {
    // 判断是否是自己的词集
    isSelf.value = result.data.authorId == userStore.userInfo?.id;
    // 判断是否已参与学习
    isLearn.value = result.data.userList?.findIndex(item => item.id == userStore.userInfo?.id) != -1;
    return vocabulary.value = result.data;
  }
  MyUtils.alert(result.message, "error")
}


// watch(isDark, (newVal) => {
//   console.log('isDark', isDark.value);
// })
</script>

<style scoped lang="less">
.tce-card-box {
  /*开启3D效果*/
  perspective: 1000px;
  /*设置子元素的3D效果*/
  transform-style: preserve-3d;
  //transform: translateZ(10px);

  >div {
    /*开启3D效果*/
    //perspective: 800px;
    /*设置子元素的3D效果*/
    transform-style: inherit;
    //animation: word-turn 1s; // 点击

    :nth-child(2) {
      transform: translateZ(-1px) rotateX(180deg);
    }
  }
}

@keyframes word-turn {
  0% {
    transform: rotateX(0deg);
  }

  100% {
    transform: rotateX(180deg);
  }
}

@keyframes define-turn {
  0% {
    transform: rotateX(180deg);
  }

  100% {
    transform: rotateX(360deg);
  }
}

// 下一张动画 3d效果 从右到左滑动
@keyframes next {
  0% {
    transform: rotateY(-35deg) translateX(100px);
  }

  100% {
    transform: rotateY(0deg) translateX(0px);
  }
}

.next {
  animation: next .2s ease 0s;
}

// 上一张动画 3d效果 从左到右滑动
@keyframes prev {
  0% {
    transform: rotateY(35deg) translateX(-100px);
  }

  100% {
    transform: rotateY(0deg) translateX(0px);
  }
}

.prev {
  animation: prev .2s ease 0s;
}


// 背景渐变
.tce-bg-gradient1 {
  background-image: linear-gradient(to right, #0c3483 0%, #6b8cce 100%, #a2b6df 100%);
}

.tce-bg-gradient2 {
  background-image: linear-gradient(-60deg, #ff5858 0%, #f09819 100%);
}

.tce-bg-gradient3 {
  background-image: linear-gradient(-225deg, #65379B 0%, #886AEA 53%, #6457C6 100%);
}

.tce-bg-gradient4 {
  background-image: linear-gradient(to right, #1dae4d 0%, #17c134 0%, #8bd1bd 100%);
}

// 暗黑模式下的渐变色
.dark .tce-bg-gradient1 {
  background-image: linear-gradient(to right, #071a3a 0%, #3a4a6b 100%, #4a5a6d 100%);
}

.dark .tce-bg-gradient2 {
  background-image: linear-gradient(-60deg, #7a2323 0%, #a35c13 100%);
}

.dark .tce-bg-gradient3 {
  background-image: linear-gradient(-225deg, #2d1a3d 0%, #3d2e5a 53%, #2d2540 100%);
}

.dark .tce-bg-gradient4 {
  background-image: linear-gradient(to right, #0d4d23 0%, #0e5c1a 0%, #3a5d4d 100%);
}

// 
:hover.tce-mode-select-btn {
  >div {

    >span {
      transform: rotate(0) translateY(50%);
      bottom: 50%;
      filter: blur(0);
      color: white;
    }
  }
}
</style>