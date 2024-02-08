<template>
   <!-- 编辑词集板块 -->
   <a-row class="edit-list-box">
      <a-col :span="24">
         <div class=" p-8">
            <!-- 标题 -->
            <h3>词集列表
               <span>{{ wordData.length }}个词条</span>
            </h3>
            <div v-show="isEdit" @click="addNewWord" class="w-[100%] h-[130px] border-dashed border-[3px] border-gray-300 hover:border-sky-500 rounded-lg 
               flex justify-center items-center text-[40px] text-gray-400 cursor-pointer">
               +</div>
            <!-- 列表 -->
            <Draggable :list="wordData" item-key="id" animation="200">
               <template #item="{element}">
                  <a-row class="list" >
                     <div class="opr">
                        <!-- 序号 -->
                        <span>{{ element.id }}</span>
                        <!-- 按钮/图标 -->
                        <div v-show="isEdit">
                           <DeleteOutlined />
                           <MenuOutlined />
                        </div>
                     </div>
                     <a-divider dashed style="height:1.5px; background-color: ghostwhite;margin-top: 0;" />
                     <a-col :xs="24" :sm="12">
                        <!-- 输入框 -->
                        <a-textarea :disabled="!isEdit" :auto-size="{ minRows: 1, maxRows: 2 }" :bordered="false"
                           v-model:value="element.definition" />
                        <a-divider orientation="right">定义</a-divider>
                     </a-col>
                     <a-col :xs="24" :sm="12">
                        <a-textarea :disabled="!isEdit" :auto-size="{ minRows: 1, maxRows: 2 }" :bordered="false"
                           v-model:value="element.word" />
                        <a-divider orientation="right">词语</a-divider>
                     </a-col>
                  </a-row>

               </template>
            </Draggable>
         </div>
      </a-col>
   </a-row>
</template>

<script setup lang="ts">
import type { Word } from "@/types/vocabulary";
import {
   DeleteOutlined,
   MenuOutlined
} from "@ant-design/icons-vue";
import Draggable from "vuedraggable";

// const props = defineProps<{
//    wordData: Word[], // 词语数据
//    isEdit?: boolean, // 是否新增词语
// }>();

const props = withDefaults(defineProps<{
   wordData: Word[], // 词语数据
   isEdit?: boolean, // 是否新增词语
}>(), {
   isEdit: false
});

// 新增词语
function addNewWord() {
   props.wordData.unshift({
      definition: "",
      word: "",
      id: 0,
      vid: null
   });
}

</script>

<style lang="less">
.edit-list-box {
   >div {
      margin-top: 50px;

      >div {
         >h3 {
            // position: relative;

            >span {
               position: absolute;
               right: 0;
               font-size: 14px;
            }
         }

         // 列表
         .list {
            background-color: white;
            border-radius: 15px;
            width: 100%;
            height: auto;
            padding: 15px;
            margin-bottom: 8px;

            >div {
               height: 80px;
               padding-right: 8px;
               // border: 1px solid goldenrod;

               >textarea {
                  font-size: large;
                  color: #2e3856;
               }

               >.ant-divider {
                  font-size: 12px;
                  color: gray;
                  font-weight: 700;
                  height: 1.5px;
                  background-color: gainsboro;
                  margin-top: 0;
               }
            }

            // 操作栏
            .opr {
               width: 100%;
               height: 40px;
               display: flex;
               justify-content: space-between;
               align-items: center;

               // 序号
               >span {
                  margin-left: 10px;
                  font-size: 20px;
                  font-weight: 700;
                  font-style: italic;
                  color: #c1c2c7;
               }

               // 按钮/图标
               >div {
                  height: 100%;
                  display: flex;
                  align-items: center;

                  >span {
                     font-size: 20px;
                     color: #c1c2c7;
                     cursor: pointer;
                     margin-left: 15px;
                     transition: color .3s ease 0s;

                     &:nth-child(1) {
                        &:hover {
                           color: rgb(215, 0, 0);
                        }
                     }

                     &:nth-child(2) {
                        &:hover {
                           color: #ff9f18;
                           // 拖动图标
                           cursor: move;
                        }
                     }
                  }
               }
            }
         }
      }
   }
}
</style>
@/types/vocabulary