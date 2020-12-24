import Vue from 'vue'
import store from '../store'
import snapConfig from './snap-config.js'

const snap = Vue.directive('snap', {
  twoWay: true,
  bind: function (el, binding, vnode) {
    //当页面被渲染时调用
    //判断是否从详情页返回，如果是从详情页返回则从vuex中读取保存的数据
    //以当前路由路径作为key，去掉'/'
    var isBackFromDetailPage = store.getters.getisBackFromDetailPage;
    if (isBackFromDetailPage) {
      var routerPath = vnode.context.$route.path.substring(1);
      var expression = binding.expression;
      var exp = binding.expression;
      var path = exp.split('.');
      var model_value = vnode.context._data[path[0]];
      if (path.length !== 1) {
        for (var i = 1; i < path.length - 1; i++) {
          model_value = model_value[path[i]];
        }
        model_value[path[path.length - 1]] = store.getters.snap_data[routerPath][expression];
      } else {
        vnode.context._data[path[0]] = store.getters.snap_data[routerPath][expression];
      }
    }
  },

  componentUpdated: function (el, binding, vnode) {
    //更新vuex中保存的值
    //以当前路由路径作为key，去掉'/'
    var routerPath = vnode.context.$route.path.substring(1);
    var expression = binding.expression;
    var value = binding.value;
    if (store.getters.snap_data[routerPath] === undefined || store.getters.snap_data[routerPath] === null) {
      store.getters.snap_data[routerPath] = {};
    }
    store.getters.snap_data[routerPath][expression] = value;
  }
});

Vue.prototype.$snap = function (value) {
  return true;
};

export {
  snap
};
