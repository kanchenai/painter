import Vue from 'vue'
import App from './App.vue'

import ElementUI from "element-ui"
import 'element-ui/lib/theme-chalk/index.css';
import hljs from 'highlight.js/lib/core';//这个要在
import 'highlight.js/styles/darcula.css';
import {marked} from "marked";
import store from "@/store";

Vue.use(ElementUI);

Vue.config.productionTip = false

//自定义渲染器
const renderer = new marked.Renderer();
renderer.heading = (text, level) => `<h${level}>${text}</h${level}>`;
marked.setOptions({
  renderer,
  mangle:false,
  headerIds:false
})

window.store = store;

new Vue({
  render: h => h(App),
  store
}).$mount('#app')
