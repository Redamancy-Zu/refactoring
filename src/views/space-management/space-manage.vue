<template>
  <div id="indoorDeviceManage" :style="{minHeight: minHeight + 'px'}">
    <div class="spaceMA">
      <span>您没有户内设备管理的查看权限！</span>
    </div>
    <div
      class="spaceMB"
      :style="{minHeight: minHeightInner + 'px'}"
      v-fence="{data:'', functions:['查看房源列表，房源详情']}"
    >
      <div class="sel-container">
        <el-col>
          选择位置
          <!-- 项目列表 -->
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
          <span class="unit">项目</span>
          <!-- 楼号列表-->
          <el-select
            size="mini"
            v-model="houseInfoParam.buildId"
            placeholder="全部"
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
          <span class="unit">栋</span>
          <!-- 单元列表-->
          <el-select
            size="mini"
            v-model="houseInfoParam.unitId"
            placeholder="全部"
            :disabled="!houseInfoParam.buildId || !UnitEnable"
            @change="unitChange"
            v-snap="houseInfoParam.unitId"
          >
            <template v-for="(item,index) in UnitFloors">
              <el-option
                v-if="item.unitName"
                :key="index"
                :label="item.unitName"
                :value="item.unitId"
              ></el-option>
            </template>
          </el-select>
          <span class="unit">单元</span>
          <!-- 楼层列表-->
          <el-select
            size="mini"
            v-model="houseInfoParam.floorId"
            placeholder="全部"
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
          <span class="unit">层</span>
          <span class="selectStatues">选择状态</span>
          <el-select
            size="mini"
            v-model="houseInfoParam.status"
            @change="deviceStatusChange"
            v-snap="houseInfoParam.status"
          >
            <el-option
              v-for="(item,index) in deviceStatus"
              :key="index"
              :label="item.text"
              :value="item.value"
            ></el-option>
          </el-select>
          <span class="selectStatues">选择安全状态</span>
          <el-select
            size="mini"
            v-model="houseInfoParam.securityStatus"
            @change="changeSecurityStatus"
            v-snap="houseInfoParam.securityStatus"
          >
            <el-option
              v-for="(item,index) in securityStatus"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-dropdown trigger="click" @command="addHouse" style="margin:20px 0 10px 0px">
            <el-button
              type="primary"
              v-fence="{data:getCurrentPermission(), functions:['维护房源基本信息（新建，编辑，删除）']}"
              size="mini"
            >
              添加房源
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item  v-fence="{data:getCurrentPermission(), functions:['维护房源基本信息（新建，编辑，删除）']}" command="single">单个添加</el-dropdown-item>
              <el-dropdown-item v-fence="{data:getCurrentPermission(), functions:['维护房源基本信息（新建，编辑，删除）']}" command="multiple">批量添加</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-tooltip content="按项目筛选并选择两个及以上房源进行批量操作！" placement="top" effect="light">
            <div class="inlineStyle">
              <el-button
                :class="{'disabled-color':selectedApartment.length < 2  || houseInfoParam.projectId === null}"
                class="delbtns"
                type="primary"
                icon="el-icon-download"
                v-fence="{data:getCurrentPermission(), functions:['维护房源基本信息（新建，编辑，删除）']}"
                :disabled="selectedApartment.length < 2 || houseInfoParam.projectId === null"
                @click="moreDownload()"
              >批量下载二维码</el-button>
            </div>
          </el-tooltip>
          <el-tooltip content="按项目筛选并选择两个及以上房源进行批量操作！" placement="top" effect="light">
            <div class="inlineStyle">
              <el-button
                :class="{'disabled-color':selectedApartment.length < 2  || houseInfoParam.projectId === null}"
                class="delbtn"
                type="primary"
                icon="el-icon-delete"
                v-fence="{data:getCurrentPermission(), functions:['维护房源基本信息（新建，编辑，删除）']}"
                :disabled="selectedApartment.length < 2 || houseInfoParam.projectId === null"
                @click="batchDelete()"
              >批量删除</el-button>
            </div>
          </el-tooltip>
          <el-tooltip content="按项目筛选并选择两个及以上房源进行批量操作！" placement="top" effect="light">
            <el-dropdown trigger="click">
              <el-button
                type="primary"
                :class="{'disabled-color':selectedApartment.length < 2  || houseInfoParam.projectId === null}"
                size="mini"
                :disabled="selectedApartment.length < 2  || houseInfoParam.projectId === null"
                v-fence="{data:getCurrentPermission(), functions:['维护房源基本信息（新建，编辑，删除）']}"
              >
                批量编辑
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="item in editList"
                  :class="{'disabled-color':selectedApartment.length < 2  || houseInfoParam.projectId === null} "
                  :disabled="selectedApartment.length < 2  || houseInfoParam.projectId === null"
                  :key="item.value"
                  @click.native="batchEdit(item.value)"
                >{{item.label}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-tooltip>
        </el-col>
      </div>
      <!-- 户内设备管理列表 table -->
      <div class="tb-container">
        <!-- 维度展示 -->
        <div class="dimension-list">
          <ul>
            <li>
              <div>项目总数</div>
              <div class="num">
                <span>{{projectCount}}</span>
                <span>个</span>
              </div>
            </li>
            <li>
              <div>建筑总数</div>
              <div class="num">
                <span>{{buildCount}}</span>
                <span>栋</span>
              </div>
            </li>
            <li>
              <div>户型总数</div>
              <div class="num">
                <span>{{templateCount}}</span>
                <span>种</span>
              </div>
            </li>
            <li>
              <div>总户数</div>
              <div class="num">
                <span>{{appartmentCount}}</span>
                <span>户</span>
              </div>
            </li>
            <li class="echart-box">
              <div id="pie-chart"></div>
              <div class="config-txt">
                <p>
                  <i></i>
                  <span>未绑定设备户数: {{notBindDevice}}户</span>
                </p>
                <p>
                  <i></i>
                  <span>设备正常运行户数: {{normalDevice}}户</span>
                </p>
                <p>
                  <i></i>
                  <span>其他: {{exceptionDevice}}户</span>
                </p>
              </div>
            </li>
            <li class="echart-box">
              <div id="pie-charts"></div>
              <div class="config-txts">
                <p>
                  <i></i>
                  <span>设备正常运行户数: {{normals}}户</span>
                </p>
                <p>
                  <i></i>
                  <span>设备安全告警户数: {{securityAlarm}}户</span>
                </p>
                <p>
                  <i></i>
                  <span>设备疑似安全告警户数: {{suspected}}户</span>
                </p>
              </div>
            </li>
          </ul>
        </div>
        <template>
          <el-table :data="tb_data" @selection-change="itemSelected" ref="spaceTable">
            <el-table-column type="selection"></el-table-column>
            <el-table-column prop="projectName" label="项目名"></el-table-column>
            <el-table-column label="门牌号">
              <template slot-scope="scope">
                <router-link
                  :to="{path:'/spaceManagementDetail', query:{id:scope.row.houseId,temName:scope.row.projectName+'  '+scope.row.doorId}}"
                  class="txt_underline"
                >{{scope.row.doorId}}</router-link>
              </template>
            </el-table-column>
            <el-table-column label="户型编号">
              <template slot-scope="scope">
                <router-link
                  :to="{path:'/templateDetail', query:{id:scope.row.modelId,temName:scope.row.modelProjectName+' '+scope.row.modelTitle}}"
                  class="txt_underline"
                >{{scope.row.modelTitle}}</router-link>
              </template>
            </el-table-column>
            <el-table-column label="户型" prop="modelName"></el-table-column>
            <el-table-column label="户型图">
              <template slot-scope="scope">
                <span class="txt_underline" style="color: #AF7C58;" @click="viewImg(scope)">查看</span>
              </template>
            </el-table-column>
            <el-table-column prop="deviceSn" label="网关IoT设备名">
              <template slot-scope="scope">
                <span
                  v-fence="{data:scope.row.projectName, functions:['绑定设备']}"
                  v-if="scope.row.iotDeviceNo == null"
                  :class="{txt_underline:scope.row.iotDeviceNo == null}"
                  @click="bindingGateway(scope.row)"
                >绑定网关</span>
                <span v-else>{{scope.row.iotDeviceName ? scope.row.iotDeviceName:'--'}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="visualIntercomId" label="可视对讲室内机id">
              <template slot-scope="scope">
                <span>{{scope.row.visualIntercomId ? scope.row.visualIntercomId:'--'}}</span> <br>
                <el-button type="text" size="mini" class="txt_underline" @click="editVisualIntercomId(scope.row)">编辑</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="seStatus" label="当前安全状态"></el-table-column>
            <el-table-column prop="shadowCount" label="设备总数"></el-table-column>
            <el-table-column prop="notBindDevice" label="未绑定设备数"></el-table-column>
            <el-table-column prop="offLineDevice" label="离线设备数"></el-table-column>
            <el-table-column prop="warnDevice" label="异常设备数"></el-table-column>
            <!-- 告警设备数-->
            <el-table-column prop="maintainDevice" label="正在维护设备数"></el-table-column>
            <el-table-column label="操作" label-width="150">
              <template slot-scope="scope">
                <div class="descClick">
                <span id="dels">
                  <i
                    v-fence="{data:scope.row.projectName, functions:['维护房源基本信息（新建，编辑，删除）']}"
                    @click="deleteItem(scope)"
                    class="el-icon-delete"
                  ></i>
                  </span>
                  <span id="Qrcode" v-fence="{data:scope.row.projectName, functions:['查看房源列表，房源详情']}">
                    <i
                      @click="createQRCode(scope)"
                      class="iconfont icon-erweima"
                    ></i>
                  </span>
                </div>
              </template>
            </el-table-column>
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
      <el-dialog
        class="img-view"
        :modal-append-to-body="false"
        lock-scroll
        :visible.sync="showImg"
        width="75%"
        top="5vh"
      >
        <img
          v-cloak
          :src="imgUrl"
          class="ims"
          :style="{'height':minHeight - 140 + 'px'}"
        />
      </el-dialog>
      <!-- 单个添加房源弹框 -->
      <el-dialog
        class="add-house"
        :modal-append-to-body="false"
        title="单个添加房源"
        :visible.sync="singleAddDialogVisible"
        width="790px"
        :before-close="singleHouseClose"
        top="22vh"
      >
        <el-form
          :inline="true"
          :model="singleHouseRuleForm"
          :rules="singleAddRules"
          ref="singleHouseRuleForm"
          class="demo-form-inline"
        >
          <el-form-item label="项目" prop="projectId">
            <el-select
              v-model="singleHouseRuleForm.projectId"
              @change="addSingleHouseProjectChange(1)"
              placeholder="项目"
              size="mini"
              :disabled="newApartments.length > 0"
            >
              <template v-for="(item,index) in projectBuildings">
                <el-option
                  v-if="item.projectId"
                  v-fence="{data:getCurrentPermission(item.projectName), functions:['维护房源基本信息（新建，编辑，删除）']}"
                  :key="index"
                  :label="item.projectName"
                  :value="item.projectId"
                ></el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item label="楼号" prop="buildNum" class="input-w50">
            <el-input v-model="singleHouseRuleForm.buildNum" size="mini">
              <template slot="append">栋</template>
            </el-input>
          </el-form-item>
          <el-form-item label="单元" prop="unit" class="input-w50">
            <el-input v-model="singleHouseRuleForm.unit" size="mini">
              <template slot="append">单元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="楼层" prop="floor" class="input-w160">
            <el-input v-model="singleHouseRuleForm.floor" size="mini">
              <template slot="append">层</template>
            </el-input>
          </el-form-item>
          <el-form-item label="户号" prop="household" class="input-w160">
            <el-input v-model="singleHouseRuleForm.household" size="mini">
              <template slot="append">户</template>
            </el-input>
          </el-form-item>
          <el-form-item label="户型编号及户型" prop="apartmentNum">
            <el-select
              v-model="singleHouseRuleForm.apartmentNum"
              placeholder="户型编号及户型"
              size="mini"
              :disabled="singleHouseRuleForm.projectId === null"
            >
              <el-option
                v-for="(item,index) in addSingleApartmentDialogModels"
                :key="index"
                :label="item.houseFullName"
                :value="item.modelId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div class="house-message">
          <p
            class="contGouse"
          >注：系统将根据楼号，单元，楼层，户号，生成门牌号。例：楼号 2栋，单元 1单元，楼层 3层，户号 01户，生成的门牌号为 2-1-301</p>
        </div>
        <div class="add-house-box">
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="mini"
            @click="addApartment"
            :disabled="newApartments.length >= 100"
          >添加</el-button>
          <span class="fontSize">
            还可添加{{100 - newApartments.length >= 0 ? 100 - newApartments.length : 0}}个房源（
            <span
              class="house-repeat"
            >
              <i></i>与现有房源重复
            </span>
            <span class="house-repeat">
              <i></i>与当前房源重复
            </span>）
          </span>
          <div class="add-house-content">
            <!--
              当数据库存在时  给li添加  class="database-exit"
              当列表框中存在时  给li添加  class="list-exit"
            -->
            <ul>
              <el-tooltip
                v-for="(apartment ,index) in newApartments"
                :open-delay="600"
                :enterable="false"
                :content="apartment.text"
                placement="top"
                effect="light"
                :key="index"
                :disabled="apartment.text.length <= 22"
              >
                <li :class="getNewAparmentClass(apartment)">
                  <span>{{apartment.text}}</span>
                  <i class="el-icon-close" @click="removeApartment(index)"></i>
                </li>
              </el-tooltip>
            </ul>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="singleHouseClose">取 消</el-button>
          <el-button
            type="primary"
            @click="saveSingleAdd"
            :disabled="this.newApartments.length === 0"
          >确 定</el-button>
        </span>
      </el-dialog>

      <!-- 批量添加房源弹框 -->
      <el-dialog
        class="add-house multiple"
        :modal-append-to-body="false"
        :lock-scroll="true"
        title="批量添加房源"
        :visible.sync="multipleAddDialogVisible"
        width="780px"
        :before-close="multipleHouseClose"
        top="22vh"
      >
        <el-scrollbar id="moreHouse">
          <el-form
            :inline="true"
            :model="multipleHouseRuleForm"
            :rules="multiplAddRules"
            ref="multipleHouseRuleForm"
            class="demo-form-inline"
          >
            <el-form-item label="项目" prop="projectId">
              <el-select
                v-model="multipleHouseRuleForm.projectId"
                @change="addSingleHouseProjectChange(2)"
                placeholder="项目"
                size="mini"
                :disabled="newApartments.length > 0"
              >
                <template v-for="(item,index) in projectBuildings">
                  <el-option
                    v-if="item.projectId"
                    v-fence="{data:getCurrentPermission(item.projectName), functions:['维护房源基本信息（新建，编辑，删除）']}"
                    :key="index"
                    :label="item.projectName"
                    :value="item.projectId"
                  ></el-option>
                </template>
              </el-select>
            </el-form-item>
            <el-form-item label="楼号" prop="buildingId" class="input-w50">
              <el-input v-model="multipleHouseRuleForm.buildingId" size="mini">
                <template slot="append">栋</template>
              </el-input>
            </el-form-item>
            <el-form-item label="单元" prop="unitId" class="input-w50">
              <el-input v-model="multipleHouseRuleForm.unitId" size="mini">
                <template slot="append">单元</template>
              </el-input>
            </el-form-item>
            <br />
            <el-form-item label="楼层数量" prop="numFloor" class="input-w160">
              <el-input v-model="multipleHouseRuleForm.numFloor" size="mini">
                <template slot="append">层</template>
              </el-input>
            </el-form-item>
            <el-form-item label="起始楼层" prop="beginFloor" class="input-w160">
              <el-input v-model="multipleHouseRuleForm.beginFloor" size="mini">
                <template slot="append">层</template>
              </el-input>
            </el-form-item>
            <el-form-item label="每层户数" prop="floorHourse" class="input-w160">
              <el-input v-model.number="multipleHouseRuleForm.floorHourse" size="mini">
                <template slot="append">户</template>
              </el-input>
            </el-form-item>
            <el-form-item class="input-w50">
              <el-button class="input-sure" type="primary" size="mini" @click="confirmAddApars">确认</el-button>
            </el-form-item>
            <!-- 生成对应的户 -->
            <div v-for="(item,index) in multipleHouseRuleForm.doorList" :key="index">
              <el-form-item
                label="户号"
                :prop="'doorList.' + index + '.doorId'"
                class="input-w50"
                :rules="[{required: true,message: '1-5个字母、数字、汉字！',trigger: 'blur', validator: getHouseNumber}]"
              >
                <el-input v-model="item.doorId" size="mini">
                  <template slot="append">户</template>
                </el-input>
              </el-form-item>
              <el-form-item
                label="户型编号及户型"
                :prop="'doorList.' + index + '.modelId'"
                :rules="[{required: true,validator: getSpaceError,trigger: 'change'}]"
              >
                <el-select
                  v-model="item.modelId"
                  placeholder="户型编号及户型"
                  size="mini"
                  :disabled="multipleHouseRuleForm.projectId === null"
                >
                  <el-option
                    v-for="(item,index) in addSingleApartmentDialogModels"
                    :key="index"
                    :label="item.houseFullName"
                    :value="item.modelId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-form>
          <div class="house-message">
            <p
              class="nickLine"
            >注：系统将根据楼号，单元，楼层，户号，生成门牌号。例：楼号 2栋，单元 1单元，楼层 3层，户号 01户，生成的门牌号为 2-1-301</p>
          </div>
          <div class="add-house-box">
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="addMultipApartment"
              :disabled="newApartments.length >= 100 || multipleHouseRuleForm.doorList.length == 0"
            >添加</el-button>
            <span class="fontSize">
              还可添加{{100 - newApartments.length >= 0 ? 100 - newApartments.length : 0}}个房源（
              <span
                class="house-repeat"
              >
                <i></i>与现有房源重复
              </span>
              <span class="house-repeat">
                <i></i>与当前房源重复
              </span>）
            </span>
            <div class="add-house-content">
              <ul>
                <el-tooltip
                  v-for="(apartment ,index) in newApartments"
                  :open-delay="600"
                  :enterable="false"
                  :content="apartment.text"
                  placement="top"
                  effect="light"
                  :key="index"
                  :disabled="apartment.text.length <= 18"
                >
                  <li :class="getNewAparmentClass(apartment)">
                    <span>{{apartment.text}}</span>
                    <i class="el-icon-close" @click="removeApartment(index)"></i>
                  </li>
                </el-tooltip>
              </ul>
            </div>
          </div>
        </el-scrollbar>
        <span slot="footer" class="dialog-footer">
          <el-button @click="multipleHouseClose">取 消</el-button>
          <el-button
            type="primary"
            @click="saveMultipleAdd"
            :disabled="this.newApartments.length === 0"
          >确 定</el-button>
        </span>
      </el-dialog>

      <!-- 批量编辑 -->
      <el-dialog
        title="批量编辑"
        class="someEdit"
        :modal-append-to-body="false"
        :before-close="handleBatchDialogClose"
        :visible.sync="showBatchDialog"
        width="576px"
        top="29vh"
      >
        <div class="mes">
          <div class="top overh">
            <div class="right fl">
              <el-form>
                <div class="editPosition" v-if="batchDialogType < 4">
                  <!-- 批量编辑 楼层、楼号、单元 -->
                  <el-form-item :label="batchInfo" prop></el-form-item>
                  <el-input v-model="batchData" size="mini" @input="batchDialogTextChange">
                    <template slot="append">{{batchSuffix}}</template>
                  </el-input>
                  <p
                    class="editFloor"
                    v-show="batchDialogHasError"
                  >{{batchDialogErrorMessage}}</p>
                  <p class="editFloors">{{qrcodeInfor}}</p>
                </div>
                <div class="editPosition" v-if="batchDialogType == 4">
                  <!-- 批量编辑 户型 -->
                  <el-form-item :label="batchInfo" prop label-height="60px"></el-form-item>
                  <el-select
                    size="mini"
                    v-model="batchDialogModelId"
                    placeholder="选择户型"
                    @change="batchDialogModelChange"
                    :disabled="batchDialogModels.length === 0"
                  >
                    <el-option
                      v-for="(item,index) in batchDialogModels"
                      :key="index"
                      :label="item.modelName"
                      :value="item.modelId"
                    ></el-option>
                  </el-select>
                  <p
                    class="editFloor"
                    v-show="batchDialogHasError"
                  >{{batchDialogErrorMessage}}</p>
                  <p class="editFloors">修改户型编号后，该户型下的所有设备将被解绑！</p>
                  <p class="editFloors">{{qrcodeInfor}}</p>
                </div>
                <div v-if="batchDialogType == 5">
                  <!-- 批量编辑 标签 -->
                  <el-form-item :label="batchInfo" prop></el-form-item>
                  <div
                    class="labelMessage"
                  >
                    <el-tag
                      :key="tag.tagId"
                      v-for="tag in selectTags"
                      closable
                      @close="deleteTag(tag.tagId)"
                      color="#AF7C58"
                    >{{tag.tagName}}</el-tag>
                    <el-dropdown trigger="click">
                      <el-button size="mini" type="primary">
                        新建
                        <i class="el-icon-arrow-down el-icon--right"></i>
                      </el-button>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item :key="1" @click.native="showTopTags()">常用标签</el-dropdown-item>
                        <el-dropdown-item :key="2" @click.native="createNewTags()">直接新建</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </div>
                </div>
              </el-form>
            </div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="batchCancel()">取消</el-button>
          <el-button
            size="mini"
            type="primary"
            @click="batchEditSubmit()"
            :disabled="batchDialogHasError"
          >确定</el-button>
        </span>
      </el-dialog>

      <!-- 常用标签弹框 -->
      <el-dialog
        id="common-use"
        :modal-append-to-body="false"
        title="常用标签"
        lock-scroll
        :visible.sync="showTopTagDialog"
        width="404px"
        top="26.5vh"
        :show-close="false"
        :modal="false"
      >
        <el-tag
          :key="tag.tagId"
          v-for="tag in topTags"
          @click.native="selectTag(tag)"
          disable-transitions="false"
          :color="tagColor(tag)"
        >{{tag.tagName}}</el-tag>
        <span slot="footer">
          <el-button size="mini" @click="topTagDialogCancel()">取消</el-button>
          <el-button size="mini" type="primary" @click="topTagDialogSubmit()">确定</el-button>
        </span>
      </el-dialog>

      <!-- 直接新建标签 -->
      <el-dialog
        id="new-built"
        :modal-append-to-body="false"
        title="直接新建"
        lock-scroll
        :visible.sync="showCreateTagDialog"
        width="404px"
        top="32vh"
        :show-close="false"
        :modal="false"
      >
        <el-input size="mini" v-model="newTagName" @input="tagNameChange" placeholder="1-10个字符"></el-input>
        <p
          v-show="createTagHasError"
          class="editFloor"
        >{{createTagErrorMessage}}</p>
        <span slot="footer">
          <el-button @click="createTagDialogCancel()">取消</el-button>
          <el-button type="primary" @click="createTagDialogSubmit()">确定</el-button>
        </span>
      </el-dialog>

      <!-- 绑定网关 -->
      <el-dialog
        :modal-append-to-body="false"
        :title="'绑定网关：' + bingdingTitle"
        :visible.sync="gatewayVisible"
        :before-close="gatewaydialogClose"
        top="36vh"
        width="576px"
        id="gateLog"
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
            <el-form-item class="binding-line" label="选择IoT设备" label-width="80px" prop="gwId">
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
          <el-button @click="gatewaydialogClose" size="mini">取消</el-button>
          <el-button type="primary" size="mini" @click="gatewaydialogConfim">确定</el-button>
        </div>
      </el-dialog>
      <!-- 编辑可视对讲室内机id -->
      <el-dialog
        :modal-append-to-body="false" title="编辑可视对讲室内机id"
        :visible.sync="visualIntercomIdVisible"
        :before-close="visualIntercomIdDialogClose"
        top="36vh"
        width="576px"
        id="visualIntercomId"
      >
        <div class="content">
          <el-form
            :model="visualIntercomIdForm"
            ref="visualIntercomIdForm"
            :rules="visualIntercomIdFormRule"
            @submit.native.prevent
            label-position="right"
            :hide-required-asterisk="true"
          >
            <el-form-item class="binding-line" label="可视对讲室内机id" label-width="110px" prop="visualIntercomId">
              <el-input size="small" v-model="visualIntercomIdForm.visualIntercomId"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer binging">
          <el-button @click="visualIntercomIdDialogClose" size="mini">取消</el-button>
          <el-button type="primary" size="mini" @click="visualIntercomIdDialogConfim">确定</el-button>
        </div>
      </el-dialog>
      <!--单个生成二维码-->
      <canvas
        id="box"
        width="500px"
        height="500px"
      ></canvas>
      <el-dialog
        class="qrcodeDialog"
        :modal-append-to-body="false"
        :visible.sync="singleDialogVisible"
        width="420px"
      >
        <div id="1" class="qrcode">
          <vue-qr
            :correctLevel="3"
            :logoScale="0.4"
            :text="qrCodeText"
            :size="280"
            :margin="0"
            :dotScale="1"
            style="margin: 10px"
          ></vue-qr>
        </div>
        <div class="qrcodeName">{{codeName}}</div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="singleDialogVisible = false">关闭</el-button>
          <el-button type="primary" @click="paintCanvas(1,'single',codeName)">下载</el-button>
        </span>
      </el-dialog>
      <!--批量下载二维码-->
      <div id="batch" hidden>
        <div v-for="(item,idx) in selectQRCode" :key="idx">
          <div :id="'batch'+idx">
            <vue-qr
              :correctLevel="3"
              :logoScale="0.4"
              :text="item.code"
              :size="580"
              :margin="0"
              :dotScale="1"
              style="margin: 10px"
            ></vue-qr>
          </div>
        </div>
      </div>
      <el-dialog
        title="批量下载二维码"
        :visible.sync="moreDialogVisible"
        :modal-append-to-body="false"
        class="moreQrcodeDialog"
        width="30%"
        top="30vh"
      >
        <div class="moreQRCode">
          即将下载
          <span>{{selectedApartment.length}}</span>个二维码
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="moreDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="batchDownLoad">确定</el-button>
        </span>
      </el-dialog>
      <!--删除弹框-->
      <el-dialog
        :title="deleteType == '3'?'提示':'确认删除'"
        :visible.sync="deleteVisible"
        :modal-append-to-body="false"
        class="el_dialog_del"
        width="30%"
        top="30vh"
      >
        <div v-if="deleteType == '1'" class="moreQRCode">{{deleteText}}</div>
        <div v-if="deleteType == '2'" class="moreQRCode">
          {{"即将删除"+deleteNum+"个房源中，"}}
          <span>{{deleteText}}</span>
          {{"房源已绑定住户，无法删除！"}}
        </div>
        <div v-if="deleteType == '3'" class="moreQRCode">
          {{"即将删除"+deleteNum+"个房源中，"}}
          <span>{{deleteText}}</span>
          {{"房源已绑定住户，无法编辑！"}}
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="deleteVisible = false">取 消</el-button>
          <el-button type="primary" @click="deleteSure">确定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import VueQr from "vue-qr";
import JSZip from "jszip";
import FileSaver from "file-saver";
import echart from "echarts";
import { mapActions, mapGetters } from "vuex";
import {
  getProjectName, // 项目下拉选择
  findAllHouseInfo, // 选择户型编号下拉框
  getAllHouselist, //获取项目下的所有房源
  getDimensionsInfo, //获取页面维度信息
  chartData, //获取设备chart数据；
  getBuildingInfo, // 获取下拉项目、楼号
  getUnitAndFloorInfo, // 获取下拉楼层号、单元号
  deleteAparments, // 删除房源
  batchUpdate, // 批量修改楼号、单元、楼层、标签
  getTopNTags, // 获取常用标签
  createNewTag, // 直接新建标签
  verifyAppartment, // 添加房源之前的校验
  mulVerifyAppartment, // 添加房源之前的批量校验
  addAppartment, // 添加房源信息并校验
  selectUnboundGatewayList, // 网关联想输入框
  bindingGateway, // 绑定网关(及所有设备)
  updateVisualIntercomId, // 编辑可视对讲室内机id
  getTwoDimensionalCode, // 查询房源基本信息
  getFamilyByHouseIds, // 房源批量编辑 批量删除 详情编辑
  findSectivityNewStatus, //选择安全下拉框
  IndoorQuery //户内设备安全图表
} from "../../api/api.js";

export default {
  name: "indoorDeviceManage",

  data() {
    return {
      deleteVisible: false, //删除弹框
      deleteType: "",
      deleteNum: "",
      deleteText: "", //删除弹框内容

      singleDialogVisible: false, //单个生成二维码
      qrCodeText: "", //二维码内容
      codeName: "", //二维码名字
      selectQRCode: [], //批量二维码
      dataUrls: [],
      signleUrl: null,
      moreDialogVisible: false, //批量下载二维码

      gatewayVisible: false, // 绑定网关弹框
      bingdingTitle: "", // 绑定弹框title
      gatewayArr: [], // 网关下拉列表
      gatewayForm: {
        houseId: null,
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
      visualIntercomIdFormRule: {
        visualIntercomId: [
          {
            required: true,
            message: "请输入0-32位可视对讲室内机id",
            trigger: "blur"
          },
          {
            validator(rule, value, callback, source, options) {
              var errors = [];
              if (value && (value.length <= 0 || value.length > 32)) {
                errors.push(
                  new Error('请输入0-32位可视对讲室内机id')
                )
              }
              if (value !== undefined) {
                callback(errors);
              } else {
                callback()
              }
            }
          }
        ]
      },
      visualIntercomIdVisible: false, // 可视对讲室内机id弹窗
      visualIntercomIdForm: {
        houseId: null,
        visualIntercomId: null
      }, // 可视对讲室内机id数据
      newApartments: [],
      minHeight: 0,
      minHeightInner: 0,
      newTagName: "",
      createTagHasError: false,
      createTagErrorMessage: "",
      topTags: [],
      selectTags: [],
      seletedTagsCache: [],
      showTopTagDialog: false, // 关闭常用标签框
      showCreateTagDialog: false, //取消新建弹框标签
      singleAddDialogVisible: false, // 单个添加房源弹窗显示隐藏
      multipleAddDialogVisible: false, //批量添加房源弹出窗显示隐藏
      singleHouseRuleForm: {
        // 单个添加房源form数据
        projectId: null,
        buildNum: "", //楼号
        unit: "", //单元
        floor: "", //楼层
        household: null, //户
        apartmentNum: null //户型编号
      },
      multipleHouseRuleForm: {
        // 批量添加房源form数据
        projectId: null,
        buildingId: "", // 楼号
        unitId: "", // 单元号
        numFloor: null, // 楼层数量
        beginFloor: null, // 起始楼层
        floorHourse: null, // 每层户数
        doorList: []
      },
      singleAddRules: {
        // 单个添加房源各项验证规则
        projectId: [
          { required: true, message: "请选择项目!", trigger: "change" }
        ],
        buildNum: [
          {
            required: true,
            pattern: /^[A-Za-z0-9\u4e00-\u9fa5]{1,50}$/,
            min: 1,
            max: 50,
            message: "1-50个字母、数字、汉字！",
            trigger: "blur"
          }
        ],
        unit: [
          {
            required: false,
            pattern: /^[A-Za-z0-9\u4e00-\u9fa5]{0,50}$/,
            min: 0,
            max: 50,
            message: "0-50个字母、数字、汉字！",
            trigger: "blur"
          }
        ],
        floor: [
          {
            required: false,
            pattern: /^[A-Za-z0-9]{0,50}$/,
            min: 0,
            max: 50,
            message: "0-50个数字、字母！",
            trigger: "blur"
          }
        ],
        household: [
          {
            required: true,
            message: "1-5个字母、数字、汉字！",
            trigger: "blur",
            validator: this.getHouseNumber
          }
        ],
        apartmentNum: [
          {
            required: true,
            trigger: "change",
            validator: this.getSpaceError
          }
        ]
      },
      multiplAddRules: {
        // 批量添加房源各项验证规则
        projectId: [
          { required: true, message: "请选择项目!", trigger: "change" }
        ],
        buildingId: [
          {
            required: true,
            pattern: /^[A-Za-z0-9\u4e00-\u9fa5]{1,50}$/,
            min: 1,
            max: 50,
            message: "1-50个字母、数字、汉字！",
            trigger: "blur"
          }
        ],
        unitId: [
          {
            required: false,
            pattern: /^[A-Za-z0-9\u4e00-\u9fa5]{0,50}$/,
            min: 0,
            max: 50,
            message: "0-50个字母、数字、汉字！",
            trigger: "blur"
          }
        ],
        numFloor: [
          {
            required: true,
            pattern: /^[1-9]\d*$/,
            message: "请填写正整数！",
            trigger: "blur"
          }
        ],
        beginFloor: [
          {
            required: true,
            pattern: /^-?[1-9]\d*$/,
            message: "请填写除0以外的整数！",
            trigger: "blur"
          }
        ],
        floorHourse: [
          {
            required: true,
            pattern: /^(([1-9]\d?)|99)$/,
            message: "请填写100以内的正整数！",
            trigger: "blur"
          }
        ]
      },
      batchData: null,
      qrcodeInfor: "",
      batchInfo: "",
      batchSuffix: "",
      batchDialogModelId: null,
      batchDialogModels: [],
      selectedApartment: [],
      addSingleApartmentDialogModels: [],
      batchDialogHasError: false,
      batchDialogErrorMessage: "",
      projectArr: [],
      notBindDevice: 0,
      normalDevice: 0,
      exceptionDevice: 0,
      appartmentCount: 0,
      projectCount: 0,
      templateCount: 0,
      buildCount: 0,
      deviceStatus: [
        {
          text: "全部",
          value: null
        },
        {
          text: "有未绑定设备",
          value: 4
        },
        {
          text: "有离线设备",
          value: 1
        },
        {
          text: "有异常设备",
          value: 2
        },
        {
          text: "有正在维护设备",
          value: 3
        }
      ],
      securityStatus: [],
      myChart: null,
      myCharts: null,
      imgUrl: null,
      showImg: false,
      showBatchDialog: false,
      batchDialogTitle: "",
      batchDialogType: 0,
      page: {
        provinceId: null,
        countryId: null,
        cityId: null,
        projectId: null,
        onlyHouseTemplate: false,
        templateIdOrName: "",
        floorId: "",
        status: "",
        pageNum: 0,
        pageSize: 10
      },
      houseInfoParam: {
        userId: "",
        projectId: null,
        buildId: null,
        unitId: null,
        floorId: null,
        doorId: "",
        status: null,
        provinceId: "",
        cityId: "",
        pageNumber: 1,
        pageSize: 10,
        securityStatus: null
      },
      UnitEnable: false,
      FloorEnable: false,
      projectBuildings: [],
      BuildingUnits: [],
      UnitFloors: [],
      Floors: [],
      pageParams: {
        total: 0
      },
      tb_data: [],
      editList: [
        { value: 1, label: "批量编辑楼号", key: "buildingId" },
        { value: 2, label: "批量编辑单元号", key: "unitId" },
        { value: 3, label: "批量编辑楼层", key: "floorId" },
        { value: 4, label: "批量编辑户型", key: "modelId" },
        { value: 5, label: "批量编辑标签", key: "label" }
      ],
      edit_param: null,
      pieChartData: [
        { value: 0, name: "未绑定设备户数" },
        { value: 0, name: "设备正常运行户数" },
        { value: 0, name: "其他" }
      ],
      pieChartDatas: [
        { value: 0, name: "设备正常运行户数" },
        { value: 0, name: "设备安全告警户数" },
        { value: 0, name: "设备疑似安全告警户数" }
      ],
      normals: "",
      securityAlarm: "",
      suspected: ""
    };
  },
  computed: {
    ...mapGetters(["getCurrentCityId"])
  },
  components: {
    VueQr,
    JSZip,
    FileSaver
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
          getBuildingInfo({
            provinceId: this.page.provinceId,
            cityId: this.page.cityId
          }).then(res => {
            let projectBuildings = res.data;
            this.projectBuildings = [
              { projectId: null, projectName: "全部" },
              ...projectBuildings
            ];
            this.getHouseList();
          });
        }
      },
      // 深度观察监听
      deep: true
    }
  },
  methods: {
    openFullScreen() {
      const loading = this.$loading({
        target:'body',
        lock: true
      });
      return loading;
    },
    closeFullScreen(loading) {
      loading.close();
    },
    //安全状态改变
    changeSecurityStatus() {
      this.getHouseList();
    },
    startSecurity() {
      findSectivityNewStatus({}).then(res => {
        this.securityStatus = [
          { value: null, label: "全部" },
          ...res.data.data
        ];
      });
    },
    //删除确定
    deleteSure() {
      this.deleteVisible = false;
    },
    //批量下载二维码
    moreDownload() {
      let params = "";
      this.selectedApartment.forEach((item, index) => {
        if (index == 0) {
          params = "houseIds=" + item.houseId;
        } else {
          params += "&houseIds=" + item.houseId;
        }
      });
      getTwoDimensionalCode(params).then(res => {
        if (res.err_CODE == 0) {
          res.data.forEach((item, index) => {
            item.id = index + 1;
          });
          this.selectQRCode = res.data;
          this.moreDialogVisible = true;
        }
      });
    },
    batchDownLoad() {
      this.moreDialogVisible = false;
      this.dataUrls = []; //重置dataUrls
      this.selectQRCode.forEach((item, index) => {
        this.paintCanvas(index, "batch", item);
      });
      this.handleBatchDownload();
    },
    //压缩图片
    handleBatchDownload() {
      const zip = new JSZip(); //创建jszip实例
      const zipName = "房源二维码.zip"; //压缩包名字
      this.dataUrls.forEach(item => {
        const fileName = item.fileName + ".png"; //压缩图片名
        let arrData = item.picData.split(",");
        zip.file(fileName, arrData[1], { base64: true }); //向zip中添加文件
      });
      //打包压缩
      zip.generateAsync({ type: "blob" }).then(function(content) {
        saveAs(content, zipName);
      });
    },
    //单个生成二维码
    createQRCode(scope) {
      let params = "houseIds=" + scope.row.houseId;
      getTwoDimensionalCode(params).then(res => {
        if (res.err_CODE == 0) {
          this.codeName = res.data[0].name;
          this.qrCodeText = res.data[0].code;
          this.singleDialogVisible = true;
        }
      });
    },
    //下载二维码
    paintCanvas(id, type, imgName) {
      let self = this;
      let c = document.getElementById("box"); //获取canvas画布 画布大小和canvas大小一致
      let picName;
      let ctx = c.getContext("2d");
      c.height = c.height; //清空画布，重新绘制
      let div = null;
      if (type != "single") {
        picName = imgName.name;
        div = document.getElementById("batch" + id);
      } else {
        picName = imgName;
        div = document.getElementById(id);
      }
      let img = div.getElementsByTagName("img")[0]; //获取图片
      ctx.drawImage(img, 100, 50, 300, 300); //绘制图片， 左，上，宽，高
      ctx.font = "16px normal 微软雅黑"; //设置字体大小
      //多画几次，让字体加粗
      for (let i = 0; i < 10; i++) {
        ctx.fillText(picName, 100, 390); //使用偏移量加粗字体
      }
      let dataUrl = c.toDataURL();
      this.dataUrls.push({ picData: dataUrl, fileName: picName });
      if (type == "single") {
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `${picName}.png`;
        link.click();
      }
    },
    // 请求项目下拉列表
    addSingleHouseProjectChange(type) {
      let self = this;
      let projectId = null;
      self.addSingleApartmentDialogModels = [];
      type === 1
        ? (projectId = self.singleHouseRuleForm.projectId)
        : (projectId = self.multipleHouseRuleForm.projectId); // 批量添加时
      findAllHouseInfo({
        projectId: projectId,
        code: 1
      }).then(res => {
        if (res.data.data) {
          self.addSingleApartmentDialogModels = res.data.data;
          // 赋值户型编号及户型为第一个，为空时为null
          let modelId = self.addSingleApartmentDialogModels[0]
            ? self.addSingleApartmentDialogModels[0].modelId
            : null;
          if (type === 1) {
            self.singleHouseRuleForm.apartmentNum = modelId;
          } else {
            let doorList = JSON.parse(
              JSON.stringify(self.multipleHouseRuleForm.doorList)
            ); //批量添加时
            doorList.forEach(item => (item.modelId = modelId));
            self.$set(self.multipleHouseRuleForm, "doorList", doorList);
          }
        }
      });
    },

    // 添加时-删除单个房源
    removeApartment(index) {
      this.newApartments.splice(index, 1);
      this.markUpAparament();
    },

    // 添加单个房源
    addApartment() {
      let self = this;
      var doorIds = [];
      var i = self.singleHouseRuleForm.household;

      doorIds[0] = self.singleHouseRuleForm.household;
      var data = {
        buildingId: self.singleHouseRuleForm.buildNum,
        doorIds: doorIds,
        floorId: self.singleHouseRuleForm.floor,
        houseModelId: self.singleHouseRuleForm.apartmentNum,
        projectId: self.singleHouseRuleForm.projectId,
        unitId: self.singleHouseRuleForm.unit
      };
      self.$refs["singleHouseRuleForm"].validate(valid => {
        if (valid) {
          verifyAppartment(data).then(res => {
            if (res.err_CODE === 0) {
              var verifyResults = res.data;
              verifyResults.forEach(item => {
                self.newApartments.push({
                  key: item.houseInfoName.split(" ")[0],
                  text: item.houseInfoName,
                  buildingId: item.buildingId,
                  doorId: item.doorId,
                  floorId: item.floorId,
                  houseModelId: item.houseModelId,
                  projectId: item.projectId,
                  unitId: item.unitId,
                  existInDb: item.sign,
                  type: -1,
                  color: ""
                });
              });
              self.markUpAparament();
            } else {
              self.$message.error(res.err_MESSAGE);
            }
          });
        }
      });
    },

    // 添加时-重复房源的标记
    markUpAparament() {
      var obj = {};
      for (var i = 0; i < this.newApartments.length; i++) {
        var key = this.newApartments[i].key;
        if (obj[key]) {
          obj[key]++;
        } else {
          obj[key] = 1;
        }
      }

      for (var i = 0; i < this.newApartments.length; i++) {
        if (this.newApartments[i].existInDb) {
          this.newApartments[i].color = "#8A4B1E";
          this.newApartments[i].type = 1;
        } else if (obj[this.newApartments[i].key] > 1) {
          this.newApartments[i].color = "#9AF7C58";
          this.newApartments[i].type = 2;
        } else {
          this.newApartments[i].color = "#AF7C58";
          this.newApartments[i].type = 0;
        }
      }
    },

    // 获取重复房源的class
    getNewAparmentClass(apartment) {
      if (apartment.type === 1) {
        return "database-exit";
      } else if (apartment.type === 2) {
        return "list-exit";
      } else {
        return "";
      }
    },

    // 常用标签颜色
    tagColor(tag) {
      var index = this.selectTags.findIndex(item => {
        if (item.tagId === tag.tagId) {
          return true;
        }
      });
      return index === -1 ? "#CFB09B" : "#AF7C58";
    },

    //取消新建标签弹框
    createTagDialogCancel() {
      this.showCreateTagDialog = false;
    },

    // 新建标签
    createTagDialogSubmit() {
      let self = this;
      let pattern = /^[A-Za-z0-9\u4e00-\u9fa5\-]{1,10}$/;
      self.newTagName = self.newTagName.trim();
      if (!(self.newTagName && new RegExp(pattern).test(self.newTagName))) {
        self.createTagHasError = true;
        self.createTagErrorMessage = "1-10个字符！";
        return;
      }
      createNewTag(this.newTagName).then(res => {
        if (res.err_CODE === 0 || res.err_CODE === 3003) {
          var tag = res.data;
          var ret = self.selectTags.find(value => {
            return value.tagName === tag.labelName;
          });
          if (ret === undefined) {
            self.selectTags.push({
              tagId: res.data.labelId,
              tagName: res.data.labelName
            });
          }
          self.showCreateTagDialog = false;
        } else {
          self.createTagHasError = true;
          self.createTagErrorMessage = res.err_MESSAGE;
        }
      });
    },

    // 验证输入字符串
    tagNameChange() {
      let pattern = /^[A-Za-z0-9\u4e00-\u9fa5\-]{1,10}$/;
      if (this.newTagName && new RegExp(pattern).test(this.newTagName)) {
        this.batchDialogHasError = false;
        this.batchDialogErrorMessage = "";
      }
    },

    // 删除标签
    deleteTag(tagId) {
      var index = this.selectTags.findIndex(item => {
        if (item.tagId === tagId) {
          return true;
        }
      });
      if (index >= 0) {
        this.selectTags.splice(index, 1);
      }
    },

    // 关闭常用标签框
    topTagDialogCancel() {
      this.selectTags = this.seletedTagsCache;
      this.showTopTagDialog = false;
    },

    // 关闭常用标签框
    topTagDialogSubmit() {
      this.showTopTagDialog = false;
    },

    // 选择常用标签
    selectTag(tag) {
      var index = this.selectTags.findIndex(item => {
        if (item.tagId === tag.tagId) {
          return true;
        }
      });
      if (index >= 0) {
        this.selectTags.splice(index, 1);
      } else {
        this.selectTags.push(tag);
      }
    },

    // 批量编辑的限制
    batchDropDownDisable(index) {
      if (index === 2) {
        //所有选中房源必须都有单元才可以进行批量编辑
        var result = false;
        this.selectedApartment.forEach(apar => {
          if (!apar.hasUnit) {
            result = true;
          }
        });
        return result;
      } else if (index === 3) {
        //所有选中房源必须都有楼层才可以进行批量编辑
        var result = false;
        this.selectedApartment.forEach(apar => {
          if (!apar.hasFloor) {
            result = true;
          }
        });
        return result;
      } else {
        return false;
      }
    },

    //维度信息中设备统计图
    pieChart(pieData, myChart) {
      let option = {
        tooltip: {
          trigger: "item",
          formatter: "{b}: {c} ({d}%)",
          backgroundColor: "#FFFFFF",
          textStyle: {
            color: "#323232"
          }
        },
        legend: {
          show: false,
          data: ["未绑定设备户数", "设备正常运行户数", "其他"]
        },
        color: ["#0FADFF", "#FFC237", "#8A65F9"],
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
    //户内安全设备数
    pieCharts(pieDatas, myChart) {
      let option = {
        tooltip: {
          trigger: "item",
          formatter: "{b}: {c} ({d}%)",
          backgroundColor: "#FFFFFF",
          textStyle: {
            color: "#323232"
          }
        },
        legend: {
          show: false,
          data: ["设备正常运行户数", "设备安全告警户数", "设备疑似安全告警户数"]
        },
        color: ["#0098FF", "#FF00FF", "#FF0000"],
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
      myChart.hideLoading();
      myChart.setOption(option);
    },

    viewImg(scope) {
      this.imgUrl = scope.row.projectUrl;
      this.showImg = true;
    },

    // 显示常用标签弹框
    showTopTags() {
      this.topTags = [];
      var topCount = 8; //取最常用的8个标签
      getTopNTags({ num: topCount }).then(res => {
        if (res.err_CODE === 0) {
          this.topTags = res.data.map(tag => {
            return { tagId: tag.labelId, tagName: tag.labelName };
          });

          this.showTopTagDialog = true;
          this.seletedTagsCache = JSON.parse(JSON.stringify(this.selectTags));
        }
      });
    },

    // 打开直接新建弹框
    createNewTags() {
      this.showCreateTagDialog = true;
      this.createTagHasError = false;
      this.newTagName = "";
      this.createTagErrorMessage = "";
    },

    // 批量编辑的输入验证并提交
    batchEditSubmit() {
      //检查长度
      if (this.batchDialogType < 4) {
        let pattern =
          this.batchDialogType === 3
            ? /^[A-Za-z0-9]{1,50}$/
            : /^[A-Za-z0-9\u4e00-\u9fa5]{1,50}$/;
        if (!this.batchData || !new RegExp(pattern).test(this.batchData)) {
          this.batchDialogHasError = true;
          this.batchDialogErrorMessage =
            this.batchDialogType === 3
              ? "1-50个字母、数字！"
              : "1-50个字母、数字、汉字！";
          return;
        }
      }
      if (this.batchDialogType < 5) {
        this.batchEditStaticInfo();
      } else {
        this.batchTag();
      }
    },

    // 批量编辑的下拉按钮
    batchEdit(functionId) {
      let self = this;
      let params = "";
      this.selectedApartment.forEach((item, index) => {
        if (index == 0) {
          params = "houseIds=" + item.houseId;
        } else {
          params += "&houseIds=" + item.houseId;
        }
      });
      var ids = self.selectedApartment.map(item => {
        return item.houseId;
      });
      if (functionId == 5) {
        //编辑标签与绑定房源无关
        self.batchDialogHasError = false;
        self.batchDialogType = functionId;
        self.batchData = "";
        self.batchDialogModelId = "";
        self.batchInfo = "新建/选择要添加的标签";
        self.selectTags = [];
        self.showBatchDialog = true;
        return;
      }
      getFamilyByHouseIds(params).then(res => {
        if (res.data) {
          this.deleteType = 3;
          this.deleteNum = ids.length;
          this.deleteText = "";
          res.data.forEach(item => {
            this.deleteText = this.deleteText + "、" + item;
          });
          this.deleteText = this.deleteText.substr(1, this.deleteText.length);
          this.deleteVisible = true;
        } else {
          self.batchDialogHasError = false;
          self.batchDialogType = functionId;
          self.batchData = "";
          self.batchDialogModelId = "";
          switch (functionId) {
            case 1: {
              self.batchInfo =
                "即将修改" + self.selectedApartment.length + "个房源的楼号为：";
              self.batchSuffix = "号楼";
              self.qrcodeInfor =
                "楼号更新后，在查看/下载二维码时会同步更新二维码信息！";
              self.showBatchDialog = true;
              break;
            }
            case 2: {
              if (self.batchDropDownDisable(functionId)) {
                self
                  .$alert(
                    "所选的房源中存在无单元号的房源，无法批量编辑!",
                    "批量编辑",
                    {
                      confirmButtonText: "确定"
                    }
                  )
                  .then(() => {});
                return;
              }
              self.batchInfo =
                "即将修改" +
                self.selectedApartment.length +
                "个房源的单元号为：";
              self.qrcodeInfor =
                "单元号更新后，在查看/下载二维码时会同步更新二维码信息！";
              self.batchSuffix = "单元";
              self.showBatchDialog = true;
              break;
            }
            case 3: {
              if (self.batchDropDownDisable(functionId)) {
                self
                  .$alert(
                    "所选的房源中存在无楼层的房源，无法批量编辑!",
                    "批量编辑",
                    {
                      confirmButtonText: "确定"
                    }
                  )
                  .then(() => {});
                return;
              }
              self.batchInfo =
                "即将修改" + self.selectedApartment.length + "个房源的楼层为：";
              self.qrcodeInfor =
                "楼层更新后，在查看/下载二维码时会同步更新二维码信息！";
              self.batchSuffix = "层";
              self.showBatchDialog = true;
              break;
            }
            case 4: {
              self.batchInfo =
                "即将修改" + self.selectedApartment.length + "个房源的户型为：";
              self.qrcodeInfor = "";
              self.batchDialogModels = [];
              self.batchDialogModelId = null;
              findAllHouseInfo({
                projectId: self.houseInfoParam.projectId,
                code: 1
              }).then(res => {
                if (res.data.data) {
                  res.data.data.forEach(item => {
                    self.batchDialogModels.push({
                      modelId: item.modelId,
                      modelName: item.houseFullName,
                      sign: item.sign
                    });
                  });
                  if (self.batchDialogModels.length === 0) {
                    self.batchDialogHasError = true;
                    self.batchDialogErrorMessage = "当前项目下无可选户型";
                  }
                  self.showBatchDialog = true;
                }
              });
              break;
            }
            case 5: {
              self.batchInfo = "新建/选择要添加的标签";
              self.selectTags = [];
              self.showBatchDialog = true;
              break;
            }
          }
        }
      });
    },

    // 批量编辑弹框的关闭
    batchCancel() {
      this.showBatchDialog = false;
    },

    // 批量编辑的提交
    batchEditStaticInfo() {
      var self = this;
      var houseIds = self.selectedApartment.map(item => {
        return item.houseId;
      });

      var updateItem = "";
      self.editList.forEach(item => {
        if (item.value == self.batchDialogType) {
          updateItem = item.key;
        }
      });
      var updateContent;
      if (self.batchDialogType === 4) {
        updateContent = [self.batchDialogModelId];
      } else {
        updateContent = [self.batchData];
      }

      batchUpdate({
        houseIds: houseIds,
        code: updateItem,
        values: updateContent,
        projectId: self.houseInfoParam.projectId
      }).then(res => {
        if (res.err_CODE === 0) {
          self.$message({
            type: "success",
            message: "编辑成功"
          });
          self.showBatchDialog = false;
          self.batchDialogHasError = false;
          self.batchDialogErrorMessage = "";
          self.selectedApartment = [];
          //需要刷新数据
          switch (self.batchDialogType) {
            //编辑楼号
            case 1: {
              var buildingNameAfterEdit = self.batchData;
              //根据项目请求建筑列表，并判断当前选中的楼号是否存在，如果存在，维持选中不动，
              //如果不存在，则跳转至编辑之后的楼号
              getBuildingInfo({
                provinceId: self.page.provinceId,
                cityId: self.page.cityId
              }).then(res => {
                let projectBuildings = res.data;
                self.projectBuildings = [
                  { projectId: null, projectName: "全部" },
                  ...projectBuildings
                ];
                var exist = false;
                var buildIdAfterEdit = "";

                if (self.houseInfoParam.projectId !== null) {
                  self.projectBuildings.forEach(pro => {
                    if (pro.projectId === self.houseInfoParam.projectId) {
                      self.BuildingUnits = [
                        { buildId: null, buildName: "全部" },
                        ...pro.buildings
                      ];
                    }
                  });
                } else {
                  self.BuildingUnits = null;
                }

                self.BuildingUnits.forEach(item => {
                  if (item.buildId === self.houseInfoParam.buildId) {
                    exist = true;
                  }
                  if (item.buildName === buildingNameAfterEdit) {
                    buildIdAfterEdit = item.buildId;
                  }
                });
                if (!exist) {
                  self.houseInfoParam.buildId = buildIdAfterEdit;
                }
                //更新楼号下拉框
                self.getHouseList();
              });
              break;
            }
            //编辑单元
            case 2: {
              var unitNameAfterEdit = self.batchData;
              //找到当前的buildName
              var buildName = "";
              self.BuildingUnits.forEach(item => {
                if (item.buildId === self.houseInfoParam.buildId) {
                  buildName = item.buildName;
                }
              });

              if (self.houseInfoParam.buildId !== null) {
                getUnitAndFloorInfo({
                  projectId: self.houseInfoParam.projectId,
                  buildingId: buildName
                }).then(res => {
                  self.UnitFloors = [
                    { unitId: null, unitName: "全部" },
                    ...res.data
                  ];
                  //如果选中单元号，进行判断
                  //根据楼号请求单元列表，并判断当前选中的单元是否存在，如果存在，维持选中不动，
                  //如果不存在，则跳转至编辑之后的单元
                  if (self.houseInfoParam.unitId !== null) {
                    var exist = false;
                    var unitIdAfterEdit = "";
                    self.UnitFloors.forEach(unit => {
                      if (self.houseInfoParam.unitId === unit.unitId) {
                        exist = true;
                      }
                      if (unit.unitName === unitNameAfterEdit) {
                        unitIdAfterEdit = unit.unitId;
                      }
                    });
                    if (!exist) {
                      self.houseInfoParam.unitId = unitIdAfterEdit;
                    }
                  }
                  self.getHouseList();
                });
              } else {
                self.getHouseList();
              }

              break;
            }
            //编辑楼层
            case 3: {
              var floorNameAfterEdit = self.batchData;
              //根据单元号请求楼层列表，并判断当前选中的楼层是否存在，如果存在，维持选中不动，
              //如果不存在，则跳转至编辑之后的楼层

              var buildName = "";
              self.BuildingUnits.forEach(item => {
                if (item.buildId === self.houseInfoParam.buildId) {
                  buildName = item.buildName;
                }
              });

              if (self.houseInfoParam.buildId !== null) {
                getUnitAndFloorInfo({
                  projectId: self.houseInfoParam.projectId,
                  buildingId: buildName
                }).then(res => {
                  self.UnitFloors = [
                    { unitId: null, unitName: "全部" },
                    ...res.data
                  ];
                  if (self.houseInfoParam.unitId !== null) {
                    self.UnitFloors.forEach(unit => {
                      if (self.houseInfoParam.unitId === unit.unitId) {
                        var floors = unit.floors.map(item => {
                          self.Floors = [];
                          if (item.floorId == null || item.floorName == null) {
                            return { floorId: -1, floorName: "无楼层" };
                          } else {
                            return item;
                          }
                        });
                        self.Floors = [
                          { floorId: null, floorName: "全部" },
                          ...floors
                        ];
                      }
                    });
                  }

                  //如果选中单元号，进行判断
                  //根据楼号请求单元列表，并判断当前选中的单元是否存在，如果存在，维持选中不动，
                  //如果不存在，则跳转至编辑之后的单元
                  if (self.houseInfoParam.floorId !== null) {
                    var exist = false;
                    var floorIdAfterEdit = "";

                    self.Floors.forEach(flr => {
                      if (self.houseInfoParam.floorId === flr.floorId) {
                        exist = true;
                      }
                      if (flr.floorName === floorNameAfterEdit) {
                        floorIdAfterEdit = flr.floorId;
                      }
                    });
                    if (!exist) {
                      self.houseInfoParam.floorId = floorIdAfterEdit;
                    }
                  }
                  self.getHouseList();
                });
              } else {
                self.getHouseList();
              }

              break;
            }
            case 4: {
              self.getHouseList();
              break;
            }
            default: {
              break;
            }
          }
        } else if(res.err_CODE === 403) {
          self.$message.success(res.err_MESSAGE);
          setTimeout(() => {
            self.$message({
              type: "error",
              message: "接口请求失败，请联系AI+运维人员！失败原因：运营平台token无效！"
            });
          },1000);
          self.showBatchDialog = false;
          self.getHouseList();
        }else {
          self.batchDialogHasError = true;
          self.batchDialogErrorMessage = res.err_MESSAGE;
          self.$message.error(res.err_MESSAGE);
        }
      }).catch(err => {
        self.$message.error(res.err_MESSAGE);
      });
    },

    // 批量修改标签的提交
    batchTag() {
      var self = this;
      var houseIds = self.selectedApartment.map(item => {
        return item.houseId;
      });

      var updateItem = "";
      self.editList.forEach(item => {
        if (item.value == self.batchDialogType) {
          updateItem = item.key;
        }
      });
      var updateContent = self.selectTags.map(tag => {
        return tag.tagId + "";
      });

      if (self.selectTags.length === 0) {
        self.showBatchDialog = false;
        self.batchDialogHasError = false;
        self.batchDialogErrorMessage = "";
        self.selectedApartment = [];
        self.getHouseList();
        return;
      }
      batchUpdate({
        houseIds: houseIds,
        code: updateItem,
        values: updateContent,
        projectId: self.houseInfoParam.projectId
      }).then(res => {
        if (res.err_CODE === 0) {
          self.$message({
            type: "success",
            message: "编辑成功"
          });
          self.showBatchDialog = false;
          self.batchDialogHasError = false;
          self.batchDialogErrorMessage = "";
          self.selectedApartment = [];
          self.getHouseList();
        } else if(res.err_CODE === 403) {
          self.$message.success(res.err_MESSAGE);
          setTimeout(() => {
            self.$message({
              type: "error",
              message: "接口请求失败，请联系AI+运维人员！失败原因：运营平台token无效！"
            });
          },1000);
          self.showBatchDialog = false;
          self.getHouseList();
        } else {
          self.showBatchDialog = true;
          self.batchDialogHasError = true;
          self.batchDialogErrorMessage = res.err_MESSAGE;
          self.$message.error(res.err_MESSAGE);
        }
      }).catch(res => {
        self.$message.error(res.err_MESSAGE);
      });
    },

    // 批量编辑楼层、楼号、单元的输入验证
    batchDialogTextChange() {
      let pattern = /^[A-Za-z0-9\u4e00-\u9fa5]{1,50}$/;
      if (this.batchData && new RegExp(pattern).test(this.batchData)) {
        this.batchDialogHasError = false;
        this.batchDialogErrorMessage = "";
      }
    },

    // 批量编辑户型的验证
    batchDialogModelChange() {
      let self = this,
        isFlag;
      self.batchDialogModels.forEach(item => {
        if (item.modelId == self.batchDialogModelId && item.sign == 1) {
          self.batchDialogHasError = true;
          self.batchDialogErrorMessage = "该模板下没有空间信息！";
          return;
        } else {
          self.batchDialogHasError = false;
          self.batchDialogErrorMessage = "";
        }
      });
    },

    // 批量编辑弹框关闭
    handleBatchDialogClose() {
      this.showBatchDialog = false;
    },

    // 删除单个房源
    deleteItem(scope) {
      let self = this;
      let params = "houseIds=" + scope.row.houseId;
      getFamilyByHouseIds(params).then(res => {
        if (res.data) {
          this.deleteType = 1;
          this.deleteText = "该房源已绑定住户，无法删除！";
          this.deleteVisible = true;
        } else {
          this.$confirm(
            "删除后该房源下所有设备将被解绑，房源信息不可恢复，是否确认删除？",
            "提示",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消"
            }
          )
            .then(() => {
              var ids = [scope.row.houseId];
              deleteAparments({ houseIdList: ids })
                .then(res => {
                  if (res.err_CODE === 0) {
                    self.getHouseList();
                    self.$message({
                      type: "success",
                      message: "删除成功"
                    });
                  } else if(res.err_CODE === 403) {
                    self.$message.success(res.err_MESSAGE);
                    setTimeout(() => {
                      self.$message({
                        type: "error",
                        message: "接口请求失败，请联系AI+运维人员！失败原因：运营平台token无效！"
                      });
                    },1000);
                    self.getHouseList();
                  } else {
                    self.$message.error(res.err_MESSAGE);
                  }
                })
                .catch(err => {
                  self.$message.error(res.err_MESSAGE);
                });
            })
            .catch(err => {});
        }
      });
    },

    // 批量删除房源
    batchDelete() {
      let self = this;
      let params = "";
      this.selectedApartment.forEach((item, index) => {
        if (index == 0) {
          params = "houseIds=" + item.houseId;
        } else {
          params += "&houseIds=" + item.houseId;
        }
      });
      var ids = self.selectedApartment.map(item => {
        return item.houseId;
      });
      getFamilyByHouseIds(params).then(res => {
        if (res.data) {
          this.deleteType = 2;
          this.deleteNum = ids.length;
          this.deleteText = "";
          res.data.forEach(item => {
            this.deleteText = this.deleteText + "、" + item;
          });
          this.deleteText = this.deleteText.substr(1, this.deleteText.length);
          this.deleteVisible = true;
        } else {
          this.$confirm(
            "即将删除" +
            ids.length +
            "个房源，删除后该房源下 所有设备将被解绑，房源信息不可恢复，是否确认删除？",
            "提示",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消"
            }
          )
            .then(() => {
              deleteAparments({ houseIdList: ids })
                .then(res => {
                  if (res.err_CODE === 0) {
                    this.$message({
                      type: "success",
                      message: "删除成功"
                    });
                    self.getHouseList();
                  } else if(res.err_CODE === 403) {
                    this.$message.success(res.err_MESSAGE);
                    setTimeout(() => {
                      self.$message({
                        type: "error",
                        message: "接口请求失败，请联系AI+运维人员！失败原因：运营平台token无效！"
                      });
                    },1000);
                    self.getHouseList();
                  } else {
                    this.$message.error(res.err_MESSAGE);
                  }
                })
                .catch(err => {
                  this.$message.error(res.err_MESSAGE);
                });
            })
            .catch(err => {});
        }
      });
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
    securityEcharts() {
      this.myCharts = echart.init(document.getElementById("pie-charts"));
      this.myCharts.clear();
      this.myCharts.showLoading();
      this.pieCharts(this.pieChartDatas, this.myCharts);
    },

    //获取项目下所有房源列表
    getHouseList() {
      let self = this;
      var buildName = null; //栋
      var unitName = null; //单元
      var floorName = null; //楼层

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
      self.tb_data = [];
      var param = {
        pageNumber: self.houseInfoParam.pageNumber,
        pageSize: self.houseInfoParam.pageSize,
        projectId: self.houseInfoParam.projectId,
        buildId: buildName,
        unitId: unitName,
        floorId: floorName,
        status: self.houseInfoParam.status,
        provinceId: self.page.provinceId,
        cityId: self.page.cityId,
        seStatus: self.houseInfoParam.securityStatus
      };
      const loading = this.$loading({
        lock: true,
        target: document.querySelector('#indoorDeviceManage')
      });
      getAllHouselist(param)
        .then(res => {
          //获取列表数据
          if (res.data !== null) {
            self.tb_data = res.data.list;
            self.page.pageNum = res.data.pageNum;
            self.houseInfoParam.pageNumber = res.data.pageNum;
            self.houseInfoParam.pageSize = res.data.pageSize;
            self.page.pageSize = res.data.pageSize;
            self.pageParams.total = res.data.total;
            loading.close()
          }
        })
        .catch(() => {
          loading.close()
        });
      chartData(param).then(res => {
        //获取图表数据
        self.notBindDevice = 0;
        self.normalDevice = 0;
        self.exceptionDevice = 0;
        if (res.data && res.data.data) {
          self.notBindDevice = res.data.data.notBindDevice;
          self.normalDevice = res.data.data.normalDevice;
          self.exceptionDevice = res.data.data.exceptionDevice;
          self.pieChartData = [
            { value: res.data.data.notBindDevice, name: "未绑定设备户数" },
            { value: res.data.data.normalDevice, name: "设备正常运行户数" },
            { value: res.data.data.exceptionDevice, name: "其他" }
          ];
          self.pieChart(self.pieChartData, self.myChart);
        }
      });
      IndoorQuery(param).then(res => {
        this.normals = res.data[0].num;
        this.securityAlarm = res.data[2].num;
        this.suspected = res.data[1].num;
        this.pieChartDatas = [
          { value: res.data[0].num, name: "设备正常运行户数" },
          { value: res.data[2].num, name: "设备安全告警户数" },
          { value: res.data[1].num, name: "设备疑似安全告警户数" }
        ];
        this.pieCharts(this.pieChartDatas, this.myCharts);
      });
      getDimensionsInfo(param).then(res => {
        //获取维度信息数据
        if (res.data && res.data.data) {
          self.projectCount = res.data.data.countProject;
          self.appartmentCount = res.data.data.countHouse;
          self.buildCount = res.data.data.countBuild;
          self.templateCount = res.data.data.countHouseType;
        }
      });
    },
    // 筛选-状态选择
    deviceStatusChange() {
      let self = this;
      self.houseInfoParam.pageNumber = 1; //将页码重置为第一页
      this.getHouseList();
    },

    // 刷新筛选条件和table
    refreshFilter() {
      let self = this;
      // 获取项目、楼号
      getBuildingInfo({
        provinceId: self.page.provinceId,
        cityId: self.page.cityId
      }).then(res => {
        let projectBuildings = res.data;
        self.projectBuildings = [
          { projectId: null, projectName: "全部" },
          ...projectBuildings
        ];
        if (self.houseInfoParam.projectId !== null) {
          self.projectBuildings.forEach(pro => {
            if (pro.projectId === self.houseInfoParam.projectId) {
              self.BuildingUnits = [
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
              self.UnitFloors.forEach(pro => {
                if (
                  pro.unitId === self.houseInfoParam.unitId &&
                  self.houseInfoParam.unitId !== null
                ) {
                  var floors = pro.floors.map(item => {
                    if (item.floorId == null || item.floorName == null) {
                      return { floorId: -1, floorName: "无楼层" };
                    } else {
                      self.FloorEnable = pro.hasFloor; // 刷新后，根据是否有楼层来判断
                      return item;
                    }
                  });

                  self.Floors = [
                    { floorId: null, floorName: "全部" },
                    ...floors
                  ];
                }
              });
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

    // 筛选-项目选择
    projectChange() {
      let self = this;
      self.BuildingUnits = [];
      self.houseInfoParam.buildId = null;
      self.houseInfoParam.unitId = null;
      self.houseInfoParam.floorId = null;
      self.Floors = [];
      self.UnitFloors = [];
      getBuildingInfo({
        provinceId: self.page.provinceId,
        cityId: self.page.cityId
      }).then(res => {
        let projectBuildings = res.data;
        self.projectBuildings = [
          { projectId: null, projectName: "全部" },
          ...projectBuildings
        ];
        var exist = false;
        var buildIdAfterEdit = "";
        self.projectBuildings.forEach(pro => {
          if (pro.projectId === self.houseInfoParam.projectId) {
            self.BuildingUnits = [
              { buildId: null, buildName: "全部" },
              ...pro.buildings
            ];
          }
        })
      });
      self.houseInfoParam.pageNumber = 1;
      self.getHouseList();
    },

    // 楼号选择
    buildChange() {
      let self = this;
      self.Floors = [];
      self.UnitFloors = [];
      self.houseInfoParam.unitId = null;
      self.houseInfoParam.floorId = null;
      self.UnitEnable = false;
      self.FloorEnable = false;
      if (self.houseInfoParam.buildId !== null) {
        var buildName = "";
        self.BuildingUnits.forEach(bld => {
          if (bld.buildId === self.houseInfoParam.buildId) {
            buildName = bld.buildName;
            self.UnitEnable = bld.hasUnit;
            self.FloorEnable = bld.hasFloor;
            if (bld.hasUnit && bld.hasFloor) {
              self.FloorEnable = false; // 楼号选择后，单元楼层都为true时，必须先选单元，再选楼层
            }
          }
        });
        getUnitAndFloorInfo({
          projectId: self.houseInfoParam.projectId,
          buildingId: buildName
        }).then(res => {
          self.UnitFloors = [{ unitId: null, unitName: "全部" }, ...res.data];
          self.UnitFloors.forEach(pro => {
            if (pro.hasFloor) {
              var floors = pro.floors.map(item => {
                if (item.floorId == null || item.floorName == null) {
                  return { floorId: -1, floorName: "无楼层" };
                } else {
                  return item;
                }
              });

              self.Floors = [{ floorId: null, floorName: "全部" }, ...floors];
            }
          });
        });
      }
      self.houseInfoParam.pageNumber = 1;
      self.getHouseList();
    },

    // 单元选择
    unitChange() {
      let self = this;
      self.Floors = [];
      self.houseInfoParam.floorId = null;
      self.UnitFloors.forEach(pro => {
        if (
          pro.unitId === self.houseInfoParam.unitId &&
          self.houseInfoParam.unitId !== null
        ) {
          var floors = pro.floors.map(item => {
            if (item.floorId == null || item.floorName == null) {
              return { floorId: -1, floorName: "无楼层" };
            } else {
              self.FloorEnable = pro.hasFloor; // 选完单元后，根据是否有楼层来判断
              return item;
            }
          });
          self.Floors = [{ floorId: null, floorName: "全部" }, ...floors];
        }
        if (self.houseInfoParam.unitId === null) self.FloorEnable = false; // 选择单元后，单元为空，楼层不能选择
      });
      self.houseInfoParam.pageNumber = 1;
      self.getHouseList();
    },

    // 楼层选择
    floorChange() {
      this.houseInfoParam.pageNumber = 1;
      this.getHouseList();
    },

    // 选择添加房源事件
    addHouse(command) {
      let self = this;
      self.$refs.spaceTable.clearSelection();
      if (command == "single") {
        //选择单个添加房源
        self.singleHouseRuleForm = {
          // 单个添加房源form数据
          projectId: null,
          buildNum: "", //楼号
          unit: "", //单元
          floor: "", //楼层
          household: null, //户
          apartmentNum: null //户型编号
        };
        self.singleAddDialogVisible = true;
        self.newApartments = [];
      } else if (command == "multiple") {
        //选择批量添加房源
        self.multipleAddDialogVisible = true;
      }
    },

    // 关闭并重置单个添加房源表单
    singleHouseClose() {
      this.$confirm("是否放弃单个添加房源?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        showClose: false
      })
        .then(() => {
          this.singleAddDialogVisible = false;
          this.$refs.singleHouseRuleForm.resetFields();
          this.newApartments = [];
        })
        .catch(() => {
          document.getElementsByClassName("v-modal")[0].style.display = "none";
          document.getElementsByClassName('el-dialog__wrapper')[1].style.background = "rgba(0,0,0,.2)";
        });
    },

    // 保存单个添加房源数据
    saveSingleAdd() {
      let self = this;
      let dupCount = 0;
      for (var i = 0; i < self.newApartments.length; i++) {
        if (self.newApartments[i].type !== 0) {
          dupCount++;
        }
      }

      if (dupCount > 0) {
        self.$message.error("有" + dupCount + "个重复房源，无法添加");
        return;
      }

      if (self.newApartments.length > 100) {
        self.$message.error("添加房源失败，一次性最多添加100个房源");
        return;
      }

      addAppartment(self.newApartments).then(res => {
        if (res.err_CODE === 0) {
          //添加成功 关闭弹出框
          self.$message({
            type: "success",
            message: "添加成功"
          });
          self.singleAddDialogVisible = false;
          self.$refs.singleHouseRuleForm.resetFields();
          self.newApartments = [];
          self.refreshFilter();
        } else if(res.err_CODE === 403){
          self.$message.success(res.err_MESSAGE);
          setTimeout(() => {
            self.$message({
              type: "error",
              message: "接口请求失败，请联系AI+运维人员！失败原因：运营平台token无效！"
            });
          },1000);
          self.refreshFilter();
        } else {
          self.$message.error(res.err_MESSAGE);
        }
      }).catch(() => {
        self.$message.error(res.err_MESSAGE);
      });;
    },

    // 批量添加房源相关方法
    // 关闭并重置批量添加房源表单
    multipleHouseClose() {
      this.$confirm("是否放弃批量添加房源?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        showClose: false
      })
        .then(() => {
          this.$refs.multipleHouseRuleForm.resetFields();
          this.$set(this.multipleHouseRuleForm, "doorList", []);
          this.multipleAddDialogVisible = false;
          this.newApartments = [];
        })
        .catch(() => {
          document.getElementsByClassName("v-modal")[0].style.display = "none";
          document.getElementsByClassName('el-dialog__wrapper')[2].style.background = "rgba(0,0,0,.2)";
        });
    },

    // 保存多个添加多个房源数据
    saveMultipleAdd() {
      this.openFullScreen();
      let self = this;
      let dupCount = 0;
      for (var i = 0; i < self.newApartments.length; i++) {
        if (self.newApartments[i].type !== 0) {
          dupCount++;
        }
      }
      if (dupCount > 0) {
        self.$message.error("有" + dupCount + "个重复房源，无法添加");
        setTimeout(() => {
          this.closeFullScreen(this.openFullScreen());
        });
        return;
      }
      addAppartment(self.newApartments)
        .then(res => {
          if (res.err_CODE === 0) {
            //添加成功 关闭弹出框
            self.$message({
              type: "success",
              message: "添加成功"
            });
            self.multipleAddDialogVisible = false;
            self.$refs.multipleHouseRuleForm.resetFields();
            self.newApartments = [];
            self.$set(this.multipleHouseRuleForm, "doorList", []);
            self.refreshFilter();
            setTimeout(() => {
              this.closeFullScreen(this.openFullScreen());
            });
          } else if(res.err_CODE === 403){
            self.$message.success(res.err_MESSAGE);
            setTimeout(() => {
              self.$message({
                type: "error",
                message: "接口请求失败，请联系AI+运维人员！失败原因：运营平台token无效！"
              });
            },1000);
            self.refreshFilter();
          } else{
            self.$message.error(res.err_MESSAGE);
          }
        })
        .catch(() => {
          self.$message.error(res.err_MESSAGE);
          setTimeout(() => {
            this.closeFullScreen(this.openFullScreen());
          });
        });
    },

    // 批量确定添加
    confirmAddApars() {
      let self = this;
      let num = null;
      let floorHourse = self.multipleHouseRuleForm.floorHourse;
      self.$refs["multipleHouseRuleForm"].validateField(
        [
          "projectId",
          "buildingId",
          "unitId",
          "numFloor",
          "beginFloor",
          "floorHourse"
        ],
        (validMessage, noValid) => {
          if (validMessage === "" && noValid === null) {
            num++;
            if (num >= 6) {
              let doorList = JSON.parse(
                JSON.stringify(self.multipleHouseRuleForm.doorList)
              );
              let oldLength = doorList.length;
              if (floorHourse > oldLength) {
                for (let i = oldLength + 1; i <= floorHourse; i++) {
                  let doorId = null;
                  i <= 9 ? (doorId = "0" + i) : (doorId = i);
                  doorList.push({
                    doorId: doorId,
                    modelId: self.addSingleApartmentDialogModels[0]
                      ? self.addSingleApartmentDialogModels[0].modelId
                      : null
                  });
                }
              } else {
                doorList.splice(floorHourse, oldLength - floorHourse);
              }
              self.$set(self.multipleHouseRuleForm, "doorList", doorList);
            }
          } else {
            return false;
          }
        }
      );
    },

    // 批量验证
    addMultipApartment() {
      let self = this;
      // 楼层*户数+已有房源>100,false
      if (
        self.multipleHouseRuleForm.numFloor *
        self.multipleHouseRuleForm.floorHourse +
        self.newApartments.length >
        100
      ) {
        self.$message.error("添加房源失败，一次性最多添加100个房源！");
        return;
      }
      let doorList = self.multipleHouseRuleForm.doorList;
      self.$set(self.multipleHouseRuleForm, "doorList", doorList);
      self.$refs["multipleHouseRuleForm"].validate(valid => {
        if (valid) {
          mulVerifyAppartment(self.multipleHouseRuleForm).then(res => {
            if (res.err_CODE === 0) {
              var verifyResults = res.data;
              verifyResults.forEach(item => {
                self.newApartments.push({
                  key: item.houseInfoName.split(" ")[0],
                  text: item.houseInfoName,
                  buildingId: item.buildingId,
                  doorId: item.doorId,
                  floorId: item.floorId,
                  houseModelId: item.houseModelId,
                  projectId: item.projectId,
                  unitId: item.unitId,
                  existInDb: item.sign,
                  type: -1,
                  color: ""
                });
              });
              self.markUpAparament();
            } else {
              self.$message.error(res.err_MESSAGE);
            }
          });
        } else {
          return false;
        }
      });
    },

    // 空间模板信息验证
    getSpaceError(rule, value, callback) {
      let self = this;
      if (value == "" || value == null)
        callback(new Error("请选择户型编号及户型！"));
      self.addSingleApartmentDialogModels.forEach(item => {
        if (item.modelId == value) {
          if (item.sign == 1) {
            callback(new Error("该模板下没有空间信息！"));
          } else {
            callback();
          }
        }
      });
    },

    // 验证户号
    getHouseNumber(rule, value, callback) {
      const reg = /^[a-zA-Z0-9\u4e00-\u9fa5]{1,5}$/;
      if (reg.test(value) && value - 0 !== 0) {
        callback();
      } else {
        return callback(new Error("1-5个字母、数字、汉字！"));
      }
    },

    // 绑定网关

    // 打开弹窗
    bindingGateway(row) {
      if (this.$refs["gatewayForm"]) this.$refs["gatewayForm"].resetFields();
      this.gatewayVisible = true;
      this.bingdingTitle = row.projectName + "  " + row.doorId;
      this.gatewayForm.houseId = row.houseId;
      selectUnboundGatewayList({ projectId: row.projectId }).then(res => {
        let data = res.data.data;
        if (data) {
          this.gatewayArr = data;
        }
      });
    },

    // 打开可视对讲室内机id弹窗
    editVisualIntercomId(row) {
        this.visualIntercomIdVisible = true
        this.visualIntercomIdForm.houseId = row.houseId;
        this.visualIntercomIdForm.visualIntercomId = row.visualIntercomId ? row.visualIntercomId : null;
    },

    // 关闭编辑可视对讲室内机id弹窗
    visualIntercomIdDialogClose() {
      this.visualIntercomIdVisible = false;
    },

    // 关闭弹框
    gatewaydialogClose() {
      this.gatewayVisible = false;
    },

    // 确定编辑可视对讲室内机id
    visualIntercomIdDialogConfim() {
      this.$refs["visualIntercomIdForm"].validate(valid => {
        if (valid) {
          updateVisualIntercomId(this.visualIntercomIdForm).then(res => {
            if (res.err_CODE === 0) {
              this.refreshFilter();
              this.visualIntercomIdVisible = false;
              this.$message.success('编辑可视系统室内机id成功');
            } else {
              this.$message.error(res.err_MESSAGE);
            }
          });
        } else {
          return false;
        }
      });
    },

    // 确定绑定网关
    gatewaydialogConfim() {
      this.$refs["gatewayForm"].validate(valid => {
        if (valid) {
          bindingGateway(this.gatewayForm).then(res => {
            if (res.err_CODE === 0) {
              this.refreshFilter();
              this.gatewayVisible = false;
              this.$message.success(res.err_MESSAGE);
              this.$refs["gatewayForm"].resetFields();
            } else {
              this.$message.error(res.err_MESSAGE);
            }
          });
        } else {
          return false;
        }
      });
    },
    getCurrentPermission(val) {
      var self = this;
      var permission = "";
      self.BuildingUnits.forEach(pro => {
        if (pro.projectId === self.houseInfoParam.buildId) {
          permission = pro.projectName;
        }
        if (permission == "全部") {
          permission = "";
        }
      });
      if (val) {
        permission = val;
      }
      return permission;
    }
  },
  mounted() {
    this.minHeight = window.innerHeight - 95;
    this.minHeightInner = window.innerHeight - 195;
    this.page.countryId = this.getCurrentCityId[0] || null;
    this.page.provinceId = this.getCurrentCityId[1] || null;
    this.page.cityId = this.getCurrentCityId[2] || null;
    // 获取下拉项目、楼号
    getBuildingInfo({
      provinceId: this.page.provinceId,
      cityId: this.page.cityId
    }).then(res => {
      let projectBuildings = res.data;
      this.projectBuildings = [
        { projectId: null, projectName: "全部" },
        ...projectBuildings
      ];
    });
    this.initEchartData(); //设备数绑定
    this.refreshFilter(); //筛选条件
    this.startSecurity(); //安全状态下拉
    this.securityEcharts(); //设备告警设备数
  }
};
</script>
<style lang="scss">
@import "../../styles/indoor-device-manage";
.el-message-box {
  .el-message-box__header {
    .el-message-box__title {
      span {
        font-weight: bold !important;
        font-size: 16px;
      }
    }
  }
}
</style>

<style lang="scss">
#moreHouse {
  .el-scrollbar__wrap {
    position: absolute;
    z-index: 1;
  }
}
.el_dialog_del .el-dialog {
  .moreQRCode {
    font-size: 14px;
    color: #323232;
    span {
      color: #af7c58;
    }
  }
  .el-dialog__footer {
    text-align: end;
    .el-button--default {
      margin-right: 14px;
    }
  }
  .el-dialog__body {
    text-align: center;
    padding-bottom: 0;
    padding-top: 30px !important;
    padding-left: 0;
  }
  .el-dialog__header {
    padding-bottom: 0;
  }
}
.moreQrcodeDialog {
  .moreQRCode {
    text-align: center;
    color: #323232;
    font-size: 14px;
    span {
      color: #af7c58;
    }
  }
}
.qrcodeDialog {
  .qrcode {
    padding-top: 58px;
  }
  .qrcodeName {
    margin-top: 5px;
    text-align: center;
    color: #323232;
    font-size: 18px;
    font-weight: bold;
  }
  .el-dialog__header {
    display: none;
  }
  .el-dialog__body {
    padding: 0 !important;
    width: 420px;
    height: 420px;
    text-align: center;
  }
  .el-dialog__footer {
    position: absolute;
    top: 450px;
    width: 100%;
    .el-button--default {
      background: transparent;
      color: #ffffff;
    }
  }
}
#indoorDeviceManage {
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
    .someEdit {
      .el-dialog {
        .el-dialog__body {
          padding: 0px 20px 45px;
        }
        .labelMessage{
          border:1px solid #979797;
          padding:8px;
          width:536px;
          height:120px;
          overflow-x:hidden;
          overflow-y:auto;
          padding-bottom:20px;
        }
      }
    }
    #box{
      display: none;
      background: #FFFFFF;
      width: 500px;
      height: 700px;
    }
  }
  .sel-container {
    color: #323232;
    padding: 0;
    width:1085px;
    display:flex;
    .selectStatues{
      display:inline-block;
      margin-left:32px;
    }
    .inlineStyle{
      display:inline-block;
    }
    .el-dropdown {
      margin: 20px 0px 10px;
    }
    .el-select {
      padding: 10px 0 10px 10px;
      width: 120px;
      height: 28px;
      .el-input__inner {
        background: #ebf4fc;
        border: 0;
        height: 28px !important;
        color: #323232;
        border-radius: 2px;
        font-size: 12px;
      }
      .el-input__icon {
        line-height: 1;
      }
    }
    .unit {
      color: #323232;
      padding-left: 4px;
      font-size: 12px;
      &:last-of-type {
        margin-right: 5px;
      }
    }
    .el-button {
      width: 88px;
      height: 28px;
      text-align: center;
      padding: 0;
      font-size: 12px;
      border: none;
      line-height: 28px;
    }
    .delbtn {
      margin-left: 8px;
      margin-right: 8px;
      border:none;
    }
    .delbtns{
      margin-left: 8px;
      margin-right: 8px;
      border:none;
      width:124px
    }
    .el-button.disabled-color {
      background: #adadad;
    }
    .el-button--primary {
      background-color: #0fadff;
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
    .descClick{
      text-align:center;
      cursor:pointer;
      .el-icon-delete {
        color: #af7c58;
        float: left;
        margin-top:4px;
        font-size:14px;
        margin-left:48px;
      }
    }
    .paging{
      margin-top:10px;
    }
  }
  .img-view{
    .ims{
      display:block;
      margin: 0 auto;
      max-width:100%;
    }
  }
  .house-message{
    .nickLine{
      color:#adadad;
      padding-right:40px;
      font-size:12px;
    }
  }
  .add-house-box{
    .fontSize{
      font-size:12px;
      margin-left:16px;
      color:#adadad;
    }
  }
  #Qrcode{
    display: inline-block !important;
    .icon-erweima{
      color:#AF7C58;
      font-size:14px;
    }
  }
  .input-w50 {
    .el-input {
      width: 167px;
      .el-input__inner {
        width: 167px !important;
        padding: 0 0 0 8px;
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
      }
    }
  }
  .multiple .el-form-item__content{
    display: inline-block;
    vertical-align: middle;
    line-height: 28px;
    .input-sure{
      margin-top:6px;
    }
  }
  .add-house .el-form-item__content{
    display: inline-block;
    vertical-align: middle;
    line-height: 28px;
  }
  // 分页
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
  #gateLog {
    .content{
      padding: 20px 0 20px 120px;
    }
    .el-dialog__title {
      font-size: 16px;
    }
    .el-dialog__body {
      padding: 0px 20px 30px;
      color: #606266;
      font-size: 14px;
      height: 100px;
      .binding-line {
        .el-input {
          width: 200px;
        }
        .el-input__inner {
          width: 200px;
        }
      }
    }
    .el-dialog .el-dialog__footer {
      .dialog-footer.binging {
        text-align: right !important;
        .el-button {
          border: none;
          width: 60px;
          &:first-child {
            color: #af7c58;
            margin-right: 10px;
            border:1px solid #af7c58;
          }
        }
      }
    }
  }
  #visualIntercomId {
    .content {
      padding: 20px 0 20px 60px;
    }

    .el-dialog__title {
      font-size: 16px;
    }

    .el-dialog__body {
      padding: 0px 20px 30px;
      color: #606266;
      font-size: 14px;
      height: 100px;

      .binding-line {
        .el-input {
          width: 200px;
        }

        .el-input__inner {
          width: 300px;
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
    .binding-line {
      .el-input {
        width: 200px;
      }
      .el-input__inner {
        width: 200px;
      }
    }
  }
  .el-dialog .el-dialog__footer {
    .dialog-footer.binging {
      text-align: right !important;
      .el-button {
        border: none;
        width: 60px;
        &:first-child {
          color: #af7c58;
          margin-right: 10px;
          border:1px solid #af7c58;
        }
      }
    }
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
    .el-input-group > .el-input__inner {
      vertical-align: middle;
      display: inline-block !important;
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
    .editPosition{
      padding:30px 0 0 150px;
      .editFloor{
        color:#CC3D3D;
        font-size:12px;
      }
      .editFloors{
        color:#adadad;
        font-size:12px;
      }
    }
  }
  .el-dialog .el-tag {
    color: #fff;
    cursor: pointer;
  }
  #common-use {
    .el-dialog {
      margin-top: 10vh;
      height: 260px;
    }
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
      float: left;
    }
    .el-dialog__footer {
      text-align: right;
      position: absolute;
      bottom: 0px;
      right: 0;
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
  #new-built {
    .editFloor{
      color:#CC3D3D;
      font-size:12px;
    }
    .el-dialog__header {
      padding: 10px;
      padding-left: 20px;
    }
    .el-dialog__body {
      padding: 0px 20px 10px;
      color: #606266;
      font-size: 14px;
      .el-input {
        width: 140px;
      }
      .el-input__inner {
        background: rgba(175, 124, 88, 0.2);
        background-image: none;
        border-radius: 2px;
        border: 1px solid transparent;
        color: #606266;
      }
      .el-input__inner:hover {
        border-color: transparent;
      }
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
}
</style>
