import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import axios from 'axios'
import iView from 'iview'; // 导入组件库
import 'iview/dist/styles/iview.css'; // 导入样式
import fence from './directive/fence.js'
import empty from './directive/empty.js'
import snap from './directive/snap.js'
import snapConfig from './directive/snap-config.js'
import './assets/style/element-variables.scss'
import './styles/common.scss'
import './assets/iconfont/iconfont.css'
import store from './store'
Vue.use(ElementUI)

Vue.use(iView);

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})


Vue.prototype.$eventHub= Vue.prototype.$eventHub || new Vue();
Vue.prototype.$eventHub.$on('routerChange',function(data){
  var from = data.from;
  var to = data.to;
  var isBackFromDetail = false;
  snapConfig.forEach(item=>{
    if(item.from === from.path && item.to === to.path){
      isBackFromDetail = true;
    }
  });
  //更新vuex中的状态
  store.state.isBackFromDetailPage = isBackFromDetail;
});




