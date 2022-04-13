import Vue from 'vue'
import axios from "axios";
import {Loading} from "element-ui";
import router from "../router";

Vue.prototype.$http = axios;

axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8'
// 如果请求需要携带cookie，需要把withCredentials设置为true
axios.defaults.withCredentials = true

const prodHost = window.PLATFORM_CONFIG.prodHost;

if(process.env.NODE_ENV === 'development'){
  // 开发环境
  axios.defaults.baseURL = "http://localhost:8080"
}else{
  // 生产环境，如果不想js跨域，可以做成同源
  // axios.defaults.baseURL = "http://39.106.73.215:9090";
  // 汶上县第二实验小学
  // axios.defaults.baseURL = "http://192.168.6.254:9090";
  // axios.defaults.baseURL = "http://localhost:8080";
  axios.defaults.baseURL = prodHost;
}


var loading = null;

axios.interceptors.request.use(config => {

  console.log("config=>",config);

  let token = localStorage.getItem("token");

  if(token){
    // config.headers = Object.assign(config.headers || {}, {token: localStorage.getItem("token")});
    // 通用写法
    config.headers.common['token'] = localStorage.getItem("token");
  }

  loading = Loading.service({
    lock: true,
    text: 'Loading',
    spinner: 'el-icon-loading',
    background: 'rgb(0,0,0,0.7)'
  })

  return config;
}, error => {
  return Promise.reject(error);
})

axios.interceptors.response.use(response=>{

  console.log("response=>",response);

  loading.close();

  if(response.data.code === 204){
    // 用户会话超时
    console.log('用户会话超时，自动跳转到登录页')
    router.push({
      path:'/login'
    });
  }

  if(response.data.code === 900){
    router.push({
      path:'/expire'
    });
  }

  return response;

},error=>{
  loading.close();
  return Promise.reject(error);
})

export default axios
