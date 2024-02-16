import { h, render, ref } from "vue";
import Alert from "@/components/MyAlert.vue";

export class MyUtils {
   static alert(text: string, type?: "success" | "error" | "warning" | "info", time: number = 3000) {
      // 虚拟dom
      // let alertEl = h('div', { class: 'alert alert-info w-auto fixed top-28 left-1/2 -translate-x-1/2 shadow-lg' }, '6666666666666')
      let alertEl = h(Alert, {
         text, time, type
      })

      let tempDiv = document.createElement('div')
      document.body.appendChild(tempDiv)
      render(alertEl, tempDiv) // 将虚拟dom渲染到真实dom中
      setTimeout(() => {
         // console.log('close');
         tempDiv.remove()
      }, time + 300) // 300 是为了给过渡时间

   }
}
