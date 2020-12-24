<template>
  <div id="space-name" :style="{minHeight: minHeight + 'px'}">
    <div class="spaceNA">
      <span>您没有空间名称管理的查看权限！</span>
    </div>
    <div
      class="spaceNB"
      :style="{minHeight: minHeightInner + 'px'}"
      v-fence="{data:'', functions:['查看空间名称列表']}"
    >
      <div class="select-container">
        <el-col :span="16">
          选择项目
          <el-select v-model="page.projectId" size="mini" @change="projectChange(page.projectId)">
            <el-option
              v-for="(pro, index) in projectArr"
              :key="index"
              :label="pro.projectName"
              :value="pro.projectId"
            ></el-option>
          </el-select>
          <!-- 新增类型 -->
          <span class="selectNow">选择空间类型</span>
          <el-select
            v-model="page.spaceTypeId"
            size="mini"
            @change="spaceTypeChange(page.spaceTypeId)"
          >
            <el-option
              v-for="(pro, index) in spaceTypeArr"
              :key="index"
              :label="pro.name"
              :value="pro.id"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="8">
          <el-button
            v-fence="{data:getCurrentPermission(), functions:['维护空间名称（新建，编辑，删除）']}"
            type="primary"
            style="border:none;float: right;"
            icon="el-icon-plus"
            @click="addRoomName"
          >新建空间名称</el-button>
        </el-col>
      </div>
      <div class="table-container">
        <template>
          <el-table :data="tab_data">
            <el-table-column prop="projectName" label="项目名"></el-table-column>
            <el-table-column prop="spaceType" label="空间类型">
              <template slot-scope="scope">
                <img
                  v-if="scope.row.pictureUrl"
                  :src="scope.row.pictureUrl"
                  class="tableUrl"
                />
                <span class="tableName">{{scope.row.spaceType}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="roomName" label="空间名称"></el-table-column>
            <el-table-column prop="useSign" label="使用情况">
              <template slot-scope="scope">{{scope.row.useSign === 0 ? '已使用' : '未使用'}}</template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <span
                  v-fence="{data:getCurrentPermission(scope.row.projectName), functions:['维护空间名称（新建，编辑，删除）']}"
                >
                  <span class="table-deco">
                    <i
                      class="el-icon-edit"
                      @click="editName(scope.row.nameId,scope.row.roomName,scope.row.projectId,scope.row.projectName,scope.row.spaceTypeId,'addForm')"
                    ></i>
                  </span>
                  <span class="iconDel" v-if="scope.row.useSign === 1">
                    <i class="el-icon-delete" @click="deleteRoomName(scope.row.nameId)"></i>
                  </span>
                  <span v-else class="look"></span>
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
          :modal-append-to-body="false"
          title="新建空间名称"
          :visible.sync="addDialog"
          width="556px"
          :before-close="resetForm"
          top="36vh"
        >
          <el-form :model="addForm" ref="addForm" :rules="addTmpRule" @submit.native.prevent>
            <el-form-item label="项目" prop="projectId" label-width="71px">
              <el-select v-model="addForm.projectId" size="mini" placeholder="项目">
                <el-option
                  v-for="(pro, index) in addProjectArr"
                  v-fence="{data:getCurrentPermission(pro.projectName), functions:['维护空间名称（新建，编辑，删除）']}"
                  :key="index"
                  :label="pro.projectName"
                  :value="pro.projectId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="空间类型" prop="spaceTypeId" label-width="71px">
              <el-select v-model="addForm.spaceTypeId" size="mini" placeholder="请选择空间类型">
                <el-option
                  v-for="(pro, index) in spaceTypeArrT"
                  :key="index"
                  :label="pro.name"
                  :value="pro.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="空间名称" prop="roomName" label-width="71px">
              <el-input v-model.trim="addForm.roomName" placeholder="1-10个字符" size="mini"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="resetForm('addForm')">取消</el-button>
            <el-button type="primary" @click="formPost('addForm')">确定</el-button>
          </span>
        </el-dialog>
        <!-- dialog 修改 -->
        <el-dialog
          :modal-append-to-body="false"
          title="编辑空间名称"
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
            <el-form-item class="editPro" label="项目" label-width="71px">
              <p class="proJectName">{{editForm.projectName}}</p>
            </el-form-item>
            <!-- 新增类型 -->
            <el-form-item label="空间类型" prop="spaceTypeId" label-width="71px">
              <el-select v-model="editForm.spaceTypeId" size="mini" placeholder="请选择空间类型">
                <el-option
                  v-for="(pro, index) in spaceTypeArrT"
                  :key="index"
                  :label="pro.name"
                  :value="pro.id"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="空间名称" prop="roomName" label-width="71px">
              <el-input v-model.trim="editForm.roomName" placeholder="1-10个字符" size="mini"></el-input>
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
  newGetProjectName, //项目下拉列表数据
  spacePageRoom, //空间名称列表
  spaceAddRoomName, //新增空间名称
  spaceUpdateRoomName, //新增空间
  spaceDelRoomName, //删除空间名称
  selectSpaceTypeList //空间类型下拉
} from "../../api/api.js";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "space-name",
  data() {
    return {
      minHeight: null,
      minHeightInner: null,
      addDialog: false, //新增弹框
      editDialog: false, //编辑弹框
      edit: false,
      //添加空间名称
      addForm: {
        projectId: null,
        roomName: "",
        spaceTypeId: null
      },
      //编辑空间名称
      editForm: {
        projectId: null,
        projectName: null,
        nameId: null,
        roomName: "",
        spaceTypeId: null
      },
      //初始名称
      oldName: "",
      oldspaceTypeId: "",
      //添加空间校验
      addTmpRule: {
        projectId: [
          {
            required: true,
            message: "请选择项目",
            trigger: "change"
          }
        ],
        spaceTypeId: [
          {
            required: true,
            message: "请选择空间类型",
            trigger: "change"
          }
        ],
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
      //编辑空间校验
      editTmpRule: {
        spaceTypeId: [
          {
            required: true,
            message: "请选择空间类型",
            trigger: "change"
          }
        ],
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
      tab_data: [], //空间列表
      total: 10,
      addProjectArr: [],
      projectArr: [],
      //分页
      page: {
        countryId: null,
        provinceId: null,
        cityId: null,
        projectId: null,
        spaceTypeId: null,
        pageNum: 1,
        pageSize: 10
      },
      spaceTypeArr: [], //空间类型下拉
      spaceTypeArrT: []
    };
  },
  mounted() {
    this.minHeight = window.innerHeight - 95;
    this.minHeightInner = window.innerHeight - 195;
    this.page.countryId = this.getCurrentCityId[0] || null;
    this.page.provinceId = this.getCurrentCityId[1] || null;
    this.page.cityId = this.getCurrentCityId[2] || null;
    this.getSelect(); //空间列表初始化
    this.spaceTypeList();
  },
  methods: {
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
    },
    // 空间类型下拉
    spaceTypeList() {
      selectSpaceTypeList().then(res => {
        this.spaceTypeArr = [{ id: null, name: "全部" }, ...res.data.data];
        this.spaceTypeArrT = [...res.data.data];
      });
    },
    // 空间类型下拉事件
    spaceTypeChange(value) {
      this.page.spaceTypeId = value;
      this.page.pageNum = 1;
      this.getData();
    },
    // 获取项目列表
    getSelect() {
      newGetProjectName({
        countryId: this.page.countryId,
        provinceId: this.page.provinceId,
        cityId: this.page.cityId
      }).then(res => {
        let data = res.data.data;
        this.projectArr = [{ projectId: null, projectName: "全部" }, ...data];
        this.addProjectArr = data;
        this.page.projectId = this.projectArr[0].projectId;
        this.getData();
      });
    },
    //空间名称列表
    getData() {
      const loading = this.$loading({
        lock: true,
        target: document.querySelector('#space-name')
      });
      spacePageRoom({ ...this.page })
        .then(res => {
          let data = res.data.data;
          this.total = data.total;
          this.tab_data = data.list;
          loading.close()
        })
        .catch(() => {
          loading.close()
        });
    },
    // 选择项目
    projectChange(projectId) {
      this.page.projectId = projectId;
      this.page.pageNum = 1;
      this.getData();
    },
    // 新增空间名称
    formPost(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.edit) {
            if (
              this.oldName === this.editForm.roomName &&
              this.oldspaceTypeId === this.editForm.spaceTypeId
            ) {
              this.editDialog = false;
              setTimeout(() => {
                this.$refs[formName].resetFields();
              }, 600);
              return;
            }
            spaceUpdateRoomName(this.editForm).then(res => {
              if (res.err_CODE == 1001) {
                this.$message.error(res.err_MESSAGE);
              } else {
                this.oldName = "";
                this.oldspaceTypeId = "";
                this.$message.success(res.err_MESSAGE);
                this.getData();
                this.editDialog = false;
                setTimeout(() => {
                  this.$refs[formName].resetFields();
                }, 600);
              }
            });
          } else {
            spaceAddRoomName(this.addForm).then(res => {
              if (res.err_CODE == 1001) {
                this.$message.error(res.err_MESSAGE);
              } else {
                this.$message.success(res.err_MESSAGE);
                this.getData();
                this.addDialog = false;
                setTimeout(() => {
                  this.$refs[formName].resetFields();
                }, 600);
              }
            });
          }
        } else {
          return false;
        }
      });
    },
    //新增空间名称
    addRoomName() {
      this.edit = false;
      this.addDialog = true;
    },
    //编辑空间名称
    editName(nameId, roomName, projectId, projectName, spaceTypeId) {
      this.edit = true;
      this.oldName = roomName;
      this.oldspaceTypeId = spaceTypeId;
      this.editDialog = true;
      this.editForm = { nameId, roomName, projectId, projectName, spaceTypeId };
    },
    //删除空间名称
    deleteRoomName(roomId) {
      this.$confirm("确定删除空间名称?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          spaceDelRoomName({
            roomId: roomId
          })
            .then(res => {
              if (res.err_CODE === 0) {
                this.tab_data = this.tab_data.filter(
                  item => item.nameId !== roomId
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
    // 重置
    resetForm(formName) {
      if (!this.edit) {
        setTimeout(() => {
          this.$refs.addForm.resetFields();
        }, 600);
        this.addDialog = false;
      } else {
        this.oldName = "";
        this.oldspaceTypeId = "";
        this.editForm.editName = "";
        setTimeout(() => {
          this.$refs.editForm.resetFields();
        }, 600);
        this.editDialog = false;
      }
    },
    //分页
    handleSizeChange(val) {
      this.page.pageSize = val;
      this.page.pageNum = 1;
      this.getData();
    },
    handleCurrentChange(val) {
      this.page.pageNum = val;
      this.getData();
    }
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
#space-name {
  padding: 10px 24px;
  background: $content-bgColor;
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
    .el-col-8{
      text-align: right;
    }
    .selectNow{
      margin-left:32px
    }
  }
  .table-container {
    overflow: auto;
    padding: 10px 0;
    .tableUrl{
      width:24px;
      height:24px;
      vertical-align:middle;
    }
    .tableName{
      margin-left:4px;
    }
    .tabla-deco{
      .el-icon-edit{
      cursor:pointer;
      margin-right:15px;
      }
    }
    .iconDel{
      cursor:pointer;
    }
  }
  s.look{
    display:inline-block;
    width:12px;
    height:12px;
}
}
</style>
<style lang="scss">
@import "../../styles/new-index.scss";
#space-name {
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
  }
  .select-container {
    .el-select {
      padding-left: 10px;
      width: 160px;
      .el-input__inner {
        background: $new-table-back;
        border: 0;
        color: $new-font-color;
        border-radius: 2px;
        font-size: 12px;
      }
      .el-input__icon {
        line-height: 1;
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
        .el-icon-edit,
        .el-icon-delete {
          cursor: pointer;
          color: $y-color;
        }
        .el-icon-edit{
          margin-right:15px;
        }
        .look{
          display:inline-block;
          width:12px;
          height:12px;
        }
      }
    }
  }
  .el-table::before {
    height: 0;
  }
  .el-form {
    .el-form-item {
      color: #323232;
      margin-bottom: 10px;
      height: 45px;
    }
    .editPro .proJectName {
      font-size:12px;
      color: #323232;
      font-weight:bold;
    }
    .editPro .el-form-item__label {
      color: #323232;
      padding-left: 10px;
    }
    .el-input {
      width: 430px;
    }
    .el-input__inner {
      color: #323232;
      width: 430px;
    }
  }
  // 分页的样式--
  .el-pagination {
    padding: 2px 0;
  }
  .paging {
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