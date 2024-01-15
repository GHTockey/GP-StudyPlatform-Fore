<template>
   <div class="detail-container">
      <!-- 标题 -->
      <h3>{{ vocabularyData?.title }}</h3>
      <a-row class="top-box">
         <!-- 词卡 -->
         <a-col :span="24" :md="17" :lg="15" :xl="14" class="fa-col">
            <!-- 卡片(翻转效果) -->
            <div :class="isFlip ? 'flip' : 'noFlip'" @click="isFlip = !isFlip;" ref="cardBox">
               <div class="left-card-0">
                  <p>{{ vocabularyData?.wordsList[currentIndex].definition }}</p>
               </div>
               <div class="left-card-1">
                  <p>{{ vocabularyData?.wordsList[currentIndex].word }}</p>
               </div>
            </div>
            <!-- 操作栏 -->
            <div class="operate">
               <!-- 开始 -->
               <a-button type="text" shape="circle" size="large">
                  <CaretRightOutlined :style="{ fontSize: '25px', color: '#102079' }" />
               </a-button>
               <!-- 上一张 -->
               <a-button type="dashed" shape="circle" size="large" @click="handleNext('prev')">
                  <LeftOutlined :style="{ fontSize: '25px', color: '#102079' }" />
               </a-button>
               <!-- 当前的数据项/总数量 -->
               <span>{{ currentIndex + 1 }}/{{ vocabularyData?.wordsList.length }}</span>
               <!-- 下一张 -->
               <a-button type="dashed" shape="circle" size="large" @click="handleNext('next')">
                  <RightOutlined :style="{ fontSize: '25px', color: '#102079' }" />
               </a-button>
               <!-- 随机 -->
               <a-button type="text" shape="circle" size="large">
                  <icon :style="{ fontSize: '25px' }">
                     <template #component>
                        <svg class="icon" width="1em" height="1em" viewBox="0 0 1024 1024" version="1.1"
                           xmlns="http://www.w3.org/2000/svg">
                           <path fill="#112079"
                              d="M768.863 325.733c-48.775 0-170.409 121.182-259.229 207.077-134.661 130.244-261.862 256.802-363.67 256.802h-62.62C57.75 789.612 37 768.828 37 743.223c0-25.604 20.749-46.387 46.342-46.387h62.622c64.335 0 194.592-129.518 299.256-230.745 127.382-123.198 237.392-233.135 323.643-233.135h59.769l-63.418-61.55c-18.113-18.088-18.142-45.665-0.062-63.788 18.08-18.128 47.422-18.164 65.535-0.07l142.708 142.495A46.306 46.306 0 0 1 987 282.83c0 12.308-4.893 24.06-13.604 32.759l-142.71 142.4c-9.043 9.032-20.89 13.328-32.735 13.328-11.875 0-23.749-4.977-32.799-14.05-18.08-18.121-18.05-48.358 0.062-66.445l63.417-65.09h-59.768z m61.824 238.627c-18.113-18.095-47.456-18.066-65.535 0.062-18.08 18.121-18.05 49.237 0.062 67.323l63.417 65.09h-59.768c-38.06 0-101.643-56.357-164.685-115.353-18.69-17.493-48.021-17.394-65.495 1.306-17.486 18.7-16.507 49.382 2.183 66.87 96.042 89.898 160.826 139.952 227.997 139.952h59.769l-63.418 61.549c-18.113 18.087-18.142 46.552-0.062 64.674 9.051 9.072 20.924 13.167 32.799 13.167 11.845 0 23.692-4.74 32.736-13.773l142.708-142.619c8.71-8.7 13.604-20.56 13.604-32.87a46.44 46.44 0 0 0-13.604-32.842L830.687 564.36zM83.342 325.733h62.622c48.84 0 121.646 62.22 179.612 114.893 8.88 8.065 20.026 12.923 31.147 12.923 12.604 0 25.172-4.677 34.315-14.75 17.208-18.954 15.8-49.839-3.146-67.055-90.646-82.365-166.477-138.787-241.928-138.787H83.342C57.749 232.957 37 253.743 37 279.346s20.75 46.387 46.342 46.387z" />
                        </svg>
                     </template>
                  </icon>
               </a-button>
            </div>
         </a-col>
         <!-- 选项按钮 -->
         <a-col style="flex: 1;">
            <a-row class="right-operate">
               <a-col span="24" :xs="12" :md="24" :xl="12">
                  <div>
                     <p>XX</p>
                     <EditOutlined />
                  </div>
               </a-col>
               <a-col span="24" :xs="12" :md="24" :xl="12">
                  <div>
                     <p>选择</p>
                     <ForkOutlined />
                  </div>
               </a-col>
               <a-col span="24" :xs="12" :md="24" :xl="12">
                  <div>
                     <p>填空</p>
                     <DashboardOutlined />
                  </div>
               </a-col>
               <a-col span="24" :xs="12" :md="24" :xl="12">
                  <div>
                     <p>综合测试</p>
                     <FileProtectOutlined />
                  </div>
               </a-col>
            </a-row>
         </a-col>
      </a-row>
      <!-- 列表 -->
      <WordList :wordData="vocabularyData.wordsList" />
   </div>
</template>

<script setup lang="ts">
import icon, {
   EditOutlined,
   DashboardOutlined,
   FileProtectOutlined,
   ForkOutlined,
   CaretRightOutlined,
   LeftOutlined,
   RightOutlined,
} from "@ant-design/icons-vue";
import { ref } from "vue";
import { useRoute } from "vue-router";
import { useWordStore } from "@/stores/wordStore";
import { storeToRefs } from "pinia";

const route = useRoute();
const wordStore = useWordStore();
// 词集数据
const { vocabularyData } = storeToRefs(wordStore);
const { getVocabularyData } = wordStore;

// 卡片是否翻转
const isFlip = ref(false);
// cardBox
const cardBox = ref<HTMLDivElement | null>(null);
// 当前选中的数据项下标
const currentIndex = ref(0);
// 数据项切换时的防抖开关
const isDebounce = ref(false);


// == created hook start ==
getVocabularyData(route.params.id as string);
// == created hook end ==


// 上/下一张切换处理程序
function handleNext(opr: 'prev' | 'next') {
   if (isDebounce.value) return;
   let card = cardBox.value as HTMLDivElement;
   if (isFlip.value) {
      isFlip.value = false;
      card.addEventListener('transitionend', () => {
         execPrevOrNext(opr, card);
      }, { once: true });
   } else {
      execPrevOrNext(opr, card);
   };


   // // 动画结束后自动清除类名
   card.addEventListener("animationend", () => {
      card.classList.remove("prev");
      card.classList.remove("next");
      isDebounce.value = false;
   }, { once: true });

   // console.log((<HTMLDivElement>$refs.cardBox).className);
};
function execPrevOrNext(opr: 'prev' | 'next', card: HTMLDivElement) {
   // card.classList.remove(opr === "next" ? "prev" : "next");
   // card.classList.add(opr === "next" ? "next" : "prev");

   isDebounce.value = true;
   if (opr === "prev" && vocabularyData.value) {
      card.classList.remove("next");
      card.classList.add("prev");
      currentIndex.value = currentIndex.value === 0 ? vocabularyData.value?.wordsList.length - 1 : currentIndex.value - 1;
      return;
   } else if (opr === "next" && vocabularyData.value) {
      card.classList.remove("prev");
      card.classList.add("next");
      currentIndex.value = currentIndex.value === vocabularyData.value?.wordsList.length - 1 ? 0 : currentIndex.value + 1;
      return;
   }
};
</script>

<style lang="less" scoped>
.detail-container {
   display: flex;
   justify-content: center;
   flex-wrap: wrap;
   background-color: var(--bg-color);

   >div {
      width: 85%;
   }

   .top-box {
      height: 350px;
      perspective: 1000px;
      // background-color: chocolate;

      >.fa-col {
         min-height: 100% !important;
         position: relative;
         margin-bottom: 50px;
      }

      >.ant-col {
         perspective: 800px; // 透视效果

         // 卡片(翻转效果)
         >div,
         // 卡片的子元素
         >div>div {
            width: 100%;
            height: 100%;
         }

         // 卡片(翻转效果)
         >div {
            &:nth-child(1) {
               transition: all .2s ease 0s;
               transform-style: preserve-3d; // 3d效果

               >.left-card-0 {
                  // background-color: @primary-color;
                  background-color: white;
               }

               >.left-card-1 {
                  // background-color: @primary-color;
                  background-color: white;
                  transform: translateZ(-1px) rotateX(180deg);
               }

               // 左侧卡片
               >.left-card-0,
               .left-card-1 {
                  position: absolute;
                  top: 0;
                  padding: 20px;
                  border-radius: 15px;
                  box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px;
                  // box-shadow: @box-shadow-base;

                  >P {
                     color: black;
                     text-align: center;
                     width: 85%;
                     position: absolute;
                     top: 50%;
                     left: 50%;
                     transform: translate(-50%, -50%);
                     font: 700 20px/1.5 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
                     user-select: none;
                  }
               }
            }

         }

         .operate {
            height: 50px;
            // background-color: #a1c4fd;
            display: flex;
            justify-content: space-around;
            align-items: center;
         }

         // 右侧操作卡片
         >.right-operate {
            margin-left: 8px;
            align-content: start;
            // background-color: aquamarine;

            >.ant-col {
               height: 25%;
               min-height: 80px;
               padding: 5px;

               // 渐变背景
               &:nth-child(1) {
                  >div {
                     background-image: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);
                  }
               }

               &:nth-child(2) {
                  >div {
                     background-image: linear-gradient(to right, #43e97b 0%, #38f9d7 100%);
                  }
               }

               &:nth-child(3) {
                  >div {
                     background-image: linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%);
                  }
               }

               &:nth-child(4) {
                  >div {
                     background-image: linear-gradient(to right, #fa709a 0%, #fee140 100%);
                  }
               }

               // 操作卡片
               >div {
                  width: 100%;
                  height: 100%;
                  border-radius: 15px;
                  padding: 8px;
                  position: relative;
                  overflow: hidden;
                  color: white;
                  font-weight: 700;
                  box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;

                  // 图标
                  >span {
                     position: absolute;
                     right: 30px;
                     top: 50%;
                     transform: translateY(-50%) scale(3);
                     filter: blur(.5px);
                     transition: all .3s ease 0s;

                  }

                  &:hover {
                     cursor: pointer;

                     >span {
                        transform: translateY(-50%) scale(4);
                        filter: blur(0);
                     }
                  }
               }
            }
         }
      }
   }

   .edit-list-box {
      >div {
         margin-top: 100px;

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
}

// 卡片翻转
.flip {
   transform: rotateX(180deg);
}

.noFlip {
   transform: rotateX(0deg);
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

// 媒体查询: 0 ~ 768px
@media (max-width: 768px) {

   .right-operate {
      margin-left: 0 !important;
   }

   .edit-list-box {
      padding-top: 210px;
   }
}

// > 768px
@media (min-width: 768px) {
   .edit-list-box {
      padding-top: 50px;
   }
}
</style>