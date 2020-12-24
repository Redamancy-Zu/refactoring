<template>
  <div id="resetBox">
    <el-dialog
      class="addTypeName"
      title="提示"
      :visible.sync="resetStatus"
      :before-close="cancel"
      width="576px"
      top="27vh"
    >
      <div class="deleteBox">
        <span class="deleteCont">重置后，当前最新记录将会被清空，归档为历史记录，是否重置？</span>
      </div>
      <span id="dialog-footer">
        <el-button type="primary" class="cancelCheck" @click="cancel">取消</el-button>
        <el-button
          class="cancelCheck cancelChecks"
          :disabled="shows"
          @click="determine"
        >确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { resetTotal } from "../../api/api.js";
export default {
  props: {
    resetStatus: {
      //父组件传过来的值
      type: Boolean
    },
    shadowId: {
      type: Number
    },
    newTotal: {
      type: Boolean
    },
    newHistory: {
      type: Function
    },
    oldHistory: {
      type: Function
    },
    timeValue: {
      type: Array
    }
  },
  data() {
    return {
      shows: false
    };
  },
  mounted() {},
  methods: {
    //取消重置
    cancel() {
      this.$emit("uploadStatus", false);
    },
    //重置成功
    determine() {
      this.shows = true;
      this.$emit("uploadStatus", false);
      resetTotal({
        gatewayShadowId: this.shadowId
      })
        .then(res => {
          this.$message({
            type: "success",
            message: res.data.err_MESSAGE
          });
          if (this.newTotal === true) {
            this.$emit("newHistory");
          } else {
            this.$emit("oldHistory");
            this.$emit("timeChangees", [null]);
          }
          this.shows = false;
        })
        .catch(error => {
          this.$message.error(res.data.err_MESSAGE);
        });
    }
  }
};
</script>
<style scoped lang='scss'>
@import "../../styles/new-index.scss";
#dialog-footer {
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  margin-top: 35px;
  text-align: right;
  .cancelCheck {
    padding: 0;
    width: 88px;
    height: 28px;
    text-align: center;
    font-size: 12px;
    border: 1px solid #af7c58;
  }
  .cancelChecks {
    margin-left: 24px;
  }
}
.deleteBox .deleteCont{
  padding-left:87px;
}
</style>