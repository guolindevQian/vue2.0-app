/** axios封装
    请求拦截、相应拦截、错误统一处理
 */
import axios from 'axios'
import Vue from 'vue'
// import QS from 'qs'
// import { Toast } from 'vant';
// import store from '../store/index'

// if (process.env.NODE_ENV === 'development') {
// axios.defaults.baseURL = 'http://localhost:'
// } else if (process.env.NODE_ENV === 'pre') {
//   axios.defaults.baseURL = 'http://papi.hxtide.com:8901'
// } else if (process.env.NODE_ENV === 'production') {
//   axios.defaults.baseURL = 'http://papi.hxtide.com:8901'
// }

axios.defaults.timeout = 10000

axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'
axios.defaults.headers.post['ak'] = 'e5d2a815230449badccf00bc67436696'
axios.defaults.headers.post['__REQUEST_TYPE'] = 'HTTP_CLIENT'
// axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*'

// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

// // 请求拦截器
axios.interceptors.request.use(
    config => {
        // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
        // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断
        let head = 'bearer ';
        const token = JSON.parse(sessionStorage.getItem("Token"));
        token && (config.headers.Authorization = head + token);
        return config;
    },
    error => {
        return Promise.error(error);
    })

// // 响应拦截器
// // 响应拦截器
axios.interceptors.response.use(

  response => {
    if (response.status === 200) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(response);
    }
  },
  // 服务器状态码不是200的情况
  error => {
    console.log(error.response.status)
    if (error.response.status) {
      switch (error.response.status) {
        // 401: 未登录
        // 未登录则跳转登录页面，并携带当前页面的路径
        // 在登录成功后返回当前页面，这一步需要在登录页操作。
        case 401:
          console.log(401)
          // sessionStorage.clear();
          Vue.prototype.$message.fail("登录过期，请刷新页面重新登录！")
          break;
          // 403 token过期
          // 登录过期对用户进行提示
          // 清除本地token和清空vuex中token对象
          // 跳转登录页面
        case 403:
          console.log(403)
          // Toast({
          //     message: '登录过期，请重新登录',
          //     duration: 1000,
          //     forbidClick: true
          // });
          // 清除token
          // sessionStorage.clear();
          Vue.prototype.$message.fail("登录过期，请刷新页面重新登录！")
          // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
          break;
          // 404请求不存在
        case 404:
          Vue.prototype.$message.fail("网络请求不存在")
          break;
          // 其他错误，直接抛出错误提示
        default:
          // Vue.prototype.$message.fail(error.response.data.message)
          Vue.prototype.$message.fail('未知错误')
      }
      return Promise.reject(error.response);
    }
  }
);
/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
const request = {
  get: function (url, params, loading, config) {
    loading = loading || false
    if (loading) Vue.prototype.$message.loading({
      duration: 0,
      forbidClick: true,
      message: '加载中...',
    })
    return new Promise((resolve, reject) => {
      axios.get(url, {
          params: params
        }, config)
        .then(res => {

          resolve(res.data)
          loading && Vue.prototype.$message.clear()

        })
        .catch(err => {
          // Vue.prototype.$message.fail('网络异常')
          reject(err.data)
        })
    })
  },
  post: function (url, params, loading, config) {
    loading = loading || false
    if (loading) Vue.prototype.$message.loading({
      duration: 0,
      forbidClick: true,
      message: '加载中...',
    })
    return new Promise((resolve, reject) => {
      axios.post(url, params, config)
        .then(res => {
          loading && Vue.prototype.$message.clear()
          resolve(res.data)
        })
        .catch(err => {
          // Vue.prototype.$message.clear()
          // Vue.prototype.$message.fail('网络异常')
          reject(err.data)
        })
    })
  }
}

/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export default request