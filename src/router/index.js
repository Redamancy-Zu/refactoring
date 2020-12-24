import Vue from 'vue'
import Router from 'vue-router'
import Main from '../views/main.vue'
import Overview from '../views/overview/overview.vue'
import SpaceManagement from '../views/space-management/space-manage.vue' // 户内设备管理
import TemplateRouter from '../views/space-template/template-parent.vue'
import TemplateManagement from '../views/space-template/space-template.vue'
import TemplateDetail from '../views/space-template/template-detail.vue'
import SpaceName from '../views/space-template/space-name.vue'
import Management from '../views/space-management/space-detail.vue'
import ProductModel from '../views/product-management/product-model.vue' // 产品型号管理
import ProductType from '../views/product-management/product-type.vue' // 产品类型管理
import ProductGenre from '../views/product-management/product-genre.vue' // 产品类别管理
import ProductModelDetail from '../views/product-management/model-detail.vue' // 产品型号管理详情
import ProductTypeDetail from '../views/product-management/type-detail.vue' // 产品类型管理详情
import ProductLabel from '../views/product-management/product-label.vue' // 产品标签管理
import IotDevice from '../views/device-management/IOT-device.vue' // iot设备管理
import DeviceShadow from '../views/device-management/device-shadow.vue' // 设备影子
import DeviceDetail from '../views/device-management/device-detail.vue' // 设备影子详情
import ProjectSetting from '../views/project-setting/project-setting.vue'//项目配置
import LandManagement from '../views/land-management/land-main.vue'  //地块管理
import {
    obtainToken
  } from "../api/api.js";

let Base64 = require('js-base64').Base64
let jwt = require("jsonwebtoken");
Vue.use(Router)

 // 防止重复点击路由在控制台报红
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const router = new Router({
    routes: [{
        path: '/',
        name: 'home',
        component: Main,
        redirect: '/overview',
        children: [{
                path: '/overview',
                name: '概览',
                iconClass: 'icon-gailan',
                meta: {
                    active: '/overview'
                },
                leaf: true,
                component: Overview,
           }, {
                path: '/spaceType',
                name: '产品管理',
                iconClass: 'icon-devicetype',
                meta: {
                    active: 'spaceType'
                },
                leaf: true,
                component: TemplateRouter,
                children: [{
                    path: '/productGenre',
                    name: '产品类别管理',
                    meta: {
                        active: '/productGenre'
                    },
                    leaf: true,
                    component: ProductGenre
                }, {
                    path: '/productType',
                    name: '产品类型管理',
                    meta: {
                        active: '/productType'
                    },
                    leaf: true,
                    component: ProductType
                },{
                    path: '/productModel',
                    name: '产品型号管理',
                    meta: {
                        active: '/productModel'
                    },
                    leaf: true,
                    component: ProductModel
                },{
                    path: '/productModelDetail',
                    name: '产品型号管理详情',
                    meta: {
                        active: '/productModel'
                    },
                    leaf: false,
                    component: ProductModelDetail,
                }, {
                    path: '/productTypeDetail',
                    name: '产品类型管理详情',
                    meta: {
                        active: '/productType'
                    },
                    leaf: false,
                    component: ProductTypeDetail
                }, {
                    path: '/productLabel',
                    name: '产品标签管理',
                    meta: {
                        active: '/productLabel'
                    },
                    leaf: true,
                    component: ProductLabel
                }]
            },
            {
                path: '/spaceManagementDetail',
                name: '空间管理详情',
                component: Management,
                leaf: false,
                meta: {
                    active: '/spaceManagement'
                }
            },
            {
                path: '/spaceTemplate',
                name: '空间模版管理',
                iconClass: 'icon-kjmuban',
                meta: {
                    active: 'spaceTemplate'
                },
                leaf: true,
                component: TemplateRouter,
                children: [{
                    path: '/spaceName',
                    name: '空间名称管理',
                    meta: {
                        active: '/spaceName'
                    },
                    leaf: true,
                    component: SpaceName,
                },{
                    path: '/template',
                    name: '模板管理',
                    leaf: true,
                    component: TemplateManagement,
                    meta: {
                        active: '/template'
                    }
                }, {
                    path: '/templateDetail',
                    name: '模板详情',
                    component: TemplateDetail,
                    leaf: false,
                    meta: {
                        active: '/template'
                    }
                }]
            },
             {
                path: '/spaceManagement',
                name: '户内设备管理',
                iconClass: 'icon-kjguanli',
                meta: {
                    active: '/spaceManagement'
                },
                leaf: true,
                component: SpaceManagement,
            },
            {
                path: '/landManagement',
                name:'地块管理',
                iconClass:'icon-fanggepailie',
                meta:{
                    active: '/landManagement'
                },
                leaf: true,
                component: LandManagement,
            },
            {
                path: '/deviceManagement',
                name: '设备管理',
                iconClass: 'icon-shebeigl',
                meta: {
                    active: 'deviceManagement'
                },
                leaf: true,
                component: TemplateRouter,
                children: [{
                      path: '/iotDevice',
                      name: 'IoT设备管理',
                      meta: {
                        active: '/iotDevice'
                      },
                      leaf: true,
                      component: IotDevice
                    },{
                        path: '/deviceShadow',
                        name: '设备影子管理',
                        meta: {
                            active: '/deviceShadow'
                        },
                        leaf: true,
                        component: DeviceShadow
                    },{
                        path: '/deviceShadowDetail',
                        name: '设备影子详情',
                        component: DeviceDetail,
                        leaf: false,
                        meta: {
                            active: '/deviceShadow'
                        }
                    }
                ]
            },
            {
                path: '/projectSetting',
                name: '项目配置',
                iconClass:'icon-xiangmupeizhi',
                meta: {
                    active: '/projectSetting'
                },
                leaf: true,
                component: ProjectSetting,
            },
        ],
    }]
})

router.beforeEach((to, from, next) => { //路由拦截器
	window.localStorage.setItem("toPath",to.path)
	window.localStorage.setItem("toName",to.name)
    var token = window.localStorage.getItem("token");
    if(!token){
      var name = 'tokenKey';
      var tokenKey = decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null
      if(tokenKey){//如果没有token，需要判断url中是否存在token key，如果有的话去sso中换回真实的token
        obtainToken({tokenKey:tokenKey}).then(
          res=>{
            if(res.err_CODE === 0){
            var newToken = res.data.authorityToken;
            var privilege = res.data.authority;
            var menu = res.data.menu;
            if(newToken){ //token存在时对后台返回数据进行base64解码存储
                var payload = jwt.decode(newToken);
                window.localStorage.setItem("token",newToken);
                window.localStorage.setItem("privilege",Base64.decode(privilege));
                window.localStorage.setItem('userId', payload.user_id);
                window.localStorage.setItem('userName', payload.userName);
                window.localStorage.setItem('menu', Base64.decode(menu));
            }
        }
        next();
        return;
        });
      }else{
        next();
        return;
      }
    }else{
        next();
        return;
    }
})

export default router
