<template>
  <div id="proSet" :style="{minHeight: minHeight + 'px'}">
    <div class="proSetA">
      <span>您没有项目配置的查看权限！</span>
    </div>
    <div
      :style="{minHeight: minHeightInner + 'px'}"
      class="tb-container"
      v-fence="{data:'', functions:['查看项目配置列表']}"
    >
      <template>
        <el-table :data="tb_data" ref="spaceTable">
          <el-table-column prop="projectName" label="金茂项目名称"></el-table-column>
          <el-table-column prop="area" label="所属区域"></el-table-column>
          <el-table-column label="设置AD Project code">
            <template slot-scope="scope">
              <span
                v-fence="{data:'', functions:['设置AD project code']}"
                class="el_fit"
                v-if="scope.row.projectCode == null"
                @click="fitHandel(scope.row)"
              >设置</span>
              <span class="projectHide" v-else>
                <span class="projectCodes">{{scope.row.projectCode}}</span>
                <span
                  v-fence="{data:getCurrentPermission(scope.row.projectName), functions:['设置AD project code']}"
                  class="projectClick"
                >
                  <i class="el-icon-edit" @click="fitHandel(scope.row)"></i>
                </span>
                <span
                  v-fence="{data:getCurrentPermission(scope.row.projectName), functions:['设置AD project code']}"
                  class="projectClick"
                >
                  <i class="el-icon-delete" @click="deleteProFit(scope.row)"></i>
                </span>
              </span>
            </template>
          </el-table-column>
        </el-table>
      </template>

      <div class="paging fr" v-snap="iotDeviceParam.pageIndex">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="iotDeviceParam.pageIndex"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="iotDeviceParam.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageParams.total"
          v-if="pageParams.total"
        ></el-pagination>
      </div>
      <el-dialog
        :modal-append-to-body="false"
        title="设置"
        :visible.sync="editDialog"
        width="576px"
        :before-close="resetForm"
        top="36vh"
      >
        <el-form
          :model="editForm"
          ref="editForm"
          :rules="editTmpRule "
          @submit.native.prevent
          label-position="right"
        >
          <el-form-item label="AD Project code" prop="projectCode" label-width="109px">
            <el-input
              maxlength="50"
              v-model.trim="editForm.projectCode"
              placeholder="1-50个字符"
              size="mini"
            ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="resetForm('editForm')">取消</el-button>
          <el-button type="primary" @click="formPost('editForm')">确定</el-button>
        </span>
      </el-dialog>
      
      <el-dialog
        :modal-append-to-body="false"
        title="确认删除"
        :visible.sync="editDialogD"
        width="576px"
        :before-close="resetFormD"
        top="36vh"
        class="el_dialog_del"
        id="sure_del"
      >
        <el-form @submit.native.prevent label-position="right">
          <span class="deleHandle">删除后，该项目将无法发现及绑定该厂商的设备，是否确认删除？</span>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="resetFormD">取消</el-button>
          <el-button @click="formPostD">确定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { getDate } from "../../labs/tools.js";
import { settingList, pUpdateCode, pDeleteCode } from "../../api/api.js";
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      minHeight: 0,
      minHeightInner: 0,
      plusData: null, //AD设备状态
      tb_data: [], //项目配置列表
      iotDeviceParam: { //分页
        pageIndex: 1,
        pageSize: 10
      },
      pageParams: { //数据总数
        total: 0
      },
      editForm: { //编辑AD状态
        projectCode: null
      },
      editTmpRule: { //编辑AD状态规则
        projectCode: [
          {
            min: 1,
            max: 50,
            required: true,
            message: "1-50个字符",
            trigger: "blur"
          }
        ]
      },
      editDialog: false,
      editDialogD: false
    };
  },
  mounted() {
    this.minHeight = window.innerHeight - 95;
    this.minHeightInner = window.innerHeight - 195;
    this.iotDeviceParam.countryId = this.getCurrentCityId[0] || null;
    this.iotDeviceParam.provinceId = this.getCurrentCityId[1] || null;
    this.iotDeviceParam.cityId = this.getCurrentCityId[2] || null;
    this.selectA(); //项目配置列表
  },
  computed: {
    ...mapGetters(["getCurrentCityId"])
  },
  watch: {
    // 获取全局城市
    getCurrentCityId: {
      handler: function(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.iotDeviceParam.countryId = newVal[0] || null;
          this.iotDeviceParam.provinceId = newVal[1] || null;
          this.iotDeviceParam.cityId = newVal[2] || null;
          this.iotDeviceParam.pageIndex = 1;
          this.selectA();
        }
      },
      // 深度观察监听
      deep: true
    }
  },
  methods: {
    // 分页单页条数改变
    handleSizeChange(val) {
      this.iotDeviceParam.pageSize = val;
      this.iotDeviceParam.pageIndex = 1;
      this.selectA();
    },

    // 分页当前页数改变
    handleCurrentChange(val) {
      this.iotDeviceParam.pageIndex = val;
      this.selectA();
    },
    // 列表
    selectA() {
      const loading = this.$loading({
        lock: true,
        target: document.querySelector('#proSet')
      });
      settingList(this.iotDeviceParam)
        .then(res => {
          if (res.data !== null) {
            if (res.data.list) {
              res.data.list.forEach(item => {
                item.area = `${item.provinceName}/${item.cityName}`;
              });
              this.tb_data = res.data.list;
             loading.close()
            }
            this.pageParams.total = res.data.total;
          }
        })
        .catch(() => {
         loading.close()
        });
    },
    fitHandel(item) {
      // 设置
      this.editDialog = true;
      this.plusData = item;
      this.editForm.projectCode = item.projectCode;
    },
    resetForm() {
      //取消
      this.editDialog = false;
      setTimeout(() => {
        this.$refs.editForm.resetFields();
      }, 600);
    },
    formPost(formName) {
      //确认
      this.$refs[formName].validate(valid => {
        if (valid) {
          let obj = {
            projectId: this.plusData.projectId,
            projectCode: this.editForm.projectCode
          };
          pUpdateCode(obj)
            .then(res => {
              if (res.err_CODE == 0) {
                this.$message.success(res.err_MESSAGE);
                this.editDialog = false;
                setTimeout(() => {
                  this.$refs.editForm.resetFields();
                }, 600);
                this.plusData.projectCode = this.editForm.projectCode;
              } else {
                this.$message.error(res.err_MESSAGE);
              }
            })
            .catch(() => {});
        } else {
          return false;
        }
      });
    },
    deleteProFit(item) {
      // 删除
      this.editDialogD = true;
      this.plusData = item;
    },
    resetFormD() {
      //删除取消
      this.editDialogD = false;
    },
    formPostD() {
      //删除确认
      this.editDialogD = false;
      pDeleteCode({ projectId: this.plusData.projectId })
        .then(res => {
          if (res.data) {
            if (res.data.err_CODE == 0) {
              this.$message.success(res.data.err_MESSAGE);
            } else {
              this.$message.error(res.data.err_MESSAGE);
            }
            this.selectA();
          }
        })
        .catch(() => {});
    },
    //权限设置
    getCurrentPermission(val) {
      var permission = "";
      if (val) {
        permission = val;
      }
      return permission;
    }
  }
};
</script>
<style lang="scss">
@import "../../styles/new-index.scss";
#proSet {
  background: $content-bgColor;
  display: flex;
  flex-direction: column;
  padding: 15px;
  box-sizing: border-box;
  position: relative;
  .proSetA {
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
  .tb-container {
    position: relative;
    z-index: 100;
    background: #fff;
    .projectHide{
      .projectCodes{
        margin-right:15px;
      }
      display: flex;
      justify-content: center;
      .projectClick{
        cursor:pointer;
        margin-right:15px;
        display:inline-block !important;
      }
      .projectClicks{
        cursor:pointer;
        display:inline-block !important;
      }
    }
  }
  .el-dialog {
    .el-form .el-form-item__label {
      padding: 0;
    }
    .el-dialog__title {
      font-size: 16px;
      color: #303133;
    }
    .el-dialog__header {
      padding-left: 24px;
    }
    .el-dialog__body {
      padding: 14px 0 0 24px;
      padding-bottom: 178px;
      .deleHandle {
        display: inline-block;
        padding: 36px 105px;
        text-align: center;
        font-size: 14px;
        font-weight: 400;
        color: #303133;
        line-height: 20px;
      }
    }
    .el-input__inner {
      width: 372px;
      padding: 0 5px;
    }
  }
  #sure_del .el-dialog {
    .el-dialog__body {
      padding-bottom: 0 !important;
      padding-top: 0px !important;
      padding-left: 0 !important;
    }
  }
  .el_dialog_del .el-dialog {
    .el-dialog__footer {
      text-align: end;
      .el-button--default {
        margin-right: 14px;
      }
    }
    .el-dialog__body {
      padding-bottom: 0;
      padding-top: 0px;
      padding-left: 0;
    }
    .el-dialog__header {
      padding-bottom: 0;
    }
  }

  .tb-container {
    flex: 1;
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
    .el-table {
      background: transparent !important;
      th {
        background: #ebf4fc;
        color: #323232;
        text-align: center;
        font-size: 12px;
        border: none;
        border-right: 1px solid white;
        padding: 6px 0;
      }
      tr {
        td {
          font-size: 12px;
          color: #323232;
          background: $content-bgColor;
          border-bottom: $td-border;
          text-align: center;
          padding: 8px 0;
          .txt_underline {
            color: $y-color;
            text-decoration: underline;
            cursor: pointer;
          }
          .cell {
            overflow: initial;
          }
          .el-icon-edit,
          .el_fit,
          .el-icon-delete {
            cursor:pointer;
            color: $y-color;
          }
        }
      }
    }
  }
  .el-pagination {
    padding: 2px 0;
  }
  .paging{
    margin-top: 10px;
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
