import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/Home.vue'
import routerList from '../router/router.js'
import store from '../store/index'
import * as dd from 'dingtalk-jsapi'; // 此方式为整体加载，也可按需进行加载
Vue.use(Router)

  const routes = [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'home',
      meta: {
        title: '主页',
        keepAlive:true
      },
      component: Home
    },
    {
      path: '/404',
      name: '404',
      component: () => import('../views/404.vue')
    },
]

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [...routes, ...routerList]
})
router.beforeEach((to, from, next) => {
  if (to.meta.title) Vue.prototype.$utils.setTitle(to.meta.title);
  if (sessionStorage.getItem('userInfo')&&sessionStorage.getItem('Token')) {
    next()
  } else {
    if (dd.env.platform !== 'notInDingTalk') {
    }else{
      Vue.prototype.$message.fail('请使用钉钉打开')
    }
  }
})


export default router
