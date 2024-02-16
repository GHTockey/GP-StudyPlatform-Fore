<template>
   <!-- 确定弹框 -->
   <dialog :id="id" class="modal">
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
   id: string
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

// 弹框
function modalControls(p: boolean) {
   if (p) {
      (<HTMLDialogElement | null>document.querySelector(`#${props.id}`))?.showModal()
   } else {
      (<HTMLDialogElement | null>document.querySelector(`#${props.id}`))?.close();
   }
}

onMounted(() => { // 在这个生命周期才能获取到弹框元素
   if (props.open) {
      modalControls(true)
   }
})

watch(() => props.open, () => {
   // console.log(888,props.open);
   if (props.open) {
      modalControls(true)
   } else {
      modalControls(false)
   }
},{immediate:true})
</script>

<style></style>