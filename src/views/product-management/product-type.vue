<template>
  <div id="product-typePage" :style="{minHeight: minHeight + 'px'}">
    <div class="spaceMA">
      <span>您没有产品类型管理的查看权限！</span>
    </div>
    <div
      class="spaceMB"
      :style="{minHeight: minHeightInner + 'px'}"
      v-fence="{data:'', functions:['查看产品类型列表、详情']}"
    >
      <div class="select-container">
        <el-col :span="16">
          选择类别
          <el-select
            v-model="page.productCategoryId"
            v-snap="page.productCategoryId"
            size="mini"
            @change="categoryChange(page.productCategoryId)"
          >
            <el-option
              v-for="(pro, index) in modelAndTypeArr"
              :key="index"
              :label="pro.categoryName"
              :value="pro.categoryId"
            ></el-option>
          </el-select>科技系统分类
          <el-select
            v-model="page.classiFication"
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
          </el-select>
          <el-input
            class="search"
            placeholder="产品类型名称"
            v-model="page.procutCategoryName"
            v-snap="page.procutCategoryName"
            size="mini"
            @keyup.native="searchTemplate(page.procutCategoryName)"
          >
            <i slot="suffix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-col>
        <el-col
          v-fence="{data:'', functions:['维护产品类型基本信息（新建，编辑，删除）']}"
          :span="8"
          class="typeCreate"
        >
          <el-button
            type="primary"
            class="typeButton"
            icon="el-icon-plus"
            @click="addRoomName"
          >新建产品类型</el-button>
        </el-col>
      </div>
      <div v-fence="{data:'', functions:['查看产品类型列表、详情']}" class="table-container">
        <template>
          <el-table :data="tab_data">
            <el-table-column prop="productTypeName" label="产品类型">
              <template slot-scope="scope">
                <router-link
                  :to="{path:'/productTypeDetail', query:{id:scope.row.productTypeId,temName:scope.row.productTypeName}}"
                  class="txt_underline"
                >{{scope.row.productTypeName}}</router-link>
              </template>
            </el-table-column>
            <el-table-column prop="nodeType" label="节点类型">
              <template
                slot-scope="scope"
              >{{scope.row.nodeType === 1 ? "网关" : scope.row.nodeType === 2 ? "设备" : "其他"}}</template>
            </el-table-column>
            <el-table-column prop="categoryDetails" label="产品类别"></el-table-column>
            <el-table-column prop="productModelCount" label="产品型号总数"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <span
                  v-fence="{data:'', functions:['维护产品类型基本信息（新建，编辑，删除）']}"
                  class="handCurser"
                >
                  <i
                    v-if="scope.row.productModelCount === 0"
                    class="el-icon-delete"
                    @click="deleteModel(scope.row.productTypeId)"
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
          class="addTypeLog"
          title="新建产品类型"
          :visible.sync="addDialog"
          :modal-append-to-body="false"
          width="576px"
          :before-close="resetForm"
          top="25vh"
        >
          <el-form :model="addForm" ref="addForm" :rules="addTmpRule" @submit.native.prevent>
            <el-form-item label="产品类型" prop="procutTypeName" label-width="80px">
              <el-input
                v-model.trim="addForm.procutTypeName"
                placeholder="支持汉字、字母、数字、-和_，必须以字母，汉字开头"
                size="mini"
              ></el-input>
            </el-form-item>
            <el-form-item
              class="productTypeLength"
              label="产品类别"
              prop="productCategoryId"
              label-width="80px"
            >
              <el-select v-model="addForm.productCategoryId" size="mini" placeholder="类别">
                <el-option
                  v-for="(pro, index) in addModelAndTypeArr"
                  :key="index"
                  :label="pro.categoryName"
                  :value="pro.categoryId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="节点类型" prop="nodeType" label-width="80px">
              <el-radio-group v-model="addForm.nodeType" size="mini">
                <el-radio :label="2">设备</el-radio>
                <el-radio :label="1">网关</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="描述" prop="desc" label-width="80px">
              <el-input
                type="textarea"
                size="mini"
                resize="none"
                maxlength="100"
                :autosize="{ minRows: 6, maxRows: 10}"
                placeholder="0-100个字符"
                v-model.trim="addForm.desc"
              ></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="resetForm()">取消</el-button>
            <el-button type="primary" @click="formPost()">确定</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>
import {
  productTypeList, // 产品类型列表查询
  productTypeAdd, // 新增类型
  productTypeDelete, //删除类型
  selectCategoryList, // 产品类别下拉
  getClassification // 科技系统分类
} from "../../api/api.js";
import { mapActions, mapGetters } from "vuex"; //全局城市选择

export default {
  name: "product-typePage",
  data() {
    return {
      minHeight: null,
      minHeightInner: null,
      addDialog: false, //新增产品类型
      //新增产品类型
      addForm: {
        procutTypeName: "", //产品类型
        productCategoryId: null, //产品类别
        nodeType: 2, //节点类型
        desc: "" //备注
      },
      //新增产品类型规则
      addTmpRule: {
        procutTypeName: [
          {
            pattern: /^[a-zA-Z\u4e00-\u9fa5][a-zA-Z0-9\u4e00-\u9fa5\-\_]{0,14}$/,
            required: true,
            message:
              "1-15个字符(支持汉字、字母、数字、-和_，必须以字母，汉字开头)",
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
            required: true
          }
        ],
        desc: [
          {
            message: "0-100个字符"
          }
        ]
      },
      tab_data: [], //产品类型列表
      total: 0, //当前数据总数
      modelAndTypeArr: [], // 类别、类型下拉框
      classiFicationArr: [], // 科技系统分类下拉框
      addModelAndTypeArr: [], //新增产品类别列表
      //分页参数
      page: {
        productCategoryId: null,
        procutCategoryName: null,
        classiFication: null,
        pageIndex: 1,
        countryId:null,
        cityId:null,
        provinceId:null,
        pageSize: 10
      }
    };
  },
  mounted() {
    this.minHeight = window.innerHeight - 95;
    this.minHeightInner = window.innerHeight - 195;
    this.getSelect();
  },
  methods: {
    // 获取类型列表
    getSelect() {
      getClassification().then(res => {
        let data = res.data.data;
        this.classiFicationArr = [{ code: null, name: "全部" }, ...data];
      });
      selectCategoryList().then(res => {
        let data = res.data.data;
        this.modelAndTypeArr = [
          { categoryId: null, categoryName: "全部" },
          ...data
        ];
        this.addModelAndTypeArr = data;
        this.getData();
      });
    },
    //产品类型列表
    getData() {
     const loading = this.$loading({
        lock: true,
        target: document.querySelector('#product-typePage')
      });
      productTypeList({ ...this.page })
        .then(res => {
          this.page.pageIndex = res.data.pageNum;
          this.page.pageSize = res.data.pageSize;
          let data = res.data;
          this.tab_data = data.list;
          this.total = data.total;
          loading.close()
        })
        .catch(() => {
         loading.close()
        });
    },
    // 新建产品类型
    formPost() {
      this.$refs["addForm"].validate(valid => {
        if (valid) {
          productTypeAdd(this.addForm).then(res => {
            if (res.err_CODE == 0) {
              this.$message.success(res.err_MESSAGE);
              this.$refs["addForm"].resetFields();
              this.getData();
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
    //新增产品类型
    addRoomName() {
      this.edit = false;
      this.addDialog = true;
    },
    //删除产品类别
    deleteModel(productTypeId) {
      this.$confirm("删除后不可恢复，是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          productTypeDelete({
            productTypeIds: [productTypeId]
          }).then(res => {
            if (res.err_CODE === 0) {
              this.getData();
              this.$message({
                type: "success",
                message: res.err_MESSAGE
              });
            } else {
              this.$message.error(res.err_MESSAGE);
            }
          });
        })
        .catch(err => {});
      return productTypeId;
    },
    // 重置
    resetForm(formName) {
      if (!this.edit) {
        this.$confirm("是否放弃编辑?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          showClose: false
        })
          .then(() => {
            this.$refs.addForm.resetFields();
            this.addDialog = false;
          })
          .catch(() => {
            document.getElementsByClassName("v-modal")[0].style.display = "none";
            document.getElementsByClassName('el-dialog__wrapper')[0].style.background = "rgba(0,0,0,.2)";
          });
      } else {
        this.$confirm("是否放弃编辑?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          showClose: false
        })
          .then(() => {
            this.$refs.editForm.resetFields();
            this.editDialog = false;
          })
          .catch(() => {
            document.getElementsByClassName("v-modal")[0].style.display = "none";
            document.getElementsByClassName('el-dialog__wrapper')[1].style.background = "rgba(0,0,0,.2)";
          });
      }
    },
    //选择类别
    categoryChange(val) {
      this.getData();
    },
    //科技系统分类选择
    classiFicationChange(val) {
      this.getData();
    },
    //产品类型搜索
    searchTemplate(val) {
      this.$nextTick(function() {
        this.page.productTypeName = val;
        this.pageIndex = 1;
        this.getData();
      });
    },
    //分页切换
    handleSizeChange(val) {
      this.page.pageSize = val;
      this.page.pageIndex = 1;
      this.getData();
    },
    handleCurrentChange(val) {
      this.page.pageIndex = val;
      this.getData();
    },
    listen(event) {
      if (event.keyCode === 13) {
        event.preventDefault(); // 阻止浏览器默认换行操作
        return false;
      }
    }
  },
  computed: {
    ...mapGetters(["getCurrentCityId"])
  },
  watch: {
    //获取全局城市
    getCurrentCityId:{
      handler: function(newVal, oldVal){
        if (newVal !== oldVal) {
        this.page.countryId = newVal[0] || null;
        this.page.provinceId = newVal[1] || null;
        this.page.cityId = newVal[2] || null;
        this.page.pageNum = 1;
        this.getSelect();
      }
      },
    	// 深度观察监听
      deep: true
    }
  }
};
</script> 
<style lang="scss" scoped>
@import "../../styles/new-index.scss";
#product-typePage {
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
    .typeCreate{
      text-align:right;
      .typeButton{
        border:none;
      }
    }
  }
  .table-container {
    overflow: auto;
    padding: 10px 0;
    .handCurser{
      cursor: pointer;
    }
  }
  .paging{
    margin-top:10px;
  }
}
</style>
<style lang="scss">
.productTypeLength {
  .el-select {
    width: 100%;
  }
}
.addTypeLog {
  .el-dialog__body {
    padding: 30px 40px 30px 20px !important;
  }
}
@import "../../styles/new-index.scss";
#product-typePage {
  background: $content-bgColor;
  .el-radio__input.is-checked + .el-radio__label {
    color: $new-font-color;
  }
  .select-container {
    .el-select {
      padding-left: 10px;
      margin-right: 20px;
      width: 160px;
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
    }
    .el-cascader {
      width: 160px;
      margin-right: 20px;
      .el-input {
        .el-input__inner {
          background: #d9eafb;
          border: 0;
          border-radius: 2px;
          font-size: 12px;
        }
      }
      .el-cascader__label {
        color: $new-font-color;
        span {
          color: $new-font-color;
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
  .el-table {
    background: transparent !important;
    th {
      background: $new-table-back;
      color: $new-font-color;
      text-align: center;
      font-size: 12px;
      border: none;
      border-right: 1px solid $content-bgColor;
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
  .el-table::before {
    height: 0;
  }
  .el-form {
    .el-form-item {
      margin-bottom: 10px;
    }
    .el-form-item__label {
      text-align: center;
    }
    .el-input {
      width: 430px;
    }
    .el-input__inner {
      width: 430px;
    }
    .el-form-item__error {
      padding-top: 0;
      white-space: nowrap;
    }
    textarea {
      width: 430px;
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
    color: $content-bgColor;
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