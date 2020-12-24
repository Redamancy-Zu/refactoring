<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
   name: 'App'
}
</script>

<style lang="scss">
#app {
  font-family:'Microsoft Yahei' ,'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height:100%;
  width:100%;
  font-size:12px;
  .el-dialog__wrapper {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: auto;
    margin: 0;
    background: rgba(0,0,0,.4);
  }
}
body{
  .el-loading-spinner .path{
    stroke: #3D90F8;
  }
  .el-loading-mask.is-fullscreen{
    z-index: 3000 !important;
  }
  .el-message-box__btns{
    .el-button {
        padding: 0;
        width: 88px;
        height: 28px;
        text-align: center;
        font-size: 12px;
        border: 1px solid #AF7C58;
    }
    .el-button:first-child {
        background:#AF7C58 !important;;
        color: #fff !important;
    }
    .el-button--primary {
        background: none !important;;
        color: #000 !important;;
    }
}
.v-modal{
  display:none;
}
.el-message-box__wrapper {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: center;
    background: rgba(0,0,0,.4)
}
}
</style>
