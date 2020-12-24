<template>
  <div id="createLoad">
    <el-dialog
      class="addTypeName"
      title="新建地块"
      :modal-append-to-body="false"
      :visible.sync="createLoading"
      :before-close="cancel"
      @open="createLandList"
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
          <template scope>
            <el-select
              v-model="ruleForm.projectId"
              @change="peojectChange()"
              size="mini"
              placeholder="请选择"
              props="peojectName"
            >
              <el-option
                v-for="item in ruleForm.option"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="建筑（楼）" id="building" label-width="90px">
          <el-select
            id="selectNow"
            value-key="value"
            @change="buildingChange"
            v-model="ruleForm.buildingName"
            size="mini"
            multiple
            placeholder="请选择(可多选)"
          >
            <el-option
              id="checkClick"
              v-for="items in ruleForm.options"
              :key="items.value"
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
            class="errorText"
            :autosize="{ minRows: 5, maxRows: 3}"
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
import { createLand, peojectList, buildingList } from "../../api/api.js";
export default {
  props: {
    createLoading: {
      //父组件传过来的值
      type: Boolean
    },
    allList: {
      type: Array
    }
  },
  data() {
    return {
      isDisabled: false, //防止按钮重复点击
      ruleForm: {
        landName: "", //地块名
        landAlias: "", //地块别名
        projectId: "", //项目id
        options: [], //项目变化后列表
        description: "", //备注
        option: [], //项目列表
        buildingList: [], //楼栋列表
        buildingName: [] //楼栋名
      },
      add: [], //清空数据
      resetName: "",
      //地块规则
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
    //取消新增
    cancel(ruleForm) {
      this.$emit("createStatus", false);
      this.ruleForm.options = [];
      this.$nextTick(() => {
        this.$refs["ruleForm"].resetFields();
        this.ruleForm.buildingName = [];
      });
    },
    //新增操作
    determine() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          createLand(this.ruleForm).then(res => {
            if (res.err_CODE === 0) {
              this.$emit("createStatus", false);
              this.$message({
                type: "success",
                message: res.err_MESSAGE
              });
              setTimeout(() => {
                this.isDisabled = false;
              });
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
    //楼栋改变
    buildingChange() {
      this.ruleForm.buildingList = this.ruleForm.buildingName;
    },
    //项目变化
    peojectChange() {
      this.ruleForm.buildingName = [];
      buildingList({
        projectId: this.ruleForm.projectId
      }).then(res => {
        this.ruleForm.options = res.data.data;
      });
    },
    //打开新增框
    createLandList(ruleForm) {
      this.add.splice(0, this.add.length);
      peojectList({}).then(res => {
        this.ruleForm.option = res.data.data;
      });
      this.resetName = false;
      this.ruleForm.options = [];
      this.$nextTick(() => {
        this.ruleForm.buildingName = [];
        this.$refs["ruleForm"].resetFields();
      });
    }
  }
};
</script>
<style lang="scss">
#createLoad {
  #createLoad .addTypeName .langName {
    height: 24px;
  }
  input.el-input__inner {
    height: 28px;
  }
}
#projectName {
  .el-select {
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
  margin:20px 0 0 10px;
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
  margin-left: 10px;
  .errorText{
    margin-top:20px;
  }
}
#selectNow{
  color:#000;
}
</style>