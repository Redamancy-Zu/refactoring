<template>
  <div id="productModel" :style="{minHeight: minHeight + 'px'}">
    <div class="spaceMA">
      <span>您没有产品型号管理的查看权限！</span>
    </div>
    <div
      class="spaceMB"
      :style="{minHeight: minHeightInner + 'px'}"
      v-fence="{data:'', functions:['查看产品型号列表，详情']}"
    >
      <div class="select-container">
        <el-col>
          选择类别/类型
          <el-cascader
            ref="typeModelList"
            :options="projectTypeArr"
            size="mini"
            v-model="selectedOptions"
            v-snap="selectedOptions"
            @change="handleChange"
          ></el-cascader>科技系统分类
          <el-select
            class="clacifi"
            v-model="page['classiFication']"
            v-snap="page.classiFication"
            size="mini"
            @change="classiFicationChange(page.classiFication)"
          >
            <el-option
              v-for="(pro, index) in classiFicationArr"
              :key="index"
              :label="pro.name"
              :value="pro.code"
            ></el-option>
          </el-select>选择标签分类
          <el-cascader
            size="mini"
            placeholder="请选择"
            @change="selectLabelTypeListChange"
            :options="selectLabelTypeLists"
            v-model="page['selectLabelTypeLists']"
            v-snap="page.selectLabelTypeLists"
          ></el-cascader>
          <!-- 产品名称搜索 -->
          <el-input
            class="search"
            placeholder="产品名称"
            v-model="page.templateIdOrName"
            v-snap="page.templateIdOrName"
            size="mini"
            @keyup.native="searchTemplate(page.templateIdOrName)"
          >
            <i slot="suffix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-col>
        <el-col
          v-fence="{data:'', functions:['维护产品型号基本信息（新建，编辑，删除）']}"
          :span="3"
          style="text-align:right"
        >
          <el-button
            type="primary"
            style="border:none"
            icon="el-icon-plus"
            @click="addRoomName"
          >新建产品</el-button>
        </el-col>
      </div>
      <div v-fence="{data:'', functions:['查看产品型号列表，详情']}" class="table-container">
        <template>
          <el-table :data="tab_data">
            <el-table-column label="产品名称">
              <template slot-scope="scope">
                <router-link
                  :to="{path:'/productModelDetail',query:{id:scope.row.productId,temName:scope.row.productName}}"
                  class="txt_underline"
                >{{scope.row.productName}}</router-link>
              </template>
            </el-table-column>
            <el-table-column prop="productModelName" label="产品型号"></el-table-column>
            <el-table-column prop="venderName" label="厂商"></el-table-column>
            <el-table-column prop="categoryDetails" label="产品类别"></el-table-column>
            <el-table-column prop="productTypeName" label="产品类型"></el-table-column>
            <el-table-column prop="nodeType" label="节点类型"></el-table-column>
            <el-table-column prop="deviceCount" label="设备总数"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <span
                  v-fence="{data:'', functions:['维护产品型号基本信息（新建，编辑，删除）']}"
                  class="descEdit"
                >
                  <i
                    v-if="scope.row.deviceCount == 0"
                    class="el-icon-delete"
                    @click="deleteModel(scope.row.productId)"
                  ></i>
                </span>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <div class="paging fr" v-snap="page.pageIndex">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="page.pageIndex"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="page.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            v-if="total"
          ></el-pagination>
        </div>
        <!-- dialog 新增 -->
        <el-dialog
          class="plusProModel addProduct"
          title="新建产品"
          :modal-append-to-body="false"
          :visible.sync="addDialog"
          width="596px"
          :before-close="resetForm"
          top="20vh"
        >
          <el-form :model="addForm" ref="addForm" :rules="addTmpRule" @submit.native.prevent>
            <el-form-item label="产品名称" prop="productName" label-width="80px">
              <el-input
                v-model.trim="addForm.productName"
                placeholder="支持汉字、字母、数字、-和_，必须以字母，汉字开头"
                size="mini"
              ></el-input>
            </el-form-item>
            <el-form-item label="产品型号" prop="productModelName" label-width="80px">
              <el-input v-model.trim="addForm.productModelName" placeholder="例：A" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="厂商" prop="venderName" label-width="80px">
              <el-input v-model.trim="addForm.venderName" placeholder="例：**厂商" size="mini"></el-input>
            </el-form-item>
            <el-form-item
              label="产品类型"
              id="productTypeLength"
              prop="productTypeId"
              label-width="80px"
            >
              <el-cascader
                placeholder="类别/类型"
                size="mini"
                :options="addForm.projectTypeArr"
                v-model="addForm.productTypeId"
                @change="plusProChange"
              ></el-cascader>
            </el-form-item>
            <el-form-item
              v-if="addForm.productTypeId != ''"
              label="节点类型"
              required
              label-width="80px"
            >
              <span
                :model="addForm['plusNodeType']"
                class="codeTypeCont"
              >{{addForm['plusNodeType']}}</span>
            </el-form-item>
            <el-form-item
              id="dataRate"
              label="数据采集频率"
              label-width="94px"
              required
            >
              <el-radio-group
                @change="selectType"
                class="collectRateRadio"
                v-model="addForm.radioType"
              >
                <el-radio :label="1" style="margin:0 23px 0 1px;">变化时采集</el-radio>
                <el-radio :label="2" style="margin:0px;">固定时长采集</el-radio>
              </el-radio-group>
              <el-input
                v-if="addForm.radioType == '2'"
                class="collectRateInput"
                @blur="RateInput"
                v-model="addForm.radioNum"
                :placeholder="addForm.radioUnit == '小时'?addForm.radioNumPlace[0]:addForm.radioNumPlace[addForm.radioUnit-1]"
              ></el-input>
              <el-select
                v-if="addForm.radioType == '2'"
                class="collectRateSelect"
                @change="selectUnit"
                v-model="addForm.radioUnit"
              >
                <el-option
                  v-for="item in addForm.radioUnits"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <div class="RateInputErr" v-if="addForm.rateErr">{{addForm.RateInputErr}}</div>
            </el-form-item>
            <el-form-item
              :class="addForm.productTypeId == ''? 'proDescri' : 'proDesC'"
              label="产品描述"
              label-width="80px"
              prop="description"
            >
              <el-input
                type="textarea"
                size="mini"
                resize="none"
                maxlength="100"
                :autosize="{ minRows: 6, maxRows: 10}"
                placeholder="0-100个字符"
                v-model.trim="addForm.description"
              ></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="resetForm('addForm')">取消</el-button>
            <el-button type="primary" @click="formPost('addForm')">确定</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>
import {
  modelSelectListModel, // 产品类型、型号三级联动
  selectProType, //标签分类下拉框
  selectProCategory, //科技系统分类
  productModelAdd, // 产品型号添加
  productModelDelete, // 删除产品型号
  producTypeD, // 新增获取节点类型
  selectLabelTypeList //选择标签分类下拉
} from "../../api/api.js";
import { mapActions, mapGetters } from "vuex"; //全局城市id

export default {
  name: "product-model",
  data() {
    return {
      classiFicationArr: [], //获取科技系统分类
      minHeight: null,
      minHeightInner: null,
      addDialog: false, //新增产品
      editDialog: false, //编辑产品
      edit: false,
      //新增产品数据
      addForm: {
        productName: "",
        productModelName: "",
        venderName: "",
        productTypeId: [],
        description: "",
        projectTypeArr: [],
        plusNodeType: "",
        radioType: 1,
        radioNum: "",
        radioUnit: "小时",
        radioUnits: [
          { value: "1", label: "小时" },
          { value: "2", label: "分钟" },
          { value: "3", label: "秒" }
        ],
        rateErr: false,
        RateInputErr: "",
        radioNumPlace: [
          "最大值为24的正整数",
          "最大值为1440的正整数",
          "最大值为86400的正整数"
        ]
      },
      RateInputErr: "",
      editForm: {
        projectId: null,
        projectName: null,
        nameId: null,
        roomName: ""
      },
      oldName: "",
      //新增产品规则
      addTmpRule: {
        productTypeId: [
          {
            required: true,
            message: "请选择类别/类型",
            trigger: "change"
          }
        ],
        productName: [
          {
            pattern: /^[a-zA-Z\u4e00-\u9fa5][a-zA-Z0-9\u4e00-\u9fa5\-\_]{0,14}$/,
            required: true,
            message:
              "1-15个字符(支持汉字、字母、数字、-和_，必须以字母，汉字开头)",
            trigger: "blur"
          }
        ],
        productModelName: [
          {
            min: 1,
            max: 50,
            required: true,
            message: "1-50个字符",
            trigger: "blur"
          }
        ],
        venderName: [
          {
            min: 1,
            max: 50,
            required: true,
            message: "1-50个字符",
            trigger: "blur"
          }
        ],
        description: [{ message: "0-100个字符", trigger: "blur" }]
      },
      //编辑规则
      editTmpRule: {
        roomName: [
          {
            pattern: /^[a-zA-Z0-9\u4e00-\u9fa5]{1,10}$/,
            min: 1,
            max: 10,
            required: true,
            message: "1-10个字符，字母、数字、汉字",
            trigger: "blur"
          }
        ]
      },
      tab_data: [], //产品型号列表
      total: 10,
      addProjectArr: [],
      projectArr: [],
      //分页
      page: {
        pageIndex: 1,
        pageSize: 10,
        classiFication: null, //科技系统分类
        selectLabelTypeLists: [null], //选择标签分类
        templateIdOrName: null //搜索框内容
      },
      projectTypeArr: [], //类别
      selectedOptions: [null],
      selectLabelTypeLists: []
    };
  },
  mounted() {
    this.minHeight = window.innerHeight - 95;
    this.minHeightInner = window.innerHeight - 195;
    this.getSelect(); // 获取项目类别类型列表
    this.getCategorySelect(); //获取科技系统分类
    this.selectLabelTypeListAll();  // 标签分类下拉数据获取

    this.getProData(); //获取列表数据
  },
  //loading开启
  methods: {
    //采集频率方式
    selectType() {
      this.addForm.radioNum = "";
      this.addForm.radioUnit = "小时";
      this.addForm.rateErr = false;
    },
    //采集频率单位选择
    selectUnit(value) {
      this.addForm.radioNum = "";
      this.addForm.rateErr = false;
    },
    //采集频率输入框
    RateInput() {
      let radioNum = Number(this.addForm.radioNum);
      let radioUnit = this.addForm.radioUnit;
      if (radioUnit == "小时" || radioUnit == "1") {
        if (
          !(radioNum >= 1 && radioNum <= 24) ||
          !/(^[0-9]*[1-9][0-9]*$)/.test(radioNum)
        ) {
          this.addForm.RateInputErr = "请输入1-24的正整数";
          this.addForm.rateErr = true;
        } else {
          this.addForm.rateErr = false;
        }
      } else {
        if (radioUnit == "2") {
          if (
            !(radioNum >= 1 && radioNum <= 1440) ||
            !/(^[0-9]*[1-9][0-9]*$)/.test(radioNum)
          ) {
            this.addForm.RateInputErr = "请输入1-1440的正整数";
            this.addForm.rateErr = true;
          } else {
            this.addForm.rateErr = false;
          }
        } else if (radioUnit == "3") {
          if (
            !(radioNum >= 1 && radioNum <= 86400) ||
            !/(^[0-9]*[1-9][0-9]*$)/.test(radioNum)
          ) {
            this.addForm.RateInputErr = "请输入1-86400的正整数";
            this.addForm.rateErr = true;
          } else {
            this.addForm.rateErr = false;
          }
        }
      }
    },
    // 标签分类下拉数据获取
    selectLabelTypeListAll() {
      selectLabelTypeList().then(res => {
        let data = res.data;
        this.selectLabelTypeLists = [{ value: null, label: "全部" }, ...data];
      });
    },
    // 选择标签分类事件
    selectLabelTypeListChange(value) {
      let CID = null;
      if (this.selectedOptions.length == 1) {
        CID = this.selectedOptions[0];
      }
      let TID = null;
      if (this.selectedOptions.length == 2) {
        TID = this.selectedOptions[1];
      }
      let data = {
        productCategoryId: CID,
        productTypeId: TID,
        productName: this.page.templateIdOrName,
        classification: this.page.classiFication,
        labelId: value[value.length - 1],
        pageIndex: 1,
        pageSize: 10
      };
      selectProType({ ...data }).then(res => {
        let data = res.data;
        this.total = data.total;
        this.tab_data = data.list;
        this.tab_data.forEach(v => {
          if (v.nodeType == 1) {
            v.nodeType = "网关";
          } else if (v.nodeType == 2) {
            v.nodeType = "设备";
          }
        });
      });
    },
    // 获取项目类别类型列表
    getSelect() {
      modelSelectListModel({
        code: 1
      }).then(res => {
        let data = res.data.data;
        this.projectTypeArr = JSON.parse(
          JSON.stringify([{ value: null, label: "全部" }, ...data])
        );
        data.forEach(daVal => {
          daVal.value = {
            category: daVal.value,
            value: daVal.value,
            label: daVal.label
          };
          daVal.children.forEach(chiVal => {
            chiVal.type = chiVal.value;
            chiVal.value = {
              type: chiVal.value,
              value: chiVal.value,
              label: chiVal.label
            };
          });
        });
        this.addForm.projectTypeArr = JSON.parse(JSON.stringify([...data]));
      });
    },
    getCategorySelect() {
      //获取科技系统分类
      selectProCategory().then(res => {
        let data = res.data;
        this.classiFicationArr = [{ code: null, name: "全部" }, ...data];
      });
    },
    // 选择型号类别
    handleChange(val) {
      let CID = null;
      if (this.selectedOptions.length == 1) {
        CID = this.selectedOptions[0];
      }
      let TID = null;
      if (this.selectedOptions.length == 2) {
        TID = this.selectedOptions[1];
      }
      let data = {
        productCategoryId: CID,
        productTypeId: TID,
        productName: this.page.templateIdOrName,
        classification: this.page.classiFication,
        labelId: this.page.selectLabelTypeLists[
          this.page.selectLabelTypeLists.length - 1
        ],
        pageIndex: 1,
        pageSize: 10
      };
      selectProType({ ...data }).then(res => {
        let data = res.data;
        this.total = data.total;
        this.tab_data = data.list;
        this.tab_data.forEach(v => {
          if (v.nodeType == 1) {
            v.nodeType = "网关";
          } else if (v.nodeType == 2) {
            v.nodeType = "设备";
          }
        });
      });
    },
    // 选择分类
    classiFicationChange(value) {
      let CID = null;
      if (this.selectedOptions.length == 1) {
        CID = this.selectedOptions[0];
      }
      let TID = null;
      if (this.selectedOptions.length == 2) {
        TID = this.selectedOptions[1];
      }
      let data = {
        productCategoryId: CID,
        productTypeId: TID,
        productName: this.page.templateIdOrName,
        classification: value,
        labelId: this.page.selectLabelTypeLists[
          this.page.selectLabelTypeLists.length - 1
        ],
        pageIndex: 1,
        pageSize: 10
      };
      selectProType({ ...data }).then(res => {
        let data = res.data;
        this.total = data.total;
        this.tab_data = data.list;
        this.tab_data.forEach(v => {
          if (v.nodeType == 1) {
            v.nodeType = "网关";
          } else if (v.nodeType == 2) {
            v.nodeType = "设备";
          }
        });
      });
    },
    //重置数据
    reserData() {
      this.$set(this.addForm, "radioType", 1);
      this.$set(this.addForm, "radioNum", "");
      this.$set(this.addForm, "radioUnit", "小时");
      this.$set(this.addForm, "rateErr", false);
    },
    // 新增产品名称
    formPost(formName) {
      this.$refs[formName].validate(valid => {
        if (valid && !this.addForm.rateErr) {
          let addData = {};
          addData.productTypeId = this.addForm.productTypeId[
            this.addForm.productTypeId.length - 1
          ].type;
          addData.description = this.addForm.description;
          if (this.addForm.plusNodeType == "网关") {
            addData.plusNodeType = 1;
          } else if (this.addForm.plusNodeType == "设备") {
            addData.plusNodeType = 2;
          }
          addData.productModelName = this.addForm.productModelName;
          addData.productName = this.addForm.productName;
          addData.venderName = this.addForm.venderName;
          addData.gatherType = this.addForm.radioType;
          if (this.addForm.radioType == "2") {
            if (this.addForm.radioUnit == "小时") {
              addData.durationUnit = "1";
            } else {
              addData.durationUnit = this.addForm.radioUnit;
            }
            addData.duration = this.addForm.radioNum;
          } else {
            delete addData.durationUnit;
            delete addData.duration;
          }

          productModelAdd(addData).then(res => {
            if (res.err_CODE == 0) {
              this.$message.success(res.err_MESSAGE);
              this.$refs[formName].resetFields();
              this.reserData();
              this.getProData();
              this.addDialog = false;
            } else {
              this.$message.error(res.err_MESSAGE);
            }
          });
        } else {
          return false;
        }
      });
    },
    //新增产品
    addRoomName() {
      this.edit = false;
      this.addDialog = true;
    },
    //删除产品
    deleteModel(proId) {
      this.$confirm("删除后不可恢复，是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          productModelDelete({ ids: [proId] })
            .then(res => {
              if (res.err_CODE == 0) {
                this.tab_data = this.tab_data.filter(
                  item => item.productId !== proId
                );
                this.$message({
                  type: "success",
                  message: res.err_MESSAGE
                });
              } else {
                this.$message.error(res.err_MESSAGE);
              }
            })
            .catch(() => {});
        })
        .catch(() => {});
    },
    // 重置
    resetForm(formName) {
      if (!this.edit) {
        this.$confirm("是否放弃编辑?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          showClose: false
        }).then(() => {
          this.$refs.addForm.resetFields();
          this.reserData();
          this.addDialog = false;
        }).catch(() => {
          document.getElementsByClassName("v-modal")[0].style.display = "none";
          document.getElementsByClassName('el-dialog__wrapper')[0].style.background = "rgba(0,0,0,.2)";
        });
      } else {
        this.$confirm("是否放弃编辑?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          showClose: false
        }).then(() => {
          this.$refs.addForm.resetFields();
          this.reserData();
          this.editDialog = false;
        }).catch(() => {
          document.getElementsByClassName("v-modal")[0].style.display = "none";
          document.getElementsByClassName('el-dialog__wrapper')[1].style.background = "rgba(0,0,0,.2)";
        });
      }
    },
    //分页
    handleSizeChange(val) {
      this.page.pageSize = val;
      this.page.pageIndex = 1;
      this.getProData();
    },
    handleCurrentChange(val) {
      this.page.pageIndex = val;
      this.getProData();
    },
    getProData() {
      //获取列表数据
      let CID = null;
      if (this.selectedOptions.length == 1) {
        CID = this.selectedOptions[0];
      }
      let TID = null;
      if (this.selectedOptions.length == 2) {
        TID = this.selectedOptions[1];
      }
      let data = {
        productCategoryId: CID,
        productTypeId: TID,
        productName: this.page.templateIdOrName,
        classification: this.page.classiFication,
        labelId: this.page.selectLabelTypeLists[
          this.page.selectLabelTypeLists.length - 1
        ]
      };

      (data.pageIndex = this.page.pageIndex),
        (data.pageSize = this.page.pageSize);
      const loading = this.$loading({
        lock: true,
        target: document.querySelector('#productModel')
      });
      selectProType({ ...data })
        .then(res => {
          this.page.pageIndex = res.data.pageNum;
          this.page.pageSize = res.data.pageSize;
          let data = res.data;
          this.total = data.total;
          this.tab_data = data.list;
          loading.close()
          this.tab_data.forEach(v => {
            if (v.nodeType == 1) {
              v.nodeType = "网关";
            } else if (v.nodeType == 2) {
              v.nodeType = "设备";
            }
          });
        })
        .catch(() => {
         loading.close()
        });
    },
    // 产品名称搜索
    searchTemplate(productName) {
      let CID = null;
      if (this.selectedOptions.length == 1) {
        CID = this.selectedOptions[0];
      }
      let TID = null;
      if (this.selectedOptions.length == 2) {
        TID = this.selectedOptions[1];
      }
      let data = {
        productCategoryId: CID,
        productTypeId: TID,
        productName: productName,
        classification: this.page.classiFication,
        labelId: this.page.selectLabelTypeLists[
          this.page.selectLabelTypeLists.length - 1
        ],
        pageIndex: 1,
        pageSize: 10
      };
      selectProType({ ...data }).then(res => {
        let data = res.data;
        this.total = data.total;
        this.tab_data = data.list;
        this.tab_data.forEach(v => {
          if (v.nodeType == 1) {
            v.nodeType = "网关";
          } else if (v.nodeType == 2) {
            v.nodeType = "设备";
          }
        });
      });
    },
    // 新增类型切换
    plusProChange(val) {
      producTypeD({ productTypeId: val[val.length - 1].value }).then(res => {
        if (res.data.nodeType == 1) {
          this.addForm.plusNodeType = "网关";
        } else if (res.data.nodeType == 2) {
          this.addForm.plusNodeType = "设备";
          this.$set(this.addForm, "plusNodeType", "设备");

          this.$nextTick(() => {
            this.addForm.plusNodeType = "设备";
            this.$set(this.addForm, "plusNodeType", "设备");
          });
        }
      });
    }
  },
  computed: {
    ...mapGetters(["getCurrentCityId"])
  },
  watch: {}
};
</script> 
<style lang="scss" scoped>
@import "../../styles/new-index.scss";
#productTypeLength {
  .el-cascader {
    width: 100%;
  }
}
#dataRate {
  height: 59px;
  margin-bottom:0;
  .RateInputErr {
    line-height: 25px;
    margin: -8px 0 -8px 228px;
    color: #f56c6c;
    font-size: 12px;
  }
  .collectRateSelect {
    .el-input {
      color: #ffffff;
    }
  }
}
#productModel {
  padding: 10px 24px;
  background: $content-bgColor;
  position: relative;
  .spaceMA {
    z-index: 10;
    span {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 100%;
      transform: translate(-50%, -50%);
      text-align: center;
    }
  }
  .spaceMB {
    position: relative;
    z-index: 100;
    background: #fff;
    .codeTypeCont{
      font-size:12px;
      font-weight:600;
      color:rgba(50,50,50,1)
    }    
  }
  .select-container {
    color: $new-font-color;
    padding: 10px 0;
    display: flex;
    flex-direction: row;
    .el-button {
      padding: 8px 15px;
      border-radius: 2px;
      font-size: 12px;
      background: #0fadff;
    }
    .el-button:hover {
      background: rgba(15, 173, 255, 0.8);
    }
  }
  .table-container {
    overflow: auto;
    padding: 10px 0;
    .descEdit{
      cursor:pointer;
    }
  }
  .paging{
    margin-top:10px;
  }
}
</style>
<style lang="scss">
.plusProModel .el-form-item__error {
  width: 430px !important;
  line-height: 18px !important;
}
.collectRateInput {
  display: inline-block;
  width: 163px !important;
  height: 24px;
  .el-input__inner {
    width: 163px !important;
    height: 24px;
    padding: 0 2px !important;
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
    color: #ffffff;
  }
  .el-input__inner {
    width: 50px;
    height: 24px;
    padding: 0 0 0 5px !important;
    background: #1e2e4c;
    color: #ffffff;
  }
  .el-input__icon {
    width: 10px;
    line-height: 24px;
  }
}
.addProduct {
  .el-dialog__body {
    padding: 30px 40px 30px 20px !important;
  }
}
@import "../../styles/new-index.scss";
#productModel {
  background: $content-bgColor;
  .select-container {
    .el-cascader {
      padding-left: 10px;
      margin-right: 32px;
      width: 160px;
      .el-input {
        width: 160px;
        .el-input__inner {
          width: 160px;
        }
      }
      .el-input__inner {
        background: #d9eafb;
        border: 0;
        color: $new-font-color;
        border-radius: 2px;
        font-size: 12px;
      }
      .el-input__icon {
        line-height: 1;
      }
      .el-cascader__label {
        left: auto;
        color: $new-font-color;
      }
    }
    .el-select {
      padding-left: 10px;
      margin-right: 32px;
      width: 111px;
      .el-input__inner {
        width: 111px;
        background: #d9eafb;
        border: 0;
        color: $new-font-color;
        border-radius: 2px;
        font-size: 12px;
      }
      .el-input__icon {
        line-height: 1;
      }
    }
    .clacifi {
      width: 160px;
      .el-input {
        width: 160px;
        .el-input__inner {
          width: 160px;
        }
      }
    }
    .search {
      width: 160px;
      .el-input__inner {
        width: 160px;
        background: #d9eafb;
        border: 0;
        color: $new-font-color;
      }
    }
  }
  .table-container {
    .el-table {
      background: transparent !important;
      th {
        background: #ebf4fc;
        color: $new-font-color;
        text-align: center;
        font-size: 12px;
        border: none;
        border-right: 1px solid #fff;
        padding: 6.5px 0;
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
          .el-icon-delete {
            color: $y-color;
          }
        }
      }
    }
    .plusProModel {
      .el-dialog {
        min-height: 484px;
        .el-form {
          .el-form-item {
            padding-bottom: 10px;
            .collectRateRadio {
              margin-right: 2px;
              .el-radio__label {
                padding-left: 2px;
                font-size: 12px;
              }
            }
            .RateInputErr {
              margin: 0 0 -20px 205px;
              color: #cc3d3d;
            }
            .collectRateSelect {
              display: inline-block;
              width: 50px;
              height: 24px;
              margin-left: -6px;
              .el-input {
                width: 50px;
                height: 24px;
                color: #ffffff;
                .el-input__inner {
                  width: 50px;
                  height: 24px;
                  padding: 0 10px 0 5px;
                  background: #1e2e4c;
                  color: #ffffff;
                }
                .el-input__icon {
                  width: 10px;
                  line-height: 24px;
                }
              }
            }
            .el-form-item__label {
              line-height: 24px;
            }
            .el-form-item__content {
              line-height: 24px;
              .el-input {
                .el-form-item__error {
                  width: 430px !important;
                  line-height: 18px !important;
                }
              }
            }
            margin-bottom: 10px;
          }
          .el-form-item__label {
            text-align: left;
          }
          .el-input {
            width: 430px;
          }
          .el-input__inner {
            width: 430px;
          }
          textarea {
            width: 430px;
          }
          .proDescri {
            padding-top: 8px;
            .el-form-item__label {
              padding-left: 11px;
              line-height: 17px !important;
            }
          }
          .proDesC {
            .el-form-item__label {
              padding-left: 11px;
              line-height: 17px !important;
            }
          }
        }
      }
    }
  }
  .el-table::before {
    height: 0;
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