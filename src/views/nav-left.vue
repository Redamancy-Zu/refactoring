<template>
	<el-menu
      :default-active="$route.meta.active"
      class="el-menu-vertical-demo nav-left-box"
      background-color="#1E2E4C"
			unique-opened
      text-color="#ADADAD"
      active-text-color="#fff" router>
	
    	<template v-for="(item,i) in menuList">
			<el-submenu :index="item.path"  v-if="item.children" :key="i">
				   <template slot="title">
					   <i class="common-sty iconfont" :class="item.iconClass"></i>
					   <span>{{item.name}}</span>
					   <img :src="item.img" alt=""/>
					 </template>
					 <el-menu-item v-for="(jtem,index) in item.children" :index="jtem.path" v-if="item.children[index].leaf" :key="index">{{jtem.name}}</el-menu-item>
			</el-submenu>
			<el-menu-item :index="item.path" :key="i" v-else-if="item.leaf">
				<i class="common-sty iconfont" :class="item.iconClass"></i>
				<span slot="title">{{item.name}}</span>
			</el-menu-item>
		</template>
    </el-menu>
</template>
<script>
	export default {
		name:'navLeft',
		data(){
			return {
        		menuList: [] //菜单数组
			}
		},
		methods: {
			luyou() {
				var routerPath = [{
			        path: '/',
			        name: 'home',
			        redirect: '/overview',
			        children: [{
			                path: '/overview',
			                name: '概览',
			                iconClass: 'icon-gailan',
			                meta: {
			                    active: '/overview'
			                },
			                leaf: true,
			           },
			            {
			                path: '/spaceType',
			                name: '产品管理',
			                iconClass: 'icon-devicetype',
			                meta: {
			                    active: 'spaceType'
			                },
			                leaf: true,
			                children: [{
			                    path: '/productGenre',
			                    name: '产品类别管理',
			                    meta: {
			                        active: '/productGenre'
			                    },
			                    leaf: true,
			                }, {
			                    path: '/productType',
			                    name: '产品类型管理',
			                    meta: {
			                        active: '/productType'
			                    },
			                    leaf: true,
			                },{
			                    path: '/productModel',
			                    name: '产品型号管理',
			                    meta: {
			                        active: '/productModel'
			                    },
			                    leaf: true,
			                }, {
			                    path: '/productModelDetail',
			                    name: '产品型号管理详情',
			                    meta: {
			                        active: '/productModel'
			                    },
			                    leaf: false,
			                }, {
			                    path: '/productTypeDetail',
			                    name: '产品类型管理详情',
			                    meta: {
			                        active: '/productType'
			                    },
			                    leaf: false,
			                }, {
			                    path: '/productLabel',
			                    name: '产品标签管理',
			                    meta: {
			                        active: '/productLabel'
			                    },
			                    leaf: true,
			                }]
			            },
			            {
			                path: '/spaceManagementDetail',
			                name: '空间管理详情',
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
			                children: [ {
			                    path: '/spaceName',
			                    name: '空间名称管理',
			                    meta: {
			                        active: '/spaceName'
			                    },
			                    leaf: true,
			                },{
			                    path: '/template',
			                    name: '模板管理',
			                    leaf: true,
			                    meta: {
			                        active: '/template'
			                    }
			                }, {
			                    path: '/templateDetail',
			                    name: '模板详情',
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
						},
						{
							path: '/landManagement',
							name:'地块管理',
							iconClass:'icon-fanggepailie',
							meta:{
								active: '/landManagement'
							},
							leaf: true
            			},
			            {
			                path: '/deviceManagement',
			                name: '设备管理',
			                iconClass: 'icon-shebeigl',
			                meta: {
			                    active: 'deviceManagement'
			                },
			                leaf: true,
			                children: [{
			                      path: '/iotDevice',
			                      name: 'IoT设备管理',
			                      meta: {
			                        active: '/iotDevice'
			                      },
			                      leaf: true,
			                    },{
			                        path: '/deviceShadow',
			                        name: '设备影子管理',
			                        meta: {
			                            active: '/deviceShadow'
			                        },
			                        leaf: true,
			                    },{
			                        path: '/deviceShadowDetail',
			                        name: '设备影子详情',
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
			            },
			        ],
			    }]
				//有权限的菜单数组
				let childrenList = [];
				let childrenListName = [];
				let menuList = JSON.parse(window.localStorage.getItem("menu"));
				if(menuList&&menuList.length) {
					for(var i=0;i<menuList.length;i++) {
						if(menuList[i].children&&menuList[i].children.length) {
							for(var j=0;j<menuList[i].children.length;j++) {
								childrenList.push(menuList[i].children[j])
								childrenListName.push(menuList[i].children[j].name)
							}
						}else {
							childrenList.push(menuList[i])
							childrenListName.push(menuList[i].name)
						}
					}	
				}
				//根据菜单数组匹配路由
				let arr = [];
				if(menuList&&menuList.length) {
					routerPath[0].children.forEach((item,index)=>{
						if(item && item.children) {
							let arryDate = [];
							item.children.forEach((child) => {
								childrenList.forEach((entry) => {
									if(entry.name == child.name) {
										arryDate.push(child)
										arr[index] = item;
										arr[index]['children'] = arryDate
									}
								})
							})
						}else {
							childrenList.forEach((noChild) => {
								if(noChild.name == item.name) {
									arr[index] = item;
								}
							})
						}
					})
				}
				// console.log('arr',arr)
				//去除新路由的空值
				let arrList = [];
				if(arr&&arr.length) {
					arr.forEach(newArr=>{
						if(newArr.name) {
							arrList.push(newArr)
						}
					})
				}
				// console.log('arrList',arrList)
				this.menuList = arrList;
				//刷新页面保持当前页面
				if(childrenListName.indexOf(window.localStorage.getItem('toName')) != '-1') {
					this.$router.push({ path:window.localStorage.getItem('toPath')})
				}else {
					if(arrList[0].children&&arrList[0].children.length) {
						this.$router.push({ path:arrList[0].children[0].path})
					}else {
						this.$router.push({ path:arrList[0].path})
					}
					
				}
			}
		},
		created() {
			this.luyou()
		},
		mounted(){
			
		}
	}
</script>
<style>
	.el-menu-item.is-active{
		background:#0FADFF !important;
	}
	.nav-left-box .el-menu-item,.nav-left-box .el-submenu__title{
		  height: 44px;
    	line-height: 44px;
    	position: relative;
    	white-space: nowrap;
      list-style: none;
      font-size:12px;
  }
  .common-sty{
    margin-right:3px;
  }
  .fontSiz{
    font-size:18px;
  }
</style>

