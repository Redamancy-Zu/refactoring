<template>
  <div id="iotDevice" :style="{minHeight: minHeight + 'px'}">
  	<div class="spaceMA">
      <span>您没有IoT设备管理的查看权限！</span>
   </div>
    <div class="spaceMB" :style="{minHeight: minHeightInner + 'px'}" v-fence="{data:'', functions:['查看IoT设备列表']}">
      <div class="sel-container">
      <p>
        <span class="unit">选择项目/所属网关</span>
         <el-cascader
          :options="projectNameAll"
          size="mini"
          v-model="iotDeviceParam.projectName"
          v-snap="iotDeviceParam.projectName"
          @change="iotProject" 
        ></el-cascader>
      </p>
        <p>
        <span class="unit">选择节点类型</span>
        <!-- 单元列表-->
        <!-- <el-select
          size="mini"
          v-model="iotDeviceParam.nodeType"
          placeholder="全部"
          @change="iotProject"
          v-snap="iotDeviceParam.nodeType"
        >
          <el-option
            v-for="(item,index) in nodeTypes"
            :key="index"
            :label="item.name"
            :value="item.code"
          ></el-option>
        </el-select> -->
        <common-select :nodeType="iotDeviceParam.nodeType" :nodeTypes="nodeTypes" @iotProject = "iotProject">  </common-select>
      </p>
      <p>
        <span class="unit">选择品牌</span>
        <!-- 单元列表-->
        <el-select
          size="mini"
          v-model="iotDeviceParam.brandName"
          placeholder="全部"
          @change="iotProject"
          v-snap="iotDeviceParam.brandName"
        >
          <el-option
            v-for="(item,index) in brandNameAll"
            :key="index"
            :label="item.brandName"
            :value="item.brandName"
          ></el-option>
        </el-select>
      </p>
      <p>
        <span class="unit">选择型号</span>
        <!-- 楼层列表-->
        <el-select
          size="mini"
          v-model="iotDeviceParam.modelName"
          placeholder="全部"
          @change="iotProject"
          v-snap="iotDeviceParam.modelName"
        >
          <el-option
            v-for="(item,index) in modelNameAll"
            :key="index"
            :label="item.modelName"
            :value="item.modelName"
          ></el-option>
        </el-select>
      </p>
      <p>
        <span class="unit">选择绑定状态</span>
        <el-select
          size="mini"
          v-model="iotDeviceParam.bindingStatusId"
          @change="iotProject"
          v-snap="iotDeviceParam.bindingStatusId"
        >
          <el-option
            v-for="(item,index) in SelecBInAll"
            :key="index"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </p>
      <p>
        <span class="unit">选择在线状态</span>
        <el-select
          size="mini"
          v-model="iotDeviceParam.runStatusId"
          @change="iotProject"
          v-snap="iotDeviceParam.runStatusId"
        >
          <el-option
            v-for="(item,index) in selecRunAll"
            :key="index"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </p>
      <p>
        <el-input class="search" placeholder="设备名/设备ID/所属网关ID" v-model="idFind" v-snap="idFind" size="mini" @keyup.native="idFindChange()">
          <i slot="suffix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </p>
    </div>
    <!-- 维度展示 -->
    <div class="dimension-list">
      <ul>
        <li>
          <div>品牌总数</div>
          <div class="num">
            <span>{{selectNumAll.brandNum}}</span>
            <span>种</span>
          </div>
        </li>
        <li>
          <div>型号总数</div>
          <div class="num">
            <span>{{selectNumAll.modelNum}}</span>
            <span>种</span>
          </div>
        </li>
        <li>
          <div>设备总数</div>
          <div class="num">
            <span>{{selectNumAll.deviceNum}}</span>
            <span>台</span>
          </div>
        </li>
        <li class="echart-box">
          <div id="pie-chart"></div>
          <div class="config-txtT">
            <p>
              <i></i>
              <span>已绑定设备总数:{{selectNumAll.bindingDeviceNum}}台</span>
            </p>
            <p>
              <i></i>
              <span>未绑定设备总数:{{selectNumAll.notBindingDeviceNum}}台</span>
            </p>
          </div>
        </li>
        <li class="echart-box">
          <div id="pie-chartT"></div>
          <div class="config-txt">
            <p>
              <i></i>
              <span>在线设备数:{{selectNumAll.onLineNum}}台</span>
            </p>
            <p>
              <i></i>
              <span>离线设备数:{{selectNumAll.offLineNum}}台</span>
            </p>
            <p>
              <i></i>
              <span>N/A设备数:{{selectNumAll.naNum}}台</span>
            </p>
          </div>
        </li>
      </ul>
    </div>
    <!-- 户内设备管理列表 table -->
    <div class="tb-container">
      <template>
        <el-table :data="tb_data" ref="spaceTable">
          <el-table-column min-width="150" prop="deviceId" label="IoT设备ID"></el-table-column>
          <el-table-column min-width="110" label="IoT设备名" prop="name"></el-table-column>
          <el-table-column min-width="120" prop="gateway" label="所属网关"></el-table-column>
          <el-table-column min-width="120" prop="sn" label="SN号"></el-table-column>
          <el-table-column min-width="189" prop="mac" label="MAC地址"></el-table-column>
          <el-table-column min-width="170" prop="ip" label="IP"></el-table-column>
          <el-table-column min-width="120" prop="brand" label="品牌"></el-table-column>
          <el-table-column min-width="120" prop="model" label="型号"></el-table-column>
          <el-table-column min-width="170" prop="reportAddress" label="上报位置"></el-table-column>
          <el-table-column min-width="169" prop="bindingAddress" label="绑定位置"></el-table-column>
          <el-table-column min-width="126" prop="runStatus" label="在线状态"></el-table-column>
          <el-table-column min-width="150" prop="statusUpdateTime" label="最后上线时间"></el-table-column>
          <el-table-column min-width="118" prop="version" label="固件版本"></el-table-column>
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
    </div>
    </div>
  </div>
</template>

<script>
import echart from "echarts";  //echarts引入
import { getDate } from "../../labs/tools.js"; //时间格式转换
import {
  selectProject, //项目下拉数据
  selectGateway, //网关下拉数据
  selectBrand, //品牌下拉数据
  selectModel, //型号下拉框
  selectBindingStatus, //绑定状态下拉框
  selectRunStatus, //运行状态下拉框
  selectAll, //iot设备列表
  selectNum, //iot设备统计信息
  selectNode //节点类型下拉框数据
} from "../../api/api.js";
// 引入 单元列表 组件 
import commonSelect from '../../Common/select'
export default {
  components:{
    commonSelect,  
  },
  data() {
    return {
      idFind:null,  //模糊搜索
      nodeTypes:[], //节点类型数据
      selectNumAll: {}, //iot设备信息
      minHeight: 0,
      minHeightInner: 0,
      myChart: null, //iot设备绑定数据
      myCharts: null, //iot设备状态统计
      //下拉框数据绑定
      iotDeviceParam: {
        iotDeviceParams:"全部/全部",
        projectName: [null],
        gatewayName: "",
        brandName: "全部",
        modelName: "全部",
        bindingStatusId: null,
        runStatusId: null,
        pageIndex: 1,
        pageSize: 10,
        nodeType:null
      },
      //下拉框数据
      projectNameAll: [],
      brandNameAll: [],
      modelNameAll: [],
      SelecBInAll: [],
      selecRunAll: [],
      pageParams: {
        total: 0
      },
      tb_data: [],  //iotS设备列表
      pieChartData: [
        { value: 0, name: "已绑定设备总数" },
        { value: 0, name: "未绑定设备总数" }
      ],
      pieChartDataT: [
        { value: 0, name: "在线设备数" },
        { value: 0, name: "离线设备数" },
        { value: 0, name: "N/A设备数" }
      ]
    };
  },
  methods: {
    //模糊搜索
    idFindChange() {
      this.iotProject()
    },
    //下拉框改变数据筛选
    iotProject() {
      this.iotDeviceParam.pageSize = 10;
      this.iotDeviceParam.pageIndex = 1;
      setTimeout(() => {
        this.selectA();
      });
      setTimeout(() => {
        this.selectN();
      });
    },
    //echarts图表
    pieChart(pieData, myChart) {
      let option = {
        tooltip: {
          trigger: "item",
          formatter: "{b}: {c}台",
          backgroundColor: '#FFFFFF',
          textStyle: {
            color: '#323232'
          }
        },
        legend: {
          show: false,
          data: ["已绑定设备总数", "未绑定设备总数"]
        },
        color: ["#2C97FF", "#F437FF"],
        series: [
          {
            name: "",
            type: "pie",
            radius: ["45%", "75%"],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false
              },
              emphasis: {
                show: false
              }
            },
            data: pieData
          }
        ]
      };
      myChart.hideLoading();
      myChart.setOption(option);
    },
    //iot设备状态统计
    pieChartT(pieData, myChart) {
      let option = {
        tooltip: {
          trigger: "item",
          formatter: "{b}: {c}台",
          backgroundColor: '#FFFFFF',
          textStyle: {
            color: '#323232'
          }
        },
        legend: {
          show: false,
          data: ["在线设备数", "离线设备数", "N/A设备数"]
        },
        color: ["#0FADFF", "#FFC237", "#3BE8C5"],
        series: [
          {
            name: "",
            type: "pie",
            radius: ["45%", "75%"],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false
              },
              emphasis: {
                show: false
              }
            },
            data: pieData
          }
        ]
      };
      myChart.hideLoading();
      myChart.setOption(option);
    },
    // echart 数据渲染
    initEchartData() {
      let self = this;
      self.myChart = echart.init(document.getElementById("pie-chart"));
      self.myChart.clear();
      self.myChart.showLoading();

      //数据渲染
      self.pieChart(self.pieChartData, self.myChart);
      self.myCharts = echart.init(document.getElementById("pie-chartT"));
      self.myCharts.clear();
      self.myCharts.showLoading();

      //数据渲染
      self.pieChartT(self.pieChartDataT, self.myCharts);
    },
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
    // 项目下拉框
    selectPro() {
      selectProject()
        .then(res => {
          if (res.data !== null) {
            let obj = {
              projectName: "全部/全部"
            };
            let date = res.data.data;
            this.projectNameAll = [{value: null,label:"全部"},...date];
          }
        })
        .catch(() => {});
    },
    //节点类型下拉框
    selectNode() {
      selectNode({}).then(res => {
          if (res.data !== null) {
            let obj = {
              nodeType: "全部"
            };
            let date = res.data.data;
            this.nodeTypes = [{code: null,name:"全部"},...date];
          }
      })
    },
    // 品牌下拉
    selectBra() {
      selectBrand()
        .then(res => {
          if (res.data !== null) {
            let obj = {
              brandName: "全部"
            };
            this.brandNameAll.push(obj);
            res.data.data.forEach(item => {
              if (item) {
                for (const key in item) {
                  if (item[key] == "") {
                  } else {
                    this.brandNameAll.push(item);
                  }
                }
              }
            });
          }
        })
        .catch(() => {});
    },
    // 型号下拉
    selectMod() {
      selectModel()
        .then(res => {
          if (res.data !== null) {
            let obj = {
              modelName: "全部"
            };
            this.modelNameAll.push(obj);
            res.data.data.forEach(item => {
              if (item) {
                for (const key in item) {
                  if (item[key] == "") {
                  } else {
                    this.modelNameAll.push(item);
                  }
                }
              }
            });
          }
        })
        .catch(() => {});
    },
    // 绑定状态下拉
    selectBin() {
      selectBindingStatus()
        .then(res => {
          if (res.data !== null) {
            let obj = {
              name: "全部",
              id: null
            };
            this.SelecBInAll.push(obj);
            res.data.data.forEach(item => {
              if (item) {
                this.SelecBInAll.push(item);
              }
            });
          }
        })
        .catch(() => {});
    },
    // 运行状态下拉
    selectRun() {
      selectRunStatus()
        .then(res => {
          if (res.data !== null) {
            let obj = {
              name: "全部",
              id: null
            };
            this.selecRunAll.push(obj);
            res.data.data.forEach(item => {
              if (item) {
                this.selecRunAll.push(item);
              }
            });
          }
        })
        .catch(() => {});
    },
    // 列表
    selectA() {
      let obj = JSON.parse(JSON.stringify(this.iotDeviceParam));
      if (obj.projectName == "全部/全部") {
        obj.projectName = null;
        obj.gatewayName = null;
      }
      if (obj.gatewayName !== "全部") {
         obj.gatewayName = obj.projectName.length!==0?obj.projectName[1]:null;
      }
      if(obj.nodeType == "全部") {
        obj.nodeType = null
      }
      if (obj.brandName == "全部") {
        obj.brandName = null;
      }
      if (obj.modelName == "全部") {
        obj.modelName = null;
      }
       if (obj.projectName !== null) {
        obj.projectName = obj.projectName.length!==0?obj.projectName[0]:null;
      }
      const loading = this.$loading({
        lock: true,
        target: document.querySelector('#iotDevice')
      });
      selectAll({keyWords:this.idFind,...obj})
        .then(res => {
          if (res.data !== null) {
            res.data.list.forEach((item, index) => {
              for (const key in item) {
                if (key == "statusUpdateTime") {
                  if (/^\s*$/.test(item[key]) || item[key] == null) {
                    item[key] = "-";
                  } else {
                    item[key] = getDate(item[key]);
                  }
                }
                if (/^\s*$/.test(item[key]) || item[key] == null) {
                  item[key] = "-";
                }
              }
            });
            this.tb_data = res.data.list;
            this.pageParams.total = res.data.total;
            loading.close();
          }
        })
        .catch(() => {
          loading.close();
        });
    },
    // 设备统计信息
    selectN() {
      let data = {
        projectName: this.iotDeviceParam.projectName[0],
        gatewayName: this.iotDeviceParam.projectName[1],
        brandName: this.iotDeviceParam.brandName,
        modelName: this.iotDeviceParam.modelName,
        bindingStatusId: this.iotDeviceParam.bindingStatusId,
        runStatusId: this.iotDeviceParam.runStatusId, //不必填
        nodeType:this.iotDeviceParam.nodeType
      };
      if (data.projectName == "全部/全部") {
        data.projectName = null;
        data.gatewayName = null;
      }
      if(data.nodeType == "全部") {
        data.nodeType = null
      }
      if (data.brandName == "全部") {
        data.brandName = null;
      }
      if (data.modelName == "全部") {
        data.modelName = null;
      }
      //设备状态统计
      selectNum({keyWords:this.idFind,...data})
        .then(res => {
          if (res.data !== null) {
            this.selectNumAll = res.data;
            let obj = [
              { value: res.data.bindingDeviceNum, name: "已绑定设备总数" },
              { value: res.data.notBindingDeviceNum, name: "未绑定设备总数" }
            ];
            this.pieChartData = obj;
            this.pieChart(this.pieChartData, this.myChart);
            let objT = [
              { value: res.data.onLineNum, name: "在线设备数" },
              { value: res.data.offLineNum, name: "离线设备数" },
              { value: res.data.naNum, name: "N/A设备数" }
            ];
            this.pieChartDataT = objT;
            this.pieChartT(this.pieChartDataT, this.myCharts);
          }
        })
        .catch(() => {});
    }
  },
  mounted() {
    this.minHeight = window.innerHeight - 95;
    this.minHeightInner = window.innerHeight - 195;
    this.selectPro(); //项目/所属网关下拉框
    this.selectBra(); //品牌下拉框
    this.selectMod(); //型号下拉框
    this.selectBin(); //绑定状态下拉框
    this.selectRun(); //运行状态下拉框
    this.selectA(); //iot设备列表
    this.initEchartData(); //iot设备绑定统计图
    this.selectN(); //iot设备统计
    this.selectNode(); //节点类型下拉框

  }
};
</script>
<style lang="scss">
#iotDevice {
  /*主颜色值*/
  $header-bgColor: #1e2e4c;
  $aside-bgColor: #1e2e4c;
  $container-bgColor: #f1f1f1; //大背景色 没生效
  $content-bgColor: #ffffff; //小背景色
  $font-color: #adadad;
  $crb-fontColor: #0fadff;
  $td-border: 1px solid #DADADA;
  $y-color: #af7c58;
  $new-font-color: #323232; //新版字体颜色
  $input-backgroundColor: #4097ea;
  background: $content-bgColor;

  display: flex;
  flex-direction: column;
  padding: 6px 15px;
  box-sizing: border-box;
  position: relative;
  .spaceMA{
    z-index: 10;
    span{
      position: absolute;
      top:50%;
      left:50%;
      width:100%;
      transform:translate(-50%,-50%);
      text-align: center; 
      color:#ADADAD;
      font-size:14px;
    }
  }
  .spaceMB{
    position: relative;
    z-index: 100;
    background: #fff
  }
  //tab表格高亮显示状态
  .el-table--enable-row-hover .el-table__body tr:hover > td {
    background-color: transparent !important;
  }
  //提示
  .el-tooltip__popper.is-dark {
    background: #ffffff !important;
  }
  .sel-container {
    padding: 10px 0;
    margin-bottom: 10px;
    p {
      display: inline-block;
      margin-right: 32px;
    }
    .search {
      width: 200px;
      .el-icon-search{
        padding-left:10px;
      }
      .el-input__inner {
        width: 200px;
        background:#d9eafb;
        border: 0;
        color: $new-font-color;
      }
    }
    .el-cascader .el-input .el-input__inner {
      background: #d9eafb;
      border: 0;
      height: 28px !important;
      color: #323232;
      border-radius: 2px;
      font-size: 12px;
    }
    .el-select .el-input {
      .el-input__suffix {
        right: 0;
      }
      .el-input__inner {
        padding: 0 0 0 5px;
        width: 160px;
      }
    }
    .el-select {
      padding-left: 10px;
      margin-bottom: 15px;
      .el-input__inner {
        background: #d9eafb;
        border: 0;
        height: 28px !important;
        color: #323232;
        border-radius: 2px;
        font-size: 12px;
      }
    }
    .unit {
      color: #323232;
      font-size: 12px;
      &:last-of-type {
        margin-right: 5px;
      }
      &:first-child {
        padding-left: 0;
      }
    }
    .checkbox-input {
      margin-left: 5px;
      margin-top: -2px;
      margin-bottom: 1px;
      vertical-align: middle;
    }
  }
  .dimension-list {
    ul {
      display: flex;
      flex-direction: row;
      li {
        width: 20%;
        height: 106px;
        background: #e7f6ff;
        margin-left: 12px;
        padding: 14px;
        box-sizing: border-box;
        div {
          color: #323232;
          font-size: 12px;
        }
        div.num {
          span:first-child {
            font-size: 48px;
            font-weight: 400;
          }
        }
      }
      li:first-child {
        margin-left: 0;
      }
      li.echart-box {
        width: 30%;
        display: flex;
        // justify-content: space-between;
        flex-direction: row;
        padding-right: 23px;
        padding-left: 0;
        div#pie-chart {
          width: 80px;
          height: 80px;
          align-self: center;
        }
        div#pie-chartT {
          width: 80px;
          height: 80px;
          align-self: center;
        }
        div.config-txt {
          p {
            display: flex;
            flex-direction: row;
            i {
              width: 4px;
              height: 4px;
              background-color: #ffc237;
              margin-left: 6px;
              margin-right: 4px;
            }
            i,
            span {
              align-self: center;
            }
            span {
              width: calc(100% -4px);
            }
            height: 26px;
            line-height: 26px;
          }
          p:first-child {
            i {
              background: #0fadff;
            }
          }
          p:nth-of-type(3) {
            i {
              background: #3be8c5;
            }
          }
        }
        div.config-txtT {
          p {
            display: flex;
            flex-direction: row;
            i {
              width: 4px;
              height: 4px;
              background-color: #f437ff;
              margin-left: 6px;
              margin-right: 4px;
            }
            i,
            span {
              align-self: center;
            }
            span {
              width: calc(100% -4px);
            }
            height: 26px;
            line-height: 26px;
          }
          p:first-child {
            i {
              background: #2c97ff;
            }
          }
        }
      }
    }
    margin-bottom: 20px;
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
        padding: 6.5px 0;
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
        }
      }
    }
  }
  .el-pagination {
    padding: 2px 0;
  }
  .paging{
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
