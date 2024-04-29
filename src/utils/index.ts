import { h, render } from "vue";
import confetti from "canvas-confetti";
import Alert from "@/components/MyAlert.vue";
import Modal from "@/components/MyModal.vue";
import { OtherAPI } from "@/api/other";
import type { AxiosProgressEvent } from "axios";

export class MyUtils {
   // 消息通知
   static alert(text: string, type?: "success" | "error" | "warning" | "info", time: number = 3000) {
      // 虚拟dom
      // let alertEl = h('div', { class: 'alert alert-info w-auto fixed top-28 left-1/2 -translate-x-1/2 shadow-lg' }, '6666666666666')
      let alertEl = h(Alert, {
         text, time, type
      })

      // 在页面中创建一个div
      let tempDiv = document.createElement('div')

      // let tempDiv = document.querySelector('#alertBox') as HTMLDivElement;

      // tempDiv.style.zIndex = '100000';
      document.body.appendChild(tempDiv)
      render(alertEl, tempDiv) // 将虚拟dom渲染到真实dom中
      // 清除真实dom
      setTimeout(() => {
         tempDiv.remove()
      }, time + 300) // 300 是为了给过渡时间
   }
   // 警告弹窗
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
   // 页面放烟花
   static fire(duration: number = 2000) {
      let animationEnd = Date.now() + duration; // 当前时间+持续时间
      let defaults = { // 粒子配置
         startVelocity: 30, // 粒子爆炸速度
         spread: 360, // 粒子扩散角度
         ticks: 60, // 粒子数量
         zIndex: 0, // 粒子层级
         shapes: [ // 粒子形状
            confetti.shapeFromText({ text: '😅' }),
            confetti.shapeFromText({ text: '⭐' }),
            confetti.shapeFromText({ text: '❤️' }),
            confetti.shapeFromText({ text: '💚' }),
            confetti.shapeFromText({ text: '6️⃣' }),
         ],
         scalar: 2, // 粒子大小
      };
      // 创建粒子
      function randomInRange(min: number, max: number) {
         return Math.random() * (max - min) + min;
      }
      let interval = setInterval(function () {
         let timeLeft = animationEnd - Date.now();
         if (timeLeft <= 0) {
            return clearInterval(interval);
         }
         let particleCount = 50 * (timeLeft / duration);
         confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
         });
         confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
         });
      }, 150); // 爆炸间隔
   }
   // 上传图片前校验
   static beforeUploadImg(file: File) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJPG) {
         console.log('只能上传jpg或png格式的图片');
         MyUtils.alert('只能上传jpg或png格式的图片', 'error');
         return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
         console.log('图片大小不能超过2MB');
         MyUtils.alert('图片大小不能超过2MB', 'error');
         return false;
      }
      return true;
   }
   // // 获取图片路径
   // static getAssetsImg(name: string) {
   //    let data = new URL(`../../assets/img/${name}`, import.meta.url).href
   //    console.log(data)
   //    return data;
   // }

}
