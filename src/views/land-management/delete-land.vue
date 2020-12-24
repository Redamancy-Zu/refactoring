<template>
  <div id="deleteLand">
    <el-dialog
      v-fence="{data:'', functions:['删除地块']}"
      class="addTypeName"
      title="确认删除"
      :modal-append-to-body="false"
      :visible.sync="deletes"
      :before-close="cancel"
      width="576px"
      top="27vh"
    >
      <div class="deleteBox">
        <span class="deleteCont">删除项目下建筑与地块之间的关联关系不可恢复, 是否确认删除？</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="cancel">取消</el-button>
        <el-button @click="determine">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { deletesList } from "../../api/api.js";
export default {
  props: {
    deletes: {
      //父组件传过来的值
      type: Boolean
    },
    deletesId: {
      type: Number
    }
  },
  data() {
    return {
      deleteLands: false
    };
  },
  methods: {
	//取消删除
    cancel() {
      this.$emit("uploadLand", false);
	},
	//删除地块
    determine() {
      deletesList({
        landId: this.deletesId
      }).then(res => {
        if (res.err_CODE === 0) {
          this.$emit("uploadLand", false);
          this.$message({
            type: "success",
            message: res.err_MESSAGE
          });
          this.$emit("uploadList");
        } else {
          this.$message.error(res.err_MESSAGE);
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../styles/new-index.scss";
.deleteCont{
  padding-left:87px;
}
</style>