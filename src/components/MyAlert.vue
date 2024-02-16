<template>
   <!-- alert -->
   <Transition name="alert">
      <div v-if="open" role="alert" class="alert
      fixed top-[80px] w-auto left-1/2 -translate-x-1/2
       shadow-lg" :class="typeHandler">
         <!-- 图标类型 -->
         <template v-if="type == undefined || type == 'info'">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-info shrink-0 w-6 h-6">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
         </template>
         <template v-else-if="type == 'success'">
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none"
               viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
         </template>
         <template v-else-if="type == 'warning'">
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none"
               viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
         </template>
         <template v-else-if="type == 'error'">
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none"
               viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
         </template>

         <span>{{ text }}</span>
      </div>
   </Transition>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, computed } from "vue";
const props = withDefaults(
   defineProps<{
      text: string
      time?: number
      type?: "success" | "error" | "warning" | "info"
   }>(),
   // 默认值
   {
      time: 2000
   }
)

console.log(props.type);
const open = ref(false)
onMounted(() => {
   open.value = true
   setTimeout(() => {
      open.value = false
   }, props.time)
})
onUnmounted(() => {
   console.log('销毁');
})

const typeHandler = computed(() => {
   if (props.type) {
      return `alert-${props.type}`
   }
   return ''
})
</script>

<style>
.alert-enter-active {
   animation: alertEnter .3s;
}

.alert-leave-active {
   animation: alertLeave .3s;
}

@keyframes alertEnter {
   0% {
      top: 0;
      opacity: 0;
   }

   100% {
      top: 80px;
      opacity: 1;
   }
}

@keyframes alertLeave {
   0% {
      top: 80px;
      opacity: 1;
   }

   100% {
      top: 0;
      opacity: 0;
   }
}</style>