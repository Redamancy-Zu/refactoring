import Vue from 'vue'

const empty = Vue.directive('empty', {  //自定义指令
bind: function (el, binding, vnode) {  //绑定dom元素,权限值作为参数
    var fence_meta = binding.value;  //数据权限绑定
    el.style.display = "none"; //权限存在时dom元素绑定样式
    if (!Vue.prototype.$_nonefence(fence_meta)) { //vue原型上不存在权限时展示v-empty
      	el.style.display = "block"; //权限不存在dom元素绑定样式
    }
},
update: function (el, binding, vnode) {  //每次刷新页面时调用指令
    var fence_meta = binding.value;
    el.style.display = "none";
    if (!Vue.prototype.$_nonefence(fence_meta)) {
      el.style.display = "block";
    }
}
});

Vue.prototype.$_nonefence = function (value) { //权限存在/不存在时
var function_identify = value.functions; //功能权限限定
var data_identify = value.data; //数据权限添加
//未指定权限，直接展示
if(!data_identify && function_identify.length === 0){
    return true;
}
var token = window.localStorage.getItem("token");  //获取token
var accessCollection = JSON.parse(window.localStorage.getItem("privilege")); //项目数据权限列表
if (token) {    
    var hasAccess = true;
    //元素展示需要功能权限
    if (function_identify.length > 0) {
      function_identify.forEach(functionItem => {
        var accessItem = accessCollection.find(item => { //查找相对应功能权限
          if (item.label === functionItem || item.label === "全部权限") {
            return item;
          }
        });
        if (accessItem) {
          //判断功能权限取交集
          var dataAccess = accessItem.data_oauther.find(item=>{  //查找数据权限与功能权限的交集
            if(item === data_identify){
              return item;
            }
          });
          if(!dataAccess){
            hasAccess = false;
          }
          //数据权限为空有功能权限展示
          if(!data_identify){
          	if(accessItem){
          		hasAccess = true;
          	}else {
          		hasAccess = false;
          	}
          }
        } else {
          hasAccess = false;
        }
      });
    }else{//元素展示不需要功能权限则判断是否限制为某数据权限下的权限展示
        var dataAccess = accessCollection.find(access=>{
        var item = access.data_oauther.find(dataItem =>{
          if(dataItem === data_identify || dataItem === "全部"){
            return dataItem;
          }
        });
        if(item){
          return item;
        }
      });
      if(!dataAccess){
        hasAccess = false;
      }
    }
    return hasAccess;
}
return false;
};

export {
  empty
};
