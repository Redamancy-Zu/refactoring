<template>
  <div id="device-binding" @click="modelPopover = false;">
    <el-dialog
      :modal-append-to-body="false"
      title="设备绑定"
      :visible.sync="visible"
      :before-close="dialogClose"
      :show="show"
      top="20vh"
      width="860px"
    >
      <div class="content">
        <div class="allDevice">
          该房源下设备影子总数：
          <span class="allColor">{{gatewayInfo.shadowNum}}</span>
        </div>
        <div class="gateway">
          <div class="left">网关</div>
          <div class="right">
            <p>
              <span>设备名称：{{gatewayInfo.deviceName || '--'}}</span>
              <span>设备类型：{{gatewayInfo.deviceType || '--'}}</span>
              <span>IoT设备ID：{{gatewayInfo.iotDeviceNO || '--'}}</span>
              <span>IoT设备名称：{{gatewayInfo.iotDeviceName || '--'}}</span>
            </p>
            <p>
              设备SN：{{gatewayInfo.sn || '--'}}
              <span class="bt-box">
                <el-button
                  type="primary"
                  v-if="gatewayInfo.bindIoT === 0"
                  size="mini"
                  @click="unbindGateway"
                >取消绑定</el-button>
                <el-button v-else type="primary" size="mini" @click="bindGateway">绑定网关</el-button>
                <el-button
                  :type="gatewayInfo.bindIoT != 0 ? 'info':'primary'"
                  :disabled="gatewayInfo.bindIoT != 0"
                  @click="matchingDevice"
                  size="mini"
                >匹配设备</el-button>
              </span>
            </p>
          </div>
        </div>
        <div class="device">
          <div class="left">设备</div>
          <div class="right">
            <div class="top">
              空间
              <el-select
                size="mini"
                v-model="listParam.spaceId"
                placeholder="全部"
                @change="spaceAraayChange"
              >
                <el-option
                  v-for="(item,index) in spaceArr"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>类别
              <el-select
                size="mini"
                v-model="listParam.deviceType"
                placeholder="全部"
                @change="typeAraayChange"
              >
                <el-option
                  v-for="(item,index) in typeArr"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
              <el-checkbox
                :true-label="0"
                :false-label="1"
                v-model="listParam.status"
                size="mini"
                @change="statusChange"
              >未绑定设备</el-checkbox>
            </div>

            <div class="list" v-if="deviceBindList.length > 0">
              <el-scrollbar>
                <div v-for="(item,index) in deviceBindList" :key="index">
                  <span>设备名称：{{item.shadowName || '--'}}</span>
                  <span>设备类型：{{item.shadowType || '--'}}</span>
                  <span>IoT设备ID：{{item.iotDeviceNO || '--'}}</span>
                  <span>设备SN：{{item.sn || '--'}}</span>
                  <el-button
                    :key="1"
                    v-if="item.bindIoT !== 0 && gatewayInfo.iotDeviceId"
                    type="primary"
                    size="mini"
                    @click="openIotDialog(item.shadowId)"
                  >绑定</el-button>
                  <el-button
                    v-else-if="gatewayInfo.iotDeviceId"
                    type="primary"
                    size="mini"
                    @click="unbindDevice(item.shadowId)"
                  >解绑</el-button>
                </div>
              </el-scrollbar>
            </div>
            <div v-else class="list">无设备信息！</div>
          </div>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      :modal-append-to-body="false"
      title="IoT设备"
      :visible.sync="iotVisible"
      :before-close="iotdialogClose"
      :show="show"
      top="26vh"
      width="600px"
      class="iotDevice"
    >
      <div class="content">
        <el-table
          :data="tableData"
          highlight-current-row
          @current-change="selectIotDevice"
          height="340"
          size="mini"
          style="width: 100%"
        >
          <el-table-column align="center" prop="iotDeviceNO" label="设备ID" width="113"></el-table-column>
          <el-table-column align="center" prop="iotDeviceName" label="设备名称" width="96"></el-table-column>
          <el-table-column align="center" prop="iotDeviceType" width="130" label="型号"></el-table-column>
          <el-table-column align="center" prop="reportLocation" label="上报位置"></el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="iotdialogClose" size="mini">取消</el-button>
        <el-button type="primary" size="mini" @click="iotdialogConfim">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :modal-append-to-body="false"
      :title="'绑定网关：' + title"
      :visible.sync="gatewayVisible"
      :before-close="gatewaydialogClose"
      :show="show"
      :show-close="false"
      top="36vh"
      width="576px"
      class="gatewaySure"
    >
      <div class="content">
        <el-form
          :model="gatewayForm"
          ref="gatewayForm"
          :rules="gatewayFormRule"
          @submit.native.prevent
          label-position="right"
          :hide-required-asterisk="true"
        >
          <el-form-item label="选择IoT设备" label-width="80px" prop="gwId">
            <el-select
              v-model="gatewayForm.gwId"
              filterable
              placeholder="选择或输入网关名称"
              size="mini"
              no-match-text="未搜索到相关信息！"
            >
              <el-option
                v-for="item in gatewayArr"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="binding">
            <el-checkbox
              :true-label="0"
              :false-label="1"
              v-model="gatewayForm.binding"
              size="mini"
            >同时绑定该网关下所有设备</el-checkbox>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer binging">
        <el-button class="closeBtn" @click="gatewaydialogClose" size="mini">取消</el-button>
        <el-button type="primary" size="mini" @click="gatewaydialogConfim">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  selectGatewayInfo, // 网关信息
  bindingGateway, // 绑定网关(及所有设备)
  selectUnboundGatewayList, // 网关联想输入框
  selectDeviceBindList, // 设备绑定状态列表
  selectUnboundIoTList, // 未绑定iot设备列表
  selectDeviceSpaceList, // 空间下拉框
  selectDeviceTypeList, // 类别下拉框
  unbindGateway, // 取消绑定
  matchingDevice, // 匹配网关
  bindDevice, // 绑定iot设备
  unbindDevice //解绑iot设备
} from "../../api/api.js";
export default {
  data() {
    return {
      visible: this.show,
      iotVisible: false,
      gatewayVisible: false, // 绑定网关弹框
      gatewayArr: [], // 网关下拉列表
      spaceArr: [], // 空间下拉列表
      typeArr: [], // 类别下拉列表
      gatewayForm: {
        houseId: this.houseId,
        gwId: null,
        binding: 0
      },
      gatewayFormRule: {
        gwId: [
          {
            required: true,
            message: "请选择有效的网关",
            trigger: "blur"
          }
        ]
      },
      gatewayInfo: {
        shadowNum: null,
        deviceName: null,
        deviceType: null,
        iotDeviceNO: null,
        iotDeviceName: null,
        sn: null
      },
      listParam: {
        gatewayShadowId: this.gatewayShadowId,
        spaceId: null,
        deviceType: null,
        status: 1
      },
      deviceBindList: [],
      tableData: [],
      currentRow: null,
      shadowId: null // 绑定或解绑时的id
    };
  },
  props: {
    projectId: {
      required: true
    },
    houseId: {
      required: true
    },
    gatewayShadowId: {
      required: true
    },
    title: {
      required: true
    },
    show: {
      type: Boolean,
      default: true
    }
  },
  created() {},
  mounted() {
    this.getgatewayInfo();
    this.getDeviceList();
    this.getData();
  },
  computed: {},
  watch: {
    show() {
      this.visible = this.show;
    }
  },
  methods: {
    // 获取下拉列表信息
    getData() {
      selectDeviceSpaceList({ houseId: this.houseId })
        .then(res => {
          let data = res.data.data;
          if (data) this.spaceArr = [{ id: null, name: "全部" }, ...data];
        })
        .catch(() => {
        });
      selectDeviceTypeList({ houseId: this.houseId }).then(res => {
        let data = res.data.data;
        if (data) this.typeArr = [{ id: null, name: "全部" }, ...data];
      });
    },

    // 获取网关信息
    getgatewayInfo() {
      selectGatewayInfo({ gatewayShadowId: this.gatewayShadowId }).then(res => {
        let data = res.data.data;
        if (data) {
          this.gatewayInfo = {
            shadowId: data.shadowId,
            bindIoT: data.bindIoT,
            shadowNum: data.shadowNum,
            deviceName: data.deviceName,
            deviceType: data.deviceType,
            iotDeviceId: data.iotDeviceId,
            iotDeviceNO: data.iotDeviceNO,
            iotDeviceName: data.iotDeviceName,
            sn: data.sn
          };
        }
      });
    },

    // 获取设备列表
    getDeviceList() {
      selectDeviceBindList(this.listParam).then(res => {
        let data = res.data.data;
        if (data) {
          this.deviceBindList = data;
        }
      });
    },

    // 获取网关下拉列表
    selectUnboundGatewayList() {
      selectUnboundGatewayList({ projectId: this.projectId }).then(res => {
        let data = res.data.data;
        if (data) {
          this.gatewayArr = data;
        }
      });
    },

    // 取消绑定
    unbindGateway() {
      this.$confirm(
        "若取消智能网关绑定，该网关下所有智能设备都将立即被解绑，是否取消绑定？",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          showClose: false
        }
      )
        .then(() => {
          unbindGateway({ gatewayShadowId: this.gatewayShadowId }).then(res => {
            if (res.data.err_CODE === 0) {
              this.getgatewayInfo();
              this.getDeviceList();
              this.getData();
              this.$message.success(res.data.err_MESSAGE);
            } else {
              this.$message.error(res.data.err_MESSAGE);
            }
          });
        })
        .catch(() => {});
    },

    // 打开绑定网关弹框
    bindGateway() {
      this.gatewayVisible = true;
      this.selectUnboundGatewayList();
    },

    // 取消绑定网关
    gatewaydialogClose() {
      this.gatewayVisible = false;
      this.$refs["gatewayForm"].resetFields();
    },

    // 绑定网关
    gatewaydialogConfim() {
      this.$refs["gatewayForm"].validate(valid => {
        if (valid) {
          bindingGateway(this.gatewayForm).then(res => {
            if (res.err_CODE === 0) {
              this.getgatewayInfo();
              this.getDeviceList();
              this.getData();
              this.gatewayVisible = false;
              this.$message.success(res.err_MESSAGE);
              this.$refs["gatewayForm"].resetFields();
            } else {
              this.$message.error(res.err_MESSAGE);
            }
          }).catch(err => {
          });
        } else {
          return false;
        }
      });
    },

    // 匹配设备
    matchingDevice() {
      this.$confirm(
        "点击确定后，系统将按照设备名及空间名重新绑定设备并保存新的配置，现有配置将丢失。确认匹配设备？",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          showClose: false
        }
      )
        .then(() => {
          matchingDevice({ gatewayShadowId: this.gatewayShadowId }).then(
            res => {
              if (res.data.err_CODE === 0) {
                this.getgatewayInfo();
                this.getDeviceList();
                this.getData();
                this.$message.success(res.data.err_MESSAGE);
              } else {
                this.$message.error(res.data.err_MESSAGE);
              }
            }
          );
        })
        .catch(() => {});
    },

    // 打开iot设备列表
    openIotDialog(id) {
      this.iotVisible = true;
      this.shadowId = id;
      selectUnboundIoTList({ gatewayIoTId: this.gatewayInfo.iotDeviceId }).then(
        res => {
          let data = res.data.data;
          if (data) {
            this.tableData = data;
          }
        }
      );
    },

    // 选中设备
    selectIotDevice(val) {
      this.currentRow = val;
    },

    spaceAraayChange() {
      this.getDeviceList();
    },

    typeAraayChange() {
      this.getDeviceList();
    },

    statusChange() {
      this.getDeviceList();
    },

    // // 关闭dialog
    dialogClose() {
      this.$emit("dialogClose", true);
    },

    // iot
    iotdialogClose() {
      this.iotVisible = false;
    },

    // 绑定iot设备
    iotdialogConfim() {
      if (this.currentRow && this.currentRow.iotDeviceId) {
        bindDevice({
          shadowId: this.shadowId,
          iotDeviceId: this.currentRow.iotDeviceId
        }).then(res => {
          if (res.err_CODE === 0) {
            this.getDeviceList();
            // this.getData();
            this.iotVisible = false;
            this.$message.success(res.err_MESSAGE);
          } else {
            this.$message.error(res.err_MESSAGE);
          }
        });
      } else {
        this.$message.error("请选择IoT设备!");
      }
    },

    // 解绑iot设备
    unbindDevice(id) {
      unbindDevice({ shadowId: id }).then(res => {
        if (res.err_CODE === 0) {
          this.$message.success(res.err_MESSAGE);
          this.getDeviceList();
          // this.getData();
        } else {
          this.$message.error(res.err_MESSAGE);
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
#device-binding {
  .el-dialog__body {
    .content {
      .allDevice{
        margin:24px 0 12px;
        font-size:14px;
        font-weight:bold;
        .allColor{
          color:#AF7C58;
        }
      }
      .gateway,
      .device {
        margin-top: 24px;
        & > div {
          &.left {
            float: left;
            font-size: 14px;
            color: #323232;
            font-weight: 800;
            text-align: left;
            padding: 15px 10px 0 0;
          }
          &.right {
            overflow: auto;
            padding: 15px;
            font-size: 12px;
            background: #f6f6f6;
            .list{
              height: 280px;
              .el-scrollbar{
              height: 280px;
            }
            }
          }
        }
      }
      .gateway {
        margin-top: 0px;
      }
      .gateway {
        .right {
          .bt-box {
            float: right;
          }
          p {
            line-height: 2.8;
            span {
              margin-right: 20px;
              &:last-of-type {
                margin-right: 0px;
              }
            }
          }
        }
      }
      .device {
        .top {
          font-size: 14px;
          font-weight: bold;
          padding-bottom: 15px;
          .el-select {
            margin-right: 15px;
          }
        }
        .right {
          padding: 15px 5px 15px 15px !important;
        }
      }
    }
  }
  .iotDevice{
    .content{
      height: 400px;
      padding: 30px 0 20px 0;
    }
  }
  .gatewaySure{
    .content{
      padding: 30px 0 40px 120px;
    }
    .binging{
      text-align:right;
      .closeBtn{
        margin-right:24px;
      }
    }
  }
}
</style>
<style lang="scss">
#device-binding {
  .el-dialog {
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    .el-dialog__header {
      font-size: 16px;
      font-weight: bold;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
    }
    .el-dialog__body {
      height: 100%;
      padding: 30px 20px 30px 20px;
      color: #323232;
      font-weight: 400;
    }
    .content {
      .device {
        .el-select {
          margin-right: 15px;
          margin-left: 5px;
          .el-input {
            .el-input__inner {
              background: #efe5de !important;
            }
          }
        }
        .el-checkbox__input.is-checked .el-checkbox__inner {
          border-color: #af7c58;
        }
        .el-checkbox {
          font-size: 12px;
          .el-checkbox__inner {
            border-color: #323232;
            &:hover {
              border-color: #af7c58;
            }
          }
        }
        .list {
          .el-scrollbar {
            height: 100%;
            .el-scrollbar__wrap {
              box-sizing: border-box;
              overflow-x: hidden;
            }
          }
          div {
            line-height: 2.8;
            color: #323232;
            & > span {
              margin-right: 20px;
            }
          }
          .el-button {
            &.el-button--mini {
              padding: 4px 10px !important;
              font-size: 12px;
            }
          }
        }
      }
      .el-table {
        background: transparent !important;
        th {
          background: rgba(64, 151, 234, 0.1);
          color: #323232;
          text-align: center;
          font-size: 12px;
          font-weight: bold;
          border: none;
          border-right: 1px solid #ffffff;
          &.gutter {
            background: transparent !important;
          }
        }
        tr {
          background: #ffffff;
          &.current-row {
            td {
              background: rgba(175, 124, 88, 0.5) !important;
            }
          }

          td {
            font-size: 12px;
            background: #ffffff;
            color: #323232;
            text-align: center;
            border-bottom: 1px solid #dedede;
            .txt_underline {
              text-decoration: underline;
              cursor: pointer;
            }
          }
        }
      }
      .el-table--enable-row-hover .el-table__body tr:hover > td {
        background: rgba(175, 124, 88, 0.1) !important;
      }
      .el-table--enable-row-hover .el-table__body tr.current-row:hover > td {
        background: rgba(175, 124, 88, 0.5) !important;
      }
      .el-form-item {
        margin-bottom: 5px;
        .el-input {
          width: 200px;
        }
        .el-input__inner {
          width: 200px;
        }
      }
      .el-form-item__error {
        padding-top: 0px;
      }
    }
    .el-dialog__footer {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      text-align: center;
      .el-button {
        padding: 0;
        width: 88px;
        height: 28px;
        text-align: center;
        font-size: 12px;
        border: 1px solid #af7c58;
      }
      .el-button:first-child {
        margin-right: 50px;
      }
    }
    .el-dialog__footer {
      .dialog-footer.binging {
        text-align: right !important;
        .el-button {
          border: none;
          width: 60px;
          &:first-child {
            color: #af7c58;
            margin-right: 10px;
            border: 1px solid #af7c58;
          }
        }
      }
    }
  }
}
.el-message-box__message p {
  font-size: 15px !important;
  color: #323232 !important;
  // text-align: left!important;
}
</style>