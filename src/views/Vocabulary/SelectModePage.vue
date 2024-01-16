<template>
   <div class="SelectModePage-container">
      SelectModePage
      <h3>标题：{{ vocabularyData.title }}</h3>
      <p>定义：{{ currentWord?.definition }} <span>答案:{{ currentWord?.word }}</span></p>
      <div>
         选项：
         <!-- <span class=" mr-2 cursor-pointer bg-gray-400 text-white pl-2 pr-2 rounded-md" v-for="(item, index) in options"
            :key="index" @click="selectRight(item)">
            {{ item }}</span> -->
         <a-tag color="blue" v-for="(item, index) in options" :key="index" @click="selectRight(item)">{{ item }}</a-tag>
      </div>
      <p>剩余：{{ vocabularyData.wordsList.length - learnedWords.length }}</p>
      <a-button type="dashed" @click="forgetWord">忘记</a-button>
   </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { useVocabularyStore } from "@/stores/vocabularyStore";
import { storeToRefs } from "pinia";
import type { Word } from "@/types/vocabulary";
import { ref, onMounted } from "vue";
import lodash from "lodash";
import { message } from "ant-design-vue";

const route = useRoute();
const vocabularyStore = useVocabularyStore();
// 词集数据
const { vocabularyData } = storeToRefs(vocabularyStore);
// 当前词语
const currentWord = ref<Word>();
// 已经学习的词语
const learnedWords = ref<Word[]>([]);
// 随机生成的选项
const options = ref<string[]>([]);


// 获取词集数据
vocabularyStore.getVocabularyData(route.params.vid as string);
// 临时 页面加载完毕后随机获取一个词语
setTimeout(() => {
   getRandomWord();
}, 500);


// 选择选项事件
function selectRight(selectWord: string) {
   // 判断是否是正确的词语
   if (currentWord.value?.word == selectWord) {
      // 正确
      getRandomWord();
      message.success('对啦');
   } else {
      // 错误 执行忘记事件
      forgetWord();
      message.error('错啦');
   }
};
// 正确事件 随机获取一个词语 且不是已经学习过的
function getRandomWord() {
   console.log(vocabularyData.value.wordsList.length);
   // 如果词语不足四个 则不执行
   if (vocabularyData.value.wordsList.length <= 4) return;
   // 学完了
   if (learnedWords.value.length == vocabularyData.value.wordsList.length) {
      console.log('已经学完了');
      return;
   }
   // console.log(vocabularyData.value);
   // 随机获取一个词语
   let word = vocabularyData.value.wordsList[lodash.random(0, vocabularyData.value.wordsList.length - 1)]
   console.log(word, learnedWords.value?.find(learWord => learWord.id == word.id));
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
};
// 忘记事件
function forgetWord() {
   console.log(lodash.findIndex(vocabularyData.value.wordsList, word => word.id == currentWord.value?.id));
   // 将当前词语放到最后 (先移除再添加至末尾)
   lodash.pullAt(vocabularyData.value.wordsList, lodash.findIndex(vocabularyData.value.wordsList, word => word.id == currentWord.value?.id));
   (<Word[]>vocabularyData.value.wordsList).push(currentWord.value as Word)

   // 从已经学习的词语中删除当前词语
   learnedWords.value = learnedWords.value.filter(learWord => learWord.id != currentWord.value?.id);
   console.log(vocabularyData.value.wordsList);
   getRandomWord();
};
// 随机生成四个选项
function generateOptions() {
   console.log(options.value);
   // 使用随机数在词集中随机获取四个词语 除了当前词语
   // 生成随机数
   let r: number = lodash.random(0, vocabularyData.value.wordsList.length - 1);
   // 获取词语
   let word = vocabularyData.value.wordsList[r];
   // 判断是否是当前词语 或者 是否已经在选项中(不重复)
   console.log("生成的词语：" + word.word, "当前词语：" + currentWord.value?.word);
   if (word.word == currentWord.value?.word || options.value.includes(word.word)) {
      // 是当前词语 重新生成
      generateOptions();
      return;
   }
   // 不是当前词语 添加到选项中
   options.value.push(word.word);
   // 然后判断选项是否已经有四个
   if (options.value.length <= 3) {
      // 选项不足四个 递归生成
      generateOptions();
      return;
   }
};
</script>

<style lang="less"></style>@/stores/vocabularyStore@/types/vocabulary