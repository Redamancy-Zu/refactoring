<template>
  <div class="overview">
    <div class="overTitle">
      <div>金茂项目概览</div>
      <div class="update">{{globleItems.queryTime}}更新</div>
    </div>
    <div class="overViewWrap">
      <div class="overViewLeft">
        <div class="allProject">
          <div class="totalProject">总体项目</div>
          <div class="projectNum">
            <div class="oneProject">
              <div class="total">项目总数</div>
              <div class="num">
                <span>{{globleItems.projectNum}}</span>个
              </div>
            </div>
            <div class="oneProject">
              <div class="total">已接入项目数</div>
              <div class="num">
                <span>{{globleItems.intelligentNum}}</span>个
              </div>
            </div>
            <div class="oneProject">
              <div class="total">接入比例</div>
              <div class="num">
                <span>{{globleItems.percentage}}</span>%
              </div>
            </div>
          </div>
        </div>
        <div class="allProject" id="intelligentProject">
          <div class="totalProject">已接入项目</div>
          <div class="projectNum">
            <div class="oneProject">
              <div class="total">建筑总数</div>
              <div class="num">
                <span>{{intelligent.buildingNum}}</span>栋
              </div>
            </div>
            <div class="oneProject">
              <div class="total">户型总数</div>
              <div class="num">
                <span>{{intelligent.houseModelNum}}</span>种
              </div>
            </div>
            <div class="oneProject">
              <div class="total">总户数</div>
              <div class="num">
                <span>{{intelligent.houseNum}}</span>户
              </div>
            </div>
          </div>
          <div class="projectNum">
            <div class="oneProject">
              <div class="total">设备总数</div>
              <div class="num">
                <span>{{intelligent.deviceNum}}</span>台
              </div>
            </div>
            <div class="oneProject">
              <div class="total">已绑定设备数</div>
              <div class="num">
                <span>{{intelligent.bindingDeviceNum}}</span>台
              </div>
            </div>
            <div class="oneProject">
              <div class="total">设备绑定完成比例</div>
              <div class="num">
                <span>{{intelligent.percentage}}</span>%
              </div>
            </div>
          </div>
        </div>
        <div id="deviceSort">
          <div class="deviceAllSort">设备分类</div>
          <div v-show="lables.names.length" id="deviceEcharts"></div>
          <div v-show="lables.names.length" id="lables">
            <div
              class="deviceMessage"
              v-for="(item,index) in lables.names"
              :key="index"
            >
              <span
                class="deviceCheck"
                :style="{'background-color':lables.colors[index]}"
              ></span>
              <span>{{item.name}}</span>
            </div>
          </div>
          <div class="deviceClear" v-show="!lables.names.length"
          >暂无！</div>
        </div>
      </div>
      <div class="overViewCenter">
        <div class="projectMap">
          <div class="mapTitle">全国项目分布及状态统计</div>
          <div id="mapContent"></div>
          <div id="mapLabs">
            <div>
              未接入
              <span class="noAccess"></span>
            </div>
            <div>
              全接入
              <span class="access"></span>
            </div>
            <div>
              接入比例
              <span class="zero">0</span>
              <span class="progress1"></span>
              <span class="progress2"></span>
              <span class="progress3"></span>
              <span class="progress4"></span> 100%
            </div>
          </div>
        </div>
        <div id="addDeviceLine">
          <div class="lineTitle">
            <div>设备增加趋势(近一年)</div>
            <div v-show="showLine" class="deviceNum">
              <span class="blue"></span>已绑定设备数
              <span class="yellow"></span>设备总数
            </div>
          </div>
          <div v-show="showLine" id="deviceLine"></div>
          <div class="addLineClear" v-show="!showLine"
          >暂无！</div>
        </div>
      </div>
      <div class="overViewRight">
        <div class="projectWarn">
          <div class="warnName">项目告警</div>
          <div class="wranList">
            <el-scrollbar>
              <div v-if="warnListDate.length!=0">
                <div class="oneList" v-for="(item,index) in warnListDate" :key="index">
                  <div class="oneWarnName">{{item.city}} {{item.project}}</div>
                  <div class="warnState">
                    异常：
                    <span>{{item.abnormal}}</span>离线：
                    <span>{{item.offLine}}</span>
                    安全告警：
                    <span>{{item.securityAlarm}}</span>疑似安全告警：
                    <span>{{item.suspectedSecurityAlarm}}</span>维护中：
                    <span>{{item.onMaintain}}</span>
                  </div>
                </div>
              </div>
              <div class="wanClear" v-else
              >暂无！</div>
            </el-scrollbar>
          </div>
        </div>
        <div class="deviceLabs">
          <div class="deviceName">
            <div class="deviceLableTitle">热点标签Top5</div>
            <el-select v-model="Labvalue" placeholder @change="titleHandel">
              <el-option
                v-for="item in Labs"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </div>
          <div v-show="lables1.names.length" id="labsChart"></div>
          <div v-show="lables1.names.length" id="labsTap">
            <div
              class="hotFooter"
              v-for="(item,index) in lables1.names"
              :key="index"
            >
              <span
                class="hotBefore"
                :style="{'background-color':lables1.colors[index]}"
              ></span>
              <span>{{item.name}}</span>
            </div>
          </div>
          <div class="hotClear" v-show="!lables1.names.length"
          >暂无！</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import echart from "echarts"; //echarts图表库
import "echarts/map/js/china.js"; //echarts中国地图
import { formatMoney, removeFormatMoney } from "../../labs/tools.js";
import {
  oGeneral, //总体项目
  oIntelligent, //接入项目
  oAlarm, //项目告警
  oDeviceCategory, //设备分类统计
  pSelectModelLabelType, //热点标签分类下拉
  oDeviceLabel, //热点标签
  oDeviceRegion, //按区域显示项目的设备统计
  oDeviceGrowthTrend //设备增长趋势
} from "../../api/api.js";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "",
  data() {
    return {
      Labvalue: null,
      Labs: [],
      warnListDate: ["", "", "", "", ""],
      lables: {
        colors: [
          "#0FADFF",
          "#EB962E",
          "#1EDCA4",
          "#662DFF",
          "#F05E2A",
          "#FFDA45",
          "#1EDC29",
          "#D93B2B",
          "#1686C0",
          "#D01EDC",
          "#163DC0"
        ],
        names: [
          "照明",
          "温控器(集中式)",
          "温控器(分户式)",
          "魔镜",
          "智能网关",
          "窗帘"
        ]
      },
      lables1: {
        colors: ["#0FADFF", "#EC972F", "#662DFF", "#F05E2A", "#01E29F"],
        names: ["传感", "温控", "连网", "连网1", "连网2"]
      },
      globleItems: {},
      intelligent: {},
      deviceGrowthDate: [],
      showLine: true
    };
  },
  created() {
    this.globleItem(); //总体项目
  },
  methods: {
	//热点标签下拉
    titleHandel(value) {
      oDeviceLabel({ labelTypeCode: value })
        .then(res => {
          if (res.data.deviceLabel) {
            this.lables1.names = res.data.deviceLabel;
            this.barChart();
          }
        })
        .catch(() => {});
	},
	//项目总体
    globleItem() {
    const loading = this.$loading({
      lock: true,
      target: document.querySelector('.overview')
    });
      oGeneral()
        .then(res => {
          if (res.data.data !== null) {
            if (res.data.data.queryTime) {
              let timeStamp = JSON.parse(
                JSON.stringify(res.data.data.queryTime)
              );
              const d = timeStamp ? new Date(timeStamp * 1000) : new Date();
              const year = d.getFullYear();
              let month = d.getMonth() + 1;
              month = month < 10 ? "0" + month : month;
              let date = d.getDate();
              date = date < 10 ? "0" + date : date;
              let hours = d.getHours();
              hours = hours < 10 ? "0" + hours : hours;
              let minutes = d.getMinutes();
              minutes = minutes < 10 ? "0" + minutes : minutes;
              let resStr = "";
              resStr =
                year +
                "年" +
                month +
                "月" +
                date +
                "日" +
                hours +
                ":" +
                minutes;
              res.data.data.queryTime = resStr;
            }
            if (res.data.data.projectNum) {
              res.data.data.projectNum = formatMoney(
                res.data.data.projectNum,
                0
              );
            }
            if (res.data.data.intelligentNum) {
              res.data.data.intelligentNum = formatMoney(
                res.data.data.intelligentNum,
                0
              );
            }
			      this.globleItems = res.data.data;
			      //请求成功关闭loading
            loading.close();
          }
        })
        .catch(() => {
		    //关闭loading
        loading.close();
		}); 
	  //接入项目
      oIntelligent()
        .then(res => {
          if (res.data.data) {
            if (res.data.data.buildingNum) {
              res.data.data.buildingNum = formatMoney(
                res.data.data.buildingNum,
                0
              );
            }
            if (res.data.data.houseModelNum) {
              res.data.data.houseModelNum = formatMoney(
                res.data.data.houseModelNum,
                0
              );
            }
            if (res.data.data.houseNum) {
              res.data.data.houseNum = formatMoney(res.data.data.houseNum, 0);
            }
            if (res.data.data.deviceNum) {
              res.data.data.deviceNum = formatMoney(res.data.data.deviceNum, 0);
            }
            if (res.data.data.bindingDeviceNum) {
              res.data.data.bindingDeviceNum = formatMoney(
                res.data.data.bindingDeviceNum,
                0
              );
            }
            this.intelligent = res.data.data;
          }
        })
		.catch(() => {});
	  //项目告警
      oAlarm()
        .then(res => {
          if (res.data.data.alarm != null) {
            this.warnListDate = res.data.data.alarm;
          }
        })
		.catch(() => {});
	  //热点标签下拉
      pSelectModelLabelType()
        .then(res => {
          if (res.data.data) {
            this.Labs = res.data.data;
            this.Labvalue = res.data.data[0].code;
            this.titleHandel(this.Labvalue);
          }
        })
        .catch(() => {});
      oDeviceLabel({ labelTypeCode: this.Labvalue })
        .then(res => {
          if (res.data.deviceLabel) {
            this.lables1.names = res.data.deviceLabel;
          }
        })
        .catch(() => {});
      oDeviceCategory().then(res => {
        if (res.data.data.deviceCategory) {
          this.lables.names = res.data.data.deviceCategory;
          this.pieChart(this.lables.names);
        }
      });
      oDeviceRegion({}).then(res => {
        res.data.data.region.forEach((item, index) => {
          res.data.data.region[index].name = item.city;
          res.data.data.region[index].value = item.coordinate;
          if (item.percentageType == 1) {
            res.data.data.region[index].value.push(0);
          } else if (item.percentageType == 2) {
            res.data.data.region[index].value.push(50);
          } else if (item.percentageType == 3) {
            res.data.data.region[index].value.push(100);
          } else if (item.percentageType == 4) {
            res.data.data.region[index].value.push(150);
          } else if (item.percentageType == 5) {
            res.data.data.region[index].value.push(200);
          } else if (item.percentageType == 6) {
            res.data.data.region[index].value.push(250);
          }
        });
        let echartsData = res.data.data.region;
        this.mapChart(echartsData);
      });
      oDeviceGrowthTrend({}).then(res => {
        let echartsData = [];
        let deviceNum = [];
        let bindingNum = [];
        let DateNum = [];
        res.data.data.deviceGrowthTrend.forEach((item, index) => {
          DateNum.push(item.month);
          deviceNum.push(item.deviceNum);
          bindingNum.push(item.bindingNum);
        });
        if (DateNum.length) {
          this.showLine = true;
        } else {
          this.showLine = false;
        }
        let datelength = 12 - DateNum.length;
        for (var m = 0; m < datelength; m++) {
          DateNum.push("");
        }
        echartsData.push(DateNum);
        echartsData.push(deviceNum);
        echartsData.push(bindingNum);
        this.deviceGrowthDate = echartsData;
        this.lineChart(echartsData);
      });
	},
	//热点标签top
    barChart() {
      let nameData = [];
      let valueData = [];
      this.lables1.names.forEach(item => {
        nameData.push(item.name);
        valueData.push(item.value);
      });
      let myChart = echart.init(document.getElementById("labsChart"));
      let option = {
        grid: {
          left: 25,
          right: 25,
          bottom: "18%",
          containLabel: true
        },
        tooltip: {
          trigger: "item",
          formatter:
            "<span class='echartsTitle'>{b}</span><br/><span class='echartsContent'>设备数量：{c}台</span>",
          backgroundColor: "#FFFFFF",
          textStyle: {
            color: "#323232"
          },
          position: "top",
          extraCssText: "box-shadow:0px 2px 8px 1px rgba(0,0,0,0.2);"
        },
        xAxis: {
          type: "category",
          nameGap: 2,
          axisTick: {
            show: false
          },
          minInterval: 1,
          axisLine: {
            lineStyle: {
              color: "#D8D8D8"
            }
          },
          axisLabel: {
            show: false
          },
          nameTextStyle: {
            color: "#323232"
          },
          data: nameData
        },
        yAxis: {
          name: "设备数/台",
          type: "value",
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: "#D8D8D8"
            }
          },
          axisLabel: {
            color: "#323232"
          },
          nameTextStyle: {
            color: "#323232"
          }
        },
        series: [
          {
            data: valueData,
            type: "bar",
            barWidth: "20%",
            itemStyle: {
              normal: {
                color: function(params) {
                  var colorList = [
                    "#0FADFF",
                    "#EC972F",
                    "#662DFF",
                    "#F05E2A",
                    "#01E29F"
                  ];
                  return colorList[params.dataIndex];
                }
              }
            }
          }
        ]
      };
      myChart.setOption(option);
      window.onresize = function() {
        myChart.resize();
      };
	},
	//设备增加趋势（近一年）
    lineChart(echartsData) {
      let myChart = echart.init(document.getElementById("deviceLine"));
      let dotHtml =
        '<span style="display:inline-block;margin-right:6px;border-radius:4px;width:6px;height:6px;background-color:#3D90F8"></span>';
      let dotHtml1 =
        '<span style="display:inline-block;margin-right:6px;border-radius:4px;width:6px;height:6px;background-color:#EB962E"></span>';
      let option = {
        grid: {
          left: "3%",
          right: "3%",
          bottom: "20%",
          containLabel: true
        },
        tooltip: {
          trigger: "axis",
          formatter: `<span>{b}</span><span>月</span><br/>${dotHtml}<span>已绑定设备：</span>{c1}台<br/>${dotHtml1}<span>设备总数：</span>{c}台`,
          backgroundColor: "#FFFFFF",
          textStyle: {
            color: "#323232"
          },
          extraCssText: "box-shadow:0px 2px 8px 1px rgba(0,0,0,0.2);"
        },
        xAxis: {
          type: "category",
          data: echartsData[0],
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: "#D8D8D8"
            }
          },
          axisLabel: {
            color: "#323232",
            interval: 0
          },
          nameTextStyle: {
            color: "#323232"
          },
          minInterval: 1
        },
        yAxis: {
          name: "数量/台",
          type: "value",
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: "#D8D8D8"
            }
          },
          axisLabel: {
            color: "#323232"
          },
          nameTextStyle: {
            color: "#323232"
          },
          nameGap: 15
        },
        color: ["#EB962E", "#0FADFF"],
        series: [
          {
            type: "line",
            center: ["40%", "40%"],
            data: echartsData[1]
          },
          {
            type: "line",
            center: ["40%", "40%"],
            data: echartsData[2]
          }
        ]
      };
      myChart.setOption(option);
      window.onresize = function() {
        myChart.resize();
      };
	},
	//设备分类统计图
    pieChart(shuju) {
      let myChart = echart.init(document.getElementById("deviceEcharts"));
      let option = {
        color: [
          "#0FADFF",
          "#EB962E",
          "#1EDCA4",
          "#662DFF",
          "#F05E2A",
          "#FFDA45",
          "#1EDC29",
          "#D93B2B",
          "#1686C0",
          "#D01EDC",
          "#163DC0"
        ],
        tooltip: {
          trigger: "item",
          formatter:
            "<span class='echartsTitle'>{b}</span><br/><span class='echartsContent'>设备数量：{c}台</span><br/><span class='echartsContent'>占比：{d}%</span>",
          backgroundColor: "#FFFFFF",
          textStyle: {
            color: "#323232"
          },
          position: "top",
          extraCssText: "box-shadow:0px 2px 8px 1px rgba(0,0,0,0.2);"
        },
        series: [
          {
            type: "pie",
            radius: ["30%", "45%"],
            center: ["52%", "40%"],
            labelLine: {
              show: false,
              length: 5,
              length2: 10
            },
            label: {
              normal: {
                show: false,
                formatter: "{b}"
              }
            },
            data: shuju
          }
        ]
      };
      myChart.setOption(option);
      window.onresize = function() {
        myChart.resize();
      };
	},
	//全国项目统计
    mapChart(echartsData) {
      let myChart = echart.init(document.getElementById("mapContent"));
      let option = {
        backgroundColor: "transparent",
        tooltip: {
          trigger: "item",
          backgroundColor: "white",
          position: 'right',
          textStyle: {
            color: "black"
          },
          formatter: function(params) {
            return (
              '<span style="font-weight:bold">' +
              params.name +
              '</span><span style="font-weight:bold">市</span>项目总数：' +
              params.data.projectNum +
              "<br/>接入比例：" +
              params.data.percentage +
              '%<br/>健康设备数：<span style="color:#10AB18">' +
              params.data.normal +
              '</span><br/>异常设备数：<span style="color:#FFBE00">' +
              params.data.abnormal +
              '</span><br/>维护中设备数：<span style="color:#FFBE00">' +
              params.data.onMaintain +
              '</span><br/></span>离线设备数：<span style="color:#FFBE00">' +
              params.data.offLine +
              '</span><br/>安全告警设备数：<span style="color:#FFBE00">' +
              params.data.securityAlarm +
              '</span><br/>疑似安全告警设备数：<span style="color:#FFBE00">' +
              params.data.suspectedSecurityAlarm +
              '</span><br/>未绑定设备数：<span style="color:#0FADFF">' +
              params.data.notBinding +
              "</span>"
            );
          }
        },
        visualMap: {
          min: 0,
          max: 250,
          calculable: true,
          show: false,
          inRange: {
            color: [
              "#B6B6B6",
              "#D0FAD5",
              "#9FFC97",
              "#71F463",
              "#04F204",
              "#04B304"
            ],
            opacity: 1
          },
          textStyle: {
            color: "#fff"
          }
        },
        geo: {
          map: "china",
          roam: true,
          label: {
            emphasis: {
              show: false
            }
          },
          regions: [
            {
              name: "南海诸岛",
              value: 0,
              itemStyle: {
                normal: {
                  opacity: 0,
                  label: {
                    show: false
                  }
                }
              }
            }
          ],
          itemStyle: {
            normal: {
              areaColor: "#1CABF4",
              borderColor: "white",
              borderWidth: 1
            },
            emphasis: {
              areaColor: "#1CABF4",
              borderWidth: 2
            }
          }
        },
        series: [
          {
            type: "scatter",
            coordinateSystem: "geo",
            data: echartsData,
            symbolSize: 12,
            label: {
              normal: {
                show: false
              },
              emphasis: {
                show: false
              }
            },
            itemStyle: {
              emphasis: {
                borderColor: "#fff",
                borderWidth: 1
              }
            }
          }
        ]
      };
      myChart.hideLoading();
      if (option && typeof option === "object") {
        myChart.setOption(option, true);
      }
      window.onresize = function() {
        myChart.resize();
      };
    }
  }
};
</script>
<style lang="scss">
@import "../../styles/new-index.scss";
.overview {
  position: relative;
  min-height: 673px;
  padding: 12px 18px 13px 18px;
  background: url("../../assets/img/ovewView/overView.png") 0 0 no-repeat;
  background-size: 100% 100%;
  .echartsTitle {
    color: #323232;
    font-weight: bold;
    font-size: 13px;
  }
  .echartsContent {
    color: #323232;
    font-size: 12px;
  }
  .overTitle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    font-weight: bold;
    color: #323232;
    height: 22px;
    margin-bottom: 7px;
    .update {
      font-size: 12px;
      color: #af7c58;
    }
  }
  .overViewWrap {
    display: flex;
    justify-content: space-between;
    .overViewLeft {
      width: 28%;
      .allProject {
        background: rgba(255, 255, 255, 0.6);
        padding: 12px 10px 0 12px;
        height: 116px;
        box-shadow: 0px 0px 8px 2px rgba(0, 168, 255, 0.18);
        border-radius: 10px;
        margin-bottom: 16px;
        .totalProject {
          color: #323232;
          font-size: 13px;
          font-weight: bold;
          margin-bottom: 16px;
          padding-left: 4px;
          line-height: 12px;
          border-left: 2px solid #0fadff;
        }
        .projectNum {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .oneProject {
            flex: 1;
            color: #323232;
            font-size: 12px;
            font-weight: bold;
            .total {
              line-height: 17px;
            }
            .num {
              line-height: 33px;
            }
            span {
              color: #0fadff;
              font-size: 24px;
            }
          }
        }
      }
      #intelligentProject {
        background: rgba(255, 255, 255, 0.6);
        height: 175px;
        .oneProject span {
          font-size: 20px;
        }
        .projectNum {
          margin-top: 16px;
        }
      }
      #deviceSort {
        background: rgba(255, 255, 255, 0.6);
        height: 296px;
        padding: 12px 0 12px 0;
        box-shadow: 0px 0px 8px 2px rgba(0, 168, 255, 0.18);
        border-radius: 10px;
        position: relative;
        #lables {
          position: absolute;
          left: 12px;
          bottom: 10px;
          span {
            color: #323232;
          }
        }
        .deviceAllSort {
          color: #323232;
          font-size: 13px;
          font-weight: bold;
          padding-left: 4px;
          margin-left: 12px;
          line-height: 12px;
          border-left: 2px solid #0fadff;
        }
        #deviceEcharts {
          width: 300px;
          height: 300px;
          margin: 0 auto;
        }
        .deviceMessage {
          display:inline-block;
          margin-right: 16px;
          .deviceCheck{
            display:inline-block;
            width:10px;
            height:10px;
          }
        }
        .deviceClear{
          font-size: 12px;
          font-weight: 500;
          color: rgb(50, 50, 50);
          line-height: 17px;
          padding-left: 20px;
          padding-top: 15px;
        }
      }
    }
    .overViewCenter {
      width: 42%;
      .projectMap {
        position: relative;
        width: 100%;
        .mapTitle {
          color: #323232;
          font-size: 16px;
          font-weight: bold;
          text-align: center;
          line-height: 22px;
        }
        #mapContent {
          width: 100%;
          height: 350px;
          margin: 0 auto;
        }
        #mapLabs {
          position: absolute;
          left: 0;
          bottom: 30px;
          color: #323232;
          font-size: 12px;
          line-height: 17px;
          .zero {
            margin: 0 6px 0 10px;
          }
          .noAccess,
          .access,
          .progress1,
          .progress2,
          .progress3,
          .progress4 {
            display: inline-block;
            width: 14px;
            height: 10px;
          }
          .noAccess {
            background: #b6b6b6;
            margin-left: 6px;
          }
          .access {
            background: #04b304;
            margin-left: 6px;
          }
          .progress1,
          .progress2,
          .progress3,
          .progress4 {
            width: 18px;
          }
          .progress1 {
            background: #d0fad5;
          }
          .progress2 {
            background: #9ffc97;
          }
          .progress3 {
            background: #71f463;
          }
          .progress4 {
            background: #04f204;
          }
        }
      }
      #addDeviceLine {
        background: rgba(255, 255, 255, 0.6);
        width: 100%;
        height: 250px;
        box-shadow: 0px 0px 8px 2px rgba(0, 168, 255, 0.18);
        border-radius: 10px;
        padding: 14px 0 9px 0;
        .lineTitle {
          padding: 0 16px;
          color: #323232;
          font-size: 13px;
          font-weight: bold;
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          height: 18px;
          .deviceNum {
            font-size: 12px;
            .blue,
            .yellow {
              display: inline-block;
              width: 10px;
              height: 10px;
            }
            .blue {
              background: #0fadff;
              margin-right: 8px;
            }
            .yellow {
              background: #eb962e;
              margin: 0 8px 0 16px;
            }
          }
        }
        #deviceLine {
          width: 100%;
          height: 250px;
        }
        .addLineClear{
          font-size: 12px;
          font-weight: 500;
          color: rgb(50, 50, 50);
          line-height: 17px;
          padding-left: 16px;
          padding-top: 15px;
        }
      }
    }
    .overViewRight {
      width: 28%;
      .projectWarn {
        background: rgba(255, 255, 255, 0.6);
        height: 307px;
        box-shadow: 0px 0px 8px 2px rgba(0, 168, 255, 0.18);
        border-radius: 10px;
        padding: 12px;
        .warnName {
          color: #323232;
          font-size: 13px;
          font-weight: bold;
          margin-bottom: 8px;
          padding-left: 4px;
          line-height: 12px;
          border-left: 2px solid #0fadff;
        }
        .wranList {
          .el-scrollbar {
            height: 270px;
          }
          .el-scrollbar__wrap {
            overflow-x: hidden;
          }
          .oneList {
            height: 58px;
            margin-bottom: 8px;
            background: #ebf4fc;
            padding: 8px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .oneWarnName {
              color: #323232;
              font-size: 12px;
              font-weight: bold;
            }
            .warnState {
              color: #585858;
              font-size: 12px;
              font-weight: bold;
              span {
                color: #0fadff;
                margin-right: 19px;
              }
            }
          }
          .wanClear{
            font-size:12px;
            font-weight:500;
            color:rgba(50,50,50,1);
            line-height:17px;
            padding-left:10px;
            padding-top:8px
          }
        }
      }
      .deviceLabs {
        background: rgba(255, 255, 255, 0.6);
        margin-top: 16px;
        height: 296px;
        box-shadow: 0px 0px 8px 2px rgba(0, 168, 255, 0.18);
        border-radius: 10px;
        position: relative;
        .deviceName {
          padding: 12px 16px 0 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 25px;
          .deviceLableTitle {
            color: #323232;
            font-size: 13px;
            font-weight: bold;
            margin-bottom: 8px;
            margin-top: 5px;
            padding-left: 4px;
            line-height: 12px;
            border-left: 2px solid #0fadff;
          }
          .el-input__suffix {
            right: 0;
          }
          .el-input__inner {
            width: 89px;
            height: 25px;
            padding-left: 2px;
            background: #ebf4fc;
          }
          .el-input__inner::placeholder {
            color: #323232;
          }
          .el-input__icon {
            line-height: 25px;
          }
        }
        #labsChart {
          width: 100%;
          height: 260px;
          margin: 0 auto;
        }
        #labsTap {
          position: absolute;
          left: 24px;
          bottom: 10px;
          span {
            color: #323232;
          }
        }
        .hotFooter{
          display:inline-block;
          margin-right: 16px;
          .hotBefore{
            display:inline-block;
            width:10px;height:10px;
          }
        }
        .hotClear {
          font-size: 12px; 
          font-weight: 500;
          color: rgb(50, 50, 50); 
          line-height: 17px; 
          padding-left: 20px; 
          padding-top: 18px;
        }
      }
    }
  }
}
</style>
