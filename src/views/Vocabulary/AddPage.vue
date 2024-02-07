<template>
   <div class="vocabulary-add-container">
      <a-form :model="vocabulary" :label-col="{ span: 2 }" autocomplete="off">
         <a-form-item label="标题">
            <a-input v-model:value="vocabulary.title" />
         </a-form-item>

         <a-form-item label="描述">
            <a-input v-model:value="vocabulary.desc" />
         </a-form-item>

         <a-form-item label="封面">
            <!-- 进度为0显示上传按钮 -->
            <a-upload v-model="vocabulary.cover" name="file" :customRequest="coverUpl" v-if="progress == 0"
               :beforeUpload="beforeUpload" accept="image/*">
               <a-button>
                  <upload-outlined></upload-outlined>
                  Click to Upload
               </a-button>
            </a-upload>
            <!-- 进度是0~100之间显示上传进度 -->
            <progress class="progress progress-accent w-56" :value="progress" max="100"
               v-else-if="progress > 0 && progress < 100"></progress>
            <!-- 进度为100显示图片 -->
            <a-image :width="200" v-else :src="vocabulary.cover" />
         </a-form-item>

         <a-form-item>
            <WordList :wordData="vocabulary.wordsList" :isEdit="true" />
         </a-form-item>

         <a-form-item>
            <a-button type="primary" html-type="submit" @click="submitForm">Submit</a-button>
         </a-form-item>
      </a-form>
   </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from "@/stores/userStore";
import type { Vocabulary } from "@/types/vocabulary";
import { addVocabularyAPI } from "@/api/vocabulary";
import { imageUplAPI } from "@/api/other";
import { message } from 'ant-design-vue';
import { useRouter } from "vue-router";
import { UploadOutlined } from '@ant-design/icons-vue';
import type { UploadRequestOption } from 'ant-design-vue/es/vc-upload/interface';

const userStore = useUserStore();
const router = useRouter();

// const flag = ref(false);
const vocabulary = ref<Vocabulary>({
   "authorId": userStore.userInfo?.id,
   "desc": "",
   "title": "",
   "cover": "",
   "wordsList": [
      { definition: "定义1", word: "词语1", id: 1, vid: null },
      { definition: "定义2", word: "词语2", id: 2, vid: null }
   ]
});
// 上传进度
const progress = ref(0);

// 提交表单
async function submitForm() {
   console.log(vocabulary.value);
   let res = await addVocabularyAPI(vocabulary.value);
   if (res.code == 20000) {
      message.success(res.message);
      router.push(`/vocabulary/${res.data.vid}`);
   }
};
// 上传封面
async function coverUpl(file: UploadRequestOption) {
   // console.log(file);
   const formData = new FormData();
   formData.append('file', file.file);
   let uplResult = await imageUplAPI(formData, (p) => {
      if (!p.total) return;
      progress.value = p.loaded / p.total * 100;
      console.log(progress);
   });
   if (uplResult.code == 20000) {
      vocabulary.value.cover = uplResult.data;
      file.onSuccess?.(uplResult.data); // 调用成功回调通知组件
   } else {
      message.error(uplResult.message);
   }

};
// 上传前校验
function beforeUpload(file: File) {
   const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
   if (!isJpgOrPng) {
      message.error('只能上传JPG/PNG等图像格式的文件!');
   }
   const isLt2M = file.size / 1024 / 1024 < 2;
   if (!isLt2M) {
      message.error('图像必须小于2MB!');
   }
   return isJpgOrPng && isLt2M;
};
</script>