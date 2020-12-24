<template>
  <div id="product-genre" :style="{minHeight: minHeight + 'px'}">
    <div class="spaceMA">
      <span>您没有产品类别管理的查看权限！</span>
    </div>
    <div
      class="spaceMB"
      :style="{minHeight: minHeightInner + 'px'}"
      v-fence="{data:'', functions:['查看产品类别列表']}"
    >
      <div class="select-container">
        <el-col
          v-fence="{data:'', functions:['维护产品类别基本信息（新建、编辑、删除）']}"
          :span="24"
          class="select-Style"
        >
          <el-button type="primary" class="add-Button" icon="el-icon-plus" @click="addGenre">新建类别名称</el-button>
        </el-col>
      </div>
      <div class="table-container">
        <template>
          <el-table :data="tb_data">
            <el-table-column prop="productCategoryName" label="类别名称">
              <template slot-scope="scope">
                <img
                  class="productCateImg"
                  v-if="scope.row.pictureUrl"
                  :src="scope.row.pictureUrl"
                />
                <span class="projectNams">{{scope.row.productCategoryName}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="classificationName" label="科技系统分类"></el-table-column>
            <el-table-column prop="productTypeCount" label="产品类型数量"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <span v-fence="{data:'', functions:['维护产品类别基本信息（新建、编辑、删除）']}">
                  <span class="editPorduct">
                    <i class="el-icon-edit" @click="editName(scope.row)"></i>
                  </span>
                  <span class="couserDelete" v-if="scope.row.productTypeCount === 0">
                    <i class="el-icon-delete" @click="deleteModel(scope.row.productCategoryId)"></i>
                  </span>
                  <span class="deleteIcon" v-else></span>
                </span>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <div class="paging fr">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="page.pageNum"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="page.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            v-if="total"
          ></el-pagination>
        </div>
        <!-- dialog 新增 -->
        <el-dialog
          class="addTypeName"
          title="新建类别名称"
          :visible.sync="addDialog"
          :modal-append-to-body="false"
          width="576px"
          :before-close="resetForm"
          top="27vh"
        >
          <el-form
            :model="addForm"
            ref="addForm"
            :rules="addTmpRule"
            label-width="98px"
            @submit.native.prevent
          >
            <el-form-item label="产品类别名称" prop="productCategoryName">
              <el-input
                v-model.trim="addForm.productCategoryName"
                placeholder="支持汉字、字母、数字、-和_，必须以汉字，字母开头"
                size="mini"
              ></el-input>
            </el-form-item>
            <el-form-item
              class="typeIcon"
              label="产品类别图标"
              prop="pictureUrl"
            >
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
                    placeholder="例：项目/iconA"
                    size="mini"
                  ></el-input>
                </el-tooltip>
                <el-button size="mini" type="primary">浏览</el-button>
              </el-upload>
              <el-popover
                class="fileIcon"
                placement="top"
                width="240"
                trigger="hover"
                content="文件大小 &lt; 200KB；图片格式必须为: bmp、png、 jpeg、jpg、gif"
              >
                <i slot="reference" class="el-icon-warning"></i>
              </el-popover>
            </el-form-item>
            <el-form-item label="科技系统分类" prop="classification">
              <el-radio-group v-model="addForm.classification" size="mini">
                <el-radio :label="3">智能家居(非科技系统)</el-radio>
                <el-radio :label="1">分户式</el-radio>
                <el-radio :label="2">集中式</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="resetForm('addForm')">取消</el-button>
            <el-button type="primary" @click="formPost('addForm')">确定</el-button>
          </span>
        </el-dialog>
        <!-- dialog 修改 -->
        <el-dialog
          class="addTypeName"
          title="编辑类别名称"
          :visible.sync="editDialog"
          :modal-append-to-body="false"
          width="596px"
          :before-close="resetForm"
          top="27vh"
        >
          <el-form
            :model="editForm"
            ref="editForm"
            :rules="editTmpRule"
            label-width="98px"
            @submit.native.prevent
            label-position="right"
          >
            <el-form-item label="产品类别名称" prop="productCategoryName">
              <el-input
                v-model.trim="editForm.productCategoryName"
                placeholder="支持汉字、字母、数字、-和_，必须以汉字，字母开头"
                size="mini"
              ></el-input>
            </el-form-item>
            <el-form-item label="产品类别图标" prop="pictureUrl">
              <el-upload
                id="edmitIcon"
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
                <input type="hidden" v-model="editForm.pictureUrl" />
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
                    placeholder="例：项目/iconA"
                    size="mini"
                    style="margin-left:-18px;"
                  ></el-input>
                </el-tooltip><el-button size="mini" type="primary">浏览</el-button>
              </el-upload>
              <!--<p class="tip">文件大小 &lt; 200KB；图片格式必须为: bmp、png、 jpeg、jpg、gif</p>-->
              <el-popover
                id="iconTap"
                placement="top"
                width="240"
                trigger="hover"
                content="文件大小 &lt; 200KB；图片格式必须为: bmp、png、 jpeg、jpg、gif"
              >
                <i slot="reference" class="el-icon-warning"></i>
              </el-popover>
            </el-form-item>
            <el-form-item label="科技系统分类" prop="classification">
              <span class="classificationes">{{getClassficationName(editForm.classification)}}</span>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="resetForm('editForm')">取消</el-button>
            <el-button type="primary" @click="formPost('editForm')">确定</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>
import {
  getProductGenreData, //获取产品类别管列表数据
  addProductGenre, // 新建类别名称
  updateProductGenre, // 编辑类别名称
  deleteProductGenre //删除类别名称
} from "../../api/api.js";
import { mapActions, mapGetters } from "vuex"; //全局城市
import ossUpload from "../../labs/upload.js"; //文件上传

export default {
  name: "product-genre",
  data() {
    return {
      minHeight: null,
      minHeightInner: null,
      addDialog: false,
      editDialog: false,
      fileName: "", //产品图标名
      edit: false, //编辑状态
      addForm: {
        pictureUrl: null, //产品类别图标
        classification: 3, //新增科技系统分类
        productCategoryName: "" //产品类别名称
      },
      editForm: {},
      oldForm: {},
      //新增产品类别
      addTmpRule: {
        productCategoryName: [
          {
            required: true,
            message:
              "1-10个字符(支持汉字、字母、数字、-和_，必须以汉字，字母开头)",
            pattern: /^[a-zA-Z\u4e00-\u9fa5][a-zA-Z0-9\u4e00-\u9fa5\-\_]{0,9}$/,
            trigger: "blur"
          }
        ],
        pictureUrl: [
          {
            trigger: "change"
          }
        ],
        classification: [
          {
            required: true
          }
        ]
      },
      //编辑产品类别
      editTmpRule: {
        productCategoryName: [
          {
            required: true,
            message:
              "1-10个字符(支持汉字、字母、数字、-和_，必须以汉字，字母开头)",
            pattern: /^[a-zA-Z\u4e00-\u9fa5][a-zA-Z0-9\u4e00-\u9fa5\-\_]{0,9}$/,
            trigger: "blur"
          }
        ],
        pictureUrl: [
          {
            trigger: "change"
          }
        ],
        classification: [
          {
            required: true
          }
        ]
      },
      tb_data: [], //产品类别列表
      total: 0, //产品数据总数
      page: {
        //分页器
        pageNum: 1,
        pageSize: 10
      }
    };
  },
  mounted() {
    this.minHeight = window.innerHeight - 95;
    this.minHeightInner = window.innerHeight - 195;
    this.getData();
  },
  methods: {
    cancel() {
      this.$emit("uploadStatus", false);
    },
    // 获取产品类别管理列表
    getData() {
      let self = this;
      const loading = this.$loading({
        lock: true,
        target: document.querySelector('#product-genre')
      });
      getProductGenreData({
        pageSize: self.page.pageSize,
        pageNum: self.page.pageNum
      })
        .then(res => {
          if (res.data.err_CODE == 0) {
            let data = res.data.data;
            this.tb_data = data.list;
            this.total = data.total;
            loading.close()
          }
        })
        .catch(() => {
          loading.close()
        });
    },
    // 新增空间名称
    formPost(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.edit) {
            if (
              this.oldForm.productCategoryName ==
                this.editForm.productCategoryName &&
              this.oldForm.pictureUrl == this.editForm.pictureUrl
            ) {
              this.editDialog = false;
              return;
            }
            updateProductGenre(this.editForm).then(res => {
              if (res.err_CODE == 0) {
                this.fileName = "";
                this.oldForm = {};
                this.$message.success(res.err_MESSAGE);
                this.getData();
                this.editDialog = false;
              } else if (res.err_CODE == 4001) {
                this.$message.error(res.err_MESSAGE);
              } else {
                this.$message.error(res.err_MESSAGE);
              }
            });
          } else {
            addProductGenre(this.addForm).then(res => {
              if (res.err_CODE == 0) {
                this.fileName = "";
                this.$message.success(res.err_MESSAGE);
                this.$refs[formName].resetFields();
                this.getData();
                this.addDialog = false;
              } else if (res.err_CODE == 4001) {
                this.$message.error(res.err_MESSAGE);
              } else {
                this.$message.error(res.err_MESSAGE);
              }
            });
          }
        } else {
          return false;
        }
      });
    },
    //新增产品类别
    addGenre() {
      this.edit = false;
      this.addDialog = true;
    },
    //编辑产品类别
    editName(row) {
      this.edit = true;
      this.editForm = {
        productCategoryId: row.productCategoryId,
        pictureUrl: row.pictureUrl,
        classification: row.classification,
        productCategoryName: row.productCategoryName
      };
      this.oldForm = JSON.parse(JSON.stringify(this.editForm));
      this.fileName = row.pictureUrl;
      this.editDialog = true;
    },
    //科技系统分类
    getClassficationName(id) {
      if (id === 1) {
        return "分户式";
      } else if (id === 2) {
        return "集中式";
      } else {
        return "智能家居(非科技系统)";
      }
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
            this.fileName = "";
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
            this.oldForm = {};
            this.fileName = "";
            this.$refs.editForm.resetFields();
            this.editDialog = false;
          })
          .catch(() => {
            document.getElementsByClassName("v-modal")[0].style.display = "none";
            document.getElementsByClassName('el-dialog__wrapper')[1].style.background = "rgba(0,0,0,.4)";
          });
      }
    },
    //分页change
    handleSizeChange(val) {
      this.page.pageSize = val;
      this.page.pageNum = 1;
      this.getData();
    },
    handleCurrentChange(val) {
      this.page.pageNum = val;
      this.getData();
    },
    //删除产品类别
    deleteModel(id) {
      this.$confirm("删除后不可恢复，是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          deleteProductGenre({
            productCategoryId: id
          })
            .then(res => {
              if (res.err_CODE === 0) {
                this.tb_data = this.tb_data.filter(
                  item => item.productCategoryId !== id
                );
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
    uploadImage(option) {
      ossUpload.ossUploadFile(option);
    },
    //上传图标
    beforeAvatarUpload(file) {
      var testmsg = /^image\/(jpeg|png|jpg|gif|bmp)$/.test(file.type);
      const isLt5M = file.size / 1024 < 200; //图片大小不超过200kb
      if (!testmsg) {
        this.$message.error("图片格式必须为：bmp，png，jpeg，jpg，gif!");
        return false;
      }
      if (!isLt5M) {
        this.$message.error("上传图片大小不能超过200kb!");
        return false;
      }
    },
    // 获取上传成功的图片地址
    handleAvatarSuccess(res, file) {
      this.fileName = file.name;
      if (this.edit == true) {
        this.editForm.pictureUrl = res.res.requestUrls[0];
      } else {
        this.addForm.pictureUrl = res.res.requestUrls[0];
      }
      this.$message.success("上传成功");
    },
    uploadError() {
      this.$message.error("上传失败，请重新上传");
    }
  },
  computed: {
    ...mapGetters(["getCurrentCityId"])
  }
};
</script>
<style lang="scss" scoped>
@import "../../styles/new-index.scss";
#product-genre {
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
    .select-Style{
      text-align:right;
      .add-Button{
        border:none;
      }
    }
  }
  .table-container {
    overflow: auto;
    padding: 10px 0;
    .el-icon-edit {
      color: $y-color;
    }
    .el-icon-delete {
      color: $y-color;
    }
    .productCateImg{
      width:15px;
      height:15px;
      vertical-align:middle;
      .projectNams{
        margin-left:4px;
      }
    }
    .couserDelete{
      cursor:pointer;
    }
    .editPorduct{
      cursor:pointer;
      margin-right:15px;
    }
    .deleteIcon{
      display:inline-block;
      width:12px;
      height:12px;
    }
    .classificationes{
      font-size:12px;
      color:#323232;
      font-weight:bold;
    }
  }
  .paging{
    margin-top:10px;
  }
}
</style>
<style lang="scss">
.addTypeName {
  .upload-demo{
    display:inline-block;
  }
  .el-dialog__body {
    padding: 30px 40px 30px 20px !important;
    #edmitIcon {
    float: left;
    .filename {
      width: 342px !important;
      margin-left: -10px !important;
    }
  }
  }
  .item{
    display:inline-block;
  }
}
.typeIcon {
  .el-upload {
    width: 400px !important;
    overflow: hidden;
    margin-left: -10px !important;
    .filename {
      float: left !important;
      width: 342px !important;
    }
    .el-button {
      float: left !important;
      margin-top: 5px;
    }
  }
  .fileIcon {
    float: right !important;
    color:#d8d8d8 !important;
    cursor:pointer;
  }
}
#iconTap {
  margin-left: 5px !important;
  color:#d8d8d8;
  cursor:pointer;
}
@import "../../styles/new-index.scss";
#product-genre {
  background: $content-bgColor;
  // radio选中文字颜色
  .el-radio__input.is-checked + .el-radio__label {
    color: #323232;
  }
  .select-container {
    .el-select {
      padding-left: 10px;
      width: 130px;
      .el-input__inner {
        background: #25426b;
        border: 0;
        color: #ffffff;
        border-radius: 2px;
        font-size: 12px;
      }
      .el-input__icon {
        line-height: 1;
      }
    }
    .search {
      width: 160px;
      .el-input__inner {
        width: 160px;
        background: #25426b;
        border: 0;
      }
    }
  }
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
      }
    }
  }
  .el-table::before {
    height: 0;
  }
  .el-form {
    .tip {
      font-size: 12px;
      line-height: 1.2;
      color: #adadad;
    }
    .el-form-item {
      height: 45px;
    }
    .el-form-item__label {
      text-align: right;
    }
    .el-input__inner {
      width: 406px;
    }
    .upload-demo .el-input__inner {
      width: 386px;
    }

    .el-form-item__error {
      white-space: nowrap;
    }

    .el-radio__label {
      font-size: 12px;
    }

    .upload-demo {
      .el-input {
        width: 326px;
      }
      .el-input__inner {
        width: 326px;
      }
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
