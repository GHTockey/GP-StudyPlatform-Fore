<template>
  <div class="vocabulary-add-container my-type-center">
    <!-- 页面标题 -->
    <div class="my-10 flex justify-between items-center">
      <p v-if="isEdit" class="text-2xl font-bold">编辑词集</p>
      <p v-else class="text-2xl font-bold">创建新的词集</p>
      <button class="btn btn-primary" @click="submitForm">{{ isEdit ? '保存' : '创建' }}</button>
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
          :style="`--value:${progress}; --size:8rem; --thickness: 2px;`" role="progressbar">{{ progress }}%
        </div>
        <!-- 图片 -->
        <img v-else-if="vocabulary.cover" :src="vocabulary.cover" alt="cover" class="absolute size-full">
        <!-- 清除图片 -->
        <div v-if="vocabulary.cover" @click="vocabulary.cover = ''; progress = 0"
          class="tce-clear absolute transition-all opacity-0 size-full bg-gray-500/80 text-white/80 flex justify-center items-center">
          清除图片
        </div>
      </div>
    </div>
    <!-- 操作栏 -->
    <div class="my-5 flex justify-end">
      <div>
        <button class="btn btn-info btn-sm" onclick="document.querySelector('#importModalEl').showModal()">批量导入
        </button>
      </div>
    </div>
    <!-- 词语列表 -->
    <div>
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
                <button @click="delWord(element.id)" class="btn btn-xs rounded-full">
                  <IconFont type="icon-shanchu" />
                </button>
              </div>
            </div>
            <!-- 内容盒 -->
            <div class="flex justify-between gap-5 p-5">
              <!-- 词语 -->
              <div class="my-word-item-edit flex items-end before:content-['词语']"><textarea v-model="element.word"
                  oninput="this.rows = (this.value.match(/\n/g) || []).length+1" rows="1"
                  class="bg-transparent w-full focus:outline-none resize-none"></textarea>
              </div>
              <!-- 定义 -->
              <div class="my-word-item-edit flex items-end before:content-['定义']">
                <textarea v-model="element.definition" oninput="this.rows = (this.value.match(/\n/g) || []).length+1"
                  rows="1" class="bg-transparent w-full focus:outline-none resize-none"></textarea>
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

  <!-- 批量导入模态框 -->
  <dialog id="importModalEl" class="modal">
    <div class="modal-box max-w-[1400px]">
      <h3 class="font-bold text-lg">批量导入</h3>
      <!-- 容器 -->
      <div class="py-4">
        <div class="sm:flex sm:justify-between gap-2">
          <!-- 输入位置 -->
          <div class="relative mt-8 border-gray-500/50 border-2 flex-1 min-h-[300px] max-h-[500px]">
            <p class="absolute -top-7 font-semibold text-sm">文本数据</p>
            <textarea v-model="importData" @input="importHandler"
              class="size-full min-h-[300px] bg-transparent resize-none  focus:outline-none" placeholder="词语1  定义1" />
          </div>
          <!-- 预览位置 -->
          <div class="relative mt-8 flex-1 min-h-[300px] max-h-[500px]">
            <p class="absolute -top-7 font-semibold text-sm">识别预览</p>
            <div class="size-full overflow-auto">
              <!-- 词条 -->
              <div v-for="(words, i) in handleData" :key="i"
                class="bg-base-200 rounded-md mb-2 flex justify-between items-center">
                <div class="pl-1 text-sm italic text-gray-400/50">{{ i + 1 }}</div>
                <div class="flex-1 p-2 pb-3 text-sm">
                  <p class="my-word-item-edit before:content-['词语'] border-b">{{ words.word }}</p>
                </div>
                <div class="flex-1 p-2 pb-3 text-sm">
                  <p class="my-word-item-edit before:content-['定义'] border-b">{{ words.definition }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 操作栏 -->
        <div class="mt-3 flex gap-16">
          <div>
            <p class="text-sm mb-1 ml-1 font-semibold">词语和定义之间的分隔符：</p>
            <div class="join">
              <input @click="customSymbol = null" class="join-item btn btn-sm" type="radio" v-model="joinSymbol"
                value="blank" name="option" aria-label="空格" />
              <input @click="customSymbol = null" class="join-item btn btn-sm" type="radio" v-model="joinSymbol"
                value="comma" name="option" aria-label="逗号" />
              <input class="join-item btn btn-sm" type="radio" name="option" aria-label="自定义"
                @click="customSymbol = '', joinSymbol = null" />
              <input v-if="customSymbol != null" v-model="customSymbol" placeholder="请输入"
                class="join-item input input-sm max-w-16 bg-primary text-info-content text-xs font-semibold"
                type="text" />
            </div>
          </div>
          <div>
            <p class="text-sm mb-1 ml-1 font-semibold">词条之间的分隔符：</p>
            <div class="join">
              <input @click="customSymbol2 = null" class="join-item btn btn-sm" type="radio" v-model="joinSymbol2"
                value="line" name="option2" aria-label="换行" />
              <input @click="customSymbol2 = null" class="join-item btn btn-sm" type="radio" v-model="joinSymbol2"
                value="semicolon" name="option2" aria-label="分号" />
              <input class="join-item btn btn-sm" type="radio" name="option2" aria-label="自定义"
                @click="customSymbol2 = '', joinSymbol2 = null" />
              <input v-if="customSymbol2 != null" v-model="customSymbol2" placeholder="请输入"
                class="join-item input input-sm max-w-16 bg-primary text-info-content text-xs font-semibold"
                type="text" />
            </div>
          </div>
        </div>
      </div>
      <div class="modal-action">
        <form method="dialog">
          <!-- if there is a button in form, it will close the modal -->
          <button class="btn">取消</button>
        </form>
        <button @click="execBatchImport" class="btn btn-primary">导入</button>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useUserStore } from "@/stores/userStore";
import type { Vocabulary, Word } from "@/types/vocabulary";
import { VocabularyAPI } from "@/api/vocabulary";
import { OtherAPI } from "@/api/other";
import { useRouter, useRoute } from "vue-router";
import { MyUtils } from '@/utils';
import IconFont from "@/utils/iconFont";
import Draggable from "vuedraggable";
import type { FormExpose } from 'ant-design-vue/es/form/Form';

const route = useRoute();
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
  wordsList: [],
  stuNum: 0
});
// 上传进度
const progress = ref(0);
// 是否是编辑状态
const isEdit = ref(false);
// 表单组件实例
const formRef = ref<FormExpose | null>(null);
// 词语和定义之间的 分隔符
const joinSymbol = ref<'blank' | 'comma' | null>('blank');
// 词语和定义之间 自定义分隔符
const customSymbol = ref<string | null>();
// 词条之间的 分隔符
const joinSymbol2 = ref<'semicolon' | 'line' | null>('line');
// 词条之间 自定义分隔符
const customSymbol2 = ref<string | null>();
// 批量导入的文本数据
const importData = ref('词语1 定义1\n');
// 处理后的数据
const handleData = ref<Word[]>([]);

// 编辑模式
if (route.params.id) {
  isEdit.value = true;
  // 编辑模式 【获取数据】
  VocabularyAPI.getVocabulary(route.params.id as string).then(result => {
    if (result.code == 20000) {
      vocabulary.value = result.data
      // 检查是否有权限编辑
      // console.log(vocabulary.value.authorId + '-------' + userStore.userInfo?.id);
      if (vocabulary.value.authorId != userStore.userInfo?.id) {
        MyUtils.alert("没有权限编辑", "error")
        router.push(`/vocabulary/${route.params.id}`);
      }
    } else {
      MyUtils.alert("没有相关数据", "error")
      // todo 404
    }
  })
}


// 模态框导入 【按钮】
function execBatchImport() {
  console.log('执行批量导入');
  // 合并数据
  vocabulary.value.wordsList = vocabulary.value.wordsList?.concat(handleData.value);
  // 清空数据
  handleData.value = [];
  // 关闭模态框
  (<HTMLDialogElement>window.document.querySelector('#importModalEl')).close();
}

// 批量导入处理程序
function importHandler() {
  // 根据分隔符将文本分割成数组对象
  let data = importData.value.split(joinSymbol2.value == 'line' ? '\n' : customSymbol2.value || ';') // 区分词条
    .filter(item => item.trim() != '') // 过滤空行
    .map((item, i) => {
      let temp = item.split(joinSymbol.value == 'blank' ? ' ' : customSymbol.value || ',') // 区分词语和定义
      return {
        id: 'temp' + i,
        vid: vocabulary.value.id || null,
        word: temp[0],
        definition: temp[1]
      }
    })
  handleData.value = data;
}

// 监听分隔符的变化
watch([joinSymbol, customSymbol, joinSymbol2, customSymbol2], () => {
  importHandler();
}, { immediate: true });

// 提交表单
async function submitForm() {
  try {
    let result;
    vocabulary.value.authorId = userStore.userInfo!.id; // 作者ID
    vocabulary.value.count = vocabulary.value.wordsList!.length; // 词条数量
    console.log(vocabulary.value);
    await formRef.value?.validate()
    if (vocabulary.value.count < 4) {
      MyUtils.alert('请至少添加 4 个词语', 'warning');
      return;
    }
    // 将临时id置空
    vocabulary.value.wordsList?.forEach(words => {
      if (words.id?.startsWith('temp')) {
        words.id = null;
      }
    });
    if (isEdit.value) {
      // 编辑
      result = await VocabularyAPI.updVocabulary(vocabulary.value);
    } else {
      // 创建
      result = await VocabularyAPI.addVocabulary(vocabulary.value);
    }
    if (result.code == 20000) {
      MyUtils.alert(result.message, 'success');
      if (isEdit.value) {
        router.push(`/vocabulary/${vocabulary.value.id}`);
      } else if (typeof result.data == 'object') {
        router.push(`/vocabulary/${result.data.vid}`);
      }
    }
  } catch (error) {
    console.log('表单校验失败');
  }
}

// 上传封面
async function coverUpl(e: Event) {
  let input = e.target as HTMLInputElement;
  // console.log(input.value);
  if (input.files?.[0]) {
    let file = input.files[0];
    if (!beforeUpload(file)) {
      input.value = ''; // 为了下次选择同一文件还能触发change事件 (因为input.value没变化不会触发change事件)
      return;
    }

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
}

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
}

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

// 删除词语 (真删)
async function delWord(id: string) {
  // 判断是否是临时id
  if (!id.startsWith('temp')) {
    await VocabularyAPI.delWordsById(id);
  }
  vocabulary.value.wordsList = vocabulary.value.wordsList!.filter((word) => word.id != id);
}

</script>

<style scoped>
:hover.tce-cover-box>.tce-clear {
  opacity: 1;
}
</style>