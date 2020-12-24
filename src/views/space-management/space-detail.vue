<template>
  <div class="space-detail">
    <device-edit
      v-if="dialogShow"
      :houseId="houseId"
      :projectId="projectId"
      :show.sync="dialogShow"
      @dialogClose="handleDialogClose"
    ></device-edit>
    <div class="template-base-msgbox">
      <div class="msg-title overh">
        <router-link to="/spaceManagement" class="back">
          <el-button size="mini" icon="el-icon-arrow-left">返回</el-button>
        </router-link>
        <span class="template-name">{{data.projectName}} {{data.houseInfoName}}</span>
        <el-button
          v-fence="{data:data.projectName, functions:['维护房源基本信息（新建，编辑，删除）']}"
          type="primary"
          class="fr"
          icon="el-icon-edit"
          @click="handleOpen"
        >编辑</el-button>
      </div>
      <div class="base-msg">
        <div class="img-box" @click="viewImg">
          <img :src="data.pictureUrl" alt />
        </div>
        <div class="base-data">
          <div>
            <span>门牌号：</span>
            <span class="txt-col">{{data.houseInfoName}}</span>
          </div>
          <div>
            <span>户型编号：</span>
            <span v-if="data.modelType==2">模板编号：</span>
            <span class="txt-col">{{data.houseModelName}}</span>
          </div>
          <div>
            <span>标签：</span>
            <span
              class="txt-cols"
              v-for="(item,index) in data.labels"
              :key="index"
            >{{item.labelName}}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 设备信息 -->
    <div class="device-mag-box">
      <template>
        <el-tabs class="device-msg" v-model="activeName2" type="card" @tab-click="handleClick">
          <!-- 设备 -->
          <el-tab-pane label="设备信息" name="first">
            <div class="device-Message">
              <div
                class="fl"
              >
                该房源下设备影子总数：
                <span class="allDevice">{{equipmentData.deviceNum}}</span>
              </div>
              <el-button
                v-fence="{data:data.projectName, functions:['绑定设备']}"
                type="primary"
                class="fr tem"
                icon="iconfont icon-jiebang mini"
                @click="bingdingShows"
              >设备绑定</el-button>
              <el-button
                v-fence="{data:data.projectName, functions:['维护房源基本信息（新建，编辑，删除）']}"
                type="primary"
                class="fr"
                icon="el-icon-edit"
                @click="getTemplateId"
              >编辑</el-button>
            </div>
            <div class="gateDevice">
              <div class="gateway-content" v-if="equipmentData">
                <div class="gateway-content-title">网关</div>
                <div class="gateway-device">
                  <span class="deviceName">
                    设备名称：
                    <router-link
                      class="col"
                      :to="{path:'/deviceShadowDetail', query:{id:equipmentData.gatewayShadowId,temName:equipmentData.gatewayName}}"
                      v-if="equipmentData.gatewayName"
                    >网关</router-link>
                    <span v-else>--</span>
                  </span>
                  <span
                    class="deviceType"
                  >设备类型：{{equipmentData.gatewayType ?equipmentData.gatewayType :'--'}}</span>
                  <span
                    class="deviceType"
                  >IoT设备ID：{{equipmentData.iotGatewayId ?equipmentData.iotGatewayId :'--'}}</span>
                  <span
                    class="deviceType"
                  >IoT设备名称：{{equipmentData.iotGatewayName ?equipmentData.iotGatewayName :'--'}}</span>
                  <span
                    class="deviceType"
                  >设备SN：{{equipmentData.iotGatewaySN ?equipmentData.iotGatewaySN :'--'}}</span>
                </div>
              </div>
            </div>

            <div class="space-box" v-for="(item,index) in rooms" :key="index">
              <div class="space-name-title">
                <span class="sapce-name">{{item.roomName}}</span>
                <span class="boxShell">{{item.oriented}}</span>
                <span class="sapceBar" v-if="item.area ||item.area==0">{{item.area}}㎡</span>
              </div>
              <p class="err" v-if="item.categorys.length==0">暂未添加设备</p>
              <div class="device-type" v-for="(items,index) in item.categorys" :key="index">
                <p>
                  <img
                    :src="items.deviceCategoryUrl"
                    :class="{'img-visibility':!items.deviceCategoryUrl}"
                    class="icon"
                  />
                  {{items.deviceCategoryName}}
                </p>
                <div class="device overh">
                  <ul>
                    <li v-for="(i,index) in items.devices" :key="index">
                      <span class="margin-r">
                        设备名称：
                        <router-link
                          class="col"
                          :to="{path:'/deviceShadowDetail', query:{id:i.deviceShadowId,temName:i.deviceName}}"
                        >{{i.deviceName}}</router-link>
                      </span>
                      <span class="margin-r">IoT设备ID：{{i.deviceId ? i.deviceId :"--"}}</span>
                      <span class="margin-r">设备SN：{{i.deviceSN ? i.deviceSN :"--"}}</span>
                      <span class="margin-r">设备类型：{{i.deviceTypeName}}</span>
                      <span>产品信息：{{i.productModelName}}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <!-- 房源日志 -->
          <el-tab-pane class="log-msg" label="房源日志" name="second">
            <p class="rz_err" v-if="data.dataList==''">暂无房源日志</p>
            <ul class="conten_oper">
              <li v-for="(item,index) in dataList" :key="index">
                <span class="log-time">
                  <i class="circle"></i>
                  {{item.time}}
                </span>
                <div>
                  <p v-for="(i,index) in item.operateDetails" :key="index">
                    <span>{{i.operatorRole}}</span>
                    <span style="color:#adadad;">{{i.operatorName}}</span>
                    <span>{{i.details}}</span>
                  </p>
                </div>
              </li>
            </ul>

            <div class="paging fr">
              <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageNum"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
              ></el-pagination>
            </div>
          </el-tab-pane>
        </el-tabs>
      </template>
    </div>
    <el-dialog
      :modal-append-to-body="false"
      class="el-dialog2"
      title="编辑房源信息"
      :before-close="handleClose"
      :visible.sync="addDialogVisible"
      width="746px"
    >
      <div class="mes">
        <div class="top overh">
          <img class="fl" :src="addForm.pictureUrl" prop="pictureUrl" />

          <div class="right fl from">
            <el-form
              :inline="true"
              :model="addForm"
              :rules="addTmpRule"
              ref="addForm"
              class="demo-form-inline"
            >
              <span class="doorCard">门牌号:</span>
              <div class="doorSelect">
                <el-form-item label="楼号" prop="buildingId" class="input-w50">
                  <el-input :disabled="canEditNum" v-model="addForm.buildingId" size="mini">
                    <template slot="append">栋</template>
                  </el-input>
                </el-form-item>
                <el-form-item v-if="data.unitId" prop="unitId" label="单元" class="input-w50">
                  <el-input :disabled="canEditNum" v-model="addForm.unitId" size="mini">
                    <template slot="append">单元</template>
                  </el-input>
                </el-form-item>
                <el-form-item v-if="data.floorId" label="楼层" prop="floorId" class="input-w50">
                  <el-input :disabled="canEditNum" v-model="addForm.floorId" size="mini">
                    <template slot="append">层</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="户号" prop="doorId" class="input-w50">
                  <el-input :disabled="canEditNum" v-model="addForm.doorId" size="mini">
                    <template slot="append">户</template>
                  </el-input>
                </el-form-item>
                <div
                  v-if="canEditNum"
                  class="doorFloor"
                >该房源已绑定住户，无法编辑门牌号！</div>
                <div
                  v-if="!canEditNum"
                  class="doorFloor"
                >门牌号更新后，在查看/下载二维码时会同步更新二维码信息！</div>
              </div>
              <el-form-item
                label="户型编号:"
                placeholder="户型编号及户型"
                size="mini"
                prop="apartmentNum"
                class="hxsel"
              >
                <el-select
                  :disabled="canEditNum"
                  placeholder="请选择"
                  v-model="addForm.houseModelId"
                  class="floorSelect"
                >
                  <el-option
                    v-for="(pro, index) in houseArr"
                    :key="index"
                    :label="pro.houseFullName"
                    :value="pro.modelId"
                  ></el-option>
                </el-select>
              </el-form-item>
                <p
                class="houseError"
                v-if="canEditNum"
              >该房源已绑定住户，无法编辑户型编号！</p>
              <p  v-if="!canEditNum" class="houseError">修改户型编号后，该户型下的所有设备将被解绑！</p>
              <div class="lab-box">
                <div
                  class="addLabel"
                >添加标签:</div>
                <div
                  class="textSize"
                >
                  <el-button
                    type="primary"
                    v-for="(k,index) in addForm.labels"
                    :key="index"
                    size="mini"
                    class="addLabels"
                  >
                    {{k.labelName}}
                    <i
                      class="el-icon-error el-icon--right"
                      @click="deletre(k.labelId)"
                    ></i>
                  </el-button>
                  <el-dropdown trigger="click" @command="addHouse">
                    <el-button type="primary" size="mini">
                      新建
                      <i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command="single">常用标签</el-dropdown-item>
                      <el-dropdown-item command="multiple">直接新建</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </div>
            </el-form>
          </div>
        </div>
        <div class="bottom">
          <p>
            <el-upload
              class="upload-demo"
              name="image_file"
              action
              :http-request="uploadImage"
              :show-file-list="false"
              :before-upload="beforeAvatarUpload"
              :on-success="handleAvatarSuccess"
              :on-error="uploadError"
              size="mini"
              accept="image/jpeg, image/jpg, image/png, image/bmp, image/gif"
            >
              <el-button size="small" type="primary">更新户型图</el-button>
            </el-upload>
          </p>
          <p class="rules">文件大小&lt;5MB；图片格式必须为：bmp，png，jpeg，jpg，gif.</p>
        </div>
      </div>
      <span slot="footer" class="dialog-footer houseFoot">
        <el-button @click="close('addForm')">取消</el-button>
        <el-button type="primary" @click="formPost('addForm')">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :modal-append-to-body="false"
      :visible.sync="imgDialog"
      class="bigImg"
      width="75%"
      top="5vh"
    >
      <img
        :src="data.pictureUrl"
        class="bigSize"
        :style="{'height':minHeight - 140 + 'px'}"
      />
    </el-dialog>
    <el-dialog
      :modal-append-to-body="false"
      id="createDialog"
      title="直接新建"
      :show-close="false"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <span>
        <el-input
          v-model="tagName "
          placeholder="请输入1-10个字符"
          style="width: 200px;"
          @input="cretaLab"
        ></el-input>
        <div
          v-show="err"
          class="createNow"
        >{{createTagErrorMessage}}</div>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2()">取 消</el-button>
        <el-button type="primary" @click="creatTab()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :modal-append-to-body="false"
      id="createDialog"
      title="常用标签"
      :show-close="false"
      :visible.sync="changyongLab"
      width="30%"
      :before-close="handleClose"
    >
      <el-checkbox-group v-model="checkboxGroup1">
        <el-checkbox-button
          v-for="(k,index) in selectLab"
          :label="k"
          :disabled="k.state"
          :key="index"
        >{{k.labelName}}</el-checkbox-button>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="changyongLab = false">取 消</el-button>
        <el-button type="primary" @click="addLabs()">确 定</el-button>
      </span>
    </el-dialog>
    <device-binding
      v-if="bingdingShow"
      :gatewayShadowId="gatewayShadowId"
      :title="data.projectName +'  '+ data.houseInfoName"
      :houseId="houseId"
      :projectId="projectId"
      :show.sync="bingdingShow"
      @dialogClose="bingdingClose"
    ></device-binding>
  </div>
</template>
<script>
import {
  selectHouseDeviceInfo, // 查询房源空间设备信息
  selectBasicHouse, // 查询房源基本信息
  updateHouseBasic, // 修改房源基本信息
  selects, //空间模版管理,模板详情
  findAllHouseInfo, // 获取项目下的房源
  addTag, // 直接新建标签
  getTopNTags, // 获取常用标签
  getFamilyByHouseIds // 房源批量编辑 批量删除 详情编辑
} from "../../api/api.js";
import { getDate } from "../../labs/tools.js"; //时间格式化转换
import Qs from "qs";
import deviceEdit from "./device-edit.vue"; //设备信息下编辑设备信息
import deviceBinding from "./device-binding.vue";
import ossUpload from "../../labs/upload.js";
export default {
  name: "",
  components: {
    deviceEdit,
    deviceBinding
  },
  data() {
    return {
      bingdingShow: false, // 设备绑定弹框
      createTagErrorMessage: "1-10个字符！",
      minHeight: 0,
      rooms: [],
      deviceNum: null,
      checkboxGroup1: [],
      isActive: true,
      btnState: false,
      selectLab: [],
      changyongLab: false,
      err: true,
      tagName: "",
      dialogVisible: false,
      equipmentData: {},
      dialogShow: false,
      houseId: null, //房源id
      //校验格式
      addTmpRule: {
        apartmentNum: [
          {
            required: true,
            trigger: "change",
            validator: this.getSpaceError
          }
        ],
        buildingId: [
          {
            required: true,
            pattern: /^[A-Za-z0-9\u4e00-\u9fa5]{1,50}$/,
            min: 1,
            max: 50,
            message: "1-50个字母、数字、汉字！",
            trigger: "blur"
          }
        ],
        unitId: [
          {
            required: true,
            pattern: /^[A-Za-z0-9\u4e00-\u9fa5]{1,50}$/,
            min: 1,
            max: 50,
            message: "1-50个字母、数字、汉字！",
            trigger: "blur"
          }
        ],
        floorId: [
          {
            required: true,
            pattern: /^[A-Za-z0-9]{0,50}$/,
            min: 0,
            max: 50,
            message: "0-50个数字、字母！",
            trigger: "blur"
          }
        ],
        doorId: [
          {
            required: true,
            message: "1-5个字母、数字、汉字！",
            trigger: "blur",
            validator: this.getHouseNumber
          }
        ],
        pictureUrl: [
          {
            required: true,
            message: "请上传户型图",
            trigger: "change"
          }
        ]
      },

      isShowModal: false,
      minHeight: null,
      imgDialog: false,
      houseArr: [],
      //编辑参数
      canEditNum: false, //门牌号是否可编辑
      addForm: {
        projectId: "",
        buildingId: "",
        doorId: "",
        floorId: "",
        unitId: "",
        labels: [],
        houseModelId: "",
        pictureUrl: ""
      },
      projectId: 1, //项目id
      data: {}, //返回參數
      currentPage4: 1,
      pageSize: 10,
      pageNum: 1,
      total: 0,
      dataList: [],
      activeName2: "first",
      addDialogVisible: false,
      value1: "",
      gatewayShadowId: null //网关影子id
    };
  },
  created() {},
  mounted() {
    this.minHeight = window.innerHeight - 95;
    this.houseId = this.$route.query.id - 0;
    this.getDate();
    this.equipment();
  },
  methods: {
    bingdingShows() {
      this.bingdingShow = true;
    },
    // 验证户号
    getHouseNumber(rule, value, callback) {
      const reg = /^[a-zA-Z0-9\u4e00-\u9fa5]{1,5}$/;
      if (reg.test(value) && value - 0 !== 0) {
        callback();
      } else {
        return callback(new Error("1-5个字母、数字、汉字！"));
      }
    },
    // 空间模板信息验证
    getSpaceError(rule, value, callback) {
      let self = this;
      self.houseArr.forEach(item => {
        if (item.modelId == self.addForm.houseModelId) {
          if (item.sign == 1) {
            callback(new Error("该模板下没有空间信息！"));
          } else {
            callback();
          }
        }
      });
    },
    //常用标签点击
    addLabs() {
      for (var i = 0; i < this.checkboxGroup1.length; i++) {
        this.addForm.labels.push(this.checkboxGroup1[i]);
      }
      this.checkboxGroup1 = [];
      this.changyongLab = false;
    },
    //查询常用标签
    selectLabs() {
      getTopNTags({
        num: 8
      }).then(res => {
        if (res.err_CODE == 0) {
          this.selectLab = res.data;
          for (let i = 0; i < this.selectLab.length; i++) {
            for (let j = 0; j < this.addForm.labels.length; j++) {
              if (
                this.addForm.labels[j].labelName == this.selectLab[i].labelName
              ) {
                this.selectLab[i].state = true;
              }
            }
          }
        }
      });
    }, //创建标签
    creatTab() {
      let self = this;
      let pattern = /^[A-Za-z0-9\u4e00-\u9fa5\-]{1,10}$/;
      self.tagName = self.tagName.trim();
      if (!(self.tagName && new RegExp(pattern).test(self.tagName))) {
        this.err = true;
        this.btnState = true;
        this.createTagErrorMessage = "1-10个字符！";
        return;
      }
      addTag(this.tagName).then(res => {
        if (res.err_CODE === 0 || res.err_CODE === 3003) {
          var tag = res.data;
          var ret = this.addForm.labels.find(value => {
            return value.labelName === tag.labelName;
          });
          if (ret === undefined) {
            this.addForm.labels.push(res.data);
          }
          this.dialogVisible = false;
          // console.log(this.addForm.labels);
        } else {
          this.dialogVisible = true;
          this.createTagErrorMessage = res.err_MESSAGE;
        }
      });
    }, //取消创建
    dialogVisible2() {
      this.dialogVisible = false;
      this.btnState = false;
    },
    //删除标签
    deletre(id) {
      this.addForm.labels = this.addForm.labels.filter(el => {
        return el.labelId != id;
      });
    }, //查询户型房源
    getHouse(projectId) {
      findAllHouseInfo({
        projectId: projectId,
        code: 1
      }).then(res => {
        this.houseArr = res.data.data;
        for (let i = 0; i < this.houseArr.length; i++) {
          if (this.data.houseModelName == this.houseArr[i].houseFullName) {
            this.addForm.houseModelId = this.houseArr[i].modelId;
          }
        }
      });
    },
    //验证标签格式
    cretaLab() {
      var reg = /^[A-Za-z0-9\u4e00-\u9fa5\-]{1,10}$/;
      if (reg.test(this.tagName)) {
        this.err = false;
        this.btnState = false;
      }
    },
    //创建标签
    addHouse(command) {
      let self = this;
      if (command == "single") {
        self.changyongLab = true;
        self.selectLabs();
      } else if (command == "multiple") {
        //直接创建
        self.dialogVisible = true;
        self.tagName = "";
        self.err = false;
      }
    },
    //关闭
    handleClose(done) {
      this.$confirm("是否放弃编辑房源？", {
        showClose: false
      })
        .then(_ => {
          done();
          this.$refs["addForm"].resetFields();
          this.btnState = false;
        })
        .catch(_ => {});
    },
    //路由获取id
    getTemplateId() {
      this.dialogShow = true;
    },
    //取消编辑
    close(formName) {
      this.$confirm("是否放弃编辑房源?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        showClose: false
      })
        .then(() => {
          this.addDialogVisible = false;
          this.$refs[formName].resetFields();
        })
        .catch(() => {});
    },
    handleDialogClose(isConfirm) {
      this.dialogShow = false;
      if (isConfirm) {
        this.equipment();
      }
    },
    // 绑定设备弹框关闭
    bingdingClose(isConfirm) {
      this.equipment();
      this.bingdingShow = false;
    },
    // 查看图片
    viewImg(img) {
      if (!img) return;
      this.imgView = img;
      this.imgDialog = true;
    },
    //编辑户型简介
    formPost(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addForm.houseId = this.houseId - 0;
          this.addForm.projectId = this.projectId - 0;
          updateHouseBasic(this.addForm).then(res => {
            if (res.err_CODE == 0) {
              this.$message.success("编辑成功");
              this.$refs["addForm"].resetFields();
              this.addDialogVisible = false;
              this.getSelect();
              this.equipment();
              this.getDate();
            } else if (res.err_CODE == 2001) {
              this.addDialogVisible = false;
              this.getSelect();
              this.getDate();
            } else if(res.err_CODE === 403) {
              this.$message.success(res.err_MESSAGE);
              setTimeout(() => {
                  this.$message({
                    type: "error",
                    message: "接口请求失败，请联系AI+运维人员！失败原因：运营平台token无效！"
                  });
              },1000);
              this.addDialogVisible = false;
              this.getSelect();
              this.getDate();
             
            } else {
              this.$message.error(res.err_MESSAGE);
              
            }
          }).catch(err => {
            
          });
        } else {
          return false;
        }
      });
    },
    // 获取上传成功的图片地址
    handleAvatarSuccess(res, file) {
      this.addForm.pictureUrl = res.res.requestUrls[0];
      this.$message.success("上传成功");
    },

    uploadImage(option) {
      ossUpload.ossUploadFile(option);
    },
    //校验图片格式
    beforeAvatarUpload(file) {
      var testmsg = /^image\/(jpeg|png|jpg|gif|bmp)$/.test(file.type);
      const isLt5M = file.size / 1024 / 1024 <= 5; //图片大小不超过5MB
      if (!testmsg) {
        this.$message.error("图片格式必须为：bmp，png，jpeg，jpg，gif!");
        return false;
      }
      if (!isLt5M) {
        this.$message.error("上传图片大小不能超过5M！");
        return false;
      }
    },
    //图片错误提示
    uploadError() {
      this.$message.error("上传失败，请重新上传");
    },
    //获取户型数据
    getDate() {
      const loading = this.$loading({
        lock: true,
        target: document.querySelector('#space-detail')
      });
      selectBasicHouse({
        houseId: this.houseId
      })
        .then(res => {
          this.data = res.data;
          this.projectId = res.data.projectId;
          loading.close()
        })
        .catch(() => {
         loading.close()
        });
    },
    //获取设备信息
    equipment() {
      selectHouseDeviceInfo({
        houseId: this.houseId
      }).then(res => {
        this.equipmentData = res.data;
        this.gatewayShadowId = res.data.gatewayShadowId;
        this.deviceNum = res.data.deviceNum;
        this.rooms = res.data.rooms;
        this.projectId = res.data.projectId;
      });
    },
    //tab切换
    handleClick(tab, event) {
      if (tab.index == 1) {
        this.getSelect();
      } else {
        this.equipment();
      }
    },

    //获取操作日志
    getSelect() {
      let data = {
        houseId: this.houseId - 0,
        pageSize: this.pageSize - 0,
        pageNum: this.pageNum - 0
      };
      selects(data).then(res => {
        this.total = res.data.total;
        this.dataList = res.data.list;
        for (var i = 0; i < this.dataList.length; i++) {
          this.dataList[i].time = getDate(this.dataList[i].operateLongTime);
        }
      });
    },

    //打开编辑模块
    handleOpen() {
      let params = "houseIds=" + this.houseId;
      getFamilyByHouseIds(params).then(res => {
        //门牌号是否可编辑
        if (res.data) {
          this.canEditNum = true;
        } else {
          this.canEditNum = false;
        }
        this.getHouse(this.projectId);
        this.addDialogVisible = true;
        this.addForm.buildingId = this.data.buildingId;
        this.addForm.doorId = this.data.doorId;
        this.addForm.floorId = this.data.floorId;
        this.addForm.unitId = this.data.unitId;
        this.addForm.labels = [];
        for (let i = 0; i < this.data.labels.length; i++) {
          this.addForm.labels.push(this.data.labels[i]);
        }
        this.addForm.pictureUrl = this.data.pictureUrl;
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageNum = 1;
      this.getSelect();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getSelect();
    }
  }
};
</script>
<style lang='scss'>
.space-detail {
  .hxsel {
    width: 100%;
    height: auto !important;
    margin-top: 10px;
    .el-form-item__error {
      margin-left: 10px;
    }
    .floorSelect{
      width: 150px;
      padding-left: 10px;
    }
  }
  .houseError{
    font-size: 12px;
    color: #ADADAD;
    position: absolute;
    left:292px;
    top:224px;
  }
  .el-form-item__content .el-input-group {
    vertical-align: middle;
  }
  .from {
    width: 515px;
    display: flex;
    flex-wrap: wrap;
    margin-top: -8px;
    .sel-container {
      .el-select {
        padding-left: 10px;
        width: 120px;
        .el-input__inner {
          background: #25426b;
          border: 0;
          height: 28px !important;
          color: #ffffff;
          border-radius: 2px;
          font-size: 12px;
        }
        .el-input__icon {
          line-height: 1;
        }
      }
      .el-button {
        width: 88px;
        height: 28px;
        text-align: center;
        padding: 0;
        font-size: 12px;
        border: none;
        line-height: 28px;
      }
      .delbtn {
        margin-left: 8px;
        margin-right: 8px;
      }
      .el-button.disabled-color {
        background: #adadad;
      }
      .el-button--primary {
        background-color: #0fadff;
      }
    }
    .tb-container {
      .el-checkbox__inner {
        background-color: transparent;
        border: 1px solid #ccc;
      }
      .is-checked {
        .el-checkbox__inner {
          background-color: #0fadff;
          border: 1px solid transparent;
          text-align: center;
        }
      }
    }
    .el-form-item__error {
      padding-top: 0px !important;
    }
    .input-w50 {
      margin-right: 0px !important;
      margin-left: 17px;
      margin-bottom: 6px;
      height: auto !important;
      .el-input {
        width: 130px !important;
        height: 24px;
        .el-input__inner {
          width: 130px !important;
          padding: 0 0 0 8px;
        }
        .el-input-group__append,
        .el-input-group__prepend {
          left: -1px;
          background-color: #1e2e4c;
          color: #fff;
          vertical-align: middle;
          display: table-cell;
          position: relative;
          border: 1px solid #1e2e4c;
          border-radius: 0px;
          padding: 0 6px;
          white-space: nowrap;
        }
      }
      .el-form-item__error {
        width: 148px;
      }
    }
    .el-form--inline .el-form-item__label {
      padding: 0 4px 0 0;
      font-size: 12px;
    }
    .el-dialog__title {
      font-size: 16px;
    }
    .el-dialog__body {
      padding: 0px 20px 30px;
      color: #606266;
      font-size: 14px;
    }
    .mes {
      height: 95px;
      margin-bottom: 40px;
      .el-form .el-form-item {
        margin-bottom: 0px;
      }
      .el-form .el-input {
        width: 200px;
      }
      .el-form .el-input .el-input__inner {
        width: 200px;
        border-radius: 0;
      }
      .el-input-group__append {
        background-color: #1e2e4c;
        color: #fff;
        vertical-align: middle;
        display: table-cell;
        position: relative;
        left: -1px;
        border: 1px solid #1e2e4c;
        border-radius: 0;
        font-size: 12px;
        padding: 0 6px;
        width: 1px;
        white-space: nowrap;
      }
    }
  }

  .el-message-box__message p {
    font-size: 17px;
    color: black;
    text-align: center;
  }

  .form {
    .el-form-item__error {
      width: 260px;
    }
  }

  .rz_err {
    color: #af7c58;
    font-size: 14px;
  }

  .conten_oper {
    min-height: 36vh;
  }

  .el-tabs__content {
    min-height: 45vh;
  }

  .device-mag-box .el-tabs__header {
    padding: 0;
    position: relative;
    margin: 0;
  }

  .device-mag-box .el-tabs--card > .el-tabs__header .el-tabs__nav {
    border: none;
  }

  .device-mag-box .el-tabs--card > .el-tabs__header {
    border-bottom: none;
  }

  .device-mag-box .el-tabs--card > .el-tabs__header .el-tabs__item {
    border-left: none;
    background: rgba(255, 255, 255, 0.7);
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    color: #999;
  }

  .device-mag-box .el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
    border-bottom-color: transparent;
  }

  .device-mag-box .el-tabs__item {
    height: 28px;
    line-height: 28px;
  }

  .device-mag-box .el-tabs--card > .el-tabs__header .el-tabs__item:first-child {
    margin-right: 8px;
  }

  .device-mag-box .el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
    color: #323232;
    background: #fff;
    font-weight: bold;
  }

  .device-mag-box .el-tabs__content {
    background: #fff;
    padding-bottom: 20px;
  }

  .bigImg {
    .el-dialog__body {
      text-align: center;
    }
    .bigSize{
      display:block;
      margin: 0 auto;
      max-width:100%;
    }
  }

  #createDialog {
    position: absolute;
    .el-dialog{
      margin-top: 30vh !important;
    }
    .el-dialog__title {
      font-size: 14px;
      color: #323232;
      font-weight: bold;
    }
    .el-dialog__footer {
      text-align: right !important;
    }
    .el-input__inner {
      width: 140px;
      height: 28px;
      background: #efe5de;
      font-size: 12px;
    }
    .el-dialog__body {
      padding-top: 14px;
      padding-bottom: 33px;
    }
    .dialog-footer {
      text-align: right !important;
      .el-button {
        margin-right: 6px !important;
        border: 0px !important;
        font-size: 12px !important;
        width: 54px !important;
        height: 24px !important;
      }
    }
    .el-checkbox-button {
      margin-right: 10px;
      margin-bottom: 6px;
      opacity: 0.4;
    }
    .is-checked {
      opacity: 1;
    }
    .is-disabled {
      opacity: 1 !important;
      .el-checkbox-button__inner {
        background-color: #af7c58 !important;
        border-color: #af7c58 !important;
        color: white !important;
        height: 28px;
        font-size: 12px;
        border-radius: 2px !important;
        /*opacity: .4;*/
        padding-top: 8px;
      }
    }
    .el-checkbox-button__inner {
      background-color: #af7c58 !important;
      border-color: #af7c58 !important;
      color: white !important;
      height: 28px;
      font-size: 12px;
      border-radius: 2px !important;
      padding-top: 8px;
    }
    .el-checkbox-button__inner:hover {
      color: white;
    }
    .createNow{
      font-size: 12px;
      color: #f56c6c;
      margin-top: 10px;
      margin-left: 10px;
    }
    .el-checkbox-group{
      margin-right: 10px;
      margin-bottom: 6px;
    }
  }

  .el-dialog2 {
    .el-dialog__footer {
      text-align: center;
      margin-top:36px;
    }
    .el-dialog__title {
      font-size: 16px !important;
      font-weight: bold;
    }
    .el-input--suffix .el-input__inner {
      height: 30px;
    }
    .el-dropdown-menu__item {
      font-size: 12px;
      line-height: 27px;
    }
  }

  //分页样式
  .el-pagination {
    padding: 2px 0;
  }
  .paging .el-pagination.is-background .el-pager li {
    border: 1px solid #323232;
    background: #fff;
    color: #323232;
    &:hover {
      color: #323232;
    }
  }

  .paging .el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: #0fadff !important;
    border: 1px solid #0fadff !important;
    color: #fff;
  }
  .paging .el-pagination.is-background .btn-next,
  .paging .el-pagination.is-background .btn-prev {
    border: 1px solid #323232;
    color: #323232;
    padding: 0 10px;
    background: #fff;
  }
  .paging .el-pagination.is-background .btn-prev:disabled,
  .paging .el-pagination.is-background .btn-next:disabled {
    color: #adadad;
    border: 1px solid #adadad;
  }
  .paging .el-pagination {
    .el-pagination__total,
    .el-pagination__jump {
      color: #323232;
    }
    .el-pagination__sizes {
      .el-input {
        input {
          color: #323232;
          background: #fff;
          border: 1px solid #323232;
          &:hover {
            border: 1px solid #323232;
          }
        }
      }
      .el-select .el-input.is-focus .el-input__inner {
        border: 1px solid #323232;
      }
    }
    .el-pagination__jump {
      .el-pagination__editor {
        input {
          color: #323232;
          background: #fff;
          border: 1px solid #323232;
        }
      }
    }
  }
}
</style>
<style lang="scss" scoped>
@import "../../styles/template-detail.scss";
.template-base-msgbox{
  .msg-title .fr{
    border:none;
  }
}
.base-msg{
  .txt-cols{
    color: #323232 !important;
    margin-left: 6px;
    margin-right: 16px;
  }
}
.houseFoot{
  margin-top:36px;
}
.lab-box {
  margin-left:12px;
  margin-top: 10px;
  .addLabel{
    float: left;
    margin-right: 12px;
    margin-left: -2px;
    font-size: 12px;
    padding-top: 7px;
  }
  .textSize{
    display: inline-block;
    overflow: hidden auto;
    width: 432px;
    height: 120px;
    border: 1px solid;
    padding-left: 10px;
    padding-top: 10px;
    .addLabels{
      margin-bottom: 6px;
      height: 28px;
    }
  }
}

.icon {
  width: 20px;
  height: 20px;
}
.img-visibility {
  visibility: hidden;
}

.space-detail .el-form-item {
  height: 44px;
}

.err {
  margin-left: 20px;
  margin-top: 10px;
  color: #af7c58;
  font-size: 14px;
}

.el-dialog2 {
  .mes {
    .top {
      img {
        width: 190px;
        height: 165px;
      }
      .right {
        padding-left: 10px;
        .el-input__inner {
          padding: 0 0 !important;
        }
        .text {
          width: 60px !important;
          height: 24px;
        }
        .dw {
          width: 24px;
          height: 28px;
          line-height: 28px;
          position: absolute;
          top: 5px;
          left: 57px;
          text-align: center;
          background-color: #1e2e4c;
          color: #ffffff;
          font-size: 12px;
        }
        .mph {
          position: absolute;
          top: 92px;
          left: 222px;
        }
        .el-form-item__content {
          margin-left: 20px !important;
          display: flex;
        }
      }
    }
    .bottom {
      position: absolute;
      top: 264px;
      p {
        .upload-demo {
          margin-bottom: 15px;
        }
        .el-button {
          padding: 0;
          width: 88px;
          height: 28px;
          text-align: center;
          font-size: 12px;
          border: 1px solid #af7c58;
        }
      }
      .rules{
        width: 179px;
        font-size: 12px;
      }
    }
    .demo-form-inline{
      display: flex;
      flex-wrap: wrap;
      padding-top: 1px;
      .doorCard{
        position: absolute;
        top: 90px;
        font-size: 12px;
      }
      .doorSelect{
        margin-left: 42px;
        .doorFloor{
          color:#ADADAD;
          font-size:12px;
          margin:-8px 0 -5px 30px;
        }
      }
    }
    
  }
}
.device-mag-box {
  //设备
  .device-msg {
    //设备信息布局
    .tem {
      width: 86px;
      height: 28px;
      border: none;
      text-align: center;
      padding: 0;
    }
    a.col {
      color: #af7c58;
      text-decoration: underline;
    }
    .gateway-content {
      .deviceName{
        margin-right:24px;
        margin-left:32px;
      }
    }
    .gateway-content-title {
      width: 100%;
      height: 30px;
      padding-left: 6px;
      line-height: 30px;
      font-size: 14px;
      font-weight: bold;
      color: #323232;
      background: #e0f3fc;
      margin-bottom: 20px;
    }
    .device-Message{
      overflow:hidden;
      margin-bottom:14px;
      .fl{
        font-weight:bold;
        margin-top:10px;
        padding-left:30px;
        line-height:28px;
        font-size:14px;
    }
    }
  }
  .fr{
    border:none;
  }
  .gateDevice{
    padding:0 24px;
    .deviceType{
      margin-right:24px;
    }
  }
  .space-box{
    .space-name-title{
      .boxShell{
        margin-left: 20px;
      }
      .sapceBar{
        margin-left: 10px;
      }
    }
  }
  .allDevice{
    color:#AF7C58;
  }
}
</style>