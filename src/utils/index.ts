import { h, render, ref } from "vue";
import Alert from "@/components/MyAlert.vue";
import Modal from "@/components/MyModal.vue";

export class MyUtils {
   static alert(text: string, type?: "success" | "error" | "warning" | "info", time: number = 3000) {
      // 虚拟dom
      // let alertEl = h('div', { class: 'alert alert-info w-auto fixed top-28 left-1/2 -translate-x-1/2 shadow-lg' }, '6666666666666')
      let alertEl = h(Alert, {
         text, time, type
      })

      let tempDiv = document.createElement('div')
      // tempDiv.style.zIndex = '100000';
      document.body.appendChild(tempDiv)
      render(alertEl, tempDiv) // 将虚拟dom渲染到真实dom中
      // 清除真实dom
      setTimeout(() => {
         tempDiv.remove()
      }, time + 300) // 300 是为了给过渡时间
   }
   static modal(title: string, content: string, ok: () => void) {
      let modelVNode = h(Modal, {
         title,
         content,
         onClose: () => {
            setTimeout(() => {
               tempDiv.remove()
            }, 300) // 300 是为了给过渡时间
         },
         onOk: () => {
            ok()
            setTimeout(() => {
               tempDiv.remove()
            }, 300)
         }
      })
      let tempDiv = document.createElement('div')
      document.body.appendChild(tempDiv)
      render(modelVNode, tempDiv)
   }
}
