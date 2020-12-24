<template>
	<div id="type-detail">
    <Modal ref="mychild"  @typeClose="addTypeClose"/>
    <!-- 基本信息 -->
		<div class="base-message">
			<div class="base-title overh">
				<router-link to="/productType" class="back">
					<el-button size="mini" icon="el-icon-arrow-left">返回</el-button>
				</router-link>
				<span class="name">{{productTypeDetail.procutTypeName}}</span>
				<el-button v-fence="{data:'', functions:['维护产品类型基本信息（新建，编辑，删除）']}" type="primary" class="fr" size="mini" style="border:none" icon="el-icon-edit" @click="editProductTypeVisibles()">编辑</el-button>
			</div>
			<div class="msg">
				<p><span>产品类型：{{productTypeDetail.procutTypeName}}</span><span>产品类别：{{productTypeDetail.productCategoryName}}</span><span>节点类型：{{productTypeDetail.nodeType === 1 ? "网关" : productTypeDetail.nodeType === 2 ? "设备" : "其他"}}</span>
        <p class="desc">描述：{{productTypeDetail.desc}}</p>
			</div>
		</div>

    <!-- 功能列表 -->
    <div class="action-list">
      <div class="title">
        <div class="left">功能列表</div>
        <el-dropdown class="fr" border="none" trigger="click" @command="addAction">
          <el-button v-fence="{data:'', functions:['维护产品类型功能（新建，编辑，删除）']}" type="primary" size="mini">
            添加功能
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="userSetting">自定义功能</el-dropdown-item>
            <el-dropdown-item command="standard">标准功能</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="data">
        <el-table :data="tb_data" size="mini">
          <el-table-column min-width="120" prop="proType" label="功能类型"></el-table-column>
          <el-table-column
            label="功能名称" min-width="120" align="center">
            <template slot-scope="scope">
              <div v-fence="{data:'', functions:['维护产品类型功能（新建，编辑，删除）']}" slot="reference" @click="proFunEdit(scope.row)" class="name-wrapper">
                {{ scope.row.proName }}
              </div>
            </template>
          </el-table-column>
          <el-table-column min-width="130" prop="openFilter" label="是否启用筛选条件"></el-table-column>
          <el-table-column  min-width="130" prop="key" label="标识符"></el-table-column>
          <el-table-column  min-width="100" prop="dataTypeName" label="数据类型"></el-table-column>
          <el-table-column  min-width="331" prop="dataDefine" label="数据定义"></el-table-column>
          <el-table-column  min-width="120" prop="eventTypeName" label="事件类型"></el-table-column>
          <el-table-column  min-width="148" prop="deliveryAddress" label="推送至"></el-table-column>
          <el-table-column  min-width="104" label="操作">
            <template slot-scope="scope">
              <span class="wrapperFunction" v-fence="{data:'', functions:['维护产品类型功能（新建，编辑，删除）']}">
                <i
                  class="el-icon-delete"
                  @click="deleteModelFunList(scope.row)"
                ></i>
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
     <!-- 添加标准功能 -->
    <el-dialog
      class="add-standard"
      title="添加标准功能"
      :visible.sync="standAddDialogVisible"
      width="866px"
      :before-close="closeStandardFunction"
      top="20vh">
      <div class="content">
        <div class="left">
          <div class="top over">
            <span>选择功能：</span>
            <el-button type="primary" class="fr" size="mini" @click="addAll"
                :disabled="!addAllDisable"
            >全部添加</el-button>
          </div>
          <div class="type-select">
            <el-radio-group v-model="radio3" size="mini" >
              <el-radio-button label="其他类型"></el-radio-button>
            </el-radio-group>
          </div>
          <div class="search" v-show="SearchShow">
            <el-input placeholder="搜索功能名称/适用类型" v-snap="searchType" v-model="searchType"  size="mini" @keyup.native="handleChange()">
              <i slot="suffix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </div>
          <el-scrollbar>
            <div class="list" >
              <div class="cont">
                <div class="card" v-for="(item,index) in otherFuncitonList.properties" :key="'prototype'+index"  @click="addFun(item)">
                  <div class="left">
                    <p><i class="status"></i>{{item.propertyName}}<span class="arrt">属性</span></p>
                    <p><span>标识符：{{item.key}}</span><span>适用类型：{{item.typeName}}</span></p>
                  </div>
                  <div class="right">
                    <i class="el-icon-check check" v-if="addFunction.indexOf(item) > -1"></i>
                    <i class="el-icon-plus add" v-else></i>
                  </div>
                </div>
                <div class="card" v-for="(ability,index) in otherFuncitonList.abilitys" :key="'ability'+index"  @click="addFun(ability)">
                  <div class="left">
                    <p><i class="status"></i>{{ability.abilityName}}<span class="arrt">能力</span></p>
                    <p><span>标识符：{{ability.key}}</span><span>适用类型：{{ability.typeName}}</span></p>
                  </div>
                  <div class="right">
                    <i class="el-icon-check check" v-if="addFunction.indexOf(ability) > -1"></i>
                    <i class="el-icon-plus add" v-else></i>
                  </div>
                </div>
                <div class="card" v-for="(jtem,index) in otherFuncitonList.events" :key="'event'+index" @click="addFun(jtem)">
                  <div class="left">
                    <p><i class="status"></i>{{jtem.eventName}}<span class="arrt">事件</span></p>
                    <p><span>标识符：{{jtem.key}}</span><span>适用类型：{{jtem.typeName}}</span></p>
                  </div>
                  <div class="right">
                    <i class="el-icon-check check" v-if="addFunction.indexOf(jtem) > -1"></i>
                    <i class="el-icon-plus add" v-else></i>
                  </div>
                </div>
              </div>
            </div>
          </el-scrollbar>
        </div>
        <div class="right">
          <div class="top over">
            <span>已选功能：</span>
            <el-button type="primary" class="fr" size="mini" @click="addFunction = []"
                :disabled="computedMessage.length == 0 || computedMessage == ''"
            >全部删除</el-button>
          </div>
          <el-scrollbar class="addCheck">
            <div class="list over" style="">
              <div class="cont">
                <div class="card" v-for="(item,index) in computedMessage" :key="index">
                  <div class="left" v-if="item.propertyId">
                    <p><i class="status"></i>{{item.propertyName}}<span class="arrt">属性</span></p>
                    <p><span>标识符：{{item.key}}</span><span>适用类型：{{item.typeName}}</span></p>
                  </div>
                  <div class="left" v-else-if="item.abilityId">
                    <p><i class="status"></i>{{item.abilityName}}<span class="arrt">能力</span></p>
                    <p><span>标识符：{{item.key}}</span><span>适用类型：{{item.typeName}}</span></p>
                  </div>
                  <div class="left" v-else-if="item.eventId">
                    <p><i class="status" ></i>{{item.eventName}}<span class="arrt">事件</span></p>
                    <p><span>标识符：{{item.key}}</span><span>适用类型：{{item.typeName}}</span></p>
                  </div>
                  <div class="right" @click="remove(index)">
                    <i class="el-icon-circle-close close"></i>
                  </div>
                </div>
              </div>
            </div>
          </el-scrollbar>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeStandardFunction">取 消</el-button>
        <el-button
          type="primary"
          @click="saveStandardFunction"
        >确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑类型详情 -->
    <el-dialog
      class="edit-param edit-base-msg"
      title="编辑产品类型"
      :visible.sync="editProductTypeVisible"
      width="680px"
      :before-close="handleClose"
      top="20vh">
      <el-scrollbar>
        <div class="form-content">
          <div class="tabCon">
            <el-form :model="editTypeForm" label-width="80px" ref="editTypeForm" :rules="editTypeRule" @submit.native.prevent>
              <el-form-item label="产品类型" prop="procutTypeName">
                <el-input v-model="editTypeForm.procutTypeName" placeholder="支持汉字、字母、数字、-和_，必须以汉字、字母或数字开头" size="mini"></el-input>
              </el-form-item>
              <el-form-item label="产品类别" prop="productCategoryId">
                <el-select v-model="editTypeForm.productCategoryId" placeholder="请选择数据类型" size="mini">
                  <el-option
                    v-for="item in productCategoryList"
                    :key="item.categoryId"
                    :label="item.categoryName"
                    :value="item.categoryId"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="节点类型" prop="nodeType">
                <span style="font-size:12px;">{{editTypeForm.nodeType === 1 ? "网关" : editTypeForm.nodeType === 2 ? "设备" : "其他"}}</span>
              </el-form-item>
              <el-form-item label="描述">
                <el-input type="textarea" resize="none" maxlength="100" :autosize="{ minRows: 6, maxRows: 10}" v-model="editTypeForm.desc" placeholder="0-100个字符" size="mini"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-scrollbar>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button
          type="primary"
          @click="updateProductTypeDetail"
        >确 定</el-button>
      </span>
    </el-dialog>
    <type-usersetting v-if="addUserDefineFunctionVisible" :id="typeId" :show.sync="addUserDefineFunctionVisible" @dialogClose="addUserClose"></type-usersetting>
	</div>
</template>
<script>
import {
  productTypeDetails, //查询类型详情
  selectCategoryList, // 产品类别下拉
  updateProductType, //编辑类型详情
  selectDataTypeList, // 获取数据类型下拉列表
  selectTimeType, // 查询时间单位下拉框
  addTypeProperty, // 新增类型-属性
  standardFunctionByTypeId, //根据类型id查询非所属类型下功能列表（包含属性、能力、事件）集合
  addStandardFunctionToType, //产品类型添加标准功能
  selectFunctionsByTypeId, //查询功能列表（包含属性、能力、事件）集合
  proModelFunListDelet // 删除功能列表
} from "../../api/api.js";
import TypeUsersetting from './type-usersetting.vue' //添加自定义功能
import Modal from "./modelDetail-edit.vue"; //功能列表编辑功能
	export default {
		name: "type-detail",
		components: {
      TypeUsersetting,Modal,
		},
		data() {
			return {
        toggleTipVisible:false,
        productTypeDetail:'', //产品类型详情
        editProductTypeVisible:false, //产品类型编辑
        SearchShow:true, //标准功能搜索
        oldForm:{}, //产品类型详情
        editTypeForm:{ //编辑详情
          productCategoryId:'',
        },
        otherFuncitonList:'', //其他类型属性的集合
        searchType:'', //标准功能搜索
        edit:false, //编辑弹框
        addFunction:[], //已选功能列表
        productCategoryList:[], //产品类别下拉框
        //编辑产品类型规则
        editTypeRule: {
          procutTypeName: [
            {
              pattern: /^[a-zA-Z\u4e00-\u9fa5][a-zA-Z0-9\u4e00-\u9fa5\-\_]{0,14}$/,
              required: true,
              message: "1-15个字符(支持汉字、字母、数字、-和_，必须以字母，汉字开头)",
              trigger: "blur"
            }
          ],
          productCategoryId: [
            {
              required: true,
              message: "请选择产品类别",
              trigger: "change"
            }
          ],
          nodeType: [
            {
              required: true,
            }
          ],
          desc: [
            {
              message: "0-100个字符",
            }
          ]
        },
        tb_data:[],
        addUserDefineFunctionVisible:false, // 添加自定义功能弹框
        standAddDialogVisible: false, // 添加标准功能弹框
        arr:[],
        radio3:"可调光灯",
        activeInput:0,
			};
    },
    computed:{
      //已选功能拷贝
      computedMessage(){
        return Object.assign(this.addFunction);
      },
      //全部添加标准功能
      addAllDisable(){
        let self = this;
        if(self.otherFuncitonList != ""){
          let abilityLength = self.otherFuncitonList.abilitys.length;
          let eventsLength = self.otherFuncitonList.events.length;
          let prototypeLength = self.otherFuncitonList.properties.length;
            if(self.addFunction.length > 0){
              if((abilityLength+eventsLength+prototypeLength) == self.addFunction.length){
                return false
              }else{
                return true;
              }
            }else{
              return true;
            }
        }

      }
    },
		created() {},
		mounted() {
      this.getTypeDetails(); //获取产品类型详情
      this.getCategoryList(); //获取类别列表
      this.getDetailPageFunListMsg() //获取产品类型详情页面功能列表信息
		},
		methods: {
      //产品类型详情编辑
      editProductTypeVisibles() {
        this.editProductTypeVisible  = true;
      },
      //删除功能
      deleteModelFunList(res){
        let typeid,funId;
        if(res.proType=='能力'){
          typeid=2;
          funId=res.abilityId
        }else if(res.proType=='属性'){
          typeid=1
          funId=res.propertyId
        }else if(res.proType=='事件'){
          typeid=3
          funId=res.eventId
        }
       this.$confirm("删除后不可恢复，是否确认删除?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
        }).then(() => {
            proModelFunListDelet({'typeId':typeid,'functionId':funId}).then(res => {
              if (res.err_CODE == 0) {
                this.$message({
                  type: "success",
                  message: res.err_MESSAGE
                });
                this.getDetailPageFunListMsg()
              } else {
                this.$message.error(res.err_MESSAGE);
              }
            }).catch(() => {});
        }).catch(() => {});
      },
      //产品类型详情页获取
      addTypeClose(val){
        this.getDetailPageFunListMsg()
        this.tb_data.slice(0,0)
      },
      //功能列表编辑
      proFunEdit(val){
        this.mdeditopen=true
        this.$refs.mychild.parentHandleclick(this.mdeditopen,val,"type");
      },
      //获取产品类型详情页面功能列表信息
       getDetailPageFunListMsg(){
        let self = this;
        selectFunctionsByTypeId({typeId:self.$route.query.id}).then(res=>{
          for (const key in res.data) {
            if(key=="abilitys"){
              res.data.abilitys.forEach(val=>{
                if(val){
                  val.proType='能力';
                  val.proName=val.abilityName
                  val.dataTypeName='- -'
                  val.dataDefine='- -'//数据定义
                  val.dataCollectRate='- -'//数据采集频率
                  val.eventTypeName='- -'//事件类型
                  val.deliveryAddress='- -'//推送类型
                  val.openFilter='- -'
                }
              })
            }else if(key=="events"){
              res.data.events.forEach(val=>{
                if(val){
                  val.proType='事件';
                  val.proName=val.eventName
                  val.dataTypeName='- -'
                  val.dataDefine='- -'//数据定义
                  val.dataCollectRate='- -'
                  if(val.deliveryAddress=='' || val.deliveryAddress==null){//推送类型
                    val.deliveryAddress='- -'
                  }
                  if(val.openFilter==0){
                    val.openFilter='否'
                  }else{
                    val.openFilter='是'
                  }
                }
              })
            }else if(key=="properties"){
              res.data.properties.forEach(val=>{
                if(val){
                  val.proType='属性';
                  val.proName=val.propertyName;
                  if(val.openFilter==0){
                    val.openFilter='否'
                  }else{
                    val.openFilter='是'
                  }
                  // 数据定义
                  if(val.dataTypeName=='整数型'){
                     if(val.scheme.unit=='null' || val.scheme.unit=='无'){
                      val.dataDefine=`取值范围：${val.scheme.min} - ${val.scheme.max}`
                    }else{
                      val.dataDefine=`取值范围：${val.scheme.min}${val.scheme.unit} - ${val.scheme.max}${val.scheme.unit}`
                    }
                  }else if(val.dataTypeName=='浮点型'){
                     if(val.scheme.unit=='null' || val.scheme.unit=='无'){
                      val.dataDefine=`取值范围：${val.scheme.min} - ${val.scheme.max}`
                    }else{
                      val.dataDefine=`取值范围：${val.scheme.min}${val.scheme.unit} - ${val.scheme.max}${val.scheme.unit}`
                    }
                  }else if(val.dataTypeName=='枚举型'){
                    let enmstring=''
                    val.scheme.enumList.forEach(enu=>{
                      enmstring+=`${enu.value} - ${enu.name}；`
                    })
                    val.dataDefine=`枚举值：${enmstring}`
                  }else if(val.dataTypeName=='字符串'){
                    val.dataDefine=`数据长度：${val.scheme.maxLength}`
                  }else if(val.dataTypeName=='数组'){
                    if(val.scheme.arrayDataType==1){
                      val.dataDefine='整数型'
                    }
                    if(val.scheme.arrayDataType==2){
                      val.dataDefine='浮点型'
                    }
                    if(val.scheme.arrayDataType==3){
                      val.dataDefine='字符串'
                    }
                  }else if(val.dataTypeName=='布尔型'){
                    val.dataDefine=`布尔值：false - ${val.scheme.negative} ；true - ${val.scheme.positive}`
                  }
                  // 数据采集频率
                  if(val.gatherTypeName=="变化时采集"){
                    val.dataCollectRate="变化时采集"
                  }else if(val.gatherTypeName=="固定时长采集"){
                    val.dataCollectRate=`${val.duration}${val.durationUnitName}`
                  }
                  val.eventTypeName='- -'//事件类型
                  val.deliveryAddress='- -'//推送类型
                }
              })
            }
          }
          let data=res.data.abilitys.concat(res.data.events).concat(res.data.properties);
          if(res.err_CODE==0){
            self.tb_data = JSON.parse(JSON.stringify(data));
          }else{
            this.$message.error(data.err_MESSAGE)
          }
        }).catch(err => {
        })
      },
      //添加功能
      addAction(command) {
        let self = this;
        if (command == "userSetting") {
          self.addUserDefineFunctionVisible = true;
          this.typeId = this.$route.query.id - 0;
          // 获取下拉框选项
        }else if (command == "standard") {
          self.standAddDialogVisible = true;
          self.getOthers();
        }
      },
      // tab 切换
      selectType(index){
        this.toggleTipVisible = true;
        this.active = index;
      },
      //获取产品类型详情
      getTypeDetails(){
        productTypeDetails({productTypeId:this.$route.query.id}).then(res=>{
          this.productTypeDetail = res.data;
          this.edit = true;
          this.editTypeForm = JSON.parse(JSON.stringify(res.data));
          this.oldForm = JSON.parse(JSON.stringify(res.data))
        })
      },
      // 获取类别列表
      getCategoryList(){
         const loading = this.$loading({
          lock: true,
          target: document.querySelector('#type-detail')
        });
        selectCategoryList().then(res => {
          this.productCategoryList = res.data.data;
          loading.close()
        }).catch(() => {
          loading.close()
      });
      },
      // 编辑类别详情
      updateProductTypeDetail(){
        let self = this;
        this.$refs['editTypeForm'].validate(valid => {
          if (valid) {
            if(this.edit){
              if(self.oldForm.desc == self.editTypeForm.desc
                && self.oldForm.procutTypeName == self.editTypeForm.procutTypeName
                && self.oldForm.productCategoryId == self.editTypeForm.productCategoryId
              ){
                self.editProductTypeVisible = false;
                return;
              }

              updateProductType(this.editTypeForm).then(res => {
                if(res.err_CODE == 0){
                  this.$message.success(res.err_MESSAGE);
                  this.$refs['editTypeForm'].resetFields();
                  this.getTypeDetails();
                  this.editProductTypeVisible = false;
                }else{
                  this.$message.error(res.err_MESSAGE);
                }
              });
            }

          } else {
            return false;
          }
        });
      },
      //取消编辑产品类型
      handleClose(){
        if(!this.edit){
        }else{
          this.$confirm('是否放弃编辑?' ,{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            showClose: false,
          }).then(() => {
            this.editProductTypeVisible = false;
            this.$refs.editTypeForm.resetFields();
          }).catch(() => {});
        }
      },
      saveMultipleAdd(){

      },
      //标准功能取消编辑
      closeStandardFunction(){
        if(!this.edit){

        }else{
          this.$confirm('是否放弃编辑?',{
            confirmButtonText:'确定',
            cancelButtonText:'取消',
            showClose:false
          }).then(()=>{
            this.standAddDialogVisible = false;
            this.addFunction = [];
            this.searchType = "";
            this.getOthers();

          }).catch(()=>{})
        }
      },

      // 添加自定义功能
      // 关闭弹框
      addUserClose(isConfirm) {
				this.addUserDefineFunctionVisible = false;
				if(isConfirm) {
					this.getDetailPageFunListMsg();
				}
      },

      // 属性
      addFun(data){
        if(this.addFunction.indexOf(data) > -1){

        }else{
          this.addFunction.push(data)
        }

      },

      //获取其他类型的属性、功能集合
      getOthers(){
        let self = this;
        standardFunctionByTypeId({modelTypeId:this.productTypeDetail.productTypeId,keyWord:this.searchType}).then(res=>{
          if(res.err_CODE == 0){
            self.otherFuncitonList = res.data;
            if(self.activeInput == 0){
              if(self.otherFuncitonList.events.length != 0 || self.otherFuncitonList.properties.length != 0 || self.otherFuncitonList.abilitys.length != 0){
                self.SearchShow = true;
              }else{
                self.SearchShow = false;
              }
            }else{
              self.SearchShow = true;
            }
          }else{
            this.$message.error(res.err_MESSAGE);
          }
        })
      },
      //标准功能--单个删除
      remove(index){
        this.addFunction.splice(index,1)
      },
      //标准功能--全部添加
      addAll(){
        if(this.addAllDisable){
          this.addFunction = [...this.otherFuncitonList.abilitys,...this.otherFuncitonList.events,...this.otherFuncitonList.properties];
        }
      },
      //保存标准功能
      saveStandardFunction(){
        let self = this;
        let events = [],prototypes = [],abilitys = [];

        self.computedMessage.forEach((item,i)=>{
          if(item.propertyId){
            prototypes.push(item.propertyId);
          }else if(item.abilityId){
            abilitys.push(item.abilityId);
          }else if(item.eventId){
            events.push(item.eventId);
          }
        })

        addStandardFunctionToType({
            abilitiesIds:abilitys,
            eventIds:events,
            propretiesIds:prototypes,
            modelTypeId:self.productTypeDetail.productTypeId
          }).then(res=>{
          if(res.err_CODE == 0){
            self.standAddDialogVisible = false;
            self.addFunction = [];
            self.searchType = "";
            self.getDetailPageFunListMsg();
            self.getOthers();
          }else{
            this.$message.error(res.err_MESSAGE);
          }
        })
      },
      //搜索标准功能
      handleChange(){
        this.activeInput = 1;
        this.getOthers()
      }
		}
	};
</script>
<style lang="scss" scoped>
@import '../../styles/new-index.scss';
  #type-detail{
    .base-message{
      padding: 12px 14px;
      background: $content-bgColor;
      .base-title{
        .back{
          display:inline-block;
          width:60px;
          height:24px;
          border-radius:2px;
          color:#fff;
          text-align:center;
          margin-right:8px;
          .el-button {
            padding: 5px 8px;
            border-radius: 2px;
            font-size: 12px;
            color:#fff;
            background: #0FADFF;
            margin-right:12px;
            border:none;
          }
        }
        .name{
          display:inline-block;
          font-size:14px;
          font-weight:600;
          color:$new-font-color;
        }
        .el-button {
          padding: 8px 20px;
          border-radius: 2px;
          font-size: 12px;
          background: #0FADFF;
          margin-right:12px;
        }
        .el-button:hover {
	      background:rgba(15,173,255,0.8);
	    }
      }
      .msg{
        padding: 15px 12px 10px 12px;
        p{
          font-size: 12px;
          color: $new-font-color;
          margin-bottom: 10px;
          span{
            margin-right: 36px;
          }
        }
      }
    }
    .program-table{
      margin-top: 12px;
      padding: 12px 14px;
      background: $content-bgColor;
    }
    .action-list{
      margin-top: 12px;
      padding: 12px 14px;
      background: $content-bgColor;
      .name-wrapper{
        color: $y-color;
        cursor: pointer;
        text-decoration: underline;
        word-break:break-all;
        word-wrap:break-word;
      }
      .wrapperFunction{
        cursor: pointer;
      }
      th{
        background: $content-bgColor
      }
    }
    // 公共头部
    .title{
      .left{
        font-size: 14px;
        display: inline-block;
        font-weight:500;
        color: $new-font-color;
      }
      .el-button {
        padding: 8px 20px;
        border-radius: 2px;
        font-size: 12px;
        background: #0FADFF;
        margin-right:12px;
      }
      .el-button:hover {
        background:rgba(15,173,255,0.8);
      }
    }
    // 公共data
    .data{
      padding: 20px 10px;
      .el-icon-delete{
        color: $y-color
      }
    }
    // 添加标准功能
    .add-standard{
      .content{
        padding-top: 15px;
        &>.left{
          float: left;
          width: 413px;
          height: 430px;
          border-right: 2px solid #ADADAD;
          vertical-align: top;
        }
        &>.right{
          float: left;
          width: 413px;
          height: 430px;
          padding-left: 13px;
          vertical-align: top;
          .top{
            margin-bottom: 10px;
            padding-right: 0;
          }
          .addCheck{
            width:100%;
            height:410px;
          }
        }
        .top{
          overflow: auto;
          padding-right: 14px;
          span{
            vertical-align: middle;
            font-size: 14px;
            font-weight:500;
            color: #323232;
          }
        }
        .type-select{
          margin-top: 20px;
        }
        .search{
          margin-top: 15px;
          margin-bottom: 10px;
          padding-right: 14px;
        }
        .el-scrollbar {
          height: 330px !important;
        }
        .list{
          .cont{
            padding-bottom: 20px;
          }
          .card{
            overflow: auto;
            padding: 10px 0px 10px 10px;
            margin-right: 10px;
            border-bottom: 1px solid #ADADAD;
            &:hover{
              background: #ECECEC;
            }
            .left{
              float: left;
              p{
                font-size: 12px;
                color: #323232;
                margin-bottom: 5px;
                .status{
                  display: inline-block;
                  width: 6px;
                  height: 6px;
                  border-radius: 3px;
                  background: transparent;
                  vertical-align: top;
                  margin-right: 5px;
                  margin-top: 6px;
                }
                .arrt{
                  padding: 0px 4px;
                  border: 1px solid #666666;
                  margin-left: 10px;
                  border-radius: 2px;
                }
                &:last-of-type{
                  padding-left: 10px;
                  span{
                    margin-right: 15px;
                  }
                }
              }
            }
            .right{
              float: right;
              height: 100%;
              padding-right: 5px;
              i{
                cursor: pointer;
                font-size: 16px;
                margin-top: 12px;
                &.add{
                  font-size: 12px;
                  height: 17px;
                  width: 16px;
                  box-sizing: border-box;
                  color: #ffffff;
                  background: #AF7C58;
                  padding: 2px;
                  &::before{
                    top: 1px;
                    position: relative;
                  }
                }
                &.check{
                  color: #AF7C58;
                }
                &.close{
                  color: #AF7C58;
                  background: transparent;
                }
              }
            }
          }
        }
      }
    }

    // 添加自定义功能
    #addUserSettingDialog,.add-param,.edit-param{
      .el-scrollbar{
        height:100%;
      }
      div.form-content{
        div.tabMenu{
          display: flex;
          flex-direction: row;
          margin-bottom: 15px;
          span{
            font-size: 12px;
            color: #323232;
            width:50px;
            height:30px;
            line-height:30px;
            text-align: center;
            border:1px solid #dcdfe6;
            cursor: pointer;
            i{
              font-style: normal;
            }
          }

          span:first-child{
            width:80px;
            text-align: left;
            border:none;
            background: none;
            cursor: none;
          }

          span:nth-child(3){
            border-left: none;
            border-right: none;
          }

          span:last-child{
            width: 30px;
            border:none;

            i{
              color:#D8D8D8;
               cursor: pointer;
            }
          }

          span.active{
            background: #AF7C58;
            border:1px solid #AF7C58;
            color:#fff;
          }
        }
        div.tabCon{
          overflow:hidden;
          padding-bottom:30px;
          #dateType{
            width:120px !important;
          }
          .text-area-tip{
            padding-left: 80px;
            color: #ADADAD;
            font-size: 12px;
            padding-bottom: 5px;
          }
          .typeCon{
            .formItem{
              .el-form-item__content{
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                .el-input{
                  width: 100px;
                  .el-input__inner{
                    width:100px !important;
                  }
                }
              }
            }
          }
        }
      }
    }
    .edit-base-msg{
      .el-form-item__error{
        white-space: nowrap!important;
      }
    }
  }
</style>

<style lang='scss'>
@import '../../styles/new-index.scss';
  #type-detail{
    .base-message{

    }
    .program-table{

    }
    .action-list{
      .el-button{
        border: none;
      }
      .el-table .cell{
          overflow: initial;
      }
      .el-table{
         background:transparent !important;
        th{
          background:#EBF4FC;
          color:#323232;
          text-align:center;
          font-size:12px;
          border:none;
          border-right: 1px solid #fff;
        }
        tr{
          td{
            font-size:12px;
            color:#323232;
            background:$content-bgColor;
            border-bottom: $td-border;
            text-align: center;
            .txt_underline{
              color:$y-color;
              text-decoration: underline;
              cursor: pointer;
            }
          }
        }
      }
    }
    // 公共table
    .el-table{
      background:transparent !important;
      th{
        background:#EBF4FC;
        color:#323232;
        text-align:center;
        font-size:12px;
        border:none;
        border-right: 1px solid #fff;
      }
      tr{
        td{
          font-size:12px;
          color:#323232;
          background:$content-bgColor;
          border-bottom: $td-border;
          text-align: center;
          .txt_underline{
            color:$y-color;
            text-decoration: underline;
            cursor: pointer;
          }
        }
      }
    }
    // 添加标准功能
    .add-standard .el-dialog{
      display: flex;
      flex-direction: column;
      max-height: 80%;
      height: 560px;
      margin: 0 auto;
      margin-top: 8vh;
      .el-dialog__header {
        font-size:16px;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
      }
      .el-dialog__body {
        height: 100%;
        padding: 54px 20px 58px 20px;

        .content .left .top,.content .right .top{
          .el-button--primary.is-disabled{
            background:rgba(173, 173, 173, 1) !important;
            border:1px solid rgba(173, 173, 173, 1) !important;
          }
        }
      }
      .el-dialog__footer {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        text-align: center;
        .el-button {
          padding: 0;
          width: 88px;
          height: 28px;
          text-align: center;
          font-size: 12px;
        }
        .el-button:first-child {
          margin-right: 50px;
        }
      }
    }
    .el-scrollbar {
      .el-scrollbar__wrap {
        box-sizing:border-box;
        overflow-x: hidden;
        padding-right:5px;
      }
    }
    // 更改之后的
    .add-standard{
      .countent {
        overflow: hidden;
      }
      .type-select{
        .el-radio-group{
          width: 100%;
          .el-radio-button{
            border:none;
            .el-radio-button__inner{
              width: 396px !important;
              background:#AF7C58;
              color:#fff;
            }
          }
        }
      }

      .el-dialog__body .search{
        .el-input--mini{
          .el-input__inner{
            background:rgba(175, 124, 88, 0.2) !important;
          }
        }
      }
    }
    //添加自定义功能
    #addUserSettingDialog, .add-param,.edit-param{
      .el-form {
        .el-form-item__error {
          padding-top: 0px;
        }
        .el-form-item{
          .el-form-item__label{
            padding-left: 8px;
          }
          &.is-required {
            .el-form-item__label{
              padding-left: 0;
            }
          }
          &.frequency {
            .el-form-item__label{
              width: 100px!important;
            }
            .el-form-item__error{
              left: 250px;
            }
          }
        }
        .el-form-item__label {
          text-align:left;
        }
        .el-input{
          width: 485px;
        }
        .el-input__inner {
          width: 485px;
        }
        textarea{
          width:485px;
          height:100px;
        }
        .el-radio{
          margin-right:10px;
        }
        .el-radio__label{
          font-size:12px;
        }

        #dateType{
          width:170px !important;
        }
        #selType{
          width:30px !important;
        }
      }

      .typeCon{
        .formItem{
          // 空行
          &.blank-line{
            line-height: 30px;
            margin-bottom: 0;
            .el-form-item__label{
              line-height: 30px;
            }
            .el-form-item__content{
              line-height: 30px;
            }
          }
          // 枚举类型的删除图标
          .el-icon-circle-close{
            font-size: 16px;
            padding-top:12px;
            color: #AF7C58;
            cursor: pointer;
            margin-left: 10px;
            &::before{
              vertical-align:middle;
            }
          }
          .el-form-item__content{
            display: flex;
            flex-direction: row;
            span{
              margin-left:8px;
              margin-right:8px;
              &.name{
                width:231px !important;
              }
            }
            .el-input{
              width:231px !important;
              .el-input__inner{
                width:231px !important;
              }
            }
          }
          // 布尔值
          &.bolean{
            .el-input{
              width:191px !important;
              .el-input__inner{
                width:191px !important;
              }
            }
          }
        }
      }
    }
    // 能力-参数
    .ability{
      margin-bottom: 10px;
      line-height: 35px;
      .list{
        label{
          float: left;
          width: 80px;
          padding-left:8px;
        }
        &>div{
          overflow: auto;
          width: 510px;
          p{
            width: 100%;
            font-size: 12px;
            color: #323232;
            span{
              margin-right: 20px;
              &:last-of-type{
                margin-right: 0px;
              }
            }
            .right{
              float: right;
              font-size: 12px;
              i{
                cursor: pointer;
                color: #AF7C58;
                margin: 0 5px;
              }
            }
          }
        }
      }
    }
    // 新增参数footer
    .add-param{
      .el-dialog .el-dialog__footer{
        text-align: right;
        .el-button{
          border: none;
          width: 60px;
          &:first-child{
            color: #AF7C58;
            margin-right: 10px;
          }
        }
      }
    }

    //切换提示框
    #toggleTip{
      .el-dialog{
        height: 200px;
      }
      .el-dialog__body{
        height:200px;
      }
    }
    .edit-base-msg{
      .el-form-item__error{
        white-space: nowrap!important;
      }
    }
  }
</style>
