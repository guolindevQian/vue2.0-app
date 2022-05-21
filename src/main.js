import Vue from 'vue'
import App from './App.vue'
import Vant from 'vant';
import api from './api/index'
import store from './store/index.js'
import { Toast, Dialog,Lazyload,Grid,GridItem,Search,Calendar,ImagePreview,Cascader,Stepper } from 'vant';
import 'vant/lib/index.css';
import Compress from './utils/compressImg';
import utils from './utils/utils'
import './assets/base.css' /*引入公共样式*/
import router from './router'
import request from './api/axios';
import '@vant/touch-emulator';

Vue.use(Vant);
Vue.use(Search)
Vue.use(Grid)
Vue.use(GridItem)
Vue.use(Calendar)
Vue.use(Lazyload,{ lazyComponent: true})
Vue.use(ImagePreview);
Vue.use(Cascader)
Vue.use(Stepper)
Toast.setDefaultOptions('loading', { forbidClick: true });
let obj={
  $api:api,
  $utils:utils,
  $request:request,
  $message:Toast,
  $dialog:Dialog,
  $Compress:Compress
}
Object.assign( Vue.prototype,obj)

// Vue.prototype.upLoaderImg = upLoaderImg
// Vue.prototype.post = post
Vue.config.productionTip = false
new Vue({
  router,
  // axios,
  store,
  render:  h => h(App)
  
}).$mount('#app')

// console.log('main.js')


