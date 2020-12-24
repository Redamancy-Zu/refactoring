<template>
  <div id="product-label" :style="{minHeight: minHeight + 'px'}">
    <div class="spaceMA">
      <span>您没有产品标签管理的查看权限！</span>
    </div>
    <div
      class="spaceMB"
      :style="{minHeight: minHeightInner + 'px'}"
      v-fence="{data:'', functions:['查看产品标签']}"
    >
      <div class="select-container">
        <el-col :span="16">
          选择产品标签分类
          <el-select v-model="page.labelTypeId" size="mini" @change="getData">
            <el-option
              v-for="(label, index) in productLabelTypeArr"
              :key="index"
              :label="label.name"
              :value="label.code"
            ></el-option>
          </el-select>
        </el-col>
        <el-col
          v-fence="{data:'', functions:['维护产品标签（新建，编辑，删除）']}"
          :span="8"
          class="labelPostion"
        >
          <el-button type="primary" class="createLabel" icon="el-icon-plus" @click="addLabel">新建标签</el-button>
        </el-col>
      </div>
      <div class="table-container">
        <template>
          <el-table :data="tab_data">
            <el-table-column prop="labelName" label="产品标签名称"></el-table-column>
            <el-table-column prop="labelTypeName" label="产品标签分类"></el-table-column>
            <el-table-column prop="count" label="使用数量"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <span v-fence="{data:'', functions:['维护产品标签（新建，编辑，删除）']}">
                  <span class="editOld">
                    <i class="el-icon-edit" @click="editLabel(scope.row)"></i>
                  </span>
                  <span class="deleteBtn" v-if="scope.row.count === 0">
                    <i
                      class="el-icon-delete"
                      @click="deleteLabel(scope.row.labelId)"
                    ></i>
                  </span>
                  <span v-else class="editNow"></span>
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
        <!-- dialog 新增/编辑 -->
        <el-dialog
          class="productLabLog"
          :title="formTitle"
          :visible.sync="labelDialog"
          :modal-append-to-body="false"
          width="596px"
          :before-close="resetForm"
          top="30vh"
        >
          <el-form :model="labelForm" ref="labelForm" :rules="tmpRule" @submit.native.prevent>
            <el-form-item label="产品标签分类" prop="labelTypeId" label-width="100px">
              <el-select v-model="labelForm.labelTypeId" size="mini" placeholder="请选择产品标签分类">
                <el-option
                  v-if="label.code > 0"
                  v-for="(label, index) in productLabelTypeArr"
                  :key="index"
                  :label="label.name"
                  :value="label.code"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="产品标签名称" prop="labelName" label-width="100px">
              <el-input v-model.trim="labelForm.labelName" placeholder="1-10个字符" size="mini"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="resetForm()">取消</el-button>
            <el-button type="primary" @click="formPost('addForm')">确定</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getProductLabelTypeArr, //产品标签分类数据
  getProductLabelList, //列表数据
  addProductLabel, //新增标签
  updateProductLabel, //最新标签列表
  deleteProductLabel //删除标签
} from "../../api/api.js";

export default {
  name: "product-label",
  data() {
    return {
      minHeight: null,
      minHeightInner: null,
      tab_data: [], //列表数据
      total: 0, //数据总数
      productLabelTypeArr: [], //标签分类下拉数据
      page: {  //分页
        labelTypeId: null,
        pageIndex: 1,
        pageSize: 10
      },
      edit: false, //编辑产品标签
      formTitle: "", //新增/编辑标题
      labelDialog: false, //新增产品标签
      labelForm: { //新增产品标签数据绑定
        labelId: null,
        labelTypeId: null,
        labelName: ""
      },
      oldForm: {}, //初始编辑标签
      tmpRule: {
        labelTypeId: [
          {
            required: true,
            message: "请选择产品标签分类",
            trigger: "change"
          }
        ],
        labelName: [
          {
            required: true,
            min: 1,
            max: 10,
            message: "1-10个字符",
            trigger: "blur"
          }
        ]
      }
    };
  },
  mounted() {
    this.minHeight = window.innerHeight - 95;
    this.minHeightInner = window.innerHeight - 195;
    this.getSelect(); //产品标签列表
  },
  methods: {
    //产品标签分类
    getSelect() {
      getProductLabelTypeArr().then(res => {
        let data = res.data.data;
        this.productLabelTypeArr = [{ code: null, name: "全部" }, ...data];
      });
      this.getData();
    },
    //列表数据
    getData() {
      const loading = this.$loading({
        lock: true,
        target: document.querySelector('#product-label')
      });
      getProductLabelList(this.page)
        .then(res => {
          let data = res.data.data.list;
          this.total = res.data.data.total;
          this.tab_data = [...data];
          loading.close()
        })
        .catch(() => {
          loading.close()
        });
    },
    addLabel() {
      //新建标签
      this.edit = false;
      this.formTitle = "新建产品标签"; 
      this.labelDialog = true;
    },
    //删除产品标签
    deleteLabel(labelIdT) {
      this.$confirm("删除后不可恢复，是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(() => {
        deleteProductLabel({
          productModelLabelId: labelIdT
        }).then(res => {
          if (res.err_CODE === 0) {
            this.tab_data = this.tab_data.filter(
              item => item.labelId !== labelIdT
            );
            this.$message.success(res.err_MESSAGE);
            this.labelDialog = false;
          } else {
            this.$message.error(res.err_MESSAGE);
          }
        });
      });
    },
    editLabel(row) {
      //编辑标签
      this.edit = true;
      this.formTitle = "编辑产品标签";
      this.oldForm = JSON.parse(JSON.stringify(this.labelForm));
      this.labelDialog = true;
      this.labelForm = {
        labelId: row.labelId,
        labelTypeId: row.labelTypeId,
        labelName: row.labelName
      };
    },
    handleSizeChange(val) {
      this.page.pageSize = val;
      this.page.pageIndex = 1;
      this.getData();
    },
    handleCurrentChange(val) {
      this.page.pageIndex = val;
      this.getData();
    },
    //取消编辑
    resetForm() {
      this.$refs.labelForm.resetFields();
      this.labelDialog = false;
      this.labelForm = {
        labelId: null,
        labelTypeId: null,
        labelName: ""
      };
    },
    //新建标签
    formPost() {
      this.$refs.labelForm.validate(valid => {
        if (valid) {
          if (this.edit) {
            updateProductLabel(this.labelForm).then(res => {
              if (res.err_CODE === 0) {
                this.$message.success(res.err_MESSAGE);
                this.$refs.labelForm.resetFields();

                this.getData();
                this.labelDialog = false;
                this.labelForm = {
                  labelId: null,
                  labelTypeId: null,
                  labelName: ""
                };
              } else {
                this.$message.error(res.err_MESSAGE);
              }
            });
          } else {
            addProductLabel(this.labelForm).then(res => {
              if (res.err_CODE === 0) {
                this.$message.success(res.err_MESSAGE);
                this.$refs.labelForm.resetFields();
                this.labelForm = {
                  labelId: null,
                  labelTypeId: null,
                  labelName: ""
                };
                this.getData();
                this.labelDialog = false;
              } else {
                this.$message.error(res.err_MESSAGE);
              }
            });
          }
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../styles/new-index.scss";
#product-label {
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
  }
  .table-container {
    overflow: auto;
    padding: 10px 0;
    .editNow{
      display:inline-block;
      width:12px;
      height:12px;
    }
    .editOld{
      cursor:pointer;
      margin-right:15px;
      .el-icon-edit {
        color:#AF7C58;
      }
    }
    .deleteBtn {
      cursor:pointer;
      .el-icon-delete{
        color:#AF7C58;
      }
    }
  }
  .paging {
    margin-top:10px;
  }
}
</style>
<style lang="scss">
.productLabLog {
  .el-dialog__body {
    padding: 30px 40px 30px 20px !important;
  }
}
@import "../../styles/new-index.scss";
#product-label {
  background: $content-bgColor;
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
    .createLabel{
      border:none;
    }
    .labelPostion{
      text-align:right;
    }
  }
  .el-table {
    background: transparent !important;
    tbody .el-table--enable-row-hover .el-table__body tr:hover > td {
      background-color: transparent !important;
    }
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
