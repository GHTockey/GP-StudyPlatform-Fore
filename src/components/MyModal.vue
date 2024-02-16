<template>
   <!-- 确定弹框 -->
   <Transition>
      <dialog class="modal duration-300" ref="dialogRef">
         <div class="modal-box">
            <h3 class="font-bold text-lg text-red-500">{{ title }}</h3>
            <p class="py-4">
               {{ content }}
            </p>
            <div class="modal-action">
               <button class="btn" @click="close">取消</button>
               <button class="btn btn-error" @click="ok">确定</button>
            </div>
         </div>
      </dialog>
   </Transition>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
const props = withDefaults(defineProps<{
   title?: string
   content?: string
   onClose: () => void
   onOk: () => void
}>(), {
   title: '提示',
   content: '确定执行此操作吗?',
})

const emit = defineEmits<{
   (e: 'ok'): void,
   (e: 'close'): void,
}>()


const dialogRef = ref<HTMLDialogElement | null>(null)


// 取消
function close() {
   emit('close')
   modalControls(false)
}
// 确定
function ok() {
   emit('ok')
   modalControls(false)
}
// 弹框
function modalControls(p: boolean) {
   if (dialogRef.value) {
      if (p) {
         dialogRef.value.showModal();
      } else {
         dialogRef.value.close();
      }
   }
}

onMounted(() => { // 在这个生命周期才能获取到弹框元素
   // console.log(dialogRef.value);
   setTimeout(() => {
      modalControls(true)
   })
})
</script>

<style></style>