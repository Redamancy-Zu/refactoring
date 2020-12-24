<template>
  <div class="space-template" :style="{minHeight: minHeight + 'px'}">
    <div class="spaceNA">
      <span>您没有模板管理的查看权限！</span>
    </div>
    <div
      class="spaceNB"
      :style="{minHeight: minHeightInner + 'px'}"
      v-fence="{data:'', functions:['查看模板列表，模板详情']}"
    >
      <div class="sel-container">
        <el-col :span="16">
          <span class="selectProject">选择项目</span>
          <el-select
            v-model="page.projectId"
            v-snap="page.projectId"
            size="mini"
            @change="projectChange(page.projectId)"
          >
            <el-option
              v-for="(pro, index) in projectArr"
              :key="index"
              :label="pro.projectName"
              :value="pro.projectId"
            ></el-option>
          </el-select>
          <el-checkbox
            v-model="page.onlyHouseTemplate"
            v-snap="page.onlyHouseTemplate"
            @change="onlyHouseChange"
          >只看户型模板</el-checkbox>
          <el-input
            class="search"
            placeholder="模板编号/模板名"
            v-model="page.templateIdOrName"
            v-snap="page.templateIdOrName"
            size="mini"
            @keyup.native="searchTemplate(page.templateIdOrName)"
          >
            <i slot="suffix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-col>
        <el-col :span="8" style="text-align:right">
          <el-button
            v-fence="{data:getCurrentPermission(), functions:['维护模板（新建，编辑，删除）']}"
            type="primary"
            style="border:none;float: right;"
            size="mini"
            icon="el-icon-plus"
            @click="handleOpen"
          >新建模板</el-button>
        </el-col>
      </div>
      <!-- 列表数据 -->
      <div class="tb-container">
        <template>
          <el-table :data="tb_data">
            <el-table-column prop="projectName" label="项目名"></el-table-column>
            <el-table-column label="模版编号">
              <template slot-scope="scope">
                <router-link
                  :to="{path:'/templateDetail', query:{id:scope.row.templateId,temName:scope.row.projectName+' '+scope.row.templateTitle}}"
                  class="txt_underline"
                >{{scope.row.templateTitle}}</router-link>
              </template>
            </el-table-column>
            <el-table-column prop="templateType" label="模板类型">
              <template slot-scope="scope">{{scope.row.templateType == 1 ? "户型模板" : "普通模板"}}</template>
            </el-table-column>
            <el-table-column prop="templateName" label="模版名"></el-table-column>
            <el-table-column prop="deviceNum" label="设备总数"></el-table-column>
            <el-table-column label="户型图">
              <template slot-scope="scope">
                <span
                  class="txt_underline"
                  @click="viewImg(scope.row.pictureUrl)"
                >查看</span>
              </template>
            </el-table-column>
            <el-table-column label="使用情况">
              <template
                slot-scope="scope"
              >{{scope.row.templateType == 1 ? scope.row.houseNum === 0 ? '未使用' : '已使用' : '－'}}</template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <span>
                  <i
                    v-fence="{data:getCurrentPermission(scope.row.projectName), functions:['维护模板（新建，编辑，删除）']}"
                    v-if="scope.row.houseNum === 0"
                    class="el-icon-delete"
                    @click="deleteModel(scope.row.templateId)"
                  ></i>
                </span>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <div class="paging fr" v-snap="pageNum">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNum"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pageParams.total"
            v-if="pageParams.total"
          ></el-pagination>
        </div>
      </div>

      <!--  add template dialog  新建模板弹框-->
      <el-dialog
        class="addTemplate"
        :modal-append-to-body="false"
        title="新建模板"
        :visible.sync="addDialogVisible"
        width="636px"
        :before-close="resetForm"
        top="25vh"
      >
        <el-form :model="addForm" ref="modelForm" :rules="addTmpRule">
          <el-form-item label="项目" prop="projectId" label-width="100px">
            <el-select
              class="selectProjram"
              placeholder="请选择项目"
              v-model="addForm.projectId"
              size="mini"
            >
              <el-option
                v-for="(pro, index) in addProjectArr"
                v-fence="{data:getCurrentPermission(pro.projectName), functions:['维护模板（新建，编辑，删除）']}"
                :key="index"
                :label="pro.projectName"
                :value="pro.projectId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="模版编号" prop="templateTitle" label-width="100px">
            <el-input v-model.trim="addForm.templateTitle" placeholder="例：A户型/W001" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="模板类型" prop="modelType" label-width="100px">
            <el-radio-group v-model="addForm.modelType" size="mini">
              <el-radio :label="2" size="mini">普通模板</el-radio>
              <el-radio :label="1" size="mini">户型模板</el-radio>
            </el-radio-group>
            <span class="modelMessage">模版设为户型可在编辑房源时使用</span>
          </el-form-item>
          <el-form-item label="模版名称" prop="templateName" label-width="100px">
            <el-input v-model.trim="addForm.templateName" placeholder="例：3室2厅1厨2卫" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="上传户型图" prop="pictureUrl" label-width="100px">
            <el-upload
              class="upload-demo"
              id="innerDoor"
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
              <input type="hidden" v-model="addForm.pictureUrl" />
              <el-tooltip
                class="item"
                effect="light"
                :content="fileName"
                :disabled="fileName?false:true"
                placement="top-start"
              >
                <el-input
                  class="filename"
                  v-model="fileName"
                  disabled="disabled"
                  placeholder="例：项目/户型图A"
                  size="mini"
                ></el-input>
              </el-tooltip>
              <el-button size="mini" type="primary">浏览</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item
            id="import"
            prop="copyBy"
            ref="copyByForm"
            class="copyBy"
            :rules="isImport?addTmpRule.copyBy:[{ required: false, message: '请选择要导入的模板',trigger: 'change'}]"
          >
            <el-checkbox class="copyCheckbox" v-model="isImport" label="导入相似模版的空间设备拓扑" size="mini"></el-checkbox>
            <el-select
              class="copySimily"
              v-model="addSelect"
              size="mini"
              :disabled="!isImport"
              placeholder="项目"
            >
              <el-option
                v-for="(pro, index) in addProjectArr"
                v-fence="{data:getCurrentPermission(pro.projectName), functions:['维护模板（新建，编辑，删除）']}"
                :key="index"
                :label="pro.projectName"
                :value="pro.projectId"
              ></el-option>
            </el-select>
            <el-select
              v-model.trim="addForm.copyBy"
              placeholder="模板编号"
              size="mini"
              :disabled="!isImport"
            >
              <el-option
                v-for="(pro, index) in houseArr"
                :key="index"
                :label="pro.houseFullName"
                :value="pro.modelId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="resetForm('modelForm')">取消</el-button>
          <el-button type="primary" @click="formPost('modelForm')">确定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        :modal-append-to-body="false"
        class="img-view"
        lock-scroll
        :visible.sync="imgDialog"
        width="75%"
        top="5vh"
      >
        <img
          v-cloak
          :src="imgView"
          class="imgSize"
          :style="{'height':minHeight - 140 + 'px'}"
        />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"; //全局城市id
import ossUpload from "../../labs/upload.js";
import {
  modelAdd, // 新增模板
  modelDelete,  // 删除模板
  getProjectName, //获取项目下拉
  SpaceModelSelect, //模板列表
  findAllHouseInfo //搜索模板
} from "../../api/api.js";
import axios from "axios";
export default {
  name: "space-template",
  data() {
    return {
      fromDetail: false,
      /*下面四个属性为保存从详情页面返回时的临时存储*/
      cachePageNum: 0,
      cacheProjectId: 0,
      cacheOnlyHouseTemplate: false,
      cacheTemplateIdOrName: "", //搜索关键字

      minHeight: null,
      minHeightInner: null,
      projectArr: [], //项目下拉数据
      //分页
      page: {
        provinceId: null,
        countryId: 1,
        cityId: null,
        projectId: null,
        onlyHouseTemplate: false,
        templateIdOrName: ""
      },
      pageNum: this.pageNum || 1,
      pageSize: 10,
      pageParams: {
        total: 0
      },
      tb_data: [], //列表数据
      imgView: "", //查看图片
      addDialogVisible: false, //新建模板
      imgDialog: false,  //户型图查看
      //新增模板
      addForm: {
        projectId: "",
        templateTitle: "",
        modelType: 2,
        templateName: "",
        pictureUrl: "",
        copyBy: ""
      },
      fileName: "", //上传图名
      isImport: false,
      addProjectArr: [], //新增项目列表
      addSelect: "",
      houseArr: [], //户型数据
      //新增模板校验
      addTmpRule: {
        projectId: [
          { required: true, message: "请选择项目", trigger: "change" }
        ],
        templateTitle: [
          {
            required: true,
            pattern: /^[A-Za-z0-9\u4e00-\u9fa5\-]{1,10}$/,
            min: 1,
            max: 10,
            message: "1-10个字符，字母、数字、汉字、-符号",
            trigger: "blur"
          }
        ],
        modelType: [
          { required: true, message: "请选择模板类型", trigger: "change" }
        ],
        templateName: [
          {
            required: true,
            pattern: /^[a-zA-Z0-9\u4e00-\u9fa5]{1,20}$/,
            min: 1,
            max: 20,
            message: "1-20个字符，可填字母、数字、汉字",
            trigger: "blur"
          }
        ],
        pictureUrl: [
          { required: true, message: "请上传户型图", trigger: "change" }
        ],
        copyBy: [
          { required: true, message: "请选择要导入的模板", trigger: "change" }
        ]
      }
    };
  },
  mounted() {
    this.minHeight = window.innerHeight - 95;
    this.minHeightInner = window.innerHeight - 195;
    this.page.countryId = this.getCurrentCityId[0] || null;
    this.page.provinceId = this.getCurrentCityId[1] || null;
    this.page.cityId = this.getCurrentCityId[2] || null;
    this.getData(); //模板列表
  },
  computed: {
    ...mapGetters(["getCurrentCityId"])
  },
  watch: {
    // 获取全局城市
    getCurrentCityId: {
      handler: function(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.page.countryId = newVal[0] || null;
          this.page.provinceId = newVal[1] || null;
          this.page.cityId = newVal[2] || null;
          this.pageNum = 1;
          this.getData();
        }
      },
      // 深度观察监听
      deep: true
    },
    // 监听下拉
    addSelect: {
      handler: function(val, oldval) {
        this.getHouse(val);
      }
    },
    // 监听是否导入
    isImport: {
      handler: function(val) {
        if (!val) {
          this.addSelect = "";
          this.addForm.copyBy = "";
          !val &&
            setTimeout(() => {
              this.$refs["copyByForm"].clearValidate();
            }, 0);
        }
      }
    }
  },

  methods: {
    // 获取项目列表
    getData() {
      getProjectName({
        countryId: this.page.countryId,
        provinceId: this.page.provinceId,
        cityId: this.page.cityId
      }).then(res => {
        let data = res.data.data;
        this.projectArr = [{ projectId: null, projectName: "全部" }, ...data];
        this.addProjectArr = data;
        this.getSelect();
      });
    },
    // 选择项目
    projectChange(projectId) {
      this.pageNum = 1;
      this.getSelect();
    },
    //只看户型模板
    onlyHouseChange(onlyHouse) {
      this.page.isHouseTemplate = onlyHouse;
      this.pageNum = 1;
      this.getSelect();
    },
    //查询模板编号/模板名
    searchTemplate(val) {
      this.$nextTick(function() {
        this.page.templateIdOrName = val;
        this.pageNum = 1;
        this.getSelect();
      });
    },
    // 获取页面列表页
    getSelect() {
      const loading = this.$loading({
        lock: true,
        target: document.querySelector('#space-template')
      });
      SpaceModelSelect({
        ...this.page,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      })
        .then(response => {
          this.pageParams.total = response.data.total;
          this.tb_data = response.data.list;
          loading.close()
        })
        .catch(() => {
         loading.close()
        });
    },
    // 删除模板
    deleteModel(id) {
      this.$confirm("确定删除模板?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          modelDelete({
            templateId: id
          })
            .then(res => {
              if (res.err_CODE === 0) {
                this.tb_data = this.tb_data.filter(
                  item => item.templateId != id
                );
                this.$message({
                  type: "success",
                  message: res.data
                });
              } else if (res.err_CODE === 1) {
                this.$message.error(res.err_MESSAGE);
              }
            })
            .catch(err => {
              this.$message.error(res.err_MESSAGE);
            });
        })
        .catch(err => {});
    },
    // 查看图片
    viewImg(img) {
      if (!img) return;
      this.imgView = img;
      this.imgDialog = true;
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageNum = 1;
      this.getSelect();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getSelect();
    },
    // 新增模板
    formPost(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          modelAdd(this.addForm).then(res => {
            if (res.err_CODE == 0) {
              this.isImport = false;
              this.fileName = "";
              this.addSelect = "";
              this.houseArr = [];
              this.addForm.copyBy = "";
              this.addForm.modelType = 2;
              this.$message.success(res.err_MESSAGE);
              this.addDialogVisible = false;
              this.$refs[formName].resetFields();
              this.getSelect();
            } else {
              this.$message.error(res.err_MESSAGE);
            }
          });
        } else {
          return false;
        }
      });
    },
    // 重置新建模板
    resetForm(formName) {
      this.$confirm("是否放弃新建模板?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        showClose: false
      })
        .then(() => {
          this.isImport = false;
          this.fileName = "";
          this.addSelect = "";
          this.houseArr = [];
          this.addForm.copyBy = "";
          this.addForm.modelType = 2;
          this.addDialogVisible = false;
          this.$refs.modelForm.resetFields();
        })
        .catch(() => {
          document.getElementsByClassName("v-modal")[0].style.display = "none";
          document.getElementsByClassName('el-dialog__wrapper')[0].style.background = "rgba(0,0,0,.2)";
        });
    },
    // 户型查询
    getHouse(projectId) {
      findAllHouseInfo({
        projectId: projectId
      }).then(res => {
        this.addForm.copyBy = "";
        this.houseArr = res.data.data;
      });
    },

    // 打开新建模板
    handleOpen() {
      this.addDialogVisible = true;
    },
    //上传户型图
    uploadImage(option) {
      ossUpload.ossUploadFile(option);
    },

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

    // 获取上传成功的图片地址
    handleAvatarSuccess(res, file) {
      this.fileName = file.name;
      this.addForm.pictureUrl = res.res.requestUrls[0];
      this.$message.success("上传成功");
    },
    uploadError() {
      this.$message.error("上传失败，请重新上传");
    },
    getCurrentPermission(val) {
      var self = this;
      var permission = "";
      self.projectArr.forEach(pro => {
        if (pro.projectId === self.page.projectId) {
          permission = pro.projectName;
        }
        if (permission == "全部") {
          permission = "";
        }
      });
      if (val) {
        permission = val;
      }
      return permission;
    }
  }
};
</script>

<style lang="scss">
.addTemplate {
  .el-dialog__body {
    padding: 30px 40px 30px 20px !important;
  }
}
@import "../../styles/space-template.scss";
.space-template #import {
  .el-select {
    .el-input {
      .el-input__inner {
        height: 28px !important;
      }
    }
  }
}
.selectProjram {
  width: 100%;
}
.copySimily {
  margin: 0 15px !important;
}
.copyCheckbox {
  margin-right: 0 !important;
}
.space-template .filename {
  &.el-input {
    .el-input__inner {
      color: #323232 !important;
    }
  }
}
#innerDoor {
  .filename {
    width: 389px !important;
  }
  .el-button {
    margin-left: -6px;
  }
}
.space-template .copyBy {
  .el-form-item__error {
    left: 183px;
  }
}

.space-template .el-form-item__error {
  padding-top: 0;
}
.space-template {
  position: relative;
  .spaceNA {
    z-index: 10;
    span {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 100%;
      transform: translate(-50%, -50%);
      text-align: center;
      color: #adadad;
      font-size: 14px;
    }
  }
  .spaceNB {
    position: relative;
    z-index: 100;
    background: #fff;
    .img-view .imgSize{
      display:block;
      margin: 0 auto;
      max-width:100%;
    }
  }
  .el-pagination {
    padding: 2px 0;
  }
  .paging{
    margin-top:10px;
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
.addTemplate .modelMessage {
  font-size:12px;
  color:#ADADAD;
  margin-left:10px;
}
.el-table::before {
  height: 0;
}
.el-button {
  padding: 0;
  width: 88px;
  height: 28px;
  text-align: center;
  font-size: 12px;
  border: 1px solid #af7c58;
}
.sel-container {
  .search {
    width: 160px;
    .el-input__inner {
      width: 160px;
    }
  }
  .selectProject{
    margin-right: 10px;
    color:rgba(50,50,50,1);
  }
}
.el-dialog {
  .el-dialog__body {
    width: 100%;
    text-align: center;
    padding: 0 !important;
    img {
      max-width: 100%;
    }
  }
  .el-form {
    .el-form-item {
      margin-bottom: 10px;
      height: 45px;
    }
  }
}
.spaceNB .tb-container .el-icon-delete{
 cursor:pointer;
}
</style>
