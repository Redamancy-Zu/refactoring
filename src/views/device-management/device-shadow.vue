<template>
  <div id="deviceManagement" :style="{minHeight: minHeight + 'px'}">
    <div class="spaceMA">
      <span>您没有设备影子管理的查看权限！</span>
    </div>
    <div
      class="spaceMB"
      :style="{minHeight: minHeightInner + 'px'}"
      v-fence="{data:'', functions:['查看设备影子列表，设备影子详情']}"
    >
      <div class="deviceCont">
        <div class="sel-container">
          <el-col class="selTitle" :span="24">
            <div class="selTitleCont">
              <div class="selectAll">
                <span class="unit">选择位置</span>
                <!-- 项目列表选择 -->
                <el-select
                  size="mini"
                  v-model="houseInfoParam.projectId"
                  placeholder="全部"
                  @change="projectChange"
                  v-snap="houseInfoParam.projectId"
                >
                  <el-option
                    v-for="(item,index) in projectBuildings"
                    :key="index"
                    :label="item.projectName"
                    :value="item.projectId"
                  ></el-option>
                </el-select>
              </div>
              <div class="selectAll">
                <span class="unit">项目</span>
                <!-- 楼号列表选择-->
                <el-select
                  size="mini"
                  v-model="houseInfoParam.buildId"
                  placeholder="全部"
                  class="buildSelect"
                  :disabled="!houseInfoParam.projectId"
                  @change="buildChange"
                  v-snap="houseInfoParam.buildId"
                >
                  <el-option
                    v-for="(item,index) in BuildingUnits"
                    :key="index"
                    :label="item.buildName"
                    :value="item.buildId"
                  ></el-option>
                </el-select>
              </div>
              <div class="selectAll">
                <span class="unit">栋</span>
                <!-- 单元列表选择-->
                <el-select
                  size="mini"
                  v-model="houseInfoParam.unitId"
                  placeholder="全部"
                  :disabled="!houseInfoParam.buildId || !UnitEnable"
                  class="unitSelect"
                  @change="unitChange"
                  v-snap="houseInfoParam.unitId"
                >
                  <el-option
                    v-for="(item,index) in UnitFloors"
                    :key="index"
                    :label="item.unitName"
                    :value="item.unitId"
                  ></el-option>
                </el-select>
              </div>
              <div class="selectAll">
                <span class="unit">单元</span>
                <!-- 楼层列表选择-->
                <el-select
                  size="mini"
                  v-model="houseInfoParam.floorId"
                  placeholder="全部"
                  class="floorSelect"
                  :disabled="!houseInfoParam.buildId || !FloorEnable"
                  @change="floorChange"
                  v-snap="houseInfoParam.floorId"
                >
                  <el-option
                    v-for="(item,index) in Floors"
                    :key="index"
                    :label="item.floorName"
                    :value="item.floorId"
                  ></el-option>
                </el-select>
              </div>
              <div class="selectAll">
                <span class="unit">层</span>
                <!-- 户列表选择-->
                <el-select
                  size="mini"
                  v-model="houseInfoParam.HouseId"
                  placeholder="全部"
                  class="doorSelect"
                  :disabled="!houseInfoParam.buildId || !houseEnable"
                  v-snap="houseInfoParam.HouseId"
                >
                  <el-option
                    v-for="(item,index) in Households"
                    :key="index"
                    :label="item.name"
                    :value="item.code"
                  ></el-option>
                </el-select>
                <span class="unit">户</span>
              </div>
              <div class="el-select-wrap">
                <!-- 科技系统分类选择 -->
                <span class="units">科技系统分类</span>
                <el-select
                  size="mini"
                  style="width:160px;"
                  v-model="houseInfoParam.fication"
                  v-snap="houseInfoParam.fication"
                >
                  <el-option
                    v-for="(item,index) in systemSort"
                    :key="index"
                    :label="item.name"
                    :value="item.code"
                  ></el-option>
                </el-select>
              </div>
              <!-- 设备健康状态选择 -->
              <div class="el-select-wrap">
                <span class="unit">选择设备健康状态</span>
                <el-select
                  size="mini"
                  style="width:120px"
                  v-model="houseInfoParam.categoryType"
                  v-snap="houseInfoParam.categoryType"
                >
                  <el-option
                    v-for="(item,index) in deviceHealthy"
                    :key="index"
                    :label="item.name"
                    :value="item.code"
                  ></el-option>
                </el-select>
              </div>
              <!-- 设备安全状态选择 -->
              <div class="el-select-wrap">
                <span class="unit">选择设备安全状态</span>
                <el-select
                  size="mini"
                  style="width:120px"
                  v-model="houseInfoParam.securityStatus"
                  v-snap="houseInfoParam.securityStatus"
                  placeholder="全部"
                >
                  <el-option
                    v-for="(item,index) in securityStatus"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
              <!-- 类别 / 类型 / 型号选择 -->
              <div class="el-select-wrap">
                <span class="unit">选择类别 / 类型 / 型号</span>
                <el-cascader
                  v-model="houseInfoParam.categoryTypeModel"
                  v-snap="houseInfoParam.categoryTypeModel"
                  :options="categoryTypeModelList"
                  placeholder="全部"
                  size="mini"
                  style="width:160px"
                  :clearable="isClear"
                ></el-cascader>
              </div>
              <!-- 产品标签选择 -->
              <div class="el-select-wrap">
                <span class="unit">选择产品标签</span>
                <el-cascader
                  v-model="houseInfoParam.label"
                  v-snap="houseInfoParam.label"
                  :options="deviceLabel"
                  placeholder="全部"
                  size="mini"
                  style="width:120px"
                  :show-all-levels="false"
                ></el-cascader>
              </div>
              <!-- 查询 -->
              <div class="selectAll">
                <el-button
                  class="delbtn"
                  type="primary"
                  style="border:none"
                  size="mini"
                  @click="querySelect()"
                >查询</el-button>
              </div>
              <!-- 项目健康状态 -->
              <span class="fr health-score" @click="getProjectRank">项目健康度排名</span>
            </div>
          </el-col>
        </div>
      </div>
      <!-- 维度展示 -->
        <div class="dimension-list">
          <ul>
            <li>
              <div>产品型号总数</div>
              <div class="num">
                <span>{{productModel }}</span>
                <span>种</span>
              </div>
            </li>
            <li>
              <div>设备影子总数</div>
              <div class="num">
                <span>{{deviceShadowTotal}}</span>
                <span>台</span>
              </div>
            </li>
            <li>
              <div>已绑定loT设备影子总数</div>
              <div class="num">
                <span>{{bindDeviceTotal}}</span>
                <span>台</span>
              </div>
            </li>
            <li class="echart-box">
              <div id="pie-chart"></div>
              <div class="config-txt">
                <p>
                  <i style="background:#0FADFF"></i>
                  <span>在线设备数: {{normalDevice }} 台</span>
                </p>
                <p>
                  <i style="background:#FF0000"></i>
                  <span>异常设备数: {{abnormalDevice}} 台</span>
                </p>
                <p>
                  <i style="background:#FFC237"></i>
                  <span>离线设备数: {{offlineDevice}} 台</span>
                </p>
              </div>
              <div class="config-txt">
                <p>
                  <i style="background:#3BE8C5"></i>
                  <span>N/A设备数: {{underMaintenanceDeviceNum}} 台</span>
                </p>
                <p>
                  <i style="background:#8A65F9"></i>
                  <span>维护中设备数: {{maintenanceDevice}} 台</span>
                </p>
                <p>
                  <i style="background:#F437FF"></i>
                  <span>未绑定设备数: {{unboundDevice}} 台</span>
                </p>
              </div>
            </li>
            <li class="echart-box">
              <div id="pie-charts"></div>
              <div style="" class="config-txt">
                <p>
                  <i style="background:#0FADFF"></i>
                  <span>正常设备数: {{normals }} 台</span>
                </p>
                <p>
                  <i style="background:#FF0000"></i>
                  <span>安全告警设备数: {{securityAlarm}} 台</span>
                </p>
                <p>
                  <i style="background:#FFC237"></i>
                  <span>疑似安全告警设备数: {{suspected}} 台</span>
                </p>
              </div>
            </li>
          </ul>
        </div>
      <!-- 户内设备管理列表 table -->
      <div class="tb-container">
        <template>
          <el-table :data="tb_data" @selection-change="itemSelected" ref="spaceTable">
            <el-table-column min-width="44" type="selection"></el-table-column>
            <el-table-column min-width="100" label="设备影子名">
              <template slot-scope="scope">
                <router-link
                  :to="{path:'/deviceShadowDetail', query:{id:scope.row.shadowId,temName:scope.row.deviceName,status:scope.row.seStatus}}"
                  class="txt_underline"
                >{{scope.row.deviceName}}</router-link>
              </template>
            </el-table-column>
            <el-table-column min-width="120" label="产品型号">
              <template slot-scope="scope">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="scope.row.productTypeCategory"
                  placement="bottom"
                >
                  <span>{{scope.row.productModel}}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column min-width="223" label="位置" prop="deviceAddress"></el-table-column>
            <el-table-column min-width="120" label="关联IOT设备名" prop="iotDeviceName"></el-table-column>
            <el-table-column min-width="237" label="关联IOT品牌/型号" prop="iotVenderBrandName"></el-table-column>
            <el-table-column min-width="90" prop="status" label="健康状态"></el-table-column>
            <el-table-column min-width="90" prop="seStatus" label="安全状态"></el-table-column>
            <el-table-column min-width="150" prop="onlineTime" label="最后上线时间"></el-table-column>
            <el-table-column min-width="270" label="固件版本" prop="firmwareVersion"></el-table-column>
          </el-table>
        </template>
        <div class="paging fr" v-snap="houseInfoParam.pageNumber">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="houseInfoParam.pageNumber"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="houseInfoParam.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pageParams.total"
            v-if="pageParams.total"
          ></el-pagination>
        </div>
      </div>
      <!-- 项目排名弹出框 -->
      <el-dialog
        class="health-box"
        :modal-append-to-body="false"
        title="项目健康度排名"
        :visible.sync="projectHealth"
        top="26vh"
        width="576px"
      >
        <span class="time-box">{{lastTime}}发布</span>
        <div class="content">
          <el-table :data="tableData" height="340" size="mini" style="width: 100%">
            <el-table-column align="center" prop="rankId" width="150" label="排名"></el-table-column>
            <el-table-column align="center" prop="projectName" label="项目名称"></el-table-column>
            <el-table-column align="center" prop="score" width="150" label="得分"></el-table-column>
          </el-table>
          <div class="tit-msg">备注：得分=100*(N/A+在线设备数)/设备总数</div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import echart from "echarts"; //echarts图表
import { mapActions, mapGetters } from "vuex"; //城市id全局
import { getDate } from "../../labs/tools.js"; //时间格式转换
import {
  deviceShadowProject,
  deviceShadowBuilding,
  deviceShadowUnit,
  deviceShadowFloor,
  //new
  newGetBuildingInfo,
  getBuildingInfo, //栋下拉框
  getUnitAndFloorInfo, //层下拉框
  deviceShadowDoor, //设备户下拉框
  deviceShadowFition, //设备健康状态下拉框
  deviceShadowStatus, //科技系统分类下拉框
  deviceShadowModelList,//选择类别/类型/型号下拉框
  deviceShadowAllLabel, //产品标签下拉表
  deviceShadowSticsNum, //当前产品，设备影子，iot设备总数
  deviceShadowSelectAll, //设备影子总列表
  projectRank, //项目排名
  findSectivityStatus, //选择设备安全状态
  deviceChart //设备影子安全图表
} from "../../api/api.js";

export default {
  name: "deviceManagement",

  data() {
    return {
      securityStatus: [],
      UnitNoFloor: undefined, //有单元无楼层
      UnitEnable: false, //筛选几种特殊情况
      FloorEnable: false, //筛选楼层状态
      houseEnable: false, //筛选单元状态

      productModel: 0,
      deviceShadowTotal: 0,
      bindDeviceTotal: 0,
      normalDevice: 0,
      offlineDevice: 0,
      abnormalDevice: 0,
      underMaintenanceDeviceNum: 0,
      maintenanceDevice: 0,
      unboundDevice: 0,
      systemSort: [],
      deviceHealthy: [],
      categoryTypeModelList: [],
      deviceLabel: [],
      isClear: false, //多级选择

      newApartments: [],
      minHeight: 0,
      minHeightInner: 0,
      selectedApartment: [],

      myChart: null, //设备状态统计
      myCharts: null, //安全告警设备数
      page: {
        provinceId: null, //全局省份id
        countryId: null, // 全局国家id
        cityId: null,  //全局城市id
        projectId: null,
        onlyHouseTemplate: false,
        templateIdOrName: "",
        floorId: "",
        status: "",
        pageNum: 0, //当前页
        pageSize: 10  //当前页条数
      },
      houseInfoParam: {
        fication: null,
        categoryType: null, //科技系统分类
        categoryTypeModel: [null], //类别/类型/型号下拉
        label: [null],  //产品标签下拉数据
        securityStatus: null, //安全状态
        projectId: null, //当前位置Id
        buildId: null, //项目Id
        unitId: null, //单元id
        floorId: null, //楼层id
        HouseId: null, //当前户Id

        provinceId: "", //省份id
        cityId: "", //城市id
        pageNumber: 1,  //分页当前页
        pageSize: 10 //每页条数
      },

      projectBuildings: [], //项目下拉数据
      BuildingUnits: [], //单元下拉数据
      UnitFloors: [], //单元下楼层下拉数据
      Floors: [], //楼层数据
      Households: [], //户数下拉
      pageParams: {  //分页总数
        total: 0
      },
      tb_data: [], //列表数据
      pieChartData: [  //echarts设备展示
        { value: "0", name: "在线设备数" },
        { value: "0", name: "异常设备数" },
        { value: "0", name: "离线设备数" },
        { value: "0", name: "N/A设备数" },
        { value: "0", name: "维护中设备数" },
        { value: "0", name: "未绑定设备数" }
      ],
      pieChartDatas: [
        { value: "0", name: "正常设备数" },
        { value: "0", name: "安全告警设备数" },
        { value: "0", name: "疑似安全告警设备数" }
      ],
      projectHealth: false, //项目健康度弹框的显示隐藏
      lastTime: null, //项目更新时间
      tableData: [], //项目排名table数据
      normals: "",
      securityAlarm: "",
      suspected: ""
    };
  },
  computed: {
    ...mapGetters(["getCurrentCityId"])
  },
  watch: {
    // 获取全局城市
    getCurrentCityId: {
      handler: function(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.page.countryId = newVal[0] || null;
          this.page.provinceId = newVal[1] || null;
          this.page.cityId = newVal[2] || null;
          this.houseInfoParam.pageNumber = 1;
          newGetBuildingInfo({
            countryId: this.page.countryId,
            provinceId: this.page.provinceId,
            cityId: this.page.cityId
          }).then(res => {
            let projectBuildings = res.data;
            this.projectBuildings = [
              { projectId: null, projectName: "全部" },
              ...projectBuildings
            ];
          });
        }
      },
      // 深度观察监听
      deep: true
    }
  },
  methods: {
    getSectivityStatus() {
      //获取安全状态下拉框
      findSectivityStatus({}).then(res => {
        this.securityStatus = [
          { value: null, label: "全部" },
          ...res.data.data
        ];
      });
    },
    //权限控制
    getCurrentPermission() {
      var self = this;
      var permission = "";
      self.projectBuildings.forEach(pro => {
        if (pro.projectId === self.houseInfoParam.projectId) {
          permission = pro.projectName;
        }
      });
      if (permission == "全部") {
        permission = "";
      }
      return permission;
    },
    // 筛选-项目选择
    projectChange() {
      this.BuildingUnits = [];
      this.UnitFloors = [];
      this.Floors = [];
      this.Households = [];
      this.houseInfoParam.buildId = null;
      this.houseInfoParam.unitId = null;
      this.houseInfoParam.floorId = null;
      this.houseInfoParam.HouseId = null;
      document.querySelectorAll(".unitSelect .el-input__inner")[0].style.color =
        "#C0C4CC";
      document.querySelectorAll(
        ".floorSelect .el-input__inner"
      )[0].style.color = "#C0C4CC";
      document.querySelectorAll(".doorSelect .el-input__inner")[0].style.color =
        "#C0C4CC";
      if (this.houseInfoParam.projectId !== null) {
        document.querySelectorAll(
          ".buildSelect .el-input__inner"
        )[0].style.color = "#323232";
        newGetBuildingInfo({
          countryId: this.page.countryId,
          provinceId: this.page.provinceId,
          cityId: this.page.cityId
        }).then(res => {
          let projectBuildings = res.data;
          this.projectBuildings = [
            { projectId: null, projectName: "全部" },
            ...projectBuildings
          ];
          if (this.houseInfoParam.projectId !== null) {
            this.projectBuildings.forEach(pro => {
              if (pro.projectId === this.houseInfoParam.projectId) {
                this.BuildingUnits = [
                  { buildId: null, buildName: "全部" },
                  ...pro.buildings
                ];
              }
            });
          } else {
            this.BuildingUnits = null;
          }
        });
      } else {
        this.BuildingUnits = null;
        document.querySelectorAll(
          ".buildSelect .el-input__inner"
        )[0].style.color = "#C0C4CC";
      }
    },
    // 楼号选择
    buildChange() {
      this.UnitFloors = [];
      this.Floors = [];
      this.Households = [];
      this.houseInfoParam.unitId = null;
      this.houseInfoParam.floorId = null;
      this.houseInfoParam.HouseId = null;
      this.UnitEnable = false;
      this.FloorEnable = false;
      this.houseEnable = false;
      if (this.houseInfoParam.buildId !== null) {
        let buildName = "";
        this.BuildingUnits.forEach(bld => {
          if (bld.buildId === this.houseInfoParam.buildId) {
            buildName = bld.buildName;
            this.UnitEnable = bld.hasUnit;
            this.FloorEnable = bld.hasFloor;
            document.querySelectorAll(
              ".doorSelect .el-input__inner"
            )[0].style.color = "#C0C4CC";
            if (bld.hasUnit && bld.hasFloor) {
              this.FloorEnable = false; // 楼号选择后，单元楼层都为true时，必须先选单元，再选楼层
              document.querySelectorAll(
                ".unitSelect .el-input__inner"
              )[0].style.color = "#323232";
              document.querySelectorAll(
                ".floorSelect .el-input__inner"
              )[0].style.color = "#C0C4CC";
            }
            if (!bld.hasUnit && !bld.hasFloor) {
              this.houseEnable = true; //无单元无楼层
              document.querySelectorAll(
                ".unitSelect .el-input__inner"
              )[0].style.color = "#C0C4CC";
              document.querySelectorAll(
                ".floorSelect .el-input__inner"
              )[0].style.color = "#C0C4CC";
              document.querySelectorAll(
                ".doorSelect .el-input__inner"
              )[0].style.color = "#323232";
              this.floorChoose();
            }
            if (bld.hasUnit && !bld.hasFloor) {
              this.UnitNoFloor = true; //有单元无楼层
              document.querySelectorAll(
                ".unitSelect .el-input__inner"
              )[0].style.color = "#323232";
              document.querySelectorAll(
                ".floorSelect .el-input__inner"
              )[0].style.color = "#C0C4CC";
            } else {
              this.UnitNoFloor = false;
            }
            if (!bld.hasUnit && bld.hasFloor) {
              this.UnitEnable = false; //无单元有楼层
              document.querySelectorAll(
                ".unitSelect .el-input__inner"
              )[0].style.color = "#C0C4CC";
              document.querySelectorAll(
                ".floorSelect .el-input__inner"
              )[0].style.color = "#323232";
            }
          }
        });
        //单元数据
        getUnitAndFloorInfo({
          projectId: this.houseInfoParam.projectId,
          buildingId: buildName
        }).then(res => {
          this.UnitFloors = [{ unitId: null, unitName: "全部" }, ...res.data];
          this.UnitFloors.forEach(pro => {
            if (pro.hasFloor) {
              var floors = pro.floors.map(item => {
                if (item.floorId == null || item.floorName == null) {
                  return { floorId: -1, floorName: "无楼层" };
                } else {
                  return item;
                }
              });

              this.Floors = [{ floorId: null, floorName: "全部" }, ...floors];
            }
          });
        });
      } else {
        document.querySelectorAll(
          ".unitSelect .el-input__inner"
        )[0].style.color = "#C0C4CC";
        document.querySelectorAll(
          ".floorSelect .el-input__inner"
        )[0].style.color = "#C0C4CC";
        document.querySelectorAll(
          ".doorSelect .el-input__inner"
        )[0].style.color = "#C0C4CC";
      }
    },
    // 单元选择
    unitChange() {
      this.houseInfoParam.floorId = null;
      this.houseInfoParam.HouseId = null;
      this.Floors = [];
      this.Households = [];
      document.querySelectorAll(".doorSelect .el-input__inner")[0].style.color =
        "#C0C4CC";
      this.UnitFloors.forEach(pro => {
        if (
          pro.unitId === this.houseInfoParam.unitId &&
          this.houseInfoParam.unitId !== null
        ) {
          document.querySelectorAll(
            ".floorSelect .el-input__inner"
          )[0].style.color = "#323232";
          var floors = pro.floors.map(item => {
            if (item.floorId == null || item.floorName == null) {
              return { floorId: -1, floorName: "无楼层" };
            } else {
              this.FloorEnable = pro.hasFloor; // 选完单元后，根据是否有楼层来判断
              return item;
            }
          });
          this.Floors = [{ floorId: null, floorName: "全部" }, ...floors];
          if (!pro.hasFloor) {
            document.querySelectorAll(
              ".floorSelect .el-input__inner"
            )[0].style.color = "#C0C4CC";
            document.querySelectorAll(
              ".doorSelect .el-input__inner"
            )[0].style.color = "#323232";
            this.houseEnable = true; //有单元 无楼层
            this.floorChoose();
          }
        } else {
          // 选择单元后，单元为空，楼层不能选择
          this.houseEnable = false;
          document.querySelectorAll(
            ".floorSelect .el-input__inner"
          )[0].style.color = "#323232";
          document.querySelectorAll(
            ".doorSelect .el-input__inner"
          )[0].style.color = "#C0C4CC";
        }
      });
      if (!this.houseInfoParam.unitId) {
        this.FloorEnable = false;
        this.houseEnable = false;
        document.querySelectorAll(
          ".floorSelect .el-input__inner"
        )[0].style.color = "#C0C4CC";
        document.querySelectorAll(
          ".doorSelect .el-input__inner"
        )[0].style.color = "#C0C4CC";
      }
    },
    //楼层数据
    floorChoose() {
      let self = this;
      this.Households = [];
      let buildName = null;
      let unitName = null;
      let floorName = null;
      if (self.houseInfoParam.buildId !== null) {
        self.BuildingUnits.forEach(bld => {
          if (bld.buildId === self.houseInfoParam.buildId) {
            buildName = bld.buildName;
          }
        });
      }

      if (self.houseInfoParam.unitId !== null) {
        self.UnitFloors.forEach(unt => {
          if (unt.unitId === self.houseInfoParam.unitId) {
            unitName = unt.unitName;
          }
        });
      }
      if (
        self.houseInfoParam.floorId !== null &&
        self.houseInfoParam.floorId !== -1
      ) {
        self.Floors.forEach(flr => {
          if (flr.floorId === self.houseInfoParam.floorId) {
            floorName = flr.floorName;
          }
        });
      } else if (self.houseInfoParam.floorId === -1) {
        floorName = "-1";
      }
      //户数据
      deviceShadowDoor({
        projectId: self.houseInfoParam.projectId,
        building: buildName,
        unit: unitName,
        floor: floorName
      }).then(res => {
        document.querySelectorAll(
          ".doorSelect .el-input__inner"
        )[0].style.color = "#323232";
        self.houseEnable = true;
        self.Households = [{ code: null, name: "全部" }];
        res.data.forEach(e => {
          let obj = {};
          obj.code = e.door;
          obj.name = e.door;
          self.Households.push(obj);
        });
      });
    },
    // 楼层选择
    floorChange() {
      let self = this;
      this.Households = [];
      let buildName = null;
      let unitName = null;
      let floorName = null;
      if (self.houseInfoParam.buildId !== null) {
        self.BuildingUnits.forEach(bld => {
          if (bld.buildId === self.houseInfoParam.buildId) {
            buildName = bld.buildName;
          }
        });
      }
      if (self.houseInfoParam.unitId !== null) {
        self.UnitFloors.forEach(unt => {
          if (unt.unitId === self.houseInfoParam.unitId) {
            unitName = unt.unitName;
          }
        });
      }
      if (
        self.houseInfoParam.floorId !== null &&
        self.houseInfoParam.floorId !== -1
      ) {
        self.Floors.forEach(flr => {
          if (flr.floorId === self.houseInfoParam.floorId) {
            floorName = flr.floorName;
          }
        });
      } else if (self.houseInfoParam.floorId === -1) {
        floorName = "-1";
      }
      if (floorName) {
        deviceShadowDoor({
          projectId: self.houseInfoParam.projectId,
          building: buildName,
          unit: unitName,
          floor: floorName
        }).then(res => {
          document.querySelectorAll(
            ".doorSelect .el-input__inner"
          )[0].style.color = "#323232";
          self.houseEnable = true;
          self.Households = [{ code: null, name: "全部" }];
          res.data.forEach(e => {
            let obj = {};
            obj.code = e.door;
            obj.name = e.door;
            self.Households.push(obj);
          });
        });
      } else {
        document.querySelectorAll(
          ".doorSelect .el-input__inner"
        )[0].style.color = "#C0C4CC";
        self.houseEnable = false;
        self.Households = [];
        self.houseInfoParam.HouseId = null;
      }
    },
    //筛选查询
    querySelect() {
      this.houseInfoParam.pageNumber = 1;
      this.getHouseList();
    },
    //维度信息中设备统计图
    pieChart(pieData, myChart) {
      let option = {
        tooltip: {
          trigger: "item",
          formatter: "{b}: {c}台",
          backgroundColor: "#FFFFFF",
          textStyle: {
            color: "#323232"
          }
        },
        legend: {
          show: false,
          data: [
            "在线设备数",
            "异常设备数",
            "离线设备数",
            "N/A设备数",
            "维护中设备数",
            "未绑定设备数"
          ]
        },
        color: [
          "#0FADFF",
          "#FF0000",
          "#FFC237",
          "#3BE8C5",
          "#8A65F9",
          "#F437FF"
        ],
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
            labelLine: {
              normal: {
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
    pieCharts(pieDatas, myCharts) {
      let option = {
        tooltip: {
          trigger: "item",
          formatter: "{b}: {c}台",
          backgroundColor: "#FFFFFF",
          textStyle: {
            color: "#323232"
          }
        },
        legend: {
          show: false,
          data: ["正常设备数", "安全告警设备数", "疑似安全告警设备数"]
        },
        color: ["#0FADFF", "#FF0000", "#FFC237"],
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
            labelLine: {
              normal: {
                show: false
              }
            },
            data: pieDatas
          }
        ]
      };
      myCharts.hideLoading();
      myCharts.setOption(option);
    },

    // table的多选
    itemSelected(seletedItems) {
      this.selectedApartment = seletedItems;
    },

    // 分页单页条数改变
    handleSizeChange(val) {
      this.selectedApartment = [];
      this.houseInfoParam.pageSize = val;
      this.houseInfoParam.pageNumber = 1;
      this.getHouseList();
    },

    // 分页当前页数改变
    handleCurrentChange(val) {
      this.selectedApartment = [];
      this.houseInfoParam.pageNumber = val;
      this.getHouseList();
    },

    // echart 数据渲染
    initEchartData() {
      let self = this;
      self.myChart = echart.init(document.getElementById("pie-chart"));
      self.myChart.clear();
      self.myChart.showLoading();
      //数据渲染
      self.pieChart(self.pieChartData, self.myChart);
    },
    initEchartDatas() {
      //安全echarts展示
      this.myCharts = echart.init(document.getElementById("pie-charts"));
      this.myCharts.clear();
      this.myCharts.showLoading();
      //数据渲染
      this.pieCharts(this.pieChartDatas, this.myCharts);
    },

    //获取项目下所有房源列表
    getHouseList() {
      let self = this;
      var buildName = null;
      var unitName = null;
      var floorName = null;
      var doorName = null;
      if (self.houseInfoParam.buildId !== null) {
        self.BuildingUnits.forEach(bld => {
          if (bld.buildId === self.houseInfoParam.buildId) {
            buildName = bld.buildName;
          }
        });
      }

      if (self.houseInfoParam.unitId !== null) {
        self.UnitFloors.forEach(unt => {
          if (unt.unitId === self.houseInfoParam.unitId) {
            unitName = unt.unitName;
          }
        });
      }
      if (self.houseInfoParam.HouseId !== null) {
        self.Households.forEach(unt => {
          if (unt.code === self.houseInfoParam.HouseId) {
            doorName = unt.name;
          }
        });
      }
      if (
        self.houseInfoParam.floorId !== null &&
        self.houseInfoParam.floorId !== -1
      ) {
        self.Floors.forEach(flr => {
          if (flr.floorId === self.houseInfoParam.floorId) {
            floorName = flr.floorName;
          }
        });
      } else if (self.houseInfoParam.floorId === -1) {
        floorName = "-1";
      }
      self.tb_data = [];
      let selectLabel = null;
      if (self.houseInfoParam.label) {
        if (self.houseInfoParam.label[1]) {
          selectLabel = self.houseInfoParam.label[1];
        } else {
          selectLabel = null;
        }
      } else {
        selectLabel = null;
      }
      var param = {
        countryId: self.page.countryId,
        provinceId: self.page.provinceId,
        cityId: self.page.cityId,
        projectId: self.houseInfoParam.projectId,
        building: buildName,
        unit: unitName,
        floor: floorName,
        door: doorName,
        classification: self.houseInfoParam.fication,
        healthStatus: self.houseInfoParam.categoryType,
        productCategoryId: self.houseInfoParam.categoryTypeModel
          ? self.houseInfoParam.categoryTypeModel[0]
          : "null",
        productTypeId: self.houseInfoParam.categoryTypeModel
          ? self.houseInfoParam.categoryTypeModel[1]
            ? self.houseInfoParam.categoryTypeModel[1]
            : "null"
          : "null",
        productModelId: self.houseInfoParam.categoryTypeModel
          ? self.houseInfoParam.categoryTypeModel[2]
            ? self.houseInfoParam.categoryTypeModel[2]
            : "null"
          : "null",
        productLabelId: selectLabel,
        upgradeStatus: "null",
        pageIndex: self.houseInfoParam.pageNumber,
        pageSize: self.houseInfoParam.pageSize,
        seStatus: self.houseInfoParam.securityStatus
      };
      const loading = this.$loading({
        lock: true,
        target: document.querySelector('#deviceManagement')
      });
      deviceShadowSelectAll(param).then(res => {
        if (res.data !== null) {
          self.tb_data = res.data.list;
          self.tb_data.forEach((item, index) => {
            self.tb_data[index].iotDeviceName = self.tb_data[index]
              .iotDeviceName
              ? self.tb_data[index].iotDeviceName
              : "-";
            self.tb_data[index].iotVenderBrandName = self.tb_data[index]
              .iotVenderBrandName
              ? self.tb_data[index].iotVenderBrandName
              : "-";
            self.tb_data[index].status = self.tb_data[index].status
              ? self.tb_data[index].status
              : "-";
            self.tb_data[index].firmwareVersion = self.tb_data[index]
              .firmwareVersion
              ? self.tb_data[index].firmwareVersion
              : "-";
            self.tb_data[index].onlineTime = self.tb_data[index].onlineTime
              ? getDate(self.tb_data[index].onlineTime)
              : "-";
            self.tb_data[index].seStatus = self.tb_data[index].seStatus
              ? self.tb_data[index].seStatus
              : "-";
          });
          self.page.pageNum = res.data.pageNum;
          self.houseInfoParam.pageNumber = res.data.pageNum;
          self.houseInfoParam.pageSize = res.data.pageSize;
          self.page.pageSize = res.data.pageSize;
          self.pageParams.total = res.data.total;
          loading.close();
        }
      }).catch(() => {
         loading.close();
      });
      deviceShadowSticsNum(param).then(res => {
        self.normalDevice = 0;
        self.offlineDevice = 0;
        self.abnormalDevice = 0;
        self.maintenanceDevice = 0;
        self.unboundDevice = 0;
        self.underMaintenanceDeviceNum = 0;
        if (res.data) {
          self.productModel = res.data.productModelNum;
          self.deviceShadowTotal = res.data.deviceShadowNum;
          self.bindDeviceTotal = res.data.bindingDeviceNum;
          self.normalDevice = res.data.normalDeviceNum;
          self.offlineDevice = res.data.offLineDeviceNum;
          self.abnormalDevice = res.data.anomalyDeviceNum;
          self.maintenanceDevice = res.data.underMaintenanceDeviceNum;
          self.unboundDevice = res.data.noBindingDeviceNum;
          self.underMaintenanceDeviceNum = res.data.unknownDeviceNum;
          self.pieChartData = [
            { value: res.data.normalDeviceNum, name: "在线设备数" },
            { value: res.data.anomalyDeviceNum, name: "异常设备数" },
            { value: res.data.offLineDeviceNum, name: "离线设备数" },
            { value: res.data.unknownDeviceNum, name: "N/A设备数" },
            { value: res.data.underMaintenanceDeviceNum, name: "维护中设备数" },
            { value: res.data.noBindingDeviceNum, name: "未绑定设备数" }
          ];
          self.pieChart(self.pieChartData, self.myChart);
        }
      });
      deviceChart(param).then(res => {
        this.normals = res.data[0].num;
        this.securityAlarm = res.data[2].num;
        this.suspected = res.data[1].num;
        this.pieChartDatas = [
          { value: res.data[0].num, name: "正常设备数" },
          { value: res.data[2].num, name: "安全告警设备数" },
          { value: res.data[1].num, name: "疑似安全告警设备数" }
        ];
        this.pieCharts(this.pieChartDatas, this.myCharts);
      });

      deviceShadowFition({}).then(res => {
        let systemSort = res.data;
        this.systemSort = [{ code: null, name: "全部" }, ...systemSort];
      });
      deviceShadowStatus({}).then(res => {
        let deviceHealthy = res.data;
        this.deviceHealthy = [{ code: null, name: "全部" }, ...deviceHealthy];
      });
      deviceShadowModelList({}).then(res => {
        this.categoryTypeModelList = [
          { value: null, label: "全部" },
          ...res.data
        ];
      });
      deviceShadowAllLabel({}).then(res => {
        this.deviceLabel = [{ value: null, label: "全部" }, ...res.data];
      });
    },

    // 刷新筛选条件和table
    refreshFilter() {
      let self = this;
      newGetBuildingInfo({
        countryId: this.page.countryId,
        provinceId: this.page.provinceId,
        cityId: this.page.cityId
      }).then(res => {
        let projectBuildings = res.data;
        this.projectBuildings = [
          { projectId: null, projectName: "全部" },
          ...projectBuildings
        ];
        if (this.houseInfoParam.projectId !== null) {
          this.projectBuildings.forEach(pro => {
            if (pro.projectId === this.houseInfoParam.projectId) {
              this.BuildingUnits = [
                { buildId: null, buildName: "全部" },
                ...pro.buildings
              ];
            }
          });
          var buildName = "";
          if (self.houseInfoParam.buildId !== null) {
            self.BuildingUnits.forEach(bld => {
              if (bld.buildId === self.houseInfoParam.buildId) {
                buildName = bld.buildName;
                self.UnitEnable = bld.hasUnit;
                self.FloorEnable = bld.hasFloor;
              }
            });
            // 获取单元、楼层
            getUnitAndFloorInfo({
              projectId: self.houseInfoParam.projectId,
              buildingId: buildName
            }).then(res => {
              self.UnitFloors = [
                { unitId: null, unitName: "全部" },
                ...res.data
              ];
              let danyuan = null;
              let louceng = null;
              self.UnitFloors.forEach(pro => {
                if (pro.unitId && !pro.unitName && pro.floors) {
                  for (var i = 0; i < pro.floors.length; i++) {
                    if (pro.floors[i].floorId == self.houseInfoParam.floorId) {
                      louceng = pro.floors[i].floorName;
                    }
                  }
                }
                if (
                  pro.unitId === self.houseInfoParam.unitId &&
                  self.houseInfoParam.unitId !== null
                ) {
                  //有单元
                  var floors = pro.floors.map(item => {
                    if (item.floorId == null || item.floorName == null) {
                      return { floorId: -1, floorName: "无楼层" };
                    } else {
                      self.FloorEnable = pro.hasFloor; // 刷新后，根据是否有楼层来判断
                      return item;
                    }
                  });
                  if (self.houseInfoParam.floorId == "-1") {
                    deviceShadowDoor({
                      projectId: self.houseInfoParam.projectId,
                      building: buildName,
                      unit: pro.unitId,
                      floor: "-1"
                    }).then(res1 => {
                      self.houseEnable = true;
                      self.Households = [{ code: null, name: "全部" }];
                      res1.data.forEach(e => {
                        let obj = {};
                        obj.code = e.door;
                        obj.name = e.door;
                        self.Households.push(obj);
                      });
                    });
                  }
                  self.Floors = [
                    { floorId: null, floorName: "全部" },
                    ...floors
                  ];
                }
              });
              if (!self.houseInfoParam.unitId && !self.houseInfoParam.floorId) {
                document.querySelectorAll(
                  ".unitSelect .el-input__inner"
                )[0].style.color = "#C0C4CC";
                document.querySelectorAll(
                  ".floorSelect .el-input__inner"
                )[0].style.color = "#C0C4CC";
                deviceShadowDoor({
                  projectId: self.houseInfoParam.projectId,
                  building: buildName,
                  unit: null,
                  floor: null
                }).then(res1 => {
                  self.houseEnable = true;
                  self.Households = [{ code: null, name: "全部" }];
                  res1.data.forEach(e => {
                    let obj = {};
                    obj.code = e.door;
                    obj.name = e.door;
                    self.Households.push(obj);
                  });
                });
              }
              if (!self.houseInfoParam.unitId && self.houseInfoParam.floorId) {
                document.querySelectorAll(
                  ".unitSelect .el-input__inner"
                )[0].style.color = "#C0C4CC";
                deviceShadowDoor({
                  projectId: self.houseInfoParam.projectId,
                  building: buildName,
                  unit: null,
                  floor: louceng
                }).then(res1 => {
                  self.houseEnable = true;
                  self.Households = [{ code: null, name: "全部" }];
                  res1.data.forEach(e => {
                    let obj = {};
                    obj.code = e.door;
                    obj.name = e.door;
                    self.Households.push(obj);
                  });
                });
              }
              self.getHouseList();
            });
          } else {
            self.getHouseList();
          }
        } else {
          self.getHouseList();
        }
      });
    },
    // 获取项目健康度排名数据
    getProjectRank() {
      let self = this;
      self.projectHealth = true;
      projectRank().then(res => {
        if (res.err_CODE == 0) {
          let data = res.data.list;
          self.lastTime = self.getLastDate(res.data.date);
          data.forEach(item => {
            item.projectName = item.cityName + " " + item.projectName;
            item.score = item.score != null ? item.score + "分" : "--";
          });
          self.tableData = data;
        } else {
          self.$message.error(res.err_MESSAGE);
        }
      });
    },
    //毫秒时间戳转换为日期
    getLastDate(val) {
      let date = new Date(val);
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      return year + "年" + month + "月" + day + "日";
    }
  },
  mounted() {
    this.minHeight = window.innerHeight - 95;
    this.minHeightInner = window.innerHeight - 195;
    this.page.countryId = this.getCurrentCityId[0] || null;
    this.page.provinceId = this.getCurrentCityId[1] || null;
    this.page.cityId = this.getCurrentCityId[2] || null;
    getBuildingInfo({
      countryId: this.page.countryId,
      provinceId: this.page.provinceId,
      cityId: this.page.cityId
    }).then(res => {
      let projectBuildings = res.data;
      this.projectBuildings = [
        { projectId: null, projectName: "全部" },
        ...projectBuildings
      ];
    });
    //  this.getHouseList();
    this.initEchartData(); // scharts数据
    this.initEchartDatas(); // echarts数据
    this.getSectivityStatus(); //安全状态下拉
    this.refreshFilter(); //刷新筛选数据
  }
};
</script>
<style lang="scss">
@import "../../styles/device-management";
/*提示*/
.el-tooltip__popper.is-dark {
  background: rgba(255, 255, 255, 1) !important;
  color: #323232 !important;
  box-shadow: 0px 2px 10px 2px rgba(0, 0, 0, 0.1) !important;
}
.el-tooltip__popper[x-placement^="bottom"] .popper__arrow {
  border-bottom-color: rgba(255, 255, 255, 1) !important;
}
.el-tooltip__popper[x-placement^="bottom"] .popper__arrow::after {
  border-bottom-color: rgba(255, 255, 255, 1) !important;
}
#deviceManagement {
  position: relative;
  .spaceMA {
    z-index: 10;
    span {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 100%;
      transform: translate(-50%, -50%);
      text-align: center;
      color: #adadad;
      font-size: 14px;
    }
  }
  .spaceMB {
    position: relative;
    z-index: 100;
    background: #fff;
    .deviceCont{
      width:100%;
      background:#fff;
      margin-top:-6px;
    }
  }
  .el-cascader__label {
    color: #323232;
  }
  .el-input__suffix {
    right: 0 !important;
  }
  .sel-container {
    width:986px;
    .selTitle{
      width:100%;
      .selTitleCont{
        width:100%;
        .selectAll{
          display:inline-block;
        }
      }
    }
    .el-cascader {
      padding-left: 10px;
      .el-input {
        .el-input__inner {
          background: #d9eafb;
          border: 0;
          height: 25px !important;
          color: #323232;
          border-radius: 2px;
          font-size: 12px;
          padding-left: 4px !important;
        }
        .el-input__inner::-webkit-input-placeholder {
          color: #323232;
        }
        .el-cascader__label {
          color: #323232;
        }
      }
    }
    .el-select-wrap {
      display: inline-block;
    }
    .el-select {
      margin-left: 10px;
      width: 89px;
      height: 25px;
      margin-bottom: 15px;
      .el-input__inner {
        background: #d9eafb;
        border: 0;
        height: 24px !important;
        color: #323232;
        border-radius: 2px;
        font-size: 12px;
        padding-left: 4px !important;
        padding-right: 20px !important;
      }
      .el-input__inner::-webkit-input-placeholder {
        color: #c0c4cc !important;
      }
      .el-input__icon {
        line-height: 1;
      }
    }
    .unit {
      color: #323232;
      font-size: 12px;
    }
    .units {
      color: #323232;
      font-size: 12px;
      margin-left: 24px;
    }
    .checkbox-input {
      margin-left: 5px;
      margin-top: -2px;
      margin-bottom: 1px;
      vertical-align: middle;
    }
    .el-button {
      width: 86px;
      height: 28px;
      text-align: center;
      padding: 0;
      font-size: 12px;
      border: none;
      line-height: 28px;
    }
    .update {
      width: 96px !important;
    }
    .delbtn {
      margin-left: 6px;
      margin-right: 6px;
    }
    .el-button.disabled-color {
      background: #adadad;
    }
    .el-button--primary {
      background-color: #0fadff;
    }
    // 项目排名
    .health-score {
      font-size: 12px;
      color: #af7c58;
      text-decoration: underline;
      cursor: pointer;
      line-height: 28px;
      margin-right: 36px;
    }
  }

  .tb-container {
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
  }
  .input-w50 {
    .el-input {
      width: 167px;
      .el-input__inner {
        width: 167px !important;
        padding: 0 0 0 8px;
        padding-left: 4px !important;
      }
      .el-input-group__append,
      .el-input-group__prepend {
        left: -1px;
        background-color: #1e2e4c;
        color: #fff;
        vertical-align: middle;
        display: table-cell;
        position: relative;
        border: 1px solid #1e2e4c;
        border-radius: 0px;
        padding: 0 6px;
        white-space: nowrap;
      }
    }
  }

  .el-form-item__error {
    white-space: nowrap !important;
    padding-top: 0;
  }

  .input-w160 {
    .el-input {
      width: 143px;
      .el-input__inner {
        width: 143px !important;
        padding: 0 0 0 8px;
        padding-left: 4px !important;
      }
      .el-input-group__append,
      .el-input-group__prepend {
        left: -1px;
        background-color: #1e2e4c;
        color: #fff;
        vertical-align: middle;
        display: table-cell;
        position: relative;
        border: 1px solid #1e2e4c;
        border-radius: 0px;
        padding: 0 6px;
        white-space: nowrap;
      }
    }
    .el-form-item__error {
      white-space: nowrap !important;
      padding-top: 0;
    }
  }

  .multiple .input-w160 {
    .el-input {
      width: 102px;
      .el-input__inner {
        width: 102px !important;
        padding: 0 0 0 8px;
        padding-left: 4px !important;
      }
    }
  }

  //分页
  .paging{
    margin-top:10px;
  }
  .el-pagination {
    padding: 2px 0;
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

  .el-dialog__title {
    font-size: 16px;
  }
  .el-dialog__body {
    padding: 0px 20px 30px;
    color: #606266;
    font-size: 14px;
  }
  .mes {
    height: 95px;
    margin-bottom: 40px;
    .el-form .el-form-item {
      margin-bottom: 0px;
    }
    .el-form .el-input {
      width: 200px;
    }
    .el-form .el-input .el-input__inner {
      width: 200px;
      border-radius: 0;
    }
    .el-input-group__append {
      background-color: #1e2e4c;
      color: #fff;
      vertical-align: middle;
      display: table-cell;
      position: relative;
      left: -1px;
      border: 1px solid #1e2e4c;
      border-radius: 0;
      font-size: 12px;
      padding: 0 6px;
      width: 1px;
      white-space: nowrap;
    }
    .el-tag {
      color: #fff;
      cursor: pointer;
      margin-right: 16px;
      margin-bottom: 12px;
      padding: 0px 10px;
      height: 28px;
      line-height: 26px;
      .el-icon-close {
        color: #af7c58;
        border-radius: 50%;
        background: #fff;
        font-size: 12px;
        height: 12px;
        width: 12px;
        line-height: 12px;
      }
    }
  }
  .el-dialog .el-tag {
    color: #fff;
    cursor: pointer;
  }
  #common-use {
    .el-dialog__header {
      padding: 10px;
      padding-left: 20px;
    }
    .el-dialog__body {
      padding: 0px 20px 10px;
      color: #606266;
      font-size: 14px;
    }
    .el-tag {
      height: 28px;
      line-height: 26px;
      font-size: 12px;
      border-radius: 2px;
      margin-right: 16px;
      margin-bottom: 12px;
    }
    .el-dialog__footer {
      text-align: right;
      .el-button {
        padding: 0;
        width: 54px;
        height: 24px;
        text-align: center;
        font-size: 12px;
        border: 1px solid #af7c58;
      }
      .el-button:first-child {
        margin-right: 20px;
      }
    }
  }
  .health-box {
    .el-dialog__title {
      font-size: 14px;
    }
    .time-box {
      //更新时间
      position: absolute;
      top: 22px;
      left: 130px;
      font-size: 12px;
      color: #adadad;
    }
    .content {
      padding: 15px 0 20px;
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
          td {
            font-size: 12px;
            background: #ffffff;
            color: #323232;
            text-align: center;
            border-bottom: 1px solid #adadad;
          }
        }
      }
      .el-table--enable-row-hover .el-table__body tr:hover > td {
        background: rgba(175, 124, 88, 0.1) !important;
      }
      .tit-msg {
        font-size: 12px;
        padding-top: 15px;
        color: #adadad;
      }
    }
  }
}
</style>
