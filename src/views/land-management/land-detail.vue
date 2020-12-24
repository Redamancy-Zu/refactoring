<template>
  <div id="detailLand">
    <el-dialog
      v-fence="{data:'', functions:['查看建筑楼（详情）']}"
      class="addTypeName"
      title="建筑(楼)"
      :modal-append-to-body="false"
      :visible.sync="details"
      :before-close="error"
      width="850px"
      top="27vh"
    >
      <div class="deleteBox">
        <ul class="landList">
          <li
            class="landListName"
            v-for="(item,index) in buildList"
            :key="index"
          >{{item+'(栋)'}}</li>
        </ul>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    details: {
      //父组件传过来的值
      type: Boolean
    },
    buildList: {
      type: Array
    }
  },
  data() {
    return {};
  },
  methods: {
    //关闭详情
    error() {
      this.$emit("detailLand", false);
    }
  }
};
</script>
<style scoped lang="scss">
#detailLand{
  .deleteBox{
    width:100%;
    height:auto;
    .landList{
      width:100%;
      height:auto;
      white-space:wrap;
      .landListName{
        line-height:30px;
        display:inline-block;
        margin:0 32px 0 0;
      }
    }
  }
}
</style>