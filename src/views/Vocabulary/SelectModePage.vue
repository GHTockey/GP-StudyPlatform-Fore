<template>
   <div v-if="!isEnd"
      class="SelectModePage-container my-type-center max-w-[900px] relative h-full flex flex-col px-2 sm:px-0">
      <!-- 进度条 -->
      <progress class="progress progress-accent my-5 min-h-2" :value="learnedWords.length"
         :max="vocabulary.wordsList?.length"></progress>
      <!-- card -->
      <Transition name="toggle-card">
         <div v-show="transitionFlag" class="flex-1 flex items-center">
            <div class="w-full">
               <!-- 选项卡 -->
               <div>
                  <div class="flex justify-between">
                     <span class="text-xl">选择正确选项</span>
                     <span class="text-md">第 {{ learnNum }} 轮</span>
                  </div>
                  <div class="min-h-[200px] my-2 bg-base-200/50 rounded-lg flex justify-center items-center">
                     <p class="font-bold">{{ currentWord?.definition }}</p>
                  </div>
                  <!-- 选项 -->
                  <div class="flex flex-wrap justify-between">
                     <button ref="optionsRef" :data-key="item" v-for="(item, index) in options" :key="index"
                        @click="selectRight(item)" class="w-[calc((100%-0.5rem)/2)] mt-2 min-h-[50px] pl-12 py-3 h-auto rounded-lg
                     btn btn-info relative">
                        <kbd class="kbd text-gray-400 absolute left-2">{{ index + 1 }}</kbd>
                        <div class="text-sm font-normal">{{ item }}</div>
                     </button>
                  </div>
                  <div class="text-right mt-1">
                     <button @click="MyUtils.alert('todo')" class="btn btn-ghost">忘记了</button>
                  </div>
               </div>
            </div>
         </div>
      </Transition>
      <!-- 提示操作栏 -->
      <div class="overflow-y-hidden min-h-[80px]">
         <div ref="tipRef" style="display: none;"
            class="size-full bg-base-200 flex justify-between items-center rounded-t-xl">
            <!-- <div class="w-20">{{ isCorrect ? '对啦！' : '错啦！' }}</div> -->
            <div class="w-20">
               <img :src="`../../src/assets/img/${isCorrect ? 'ok' : 'error'}-emoji.webp`" alt="">
            </div>
            <div class="text-sm text-gray-500">
               <template v-if="!isCorrect">
                  <p class="text-center">别气馁！稍后您将会再次遇到它</p>
               </template>
               <template v-else>
                  <p class="text-center">泰裤辣！</p>
               </template>
               按下 <kbd class="kbd kbd-sm">space</kbd> 或者 <kbd class="kbd kbd-sm">Enter</kbd> 继续
            </div>
            <div class="pr-2">
               <button @click="continueEvent" class="btn btn-primary">继续</button>
            </div>
         </div>
      </div>
   </div>
   <!-- 结束 -->
   <div v-else class="hero h-full">
      <div class="hero-content text-center">
         <div class="max-w-md">
            <h1 class="text-5xl font-bold">泰裤辣!<br> 已学习完所有词条</h1>
            <p class="py-6">点燃内心，激发学习动力内心的热情和动力是学习的原动力，激发你的求知欲，让你在学习的道路上不断前行。</p>
            <div class="flex justify-center gap-2">
               <button @click="$router.push(`/vocabulary/${vocabulary.id}`)" class="btn btn-ghost">返回词集</button>
               <button @click="reLearn" class="btn btn-primary">再次学习</button>
            </div>
         </div>
      </div>
   </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import type { Vocabulary, Word } from "@/types/vocabulary";
import { ref } from "vue";
import lodash from "lodash";
import { VocabularyAPI } from "@/api/vocabulary";
import { MyUtils } from "@/utils";
import { UserAPI } from "@/api/user";
import { useUserStore } from "@/stores/userStore";

const route = useRoute();
// 词集数据
const vocabulary = ref<Vocabulary>({
   id: "",
   title: "",
   desc: "",
   cover: "",
   count: 0,
   authorId: "",
   createTime: "",
   updateTime: "",
   wordsList: [],
   stuNum: 0
});
// 当前词语
const currentWord = ref<Word>();
// 已经学习的词语
const learnedWords = ref<Word[]>([]);
// 随机生成的选项
const options = ref<string[]>([]);
// 选项ref
const optionsRef = ref<HTMLButtonElement[] | null>(null);
// 提示框ref
const tipRef = ref<HTMLDivElement | null>(null);
// 是否正确
const isCorrect = ref(true);
// 是否结束(学完了)
const isEnd = ref(false);
// 第几轮
const learnNum = ref(1);
// 键盘事件 (选择选项)
const keydownEventSeleceOption = (e: KeyboardEvent) => {
   // console.log('键盘事件-选项- (鉴定中)', e.key);
   switch (e.key) {
      case '1':
         selectRight(options.value[0]);
         break;
      case '2':
         selectRight(options.value[1]);
         break;
      case '3':
         selectRight(options.value[2]);
         break;
      case '4':
         selectRight(options.value[3]);
         break;
   }
};
// 键盘事件 (继续事件)
const keydownEventContinue = (e: KeyboardEvent) => {
   // console.log('键盘事件-继续- (监听中)', e.key);
   if (e.key == 'Enter' || e.key == ' ') {
      continueEvent();
   }
};
// 切换动画 flag
const transitionFlag = ref(false);


// 获取词集数据
getVocabulary(route.params.vid as string);
// 临时 页面加载完毕后随机获取一个词语
// setTimeout(() => {
//    console.log('start');
//    getRandomWord();
// }, 500);
// onMounted(() => {
//    console.log('start');
//    getRandomWord();
// })

// 学习结束再次学习事件
function reLearn() {
   isEnd.value = false;
   learnedWords.value = [];
   getRandomWord();
}
// 提示栏继续事件
function continueEvent() {
   // 移除键盘事件 监听继续事件
   window.removeEventListener('keydown', keydownEventContinue);
   // 隐藏提示框
   tipRef.value!.style.display = "none";
   if (isCorrect.value) {
      // 正确
      getRandomWord();
   } else {
      // 错误
      forgetWord();
   }
   // 重置选项
   optionsRef.value?.forEach(btn => {
      btn.disabled = false;
      btn.style.pointerEvents = 'auto';
      btn.classList.remove('btn-success', 'btn-error');
      btn.style.animation = '';
   })
}
// 显示提示框
function showTip() {
   tipRef.value!.style.display = "flex";
   tipRef.value!.style.animation = "tipShow .5s linear(0 0%, 0 2.27%, 0.02 4.53%, 0.04 6.8%, 0.06 9.07%, 0.1 11.33%, 0.14 13.6%, 0.25 18.15%, 0.39 22.7%, 0.56 27.25%, 0.77 31.8%, 1 36.35%, 0.89 40.9%, 0.85 43.18%, 0.81 45.45%, 0.79 47.72%, 0.77 50%, 0.75 52.27%, 0.75 54.55%, 0.75 56.82%, 0.77 59.1%, 0.79 61.38%, 0.81 63.65%, 0.85 65.93%, 0.89 68.2%, 1 72.7%, 0.97 74.98%, 0.95 77.25%, 0.94 79.53%, 0.94 81.8%, 0.94 84.08%, 0.95 86.35%, 0.97 88.63%, 1 90.9%, 0.99 93.18%, 0.98 95.45%, 0.99 97.73%, 1 100%)";
   // 监听键盘事件 监听继续事件
   window.addEventListener('keydown', keydownEventContinue)
}
// 选择选项事件
function selectRight(selectWord: string) {
   // console.log('选择了：' + selectWord);
   // 移除键盘事件
   window.removeEventListener('keydown', keydownEventSeleceOption);
   // 判断是否是正确的词语
   if (currentWord.value?.word == selectWord) {
      // 正确
      // getRandomWord();
      isCorrect.value = true;
      optionsRef.value?.forEach(btn => {
         btn.disabled = true;
         if (btn.getAttribute('data-key') == selectWord) {
            btn.disabled = false;
            btn.style.pointerEvents = 'none';
            btn.classList.add('btn-success');
         }
      })
   } else {
      // 错误 执行忘记事件
      // forgetWord();
      isCorrect.value = false;
      optionsRef.value?.forEach(btn => {
         // 将所有的选项禁用
         btn.disabled = true;
         // 给选择的词语添加一个错误的样式
         if (btn.getAttribute('data-key') == selectWord) {
            btn.disabled = false;
            btn.style.pointerEvents = 'none';
            btn.classList.add('btn-error');
            // 给它添加一个动画 左右摇摆
            btn.style.animation = 'shake 0.3s';

         }
         // 将正确的词语添加一个正确的样式
         if (btn.getAttribute('data-key') == currentWord.value?.word) {
            btn.disabled = false;
            btn.style.pointerEvents = 'none';
            btn.classList.add('btn-success');
         }
      })
   }
   showTip();
};
// 正确事件 (开始) 随机获取一个词语 且不是已经学习过的
function getRandomWord() {
   // console.log(vocabulary.value.wordsList!.length);
   // 如果词语不足四个 则不执行
   if (vocabulary.value.wordsList!.length < 4) {
      MyUtils.alert("词语不足四个", "error");
      return
   };
   // 学完了
   if (learnedWords.value.length == vocabulary.value.wordsList!.length) {
      console.log('已经学完了');
      isEnd.value = true;
      learnNum.value++;
      MyUtils.fire();
      let userStore = useUserStore();
      UserAPI.updateUserVocLearnCount(
         {
            vid: vocabulary.value.id,
            uid: userStore.userInfo!.id
         }
      )
      return;
   }
   // 切换动画
   transitionFlag.value = false;
   setTimeout(() => {
      transitionFlag.value = true;
   });
   // console.log(vocabulary.value);
   // 随机获取一个词语进行学习
   let word = vocabulary.value.wordsList![lodash.random(0, vocabulary.value.wordsList!.length - 1)]
   // console.log(word, learnedWords.value?.find(learWord => learWord.id == word.id));
   // 检查词语是否学习过 是则重新获取
   if (learnedWords.value?.find(learWord => learWord.id == word.id)) {
      console.log("重复");
      getRandomWord();
      return;
   }
   // 设置当前词语
   currentWord.value = word;
   // 将当前词语添加到已经学习的词语中
   learnedWords.value?.push(word);
   // console.log(learnedWords.value);
   // 新的一轮 清空选项
   options.value = [];
   generateOptions();
   // 将正确的词语添加到选项中
   options.value.push(word.word);
   // 打乱选项
   options.value = lodash.shuffle(options.value);
   // 监听键盘事件 监听选择选项
   window.addEventListener('keydown', keydownEventSeleceOption)
};
// 忘记事件
function forgetWord() {
   // console.log(lodash.findIndex(vocabulary.value.wordsList, word => word.id == currentWord.value?.id));
   // 将当前词语放到最后 (先移除再添加至末尾)
   lodash.pullAt(vocabulary.value.wordsList!, lodash.findIndex(vocabulary.value.wordsList, word => word.id == currentWord.value?.id));
   (<Word[]>vocabulary.value.wordsList).push(currentWord.value as Word)

   // 从已经学习的词语中删除当前词语
   learnedWords.value = learnedWords.value.filter(learWord => learWord.id != currentWord.value?.id);
   // console.log(vocabulary.value.wordsList);
   getRandomWord();
};
// 随机生成四个选项
function generateOptions() {
   // console.log(options.value);
   // 使用随机数在词集中随机获取四个词语 除了当前词语
   // 生成随机数
   let r: number = lodash.random(0, vocabulary.value.wordsList!.length - 1);
   // 获取词语
   let word = vocabulary.value.wordsList![r];
   // 判断是否是当前词语 或者 是否已经在选项中(不重复)
   // console.log("生成的词语：" + word.word, "当前词语：" + currentWord.value?.word);
   if (word.word == currentWord.value?.word || options.value.includes(word.word)) {
      // 是当前词语 重新生成
      generateOptions();
      return;
   }
   // 不是当前词语 添加到选项中
   options.value.push(word.word);
   // 然后判断选项是否已经有四个
   if (options.value.length <= 2) {
      // 选项不足四个 递归生成
      generateOptions();
      return;
   }
};
// 获取词集数据
async function getVocabulary(vid: string) {
   // console.log(route.params.id);
   let result = await VocabularyAPI.getVocabulary(vid);
   if (result.code == 20000) {
      vocabulary.value = result.data;
      getRandomWord();
   } else {
      MyUtils.alert(result.message, "error");
   }
};
</script>

<style lang="less">
@keyframes shake {
   0% {
      transform: translateX(0);
   }

   25% {
      transform: translateX(-5px);
   }

   50% {
      transform: translateX(5px);
   }

   75% {
      transform: translateX(-5px);
   }

   100% {
      transform: translateX(5px);
   }
}

@keyframes tipShow {
   0% {
      transform: translateY(100%);
   }

   100% {
      transform: translateY(0);
   }
}


/* 卡片切换动画 */
.toggle-card-enter-active {
   animation: toggle-card-enter .3s;
}

// .toggle-card-leave-active {
//    animation: toggle-card-leave .3s;
// }

@keyframes toggle-card-enter {
   0% {
      transform: translateX(20px);
      opacity: 0;
   }

   100% {
      transform: translateY(0);
      opacity: 1;
   }
}

@keyframes toggle-card-leave {
   0% {
      transform: translateX(0);
      opacity: 1;
   }

   100% {
      transform: translateX(-20px);
      opacity: 0;
   }
}
</style>