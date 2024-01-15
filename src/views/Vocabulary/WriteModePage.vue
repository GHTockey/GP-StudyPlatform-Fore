<template>
   <div class="write-container">
      <h3>标题：{{ vocabularyData.title }}</h3>
      <p>定义：{{ currentWord?.definition }} <span>答案:{{ currentWord?.word }}</span></p>
      <p>输入：<input type="text" placeholder="输入答案" class="input w-full max-w-xs" v-model="userAnswer" /></p>
      <p>剩余：{{ vocabularyData.wordsList.length + forgetWords.length }}</p>
      <button class="btn btn-primary" @click="startLearn">开始</button>
      <button class="btn btn-success" @click="isRight">确定</button>

      <p>当前模式：{{ mode ? '严格' : '常规' }}</p>
      <div>
         <label class="swap swap-flip text-5xl">

            <!-- 这个隐藏的复选框控制状态 -->
            <input type="checkbox" v-model="mode" />

            <div class="swap-on">🥵</div>
            <div class="swap-off">😇</div>
         </label>
      </div>
      <p class=" bg-orange-400">忘记的词语：{{ forgetWords }}</p>
      <p class=" bg-sky-500">剩余的词语：{{ vocabularyData.wordsList }}</p>
      <p class=" bg-green-600">学习过的词语：{{ learnedWords }}</p>
   </div>
</template>

<script setup lang="ts">
import { useWordStore } from "@/stores/wordStore";
import type { Word } from "@/types/word";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { useRoute } from "vue-router";
import lodash from "lodash";
import { message } from "ant-design-vue";

const wordStore = useWordStore();
const route = useRoute();

const { vocabularyData } = storeToRefs(wordStore);
// 模式 false常规(选项和答案类似，中文可以类似，英文必须完全匹配  如：我是一个kaiwen 答案可以是: 我是kaiwen)  true严格(选项和答案完全一致)
const mode = ref<boolean>(false);
// 当前学习的词语
const currentWord = ref<Word>();
// 已经学习的词语[]
const learnedWords = ref<Word[]>([]);
// 用户输入的答案
const userAnswer = ref<string>('文峰年费ing发发发');
// 忘记的词语[]
const forgetWords = ref<Word[]>([]);

// let tempTargetAnswer = ref<string>('文峰年费ing发发发');


wordStore.getVocabularyData(route.params.vid as string);


// 学习 随机获取一个词语
function startLearn() {
   if (vocabularyData.value.wordsList.length <= 0 && forgetWords.value.length == 0) return message.success('学完了');
   if (vocabularyData.value.wordsList.length == 0) {
      message.info('重新学习忘记过的词语');
      // 将忘记的词语添加到原列表中 重新学习
      vocabularyData.value.wordsList = forgetWords.value.concat(vocabularyData.value.wordsList);
      // 清空忘记的词语 开始新的一轮
      forgetWords.value = [];
   }
   // 随机获取一个词语 且不是已经学习过的 且不是当前词语
   let newWord = lodash.sample(vocabularyData.value.wordsList);
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
   // 设置当前词语
   currentWord.value = newWord;
};
// 判断是否正确
function isRight() {
   if (vocabularyData.value.wordsList.length <= 0 && forgetWords.value.length == 0) return message.success('学完了');
   if (!userAnswer.value.trim()) return message.error('请输入答案');
   if (mode.value) {
      // 严格模式
      if (currentWord.value?.word == userAnswer.value) {
         // 正确
         message.success('正确');
         // 存储到已经学习的词语中
         learnedWords.value.push(currentWord.value);
         // 移除原列表中的词语
         vocabularyData.value.wordsList = vocabularyData.value.wordsList.filter(word => word.id != currentWord.value?.id);
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
         // 存储到已经学习的词语中
         learnedWords.value.push(currentWord.value);
         // 移除原列表中的词语
         vocabularyData.value.wordsList = vocabularyData.value.wordsList.filter(word => word.id != currentWord.value?.id);
         // 开始学习下一个词语
         startLearn();
      } else {
         // 错误
         message.error('忘记啦！');
         // 执行忘记事件
         forgetWord();
      }
   }
};
// 忘记事件
function forgetWord() {
   // 将当前词语添加到忘记的词语中
   if (!currentWord.value || vocabularyData.value.wordsList.length <= 0) return;
   forgetWords.value.push(currentWord.value);
   // 移除原列表中的词语
   vocabularyData.value.wordsList = vocabularyData.value.wordsList.filter(word => word.id != currentWord.value?.id);

   // 开始学习下一个词语
   startLearn();
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
</script>

<style lang="less"></style>