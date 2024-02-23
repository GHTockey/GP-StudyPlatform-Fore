<template>
   <div v-if="!isEnd"
      class="write-container my-type-center p-2 md:p-0   max-w-[900px] relative h-full flex flex-col px-2 sm:px-0">
      <!-- 进度条 -->
      <progress class="progress progress-accent my-5 min-h-2" :value="learnedWords.length"
         :max="vocabulary.wordsList?.length"></progress>

      <!-- 词条练习卡变 -->
      <transition>
         <div v-show="transitionFlag" class="flex-1 flex items-center">
            <div class="w-full">
               <!-- 选项卡 -->
               <div>
                  <div class="flex justify-between">
                     <span class="text-xl">输入正确答案</span>
                     <span class="text-md">第 {{ learnNum }} 轮</span>
                  </div>
                  <div class="min-h-[200px] my-2 bg-base-200/50 rounded-lg flex justify-center items-center">
                     <p class="">{{ currentWord?.definition }}</p>
                  </div>
                  <!-- 输入 -->
                  <div class="flex flex-wrap justify-between">
                     <!-- 输入答案 -->
                     <div v-show="isCorrect" class="flex w-full h-[50px]">
                        <input ref="inputRef" v-model="userAnswer" type="text" placeholder="输入答案"
                           class="mr-3 text-center border-b-2 border-gray-500 bg-base-100 focus:outline-none w-full" />
                        <button @click="isRight" ref="okBtnRef" class="btn btn-success">确定</button>
                     </div>
                     <!-- 复写 答错显示正确答案 -->
                     <div v-show="!isCorrect" class="bg-pink-300x w-full">
                        <p class="text-xl my-5">复写答案</p>
                        <div class="flex justify-between gap-5">
                           <div class="border-b-2 flex-1">
                              <p class="text-xs font-bold text-green-500">正确答案：</p>
                              <p class="text-lg my-2">{{ currentWord?.word }}</p>
                           </div>
                           <div class="border-b-2 flex-1">
                              <p class="text-xs font-bold text-red-500">您的答案：</p>
                              <p class="text-lg my-2">{{ tempUserAnswer }}</p>
                           </div>
                        </div>
                        <!-- 复写 -->
                        <div class="h-[50px] flex mt-5">
                           <input ref="duplicateRef" type="text" placeholder="复写答案"
                              class="text-center border-b-2 bg-base-100 focus:outline-none w-full" />
                        </div>
                     </div>
                     <!-- <button class="btn btn-primary" @click="startLearn">开始</button>
                     <button class="btn btn-success" @click="isRight">确定</button> -->
                  </div>
                  <!-- <div class="text-right mt-1">
                     <button @click="MyUtils.alert('todo')" class="btn btn-ghost">忘记了</button>
                  </div> -->
               </div>
            </div>
         </div>
      </transition>

      <!-- 提示操作栏 -->
      <div class="overflow-y-hidden min-h-[80px]">
         <div ref="tipRef" :class="isCorrect ? 'bg-success/80' : 'bg-error/50'" style="display: none;"
            class="size-full flex justify-between items-center rounded-t-xl">
            <div class="w-20">
               <img :src="`../../src/assets/img/${isCorrect ? 'ok' : 'error'}-emoji.webp`" alt="">
            </div>
            <div class="text-sm text-gray-500">
               <template v-if="!isCorrect">
                  <p class="text-center">别气馁！稍后您将会再次遇到它</p>
               </template>
               <template v-else>
                  <p class="text-center">泰裤辣！</p>
                  按下 <kbd class="kbd kbd-sm">space</kbd> 或者 <kbd class="kbd kbd-sm">Enter</kbd> 继续
               </template>
            </div>
            <div class="pr-2">
               <button v-show="isCorrect" @click="startLearn" class="btn btn-primary">继续</button>
            </div>
         </div>
      </div>


      <!-- <h3>标题：{{ vocabulary.title }}</h3>
      <p>定义：{{ currentWord?.definition }} <span>答案:{{ currentWord?.word }}</span></p>
      <p>输入：<input type="text" placeholder="输入答案" class="input w-full max-w-xs" v-model="userAnswer" /></p>
      <p>剩余：{{ wordsList.length + forgetWords.length }}</p> -->

      <!-- <p>当前模式：{{ mode ? '严格' : '常规' }}</p> -->
      <!-- <p class=" bg-orange-400">忘记的词语：{{ forgetWords }}</p>
      <p class=" bg-sky-500">剩余的词语：{{ wordsList }}</p>
      <p class=" bg-green-600">学习过的词语：{{ learnedWords }}</p> -->
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

   <!-- 难度选择对话框 -->
   <dialog class="modal" ref="modeDialogRef">
      <div class="modal-box">
         <h3 class="font-bold text-lg">难度选择 <span class="text-xs">(点击表情)</span> </h3>
         <div class="pt-5">
            <div class="flex flex-wrap justify-center items-center">
               <label class="swap swap-flip text-8xl">
                  <input type="checkbox" v-model="mode" />
                  <div class="swap-on">🥵</div>
                  <div class="swap-off">😇</div>
               </label>
               <div class="w-full text-center mt-5 font-bold text-xl">难度: {{ mode ? '严格' : '常规' }}</div>
               <p class="text-center text-sm h-10">
                  <template v-if="mode">选项和答案必须完全一致</template>
                  <template v-else>选项和答案类似，中文可以类似，英文必须完全匹配 <br /> 如：我是一个kaiwen 答案可以是: 我是kaiwen</template>
               </p>
            </div>
         </div>
         <div class="modal-action">
            <form method="dialog">
               <button @click="startLearn" class="btn btn-primary">确定</button>
            </form>
         </div>
      </div>
   </dialog>
</template>

<script setup lang="ts">
import type { Vocabulary, Word } from "@/types/vocabulary";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import lodash from "lodash";
import { message } from "ant-design-vue";
import { VocabularyAPI } from "@/api/vocabulary";
import { MyUtils } from "@/utils";

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
   wordsList: []
});
// 剩余的词语
const wordsList = ref<Word[]>([]);
// 模式 false常规(选项和答案类似，中文可以类似，英文必须完全匹配  如：我是一个kaiwen 答案可以是: 我是kaiwen)  true严格(选项和答案完全一致)
const mode = ref<boolean>(false);
// 当前学习的词语
const currentWord = ref<Word>();
// 已经学习的词语[]
const learnedWords = ref<Word[]>([]);
// 用户输入的答案
const userAnswer = ref<string>('');
// 忘记的词语
const forgetWords = ref<Word[]>([]);
// 第几轮
const learnNum = ref(1);
// 是否正确
const isCorrect = ref(true);
// 用户上次输入的答案
const tempUserAnswer = ref<string>('');
// 复写组件 ref
const duplicateRef = ref<HTMLInputElement | null>(null);
// 提示框ref
const tipRef = ref<HTMLDivElement | null>(null);
// 用户输入组件 ref
const inputRef = ref<HTMLInputElement | null>(null);
// 难度选择对话框 ref
const modeDialogRef = ref<HTMLDialogElement | null>(null);
// 确定按钮 ref
const okBtnRef = ref<HTMLButtonElement | null>(null);
// 监听键盘事件 【继续】
const nextEvent = (e: KeyboardEvent) => {
   console.log('nextEvent');
   if (e.key == 'Enter' || e.key == ' ') {
      if (isCorrect.value) { // 正确
         startLearn();
      } else { // 错误

      }
      // 清除监听
      window.removeEventListener('keydown', nextEvent);
   }
};
// 监听键盘事件 【确定】
const isRightEvent = (e: KeyboardEvent) => {
   console.log('isRightEvent');
   if (e.key == 'Enter' || e.key == ' ') {
      isRight();
   }
};
// 是否结束(学完了)
const isEnd = ref(false);
// 切换动画 flag
const transitionFlag = ref(false);




getVocabulary(route.params.vid as string);

onMounted(() => {
   // 显示难度选择对话框
   modeDialogRef.value?.showModal();
});




// 学习结束再次学习事件
function reLearn() {
   isEnd.value = false;
   learnedWords.value = [];
   forgetWords.value = [];
   wordsList.value = lodash.cloneDeep(vocabulary.value.wordsList!);
   modeDialogRef.value?.showModal();
   learnNum.value++;
}
// 显示提示框
function showTip() {
   tipRef.value!.style.display = "flex";
   tipRef.value!.style.animation = "tipShow .5s linear(0 0%, 0 2.27%, 0.02 4.53%, 0.04 6.8%, 0.06 9.07%, 0.1 11.33%, 0.14 13.6%, 0.25 18.15%, 0.39 22.7%, 0.56 27.25%, 0.77 31.8%, 1 36.35%, 0.89 40.9%, 0.85 43.18%, 0.81 45.45%, 0.79 47.72%, 0.77 50%, 0.75 52.27%, 0.75 54.55%, 0.75 56.82%, 0.77 59.1%, 0.79 61.38%, 0.81 63.65%, 0.85 65.93%, 0.89 68.2%, 1 72.7%, 0.97 74.98%, 0.95 77.25%, 0.94 79.53%, 0.94 81.8%, 0.94 84.08%, 0.95 86.35%, 0.97 88.63%, 1 90.9%, 0.99 93.18%, 0.98 95.45%, 0.99 97.73%, 1 100%)";
}
// 学习 随机获取一个词语
function startLearn() {
   if (wordsList.value.length <= 0 && forgetWords.value.length == 0) {
      isEnd.value = true;
      MyUtils.fire();
      return message.success('学完了1');
   }
   // 重置
   inputRef.value!.style.borderBottom = ''; // 清除边框
   inputRef.value!.disabled = false; // 启用输入框
   okBtnRef.value!.disabled = false; // 启用确定按钮
   userAnswer.value = ''; // 清空用户输入的答案
   tipRef.value!.style.display = "none"; // 隐藏提示框
   // 监听键盘事件 【确定】
   window.addEventListener('keydown', isRightEvent);
   if (wordsList.value.length == 0) {
      message.info('重新学习忘记过的词语');
      // 将忘记的词语添加到原列表中 重新学习
      wordsList.value = forgetWords.value.concat(wordsList.value);
      // 清空忘记的词语 开始新的一轮
      forgetWords.value = [];
   }
   // 随机获取一个词语 且不是已经学习过的 且不是当前词语
   let newWord = lodash.sample(wordsList.value);
   // 是否是已经学习过的
   if (learnedWords.value.find(word => word.id == newWord?.id)) {
      startLearn();
      return;
   }
   // 是否是当前词语
   if (currentWord.value?.id == newWord?.id) {
      startLearn();
      return;
   }
   // 切换动画
   transitionFlag.value = false;
   setTimeout(() => {
      transitionFlag.value = true;
   });
   // 设置当前词语
   currentWord.value = newWord;
   // 聚焦输入框
   setTimeout(() => {
      inputRef.value!.focus();
   })
};
// 判断是否正确
function isRight() {
   if (wordsList.value.length <= 0 && forgetWords.value.length == 0) {
      isEnd.value = true;
      MyUtils.fire();
      return message.success('学完了2');
   }
   if (!userAnswer.value.trim()) return message.error('请输入答案');
   // 严格模式
   if (mode.value) {
      // 完全一致
      if (currentWord.value?.word == userAnswer.value) {
         // 正确
         message.success('正确');
         // 存储到已经学习的词语中
         learnedWords.value.push(currentWord.value);
         // 移除原列表中的词语
         wordsList.value = wordsList.value.filter(word => word.id != currentWord.value?.id);
         // 开始学习下一个词语
         startLearn();
      } else {
         // 错误
         message.error('忘记啦！');
         // 执行忘记事件
         forgetWord();
      }
   } else {
      // 常规模式
      let checkResult = checkAnswer(userAnswer.value, <string>currentWord.value?.word);
      console.log(checkResult);
      if (!currentWord.value) return message.warning('当前词语不存在');
      if (checkResult) {
         // 正确
         message.success('正确');
         // 解除监听【确定】键盘事件
         window.removeEventListener('keydown', isRightEvent);
         // 开始监听【继续】键盘事件
         window.addEventListener('keydown', nextEvent);
         // 存储到已经学习的词语中
         learnedWords.value.push(currentWord.value);
         // 移除原列表中的词语
         wordsList.value = wordsList.value.filter(word => word.id != currentWord.value?.id);
         // 将下边框置为绿色
         inputRef.value!.style.borderBottom = '2px solid #22c55e';
         // 禁用输入框
         inputRef.value!.disabled = true;
         // 禁用确定按钮
         okBtnRef.value!.disabled = true;
      } else {
         // 错误
         message.error('忘记啦！');
         // 执行忘记事件
         forgetWord();
      }
   }
   showTip();
};
// 忘记（错误）事件
function forgetWord() {
   window.removeEventListener('keydown', isRightEvent);
   // 将当前词语添加到忘记的词语中
   if (!currentWord.value || wordsList.value.length <= 0) return;
   forgetWords.value.push(currentWord.value);
   // 移除原列表中的词语
   wordsList.value = wordsList.value.filter(word => word.id != currentWord.value?.id);

   // // 开始学习下一个词语
   // startLearn();

   isCorrect.value = false; // 不正确
   tempUserAnswer.value = userAnswer.value; // 保存用户输入的答案
   userAnswer.value = ''; // 清空用户输入的答案
   console.log(duplicateRef.value);
   // duplicateRef.value!.focus(); // 聚焦复写输入框 (这里必须延迟一下，否则无法聚焦) 因为这里的复写输入框是动态渲染的
   setTimeout(() => {
      duplicateRef.value?.focus()
   })
   duplicateRef.value!.oninput = () => {
      // console.log(duplicateRef.value?.value);
      // 监听复写输入框的输入是否等于正确答案
      if (checkAnswer(
         duplicateRef.value!.value,
         currentWord.value?.word as string
      )) {
         duplicateRef.value!.style.borderBottom = '2px solid #22c55e'; // 绿色
         // 禁用复写输入框
         duplicateRef.value!.disabled = true;
         // 2 秒后开始学习下一个词语
         setTimeout(() => {
            startLearn();
            isCorrect.value = true; // 置为正确
            duplicateRef.value!.style.borderBottom = ''; // 清除边框
            duplicateRef.value!.disabled = false; // 启用复写输入框
            tempUserAnswer.value = ''; // 清空用户输入的答案 (其实不清也行，因为下一次不正确会覆盖)
            duplicateRef.value!.value = ''; // 清空复写输入框
            // 隐藏提示框
            tipRef.value!.style.display = "none";
         }, 2000);
      }
   };
};
// 检查输入的答案和目标答案是否相似
function checkAnswer(userAnswer: string, targetAnswer: string, strength: number = .8): boolean {
   // console.log("用户答案：", userAnswer, "目标答案：", targetAnswer);
   // 判断用户答案中的英文和目标答案中的英文是否【完全一致】
   let userAnswerEn = userAnswer.match(/[a-zA-Z]+/g)?.join('');
   let targetAnswerEn = targetAnswer.match(/[a-zA-Z]+/g)?.join('');
   console.log("用户答案中的英文：", userAnswerEn, "\n目标答案中的英文：", targetAnswerEn);
   if (userAnswerEn != targetAnswerEn) return false;

   // 判断用户答案中的中文和目标答案中的中文是否【相似】
   // "文字abc文字" => ["文", "字", "文", "字"]
   let userAnswerZh = userAnswer.split(/[a-zA-Z]+/g).join('').split('');
   let targetAnswerZh = targetAnswer.split(/[a-zA-Z]+/g).join('').split('');
   console.log("用户答案中的中文：", userAnswerZh, "\n目标答案中的中文：", targetAnswerZh);
   // 用户答案中的中文至少和目标答案中的80%相似
   let similarVal = 0;
   // 目标中文数
   let tarZhNum = targetAnswerZh.length;
   // 匹配的中文
   let zhs: string[] = [];
   userAnswerZh.forEach(userZh => {
      let findResult = targetAnswerZh.findIndex(tagZh => tagZh == userZh);
      if (findResult != -1) {
         similarVal++;
         // 删除匹配的中文(防止重复匹配,该方法返回的是删除的元素数组)
         let delZh = lodash.pullAt(targetAnswerZh, findResult);
         zhs.push(delZh[0]); // 添加到匹配的中文数组中(用于显示)
      };
   });
   console.log("目标的中文数量：", tarZhNum);
   console.log("用户答案与目标答案相似的中文数量：", similarVal);
   console.log("相似度：", similarVal / tarZhNum, "阈值：", strength);
   console.log("匹配的中文：", zhs);

   // 相似度
   if (similarVal / tarZhNum < strength) return false;

   return true;
};
// 获取词集数据
async function getVocabulary(vid: string) {
   // console.log(route.params.id);
   let result = await VocabularyAPI.getVocabulary(vid);
   if (result.code == 20000) {
      vocabulary.value = result.data;
      wordsList.value = lodash.cloneDeep(result.data.wordsList!);
   } else {
      MyUtils.alert(result.message, "error");
   }
};
</script>

<style lang="less">
@keyframes tipShow {
   0% {
      transform: translateY(100%);
   }

   100% {
      transform: translateY(0);
   }
}
</style>