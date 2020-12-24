<template>
  <div class="template-detail" :style="{minHeight: minHeight + 'px'}">
    <div
      v-empty="{data:'', functions:['查看模板列表，模板详情']}"
      :style="{minHeight: minHeight + 'px'}"
      class="spaceMA"
    >
      <span>您没有模板管理的查看权限！</span>
    </div>
    <div v-fence="{data:'', functions:['查看模板列表，模板详情']}">
      <div
        class="spaceMB"
        :style="{minHeight: minHeightInner + 'px'}"
        v-fence="{data:getCurrentPermission(standand), functions:['查看模板列表，模板详情']}"
      >
        <Modal
          v-if="dialogShow"
          :templateId="templateId"
          :projectId="projectId"
          :show.sync="dialogShow"
          @dialogClose="handleDialogClose"
        ></Modal>
        <!-- 户型基本信息 -->
        <div class="template-base-msgbox">
          <div class="msg-title overh">
            <router-link to="/template" class="back">
              <el-button size="mini" icon="el-icon-arrow-left">返回</el-button>
            </router-link>
            <span class="template-name">{{data.projectName}} {{data.templateTitle}}</span>
            <el-button
              v-fence="{data:getCurrentPermission(data.projectName), functions:['维护模板（新建，编辑，删除）']}"
              v-if="data.updateJurisdiction==0"
              type="primary"
              class="fr"
              icon="el-icon-edit"
              @click="handleOpen"
            >编辑</el-button>
          </div>
          <div class="base-msg">
            <div class="img-box" @click="viewImg">
              <img :src="data.projectUrl" alt />
            </div>
            <div class="base-data">
              <div>
                <span>项目名：</span>
                <span class="txt-col">{{data.projectName}}</span>
              </div>
              <div>
                <span v-if="data.modelType==1">户型编号：</span>
                <span v-if="data.modelType==2">模板编号：</span>
                <span class="txt-col">{{data.templateTitle}}</span>
              </div>
              <div>
                <span>模板名：</span>
                <span class="txt-col">{{data.templateName}}</span>
              </div>
            </div>
          </div>
        </div>
        <!-- 设备信息 -->
        <div class="device-mag-box">
          <template>
            <el-tabs class="device-msg" v-model="activeName2" type="card" @tab-click="handleClick">
              <el-tab-pane label="设备信息" name="first">
                <div class="device-Message">
                  <el-button
                    v-fence="{data:getCurrentPermission(data.projectName), functions:['维护模板（新建，编辑，删除）']}"
                    type="primary"
                    class="fr"
                    icon="el-icon-edit"
                    v-if="data.updateJurisdiction==0"
                    @click="getTemplateId"
                  >编辑</el-button>
                </div>
                <p class="err" v-if="data.rooms==''">暂未添加设备</p>

                <div class="space-box" v-for="item in data.rooms">
                  <div class="space-name-title">
                    <span class="sapce-name">{{item.roomName}}</span>
                    <span class="margin-re">{{item.oriented}}</span>
                    <span class="margin-l" v-if="item.area || item.area==0">{{item.area}}㎡</span>
                  </div>
                  <p class="err" v-if="item.categories==''">暂未添加设备</p>
                  <div class="device-type" v-for="items in item.categories">
                    <p>
                      <img
                        :src="items.pictureUrl"
                        :class="{'img-visibility':!items.pictureUrl}"
                        class="icon"
                      />
                      {{items.categoryName}}
                    </p>
                    <div class="device overh">
                      <ul style="padding-left:32px;">
                        <li v-for="(i,index) in items.devices" :key="index">
                          <span class="margin-r">设备名称：{{i.deviceName}}</span>
                          <span class="margin-r">设备类型：{{i.productTypeName}}</span>
                          <span>产品信息：{{i.productInfo}}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane class="log-msg" label="空间模版日志" name="second">
                <p class="rz_err" v-if="data.dataList==''">暂无模板日志</p>
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
          title="编辑模板信息"
          :before-close="handleClose"
          :visible.sync="addDialogVisible"
          width="576px"
        >
          <div class="mes">
            <div class="top overh">
              <img class="fl" :src="addForm.pictureUrl" prop="pictureUrl" />
              <div class="right fl">
                <el-form :rules="addTmpRule" id="tmpNameNo" :model="addForm" ref="addForm">
                  <el-form-item
                    label="项目名"
                    prop="projectId"
                    label-width="83px"
                    label-height="60px"
                  >{{data.projectName}}</el-form-item>
                  <el-form-item
                    label="户型编号"
                    prop="modelTitle"
                    label-width="83px"
                    v-if="data.modelType==1"
                  >
                    <el-input v-model="addForm.modelTitle" size="mini"></el-input>
                  </el-form-item>
                  <el-form-item
                    label="模板编号"
                    prop="modelTitle"
                    label-width="83px"
                    v-if="data.modelType==2"
                  >
                    <el-input v-model="addForm.modelTitle" size="mini"></el-input>
                  </el-form-item>
                  <el-form-item label="模版名：" prop="modelName" label-width="83px" height="60px">
                    <el-input v-model="addForm.modelName" size="mini"></el-input>
                  </el-form-item>
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
              <p>文件大小<5MB；图片格式必须为：bmp，png，jpeg，jpg，gif.</p>
            </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="close('addForm')">取消</el-button>
            <el-button type="primary" @click="formPost('addForm')">确定</el-button>
          </span>
        </el-dialog>
        <el-dialog
          :modal-append-to-body="false"
          lock-scroll
          :visible.sync="imgDialog"
          width="75%"
          top="5vh">
          <img
            v-cloak
            :src="data.projectUrl"
            class="imgSize"
            :style="{'height':minHeight - 140 + 'px'}"
          />
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>
import { details, selects, updateSpaceModel } from "../../api/api.js";
import { getDate } from "../../labs/tools.js"; //时间格式转换
import Qs from "qs"; //字符串解析和序列化的库
import Modal from "./modal.vue"; //编辑设备信息
import ossUpload from "../../labs/upload.js";
export default {
  name: "",
  components: {
    Modal
  },
  data() {
    return {
      //dialog 是否显示
      dialogShow: false,
      //校验格式
      addTmpRule: {
        modelTitle: [
          {
            required: true,
            pattern: /^[A-Za-z0-9\u4e00-\u9fa5\-]{1,10}$/,
            min: 1,
            max: 10,
            message: "1-10个字符，可填数字、字母、汉字、-符号",
            trigger: "blur"
          }
        ],
        modelName: [
          {
            required: true,
            pattern: /^[a-zA-Z0-9\u4e00-\u9fa5]{1,20}$/,
            min: 1,
            max: 20,
            message: "1-20个字符，可填数字、字母、汉字",
            trigger: "blur"
          }
        ],
        pictureUrl: [
          { required: true, message: "请上传户型图", trigger: "change" }
        ]
      },

      isShowModal: false,
      minHeight: null,
      minHeightInner: null,
      imgDialog: false,
      //编辑参数
      addForm: {
        modelId: "",
        modelTitle: "",
        modelName: "",
        pictureUrl: ""
      },
      projectId: null, //项目id
      data: {}, //返回參數
      currentPage4: 1,
      templateId: null,
      pageSize: 10,
      pageNum: 1,
      total: 0,
      dataList: [],
      activeName2: "first",
      addDialogVisible: false,
      value1: "",
      standand: ""
    };
  },
  created() {},
  mounted() {
    this.minHeight = window.innerHeight - 95;
    this.minHeightInner = window.innerHeight - 195;
    this.templateId = this.$route.query.id - 0;
    let index = this.$route.query.temName.indexOf(" ");
    this.standand = this.$route.query.temName.substring(0, index);
    this.getDate();
  },
  methods: {
    getCurrentPermission(val) {
      var self = this;
      var permission = "";
      if (val) {
        permission = val;
      }
      return permission;
    },
    //关闭
    handleClose(done) {
      this.$confirm("是否放弃编辑模板？", {
        showClose: false
      })
        .then(_ => {
          done();
          this.$refs["addForm"].resetFields();
        })
        .catch(_ => {});
    },
    //路由获取id
    getTemplateId() {
      this.dialogShow = true;
    },
    //取消编辑
    close(formName) {
      this.$confirm("是否放弃编辑模板?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        showClose: false
      })
        .then(() => {
          this.$refs[formName].resetFields();
          this.addDialogVisible = false;
        })
        .catch(() => {});
    },

    handleDialogClose(isConfirm) {
      this.dialogShow = false;
      if (isConfirm) {
        this.getDate();
      }
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
          this.addForm.modelId = this.templateId - 0;
          this.addForm.projectId = this.projectId - 0;
          updateSpaceModel(this.addForm).then(res => {
            if (res.err_CODE == 0) {
              this.$message.success("编辑成功");
              this.addDialogVisible = false;
              this.getSelect();
              this.getDate();
            } else if (res.err_MESSAGE == "模板信息未做修改") {
              this.addDialogVisible = false;
              this.getSelect();
              this.getDate();
            } else {
              this.$message.error(res.err_MESSAGE);
            }
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
        target: document.querySelector('#template-detail')
      });
      details({ templateId: this.templateId })
        .then(res => {
          this.data = res.data;
          this.projectId = res.data.projectId;
          loading.close()
        })
        .catch(() => {
          loading.close()
        });
    },
    //tab切换
    handleClick(tab, event) {
      if (tab.index == 1) {
        this.getSelect();
      } else {
        this.getDate();
      }
    },
    //获取操作日志
    getSelect() {
      let data = {
        modelId: this.templateId - 0,
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
      this.addDialogVisible = true;
      this.addForm.modelName = this.data.templateName;
      this.addForm.modelTitle = this.data.templateTitle;
      this.addForm.pictureUrl = this.data.projectUrl;
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

<style lang="scss">
.template-detail {
  background: #ffffff;
  .spaceMA {
    width: 100%;
    margin-top: 50%;
    margin-left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    color: #adadad;
    font-size: 14px;
    background: #fff;
  }

  .el-message-box__message p {
    font-size: 17px;
    color: black;
    text-align: center;
  }
  .el-form-item__error {
    width: 260px;
    padding-top: 0px !important;
  }
  .el-form-item__content {
    font-size: 12px !important;
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
.el-dialog {
  .mes {
    .top {
      img {
        width: 190px;
        height: 126px;
      }
      .right {
        padding-left: 15px;
        margin-top: -14px;
        .el-input__inner {
          width: 241px !important;
          padding: 0 0 !important;
        }
        .el-form-item {
          margin-bottom: 10px;
        }
        .el-form-item__content {
          margin-left: 60px;
        }
        .el-form-item__error {
          padding: 0 !important;
        }
      }
    }
    .bottom {
      p {
        margin-top: 15px;
        .el-button {
          padding: 0;
          width: 88px;
          height: 28px;
          text-align: center;
          font-size: 12px;
          border: 1px solid #af7c58;
        }
      }
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
.template-detail .el-form-item {
  height: 47px;
}
.overh {
  overflow: hidden;
  padding-bottom: 6px;
}
.err {
  margin-left: 20px;
  margin-top: 10px;
  color: #af7c58;
  font-size: 14px;
}
.device-mag-box .device-msg .device-Message {
  overflow:hidden;
  margin-bottom:14px;
}
.device-mag-box .device-msg .space-box .device-type .device ul {
  padding-left: 16px;
}
.device-mag-box .device-msg .space-box .sapce-name {
  font-size: 15px;
  font-weight: bold;
}
.device-mag-box .device-msg .space-box .margin-re{
  margin-left: 20px;
}
.device-mag-box .device-msg .space-box .margin-l{
  margin-left: 10px;
}
.device-img-box .fr{
  border:none;
}
.spaceMB{
  background:#F1F1F1;
}
.spaceMB .imgSize {
  display:block;
  margin: 0 auto;
  max-width:100%;
}
.spaceMB .template-base-msgbox .msg-title .fr{
  border:none;
}
</style>
