import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import "./apis/Settings.js"
import EventEmitter from "./utils/EventEmitter.js"
import importPrimeVueComponents from "./primeVueComponents.js"
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import moment from 'moment';
import ECharts from 'vue-echarts'  // 引入ECharts
import "echarts";                  // 全局引入echarts
moment.locale('zh-cn');

import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

console.log(zhCn)

window.$event = new EventEmitter();


const app = createApp(App)

importPrimeVueComponents(app);
app.use(ElementPlus, {
    locale: zhCn,
})

app.component('ECharts',ECharts)    

app.use(router).mount('#app')

export default app;