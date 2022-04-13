import Vue from 'vue'
import App from './App'
import router from './router' //自动扫描index.js文件
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueParticles from 'vue-particles'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Vuex from 'vuex'
import store from './store'
import less from 'less'
import qs from 'qs'
import VueCookies from 'vue-cookies'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import locale from '../node_modules/element-ui/lib/locale/lang/en.js'
const echarts = require('echarts');

Vue.prototype.$echarts = echarts
Vue.prototype.$qs = qs

// 引入全局组件
require("./components/global/index");

Vue.use(VueCookies);
Vue.use(VueAxios,axios);
Vue.use(Vuex);
Vue.use(VueParticles);
Vue.use(ElementUI, {locale});
Vue.use(router);
Vue.use(less);
Vue.use(mavonEditor);

new Vue({
  el: '#app',
  // 配置路由
  router,
  store,
  render: h => h(App)
})
