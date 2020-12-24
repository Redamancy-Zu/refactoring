<template>
  <div id="editerLoad">
    <div v-empty="{data:'', functions:['查看模板列表，模板详情']}">
      <span>您没有地块管理的编辑权限！</span>
    </div>
    <el-dialog
      class="addTypeName"
      title="编辑地块"
      :modal-append-to-body="false"
      :visible.sync="editer"
      :before-close="cancel"
      @open="editerLandList"
      width="576px"
      top="27vh"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="地块名" prop="landName">
          <el-input size="mini" class="langName" v-model="ruleForm.landName" placeholder="1-50个字符"></el-input>
        </el-form-item>
        <el-form-item label="地块别名" prop="landAlias">
          <el-input size="mini" class="langName" v-model="ruleForm.landAlias" placeholder="1-50个字符"></el-input>
        </el-form-item>
        <el-form-item label="项目名称" id="projectName" prop="projectId" label-width="100px">
          <span class="projectBild">{{this.landNow.projectName}}</span>
        </el-form-item>
        <el-form-item style="margin:20px 0 0 10px;" label="建筑（楼）" id="building" label-width="90px">
          <el-select
            id="selectNow"
            v-model="ruleForm.buildingList"
            size="mini"
            multiple
            placeholder="请选择(可多选)"
          >
            <el-option
              id="checkClick"
              v-for="(items,ind) in options"
              :key="ind"
              :label="items.name"
              :value="items.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="descText" label="备注" prop="description" label-width="90px">
          <el-input
            type="textarea"
            size="mini"
            resize="none"
            maxlength="100"
            style="margin-top:20px;"
            :autosize="{ minRows: 5, maxRows: 2}"
            placeholder="0-100个字符"
            v-model.trim="ruleForm.description"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" :disabled="isDisabled" @click="determine">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { editerList, peojectList, buildingList } from "../../api/api.js";
export default {
  props: {
    editer: {
      //父组件传过来的值
      type: Boolean
    },
    landNow: {
      type: Object
    }
  },
  data() {
    return {
      isDisabled: false, //防止按钮重复点击
      editerStatus: false, //编辑地块状态
      ruleForm: {
        landName: "", //地块名
        landAlias: "", //地块别名
        description: "", //备注
        projectId: "", // 项目iid
        buildingList: "", //楼栋列表
        landId: "" //地块id
      },
      option: [],
      options: [], //楼栋列表
      //列表规则
      rules: {
        landName: [
          { required: true, message: "1-50个字符", trigger: "blur" },
          { min: 1, max: 50, message: "1-50个字符", trigger: "blur" }
        ],
        landAlias: [
          { required: true, message: "1-50个字符", trigger: "blur" },
          { min: 1, max: 50, message: "1-50个字符", trigger: "blur" }
        ],
        projectId: [
          { required: true, message: "请选择项目", trigger: "change" }
        ]
      }
    };
  },
  methods: {
    //取消编辑
    cancel(ruleForm) {
      this.$emit("editerStatus", false);
      this.$nextTick(() => {
        this.$refs["ruleForm"].resetFields();
      });
    },
    //编辑操作
    determine(ruleForm) {
      this.ruleForm.landId = this.landNow.landId;
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          editerList(this.ruleForm).then(res => {
            if (res.err_CODE === 0) {
              this.$emit("createStatus", false);
              this.$emit("editerStatus", false);
              this.$nextTick(() => {
                this.$refs["ruleForm"].resetFields();
              });
              setTimeout(() => {
                this.isDisabled = false;
              });
              this.$message({
                type: "success",
                message: res.err_MESSAGE
              });
              this.landNow.landName = this.ruleForm.landName;
              this.landNow.landAlias = this.ruleForm.landAlias;
              this.landNow.description = this.ruleForm.description;
              this.landNow.projectName = this.ruleForm.projectId;
              this.landNow.buildingList = this.ruleForm.buildingList;
              this.$emit("uploadList");
              this.isDisabled = true;
            } else {
              this.$message.error(res.err_MESSAGE);
            }
          });
        } else {
          return false;
          this.isDisabled = false;
        }
      });
    },
    //当前地块信息
    editerLandList() {
      peojectList({}).then(res => {
        this.option = res.data.data;
      });
      this.createNew();
      this.ruleForm = {
        landName: this.landNow.landName,
        landAlias: this.landNow.landAlias,
        description: this.landNow.description,
        projectId: this.landNow.projectId,
        buildingList: this.landNow.buildingList,
        landId: ""
      };
    },
    //楼栋列表
    createNew() {
      buildingList({
        projectId: this.landNow.projectId,
        landId: this.landNow.landId
      }).then(res => {
        this.options = res.data.data;
      });
    }
  }
};
</script>
<style lang="scss">
#editerLoad {
  #createLoad .addTypeName .langName {
    height: 24px;
  }
  #projectName {
    .el-cascader {
      width: 100%;
    }
  }
  #checkClick span {
    width: 360px;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  #building {
    .el-select {
      width: 100%;
    }
    .el-select__tags-text {
      width: 360px;
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .el-tag__close {
      margin-bottom: 12px;
    }
  }
  .descText{
    margin-left:10px;
  }
  .projectBild{
    font-weight: bold;
  }
}
</style>