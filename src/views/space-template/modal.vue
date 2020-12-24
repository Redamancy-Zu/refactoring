<template>
  <div id="modal" @click="modelPopover = false;">
    <el-dialog
      title="编辑设备信息"
      :visible.sync="visible"
      :before-close="dialogClose"
      :show="show"
      top="10vh"
      width="800px"
    >
      <el-scrollbar style="height:100%;">
        <div id="content">
          <div class="card" v-for="(room,index) in modelDetail.rooms" :key="index">
            <!-- 空间 -->
            <div class="space">
              <el-row class="top" :gutter="15">
                <el-col>空间名称</el-col>
                <el-col>朝向</el-col>
                <el-col>面积</el-col>
              </el-row>
              <el-row class="list" :gutter="15">
                <el-col>
                  <el-select
                    v-model="room.roomNameId"
                    value-key="id"
                    size="mini"
                    @change="roomSelect"
                    placeholder="空间名称"
                  >
                    <el-option
                      v-for="(pro, index) in roomNameList"
                      :key="index"
                      :label="pro.roomName"
                      :value="pro.nameId"
                    ></el-option>
                  </el-select>
                </el-col>
                <el-col>
                  <el-select
                    v-model="room.orientedId"
                    size="mini"
                    @change="isEdit = false;"
                    placeholder="朝向(非必填)"
                  >
                    <el-option
                      v-for="(pro, index) in roomOrientList"
                      :key="index"
                      :label="pro.oriented"
                      :value="pro.orientedId"
                    ></el-option>
                  </el-select>
                </el-col>
                <el-col class="area">
                  <el-input
                    size="mini"
                    max="1"
                    v-model.trim="room.area"
                    placeholder="面积(非必填)"
                    @keyup.native="areaNumber"
                  ></el-input>
                  <span>㎡</span>
                </el-col>
                <el-col class="icon">
                  <el-popover placement="top" v-model="room.spaceDel">
                    <p style="text-align:center;">删除空间后，则该空间下的所有设备都将被删除，</p>
                    <p style="text-align:center;">
                      是否确认删除空间
                      <span v-if="room.roomName">--</span>
                      <span style="color:#AF7C58;">{{room.roomName}}</span> ？
                    </p>
                    <div class="closeDill" style="text-align: right;margin: 0;margin-top:10px;">
                      <el-button size="mini" type="text" @click="room.spaceDel = false">取消</el-button>
                      <el-button
                        type="primary"
                        size="mini"
                        @click="spaceDelete(room.roomId,index);room.spaceDel = false;"
                      >确定</el-button>
                    </div>
                    <i slot="reference" class="el-icon-circle-close"></i>
                  </el-popover>
                </el-col>
                <el-col class="tip">
                  <span>{{getTip(room.message,0)}}</span>
                </el-col>
              </el-row>
            </div>
            <!-- 设备 -->
            <div class="devices">
              <el-row v-if="room.devices.length > 0" class="top" :gutter="15">
                <el-col>设备名称</el-col>
                <el-col class="type">产品名称/产品型号/厂商</el-col>
              </el-row>
              <el-row v-for="(device,i) in room.devices" :key="i" class="list" :gutter="15">
                <el-col>
                  <el-input
                    size="mini"
                    v-model.trim="device.deviceName"
                    placeholder="设备名称"
                    @keyup.native="devNameChange(index)"
                  ></el-input>
                </el-col>
                <el-col class="type">
                  <el-cascader
                    v-model="device.typeList"
                    :options="deviceTypeList"
                    :show-all-levels="false"
                    placeholder="选择产品信息"
                    size="mini"
                    @change="deviceSelect(index)"
                  ></el-cascader>
                </el-col>
                <el-col class="icon">
                  <el-popover placement="top" v-model="device.modelDel">
                    <p style="text-align:center;">
                      是否确认删除设备
                      <span v-if="device.deviceName">-</span>
                      <span>{{device.deviceName}}</span> ？
                    </p>
                    <div style="text-align: right;margin: 0;margin-top:10px;">
                      <el-button size="mini" type="text" @click="device.modelDel = false">取消</el-button>
                      <el-button
                        type="primary"
                        size="mini"
                        @click="deviceDelete(device.deviceId,index,i);device.modelDel = false"
                      >确定</el-button>
                    </div>
                    <i slot="reference" class="el-icon-circle-close"></i>
                  </el-popover>
                </el-col>
                <el-col class="tip">
                  <span>{{getTip(device.message,1)}}</span>
                </el-col>
              </el-row>
            </div>
            <div class="addDevice">
              <el-button
                @click="addDevice(room.roomId,index)"
                type="primary"
                icon="el-icon-plus"
                size="mini"
              >添加设备</el-button>
            </div>
          </div>
          <el-dropdown trigger="click">
            <el-button type="primary" size="mini">
              添加空间
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="openAddModel">使用模板添加</el-dropdown-item>
              <el-dropdown-item @click.native="addSpace">直接添加</el-dropdown-item>
            </el-dropdown-menu>
            <!-- 使用模板添加弹出框 -->
            <el-popover class="modelSelect" placement="right-end" v-model="modelPopover">
              <p>使用已有模版的空间设备拓扑</p>
              <el-select
                size="mini"
                v-model="checkModelId"
                placeholder="项目"
                class="templateName templateFrist"
                @change="getProjectId(checkModelId)"
              >
                <el-option
                  v-for="item in importModelArr"
                  :key="item.projectId"
                  :label="item.projectName"
                  :value="item.projectId"
                ></el-option>
              </el-select>
              <el-select
                size="mini"
                v-model="checkModelCode"
                placeholder="模版编号"
                class="templateName templateLast"
                @change="getModelId(checkModelCode)"
              >
                <el-option
                  v-for="item in importModelCode"
                  :key="item.modelId"
                  :label="item.houseFullName"
                  :value="item.modelId"
                ></el-option>
              </el-select>
              <div style="text-align: right;margin: 0">
                <el-button size="mini" type="text" @click="modelPopover = false">取消</el-button>
                <el-button type="primary" size="mini" @click.stop="modelPoverAdd">添加</el-button>
              </div>
            </el-popover>
          </el-dropdown>
        </div>
      </el-scrollbar>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogClose" size="mini">取消</el-button>
        <el-button type="primary" size="mini" @click="dialogConfim">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import {
  modelSelectDetails,
  modelSelectRoomName,
  modelSelectOriented,
  modelSelectListModel,
  modelUpdateDevice,
  getProjectName,
  modelFindAllhouse,
  modelInserToUser
} from "../../api/api.js";
export default {
  data() {
    return {
      visible: this.show,
      modelPopover: false, // 模板导入弹框
      roomNameList: [], // 空间名称列表
      roomOrientList: [], // 空间朝向列表
      deviceTypeList: [], // 设备类型列表
      modelDetail: {
        rooms: []
      },
      project: {
        // 导入模板项目查询
        countryId: null,
        provinceId: null,
        cityId: null
      },
      importModelArr: [], // 导入项目数组
      importModelCode: [], // 导入模板数组
      checkModelId: null, // 选中的项目id
      checkModelCode: null, // 选中的模板id
      deletedRooms: [], // 要删除的空间
      deleteDevices: [], // 要删除的设备
      flag: true,
      isEdit: true
    };
  },
  props: {
    projectId: {
      required: true
    },
    templateId: {
      required: true
    },
    show: {
      type: Boolean,
      default: true
    }
  },
  created() {
    this.getDrowpDownList(); // 空间名称列表
  },
  mounted() {
    this.project.countryId = this.getCurrentCityId[0] || null;
    this.project.provinceId = this.getCurrentCityId[1] || null;
    this.project.cityId = this.getCurrentCityId[2] || null;
    this.getData(); // 获取模板数据
  },
  computed: {
    ...mapGetters(["getCurrentCityId"])
  },
  watch: {
    show() {
      this.visible = this.show;
    }
  },
  methods: {
    // 获取模板数据
    getData() {
      modelSelectDetails({ templateId: this.templateId })
        .then(res => {
          let data = res.data.data;
          let rooms = data.rooms;
          for (let i = 0; i < rooms.length; i++) {
            rooms[i]["message"] = 2;
            rooms[i]["spaceDel"] = false;
            for (let j = 0; j < rooms[i].devices.length; j++) {
              let device = rooms[i].devices[j];
              device["typeList"] = [
                device.categoryId,
                device.productTypeId,
                device.productModelId
              ];
              device["modelDel"] = false;
              device["message"] = 3;
            }
          }
          this.modelDetail = data;
        })
        .catch(() => {
        });
    },
    getDrowpDownList() {
      // 空间名称列表
      modelSelectRoomName({ projectId: this.projectId }).then(res => {
        let data = res.data.data;
        this.roomNameList = data;
      });
      //空间朝向列表
      modelSelectOriented().then(res => {
        let data = res.data.data;
        this.roomOrientList = data;
      });
      // 设备类型列表
      modelSelectListModel().then(res => {
        let data = res.data.data;
        this.deviceTypeList = data;
      });
    },
    // 获取添加模板的项目列表
    getProjectList() {
      getProjectName({
        countryId: this.project.countryId,
        provinceId: this.project.provinceId,
        cityId: this.project.cityId
      }).then(res => {
        let data = res.data.data;
        this.importModelArr = data;
        this.project.projectId = this.importModelArr[0].projectId;
        this.checkModelId = this.importModelArr[0].projectId;
        this.getAllhouseList();
      });
    },
    // 获取对应项目下的模板列表
    getAllhouseList() {
      modelFindAllhouse({
        projectId: this.checkModelId
      }).then(res => {
        let data = res.data.data;
        this.importModelCode = data;
      });
    },
    // 添加空间

    // 使用模板添加
    openAddModel() {
      this.isEdit = false;
      this.checkModelId = null;
      this.checkModelCode = null;
      this.modelPopover = true;
      this.getProjectList();
    },
    // 选择项目
    getProjectId(checkModelId) {
      this.checkModelId = checkModelId;
      this.getAllhouseList();
      this.checkModelCode = null;
    },
    // 选择模板
    getModelId(checkModelCode) {
      this.checkModelCode = checkModelCode;
    },
    // 导入模板
    modelPoverAdd() {
      // 导入模板
      modelInserToUser({
        copyProjectId: this.checkModelId,
        projectId: this.projectId,
        modelId: this.checkModelCode
      }).then(res => {
        if (res.data.err_CODE == 0) {
          // 更新空间名称列表
          modelSelectRoomName({ projectId: this.projectId }).then(response => {
            let data = response.data.data;
            this.roomNameList = data;
          });
          this.modelCopy();
        }
      });
    },
    // 导入模板信息
    modelCopy() {
      if (this.checkModelCode == null || this.checkModelCode == "")
        return this.$message.error("请选择模板编号！");
      modelSelectDetails({ templateId: this.checkModelCode }).then(res => {
        let data = res.data.data;
        let oldRooms = data.rooms;
        if (oldRooms.length) {
          let roomList = this.roomNameList;
          for (let i = 0; i < oldRooms.length; i++) {
            oldRooms[i]["roomId"] = null;
            oldRooms[i]["message"] = 2;
            oldRooms[i]["spaceDel"] = false;
            // 把导入进来的空间id替换成当前项目下的id
            for (let k = 0; k < roomList.length; k++) {
              if (oldRooms[i]["roomName"] == roomList[k]["roomName"]) {
                oldRooms[i]["roomNameId"] = roomList[k]["nameId"];
              }
            }
            for (let j = 0; j < oldRooms[i].devices.length; j++) {
              let device = oldRooms[i].devices[j];
              device["deviceId"] = null;
              device["typeList"] = [
                device.categoryId,
                device.productTypeId,
                device.productModelId
              ];
              device["modelDel"] = false;
              device["message"] = 3;
            }
          }
          let rooms = this.modelDetail.rooms;
          let newRooms = rooms.concat(oldRooms);
          this.$set(this.modelDetail, "rooms", newRooms);
          this.$message.success("添加成功！");
          this.modelPopover = false; // 关闭弹窗
          this.getTipText();
        } else {
          this.$message({
            type: "error",
            message: "该模板下没有空间信息！"
          });
        }
      });
    },
    // 直接添加
    addSpace() {
      this.isEdit = false;
      let rooms = this.modelDetail.rooms;
      let newRoom = {
        projectId: null,
        projectName: null,
        roomId: null,
        roomNameId: null,
        roomTitle: null,
        roomName: "",
        orientedId: null,
        oriented: "",
        area: null,
        devices: [],
        message: 2,
        spaceDel: false
      };
      rooms.push(newRoom);
      this.$set(this.modelDetail, "rooms", rooms);
    },
    // 选择空间
    roomSelect(id) {
      this.isEdit = false;
      // 给删除的提示赋值
      let obj = this.roomNameList.find(item => {
        return item.nameId == id;
      });
      let rooms = JSON.parse(JSON.stringify(this.modelDetail.rooms));
      for (let i = 0; i < rooms.length; i++) {
        rooms[i].message = 2;
        if (rooms[i].roomNameId == id) {
          rooms[i].roomName = obj.roomName;
        }
      }
      this.$set(this.modelDetail, "rooms", rooms);
    },
    // 添加设备
    addDevice(roomId, roomIndex) {
      this.isEdit = false;
      this.modelDetail.rooms.forEach((room, index) => {
        if (index === roomIndex) {
          let devices = room.devices;
          let newDevice = {
            deviceId: null,
            deviceName: "",
            productTypeId: null,
            categoryId: null,
            categoryName: "",
            typeName: "",
            productModelId: null,
            productInfo: "",
            typeList: [],
            modelDel: false,
            message: 3
          };
          devices.push(newDevice);
          this.$set(this.modelDetail.rooms[index], "devices", devices);
        }
      });
    },
    // 填写设备名称
    devNameChange(index) {
      this.isEdit = false;
      let devices = JSON.parse(
        JSON.stringify(this.modelDetail.rooms[index].devices)
      );
      for (let i = 0; i < devices.length; i++) {
        devices[i].message = 3;
      }
      this.$set(this.modelDetail.rooms[index], "devices", devices);
    },
    // 选择设备
    deviceSelect(index) {
      this.isEdit = false;
      this.devNameChange(index);
    },
    // 删除空间
    spaceDelete(roomId, index) {
      this.isEdit = false;
      if (roomId) this.deletedRooms.push(roomId);
      let rooms = JSON.parse(JSON.stringify(this.modelDetail.rooms));
      for (let i = 0; i < rooms.length; i++) {
        rooms[i].message = 2;
      }
      rooms.splice(index, 1);
      this.$set(this.modelDetail, "rooms", rooms);
      this.getTipText();
    },
    // 删除设备
    deviceDelete(deviceId, index, devIndex) {
      this.isEdit = false;
      if (deviceId) this.deleteDevices.push(deviceId);
      let devices = JSON.parse(
        JSON.stringify(this.modelDetail.rooms[index].devices)
      );
      for (let i = 0; i < devices.length; i++) {
        devices[i].message = 3;
      }
      devices.splice(devIndex, 1);
      this.$set(this.modelDetail.rooms[index], "devices", devices);
      this.getTipText();
    },
    // 处理提示信息（需要优化）
    getTipText() {
      this.flag = true;
      let data = JSON.parse(JSON.stringify(this.modelDetail));
      let rooms = data.rooms;
      for (let i = 0; i < rooms.length; i++) {
        if (rooms[i].roomNameId == null || rooms[i].roomNameId == "") {
          rooms[i]["message"] = 0;
          this.flag = false;
        } else if (rooms[i].roomNameId) {
          // 空间名称重复 0:为空 1:重复, 2: 正常，3：面积判断
          for (let q = i + 1; q < rooms.length; q++) {
            if (rooms[i].roomNameId === rooms[q].roomNameId) {
              rooms[i].message = 1;
              rooms[q].message = 1;
              this.flag = false;
            }
          }
        }
        if (
          (rooms[i].area && rooms[i].message == 2) ||
          (rooms[i].area && rooms[i].message == 3)
        ) {
          let reg = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
          if (!reg.test(rooms[i].area) || rooms[i].area > 2000) {
            rooms[i]["message"] = 3;
            this.flag = false;
          }
        }
        for (let j = 0; j < rooms[i].devices.length; j++) {
          let dev = rooms[i].devices[j];
          let reg = /^.{1,10}$/;
          if (!reg.test(dev.deviceName)) {
            dev.message = 0;
            this.flag = false;
          } else if (dev.typeList == null || dev.typeList == "") {
            dev.message = 1;
            this.flag = false;
          } else {
            // 设备名称重复 0:设备名为空，1: 未选择设备信息，2:重复, 3: 正常
            for (let p = j + 1; p < rooms[i].devices.length; p++) {
              let devs = rooms[i].devices;
              if (devs[j].deviceName === devs[p].deviceName) {
                devs[j].message = 2;
                devs[p].message = 2;
                this.flag = false;
              }
            }
          }
        }
      }
      this.modelDetail = data;
    },
    // 把空间和设备message重置为正常，确定时重新处理
    getTip(message, type) {
      if (type == 0) {
        if (message === 0) return "未选择空间！";
        if (message === 1) return "空间重复！";
        if (message === 2) return "";
        if (message === 3) return "最大值为2000，支持精确到小数点后两位！";
      } else {
        if (message === 0) return "设备名称1-10个字符！";
        if (message === 1) return "请选择产品信息！";
        if (message === 2) return "设备名称重复！";
        if (message === 3) return "";
      }
    },
    // 设备信息保存
    saveDeviceMes() {
      if (this.isEdit) {
        // 是否修改过
        this.$emit("dialogClose", true);
        return;
      }
      if (!this.flag) return; // 是否通过验证
      let rooms = JSON.parse(JSON.stringify(this.modelDetail.rooms));
      let newRooms = [];
      for (let i = 0; i < rooms.length; i++) {
        newRooms.push({
          area: rooms[i].area,
          devices: [],
          orientedId: rooms[i].orientedId,
          projectId: rooms[i].projectId,
          projectName: rooms[i].projectName,
          roomId: rooms[i].roomId,
          roomName: rooms[i].roomName,
          roomNameId: rooms[i].roomNameId
        });
        let newDevice = [];
        for (let j = 0; j < rooms[i].devices.length; j++) {
          let device = rooms[i].devices[j];
          newDevice.push({
            deviceId: device.deviceId,
            deviceName: device.deviceName,
            productModelId: device.typeList[2]
          });
        }
        newRooms[i]["devices"] = newDevice;
      }

      let houseTemplateRequestBean = {
        deleteDevices: this.deleteDevices,
        deletedRooms: this.deletedRooms,
        projectId: this.projectId,
        projectName: this.modelDetail.projectName,
        rooms: newRooms,
        templateId: this.modelDetail.templateId,
        templateName: this.modelDetail.templateName,
        templateTitle: this.modelDetail.templateTitle
      };

      modelUpdateDevice(houseTemplateRequestBean).then(res => {
        if (res.err_CODE == 0) {
          this.$message.success(res.err_MESSAGE);
          this.$emit("dialogClose", true);
        } else {
          this.$message.error(res.err_MESSAGE);
        }
      });
    },
    areaNumber(e) {
      this.isEdit = false;
      let rooms = JSON.parse(JSON.stringify(this.modelDetail.rooms));
      for (let i = 0; i < rooms.length; i++) {
        rooms[i].message = 2;
      }
      this.$set(this.modelDetail, "rooms", rooms);
    },
    // 组件的方法
    // 关闭dialog
    dialogClose() {
      this.$confirm("是否放弃编辑?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        showClose: false
      })
        .then(() => {
          this.$emit("dialogClose", true);
        })
        .catch(() => {});
    },
    // 确定dialog
    dialogConfim() {
      this.getTipText();
      this.saveDeviceMes();
    }
  }
};
</script>
<style lang="scss">
#content {
  .el-input__inner {
    width: 120px;
    font-size: 12px;
    border-radius: 0;
    font-weight: 500;
    color: #323232;
    line-height: 20px;
    outline: none;
  }
  .space .el-input__inner {
    background: rgba(175, 124, 88, 0.3);
  }
  .type {
    .el-cascader {
      width: 100%;
      .el-input__inner {
        width: 100%;
      }
    }
  }

  padding-bottom: 180px;
  .el-col {
    padding-top: 10px;
    &.icon {
      i.el-icon-circle-close {
        cursor: pointer;
        line-height: 24px;
        font-size: 18px;
        color: #af7c58;
        vertical-align: middle;
      }
    }
  }
  .card {
    padding-bottom: 24px;
    margin-bottom: 14px;
    position: relative;
    // 空间
    .space {
      font-size: 12px;
      margin-bottom: 5px;
      .top {
        font-size: 14px;
      }
      .el-col {
        width: 140px;
        &.icon {
          display: block;
          padding-left: 0px !important;
          width: 20px;
          line-height: 24px;
          p {
            text-align: center;
          }
        }
        &.area {
          position: relative;
          span {
            position: absolute;
            height: 28px;
            right: 16px;
            top: 14px;
          }
        }
      }
      // 提示信息
      .el-col.tip {
        width: 320px !important;
        padding-left: 24px !important;
        line-height: 27px;
        color: #cc3d3d;
        font-size: 12px;
      }
    }
    // 设备
    .devices {
      .el-col {
        width: 140px;
        .top {
          margin-bottom: 8px;
        }
        &.type {
          width: 277.5px;
          padding-right: 10px !important;
        }
        &.icon {
          padding-left: 0px !important;
          display: block;
          width: 20px;
          line-height: 24px;
        }
      }
      .el-col.tip {
        width: 320px !important;
        padding-left: 24px !important;
        line-height: 27px;
        color: #cc3d3d;
        font-size: 12px;
      }
    }
    .addDevice {
      margin-top: 14px;
    }
    .addSpace {
      margin-top: 14px;
    }
    &::after {
      position: absolute;
      bottom: 0;
      display: block;
      content: " ";
      width: 100%;
      height: 2px;
      background: #dedede;
    }
  }
}
#modal {
  .el-dialog {
    display: flex;
    flex-direction: column;
    height: 80%;
    margin: 0 auto;
    margin-top: 10vh;
    .el-dialog__header {
      font-size: 16px;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
    }
    .el-dialog__body {
      height: 100%;
      padding: 54px 10px 58px 20px;
      color: #323232;
      font-weight: 400;
      .el-scrollbar {
        height: 100%;
        .el-scrollbar__wrap {
          box-sizing: border-box;
          overflow-x: hidden;
          padding-right: 17px;
        }
      }
    }
    // 选择模板
    .modelSelect {
      .el-popover {
        width: 220px;
        position: absolute;
        left: 110px;
        top: -0px;
        p {
          margin-bottom: 10px;
        }
        .el-input {
          width: 100%;
          margin-bottom: 12px;
        }
        .el-input__inner {
          width: 100% !important;
        }
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
  }
}
</style>
