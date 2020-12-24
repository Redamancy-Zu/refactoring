<template>
  <div class="space-detail" id="device-detail">
    <!-- 设备信息 -->
    <div class="device-mag-box">
      <div class="msg-title overh">
        <router-link to="/deviceShadow" class="back">
          <el-button size="mini" icon="el-icon-arrow-left">返回</el-button>
        </router-link>
        <span class="template-name template-name-right">{{baseInfor.bindingAddress}}</span>
        <span class="template-name">{{baseInfor.deviceName}}</span>
      </div>
      <template>
        <el-tabs
          class="device-msg devece-table"
          v-model="activeName2"
          type="card"
          @tab-click="handleClick"
        >
          <!-- 设备基本信息 -->
          <el-tab-pane label="设备基本信息" name="first">
            <div class="spaceMA" v-empty="{data:getCurrentPermission(), functions:['查看设备影子列表，设备影子详情']}">
              <span>您没有设备影子详情的查看权限！</span>
            </div>
            <div
              class="spaceMB"
              :style="{minHeight: minHeightInner + 'px'}"
              v-fence="{data:getCurrentPermission(), functions:['查看设备影子列表，设备影子详情']}"
            >
              <div class="shadow-title">设备影子信息</div>
              <table cellpadding="0" cellspacing="0" border="1">
                <tr>
                  <th class="table-color1 table-back-color">健康状态</th>
                  <th class="table-left">
                    <span style="float:left" class="table-color2">{{baseInfor.shadowStatus}}</span>
                    <span class="deatyStatus"></span>
                    <div class = "deviceTol" v-fence="{data:getCurrentPermission(), functions:['设备影子控制与维护']}"
                    >
                      <div v-if="noBand">
                        <span class="table-color3" @click="mainTain" v-if="showWH">维护</span>
                        <span class="table-color3" @click="reset">重置</span>
                      </div>
                    </div>
                  </th>
                  <th class="table-color1 table-back-color">安全状态</th>
                  <th class="table-color2 table-left">{{baseInfor.seStatus||'--'}}</th>
                  <th class="table-color1 table-back-color">最后上线时间</th>
                  <th class="table-color2 table-left">{{baseInfor.shadowStatusUpdateTime||'--'}}</th>
                </tr>
                <tr>
                  <th class="table-color1 table-back-color">最后绑定时间</th>
                  <th class="table-color2 table-left">{{baseInfor.shadowBindingTime||'--'}}</th>
                  <td class="table-color1 table-back-color">累计运行时长</td>
                  <td class="table-color2 table-left">{{baseInfor.shadowRunningTime||'--'}}</td>
                  <td class="table-color1 table-back-color">调试程序</td>
                  <td class="table-color2 table-left">
                    {{baseInfor.shadowProcedure?'V'+baseInfor.shadowProcedure : '--'}}
                    <i
                      style="color:#AF7C58;cursor: pointer;"
                      class="el-icon-download"
                      v-if="baseInfor.shadowProcedureUrl"
                      @click="downLoadFile(baseInfor.shadowProcedureUrl,baseInfor.shadowProcedure)"
                    ></i>
                  </td>
                </tr>
                <tr>
                  <td class="table-color1 table-back-color">产品类型</td>
                  <td class="table-color2 table-left">{{baseInfor.shadowType}}</td>
                  <td class="table-color1 table-back-color">产品型号</td>
                  <td class="table-color2 table-left">{{baseInfor.shadowModel}}</td>
                  <td class="table-color1 table-back-color">厂商名称</td>
                  <td class="table-color2 table-left" colspan="1">{{baseInfor.venderName || '--'}}</td>
                </tr>
                <tr>
                  <td class="table-color1 table-back-color">产品标签</td>
                  <td class="table-color2 table-left" colspan="5">
                    <span v-if="emptyLab">--</span>
                    <span v-for="item in baseInfor.shadowLabel" style="margin-right: 12px">
                      <span v-if="item" style="font-weight: bold">{{item.labelTypeName+':'}}</span>
                      <span v-if="item">{{item.labelNameList}}</span>
                    </span>
                  </td>
                </tr>
              </table>
              <!-- IOT设备相关 -->
              <div class="shadow-title shadow-title-top">IoT设备相关</div>
              <table cellpadding="0" cellspacing="0" border="1">
                <tr>
                  <th class="table-color1 table-back-color">关联IoT设备名</th>
                  <th class="table-color2 table-left">{{baseInfor.ioTName||'--'}}</th>
                  <th class="table-color1 table-back-color">关联IoT设备ID</th>
                  <th class="table-color2 table-left">{{baseInfor.ioTId||'--'}}</th>
                  <th class="table-color1 table-back-color">关联IoT品牌/型号</th>
                  <th
                    class="table-color2 table-left"
                  >{{baseInfor.ioTBrand?baseInfor.ioTBrand+'/'+baseInfor.ioTModel:'--'}}</th>
                </tr>
                <tr>
                  <td class="table-color1 table-back-color">SN号</td>
                  <td class="table-color2 table-left">{{baseInfor.ioTSN||'--'}}</td>
                  <td class="table-color1 table-back-color">MAC地址</td>
                  <td class="table-color2 table-left">{{baseInfor.ioTMAC||'--'}}</td>
                  <td class="table-color1 table-back-color">IP地址</td>
                  <td class="table-color2 table-left">{{baseInfor.ioTIP||'--'}}</td>
                </tr>
                <tr>
                  <td class="table-color1 table-back-color">固件版本</td>
                  <td class="table-color2 table-left">{{baseInfor.ioTVersion||'--'}}</td>
                  <td class="table-color1 table-back-color">上报位置</td>
                  <td class="table-color2 table-left">{{baseInfor.ioTReportAddress||'--'}}</td>
                  <td class="table-color1 table-back-color">所属网关</td>
                  <td class="table-color2 table-left">{{baseInfor.ioTGateway||'--'}}</td>
                </tr>
              </table>
            </div>
          </el-tab-pane>
          <el-tab-pane label="设备运行状态/操作" name="second">
            <div class="spaceMA"  v-empty="{data:getCurrentPermission(), functions:['查看设备影子列表，设备影子详情']}">
              <span>您没有设备影子详情的查看权限！</span>
            </div>
            <div
              class="spaceMB"
              :style="{minHeight: minHeightInner + 'px'}"
               v-fence="{data:getCurrentPermission(), functions:['查看设备影子列表，设备影子详情']}"
            >
              <div class="operation">
                <span class="span">设备运行状态</span>
              </div>
              <div class="deveieWrap" v-if="deviceStatus" v-for="(item,index) in deviceStatus">
                <div class="table-color2 onedevicestate" v-if="item.dataType == '3'">
                  <span class="keySwitch">{{item.propertyName+"："+ (item.propertyValuenName||'--')}}</span>
                </div>
                <div class="table-color2 onedevicestate" v-if="item.dataType == '1'">
                  <span class="keySwitch">{{item | statues1}}</span>
                </div>
                <div class="table-color2 onedevicestate" v-if="item.dataType == '2'">
                  <span class="keySwitch">{{item.propertyName+"："+ (item.propertyValuenName||'--')}}</span>
                </div>
                <div class="table-color2 onedevicestate" v-if="item.dataType == '6'">
                  <span class="keySwitch">{{item | statues6}}</span>
                </div>
                <div class="table-color2 onedevicestate" v-if="item.dataType == '4'">
                  <span class="keySwitch">{{item | statues4}}</span>
                </div>
              </div>
              <div v-if="deviceStatus == null || deviceStatus.length == 0">
                <div class="table-color4">
                  <span class="keySwitch">无</span>
                </div>
              </div>
              <!--操作需要权限-->
              <div v-fence="{data:getCurrentPermission(), functions:['设备影子控制与维护']}">
                <div class="span">设备操作</div>
                <div class="switch" v-for="(item,index) in operateDate.abilitys">
                  <div class="wrap">
                    <el-tooltip
                      v-if="item.abilityName&&item.abilityName.length>10"
                      class="item"
                      effect="dark"
                      :content="item.abilityName"
                      placement="top"
                    >
                      <div class="switchName switchNames">{{item.abilityName1}}</div>
                    </el-tooltip>
                    <div
                      class="switchName"
                      v-if="item.abilityName&&item.abilityName.length<=10"
                    >{{item.abilityName1}}</div>
                    <div class="sortOperation">
                      <div class="selectLight" v-for="(itemIn,indexIn) in item.parameters">
                        <div class="canselect" v-if="itemIn.dataType==3">
                          <el-tooltip
                            v-if="itemIn.parameterName&&itemIn.parameterName.length>10"
                            class="item"
                            effect="dark"
                            :content="itemIn.parameterName"
                            placement="top"
                          >
                            <span
                              class="operaName operaNames"
                            >{{itemIn.parameterName1}}</span>
                          </el-tooltip>
                          <span
                            class="operaName"
                            v-if="itemIn.parameterName&&itemIn.parameterName.length<=10"
                          >{{itemIn.parameterName1}}</span>
                          <el-select
                            size="mini"
                            v-model="itemIn.scheme.value"
                            :disabled="item.sendOrderOperation"
                            @change="stateChange(item,itemIn)"
                          >
                            <el-option
                              v-for="(itemInner,indexInner) in itemIn.scheme.select"
                              :key="indexInner"
                              :label="itemInner.name"
                              :value="itemInner.code"
                            ></el-option>
                          </el-select>
                        </div>
                        <div class="oneoperate" v-if="itemIn.dataType==1">
                          <el-tooltip
                            v-if="itemIn.parameterName&&itemIn.parameterName.length>10"
                            class="item"
                            effect="dark"
                            :content="itemIn.parameterName"
                            placement="top"
                          >
                            <div
                              class="operaName"
                              style="cursor: pointer;"
                            >{{itemIn.parameterName1}}</div>
                          </el-tooltip>
                          <div
                            class="operaName"
                            v-if="itemIn.parameterName&&itemIn.parameterName.length<=10"
                          >{{itemIn.parameterName1}}</div>
                          <div class="emptyParams">
                            <el-input
                              v-model="itemIn.scheme.value"
                              :disabled="item.sendOrderOperation"
                            ></el-input>
                            <p v-if="itemIn.err">参数不能为空!</p>
                          </div>
                          <el-tooltip
                            v-if="itemIn.scheme.unit&&itemIn.scheme.unit.length>10"
                            class="item"
                            effect="dark"
                            :content="itemIn.scheme.unit"
                            placement="top"
                          >
                            <div class="item" style="cursor: pointer;">{{itemIn.scheme.unit1}}</div>
                          </el-tooltip>
                          <div
                            class="item"
                            v-if="itemIn.scheme.unit&&itemIn.scheme.unit.length<=10"
                          >{{itemIn.scheme.unit1}}</div>
                          <el-tooltip
                            class="item"
                            effect="dark"
                            :content="itemIn.description"
                            placement="top"
                          >
                            <i class="el-icon-info"></i>
                          </el-tooltip>
                        </div>
                        <div class="canselect" v-if="itemIn.dataType==2">
                          <el-tooltip
                            v-if="itemIn.parameterName&&itemIn.parameterName.length>10"
                            class="item"
                            effect="dark"
                            :content="itemIn.parameterName"
                            placement="top"
                          >
                            <div
                              class="operaName operaNames"
                            >{{itemIn.parameterName1}}</div>
                          </el-tooltip>
                          <div
                            class="operaName"
                            v-if="itemIn.parameterName&&itemIn.parameterName.length<=10"
                          >{{itemIn.parameterName1}}</div>
                          <el-select
                            size="mini"
                            v-model="itemIn.scheme.value"
                            :disabled="item.sendOrderOperation"
                            :placeholder="itemIn | meiju"
                            @change="stateChange(item,itemIn)"
                          >
                            <el-option
                              v-for="(itemInner,indexInner) in itemIn.scheme.select"
                              :key="indexInner"
                              :label="itemInner.name"
                              :value="itemInner.code"
                            ></el-option>
                          </el-select>
                        </div>
                        <div class="oneoperate" v-if="itemIn.dataType==4">
                          <el-tooltip
                            v-if="itemIn.parameterName&&itemIn.parameterName.length>10"
                            class="item"
                            effect="dark"
                            :content="itemIn.parameterName"
                            placement="top"
                          >
                            <div
                              class="operaName operaNames"
                            >{{itemIn.parameterName1}}</div>
                          </el-tooltip>
                          <div
                            class="operaName"
                            v-if="itemIn.parameterName&&itemIn.parameterName.length<=10"
                          >{{itemIn.parameterName1}}</div>
                          <div class="emptyParams">
                            <el-input
                              v-model="itemIn.realValue"
                              :disabled="item.sendOrderOperation"
                            ></el-input>
                            <p v-if="itemIn.err">参数不能为空!</p>
                          </div>
                          <div></div>
                          <el-tooltip
                            class="item"
                            effect="dark"
                            :content="itemIn.description"
                            placement="top"
                          >
                            <i class="el-icon-info"></i>
                          </el-tooltip>
                        </div>
                        <div v-if="itemIn.dataType==5">
                        </div>
                        <div class="oneoperate" v-if="itemIn.dataType==6">
                          <el-tooltip
                            v-if="itemIn.parameterName&&itemIn.parameterName.length>10"
                            class="item"
                            effect="dark"
                            :content="itemIn.parameterName"
                            placement="top"
                          >
                            <div
                              class="operaName operaNames"
                            >{{itemIn.parameterName1}}</div>
                          </el-tooltip>
                          <div
                            class="operaName"
                            v-if="itemIn.parameterName&&itemIn.parameterName.length<=10"
                          >{{itemIn.parameterName1}}</div>
                          <div class="emptyParams">
                            <el-input
                              v-model="itemIn.realValue"
                              :disabled="item.sendOrderOperation"
                            ></el-input>
                            <p v-if="itemIn.err">参数不能为空!</p>
                          </div>
                          <el-tooltip
                            v-if="itemIn.scheme.unit&&itemIn.scheme.unit.length>10"
                            class="item"
                            effect="dark"
                            :content="itemIn.scheme.unit"
                            placement="top"
                          >
                            <div class="item" style="cursor: pointer;">{{itemIn.scheme.unit1}}</div>
                          </el-tooltip>
                          <div
                            class="item"
                            v-if="itemIn.scheme.unit&&itemIn.scheme.unit.length<=10"
                          >{{itemIn.scheme.unit1}}</div>
                          <el-tooltip
                            class="item"
                            effect="dark"
                            :content="itemIn.description"
                            placement="top"
                          >
                            <i class="el-icon-info"></i>
                          </el-tooltip>
                        </div>
                      </div>
                      <el-button
                        :class="item | sending"
                        type="primary"
                        style="border:none"
                        size="mini"
                        @click="sendOrder(item)"
                      >{{item | itemSendOrder}}</el-button>
                    </div>
                  </div>
                </div>
                <div
                  v-if="operateDate.abilitys == null || operateDate.abilitys.length == 0"
                  class="switch"
                >
                  <div class="item">无</div>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <!-- 事件信息 -->
          <el-tab-pane class="operationRecord" label="事件信息" name="third">
            <div class="spaceMA" v-empty="{data:getCurrentPermission(), functions:['查看设备影子列表，设备影子详情']}">
              <span>您没有设备影子详情的查看权限！</span>
            </div>
            <div
              class="spaceMB"
              :style="{minHeight: minHeightInner + 'px'}"
               v-fence="{data:getCurrentPermission(), functions:['查看设备影子列表，设备影子详情']}"
            >
              <div class="navRecord">
                <div class="navLeft">
                  <span class="noDeal">未处理告警：{{nowarnNum}}个</span>
                  <span class="deal">告警：{{warnNum}}个</span>
                  <span class="fault">故障：{{faultNum}}个</span>
                  <span class="message">信息：{{inforNum}}个</span>
                </div>
                <div class="navRight">
                  <span class="time">时间:</span>
                  <el-button
                    type="primary"
                    size="mini"
                    :class="mouthWeek1?'blue':'gray'"
                    @click="oneMonth1"
                  >近一月</el-button>
                  <el-button
                    type="primary"
                    size="mini"
                    :class="!mouthWeek1?'blue':'gray'"
                    @click="oneWeek1"
                  >近一周</el-button>
                  <el-date-picker
                    v-model="selectDate1"
                    type="daterange"
                    format="yyyy.MM.dd"
                    @change="getTime1"
                    prefix-icon
                    :picker-options="pickerOptions0"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  ></el-date-picker>
                </div>
              </div>
              <el-dialog
                :modal-append-to-body="false"
                title="处理事件信息"
                class="plusProModel"
                :visible.sync="dialogVisible"
                width="576px"
                top="20vh"
                :before-close="handleClose"
              >
                <el-form :model="addForm" ref="addForm" :rules="addTmpRule">
                  <el-form-item label="状态" prop="productTypeId" label-width="80px">
                    <el-select v-model="addForm.productTypeId" placeholder="请选择">
                      <el-option
                        v-for="(item,index) in addForm.projectTypeArr"
                        :key="index"
                        :label="item.name"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    :label-position="labelPosition"
                    :class="addForm.productTypeId == ''? 'proDescri' : 'proDesC'"
                    label="备注"
                    label-width="80px"
                    prop="description"
                  >
                    <el-input
                      type="textarea"
                      size="mini"
                      resize="none"
                      maxlength="100"
                      :autosize="{ minRows: 6, maxRows: 10}"
                      placeholder="1-100个字符"
                      v-model.trim="addForm.description"
                    ></el-input>
                  </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="cancelClick">取 消</el-button>
                  <el-button type="primary" @click="sureClick">确 定</el-button>
                </span>
              </el-dialog>
              <ul class="conten_oper">
                <li class="dealWith" v-for="(item,index) in eventList">
                  <div>
                    <span style="position:relative">
                      <span class="icon">
                        <i class="iconfont" :class="item.eventType | eventType"></i>
                      </span>
                      <span>{{item.eventType.name}}</span>
                      <span>{{item.reportTime}}</span>
                      <span>{{item.eventName}}</span>
                      <span class="num">{{item.eventMessage}}</span>
                      <span style="display:inline-block">
                        <span v-fence="{data:getCurrentPermission(), functions:['设备影子控制与维护']}">
                          <el-button
                            v-if="item.effective && item.effective && !item.processed &&item.eventType.code == 2 "
                            type="primary"
                            size="mini"
                            class="blue"
                            @click="goDeail(item)"
                          >去处理</el-button>
                        </span>
                      </span>
                      <span
                        v-if="item.effective && item.effective && item.processed && item.eventType.code == 2 "
                        class="dealEd"
                      >已处理</span>
                    </span>
                  </div>
                  <div
                    class="beizhu"
                    v-for="(itemInner,itemIndex) in item.eventProcessList"
                  >{{itemInner}}</div>
                </li>
              </ul>
              <div class="paging fr" v-if="eventList.length">
                <el-pagination
                  background
                  @size-change="handleSizeChange1"
                  @current-change="handleCurrentChange1"
                  :current-page="eventInforParams.pageIndex"
                  :page-sizes="[10, 20, 30, 40]"
                  :page-size="eventInforParams.pageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="total1"
                ></el-pagination>
              </div>
            </div>
          </el-tab-pane>

          <!-- 操作记录 -->
          <el-tab-pane class="operationRecord" label="操作记录" name="fourth">
            <div class="spaceMA" v-empty="{data:getCurrentPermission(), functions:['查看设备影子列表，设备影子详情']}">
              <span>您没有设备影子详情的查看权限！</span>
            </div>
            <div
              class="spaceMB"
              :style="{minHeight: minHeightInner + 'px'}"
               v-fence="{data:getCurrentPermission(), functions:['查看设备影子列表，设备影子详情']}"
            >
              <div class="navRecord">
                <div class="navLeft">
                  <span class="user">用户</span>
                  <span class="worker">工作人员</span>
                </div>
                <div class="navRight">
                  <span class="time">时间:</span>
                  <el-button
                    type="primary"
                    size="mini"
                    :class="mouthWeek?'blue':'gray'"
                    @click="oneMonth"
                  >近一月</el-button>
                  <el-button
                    type="primary"
                    size="mini"
                    :class="!mouthWeek?'blue':'gray'"
                    @click="oneWeek"
                  >近一周</el-button>
                  <el-date-picker
                    v-model="selectDate"
                    type="daterange"
                    format="yyyy.MM.dd"
                    @change="getTime"
                    prefix-icon
                    :picker-options="pickerOptions0"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  ></el-date-picker>
                </div>
              </div>
              <ul class="conten_oper">
                <li class="selectList" v-for="(item,index) in selectAll">
                  <span :class="item.roleName == '管理员'?'glyType':'yhType'">{{item.operateTime}}</span>
                  <span>{{item.roleName}}</span>
                  <span>{{item.operateName}}</span>
                  <span>{{item.operateDetails}}</span>
                </li>
              </ul>

              <div class="paging fr" v-if="selectAll.length">
                <el-pagination
                  background
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="selectParams.pageIndex"
                  :page-sizes="[10, 20, 30, 40]"
                  :page-size="selectParams.pageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="total"
                ></el-pagination>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane v-if="baseInfor.seStatus !==null" class="operationRecord" label="安全监控" name="fiveth">
            <div class="spaceMA"  v-empty="{data:getCurrentPermission(), functions:['查看设备影子列表，设备影子详情']}">
              <span>您没有设备影子详情的查看权限！</span>
            </div>
            <div
              class="spaceMB"
              :style="{minHeight: minHeightInner + 'px'}"
               v-fence="{data:getCurrentPermission(), functions:['查看设备影子列表，设备影子详情']}"
            >
              <div class="securityNow">
                <div class="securityBox">
                  <span class="securityNowStatu">当前安全状态：</span>
                  <span class="securityNowStatu">{{sectivityStatusNow}}</span>
                  <el-tooltip class="item" effect="dark" placement="right">
                    <div style="font-size:14px;" slot="content">
                      1:安全告警状态：最新记录中,系统数据解析失败
                      <br />次数≥20次
                      <br />2:疑似安全告警状态：最新记录中。网关数据解
                      <br />析失败次数大于等于20次且系统数据解析失败次
                      <br />数＜20次。
                      <br />3:N/A：设备未绑定或无法获取安全信息
                    </div>
                    <i
                      class="iconfont icon-jinggao"
                    ></i>
                  </el-tooltip>
                  <el-button
                    @click="resetChange()"
                    type="primary"
                    class="resets"
                  >重置</el-button>
                </div>
                <div class="allDate">
                  <span
                    :class="newTotal?'news':'historyTol'"
                    @click="newHistory()"
                  >最新记录</span>
                  <span
                    style="margin-left:25px;"
                    :class="!newTotal?'news':'historyTol'"
                    @click="oldHistory()"
                  >历史记录</span>
                </div>
                <div class="checkTime">
                  <div v-if="newTotal">
                    <span>开始记录时间：</span>
                    <span>{{cteateTime}}</span>
                  </div>
                  <div v-else class="select-addr">
                    <span>时间：</span>
                    <el-cascader
                      :change-on-select="true"
                      :options="options"
                      style="display:inline-block;"
                      size="mini"
                      v-model="timeValue"
                      v-snap="timeValue"
                      @change="timechanges"
                    ></el-cascader>
                  </div>
                </div>
              </div>
              <div class="dataParsing">
                <div class="systemData">
                  <span
                    class="cencalTocal"
                  >系统数据解析失败次数：{{total}}次</span>
                  <div class="systemDatas">
                    <ul>
                      <li class="systemTotal" v-for="(items,ind) in mewSydtemList" :key="ind">
                        <span>{{items.date}}</span>
                        <span class="closeMessage">消息解析失败</span>
                      </li>
                    </ul>
                  </div>
                  <div v-if="mewSydtemList.length" class="paging fr">
                    <el-pagination
                      background
                      @size-change="handleSizeChangeHas"
                      @current-change="handleCurrentChangeHas"
                      :current-page.sync="page.pageNum"
                      :page-sizes="[10, 20, 50, 100]"
                      :page-size="page.pageSize"
                      layout="total, sizes, prev, pager, next, jumper"
                      :total="total"
                    ></el-pagination>
                  </div>
                </div>
                <span class="lins"></span>
                <div class="gatewayData">
                  <span class="cencalTocal">网关数据解析失败次数：{{total2}}次</span>
                  <div class="systemDatas">
                    <ul>
                      <li v-for="(item,index) in newgatewayTotl" class="systemTotal" :key="index">
                        <span class="messages">{{item.date}}</span>
                        <span class="closeMessage">消息解析失败</span>
                      </li>
                    </ul>
                  </div>
                  <div v-if="newgatewayTotl.length" class="paging fr">
                    <el-pagination
                      background
                      @size-change="handleSizeChanges"
                      @current-change="handleCurrentChanges"
                      :current-page.sync="pages.pageNum"
                      :page-sizes="[10, 20, 50, 100]"
                      :page-size="pages.pageSize"
                      layout="total, sizes, prev, pager, next, jumper"
                      :total="total2"
                    ></el-pagination>
                  </div>
                  <resetSecurity
                    :timeValue="timeValue"
                    :shadowId="shadowId"
                    :newTotal="newTotal"
                    :resetStatus="resetStatus"
                    @newHistory="newHistory"
                    @oldHistory="oldHistory"
                    @uploadStatus="uploadStatus"
                    @timeChangees="changesTims"
                  ></resetSecurity>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </template>
    </div>
  </div>
</template>
<script>
import {
  deviceShadowById, //获取基本信息数据
  deviceShadowMain, //设备基本信息健康状态维护操作
  deviceShadowReset, //设备基本信息健康状态重置操作
  deviceShadowAll,  //操作记录列表
  deviceShadowOperate,  //项目下拉框get
  deviceShadowOperation, ////重置操作设备列表
  mqttUrl,
  handleEvent, //事件处理
  eventMsgList, //事件信息列表
  eventStatusOption, //事件状态选择
  sectivityStatu, //最新记录状态
  findNewHistory, //最新记录系统失败次数
  findDatewayHistory, //最新记录网关失败次数
  oldHistoryToltal, //历史记录系统解析失败
  oldHistoryDateway, //历史记录网关解析失败
  timeChange //时间筛选
} from "../../api/api.js";
import { getDate } from "../../labs/tools.js"; //时间格式转换
import { saveAs } from "file-saver";  //下载文件插件
import moment from "moment";  //时间转换工具
import resetSecurity from "./resetSecurity.vue"; //重置功能
export default {
  components: {
    resetSecurity
  },
  name: "",
  data() {
    return {
      setSectiveSytatu: this.$route.query.status,
      newgatewayTotl: [], //安全监控最新网关失败记录
      cteateTime: "", //安全监控最新记录开始时间
      sectivityStatusNow: "", //安全监控安全状态
      newTotal: true, //安全监控历史/最新状态切换
      resetStatus: false,//安全监控重置状态
      timeValue: [null], //安全监控历史记录时间段下拉框
      options: [],  //安全监控历史记录安全下拉框数据
      page: {  //网关数据解析失败次数
        pageNum: 1,
        pageSize: 10
      },
      pages: { //系统数据解析失败次数
        pageNum: 1,
        pageSize: 10
      },
      total: 0,  //系统数据总数
      total2: 0, //网关数据总数
      dialogVisible: false, //去处理事件
      labelPosition: "left",
      addForm: {
        productTypeId: [],
        projectTypeArr: []
      },
      addTmpRule: {
        productTypeId: [
          {
            required: true,
            message: "请选择状态",
            trigger: "change"
          }
        ],
        description: [{ required: true, message: "1-100个字符" }]
      },
      input: undefined, //亮度
      pickerOptions0: {
        disabledDate(time) {
          let curDate = new Date().getTime();
          let three = 90 * 24 * 3600 * 1000;
          let threeMonths = curDate - three;
          return time.getTime() > Date.now() || time.getTime() < threeMonths;
        }
      },
      client: undefined,
      time: undefined, //时间
      switchState: undefined, //开关状态
      selectType: undefined, //开关状态
      shadowId: this.$route.query.id, //
      shadowStatus: null, //设备状态 离线 未绑定
      baseInfor: {}, //设备基本信息
      selectDate: [], //记录日期信息
      selectDate1: [], //事件日期信息
      showWH: undefined, //维护中
      noBand: undefined, //维护和重置
      selectParams: {
        pageIndex: 1,
        pageSize: 10,
        sign: 2,
        deviceId: this.$route.query.id
      },
      eventInforParams: {
        pageIndex: 1,
        pageSize: 10,
        sign: 2,
        deviceId: this.$route.query.id
      },
      total1: 0, //事件信息分页
      nowarnNum: null, //未处理警告
      warnNum: null, //告警
      faultNum: null, //故障
      inforNum: null, // 信息
      eventList: [], //事件数据
      mouthWeek1: false, //周月筛选

      selectAll: [], //操作记录
      total: 0, //操作记录分页
      mouthWeek: false, //周月筛选
      formatnowdate: undefined, //当前时间
      formatwdate: undefined, //前一周时间
      formatmdate: undefined, //前一月时间
      emptyLab: undefined, //空标签标志
      operateDate: {}, //操作数据

      data: {}, //返回參數
      minHeight: 0,
      minHeightInner: 0, //无权限时最低高度
      rooms: [],
      deviceNum: null,
      gateway: null,
      err: true,
      minHeight: null,
      dataList: [],
      activeName2: "first", //tab切换
      deviceStatus: [], //存储设备运行状态数据
      mewSydtemList: [],//历史/最新记录系统失败次数
    };
  },
  created() {
    let self = this;
    var topic = "";
    if (mqttUrl) {
      if (mqttUser) {
        this.client = require("mqtt").connect(mqttUrl, {username: mqttUser, password: mqttPWD});
      } else {
        this.client = require("mqtt").connect(mqttUrl);
      }
      self.client.on("connect", e => {
        deviceShadowOperate({
          deviceId: this.shadowId
        }).then(res => {
          topic = res.data.data.mqttTopic;
          self.client.subscribe(topic);
        });
      });
      self.client.on("message", function(topic, message) {
        let params = eval("(" + message.toString() + ")");
        if (self.shadowId == params[0].deviceId) {
          params.forEach((item, index) => {
            if (item.dataType == 1 || item.dataType == 6) {
              if (item.unit == "无") {
                item.unit = "";
              }
            }
          });
          self.deviceStatus = params;
        }
      });

      self.client.on("reconnect", e => {
        if (topic) {
          self.client.subscribe(topic);
          self.client.on("message", function(topic, message) {
            let params = eval("(" + message.toString() + ")");
            if (self.shadowId == params[0].deviceId) {
              params.forEach((item, index) => {
                if (item.dataType == 1 || item.dataType == 6) {
                  if (item.unit == "无") {
                    item.unit = "";
                  }
                }
              });
              self.deviceStatus = params;
            }
          });
        }
      });
    }
    this.getAllDate();
  },
  filters: {
    eventType: function(value) {
      if (value) {
        if (value.code == 1) {
          return "icon-xiaoxi-copy";
        } else if (value.code == 2) {
          return "icon-jinggao";
        } else if (value.code == 3) {
          return "icon-guzhang";
        }
      }
    },
    meiju: function(itemIn) {
      if (!itemIn.value) return "";
      if (itemIn.value) {
        let Name = itemIn.scheme.enumList.filter((item, index) => {
          return itemIn.value == item.value ? item : null;
        });
        return Name[0].name;
      }
    },
    sending: function(itemIn) {
      if (itemIn.deviceStatus == 3 || itemIn.deviceStatus == 6) {
        return "defaultBtn";
      } else if (itemIn.sendOrderOperation == true) {
        return "defaultBtn";
      } else {
        return "delbtn";
      }
	},
	//设备操作开关灯发送指令
    itemSendOrder: function(itemIn) {
      if (itemIn.deviceStatus == 3 || itemIn.deviceStatus == 6) {
        return "发送指令";
      } else if (itemIn.sendOrderOperation == true) {
        return "发送中";
      } else if (itemIn.sendOrderOperation == null) {
        return "发送指令";
      } else {
        return "发送指令";
      }
	},
	//设备运行状态判断
    statues1: function(item) {
      if (item.propertyValue || item.propertyValue == 0) {
        return item.propertyName + "：" + item.propertyValue + item.unit;
      } else {
        return item.propertyName + "：" + "--";
      }
    },
    statues4: function(item) {
      if (item.propertyValuenName || item.propertyValuenName == 0) {
        return item.propertyName + "：" + item.propertyValuenName;
      } else {
        return item.propertyName + "：" + "--";
      }
    },
    statues6: function(item) {
      if (item.propertyValue || item.propertyValue == 0) {
        return item.propertyName + "：" + item.propertyValue + item.unit;
      } else {
        return item.propertyName + "：" + "--";
      }
	},
  },
  mounted() {
    this.minHeight = window.innerHeight - 95;
    this.minHeightInner = window.innerHeight - 195;
  },
  methods: {
	//安全监控历史记录时间段变更
    changesTims(val) {
      this.timeValue = val;
	},
	//安全监控变更页面回调
    timechanges() {
      this.oldHistoryToltals();
      this.oldHistoryDateways();
	},
	//时间下拉框默认选中
    changeTimeFilter() {
      timeChange({}).then(res => {
        res.data.data[0].value = null;
        this.options = res.data.data;
      });
    },
    oldHistoryToltals() {
      //历史记录系统次数
      oldHistoryToltal({
        gatewayShadowId: this.shadowId,
        pageIndex: this.page.pageNum,
        pageSize: this.page.pageSize,
        code: this.timeValue[0] ? this.timeValue[0] : null,
        value: this.timeValue[1] ? this.timeValue[1] : 1
      }).then(res => {
        this.mewSydtemList = res.data.list;
        this.mewSydtemList.map((items, ind) => {
          items.date = getDate(items.date);
        });
        this.total = res.data.total;
      });
    },
    oldHistoryDateways() {
      //历史记录网关次数
      oldHistoryDateway({
        gatewayShadowId: this.shadowId,
        pageIndex: this.pages.pageNum,
        pageSize: this.pages.pageSize,
        code: this.timeValue[0] ? this.timeValue[0] : null,
        value: this.timeValue[1] ? this.timeValue[1] : 1
      }).then(res => {
        this.newgatewayTotl = res.data.list;
        this.newgatewayTotl.map((item, index) => {
          item.date = getDate(item.date);
        });
        this.total2 = res.data.total;
      });
    },
    newSystem() {
      //最新记录系统次数
      findNewHistory({
        gatewayShadowId: this.shadowId,
        pageIndex: this.page.pageNum,
        pageSize: this.page.pageSize
      }).then(res => {
        this.mewSydtemList = res.data.list;
        this.mewSydtemList.map((items, ind) => {
          items.date = getDate(items.date);
        });
        this.total = res.data.total;
      });
    },
    oldGateway() {
      //最新记录网关次数
      findDatewayHistory({
        gatewayShadowId: this.shadowId,
        pageIndex: this.pages.pageNum,
        pageSize: this.pages.pageSize
      }).then(res => {
        this.newgatewayTotl = res.data.list;
        this.newgatewayTotl.map((item, index) => {
          item.date = getDate(item.date);
        });
        this.total2 = res.data.total;
      });
    },
    nowSectivityChange() {
      //设备影子记录状态
      sectivityStatu({
        gatewayShadowId: this.shadowId
      }).then(res => {
        this.sectivityStatusNow = res.data.data.value;
        this.cteateTime = res.data.data.startTime;
        if (this.cteateTime) {
          let timeStamp = JSON.parse(JSON.stringify(this.cteateTime));
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
            year + "年" + month + "月" + date + "日" + hours + ":" + minutes;
          this.cteateTime = resStr;
        }
      });
	},
	//最新记录页面列表
    newHistory() {
      this.newTotal = true;
      this.nowSectivityChange();
      this.newSystem();
      this.oldGateway();
	},
	//历史记录页面列表
    oldHistory() {
      this.newTotal = false;
      this.oldHistoryToltals();
      this.oldHistoryDateways();
      this.changeTimeFilter();
	},
	//最新记录安全状态变更
    uploadStatus(val) {
      this.resetStatus = val;
	},
	//安全监控记录重置
    resetChange() {
      this.resetStatus = true;
      if (this.newTotal === true) {
        this.newSystem();
      } else {
        this.oldHistoryToltals();
      }
	},
	//安全监控系统失败分页切换
    handleSizeChangeHas(val) {
      this.page.pageSize = val;
      this.pages.pageNum = 1;
      if (this.newTotal === true) {
        this.newSystem();
      } else {
        this.oldHistoryToltals();
      }
	},
	//安全监控系统失败分页切换
    handleCurrentChangeHas(val) {
      this.page.pageNum = val;
      if (this.newTotal === true) {
        this.newSystem();
      } else {
        this.oldHistoryToltals();
      }
	},
	//安全监控网关失败分页切换
    handleSizeChanges(val) {
      this.pages.pageSize = val;
      this.pages.pageNum = 1;
      if (this.newTotal === true) {
        this.oldGateway();
      } else {
        this.oldHistoryDateways();
	  }
	},
	//安全监控网关失败分页切换
    handleCurrentChanges(val) {
      this.pages.pageNum = val;
      if (this.newTotal === true) {
        this.oldGateway();
      } else {
        this.oldHistoryDateways();
      }
	},
	//权限控制
    getCurrentPermission() {
      var permission = "";
      if (this.baseInfor.bindingAddress) {
        permission = this.baseInfor.bindingAddress.split(" ")[0];
      }
      return permission;
	},
	//处理事件信息弹框关闭
    cancelClick() {
      this.dialogVisible = false;
      this.$refs["addForm"].resetFields();
      this.$set(this.addForm, "description", null);
	},
	//处理事件信息成功
    sureClick() {
      this.$refs["addForm"].validate(valid => {
        if (valid) {
          let status = null;
          if (this.addForm.productTypeId == "未处理") {
            status = 1;
          } else {
            status = this.addForm.productTypeId;
          }
          let params = {
            eventId: this.addForm.eventId,
            status: status,
            remark: this.addForm.description
          };

          handleEvent(params).then(res => {
            if (res.err_CODE == 0) {
              this.dialogVisible = false;
              this.$refs["addForm"].resetFields();
              this.$set(this.addForm, "description", null);
              this.eventInfor();
            }
          });
        }
      });
    },
    //去处理事件
    goDeail(item) {
      this.dialogVisible = true;
      this.$set(this.addForm, "description", null);
      this.addForm.eventId = item.eventId;
    },
    handleClose() {
      this.dialogVisible = false;
      this.$refs["addForm"].resetFields();
      this.$set(this.addForm, "description", null);
    },
    //初始化日期
    getTime(date) {
      this.time = date;
      delete this.selectParams.sign;
      this.selectParams.startDate = moment(this.time[0]).format("YYYY-MM-DD");
      this.selectParams.endDate = moment(this.time[1]).format("YYYY-MM-DD");
      this.sellectAll();
    },
    //初始化日期
    getTime1(date) {
      this.time1 = date;
      delete this.eventInforParams.sign;
      this.eventInforParams.startDate = moment(this.time1[0]).format(
        "YYYY-MM-DD"
      );
      this.eventInforParams.endDate = moment(this.time1[1]).format(
        "YYYY-MM-DD"
      );
      this.eventInfor();
    },
    // 下载文件
    downLoadFile(url, version) {
      let fileName = url.lastIndexOf(".");
      let fileNameLength = url.length;
      let fileFormat = url.substring(fileName + 1, fileNameLength);
      let FileSaver = require("file-saver");
      if (url) FileSaver.saveAs(url, version + "." + fileFormat);
    },
    sendOrder(item) {
      let self = this;
      let canSend = true;
      if (item.deviceStatus == 3) {
        canSend = false;
      }
      if (item.deviceStatus == 6) {
        canSend = false;
      }
      if (canSend) {
        let params = {
          deviceId: this.shadowId,
          abilityId: item.abilityId,
          values: []
        };
        let haveErr = false;
        item.parameters.forEach(itemIn => {
          if (itemIn.dataType == "1") {
            if (!itemIn.scheme.value) {
              itemIn.err = true;
              haveErr = true;
            } else {
              itemIn.err = false;
              haveErr = false;
            }
          }
          if (itemIn.dataType == "4") {
            if (!itemIn.realValue) {
              itemIn.err = true;
              haveErr = true;
            } else {
              itemIn.err = false;
              haveErr = false;
            }
          }
          if (itemIn.dataType == "6") {
            if (!itemIn.realValue) {
              itemIn.err = true;
              haveErr = true;
            } else {
              itemIn.err = false;
              haveErr = false;
            }
          }
          if (itemIn.dataType == 3) {
            params.values.push({
              key: itemIn.key,
              value: itemIn.scheme.value
            });
          }
          if (itemIn.dataType == 1 || itemIn.dataType == 2) {
            params.values.push({
              key: itemIn.key,
              value: itemIn.scheme.value
            });
          }
          if (itemIn.dataType == 4 || itemIn.dataType == 6) {
            params.values.push({
              key: itemIn.key,
              value: itemIn.scheme.value
            });
          }
        });
        //按钮防重复点击
        if (!haveErr) {
          item.sendOrderOperation = true;
        }
        if (item.sendOrderOperation) {
          deviceShadowOperation(params).then(res => {
            //重置操作设备
            item.sendOrderOperation = false;
            if (res.err_CODE == 0) {
              self.$message.success(res.err_MESSAGE);
            } else {
              self.$message.error(res.err_MESSAGE);
            }
          });
        }
      }
	},
	//设备运行状态/操作列表
    operate() {
      deviceShadowOperate({
        deviceId: this.shadowId
      }).then(res => {
        res.data.data.abilitys && res.data.data.abilitys.forEach((item, index) => {
          if (item.abilityName.length > 10) {
            item.abilityName1 = item.abilityName.substring(0, 10) + "...";
          } else {
            item.abilityName1 = item.abilityName;
          }
          item.sendOrderOperation = null;
           item.parameters && item.parameters.forEach((itemInner, indexInner) => {
            itemInner.deviceStatus = item.deviceStatus;
            if (itemInner.dataType == "3") {
              let arr = [];
              arr.push({
                name: itemInner.scheme.positive,
                code: true
              });
              arr.push({
                name: itemInner.scheme.negative,
                code: false
              });
              itemInner.scheme.select = arr;
              if (itemInner.value == null) {
                itemInner.scheme.value = arr[0].code;
              } else {
                itemInner.scheme.value = itemInner.value;
              }
              if (itemInner.parameterName.length > 10) {
                itemInner.parameterName1 =
                  itemInner.parameterName.substring(0, 10) + "...";
              } else {
                itemInner.parameterName1 = itemInner.parameterName;
              }
            }
            if (itemInner.dataType == "2") {
              let arr = [];
              itemInner.scheme.enumList && itemInner.scheme.enumList.forEach((scheItem, scheIndex) => {
                arr.push({
                  name: scheItem.name,
                  code: scheItem.value
                });
              });
              itemInner.scheme.select = arr;
              itemInner.scheme.value = itemInner.value
                ? itemInner.value
                : arr[0].code;
              if (itemInner.parameterName.length > 10) {
                itemInner.parameterName1 =
                  itemInner.parameterName.substring(0, 10) + "...";
              } else {
                itemInner.parameterName1 = itemInner.parameterName;
              }
            }
            if (itemInner.dataType == "1") {
              itemInner.scheme.value = itemInner.value;
              itemInner.err = null; //错误提示
              if (itemInner.parameterName.length > 10) {
                itemInner.parameterName1 =
                  itemInner.parameterName.substring(0, 10) + "...";
              } else {
                itemInner.parameterName1 = itemInner.parameterName;
              }
              if (itemInner.scheme.unit.length > 10) {
                itemInner.scheme.unit1 =
                  itemInner.scheme.unit.substring(0, 10) + "...";
              } else if (itemInner.scheme.unit == "无") {
                itemInner.scheme.unit1 = "";
              } else {
                itemInner.scheme.unit1 = itemInner.scheme.unit;
              }
            }
            if (itemInner.dataType == "4") {
              itemInner.realValue = itemInner.value;
              itemInner.err = null;
              if (itemInner.parameterName.length > 10) {
                itemInner.parameterName1 =
                  itemInner.parameterName.substring(0, 10) + "...";
              } else {
                itemInner.parameterName1 = itemInner.parameterName;
              }
            }
            if (itemInner.dataType == "6") {
              itemInner.realValue = itemInner.value;
              itemInner.err = null;
              if (itemInner.parameterName.length > 10) {
                itemInner.parameterName1 =
                  itemInner.parameterName.substring(0, 10) + "...";
              } else {
                itemInner.parameterName1 = itemInner.parameterName;
              }
              if (itemInner.scheme.unit.length > 10) {
                itemInnerscheme.unit1 =
                  itemInner.scheme.unit.substring(0, 10) + "...";
              } else if (itemInner.scheme.unit == "无") {
                itemInner.scheme.unit1 = "";
              } else {
                itemInner.scheme.unit1 = itemInner.scheme.unit;
              }
            }
          });
        });
        res.data.data.deviceStatus.forEach((inteam, inIndex) => {
          if (inteam.dataType == 1 || inteam.dataType == 6) {
            if (inteam.unit == "无") {
              inteam.unit = "";
            }
          }
        });
        this.deviceStatus = res.data.data.deviceStatus;
        this.operateDate = res.data.data;
      });
	},
	//一月内的操作记录
    oneMonth1() {
      this.mouthWeek1 = true;
      this.eventInforParams.sign = "1";
      delete this.eventInforParams.startDate;
      delete this.eventInforParams.endDate;
      this.selectDate1 = [
        this.formatmdate.replace(/-/g, "."),
        this.formatnowdate.replace(/-/g, ".")
      ];
      this.eventInfor();
	},
	//一周内的操作记录
    oneWeek1() {
      this.mouthWeek1 = false;
      this.eventInforParams.sign = "2";
      delete this.eventInforParams.startDate;
      delete this.eventInforParams.endDate;
      this.selectDate1 = [
        this.formatwdate.replace(/-/g, "."),
        this.formatnowdate.replace(/-/g, ".")
      ];
      this.eventInfor();
	},
	//近一月的事件信息
    oneMonth() {
      this.mouthWeek = true;
      this.selectParams.sign = "1";
      delete this.selectParams.startDate;
      delete this.selectParams.endDate;
      this.selectDate = [
        this.formatmdate.replace(/-/g, "."),
        this.formatnowdate.replace(/-/g, ".")
      ];
      this.sellectAll();
	},
	//近一周的事件信息
    oneWeek() {
      this.mouthWeek = false;
      this.selectParams.sign = "2";
      delete this.selectParams.startDate;
      delete this.selectParams.endDate;
      this.selectDate = [
        this.formatwdate.replace(/-/g, "."),
        this.formatnowdate.replace(/-/g, ".")
      ];
      this.sellectAll();
	},
	//事件信息列表
    sellectAll() {
      deviceShadowAll(this.selectParams).then(res => {
        res.data.list.forEach((item, index) => {
          res.data.list[index].operateTime = getDate(
            res.data.list[index].operateTime
          );
        });
        this.selectAll = res.data.list;
        this.selectAll.map((item, index) => {
          item.roleName = item.roleName.trim();
        });
        this.total = res.data.total;
      });
	},
    eventInfor() {
      eventMsgList(this.eventInforParams).then(res => {
        this.nowarnNum = res.data.statistics.unprocessedAlarmNum; //未处理警告
        this.warnNum = res.data.statistics.alarmNum; //告警
        this.faultNum = res.data.statistics.faultNum; //故障
        this.inforNum = res.data.statistics.messageNum; // 信息
        this.eventList = res.data.pageInfo.list;
        this.total1 = res.data.pageInfo.total;
      });
      eventStatusOption({}).then(res => {
        this.addForm.projectTypeArr = [];
        this.addForm.projectTypeArr = res.data.data;
        this.addForm.productTypeId = "未处理";
      });
	},
	//近一月/近一周时间格式转换
    getDay() {
      let nowdate = new Date();
      let y = nowdate.getFullYear();
      let m = nowdate.getMonth() + 1;
      let d = nowdate.getDate();
      this.formatnowdate = y + "-" + m + "-" + d; //当前时间
      let oneweekdate = new Date(nowdate - 7 * 24 * 3600 * 1000);
      let y1 = oneweekdate.getFullYear();
      let m1 = oneweekdate.getMonth() + 1;
      let d1 = oneweekdate.getDate();
      this.formatwdate = y1 + "-" + m1 + "-" + d1; //前一周时间
      nowdate.setMonth(nowdate.getMonth() - 1);
      let y2 = nowdate.getFullYear();
      let m2 = nowdate.getMonth() + 1;
      let d2 = nowdate.getDate();
      this.formatmdate = y2 + "-" + m2 + "-" + d2; //前一月时间
    },
    getYearMouthDate() {
      this.selectDate = [
        this.formatwdate.replace(/-/g, "."),
        this.formatnowdate.replace(/-/g, ".")
      ];
      this.selectDate1 = [
        this.formatwdate.replace(/-/g, "."),
        this.formatnowdate.replace(/-/g, ".")
      ];
	},
	//设备基本信息状态维护
    mainTain() {
      deviceShadowMain({
        shadowId: this.shadowId
      }).then(res => {
        if (res.err_CODE == "0") {
          this.baseInfor.shadowStatus = res.data.shadowStatus;
          this.showWH = false;
        }
      });
	},
	//设备基本信息状态重置
    reset() {
      deviceShadowReset({
        shadowId: this.shadowId
      }).then(res => {
        if (res.err_CODE == "0") {
          this.baseInfor.shadowStatus = res.data.shadowStatus;
          this.showWH = true;
        }
      });
    },
    //获取设备基本信息
    getAllDate() {
      deviceShadowById({
        shadowId: this.shadowId
      }).then(res => {
        if (res.data) {
          if (res.data.shadowStatusUpdateTime) {
            res.data.shadowStatusUpdateTime = getDate(
              res.data.shadowStatusUpdateTime
            );
          }
          if (res.data.shadowBindingTime) {
            res.data.shadowBindingTime = getDate(res.data.shadowBindingTime);
          }

          this.baseInfor = res.data;
          this.shadowStatus = res.data.shadowStatus;
          if (this.baseInfor.shadowLabel.length <= 0) {
            this.emptyLab = true;
          } else {
            this.emptyLab = false;
          }
          if (this.baseInfor.shadowStatus == "维护中") {
            this.showWH = false;
          } else {
            this.showWH = true;
          }
          if (res.data.shadowStatus == "未绑定") {
            this.noBand = false;
          } else {
            this.noBand = true;
          }
        }
      });
    },
    //tab切换
    handleClick(tab, event) {
      if (tab.index == 0) {
         const loading = this.$loading({
          lock: true,
          target: document.querySelector('#ldevice-detail')
        });
        loading.close();
        this.getAllDate();
      } else if (tab.index == 1) {
        this.operate();
      } else if (tab.index == 2) {
        this.mouthWeek1 = false;
        this.eventInforParams.sign = "2";
        delete this.eventInforParams.startDate;
        delete this.eventInforParams.endDate;
        this.eventInfor();
        this.getDay();
        this.getYearMouthDate();
      } else if (tab.index == 3) {
        this.mouthWeek = false;
        this.selectParams.sign = "2";
        delete this.selectParams.startDate;
        delete this.selectParams.endDate;
        this.sellectAll();
        this.getDay();
        this.getYearMouthDate();
      } else if (tab.index == 4) {
        this.nowSectivityChange();
        this.newSystem();
        this.oldGateway();
      }
    },
    //事件列表
    handleSizeChange1(val) {
      this.eventInforParams.pageIndex = 1;
      this.eventInforParams.pageSize = val;
      this.eventInfor();
    },
    handleCurrentChange1(val) {
      this.eventInforParams.pageIndex = val;
      this.eventInfor();
    },
    //获取操作日志
    handleSizeChange(val) {
      this.selectParams.pageIndex = 1;
      this.selectParams.pageSize = val;
      this.sellectAll();
    },
    handleCurrentChange(val) {
      this.selectParams.pageIndex = val;
      this.sellectAll();
    }
  }
};
</script>
<style lang='scss'>
.el-tooltip__popper.is-dark {
  background: rgba(255, 255, 255, 1) !important;
  color: #323232 !important;
  box-shadow: 0px 2px 10px 2px rgba(0, 0, 0, 0.1) !important;
}

.el-tooltip__popper[x-placement^="top"] .popper__arrow {
  border-top-color: rgba(255, 255, 255, 1) !important;
}

.el-tooltip__popper[x-placement^="top"] .popper__arrow::after {
  border-top-color: rgba(255, 255, 255, 1) !important;
}

#device-detail
  .device-mag-box
  .el-tabs--card
  > .el-tabs__header
  .el-tabs__item {
  margin-right: 8px;
}
#device-detail {
  .el-tabs__item {
    font-weight: bold;
  }
  #pane-second {
    padding: 10px 24px 0 24px;
    position: relative;
    min-height: 100%;
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
      .deatyStatus{
        float:left;
        background:#DEDEDE;
        height: 11px;
        width: 1px;
        margin: 8px 0px 0px 10px;
      }
      .deviceTol{
        float:left;
        margin-left:6px;
      }
    }
    .deveieWrap {
      display: inline-block;
      margin-right: 36px;
      .onedevicestate {
        line-height: 17px;
        margin: 5px 0 15px 0;
      }
    }
    .switch {
      overflow: hidden;
      .wrap {
        overflow: hidden;
        width: 670px;
        background: #f1f1f1;
        margin-bottom: 10px;
        padding: 24px 0 0 12px;
        min-height: 70px;
        .el-button {
          position: absolute;
          right: 0;
          top: 0;
          margin-top: 0 !important;
        }
      }
      .switchName {
        float: left;
        display: inline-block;
        width: 156px;
        margin-top: 4px;
        font-weight: bold;
      }
      .switchNames{
        cursor: pointer;
      }
      .sortOperation {
        float: left;
        position: relative;
        width: 480px !important;
      }
      .selectLight {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .canselect {
          margin-bottom: 15px;
          width: 480px;
          .el-button {
            float: right;
            margin: 0;
          }
          .el-select {
            float: left;
          }
          .operaName {
            float: left;
            display: inline-block;
            width: 129px;
            text-align: right;
            margin-top: 4px;
          }
          .operaNames{
            cursor: pointer;
          }
        }
        .item {
          margin-top: 4px;
        }
        .el-input {
          width: 120px;
          margin: 0 3px;
          color: #323232;
        }
        .lightText {
          width: 76px;
        }
        .el-icon-info {
          color: #d8d8d8;
          cursor: pointer;
          margin: 7.5px 17px 0 6px;
        }
        .oneoperate {
          width: 480px;
          overflow: hidden;
          height: 42px;
          .el-button {
            float: right;
          }
          .operaName {
            float: left;
            display: inline-block;
            width: 129px;
            text-align: right;
            margin-top: 4px;
          }
          .emptyParams {
            float: left;
            position: relative;
            p {
              position: absolute;
              left: 0;
              top: 22px;
              color: #cc3d3d;
            }
          }
          .item {
            float: left;
          }
          .el-button {
            float: right;
            margin: 0;
          }
        }
      }
      .el-input__inner {
        height: 25px;
        width: 120px;
        font-size: 12px;
        background: #d9eafb;
        border-radius: 2px;
        padding-left: 2px;
        border: none;
        outline: none;
      }
      .el-input__inner::-webkit-input-placeholder {
        color: #323232;
      }
      .el-input__suffix {
        right: 0;
      }
      .delbtn {
        margin-top: 0;
        padding: 0;
        width: 65px;
        height: 25px;
        margin-left: 33px;
        span {
          color: #ffffff;
          font-size: 12px;
          font-weight: 400;
        }
      }
      .defaultBtn {
        background: #adadad;
        margin-top: 0;
        margin-left: 33px;
        padding: 0;
        width: 65px;
        height: 25px;
      }
    }
    .span {
      font-size: 14px;
      font-weight: bold;
      color: #323232;
      margin-bottom: 8px;
    }
    .operation {
      line-height: 28px;
      display: flex;
      justify-content: space-between;
      .delbtn {
        margin: 0;
        width: 86px;
        font-family: "not specified";
      }
    }
  }
  .selectList {
    line-height: 17px;
    margin-top: 12px;
    span {
      font-size: 12px;
      font-weight: 400;
      color: #323232;
    }
    span:first-child {
      padding-left: 7px;
      margin-right: 40px;
    }
    span:nth-of-type(3) {
      color: #adadad;
    }
  }
  .yhType,
  .glyType {
    position: relative;
  }
  .yhType::before,
  .glyType::before {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: #ffc237;
    content: "";
    position: absolute;
    left: 0;
    top: 7px;
  }
  .glyType::before {
    background: #0fadff;
  }
  #pane-fourth,
  #pane-third,
  #pane-fiveth {
    width: 100%;
    padding: 12px 24px 17px 12px;
    position: relative;
    min-height: 100%;
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
    }
  }
  #pane-third {
    .plusProModel {
      .el-dialog {
        .el-dialog__footer {
          text-align: center;
          padding-bottom: 30px;
          .el-button {
            padding: 0;
            width: 88px;
            height: 28px;
            text-align: center;
            font-size: 12px;
            border: 1px solid #af7c58;
          }
          .el-button--default {
            color: #323232;
            background: white;
            border: 1px solid rgba(175, 124, 88, 1);
          }
          .el-button--primary {
            background: #af7c58;
          }
        }
        .el-button--primary:active {
          background: #9e704f;
          color: #ffffff;
          outline: none;
        }
        .el-button:hover,
        .el-button:focus {
          color: #af7c58;
          background-color: #f7f2ee;
        }
        .el-button--primary:hover,
        .el-button--primary:focus {
          background: #9e704f;
          color: #ffffff;
        }
        .el-form {
          .el-form-item {
            padding-bottom: 10px;
            height: auto;
            .el-form-item__label {
              line-height: 24px;
            }
            .el-form-item__content {
              line-height: 24px;
              .el-input {
                .el-form-item__error {
                  width: 430px !important;
                  line-height: 18px !important;
                }
              }
            }
            margin-bottom: 10px;
          }
          .el-form-item__label {
            text-align: left;
          }
          .el-input {
            width: 430px;
            .el-select__caret {
              line-height: 24px;
            }
          }
          .el-input__inner {
            width: 430px;
            height: 24px;
          }
          textarea {
            width: 430px;
          }
          .proDescri {
            padding-top: 8px;
            .el-form-item__label {
              line-height: 17px !important;
            }
          }
          .proDesC {
            .el-form-item__label {
              line-height: 17px !important;
            }
          }
        }
      }
    }
    .navRecord {
      margin-bottom: 27px;
    }
    .navLeft {
      font-weight: bold;
      .noDeal,
      .deal {
        position: relative;
        padding-left: 8px;
        margin-right: 42px;
      }
      .noDeal::before,
      .deal::before {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #d4041e;
        content: "";
        position: absolute;
        left: 0;
        top: 7px;
      }
      .deal::before {
        background: #ffbf00;
      }
      .fault {
        margin: 0 24px;
      }
    }
    .navRight .time {
      font-weight: bold;
    }
    .dealWith {
      color: #323232;
      margin-top: 12px;
      span {
        font-size: 12px;
      }
      .beizhu {
        margin-left: 40px;
        margin-top: 12px;
        font-size: 12px;
        color: #323232;
      }
      .icon-xiaoxi-copy {
        color: #0fadff;
      }
      .icon-jinggao {
        color: rgb(255, 194, 55);
      }
      .icon-guzhang {
        color: #cc3d3d;
      }
      .icon {
        display: inline-block;
        width: 12px;
        height: 12px;
        .iconfont {
          font-size: 12px;
        }
      }
      .el-button {
        margin-top: 0;
        padding: 3px 12px;
        border: none;
      }
      .num {
        color: #af7c58;
        margin: 0 8px 0 15px;
      }
      .dealEd {
        display: inline-block;
        width: 50px;
        line-height: 18px;
        text-align: center;
        font-size: 10px;
        background: #87d6ff;
        border-radius: 15px;
      }
    }
  }
  .operationRecord {
    .navRecord {
      font-size: 14px;
      font-weight: 500;
      color: #323232;
      line-height: 25px;
      height: 25px;
      .navLeft {
        float: left;
        .user,
        .worker {
          position: relative;
          padding-left: 8px;
        }
        .user::before,
        .worker::before {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #ffc237;
          content: "";
          position: absolute;
          left: 0;
          top: 7px;
        }
        .worker {
          margin-left: 36px;
        }
        .worker::before {
          background: #0fadff;
        }
      }
      .navRight {
        float: right;
        .el-date-editor {
          margin-left: 42px;
          width: 180px;
          height: 25px;
          background: #d9eafb;
          border: none;
          display: flex;
          float: right;
          justify-content: space-between;
          padding: 0;
          .el-input__icon {
            display: none;
          }
          .el-range-input {
            background: transparent;
            width: 45%;
          }
          .el-range-separator {
            line-height: 25px;
            color: #323232;
            padding: 0;
          }
          .el-range-input::-webkit-input-placeholder {
            color: #323232;
          }
        }
        .time {
          width: 48px;
          text-align: start;
          display: inline-block;
        }
        .blue,
        .gray {
          width: 53px;
          height: 25px;
          margin-top: 0;
          border: none;
          padding: 0;
          margin: 0;
          margin-left: -6px;
        }
        .gray {
          background: #d9eafb;
        }
        .blue span,
        .gray span {
          margin-left: 0;
          font-size: 12px;
          font-weight: 400;
        }
        .blue span {
          color: #ffffff;
        }
        .gray span {
          color: #adadad;
        }
      }
    }
  }
  .shadow-title {
    font-size: 12px;
    color: #323232;
    line-height: 17px;
    padding: 18px 0 6px 0;
    font-weight: bold;
  }
  .shadow-title-top {
    margin-top: 6px;
  }
  .table-left {
    text-align: left;
    padding: 0 8px;
    width: 19%;
  }
  .table-color1 {
    color: #323232;
    font-size: 12px;
    font-weight: bold;
  }
  .table-color2 {
    font-size: 12px;
    font-weight: 400;
    color: #323232;
  }
  .table-color3 {
    font-size: 12px;
    font-weight: 500;
    color: #af7c58;
    border-bottom: 1px solid #af7c58;
    cursor: pointer;
    margin: 0 3px;
  }
  .table-color4 {
    font-size: 12px;
    font-weight: 400;
    color: #323232;
    line-height:17px;
    margin: -5px 0 16px 0;
  }
  .table-back-color {
    background: #ebf4fc;
    width: 120px;
  }
  .devece-table {
    #pane-first {
      padding: 0 24px;
      position: relative;
      min-height: 100%;
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
      }
      table {
        width: 100%;
        min-height: 25px;
        line-height: 25px;
        text-align: center;
        border-collapse: collapse;
        border: 1px solid #adadad;
        tr {
          height: 30px;
        }
        tr td {
          border: 1px solid #adadad;
        }
      }
    }
  }
  .msg-title {
    margin-bottom: 8px;
    .back {
      display: inline-block;
      width: 60px;
      height: 24px;
      border-radius: 2px;
      color: #323232;
      text-align: center;
      margin-right: 8px;
      .el-button {
        padding: 5px 8px;
        border-radius: 2px;
        font-size: 12px;
        color: #fff;
        background: #0fadff;
        margin-right: 12px;
        border: none;
      }
    }
    .template-name-right {
      margin-right: 16px;
    }
    .template-name {
      display: inline-block;
      font-size: 16px;
      font-weight: 600;
      color: #323232;
    }
  }
  .device-mag-box {
    .el-tabs--card {
      height: calc(100vh - 138px);
      .el-tabs__content {
        height: calc(100% - 36px);
        overflow-y: scroll;
      }
    }
  }
}

.space-detail {
  .form {
    .el-form-item__error {
      width: 260px;
    }
  }
  .rz_err {
    color: #af7c58;
    font-size: 14px;
  }
  .conten_oper {
    min-height: 36vh;
  }
  .device-mag-box .el-tabs__header {
    padding: 0;
    position: relative;
    margin: 0;
  }
  .device-mag-box .el-tabs--card > .el-tabs__header .el-tabs__nav {
    border: none;
  }
  .device-mag-box .el-tabs--card > .el-tabs__header {
    border-bottom: none;
  }
  .device-mag-box .el-tabs--card > .el-tabs__header .el-tabs__item {
    border-left: none;
    background: rgba(255, 255, 255, 0.7);
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    color: #999;
  }
  .device-mag-box .el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
    border-bottom-color: transparent;
  }
  .device-mag-box .el-tabs__item {
    height: 28px;
    line-height: 28px;
  }
  .device-mag-box .el-tabs--card > .el-tabs__header .el-tabs__item:first-child {
    margin-right: 8px;
  }
  .device-mag-box .el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
    color: #323232;
    background: #fff;
  }
  .device-mag-box .el-tabs__content {
    background: #fff;
  }
  .bigImg {
    .el-dialog__body {
      text-align: center;
    }
  }
  //分页
  .el-pagination {
    padding: 2px 0;
  }
  .paging{
    margin-top: 10px;
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
  .checkTime {
    .select-addr {
      .el-cascader .el-input .el-input__inner {
        background: #d9eafb !important;
        border: 0;
        outline: none;
        cursor:pointer;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
@import "../../styles/template-detail.scss";
.lab-box {
  margin-top: 6px;
  top: 249px;
}

.icon {
  width: 20px;
  height: 20px;
}

.conten_titel {
  margin-top: 12px;
  color: #ffffff;
  font-size: 14px;
  padding-left: 18px;
  span {
    margin-right: 36px;
  }
}

.space-detail .el-form-item {
  height: 44px;
}

.err {
  margin-left: 20px;
  margin-top: 10px;
  color: #af7c58;
  font-size: 14px;
}
.securityNow {
  width: 100%;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 24px 0 24px;
  .securityBox{
    .securityNowStatu{
      font-weight:bold;
      font-size:14px
    }
    .icon-jinggao{
      color:#D8D8D8;
      margin-left:6px;
    }
    .resets{
      border:none;
      margin-left:24px;
    }
  }
  .allDate {
    display: inline-block;
    .news {
      outline: none;
      color: #0fadff;
      font-size: 14px;
      background: none;
      border: none;
      cursor: pointer;
    }
    .historyTol {
      color: #adadad;
      outline: none;
      font-size: 14px;
      background: none;
      border: none;
      cursor: pointer;
    }
  }
}
.dataParsing {
  padding: 10px 24px 0 24px;
  .systemData {
    width: 100%;
    height: 50%;
  }
  .lins {
    width: 100%;
    height: 1px;
    margin-top: 63px;
    background: #d8d8d8;
    display: block;
  }
  .cencalTocal {
    color: rgba(50, 50, 50, 1);
    line-height: 18px;
    font-weight: bold;
    font-size:13px;
    margin-top:20px;
    display:block;
  }
  .systemDatas {
    height: 210px;
    overflow-y: auto;
  }
  .systemTotal {
    position: relative;
    padding-left: 12px;
    margin-top: 12px;
    .messages{
      display:inline-block;
      color:#323232
    }
    .closeMessage{
      display:inline-block;
      color:#323232;
      margin-left:31px;
    }
  }
  .systemTotal::before {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #0fadff;
    content: "";
    position: absolute;
    left: 0;
    top: 7px;
  }
  .el-pagination {
    padding: 2px 0;
  }
  .paging{
    margin-top: 10px;
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
  .gatewayData {
    width: 100%;
    height: 100%;
    margin-top: 20px;
    position: relative;
    .cencalTocal{
      color: rgba(50, 50, 50, 1);
      line-height: 18px;
      font-weight: bold;
      font-size:13px;
      margin-top:20px;
      display:block;
    }
    .el-pagination {
      padding: 2px 0;
      position: absolute;
      right: 0px;
      top: 345px;
    }
    .paging{
      margin-top: 10px;
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
}
</style>
