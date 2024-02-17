<template>
   <div class="vocabulary-add-container my-type-center">
      <!-- 页面标题 -->
      <div class="my-10 flex justify-between items-center">
         <p class="text-2xl font-bold">创建新的词集</p>
         <button class="btn btn-primary" @click="submitForm">创建</button>
      </div>
      <!-- 表单盒 -->
      <div class="flex">
         <a-form :model="vocabulary" class="mr-5 flex flex-wrap flex-col flex-1 text-base-content" ref="formRef">
            <a-form-item name="title" :rules="{ required: true, message: '请输入名称' }">
               <input type="text" placeholder="名称" v-model="vocabulary.title"
                  class="input w-full bg-base-200 text-base-content" />
            </a-form-item>
            <textarea type="text" placeholder="描述" v-model="vocabulary.desc"
               class="textarea w-full bg-base-200 flex-1 resize-none"></textarea>
         </a-form>
         <!-- 封面 w-[400px] h-[230px] -->
         <div class="tce-cover-box btn p-0 bg-base-200 w-[230px] h-[150px] relative rounded-lg shadow-md
         sm:w-[300px] sm:h-[180px] lg:w-[350px] lg:h-[200px] xl:w-[400px] xl:h-[230px]
         flex justify-center items-center overflow-hidden">
            <!-- 结构盒 -->
            <div v-if="!vocabulary.cover && progress <= 0" class="transition-all rounded-lg size-full border-dashed border-2
         border-gray-400 hover:border-primary text-gray-500 font-light hover:text-primary">
               <label class="size-full flex justify-center items-center cursor-pointer">
                  点击上传
                  <input type="file" class="size-0" @change="coverUpl">
               </label>
            </div>
            <!-- 上传进度 -->
            <div v-else-if="progress > 0 && progress < 100" class="radial-progress"
               :style="`--value:${progress}; --size:8rem; --thickness: 2px;`" role="progressbar">{{ progress }}%</div>
            <!-- 图片 -->
            <img v-else-if="vocabulary.cover" :src="vocabulary.cover" alt="cover" class="absolute size-full">
            <!-- 清除图片 -->
            <div v-if="vocabulary.cover" @click="vocabulary.cover = ''; progress = 0"
               class="tce-clear absolute transition-all opacity-0 size-full bg-gray-500/80 text-white/80 flex justify-center items-center">
               清除图片</div>
         </div>
      </div>
      123
      <!-- 词语列表 -->
      <!-- <WordList :word-data="[]" /> -->
      <div class="py-10">
         <!-- 可编辑拖拽 -->
         <Draggable :list="vocabulary.wordsList" item-key="id" animation="200" handle=".dragEl">
            <!-- 拖拽库 bug：Item slot must have only one child  （它把注释也算入其中...） -->
            <!-- 项 -->
            <template #item="{ element, index }">
               <div class="bg-base-200 rounded-lg mb-2">
                  <!-- 操作栏 -->
                  <div class="border-b-2 border-base-300 text-gray-400 px-4 py-1 flex justify-between items-center">
                     <!-- 序号 -->
                     <span class="italic text-xs">{{ index + 1 }}</span>
                     <!-- 按钮 -->
                     <div>
                        <!-- 拖拽按钮 -->
                        <button class="dragEl btn btn-xs rounded-full">
                           <IconFont type="icon-yidong" />
                        </button>
                        <!-- 删除按钮 -->
                        <button class="btn btn-xs rounded-full">
                           <IconFont type="icon-shanchu" />
                        </button>
                     </div>
                  </div>
                  <!-- 内容盒 -->
                  <div class="flex justify-between gap-5 p-5">
                     <!-- 词语 -->
                     <div class="my-word-item-edit before:content-['词语']"><textarea v-model="element.word"
                           oninput="this.rows = (this.value.match(/\n/g) || []).length+1" rows="1"
                           class="bg-transparent w-full focus:outline-none resize-none"></textarea>
                     </div>
                     <!-- 定义 -->
                     <div class="my-word-item-edit before:content-['定义']">
                        <textarea v-model="element.definition"
                           oninput="this.rows = (this.value.match(/\n/g) || []).length+1" rows="1"
                           class="bg-transparent w-full focus:outline-none resize-none"></textarea>
                     </div>
                  </div>
               </div>
            </template>
         </Draggable>
         <!-- 新增项 -->
         <div @click="addNewWord" class="btn bg-base-200 rounded-lg border-2 border-dashed border-gray-400 hover:border-primary h-[100px] cursor-pointer
         flex flex-wrap justify-center content-center">
            <p class="w-full text-center text-3xl">+</p>
            新增
         </div>
      </div>
   </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount, onMounted, watch } from 'vue';
import { useUserStore } from "@/stores/userStore";
import type { Vocabulary, Word } from "@/types/vocabulary";
import { VocabularyAPI } from "@/api/vocabulary";
import { OtherAPI } from "@/api/other";
import { useRouter, useRoute } from "vue-router";
import { MyUtils } from '@/utils';
import IconFont from "@/utils/iconFont";
import Draggable from "vuedraggable";
import type { FormExpose } from 'ant-design-vue/es/form/Form';


const router = useRouter();
const userStore = useUserStore();

// const flag = ref(false);
const vocabulary = ref<Vocabulary>({
   id: '',
   title: '',
   desc: '',
   cover: '',
   count: 0,
   authorId: '',
   createTime: '',
   updateTime: '',
   wordsList: []
});
// 上传进度
const progress = ref(0);
// 是否是编辑状态
const isEdit = ref(false);
// 表单组件实例
const formRef = ref<FormExpose | null>(null);



// onMounted(() => {
//    window.addEventListener('beforeunload', (e) => {
//       // 用户在刷新页面或关闭页面时触发
//       delGeneratedWord(); // 删除已经生成的词语
//    });
// })

// onBeforeUnmount(() => {
//    // 用户在跳转页面时触发
//    delGeneratedWord(); // 删除已经生成的词语
// });

// 提交表单
async function submitForm() {
   try {
      vocabulary.value.authorId = userStore.userInfo!.id;
      vocabulary.value.count = vocabulary.value.wordsList!.length;
      console.log(vocabulary.value);
      await formRef.value?.validate()
      if (vocabulary.value.count <= 0) {
         MyUtils.alert('请至少添加一个词语', 'warning');
         return;
      }
      let res = await VocabularyAPI.addVocabulary(vocabulary.value);
      if (res.code == 20000) {
         MyUtils.alert(res.message, 'success');
         router.push(`/vocabulary/${res.data.vid}`);
      }
   } catch (error) {
      console.log('表单校验失败');
   }
};
// 上传封面
async function coverUpl(e: Event) {
   let input = e.target as HTMLInputElement;
   // console.log(input.value);
   if (input.files?.[0]) {
      let file = input.files[0];
      if (!beforeUpload(file)) {
         input.value = ''; // 为了下次选择同一文件还能触发change事件
         return;
      };
      // console.log(file);
      const formData = new FormData();
      formData.append('file', file);
      let uplResult = await OtherAPI.imageUpl(formData, (p) => {
         if (!p.total) return;
         progress.value = Math.round(p.loaded / p.total * 100);
         console.log(progress);
      });
      if (uplResult.code == 20000) {
         vocabulary.value.cover = uplResult.data;
         MyUtils.alert('上传成功', 'success', 1000);
      } else {
         MyUtils.alert(uplResult.message, 'error');
      }
   }


};
// 上传前校验
function beforeUpload(file: File) {
   const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
   if (!isJpgOrPng) {
      MyUtils.alert('只能上传JPG/PNG等图像格式的文件!', 'error');
   }
   const isLt2M = file.size / 1024 / 1024 < 2;
   if (!isLt2M) {
      MyUtils.alert('图像必须小于2MB!', 'warning');
   }
   return isJpgOrPng && isLt2M;
};
// 新增词语
async function addNewWord() {
   /**
    * 这里要调用API新增词语以后端返回的id为准
    * 因为 Draggable 拖拽库要求每个元素有唯一的key
    * 不能再本地生成id会和数据库ID冲突
    */
   let word: Word = {
      id: 'temp' + vocabulary.value.wordsList!.length + 1, // 临时id 仅用于拖拽库的key (temp用于避免和数据库id冲突)
      word: '',
      definition: '',
      vid: vocabulary.value.id || null
   };
   // let result = await VocabularyAPI.addNewWord(word);
   // word.id = result.data.id;
   vocabulary.value.wordsList!.push(word);
}
// 删除已经生成的词语
function delGeneratedWord() {
   vocabulary.value.wordsList?.forEach(async (word) => {
      if (word.id) {
         await VocabularyAPI.delWordsById(word.id);
      }
   });
}

</script>

<style scoped>
:hover.tce-cover-box>.tce-clear {
   opacity: 1;
}
</style>