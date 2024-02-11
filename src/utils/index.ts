import { h } from "vue";

export class MyUtils {
   static toast() {
      return h('div', { class: 'toast' }, [
         h('div', { class: 'alert alert-info' }, '6666666666666')
      ])
      // return function render() {
      // }
   }
}