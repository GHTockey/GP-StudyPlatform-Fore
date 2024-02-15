<template>
   <!-- 确定弹框 -->
   <dialog id="warnModal" class="modal">
      <div class="modal-box">
         <h3 class="font-bold text-lg text-red-500">{{ title }}</h3>
         <p class="py-4">
            {{ content }}
         </p>
         <div class="modal-action">
            <form method="dialog">
               <!-- if there is a button in form, it will close the modal -->
               <button class="btn" @click="emit('update:open', false)">取消</button>
            </form>
            <button class="btn btn-error" @click="emit('ok')">确定</button>
         </div>
      </div>
   </dialog>
</template>

<script setup lang="ts">
import { onMounted, watch } from "vue";
const props = withDefaults(defineProps<{
   title?: string
   content?: string
   open?: boolean
}>(), {
   title: '提示',
   content: '确定执行此操作吗?',
   open: false
})

const emit = defineEmits<{
   (e: 'ok'): void,
   (e: 'update:open', open: boolean): void
}>()

// 关闭弹框
function modalControls(p: boolean) {
   if (p) {
      (<HTMLDialogElement | null>document.querySelector('#warnModal'))?.showModal()
   } else {
      (<HTMLDialogElement | null>document.querySelector('#warnModal'))?.close();
   }
}

onMounted(() => {
   if (props.open) {
      modalControls(true)
   }
})

watch(() => props.open, () => {
   if (props.open) {
      modalControls(true)
   } else {
      modalControls(false)
   }
})
</script>

<style></style>