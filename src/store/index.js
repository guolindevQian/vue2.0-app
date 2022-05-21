import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: sessionStorage.getItem('token')||'',
    userInfo: sessionStorage.getItem('userInfo')||'',
    scollTop: 0,
    keepAlive: [],
    refresh:false

  },
  getters: {
    keepAlive: state => {
      return state.keepAlive
    }
  },
  mutations: {
    setScollTop: (state, data) => {
      state.scollTop = data;
    },
    setKeepAlive: (state, keepAlive) => {
      state.keepAlive = keepAlive;
    },
    setRefresh:(state,data)=>{
      state.refresh = data;
    }
  },
  actions: {

  }
})