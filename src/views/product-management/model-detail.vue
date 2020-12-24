<template>
	<div id="model-detail">
    <Modal ref="mychild" @modelClose="addModelClose" @modelScroll='addScroll'/>
    <!-- 基本信息 -->
		<div class="base-message">
			<div class="base-title overh">
				<router-link to="/productModel" class="back">
					<el-button size="mini" icon="el-icon-arrow-left">返回</el-button>
				</router-link>
				<span class="name">{{productModelBaseMsg.productName}}</span>
				<el-button v-fence="{data:'', functions:['维护产品型号基本信息（新建，编辑，删除）']}" type="primary" @click="editopens" class="fr" size="mini" style="border:none" icon="el-icon-edit">编辑</el-button>
			</div>
			<div class="msg">
				<p><span>产品名称：{{productModelBaseMsg.productName}}</span><span>产品型号：{{productModelBaseMsg.productModelName}}</span><span>厂商：{{productModelBaseMsg.venderName}}</span></p>
				<p><span>产品类型：{{productModelBaseMsg.productTypeName}}</span><span>节点类型：{{productModelBaseMsg.nodeType==1 ? '网关': productModelBaseMsg.nodeType==2 ? '设备':'其他'}}</span><span>设备总数：{{productModelBaseMsg.countDevice}}</span><span>数据采集频率：{{productModelBaseMsg.gatherTypeNum}}</span></p>
        <p class="desc">描述：{{productModelBaseMsg.description}}</p>
			</div>
		</div>
    <!-- 调试程序 -->
		<div class="program-table">
      <div class="title">
        <div class="left">调试程序</div>
				<el-button v-fence="{data:'', functions:['维护产品型号基本信息（新建，编辑，删除）']}" type="primary" class="fr" size="mini" style="border:none"
         icon="el-icon-upload2" @click="uploadDialogs();upStatus = 4;">上传</el-button>
      </div>
      <div class="data">
        <el-table :data="procedure_data" size="mini">
          <el-table-column prop="version" label="版本号">
            <template slot-scope="scope">
              {{'V' + scope.row.version}}
            </template>
          </el-table-column>
          <el-table-column prop="description" label="备注"></el-table-column>
          <el-table-column prop="updateTime" label="操作时间"></el-table-column>
          <el-table-column prop="updaterName" label="操作人"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
            <div v-fence="{data:'', functions:['维护产品型号基本信息（新建，编辑，删除）']}">
              <span class="loads">
                <i
                  class="el-icon-download colors"
                  @click="downLoadFile(scope.row.procedureUrl,scope.row.version)"
                ></i>
              </span>
              <span class="loades">
                <i
                  class="el-icon-delete colors"
                  @click="deletFile(scope.row.procedureId)"
                ></i>
              </span>
            </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="paging">
        <el-pagination
          background
          @current-change="handleCurrentChangeProcedure"
          :current-page.sync="procedurePage.pageIndex"
          :page-size="3"
          layout="total, prev, pager, next, jumper"
          :total="procedureTotal"
          v-if="procedureTotal"
        ></el-pagination>
      </div>
		</div>
    <!-- 产品标签 -->
    <div class="product-tag">
      <div class="title">
        <div class="left">产品标签</div>
        <el-dropdown v-fence="{data:'', functions:['维护产品型号基本信息（新建，编辑，删除）']}" class="fr" border="none" trigger="click" @command="addTag">
          <el-button type="primary" size="mini">
            添加标签
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="selectTag">选择标签</el-dropdown-item>
            <el-dropdown-item command="userTag">自定义</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="tag-list">
        <ul>
          <li v-for="item in allTags" :key="item.code"><span>{{item.name}}</span>
          	<div class="labsList">	
          		<i v-fence="{data:'', functions:['维护产品型号基本信息（新建，编辑，删除）']}" class="el-icon-circle-close" @click="deleteTag(item.code)"></i>
          	</div>
          </li>
        </ul>
      </div>
    </div>
    <!-- 功能列表 -->
    <div class="action-list">
      <div class="title">
        <div class="left">功能列表</div>
        <el-dropdown v-fence="{data:'', functions:['维护产品型号功能（新建，编辑，删除）']}" class="fr" border="none" trigger="click" @command="addAction">
          <el-button type="primary" size="mini">
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
            min-width="120"
            label="功能名称">
            <template slot-scope="scope">
              <span v-fence="{data:'', functions:['维护产品型号功能（新建，编辑，删除）']}" slot="reference" class="name-wrapper" @click="proFunEdit(scope.row)">
                {{ scope.row.proName }}
              </span>
              <span v-empty="{data:'', functions:['维护产品型号功能（新建，编辑，删除）']}" slot="reference" class="name-wrapper">
                {{ scope.row.proName }}
              </span>
            </template>
          </el-table-column>
          <el-table-column min-width="130" prop="openFilter" label="是否启用筛选条件"></el-table-column>
          <el-table-column min-width="130" prop="key" label="标识符"></el-table-column>
          <el-table-column min-width="100" prop="dataTypeName" label="数据类型"></el-table-column>
          <el-table-column min-width="331" prop="dataDefine" label="数据定义"></el-table-column>
          <el-table-column min-width="120" prop="eventTypeName" label="事件类型"></el-table-column>
          <el-table-column min-width="148" prop="deliveryAddress" label="推送至"></el-table-column>
          <el-table-column label="操作" min-width="104">
            <template slot-scope="scope">
              <span v-fence="{data:'', functions:['维护产品型号功能（新建，编辑，删除）']}" style="cursor:pointer">
                <i
                  class="el-icon-delete" style="color:#AF7C58"
                  @click="deleteModelFunList(scope.row)"
                ></i>
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 添加标准功能-->
    <el-dialog
      class="add-standard multiple"
      title="添加标准功能"
      :visible.sync="multipleAddDialogVisible"
      width="866px"
      :before-close="multipleHouseClose"
      top="22vh">
      <div class="content">
        <div class="left">
          <div class="top over">
            <span>选择功能：</span>
            <el-button type="primary" class="fr" size="mini" @click="addAll"
            >全部添加</el-button>
          </div>
          <div class="type-select">
            <el-radio-group v-model="radio3" size="mini" @change="toggleFunction">
              <el-radio-button :label="productModelBaseMsg.productTypeName?productModelBaseMsg.productTypeName.split('/')[1]:''"></el-radio-button>
              <el-radio-button label="其他类型"></el-radio-button>
            </el-radio-group>
          </div>
          <div class="search" v-show="radio3 == '其他类型' && SearchShow">
            <el-input id="search" placeholder="搜索功能名称/适用类型" v-snap="searchText" v-model="searchText"  size="mini" @keyup.native="handleChange()" style="background:rgba(175, 124, 88, 0.2)">
              <i slot="suffix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </div>
          <el-scrollbar>
            <div class="list">
              <div class="cont">
                <div class="card" v-for="(item,index) in modelStandardList.properties" :key="'prototype'+index"  @click="addFun(item)">
                  <div class="left">
                    <p><i class="status"></i>{{item.propertyName}}<span class="arrt">属性</span></p>
                    <p><span>标识符：{{item.key}}</span><span>适用类型：{{item.typeName}}</span></p>
                  </div>
                  <div class="right">
                    <i class="el-icon-check check" v-if=" addFunctionToModel.indexOf(item) > -1"></i>
                    <i class="el-icon-plus add" v-else></i>
                  </div>
                </div>
                <div class="card" v-for="(ability,index) in modelStandardList.abilitys" :key="'ability'+index"  @click="addFun(ability)">
                  <div class="left">
                    <p><i class="status"></i>{{ability.abilityName}}<span class="arrt">能力</span></p>
                    <p><span>标识符：{{ability.key}}</span><span>适用类型：{{ability.typeName}}</span></p>
                  </div>
                  <div class="right">
                    <i class="el-icon-check check" v-if=" addFunctionToModel.indexOf(ability) > -1"></i>
                    <i class="el-icon-plus add" v-else></i>
                  </div>
                </div>
                <div class="card" v-for="(jtem,index) in modelStandardList.events" :key="'event'+index" @click="addFun(jtem)">
                  <div class="left">
                    <p><i class="status"></i>{{jtem.eventName}}<span class="arrt">事件</span></p>
                    <p><span>标识符：{{jtem.key}}</span><span>适用类型：{{jtem.typeName}}</span></p>
                  </div>
                  <div class="right">
                    <i class="el-icon-check check" v-if="addFunctionToModel.indexOf(jtem) > -1"></i>
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
            <el-button type="primary" class="fr" size="mini" @click="addFunctionToModel = []"
                :disabled="computedMessage.length == 0 || computedMessage == ''"
            >全部删除</el-button>
          </div>
          <el-scrollbar>
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

        <el-button @click="multipleHouseClose">取 消</el-button>

        <el-button
          type="primary"
          @click="addStandardFunToModel"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑 -->
    <div id="editproduct">
      <el-dialog
      class="editproindex"
      title="编辑产品信息"
      :visible.sync="editopen"
      width="576px"
      :before-close="handleClose">
        <div class="">
          <el-form class="proedit" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="75px">
            <el-form-item label="产品名称"  prop="productName">
                <el-input class="name" v-model="ruleForm.productName" placeholder="支持汉字、字母、数字、-和_，必须以字母，汉字开头" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="产品型号" prop="productModelName">
                <el-input class="name" v-model="ruleForm.productModelName" placeholder="例：A" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="厂商" prop="venderName">
                <el-input class="name" v-model="ruleForm.venderName" placeholder="例：**厂商" size="mini"></el-input>
            </el-form-item>
            <el-form-item class="value" label="产品类型" prop="productTypeName">{{ruleForm.productTypeName}}</el-form-item>
            <el-form-item class="value" label="节点类型" prop="nodeType">{{ruleForm.nodeType === 1 ? "网关" : ruleForm.nodeType === 2 ? "设备" : "其他"}}</el-form-item>
            <!-- 新增采集频率 -->
            <el-form-item style="margin-bottom: 20px;" label="数据采集频率" label-width="94px" required>
              <el-radio-group @change="durationUnitChangeTwo" class="collectRateRadio" v-model="ruleForm.gatherType">
                <el-radio :label="1" style="margin-right:12px;">变化时采集</el-radio>
                <el-radio :label="2" style="margin-left:0px;">固定时长采集</el-radio>
              </el-radio-group>
              <el-form-item class="collectQuck" v-if="ruleForm.gatherType==2">
                <el-input @blur="RateInput" class="collectRateInput" v-model="ruleForm.duration" :placeholder='ruleForm.durationUnit==1? "最大值为24的正整数":(ruleForm.durationUnit==2? "最大值为1440的正整数":(ruleForm.durationUnit==3? "最大值为86400的正整数":"最大值为24的正整数"))'></el-input>
              </el-form-item>
              <el-select @change="durationUnitChange" v-if="ruleForm.gatherType==2" class="collectRateSelect" v-model="ruleForm.durationUnit" placeholder="小时">
                <el-option
                  v-for="item in ruleForm2.radioUnits"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <div class="RateInputErr" v-if="ruleForm.rateErr">{{ruleForm.RateInputErr}}</div>
            </el-form-item>
            <el-form-item class="describ" label="产品描述" prop="description">
              <el-input placeholder="0-100个字符" resize="none"
              maxlength="100"
              :autosize="{ minRows: 6, maxRows: 10}" type="textarea" v-model="ruleForm.description" size="mini"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="handleClose">取 消</el-button>
            <el-button type="primary" @click="updateProductModelDetail">确 定</el-button>
        </span>
      </el-dialog>

      <!-- dialog 上传文件 -->
      <el-dialog class="upload" title="上传调试程序" :modal-append-to-body='false' :visible.sync="uploadDialog" width="576px" :before-close="restUpload" top="25vh">
        <el-form :model="uploadForm" ref="uploadForm" :rules="uploadFormRule" @submit.native.prevent>
          <el-form-item label="版本号" prop="version" label-width="100px">
            <el-input v-model.trim="uploadForm.version" placeholder="支持数字和." size="mini"><span slot="prefix">v</span></el-input>
          </el-form-item>
          <el-form-item class="desc" label="备注" prop="description" label-width="100px">
            <el-input
              type="textarea"
              size="mini"
              resize="none"
              maxlength="100"
              :autosize="{ minRows: 6, maxRows: 10}"
              placeholder="0-100个字符"
              v-model.trim="uploadForm.description">
            </el-input>
          </el-form-item>
          <el-form-item class="upload-line" label="上传新版本" label-width="100px" prop="procedureUrl" :show-message="upStatus == 4">
            <el-upload
              class="upload-demo"
              ref="upload"
              name="image_file"
              action=""
              :auto-upload="false"
              :http-request="uploadImage"
              :show-file-list="false"
              :before-upload="beforeAvatarUpload"
              :on-change="FileChange"
              :on-success="handleAvatarSuccess"
              :on-error="uploadError"
              size="mini"
            >
              <input type="hidden" v-model="uploadForm.procedureUrl">
              <el-tooltip class="item" effect="light" :content="fileName" :disabled="fileName?false:true" placement="top-start">
                <el-input class="filename" v-model="fileName" disabled="disabled" placeholder="例：项目/程序(上传版本大小不能超过200M！)" size="mini"></el-input>
              </el-tooltip>
              <el-button class="select" size="mini" type="primary">浏览</el-button>
            </el-upload>
            <el-button class="up" size="mini" type="primary" @click="uploadFile">上传</el-button>
          </el-form-item>
          <p class="upload-mes" style="padding-left:100px;">
            <span style="color:#323232;" v-if="upStatus == 0">上传中...</span>
            <span style="color:#67C23A;" v-else-if="upStatus == 1">上传成功！</span>
            <span style="color:#CC3D3D;font-size:12px;" v-else-if="upStatus == 2">上传失败，请重新上传!(上传版本大小不能超过200M！)</span>
            <span v-else></span>
          </p>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="restUpload()">取消</el-button>
					<el-button type="primary" @click="uploadPost()">确定</el-button>
        </span>
      </el-dialog>
      <model-usersetting v-if="addUserDefineFunctionVisible" :id="productModelId" :show.sync="addUserDefineFunctionVisible" @dialogClose="addUserClose"></model-usersetting>
    </div>
    <!-- 添加标签弹框 -->
    <div class="add-tag-box">
      <!-- 选择标签 -->
      <el-dialog title="选择产品标签" :visible.sync="selectLabelDialog" width="576px" :before-close="resetForm" top="30vh">
        <el-form :model="selectLabelForm" ref="selectLabelForm" :rules="tmpRule" @submit.native.prevent>
          <el-form-item label="产品标签分类" prop="labelTypeId" label-width="100px">
            <el-select v-model="selectLabelForm.labelTypeId" size="mini" @change="getCurrentTypeId" placeholder="请选择标签分类">
              <el-option
                v-for="(label, index) in productLabelTypeArr"
                :key="index"
                :label="label.name"
                :value="label.code"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="产品标签名称" prop="productModelLabelId" label-width="100px">
            <el-select v-model="selectLabelForm.productModelLabelId" size="mini" :disabled="!selectLabelForm.labelTypeId" placeholder="请选择标签名称">
              <el-option
                v-for="item in productTagNames"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="resetForm()">取消</el-button>
					<el-button type="primary" @click="selectTagAdd">确定</el-button>
        </span>
      </el-dialog>
      <!-- 添加自定义标签 -->
      <el-dialog title="自定义产品标签" :visible.sync="userLabelDialog" width="576px" :before-close="userResetForm" top="30vh">
        <el-form :model="userLabelForm" ref="userLabelForm" :rules="userTmpRule" @submit.native.prevent>
          <el-form-item label="产品标签分类" prop="productModelLabelTypeId" label-width="100px">
            <el-select v-model="userLabelForm.productModelLabelTypeId" size="mini" placeholder="请选择标签分类">
              <el-option
                v-for="(label, index) in productLabelTypeArr"
                :key="index"
                :label="label.name"
                :value="label.code"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="产品标签名称" prop="productModelLabelName" label-width="100px">
            <el-input v-model.trim="userLabelForm.productModelLabelName" placeholder="1-10个字符" size="mini"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="userResetForm()">取消</el-button>
					<el-button type="primary" @click="userTagAdd">确定</el-button>
        </span>
      </el-dialog>
    </div>
	</div>
</template>
<script>
import { saveAs } from 'file-saver'
import ossUpload from '../../labs/upload.js'
import Modal from "./modelDetail-edit.vue";
import ModelUsersetting from './model-usersetting.vue'
import {
  proTypeDetailBase, //获取产品型号详情页面产品信息
  getProgramList, // 产品型号详情页面调试程序列表查询
  updateProductModel, //编辑产品型号详情页面基本信息
  productAddProcedure, // 上传调试程序
  productDeletProcedure, // 删除调试程序
  proModelFunListSelect, // 获取功能列表
  proModelFunListDelet, // 删除功能列表
  proModelStandardFunctionByModelId, //根据型号id查询型号功能列表（包含属性、能力、事件）集合
  proModelOthersFunction, //产品型号--标准功能--其他功能列表数据获取
  addProModelStandardFun, //产品型号--添加标准功能
  getAllTag, //产品型号详情 查看标签
  deleteSelectedTag, // 删除标签
  getProductLabelTypeArr, // 获取产品标签分类下拉列表
  getTagName, // 通过标签分类查询标签名称
  addSelectTag, //添加  选择标签 确认
  addUserSettingTag //添加  自定义标签 确认
  } from '../../api/api.js';
import {getDate} from '../../labs/tools.js'
	export default {
		name: "model-detail",
		components: {
      Modal,
      ModelUsersetting
		},
		data() {
			return {
        checked:false,
        addUserDefineFunctionVisible: false,
        radio3:"",
        searchText:'',
        prolistedit:{},//功能列表编辑
        mdeditopen:false,
        addFunctionToModel:[],
        selectModel: [],  //所选的功能
        SearchShow:true,
        editopen:false, //编辑产品型号详情页面基本信息弹框显示隐藏
        multipleAddDialogVisible:false,
        selectModel:[],
        uploadDialog: false,
        procedurePage:{ //调试程序获取数据的参数
          productModelId:null,
          sign:null,
          pageSize: 3,
          pageIndex: 1
        },
        procedureTotal:0, //调试程序列表总条数
        uploadForm: {
          productModelId: null,
          version: null,
          description: null,
          procedureUrl: null
        },
        upStatus: 0, // 上传图片的状态
        fileName: null, // 文件名称
        uploadFormRule: {
          version: [
            { required: true,pattern: /^[\d+(\.\d+)*]{1,20}$/, message: "1-20个字符(支持数字和.)",  trigger: "blur" }
          ],
          description: [
            { message: "0-100个字符",trigger: "blur"}
          ],
          procedureUrl: [
            { required: true, message: "请浏览并上传文件！"}
          ]
        },
        oldRuleForm:{},
        ruleForm: {
          productModelId:null,
          rateErr: false,
			    RateInputErr: '',
        },
        ruleForm2: {
          productModelId:null,
          gatherType: '',
          duration: '',
          durationUnit: '1',
          radioUnits: [{value:1,label:'小时'},{value:2,label:'分钟'},{value:3,label:'秒'}],
          RateInputErr: '错误提示',
          radioNumPlace: ['最大值为24的正整数','最大值为1440的正整数','最大值为86400的正整数']
        },
        ruleFormEdit:{
          name: '温控器',
          xinghao:'SD0604.10',
          changshang:'xx厂商',
          type: [],
          timeunit: '',
          describe:'',
        },
        rules: {
          productName: [
            { required: true,pattern: /^[a-zA-Z\u4e00-\u9fa5][a-zA-Z0-9\u4e00-\u9fa5\-\_]{0,14}$/, message: "1-15个字符(支持汉字、字母、数字、-和_，必须以字母，汉字开头)",  trigger: "blur" }
          ],
          productModelName: [
            { required: true, min:1,max:50, message: "1-50个字符",  trigger: "blur" }
          ],
          venderName: [
            { required: true, min:1,max:50, message: "1-50个字符",  trigger: "blur" }
          ],
          productTypeName: [
            { required: true, min:1,max:50, message: "请选择类别/类型",  trigger: "blur" }
          ],
          nodeType: [
            { required: true }
          ],
          description:[
            {
            message: "0-100个字符",
          }
          ]
        },
        alldata: [],
        alldata1: [],
        productModelId:null, //产品型号id
        productModelBaseMsg:{},//产品型号基本信息
        procedure_data: [],
        tb_data:[],
        activeInput:0,
        modelStandardList:'',
        othersFunList:{
          properties:[],
          abilitys:[],
          productEventEntitys:[]
        },
        modelType:[],
        allTags:[],//查询标签
        productLabelTypeArr:[], //标签类型
        productTagNames:[],//产品标签名称
        selectLabelDialog:false,//选择产品标签弹框
        selectLabelForm: { //选择产品标签
          productModelLabelId: null,
          labelTypeId: null,
        },
        tmpRule: {
          labelTypeId: [
            {
              required: true,
              message: "请选择标签分类",
              trigger: "change"
            }
          ],
          productModelLabelId: [
            {
              required: true,
              message: "请选择标签名称",
              trigger: "change"
              
            }
          ]
        },
        userLabelDialog:false,//选择自定义产品标签弹框
        userLabelForm:{ //添加自定义标签
          productModelLabelTypeId:null,
          productModelLabelName:null
        },
        //添加自定义标签
        userTmpRule: {
          productModelLabelTypeId: [
            {
              required: true,
              message: "请选择标签分类",
              trigger: "change"
            }
          ],
          productModelLabelName: [
            {
              required: true,
              min:1,
              max:10, 
              message: "1-10个字符",
              trigger: "blur"  
            }
          ]
        }
      };
    },
    computed:{
      //标准功能拷贝
      computedMessage(){
        return Object.assign(this.addFunctionToModel);
      },
      //添加标准功能
      addAllDisable(){
        let self = this;
        if(self.modelStandardList != ""){
          let abilityLength = self.modelStandardList.abilitys.length;
          let eventsLength = self.modelStandardList.events.length;
          let prototypeLength = self.modelStandardList.properties.length;
            if(self.addFunctionToModel.length > 0){
              if((abilityLength+eventsLength+prototypeLength) == self.addFunctionToModel.length){
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
      this.productModelId = this.$route.query.id - 0;
      this.uploadForm.productModelId = this.$route.query.id - 0;
      this.getDetailPageBaseMsg(); //获取产品型号详情页面产品信息
      this.getProductProgramList(); // 获取产品型号详情页面调试程序列表信息
      this.getDetailPageFunListMsg() //获取产品型号详情页面功能列表信息
      this.getOthersFunToMolde(); //获取产品型号下的其他类型功能
      this.getAllTags();//查询标签
		},
		methods: {
      uploadDialogs() {
        this.uploadDialog = true;
      },
      editopens() {
        this.editopen = true;
      },
      //采集频率单位改变
      durationUnitChange(val){
        this.ruleForm.duration=''
        this.$set(this.ruleForm,'rateErr',false)
      },
      //获取采集频率
      durationUnitChangeTwo(val){
        this.ruleForm.duration=''
        this.$set(this.ruleForm,'rateErr',false)
        this.$set(this.ruleForm,'durationUnit',1)
      },
      //固定时长采集
      RateInput() {
        let radioNum = Number(this.ruleForm.duration);
        let radioUnit = this.ruleForm.durationUnit;
        if(radioUnit == '小时' || radioUnit == '1') {
            if(!(radioNum>=1 && radioNum<=24) || !(/(^[0-9]*[1-9][0-9]*$)/.test(radioNum)) ) {
                this.$set(this.ruleForm,'RateInputErr','请输入1-24的正整数')
                this.$set(this.ruleForm,'rateErr',true)
            }else {
                this.ruleForm.rateErr = false;
            }
        }else {
            if(radioUnit == '2') {
                if(!(radioNum>=1 && radioNum<=1440) || !(/(^[0-9]*[1-9][0-9]*$)/.test(radioNum)) ) {
                    this.ruleForm.RateInputErr = '请输入1-1440的正整数'
                    this.ruleForm.rateErr = true;
                }else {
                    this.ruleForm.rateErr = false;
                }
            }else if(radioUnit == '3') {
                if(!(radioNum>=1 && radioNum<=86400)  || !(/(^[0-9]*[1-9][0-9]*$)/.test(radioNum)) ) {
                    this.ruleForm.RateInputErr = '请输入1-86400的正整数'
                    this.ruleForm.rateErr = true;
                }else {
                    this.ruleForm.rateErr = false;
                }
            }
        }
      },
      addScroll(){
      },
      //详情列表
      addModelClose(val){
        this.getDetailPageFunListMsg()
        this.tb_data.slice(0,0)
      },
      saveMultipleAdd(){},
      proFunEdit(val){//功能列表编辑
        this.mdeditopen=true
        this.$refs.mychild.parentHandleclick(this.mdeditopen,val,'model');
      },
      getDetailPageBaseMsg(){ //获取产品型号详情页面产品信息
        let self = this;
        proTypeDetailBase({productModelId:self.productModelId}).then(res=>{
          let data = res.data;
          if(data.err_CODE==0){
            self.productModelBaseMsg = data.data;
            if(data.data.gatherType == '1') {
            	self.productModelBaseMsg.gatherTypeNum = '变化时采集';
            }else if(data.data.gatherType == '2'){
            	if(data.data.durationUnit == '1') {
            		self.productModelBaseMsg.gatherTypeNum = data.data.duration + '小时';
            	}else if(data.data.durationUnit == '2') {
            		self.productModelBaseMsg.gatherTypeNum = data.data.duration + '分钟';
            	}else if(data.data.durationUnit == '3') {
            		self.productModelBaseMsg.gatherTypeNum = data.data.duration + '秒';
            	}else if(data.data.durationUnit == '99') {
            		self.productModelBaseMsg.gatherTypeNum = data.data.duration + '其他';
            	}
            }
            self.gatherTypeNum = 
            self.edit = true;
            self.ruleForm = JSON.parse(JSON.stringify(data.data));
            if(!self.ruleForm.durationUnit){
              self.ruleForm.durationUnit=1
            }
            self.oldRuleForm = JSON.parse(JSON.stringify(data.data));
            //标准功能弹出框中tab栏菜单数据渲染；
            self.radio3 = data.data.productTypeName != "" ?  data.data.productTypeName ? data.data.productTypeName.split('/')[1] : "" :'';
          }else{
            this.$message.error(data.err_MESSAGE);
          }
        })
      },
      getDetailPageFunListMsg(){ //获取产品型号详情页面功能列表信息
        let self = this;
        let data=JSON.stringify({modelId:self.productModelId})
        proModelFunListSelect({modelId:self.productModelId}).then(res=>{
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
                  if(val.deliveryAddress=='' || val.deliveryAddress==null){
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
        })
      },
      //删除当前功能
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
      updateProductModelDetail(){ //编辑产品型号详情页面基本信息
      const loading = this.$loading({
        lock: true,
        target: document.querySelector('#model-detail')
      });
        let self = this;
        if(this.ruleForm.gatherType==2){
          this.RateInput()
        }
        this.$refs['ruleForm'].validate(valid => {
          if (valid && !this.ruleForm.rateErr) {
            if(self.oldRuleForm.productModelName == self.ruleForm.productModelName
              && self.oldRuleForm.venderName == self.ruleForm.venderName
              && self.oldRuleForm.productName == self.ruleForm.productName
              && self.oldRuleForm.description == self.ruleForm.description
              && self.oldRuleForm.gatherType==self.ruleForm.gatherType
              && self.oldRuleForm.duration==self.ruleForm.duration
              && self.oldRuleForm.durationUnit==self.ruleForm.durationUnit
            ){
              self.editopen = false;
              return;
            }
            if(self.ruleForm.gatherType==1){
              self.ruleForm.gatherTypeName="变化时采集"
            }else{
              self.ruleForm.gatherTypeName="固定时长采集"
            }
            updateProductModel(this.ruleForm).then(res => {
              if(res.err_CODE == 0){
                this.$message.success(res.err_MESSAGE);
                setTimeout(()=>{
                  this.$refs['ruleForm'].resetFields();
                  this.$set(this.ruleForm,'durationUnit',1)
                })
                loading.close()
                this.getDetailPageBaseMsg();
                this.editopen = false;
              }else{
                this.$message.error(res.err_MESSAGE);
              }
            }).catch(err => {
              loading.close()
            });
          } else {
            return false;
          }
        });
      },
      getProductProgramList(){ // 获取产品型号详情页面调试程序列表信息
        let self = this;
        self.procedurePage.productModelId = self.productModelId
        getProgramList({...self.procedurePage}).then(res=>{
          let data = res.data;
          if(res.err_CODE==0){
            let list;
            if(data.list.length){
              list = data.list.map(item=>{
                item.updateTime = getDate(item.updateTime);
                return item;
              })
            }
            self.procedure_data = list;
            self.procedureTotal = data.total;
          }
        }).catch(() => {
        })
      },
      handleCurrentChangeProcedure(val) {
        this.procedurePage.pageIndex = val;
        this.getProductProgramList();
      },
      //添加功能
      addAction(command) {
        let self = this;
        if (command == "userSetting") {
          this.addUserDefineFunctionVisible = true;
        }else if (command == "standard") {
            let promise1 = proModelStandardFunctionByModelId({modelId: this.productModelId});
            let promise2 = proModelOthersFunction({keyWord:this.searchText,modelTypeId:this.productModelId});
            Promise.all([promise1,promise2]).then(res=>{
                this.multipleAddDialogVisible = true;
                if(res[0].err_CODE == 0){
                  this.alldata = res[0].data;
                }else{
                  this.$message.error(res[0].err_MESSAGE);
                }
                if(res[1].err_CODE == 0){
                  this.alldata1 = res[1].data;
                    this.modelStandardList = this.alldata
                    if(this.activeInput == 0){
                      if(this.modelStandardList.events ? this.modelStandardList.events.length != 0 : '' || this.modelStandardList.properties ? this.modelStandardList.properties.length != 0 : ''|| this.modelStandardList.abilitys ? this.modelStandardList.abilitys.length != 0 :''){
                        this.SearchShow = true;
                      }else{
                        this.SearchShow = false;
                      }
                    }else{
                      this.SearchShow = true;
                    }
                  
                }else{
                  this.$message.error(res[1].err_MESSAGE);
                }
            })

          this.$nextTick(()=>{
            this.proModelStandardList();
          })
        }
      },
      handleClose(){
        this.$confirm('是否放弃编辑?' ,{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          showClose:false,
        }).then(() => {
          this.editopen = false;
          setTimeout(()=>{
            this.$refs.ruleForm.resetFields();
            this.ruleForm=JSON.parse(JSON.stringify(this.oldRuleForm))
          },400)
        }).catch(() => {});
      },
      //添加自定义功能关闭
      addUserClose(isConfirm) {
				this.addUserDefineFunctionVisible = false;
				if(isConfirm) {
					this.getDetailPageFunListMsg();
				}
      },
      // 下载文件
      downLoadFile(url,version){
        let fileName = url.lastIndexOf("."); //向后以.分割
        let fileNameLength = url.length;
        let fileFormat = url.substring(fileName + 1, fileNameLength); //字符串提取
        let FileSaver = require('file-saver');
        if(url) FileSaver.saveAs(url,version + '.' + fileFormat);
      },

      // 删除调试程序
      deletFile(id){
        this.$confirm("删除后不可恢复，是否确认删除?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
        })
          .then(() => {
            productDeletProcedure({
              procedureIds: [id],
            })
              .then(res => {
                if (res.err_CODE === 0) {
                  this.procedure_data = this.procedure_data.filter(
                    item => item.procedureId !== id
                  );
                  this.getProductProgramList();
                  this.$message({
                    type: "success",
                    message: res.err_MESSAGE
                  });
                } else {
                  this.$message.error(res.err_MESSAGE);
                }
              })
              .catch(err => {
                this.$message.error(res.err_MESSAGE);
              });
          })
          .catch(err => {});
      },
      // 上传文件
      uploadPost() {
        if(this.upStatus != 1 && this.uploadForm.procedureUrl == " ") this.uploadForm.procedureUrl = "";
        this.$refs['uploadForm'].validate(valid => {
          if (valid) {
            productAddProcedure(this.uploadForm).then(res => {
              if(res.err_CODE == 0){
                this.fileName = "";
                this.$message.success(res.err_MESSAGE);
                this.$refs['uploadForm'].resetFields();
                this.getProductProgramList();
                this.uploadDialog = false;
              }else{
                this.$message.error(res.err_MESSAGE);
              }
            });
          }else{
            return false;
          }
        });
      },
      // 重置上传文件
      restUpload() {
        this.$confirm('是否放弃编辑?' ,{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          showClose:false,
        }).then(() => {
          this.$refs.uploadForm.resetFields();
          this.fileName = "";
          this.uploadDialog = false;
        }).catch(() => {});
      },
      // 手动上传
      uploadFile(){
        this.$refs.upload.submit();
      },
      FileChange(file,fileList){
        if(file.response){ 
          this.uploadForm.procedureUrl = file.response.res.requestUrls[0];
        }else{
          this.uploadForm.procedureUrl = " ";
        }
        this.fileName = fileList[fileList.length - 1].name;
      },
      uploadImage(option) {
        ossUpload.ossUploadFile(option);
      },
      beforeAvatarUpload(file) {
        this.upStatus = 0;
        const isLt200M = file.size / 1024 / 1024 < 200; // 文件大小不超过200M
        if(!isLt200M) {
          this.upStatus = 2;
          return false;
        }
      },
      // 获取上传成功文件的地址
      handleAvatarSuccess(res, file) {
        this.uploadForm.procedureUrl = res.res.requestUrls[0];
        this.upStatus = 1;
      },
      uploadError() {
        this.$message.error("上传失败，请重新上传");
      },
      //标准框取消
      multipleHouseClose(){
        if(!this.edit){

        }else{
          this.$confirm('是否放弃编辑?',{
            confirmButtonText:'确定',
            cancelButtonText:'取消',
            showClose:false
          }).then(()=>{
            this.multipleAddDialogVisible = false;
            this.radio3 = this.productModelBaseMsg.productTypeName != "" ? this.productModelBaseMsg.productTypeName ? this.productModelBaseMsg.productTypeName.split("/")[1] : "" : '';
            this.addFunctionToModel = [];
            this.searchText = "";
            this.toggleFunction();
          }).catch(()=>{})
        }
      },
      // 获取产品型号下的标准功能列表
      proModelStandardList(){
        let self = this;
        this.modelStandardList = this.alldata

      },
      //获取产品型号下的其他类型功能
      getOthersFunToMolde(){
        let self = this;
        this.modelStandardList = this.alldata1
      },
      //标准功能--全部添加
      addAll(){
          if(this.addFunctionToModel){
            this.addFunctionToModel = [...this.addFunctionToModel,...this.modelStandardList.abilitys,...this.modelStandardList.events,...this.modelStandardList.properties];
          }else{
            this.addFunctionToModel = [...this.selectModel,...this.modelStandardList.abilitys,...this.modelStandardList.events,...this.modelStandardList.properties];
          }
          this.addFunctionToModel = Array.from(new Set(this.addFunctionToModel));
      },
      //添加 选中某个事件、属性或能力至标准功能列表
      addFun(data){
        if(this.addFunctionToModel.indexOf(data) > -1){

        }else{
          this.addFunctionToModel.push(data);
          this.selectModel = Array.from(new Set(this.addFunctionToModel));
        }

      },
      //标准功能--单个删除
      remove(index){
        this.addFunctionToModel.splice(index,1)
        this.selectModel = this.addFunctionToModel;
      },
      //添加标准功能弹框 tab 切换
      toggleFunction(){
        if(this.radio3 == "其他类型"){
          this.getOthersFunToMolde()
          if(this.alldata1.events.length != 0 || this.alldata1.properties.length != 0 || this.alldata1.abilitys.length != 0){
            this.SearchShow = true;
          }else{
            this.SearchShow = false;
          }
          
        }else{
          this.proModelStandardList();
        }

      },

      //产品型号--添加标准功能
      addStandardFunToModel(){
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

        addProModelStandardFun({
            abilitiesIds:abilitys,
            eventIds:events,
            propretiesIds:prototypes,
            modelTypeId:self.productModelId
          }).then(res=>{
          if(res.err_CODE == 0){
            self.multipleAddDialogVisible = false;
            self.addFunctionToModel = [];
            self.getDetailPageFunListMsg();
            self.searchText = "";
            self.radio3 = self.productModelBaseMsg.productTypeName ? self.productModelBaseMsg.productTypeName.split('/')[1]:'' ;
            self.toggleFunction();
          }else{
            this.$message.error(res.err_MESSAGE);
          }
        })
      },
      //搜索功能名称
      handleChange(){
        this.activeInput = 1;
        proModelOthersFunction({keyWord:this.searchText,modelTypeId:this.productModelId}).then(res=>{
            if(res.err_CODE == 0){
              this.alldata1 = res.data;
              if(this.activeInput == 0){
                if(this.alldata1.events.length != 0 || this.alldata1.properties.length != 0 || this.alldata1.abilitys.length != 0){
                  this.SearchShow = true;
                }else{
                  this.SearchShow = false;
                }
              }else{
                this.SearchShow = true;
              }
              this.getOthersFunToMolde();
            }else{
              this.$message.error(res.err_MESSAGE);
            }
        })        
      },
      //查询标签
      getAllTags(){
        let self = this;
        getAllTag({productModelId:self.productModelId}).then(res=>{
          let data = res.data;
          if(res.err_CODE==0){
            self.allTags = data;
           
          }else{
            self.$message.error(res.err_MESSAGE);
          }
        })
      },
      // 删除标签
      deleteTag(id){
        let self = this;
        self.$confirm("删除后不可恢复，是否确认删除?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
        })
          .then(() => {
            deleteSelectedTag({modelId:self.productModelId,labelId:id}).then(res => {
              if (res.err_CODE === 0) {
                self.getAllTags();
                this.$message({
                  type: "success",
                  message: res.err_MESSAGE
                });
              } else {
                this.$message.error(res.err_MESSAGE);
              }
            })
            .catch(err => {
              this.$message.error(res.err_MESSAGE);
            });
          }).catch(err => {});


        
      },
      //选择添加标签方式
      addTag(command){
        let self = this;
        getProductLabelTypeArr().then(res => { //获取标签类型
          let data = res.data.data;
          this.productLabelTypeArr = data;
        });

        if(command=="selectTag"){//选择
          self.selectLabelDialog = true;
        }else if(command=="userTag"){
          self.userLabelDialog = true;
        }
      },
      //通过标签类型改变获取标签名称
      getCurrentTypeId(id){
        let self = this;
        self.selectLabelForm.productModelLabelId = null;
        getTagName({labelTypeId:id}).then(res=>{
          if(res.err_CODE==0){
            self.productTagNames = res.data;
          }else{
            self.$message.error(res.err_MESSAGE);
          }
        })
      },
      //重置选择标签弹框
      resetForm() {
        this.$refs.selectLabelForm.resetFields();
        this.selectLabelDialog = false;
        this.selectLabelForm={
          productModelLabelId: null,
          labelTypeId: null,
        }
      },
      selectTagAdd(){ //点击选择标签确定
        let self = this;
        self.$refs.selectLabelForm.validate(valid => {
          if (valid) {
            addSelectTag({productModelId:self.productModelId,productModelLabelId:self.selectLabelForm.productModelLabelId}).then(res=>{
              if(res.err_CODE==0){
                self.selectLabelDialog = false;
                self.getAllTags();
                self.$message({
                  type: "success",
                  message: res.err_MESSAGE
                });
                self.resetForm();
                
              }else{
                self.$message.error(res.err_MESSAGE);
              }
            })
          }else{
            return false
          }
        })
      },
      // 重置自定义标签弹窗
      userResetForm(){
        this.$refs.userLabelForm.resetFields();
        this.userLabelDialog = false;
        this.userLabelForm={
          productModelLabelTypeId: null,
          productModelLabelName: null
        }
      },
      //点击自定义标签 确定
      userTagAdd(){
        let self = this;
        self.$refs.userLabelForm.validate(valid => {
          if (valid) {
            let param = {productModelId:self.productModelId,...self.userLabelForm}
            
            addUserSettingTag(param).then(res=>{
              if(res.err_CODE==0){
                self.userLabelDialog = false;
                self.getAllTags();
                self.$message({
                  type: "success",
                  message: res.err_MESSAGE
                });
                self.userResetForm();
                
              }else{
                self.$message.error(res.err_MESSAGE);
              }
            })
          }else{
            return false
          }
        })
      }
		}
	};
</script>
<style lang="scss" scoped>
@import '../../styles/new-index.scss';
  #model-detail{
    .base-message{
      padding: 12px 14px;
      background: $content-bgColor;
      .base-title{
      	.el-button:hover {
	      background:rgba(15,173,255,0.8);
	    }
        .back{
          display:inline-block;
          width:60px;
          height:24px;
          border-radius:2px;
          color:$content-bgColor;
          text-align:center;
          margin-right:8px;
          .el-button {
            padding: 5px 8px;
            border-radius: 2px;
            font-size: 12px;
            color:$content-bgColor;
            background: #0fadff;
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
          background: #0fadff;
          margin-right:12px;
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
      .paging{
        margin-top:10px;
        text-align:right;
      }
      .data{
        .loads{
          cursor:pointer;
          margin-right:10px;
          .colors{
            color:#AF7C58;
          }
        }
        .loades{
          cursor: pointer;
          .colors{
            color:#AF7C58;
          }
        }
      } 
    }
    .action-list{
      margin-top: 12px;
      padding: 12px 14px;
      background: $content-bgColor;
      .name-wrapper{
        color: $y-color;
        cursor: pointer;
        text-decoration: underline;
      }
      background: $content-bgColor;
    }
    // 公共头部
    .title{
      .left{
        font-size: 14px;
        font-weight:bold;
        display: inline-block;
        color: $new-font-color;
      }
      .el-button {
        padding: 8px 20px;
        border-radius: 2px;
        font-size: 12px;
        background: #0fadff;
        margin-right:12px;
      }
      .el-button:hover {
        background:rgba(15,173,255,0.8);
      }
    }
    .product-tag{ //添加标签
      margin-top: 12px;
      padding: 12px 14px;
      background: $content-bgColor;
      .el-button{
        padding:8px;
      }
      .tag-list{
        padding: 20px 10px;
        ul{
          overflow:hidden;
          li{
            float:left;
            height:28px;
            line-height:28px;
            padding:0 8px 0 12px;
            background:$y-color;
            border-radius:2px;
            color:#fff;
            margin-right:16px;
            margin-bottom:12px;
            span{
              font-size:12px;
              margin-right:20px;
            }
            i{
              font-size:16px;
              cursor:pointer;
            }
            .labsList{
             float:right;
             margin-top:6px;
             overflow: hidden;
            }
          }
        }
      }
    }
    .action-list{ //添加功能
      margin-top: 12px;
      padding: 12px 14px;
      background: $content-bgColor;
      .el-button{
        padding:8px;
      }
      .name-wrapper{
        color: $y-color;
        cursor: pointer;
        text-decoration: underline;
      }
    }
    // 公共data
    .data{
      padding: 20px 10px;
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
          .el-scrollbar{
            height: 330px;
          }
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
          .el-scrollbar{
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
            color: $new-font-color;
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
        .list{
          .cont{
            padding-bottom: 20px;
          }
          .card{
            overflow: auto;
            padding: 10px;
            border-bottom: 1px solid #DEDEDE;
            &:hover{
              background: #ECECEC;
            }
            .left{
              float: left;
              p{
                font-size: 12px;
                color: $new-font-color;
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
                  color: #fff;
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
      content{
        overflow: hidden;
      }
    }
    //添加便签
    .add-tag-box{}
  }
</style>

<style lang='scss'>
@import '../../styles/new-index.scss';
#editproduct{
  .editproindex{//编辑
    .proedit .el-form-item .el-form-item__content .el-form-item .el-form-item__content .el-form-item__error{
      padding-top: 0px;
    }
    .collectRateRadio {
        margin-right: 2px;
        .el-radio__label {
            padding-left: 10px;
            font-size: 12px;
        }
    }
    .collectQuck{
      display: inline-block;
      margin-bottom: 0;
    }
    .RateInputErr {
        position: absolute;
        left: 200px;
        color: #f56c6c;
        font-size: 12px;
        top:26px
    }
    .collectRateInput {
        display: inline-block;
        width: 163px;
        height: 24px;
        .el-input__inner {
            width: 163px;
            height: 24px;
            padding: 0 2px;
        }
    }
    .collectRateSelect {
        display: inline-block;
        width: 50px;
        height: 24px;
        margin-left: -6px;
        .el-input {
            width: 50px;
            height: 24px;
            .el-input__inner {
                width: 50px;
                height: 24px;
                padding: 0 10px 0 5px;
                background: #1E2E4C;
                color: #FFFFFF;
            }
            .el-input__icon {
                width: 10px;
                line-height: 24px;
                margin-top:8px;

            }
            .el-input__suffix{
                  top: 0px;
            }
        }
    }
    .el-form-item__error{
      white-space: nowrap!important;
    }
  
    .el-dialog__title{
      font-size:16px;
      font-weight:bolder;
      color:rgba(50,50,50,1);
      line-height:22px;
    }
    .el-form-item{
      .el-form-item__label{
          padding-left: 9px;
        }
        &.is-required {
          .el-form-item__label{
            padding-left: 0;
          }
        }
    }
    .el-dialog__footer{
      padding-bottom: 34px!important;
    }
    .dialog-footer {
        .el-button {
          padding: 0;
          width: 88px;
          height: 28px;
          text-align: center;
          font-size: 12px;
        }
        .el-button:first-child:hover{
        	background: rgba(175,124,88,0.2);
        	color:#323232;
        }
    }
    .name input{
        width:430px !important;
        font-size:12px;
        font-weight:400;
        color:rgba(50,50,50,1);

    }
    .value .el-form-item__content{
      font-size:12px;
      font-weight:500;
      color:rgba(50,50,50,1);

    }
    .line{
        text-align: center !important;
        padding-left: 7px;
        width: 30px;
    }

    .describ{
      min-height: 132px;
      .el-form-item__label{
        line-height: 17px
      }
      .el-form-item__content{
        min-height: 132px;
        .el-textarea__inner{
          width: 430px;
          min-height: 132px!important;
          font-size:12px;
          font-weight:400;
          line-height:17px;
          padding: 5px 6px;
        }
      }
    }
    .el-dialog__body{
      padding-top: 0;
    }
    .el-dialog__header{
      padding-bottom: 16px;
    }
    .el-form-item__error{
      top:auto
    }
  }
}
#model-detail{
  .base-message{

  }
  .program-table{
    .downloads{
      cursor:pointer !important;
      margin-right:10px !important;
    }
  }
  .product-tag{
    .el-button{
      border: none;
    }
  }
  .action-list{
    .el-table .cell{
        overflow: initial;
    }
    .el-button{
      border: none;
    }
  }
  // 公共table
  .el-table{
    background:transparent !important;
    th {
      background: #EBF4FC;
      color: $new-font-color;
      text-align: center;
      font-size: 12px;
      border: none;
      border-right: 1px solid #fff;
    }
    tr {
      td {
        font-size: 12px;
        color: $new-font-color;
        background: $content-bgColor;
        border-bottom: $td-border;
        text-align: center;

        .txt_underline {
          color: $y-color;
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
      .el-scrollbar__view{
        margin-bottom: 125px;
      }

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
  .add-standard{
    .type-select{
      .el-radio-group{
        width: 100%;
        .el-radio-button{
          border:none;
          .el-radio-button__inner{
            width:198px;
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
  .el-scrollbar {
    height: 100%;
    .el-scrollbar__wrap {
      box-sizing:border-box;
      overflow-x: hidden;
    }
  }
  .upload .el-dialog{
    .desc{
      .el-form-item__label{
        padding-left: 8px;
      }
    }
    .el-input{
      .el-input__inner{
        width: 430px;
        padding-left:20px;
      }
      .el-input__prefix{
        color: #323232;
        font-size: 12px;
        padding-left: 3px;
      }
    }
    .upload-line{
      padding-top:5px;
      .upload-demo{
        display: inline;

      }
      .el-input{
        width: 300px;
        .el-input__inner{
          width: 300px;
        }
      }
      .el-button{
        .el-input__inner{
          width: 400px;
        }
        &.select{
          background: #ffffff;
          color: $y-color;
          border:1px solid rgba(175,124,88,0.8);
        }
        .el-button{
          .el-input__inner{
            width: 400px;
          }
          &.select{
            background: $content-bgColor;
            color: #323232;
            border:1px solid rgba(175,124,88,1);
          }
          &.up{
            margin-left: 10px;
            background: #323232;
            border:1px solid $content-bgColor;
          }
        }
      }
    }
    .el-textarea{
      word-wrap:break-word;
      margin-top: 15px;
      .el-textarea__inner{
        width: 430px;
        padding:5px 10px;
      }
    }
  }
  //添加标签
  .add-tag-box{
    .el-dialog__body { 
      margin-bottom: 70px;
    }
    .el-form{
      .el-input {
        width: 406px;
        height:28px !important;
      }
      .el-input__inner {
        width: 406px;
        height:28px !important;
      }
      .el-form-item__error {
        padding-top: 0px;
      }
    } 
    }
}
  // 分页的样式--
  .el-pagination {
      padding: 2px 0;
    }
    .paging .el-pagination.is-background .el-pager li {
      border: 1px solid $new-font-color;
      background: $content-bgColor;
      color: $new-font-color;
      &:hover {
        color: $new-font-color;
      }
      .el-select .el-input.is-focus .el-input__inner {
        border: 1px solid $new-font-color;
      }
    }

    .paging .el-pagination.is-background .el-pager li:not(.disabled).active {
      background-color: #0fadff !important;
      border: 1px solid #0fadff !important;
      color: #fff;
    }
    .paging .el-pagination.is-background .btn-next,
    .paging .el-pagination.is-background .btn-prev {
      border: 1px solid $new-font-color;
      color: $new-font-color;
      padding: 0 10px;
      background: $content-bgColor;
    }
    .paging .el-pagination.is-background .btn-prev:disabled,
    .paging .el-pagination.is-background .btn-next:disabled {
      color: #adadad;
      border: 1px solid #adadad;
    }
    .paging .el-pagination {
      .el-pagination__total,
      .el-pagination__jump {
        color: $new-font-color;
      }
      .el-pagination__sizes {
        .el-input {
          input {
            color: $new-font-color;
            background:$content-bgColor;
            border: 1px solid $new-font-color;
            &:hover {
              border: 1px solid $new-font-color;
            }
          }
        }
        .el-select .el-input.is-focus .el-input__inner {
          border: 1px solid $new-font-color;
        }
      }
      .el-pagination__jump {
        .el-pagination__editor {
          input {
            color: $new-font-color;
            background: $content-bgColor;
            border: 1px solid $new-font-color;
          }
        }
      }
       // 分页的样式--
	  .el-pagination {
	    padding: 2px 0;
	  }
	  .paging .el-pagination.is-background .el-pager li {
	    border: 1px solid $new-font-color;
	    background: $content-bgColor;
	    color: $new-font-color;
	    &:hover {
	      color: $new-font-color;
	    }
	  }
	
	  .paging .el-pagination.is-background .el-pager li:not(.disabled).active {
	    background-color: #0fadff !important;
	    border: 1px solid #0fadff !important;
	    color: #fff;
	  }
	  .paging .el-pagination.is-background .btn-next,
	  .paging .el-pagination.is-background .btn-prev {
	    border: 1px solid $new-font-color;
	    color: $new-font-color;
	    padding: 0 10px;
	    background: $content-bgColor;
	  }
	  .paging .el-pagination.is-background .btn-prev:disabled,
	  .paging .el-pagination.is-background .btn-next:disabled {
	    color: #adadad;
	    border: 1px solid #adadad;
	  }
	  .paging .el-pagination {
	    .el-pagination__total,
	    .el-pagination__jump {
	      color: $new-font-color;
	    }
	    .el-pagination__sizes {
	      .el-input {
	        input {
	          color: $new-font-color;
	          background: $content-bgColor;
	          border: 1px solid $new-font-color;
	          &:hover {
	            border: 1px solid $new-font-color;
	          }
	        }
	      }
	      .el-select .el-input.is-focus .el-input__inner {
	        border: 1px solid $new-font-color;
	      }
	    }
	    .el-pagination__jump {
	      .el-pagination__editor {
	        input {
	          color: $new-font-color;
	          background: $content-bgColor;
	          border: 1px solid $new-font-color;
	        }
	      }
	    }
	  }
    }
</style>
