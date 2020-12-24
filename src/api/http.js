import axios from "axios";
import qs from 'qs';

var instance = axios.create({}); //创建实例
instance.interceptors.request.use(function (config) { //添加请求拦截器
  let url = config.url;
  config.headers.Accept = "application/json";
  var token = window.localStorage.getItem("token");
  if(token){ //判断token是否存在
    config.headers['token'] = token;
    // config.headers['accessId'] = '0c627289'
  }
  config.headers['Content-Type'] = 'application/json;charset=UTF-8'; //数据格式转换
  return config;
}, function (err) {
  return Promise.reject(err);
});


instance.interceptors.response.use(function (res) { //响应拦截器
  return res;
}, function (err) {  //请求失败时
  var responseError = JSON.parse(JSON.stringify(err));
  var statusCode = responseError.response.status;
  if(statusCode === 401){
    // 跳转到单点登录页面
    var logonUrl = responseError.response.data.loginUrl;
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('privilege');
		localStorage.removeItem('menu');
		localStorage.removeItem('toPath');
    localStorage.removeItem('toName');
    window.location.href = logonUrl;
  } else {
    return err;
  }
});

export default instance;
