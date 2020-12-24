<template>
	<div class="home-cointer">
		<el-container>
			<el-aside width="200px">
				<div class="logo-container">
					<img style="width:164px;" src="../assets/logo@2x.png" alt="">
				</div>
				<nav-left></nav-left>
			</el-aside>
			<el-container>
				<el-header>
					<div class="fl com-height">
						<el-dropdown trigger="click" placement="top">
							<span class="el-dropdown-link">
								金茂绿建科技系统AI+ · 物联云平台<i class="el-icon-arrow-down el-icon--right"></i>
							</span>
                                          <el-dropdown-menu style="margin-left:28px;" slot="dropdown" id="check">
								<el-dropdown-item style="background:none;line-height:24px;" v-for="(item,index) in jump" :key="index" command="物联云平台"><a class="tickChange" style="text-decoration:none;font-size:12px;" :href="item.url">{{item.name}}</a></el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
					</div>
					<div class="fl com-height" style="margin:0 0 0 35px;">
						<div class="select-addr">
							<Cascader :data="options" v-model="defalutVal" size="small" change-on-select  @on-change="getCurrentId" :clearable ="isClear"></Cascader>
						</div>
					</div>
					<div class="fr com-height">
						<el-dropdown trigger="click" @command="userSettings" @visible-change="vChange">
			              <span style="cursor: pointer;">
			                <i class="iconfont icon-user" style="color:#BCCEDA;"></i>
			                <span>{{name}}</span>
			                <i v-if="!listIon" class="el-icon-arrow-down"></i>
			                <i v-if="listIon" class="el-icon-arrow-up"></i>
			              </span>
			              <el-dropdown-menu slot="dropdown">
			                <el-dropdown-item command="changePassword">修改密码</el-dropdown-item>
			                <el-dropdown-item command="logOut">退出登录</el-dropdown-item>
			              </el-dropdown-menu>
			            </el-dropdown>
					</div>
				</el-header>
				<el-main style="height:100%;">
					<el-col :span="24" class="breadcrumb-container nav-title">
						<div v-if="$route.path=='/spaceManagementDetail'">
							<router-link  to="/spaceManagement" class="crb-fontColor">户内设备管理</router-link>
							<span>&gt;</span>
							<span class="title" style="color:#adadad;">{{$route.query.temName}}</span>
						</div>
						<div v-if="$route.path=='/templateDetail'">
							<router-link  to="/template" class="crb-fontColor">空间模版管理 > 模板管理</router-link>
							<span>&gt;</span>
							<span class="title" style="color:#adadad;">{{$route.query.temName}}</span>
						</div>
						<div v-if="$route.path=='/deviceShadowDetail'">
							<router-link  to="/deviceShadow" class="crb-fontColor">设备管理 > 设备影子管理</router-link>
							<span>&gt;</span>
							<span class="title" style="color:#adadad;">{{$route.query.temName}}</span>
						</div>
						<div v-if="$route.path=='/productModelDetail'">
							<router-link  to="/productModel" class="crb-fontColor">产品管理 > 产品型号管理</router-link>
							<span>&gt;</span>
							<span class="title" style="color:#adadad;">{{$route.query.temName}}</span>
						</div>
						<div v-if="$route.path=='/productTypeDetail'">
							<router-link  to="/productType" class="crb-fontColor">产品管理 > 产品类型管理</router-link>
							<span>&gt;</span>
							<span class="title" style="color:#adadad;">{{$route.query.temName}}</span>
						</div>
						<el-breadcrumb v-if="$route.path!='/templateDetail'&&$route.path!='/spaceManagementDetail'&&$route.path!='/productTypeDetail'&&$route.path!='/productModelDetail'&&$route.path!='/deviceShadowDetail'" separator=">" class="breadcrumb-inner">
							<el-breadcrumb-item v-for="item in navMenu" :key="item.path" :class="item.colClass">
								{{ item.name }}
							</el-breadcrumb-item>
						</el-breadcrumb>
					</el-col>
					<el-col :span="24" id="content-wrapper" class="content-wrapper" style="display:block;">
						<transition name="fade" mode="out-in">
							<router-view></router-view>
						</transition>
					</el-col>
					<!--修改密码-->
			        <el-dialog
			            class="plusProModel"
			            id="passwordDialog"
			            title="修改密码"
			            :visible.sync="passwordDialog"
			            width="746px"
			            :before-close="cancelChange"
			            top="23vh"
			        >
			            <el-form :model="passwordForm" ref="passwordForm" @submit.native.prevent>
			              <el-form-item label="原密码" required label-width="90px">
			                <el-input
			                  type="password"
			                  minlength="6"
			                  maxlength="12"
			                  v-model.trim="passwordForm.oldPassword"
			                  autocomplete="off"
			                  placeholder="请输入原密码"
			                  size="mini"
			                ></el-input>
			                <div id="oldPasswordError">{{passwordForm.oldPasswordError}}</div>
			              </el-form-item>
			              <el-form-item label="新密码" required label-width="90px">
			                <el-input
			                  type="password"
			                  minlength="6"
			                  maxlength="12"
			                  v-model.trim="passwordForm.newPassword"
			                  autocomplete="off"
			                  placeholder="长度6~12位，支持大写字母、小写字母、数字、标点符号，并且至少包括其中两种"
			                  size="mini"
			                ></el-input>
			                <div id="newPasswordError">{{passwordForm.newPasswordError}}</div>
			              </el-form-item>
			              <el-form-item label="确认新密码" required label-width="90px">
			                <el-input
			                  type="password"
			                  minlength="6"
			                  maxlength="12"
			                  v-model.trim="passwordForm.surePassword"
			                  autocomplete="off"
			                  placeholder
			                  size="mini"
			                ></el-input>
			                <div id="surePasswordError">{{passwordForm.surePasswordError}}</div>
			              </el-form-item>
			            </el-form>
			            <span slot="footer" class="dialog-footer">
			              <el-button @click="cancelChange">取消</el-button>
			              <el-button type="primary" @click="sureChange(passwordForm)">确定</el-button>
			            </span>
			        </el-dialog>
				</el-main>
			</el-container>
		</el-container>
	</div>
</template>
<script>
import navLeft from './nav-left.vue'
import { mapActions, mapGetters } from 'vuex'
import { getAllCountryCity,modifyPassword,loginLogout,appId,onlyLogin } from '../api/api.js'
import sha256 from 'js-sha256'
export default {
  name: "home",
  components: {
    navLeft
  },
  data () {
    return {
      showOneMenu: false,
      navMenu: [],
      isClear: false,
      passwordDialog: false,
      defalutVal: ['1'],
      options: [

      ],
      name: "王小雨",
      passwordForm: {
        userId: null,
        oldPassword: null,
        newPassword: null,
        surePassword: null,
        oldPasswordError: null,
        newPasswordError: null,
        surePasswordError: null
      },
      listIon: false,
      jump:[]
    }
  },
  created () {
    this.initCountry();
  },
  mounted () {
    this.handlerBread(this.$route.matched);
    if (localStorage.userName) {
      this.name = localStorage.userName;
    }
    this.tabsCheck()
  },
  watch: {
    $route: {
      handler: function (val, oldVal) {
        this.handlerBread(val.matched);
        this.$eventHub.$emit('routerChange', { from: oldVal, to: val })
        let wrapper = document.getElementById("content-wrapper");	// 让滚动条置顶
        wrapper.scrollTop = 0;
      },
      // 深度观察监听
      deep: true
    }
  },
  methods: {
    tabsCheck() {
      onlyLogin({}).then((res)=> {
        this.jump = res.data.data
      })
    },
    ...mapActions( // 语法糖
      ['modifyCurrentId'] // 相当于this.$store.dispatch('modifyCurrentId'),提交这个方法
    ),
    vChange(value) {
      this.listIon = value;
    },
    userSettings(value) {
      if (value == "changePassword") {
        this.passwordDialog = true;
      } else if (value == "logOut") {
        let token = window.localStorage.getItem("token");
        let obj = { appId: appId, token: token };
        loginLogout(obj).then(res => {
          if(res.err_CODE == '0'){
            this.$message.success(res.err_MESSAGE);
            localStorage.removeItem('token');
	          localStorage.removeItem('userId');
	          localStorage.removeItem('userName');
	          localStorage.removeItem('privilege');
			      this.initCountry();
          }else{
            this.$message.error(res.err_MESSAGE);
          }
        });
      }
    },
    cancelChange() {
      this.passwordDialog = false;
      this.$refs["passwordForm"].resetFields();
      this.$set(this.passwordForm, "oldPassword", null);
      this.$set(this.passwordForm, "newPassword", null);
      this.$set(this.passwordForm, "surePassword", null);
      this.passwordForm.oldPasswordError = this.passwordForm.newPasswordError = this.passwordForm.surePasswordError = null;
    },
    sureChange(value) {
      this.passwordForm.oldPasswordError = this.passwordForm.newPasswordError = this.passwordForm.surePasswordError = null;
      if (
        this.passwordForm.oldPassword == null ||
        this.passwordForm.oldPassword == ""
      ) {
        this.passwordForm.oldPasswordError = "请输入原密码";
      }
      if (
        this.passwordForm.newPassword == null ||
        this.passwordForm.newPassword == ""
      ) {
        this.passwordForm.newPasswordError = "请输入新密码";
      }
      if (/^.{6,12}$/.test(this.passwordForm.newPassword) && [/\d/,/[a-z]/,/[A-Z]/,/[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]/im]
        .filter(reg => reg.test(this.passwordForm.newPassword)).length >= 2) {
        this.passwordForm.newPasswordError = null;
      } else {
        this.passwordForm.newPasswordError = "长度6~12位，支持大写字母、小写字母、数字、标点符号，并且至少包括其中两种";
      }
      if (
        this.passwordForm.surePassword == null ||
        this.passwordForm.surePassword == ""
      ) {
        this.passwordForm.surePasswordError = "请确认新密码";
      }
      if (this.passwordForm.newPassword != this.passwordForm.surePassword) {
        this.passwordForm.surePasswordError = "新密码输入不一致";
      }
      if (
        this.passwordForm.oldPasswordError ||
        this.passwordForm.oldPasswordError ||
        this.passwordForm.oldPasswordError
      ) {
        return;
      }
      let params = {
      	appId: appId,
        userId: localStorage.userId,
        oldPassword: sha256(this.passwordForm.oldPassword),
        newPassword: sha256(this.passwordForm.newPassword),
        rePassword: sha256(this.passwordForm.surePassword)
      };
      if(this.passwordForm.newPasswordError === null && this.passwordForm.oldPasswordError === null && this.passwordForm.surePasswordError === null) {
        modifyPassword(params).then(res => {
        if (res.data) {
          if (res.data.oldPassword) {
            this.passwordForm.oldPasswordError = res.data.oldPassword;
          }
          if (res.data.newPassword) {
            this.passwordForm.newPasswordError = res.data.newPassword;
          }
          if (res.data.rePassword) {
            this.passwordForm.surePasswordError = res.data.rePassword;
          }
        }
        if (res.err_CODE == 0) {
          this.$message({ message: res.err_MESSAGE, type: "success" });
          this.cancelChange();
        }
      });
      }
    },
    getCurrentId (val, selectData) {
      let Arr = []
      selectData.forEach(item => {
        Arr.push((item.value - 0))
      })
      this.modifyCurrentId(Arr)

    },
    initCountry () {
      let self = this;
      getAllCountryCity().then(res => {
        let data = res.data.data;
        if (res.data.err_CODE == 0) {
          let newCountry = self.copy(data)
          self.options = newCountry
        }
      })
    },
    copy (arr) {
      let self = this;
      let obj = arr.constructor == Array ? [] : {};
      for (var item in arr) {
        if (typeof arr[item] === "object") {
          obj[item] = self.copy(arr[item]);
        } else if (typeof arr[item] === "number") {
          obj[item] = arr[item] + '';
        } else {
          obj[item] = arr[item];
        }
      }
      return obj;
    },
    handlerBread (val) {// this.$route.matched
      let self = this;
      let navArr = [];
      val.forEach((i) => {
        navArr.push({ path: i.path, name: i.name, colClass: '' })
      });
      navArr.shift();

      navArr.forEach((item, idx) => {
        if (navArr.length == 1) {
          item.colClass = 'default-col'
        } else if (idx == 0) {
          item.colClass = 'parent-col'
        } else if (idx != 0) {
          item.colClass = 'default-col'
        }
      })
      this.navMenu = navArr;
    },
    handleselect (a, b) {

    }
   

  }

}
</script>
<style>
.com-height .el-dropdown-link {
  cursor: pointer;
  font-size: 12px;
  color: #323232;
}
#check{
  position:absolute;
  top:35px !important;
  left:189px;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.com-height .el-popper{
  position: absolute;
  top: 44px;
  left:214px;
}
.com-height .el-dropdown-menu__item {
  list-style: none;
  line-height: 36px;
  padding: 0 10px;
  margin: 0;
  font-size: 12px;
  color: #606266;
  cursor: pointer;
  outline: 0;
}
.tickChange{
  color:#323232;
}
.tickChange:hover{
  color: #0FADFF;
}
.parent-col .el-breadcrumb__inner {
  color: #3d90f8;
  font-size: 12px;
}
.default-col .el-breadcrumb__inner {
  color: #adadad;
  font-size: 12px;
}
.default-col .el-breadcrumb__inner:hover {
  color: #adadad;
  font-size: 12px;
}
.el-dropdown-menu{
  margin-left: 58px;
}
.el-dropdown-menu.el-popper[x-placement^='bottom'] {
  margin-top: -1px !important;
}
.el-popper[x-placement^='bottom'] {
  margin-top: 8px !important;
}
.breadcrumb-container .el-breadcrumb__item:last-child .el-breadcrumb__inner {
  color: #adadad;
}
.breadcrumb-container
  .el-breadcrumb__item:last-child
  .el-breadcrumb__inner:hover {
  color: #adadad;
}
.select-addr .ivu-input{
    background: #0fadff !important;
    color:#fff;
    border:1px solid #0fadff;
    outline:none;
}
.select-addr .ivu-cascader-arrow{
  color:#fff;
}
#passwordDialog .el-dialog {
  height: 345px;
}
#passwordDialog .el-dialog__footer {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 10px;
}
#passwordDialog .el-form .el-form-item {
  margin-bottom: 0;
}
#passwordDialog .el-form .el-form-item .el-input {
	width: 100%;
}
#passwordDialog .el-form .el-form-item .el-input .el-input__inner {
	width: 100%;
	padding: 0 6px;
}
#passwordDialog #oldPasswordError,
#passwordDialog #newPasswordError,
#passwordDialog #surePasswordError {
  font-size: 12px;
  height: 17px;
  line-height: 17px;
  color: #cc3d3d;
  margin: -5px 0;
}
</style>
<style lang="scss" scoped>
// @import '../styles/index.scss';
@import '../styles/new-index.scss';
.home-cointer {
  height: 100%;
  overflow: hidden;
  .logo-container {
    height: 70px;
    line-height: 70px;
    text-align: center;
    img {
      width: 160px;
    }
  }
  .el-main {
    .nav-title {
      height: 36px;
      padding: 14px 0 0 16px;
    }
  }
}
.el-container {
  height: 100%;
}
.el-aside {
  background-color: $aside-bgColor;
  color: $font-color;
  height: 100%;
}
.el-header {
  background-color: $header-bgColor;
  color: $new-font-color;
  height: 44px !important;
  line-height: 44px;
}
.el-main {
  background: $container-bgColor;
  color: $font-color;
  height: calc(100% - 44px);
  padding: 0;
  overflow: hidden;
}
.content-wrapper {
  height: calc(100% - 36px);
  overflow: auto;
  padding: 0 16px 12px;
  /*
		display:flex;
		flex-direction:column;
		div{
			flex:1;
			height:100%;
			background:#1E2E4C;
		}
		*/
}
.com-height {
  height: 44px;
  line-height: 44px;
  .el-icon-arrow-up,.el-icon-arrow-down{
    font-size: 16px
  }
}
.crb-fontColor {
  color: $crb-fontColor;
}
.relative {
  position: relative;
  top: 1px;
}
.select-addr {
  display: inline-block;
  height: 30px;
  line-height: 30px;
  padding: 0 5px;
  border-radius: 2px;
  color: #fff;
  cursor: pointer;
  
}
.fade-enter {
  opacity: 0;
}
.fade-leave {
  opacity: 1;
}
.fade-enter-active {
  transition: opacity 0.3s;
}
.fade-leave-active {
  opacity: 0;
  transition: opacity 0.3s;
}
</style>