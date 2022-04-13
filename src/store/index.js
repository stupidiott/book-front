import Vue from 'vue'
import Vuex from 'vuex'
import Storage from '@/utils/localStorage'

Vue.use(Vuex);

// 公共state对象，存储所有组件状态
const state = {
  token: Storage.getItem("token") || "",
  user: Storage.getItem("userInfo") || ""
}

// 获取值得唯一方法
const getters = {
  getUser(state) {
    return state.user;
  },
  getToken(state) {
    return state.token;
  }
}

// 唯一可以修改state值的方法，同步阻塞
const mutations = {
  updateUser(state, user) {
    Storage.setItem("userInfo", user);
    state.user = user;
  },
  updateToken(state, token) {
    Storage.setItem("token", token);
    state.token = token;
  }
}

// 异步调用mutations方法
const actions = {
  asyncUpdateUser(context, user) {
    context.commit('updateUser', user);
  },
  asyncUpdateToken(context, token) {
    context.commit('updateToken', token);
  }
}


const store = new Vuex.Store({
  state, getters, mutations, actions
})

export default store
