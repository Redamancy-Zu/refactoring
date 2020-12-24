<template>
  <div id="modelDetailEdit">
    <el-dialog
      class="dialogindex"
      title="编辑功能"
      :visible.sync="mdeditopen"
      width="576px"
      top="16vh"
      @open="receiveParams"
      :before-close="mdeditoutX"
    >
      <el-scrollbar class="MDetail" ref="MDetail">
        <div>
          <el-form
            label-width="85px"
            class="proedit"
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
          >
            <el-form-item
              required
              class="funtype"
              label="功能类型"
              label-height="60px"
            >{{ruleForm.proType}}</el-form-item>
            <el-form-item label="功能名称" prop="proName">
              <el-input
                size="mini"
                class="name"
                v-model="ruleForm.proName"
                placeholder="支持汉字、字母、数字、-和_，必须以汉字、字母或数字开头"
              ></el-input>
            </el-form-item>
            <!-- 筛选条件 -->
            <el-form-item v-if="ruleForm.proType!='能力'" class="shaiX describ" label-width="0">
              <el-checkbox @change="shaixuanChange(ruleForm)" v-model="ruleForm['openFilter']"><span :style="{'color':ruleForm.openFilter ? 'black':'#ADADAD'}">筛选条件</span></el-checkbox>
              <el-popover
                style="position: absolute;left: 67px;top: 2px;"
                placement="top-start"
                width="339"
                trigger="hover"
                :content="messageTemplate1">
                <i slot="reference" style="color:#D8D8D8" class="el-icon-info"></i>
              </el-popover>
              <el-input
                @blur="shaiInpYanZ(ruleForm.filter,ruleForm)"
                :disabled="!ruleForm.openFilter"
                size="mini"
                placeholder='1-1000个字符，例："objid"：1，"name"："light"，'
                type="textarea"
                v-model.trim="ruleForm.filter"
                maxlength="1000"
                resize="none"
                :autosize="{ minRows: 6, maxRows: 10}"
              ></el-input>
              <span v-if="ruleForm.openFilter && ruleForm.yanZ || opyan" class="el-form-item__error">1-1000个字符</span>
            </el-form-item>
            <!-- 标识符更改 -->
            <el-form-item label="标识符" prop="key">
              <el-input
                size="mini"
                class="name"
                v-model="ruleForm.key"
                placeholder="支持字母、数字和_，必须以字母开头"
              ></el-input>
            </el-form-item>
            <!-- 属性 -->
            <div v-if="ruleForm.proType=='属性'" style="margin-bottom: 15px;">
              <el-form-item
                required
                class="funtype"
                label="数据类型"
                label-height="60px"
              >{{ruleForm.dataTypeName}}</el-form-item>
              <!-- 整数型 -->
              <div v-if="ruleForm.dataTypeName=='整数型'">
                <el-form-item class="formItem" label="取值范围" prop="minmaxindex">
                  <el-popover
                    placement="top"
                    width="300"
                    trigger="hover"
                    content="最大值必须大于最小值，支持整数，取值范围：-2147483648 ~ 2147483647"
                  >
                    <i
                      class="el-icon-warning"
                      style="color:#D8D8D8;position: absolute;left: -19px;top: 13px;"
                      slot="reference"
                    ></i>
                  </el-popover>
                  <el-col :span="10">
                    <el-input
                      v-model="ruleForm.scheme.min"
                      size="mini"
                      maxlength="11"
                      placeholder="最小值"
                    ></el-input>
                  </el-col>
                  
                  <el-col class="line" :span="1">-</el-col>
                  <el-col :span="10">
                    <el-input
                      v-model="ruleForm.scheme.max"
                      size="mini"
                      maxlength="11"
                      placeholder="最大值"
                    ></el-input>
                  </el-col>
                </el-form-item>
                <el-form-item label="步长" prop="steplengthindex">
                  <el-input
                    size="mini"
                    class="stepleng"
                    v-model="ruleForm.scheme.step"
                    maxlength="10"
                    placeholder="支持正整数，步长不能大于取值范围的差值"
                  ></el-input>
                </el-form-item>
                <el-form-item label="单位" required>
                  <el-select
                    @change="unitChange"
                    size="mini"
                    class="commenselect"
                    v-model="ruleForm.scheme.unit"
                    placeholder="请选择单位"
                  >
                    <el-option
                      v-for="item in unitList"
                      :key="item.value"
                      :label="item.value"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label prop="UnitNameindex" v-if="ruleForm.scheme.unit == '自定义'">
                  <el-input
                    size="mini"
                    class="stepleng"
                    v-model.trim="ruleForm.scheme.unitName"
                    placeholder="1-30个字符"
                  ></el-input>
                </el-form-item>
              </div>
              <!-- 浮点型 -->
              <div v-if="ruleForm.dataTypeName=='浮点型'">
                <el-form-item label="取值范围" prop="minmaxindex">
                  <el-popover
                    placement="top"
                    width="300"
                    trigger="hover"
                    content="最大值必须大于最小值，支持小数点后五位，整数支持10位"
                  >
                    <i
                      class="el-icon-warning"
                      style="color:#D8D8D8;position: absolute;left: -18px;top: 13px;"
                      slot="reference"
                    ></i>
                  </el-popover>
                  <el-col :span="10">
                    <el-input
                      class="minmax"
                      v-model="ruleForm.scheme.min"
                      maxlength="17"
                      size="mini"
                      placeholder="最小值"
                    ></el-input>
                  </el-col>
                  <el-col class="line" :span="1">-</el-col>
                  <el-col :span="10">
                    <el-input
                      class="minmax"
                      v-model="ruleForm.scheme.max"
                      maxlength="17"
                      size="mini"
                      placeholder="最大值"
                    ></el-input>
                  </el-col>
                </el-form-item>
                <el-form-item label="步长" prop="steplengthindex">
                  <el-input
                    size="mini"
                    class="stepleng"
                    v-model="ruleForm.scheme.step"
                    maxlength="16"
                    placeholder="支持正数，小数点后五位，整数位支持10位，步长不能大于取值范围的差值"
                  ></el-input>
                </el-form-item>

                <el-form-item label="单位" required>
                  <el-select
                    size="mini"
                    @change="unitChange"
                    class="commenselect"
                    v-model.trim="ruleForm.scheme.unit"
                    placeholder="请选择单位"
                  >
                    <el-option
                      v-for="item in unitList"
                      :key="item.value"
                      :label="item.value"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label prop="UnitNameindex" v-if="ruleForm.scheme.unit == '自定义'">
                  <el-input
                    size="mini"
                    class="stepleng"
                    v-model.trim="ruleForm.scheme.unitName"
                    placeholder="1-30个字符"
                  ></el-input>
                </el-form-item>
              </div>
              <!-- 枚举型 -->
              <div v-if="ruleForm.dataTypeName=='枚举型'" class="meiju" id="meiju">
                <el-form-item label="枚举项" required >
                  <i class="meijulable">参数值</i>
                  <i class="meijulable">参数描述</i>
                </el-form-item>
                <template v-for="(v,i) in ruleForm.scheme.enumList">
                  <el-form-item label class="formItemmeiju" :key="i" style="margin-bottom: 0!important;">
                    <el-form-item label>
                      <span style="display:flex;" :key="i">
                        <el-form-item
                          class="meiJuDiv"
                          style="margin-left:-28px"
                          :prop="'scheme.enumList.' + i + '.value'"
                          :rules="[{required: true, validator: validateEnumListValue, trigger: 'blur'}]"
                        >
                          <el-input size="mini" class="meiinp" v-model="v['value']" placeholder="1-30个字符" @keyup.native="listenBooleanChange(0)"></el-input>
                          <span class="error" v-if="v.isValueError">{{v.valueError}}</span>
                        </el-form-item>
                        <i class="meijuline">-</i>
                        <el-form-item
                          class="meiJuDiv"
                          :prop="'scheme.enumList.' + i + '.name'"
                          :rules="[{required: true, validator: validateEnumListName, trigger: 'blur'}]"
                        >
                          <el-input size="mini" class="meiinp" v-model="v['name']" placeholder="1-20个字符" @keyup.native="listenBooleanChange(0)"></el-input>
                          <span class="error" v-if="v.isNameError">{{v.nameError}}</span>
                        </el-form-item>
                        <el-popover placement="top" class="deleteR" v-model="v['meijuindexdelete']">
                          <p style="text-align:center;">是否确认删除该枚举项？</p>
                          <div style="text-align: right; margin: 0;margin-top:10px;">
                            <el-button
                              @click="deledianjiindex(v,i,false)"
                              size="mini"
                              type="text"
                            >取消</el-button>
                            <el-button
                              @click="deledianjiindex(v,i,true)"
                              type="primary"
                              size="mini"
                            >确定</el-button>
                          </div>
                          <i slot="reference" class="el-icon-circle-close"></i>
                        </el-popover>
                      </span>
                    </el-form-item>
                  </el-form-item>
                </template>
                <el-form-item label>
                  <el-button
                    @click="plusEnumindex"
                    type="primary"
                    icon="el-icon-plus"
                    size="mini"
                  >添加枚举项</el-button>
                </el-form-item>
              </div>
              <!-- 布尔型 -->
              <div v-if="ruleForm.dataTypeName=='布尔型'">
                <el-form-item class="blooinput" label="布尔值" prop="bloo">
                  <span>false-</span>
                  <el-input
                    size="mini"
                    class="minmax"
                    v-model="ruleForm.scheme.negative"
                    placeholder="必须以汉字、字母、数字开头"
                  ></el-input>
                  <span style="padding-left:15px">true-</span>
                  <el-input
                    size="mini"
                    class="minmax"
                    v-model="ruleForm.scheme.positive"
                    placeholder="必须以汉字、字母、数字开头"
                  ></el-input>
                </el-form-item>
              </div>
              <!-- 字符串 -->
              <div v-if="ruleForm.dataTypeName=='字符串'">
                <el-form-item label="数据长度" prop="datasteplength">
                  <el-input
                    size="mini"
                    class="stepleng stringLength"
                    v-model="ruleForm.scheme.maxLength"
                    placeholder="支持最小值为1，最大值为2048，整数型不能有小数位"
                  ></el-input>
                  <span
                  	style="position:absolute;right:35px;top:0;font-size: 12px;font-weight: 400;color: rgba(50,50,50,1);"
                  >字节</span>
                </el-form-item>
              </div>
              <!-- 数组 -->
              <div v-if="ruleForm.dataTypeName=='数组'">
                <el-form-item label="元素类型" prop="resource">
                  <el-radio-group size="mini" v-model="ruleForm.scheme.arrayDataType">
                    <template v-for="(item, index) in selectArrayDataArr">
                      <el-radio :label="item.value" :key="index">{{item.name}}</el-radio>
                    </template>
                  </el-radio-group>
                </el-form-item>
              </div>
            </div>
            <!-- 能力 -->
            <div v-if="ruleForm.proType=='能力'">
              <el-form-item class="eventParameter" label="参数" label-height="60px">
                <p
                  class="parameters"
                  v-if="Array.isArray(this.ruleForm.parameters)"
                  v-show="this.ruleForm.parameters.length>0"
                  style="font-size:12px"
                >
                  <span
                    style="display:inline-block;width:430px;margin-bottom:5px"
                    v-for="(vFun,iFun) in ruleForm.parameters"
                    :key="iFun"
                  >
                    <span>参数名称：{{vFun.parameterName}}</span>
                    <span style="margin-left:24px;margin-right: 20px;">标识符：{{vFun.key}}</span>
                    <span style="float:right">
                      <span style="cursor:pointer;margin-right:15px;">
                        <i
                          style="color:#af7c58"
                          class="el-icon-edit"
                          @click="editName(ruleForm.parameters,iFun,vFun)"
                        ></i>
                      </span>
                      <el-popover
                        placement="top"
                        class="deleteR"
                        v-model="vFun['meijuindexdelete']"
                      >
                        <p style="text-align:center;">是否确认删除该参数？</p>
                        <div style="text-align: right; margin: 0;margin-top:10px;">
                          <el-button
                            @click="deleteModel(vFun,iFun,false)"
                            size="mini"
                            type="text"
                          >取消</el-button>
                          <el-button
                            @click="deleteModel(vFun,iFun,true)"
                            type="primary"
                            size="mini"
                          >确定</el-button>
                        </div>
                        <i slot="reference" style="color:#af7c58" class="el-icon-delete"></i>
                      </el-popover>
                    </span>
                  </span>
                </p>
                <el-button
                  type="primary"
                  style="border:none;font-size:12px"
                  icon="el-icon-plus"
                  @click="plusCanShu"
                >增加参数</el-button>
              </el-form-item>
              <el-form-item class="describ messTemp" label="消息格式" label-height="60px" prop="eventMsgMattern">
                <el-popover
                  placement="top"
                  width="300"
                  trigger="hover"
                  content='增加的参数将添加到contents中，如标识符为rt，数据类型为常量 ["oic.r.switch.binary"]，添加后显示contents{"rt" : [ "oic.r.switch.binary" ], }]'
                >
                  <i
                    class="el-icon-warning"
                    style="color:#D8D8D8;position: absolute;left: -16px;top: 4px;font-size:12px"
                    slot="reference"
                  ></i>
                </el-popover>
                <el-input
                  :disabled="true"
                  :placeholder="describs"
                  type="textarea"
                  v-model="messageTemplate"
                ></el-input>
              </el-form-item>
              <p class="text-area-tip">如果参数为常量，可在该参数后添加，如："msgType" : "notify"</p>
            </div>
            <!-- 事件 -->
            <div v-if="ruleForm.proType=='事件'" style="margin-bottom: 15px;">
              <el-form-item class="formItemInput" label="事件类型" required>
                <el-popover
                  class="iconSpan"
                  placement="top"
                  width="300"
                  trigger="hover">
                  <i class="el-icon-warning" slot="reference" style="color: #D8D8D8;cursor: pointer;"></i>
                  <div>
                      信息：此类事件仅推送消息至物联云平台。 <br/>
                      故障：发生故障的设备状态更新为异常，重置设备状态后将设备设置为正常。<br/>
                      告警：产生告警的设备标记为异常设备，手动处理后该告警失效，重新获取设备状态。<br/>
                  </div>
                </el-popover>
                <el-radio-group size="mini" v-model="ruleForm.eventType">
                  <template v-for="(item, index) in eventTypeArr">
                    <el-radio :label="item.code" :key="index">{{item.name}}</el-radio>
                  </template>
                </el-radio-group>
              </el-form-item>
              <el-form-item size="mini" label="推送至" required>
                <el-radio-group v-model="ruleForm.deliveryType">
                  <template v-for="(item, index) in deliverTypeArr">
                    <el-radio :label="item.code" :key="index">{{item.name}}</el-radio>
                  </template>
                </el-radio-group>
              </el-form-item>
              <el-form-item
                label
                prop="deliveryAddressConst"
                :show-message="ruleForm.deliveryType == '3'"
              >
                <el-input
                  size="mini"
                  v-if="ruleForm.deliveryType=='3'"
                  class="stepleng"
                  v-model="ruleForm.deliveryAddress"
                  placeholder="请填写URL地址"
                ></el-input>
              </el-form-item>
            </div>
            <el-form-item class="describ" label="描述" label-height="60px">
              <el-input
                size="mini"
                style="margin-bottom: 20px;"
                placeholder="0-100个字符"
                type="textarea"
                v-model.trim="ruleForm.description"
                maxlength="100"
                resize="none"
                :autosize="{ minRows: 6, maxRows: 10}"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
      </el-scrollbar>
      <!-- 新增参数 -->
      <el-dialog
        class="innerplus"
        width="568px"
        top="21vh"
        :title="plusCanShudata"
        :visible.sync="innerVisible"
        append-to-body
        :before-close="parametersCancel"
      >
        <div class="outerS">
          <el-form label-width="75px" :model="plustype" :rules="rules" ref="plustype">
            <el-scrollbar ref="innerScro">
              <el-form-item label="参数名称" prop="parameterName">
                <el-input
                  size="mini"
                  class="commeninput"
                  v-model="plustype.parameterName"
                  placeholder="支持汉字、字母、数字、-和_，必须以汉字、字母或数字开头"
                ></el-input>
              </el-form-item>
              <el-form-item label="标识符" prop="key">
                <el-input
                  size="mini"
                  class="commeninput"
                  v-model="plustype.key"
                  placeholder="支持字母、数字和_、必须以字母开头"
                ></el-input>
              </el-form-item>
              <el-form-item label="数据类型" prop="dataType">
                <el-select
                  size="mini"
                  @change="datatypechange"
                  class="commenselect"
                  v-model="plustype.dataType"
                  placeholder="请选择数据类型"
                >
                  <el-option
                    v-for="(v,i) in dataTypePlus"
                    :key="i"
                    :label="v.type"
                    :value="v.typeId"
                  ></el-option>
                </el-select>
              </el-form-item>
              <!-- 整数型 -->
              <!-- <p>整数型</p> -->
              <div v-if="plustype.dataType=='1'" style="padding-bottom: 5px;">
                <el-form-item label="取值范围" prop="minmax">
                  <el-input
                    size="mini"
                    class="minmax"
                    v-model="plustype.scheme.min"
                    maxlength="11"
                    placeholder="最小值"
                  ></el-input>
                  <i class="line">-</i>
                  <el-input
                    size="mini"
                    class="minmax"
                    v-model="plustype.scheme.max"
                    maxlength="11"
                    placeholder="最大值"
                  ></el-input>
                  <el-popover
                    placement="top"
                    width="300"
                    trigger="hover"
                    content="最大值必须大于最小值，支持整数，取值范围：-2147483648 ~ 2147483647"
                  >
                    <i
                      class="el-icon-warning"
                      style="color:#D8D8D8;position: absolute;left: -16px;bottom: 13px;"
                      slot="reference"
                    ></i>
                  </el-popover>
                </el-form-item>
                <el-form-item label="步长" prop="step">
                  <el-input
                    size="mini"
                    class="stepleng"
                    v-model="plustype.scheme.step"
                    maxlength="10"
                    placeholder="支持正整数，步长不能大于取值范围的差值"
                  ></el-input>
                </el-form-item>
                <el-form-item label="单位" required>
                  <el-select
                    size="mini"
                    @change="unitChange"
                    class="commenselect"
                    v-model="plustype.scheme.unit"
                    placeholder="请选择单位"
                  >
                    <el-option
                      v-for="item in unitList"
                      :key="item.value"
                      :label="item.value"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label prop="unitNamesecond" v-if="plustype.scheme.unit == '自定义'">
                  <el-input
                    size="mini"
                    class="stepleng"
                    v-model="plustype.scheme.unitName"
                    placeholder="1-30个字符"
                  ></el-input>
                </el-form-item>
              </div>
              <!-- 浮点型 -->
              <div v-if="plustype.dataType=='6'" style="padding-bottom: 5px;">
                <el-form-item label="取值范围" prop="minmax">
                  <el-input
                    size="mini"
                    class="minmax"
                    v-model="plustype.scheme.min"
                    maxlength="17"
                    placeholder="最小值"
                  ></el-input>
                  <i class="line">-</i>
                  <el-input
                    size="mini"
                    class="minmax"
                    v-model="plustype.scheme.max"
                    maxlength="17"
                    placeholder="最大值"
                  ></el-input>
                  <el-popover
                    placement="top"
                    width="300"
                    trigger="hover"
                    content="最大值必须大于最小值，支持小数点后五位，整数支持10位"
                  >
                    <i
                      class="el-icon-warning"
                      style="color:#D8D8D8;    position: absolute;left: -16px;bottom: 13px;"
                      slot="reference"
                    ></i>
                  </el-popover>
                </el-form-item>
                <el-form-item label="步长" prop="step">
                  <el-input
                    size="mini"
                    class="stepleng"
                    v-model="plustype.scheme.step"
                    maxlength="16"
                    placeholder="支持正数，小数点后五位，整数位支持10位，步长不能大于取值范围的差值"
                  ></el-input>
                </el-form-item>
                <el-form-item label="单位" required>
                  <el-select
                    size="mini"
                    @change="unitChange"
                    class="commenselect"
                    v-model="plustype.scheme.unit"
                    placeholder="请选择单位"
                  >
                    <el-option
                      v-for="item in unitList"
                      :key="item.value"
                      :label="item.value"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label prop="unitNamesecond" v-if="plustype.scheme.unit == '自定义'">
                  <el-input
                    size="mini"
                    class="stepleng"
                    v-model="plustype.scheme.unitName"
                    placeholder="1-30个字符"
                  ></el-input>
                </el-form-item>
              </div>
              <!-- 枚举型 -->
              <el-form-item
                label="枚举项"
                prop="eventUrl"
                v-if="plustype.dataType=='2'"
                style="padding-bottom: 5px; width: 430px;"
              >
                <i class="meijulable">参数值</i>
                <i class="meijulable" style="margin-left:18px">参数描述</i>
                <el-form-item
                  style="display:flex"
                  class="meijuBotom"
                  v-for="(v,i) in plustype.scheme['enumList']"
                  :key="i"
                >
                  <el-form-item
                    class="meiJuDiv"
                    :prop="'scheme.enumList.' + i + '.value'"
                    :rules="[{required: true, validator: validateEnumListValue, trigger: 'blur'}]"
                  >
                    <el-input
                      size="mini"
                      class="meiinp"
                      v-model="v['value']"
                      placeholder="1-30个字符"
                      @keyup.native="listenBooleanChange(1)"
                    ></el-input>
                    <span class="error" v-if="v.isValueError">{{v.valueError}}</span>
                  </el-form-item>
                  <i class="meijuline">-</i>
                  <el-form-item
                    class="meiJuDiv"
                    :prop="'scheme.enumList.' + i + '.name'"
                    :rules="[{required: true, validator: validateEnumListName, trigger: 'blur'}]"
                  >
                    <el-input
                      class="meiinp"
                      size="mini"
                      v-model="v['name']"
                      placeholder="1-20个字符"
                      @keyup.native="listenBooleanChange(1)"
                    ></el-input>
                    <span class="error" v-if="v.isNameError">{{v.nameError}}</span>
                  </el-form-item>
                  <el-popover placement="top" class="deleteR" v-model="v['plusMeijuVisible']">
                    <p style="text-align:center;">是否确认删除该枚举项？</p>
                    <div style="text-align: right; margin: 0;margin-top:10px;">
                      <el-button @click="deledianji(v,i,false)" size="mini" type="text">取消</el-button>
                      <el-button @click="deledianji(v,i,true)" type="primary" size="mini">确定</el-button>
                    </div>
                    <i slot="reference" class="el-icon-circle-close"></i>
                  </el-popover>
                </el-form-item>
                <div class="addDevice">
                  <el-button @click="plusEnum" type="primary" icon="el-icon-plus" size="mini">添加枚举项</el-button>
                </div>
              </el-form-item>
              <!-- 布尔型 -->
              <el-form-item
                class="blooinput"
                label="布尔值"
                prop="blooPlus"
                v-if="plustype.dataType=='3'"
                style="padding-bottom: 5px;"
              >
                <span>false-</span>
                <el-input
                  size="mini"
                  class="minmax"
                  v-model="plustype.scheme.negative"
                  placeholder="必须以汉字、字母、数字开头"
                ></el-input>
                <span>true-</span>
                <el-input
                  size="mini"
                  class="minmax"
                  v-model="plustype.scheme.positive"
                  placeholder="必须以汉字、字母、数字开头"
                ></el-input>
              </el-form-item>
              <!-- 字符串 -->
              <el-form-item
                class="stringS"
                label="数据长度"
                prop="strsteplength"
                v-if="plustype.dataType=='4'"
                style="padding-bottom: 5px;"
              >
                <el-input
                  size="mini"
                  class="stepleng stringLength"
                  v-model="plustype.scheme.maxLength"
                  placeholder="支持最小值为1，最大值为2048，整数型不能有小数位"
                ></el-input>
                <span
                  style="position:absolute;right:35px;top:0;font-size: 12px;font-weight: 400;color: rgba(50,50,50,1);"
                >字节</span>
              </el-form-item>
              <!-- 数组 -->
              <el-form-item
                label="元素类型"
                prop="arrayDataType"
                v-if="plustype.dataType=='5'"
                style="padding-bottom: 5px;"
              >
                <el-radio-group size="mini" v-model="plustype.scheme.arrayDataType">
                  <template v-for="(item, index) in selectArrayDataArr">
                    <el-radio :label="item.value" :key="index">{{item.name}}</el-radio>
                  </template>
                </el-radio-group>
              </el-form-item>
              <!-- 常量 -->
              <el-form-item
                class="constantP"
                label="值"
                prop="constantData"
                v-if="plustype.dataType=='7'"
                style="padding-bottom: 5px;"
              >
                <el-input size="mini" class="stepleng" v-model="plustype.scheme.constant"></el-input>
                <p
                  class="text-area-tip-chang"
                >字符串类型的常量前后使用"",数组类型需要使用[],例:"notify",["oic.r.light.dimming"]</p>
              </el-form-item>
            </el-scrollbar>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="parametersCancel('plustype')">取 消</el-button>
          <el-button :disabled="!paramsCanClick" type="primary" @click="parametersPlus('plustype')">确定</el-button>
        </div>
      </el-dialog>

      <span slot="footer" class="dialog-footer">
        <el-button @click="mdeditout('ruleForm')">取消</el-button>
        <el-button type="primary" :disabled="!funCanClick" @click="mdeditright('ruleForm')">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  updateModelAbility, // 修改功能--型号能力
  updateModelEvent, // 修改功能--事件事件
  updateModelProperty, // 修改功能--属性属性
  selectDataTypeList,  // 获取数据类型下拉列表
  updateTypeProperty, // 修改功能--属性属性
  updateTypeEvent, // 修改功能--事件事件
  updateTypeAbility, // 修改功能--型号能力 
  getDeliveryType, // 获取所有事件推送至类型
  getEventType, // 获取所有事件类型
  selectArrayDataType // 获取所有数据类型
} from "../../api/api.js";
import { getDate } from "../../labs/tools.js";
import Qs from "qs";
import ossUpload from "../../labs/upload.js";
export default {
  name: "modelDetailEdit",
  data() {
    var checkmax = (rule, value, callback) => {//新增参数时整数浮点取值范围表单验证
      let dataType, min, max;
      dataType = this.plustype.dataType;
      min = this.plustype.scheme.min;
      max = this.plustype.scheme.max;
      if(dataType == 1){
        const reg = /^-?\d+$/;
        if(reg.test(min) && !isNaN(min)){
          min = Number(min);
          if(min >= -2147483648 && min <= 2147483647 && Number.isInteger(min)){
            if(reg.test(max) && !isNaN(max)){
                max = Number(max);
                if( max >= -2147483648 && max <= 2147483647 && Number.isInteger(max)){
                    if(max - min <= 0){
                        return callback(new Error('最大值必须大于最小值，支持整数，取值范围：-2147483648 - 2147483647'));
                    }else{
                        callback();
                    }
                }else{
                    return callback(new Error('最大值必须大于最小值，支持整数，取值范围：-2147483648 - 2147483647'));
                }
            }else{
                return callback(new Error('最大值必须大于最小值，支持整数，取值范围：-2147483648 - 2147483647'));
            }
          }else{
            return callback(new Error('最大值必须大于最小值，支持整数，取值范围：-2147483648 - 2147483647'));
          }
        }else{
            return callback(new Error('最大值必须大于最小值，支持整数，取值范围：-2147483648 - 2147483647'));   
        }
      }else{
        const reg = /^(([-]?[0-9][0-9]{0,9})|(([-]?[0]\.\d{1,5}|[-]?[1-9][0-9]{0,9}\.\d{1,5})))$/ ;
        if(reg.test(min) && !isNaN(min)){      
            min = Number(min);
            if(reg.test(max) && !isNaN(max)){
                max = Number(max);
                if(max - min <= 0){
                    return callback(new Error('最大值必须大于最小值，支持小数点后五位，整数支持10位'));
                }else{
                    callback();
                }
            }else{
                return callback(new Error('最大值必须大于最小值，支持小数点后五位，整数支持10位')); 
            }
        }else{
          return callback(new Error('最大值必须大于最小值，支持小数点后五位，整数支持10位'));
        }
      }
    };
    var checkmaxindex = (rule, value, callback) => {//整数浮点取值范围表单验证
      let dataType, min, max;
      dataType = this.ruleForm.dataType;
      min = this.ruleForm.scheme.min;
      max = this.ruleForm.scheme.max;
      if(dataType == 1){
        const reg = /^-?\d+$/;
        if(reg.test(min) && !isNaN(min)){
          min = Number(min);
          if(min >= -2147483648 && min <= 2147483647 && Number.isInteger(min)){
            if(reg.test(max) && !isNaN(max)){
                max = Number(max);
                if( max >= -2147483648 && max <= 2147483647 && Number.isInteger(max)){
                    if(max - min <= 0){
                        return callback(new Error('最大值必须大于最小值，支持整数，取值范围：-2147483648 - 2147483647'));
                    }else{
                        callback();
                    }
                }else{
                    return callback(new Error('最大值必须大于最小值，支持整数，取值范围：-2147483648 - 2147483647'));
                }
            }else{
                return callback(new Error('最大值必须大于最小值，支持整数，取值范围：-2147483648 - 2147483647'));
            }
          }else{
            return callback(new Error('最大值必须大于最小值，支持整数，取值范围：-2147483648 - 2147483647'));
          }
        }else{
            return callback(new Error('最大值必须大于最小值，支持整数，取值范围：-2147483648 - 2147483647'));   
        }
      }else{
        const reg = /^(([-]?[0-9][0-9]{0,9})|(([-]?[0]\.\d{1,5}|[-]?[1-9][0-9]{0,9}\.\d{1,5})))$/ ;
        if(reg.test(min) && !isNaN(min)){      
            min = Number(min);
            if(reg.test(max) && !isNaN(max)){
                max = Number(max);
                if(max - min <= 0){
                    return callback(new Error('最大值必须大于最小值，支持小数点后五位，整数支持10位'));
                }else{
                    callback();
                }
            }else{
                return callback(new Error('最大值必须大于最小值，支持小数点后五位，整数支持10位')); 
            }
        }else{
          return callback(new Error('最大值必须大于最小值，支持小数点后五位，整数支持10位'));
        }
      }
    };
    var stepL = (rule, value, callback) => {//字符串数据长度表单验证
      let maxLength;
      maxLength = this.ruleForm.scheme.maxLength;
      const reg = /^-?[1-9]\d*$/;
      if (
        maxLength &&
        reg.test(maxLength) &&
        !isNaN(maxLength) &&
        maxLength >= 1 &&
        maxLength <= 2048
      ) {
        callback();
      } else {
        return callback(
          new Error("支持最小值为1，最大值为2048，整数型不能有小数位")
        );
      }
    };
    var strstepLplus = (rule, value, callback) => {//新增参数时字符串数据长度表单验证
      let maxLength;
      maxLength = this.plustype.scheme.maxLength;
      const reg = /^-?[1-9]\d*$/;
      if (
        maxLength &&
        reg.test(maxLength) &&
        !isNaN(maxLength) &&
        maxLength >= 1 &&
        maxLength <= 2048
      ) {
        callback();
      } else {
        return callback(
          new Error("支持最小值为1，最大值为2048，整数型不能有小数位")
        );
      }
    };
    var stepLplus = (rule, value, callback) => {//新增时步长验证
      let dataType, min, max, step;
      dataType = this.plustype.dataType;
      min = this.plustype.scheme.min;
      max = this.plustype.scheme.max;
      step = this.plustype.scheme.step;
      if (dataType == 1) {
        const reg = /^-?\d+$/;
        if (!isNaN(step) && reg.test(step) && step > 0 && step <= 2147483647) {
          if (max - min < step) {
            return callback(
              new Error("支持正整数，步长不能大于取值范围的差值")
            );
          } else {
            callback();
          }
        } else {
          return callback(new Error("支持正整数，步长不能大于取值范围的差值"));
        }
      } else {
        const reg = /^(([1-9][0-9]{0,9})|(([0]\.\d{1,5}|[1-9][0-9]{0,9}\.\d{1,5})))$/;
        if (reg.test(step) && !isNaN(step) && step > 0) {
          if (max - min < step) {
            return callback(
              new Error(
                "支持正数，小数点后五位，整数位支持10位，步长不能大于取值范围的差值"
              )
            );
          } else {
            callback();
          }
        } else {
          return callback(
            new Error(
              "支持正数，小数点后五位，整数位支持10位，步长不能大于取值范围的差值"
            )
          );
        }
      }
    };
    var stepLplusindex = (rule, value, callback) => {//步长验证
      let dataType, min, max, step;
      dataType = this.ruleForm.dataType;
      min = this.ruleForm.scheme.min;
      max = this.ruleForm.scheme.max;
      step = this.ruleForm.scheme.step;
      if (dataType == 1) {
        const reg = /^-?\d+$/;
        if (!isNaN(step) && reg.test(step) && step > 0 && step <= 2147483647) {
          if (max - min < step) {
            return callback(
              new Error("支持正整数，步长不能大于取值范围的差值")
            );
          } else {
            callback();
          }
        } else {
          return callback(new Error("支持正整数，步长不能大于取值范围的差值"));
        }
      } else {
        const reg = /^(([1-9][0-9]{0,9})|(([0]\.\d{1,5}|[1-9][0-9]{0,9}\.\d{1,5})))$/;
        if (reg.test(step) && !isNaN(step) && step > 0) {
          if (max - min < step) {
            return callback(
              new Error(
                "支持正数，小数点后五位，整数位支持10位，步长不能大于取值范围的差值"
              )
            );
          } else {
            callback();
          }
        } else {
          return callback(
            new Error(
              "支持正数，小数点后五位，整数位支持10位，步长不能大于取值范围的差值"
            )
          );
        }
      }
    };
    var bloocheck = (rule, value, callback) => {//布尔值验证
      let negative, positive;
      negative = this.ruleForm.scheme.negative;
      positive = this.ruleForm.scheme.positive;
      const reg = /^[a-zA-Z0-9\u4e00-\u9fa5].{0,9}$/;
      if (negative && reg.test(negative) && positive && reg.test(positive)) {
        if (negative === positive) {
          return callback(new Error("布尔值不能相同"));
        } else {
          callback();
        }
      } else {
        return callback(new Error("1-10个字符(必须以汉字、字母、数字开头)"));
      }
    };
    var bloocheckPlus = (rule, value, callback) => {//新增时布尔值验证
      let negative, positive;
      negative = this.plustype.scheme.negative;
      positive = this.plustype.scheme.positive;
      const reg = /^[a-zA-Z0-9\u4e00-\u9fa5].{0,9}$/;
      if (negative && reg.test(negative) && positive && reg.test(positive)) {
        if (negative === positive) {
          return callback(new Error("布尔值不能相同"));
        } else {
          callback();
        }
      } else {
        return callback(new Error("1-10个字符(必须以汉字、字母、数字开头)"));
      }
    };
    var arrayDataNames = (rule, value, callback) => {//新增时数组元素类型验证
      if (this.plustype["scheme"].arrayDataType) {
        callback();
      } else {
        callback(new Error("请选择数据类型"));
      }
    };
    var constantDatas = (rule, value, callback) => {//新增时常量验证
      if (this.plustype["scheme"].constant) {
        callback();
      } else {
        callback(new Error("请填写常量值"));
      }
    };
    var resources = (rule, value, callback) => {//数组元素类型验证
      if (this.ruleForm["scheme"].arrayDataType) {
        callback();
      } else {
        callback(new Error("请选择数据类型"));
      }
    };
    var eventUrls = (rule, value, callback) => {//新增时枚举项表单验证
      callback();
    };
    var validateAddress = (rule, value, callback) => {//推送URL地址
      const reg = /(https):\/\/([\w.]+\/?)\S*/;
      let deliveryType = this.ruleForm.deliveryType;
      let deliveryAddress = this.ruleForm.deliveryAddress;
      if (deliveryType == 3) {
        if (reg.test(deliveryAddress)) {
          callback();
        } else {
          return callback(new Error("请填写正确的URL地址"));
        }
      } else {
        callback();
      }
    };
    var unitNameindex = (rule, value, callback) => {//自定义单位验证
      const reg = /^.{1,30}$/;
      let deliveryType = this.ruleForm.scheme.unitName;
      if (reg.test(deliveryType) && deliveryType != undefined) {
        callback();
      } else {
        return callback(new Error("1-30个字符"));
      }
    };
    var Funitnamesecond = (rule, value, callback) => {//新增时自定义单位验证
      const reg = /^.{1,30}$/;
      let deliveryType = this.plustype.scheme.unitName;
      if (reg.test(deliveryType) && deliveryType != undefined) {
        callback();
      } else {
        return callback(new Error("1-30个字符"));
      }
    };
    return {
    	funCanClick: true,
    	paramsCanClick: true,
    	newRuleForm: {},	//新的功能表单值
    	newAddParamsForm: {}, 	//新的编辑参数表单值
      messageTemplate1: '如果标识符在该类设备上报的消息中唯一，无需启用筛选条件。 启用筛选条件后，平台将根据筛选条件确定标识符在消息中的位置。筛选条件格式为："[条件标识符]"：[条件]，。可添加多个条件，如："objId": 1, "name" : "CO",',
      opyan:false,
      describs:{ "cts" : "", "msgType" : "notify", "postman" :"", "from" :"", "to" : "", "ntfTp" : 1, "trigger" : { "objId":"" , "name" :"", }, "contents" :  { }  },
      plusCanShudata: "",//弹框title
      messageTemplate: { "cts" : "" , "msgType" : "notify" , "postman" : "", "from" : "", "to" : "", "ntfTp" : 1, "trigger" : { "objId": "", "name" : "", }, "contents" :[ { } ] },
      templateMsgBody:  { "cts" : "" , "msgType" : "notify" , "postman" : "", "from" : "", "to" : "", "ntfTp" : 1, "trigger" : { "objId": "", "name" : "", }, "contents" :[ { } ] },
      abilityParameterBody: {},
      plusMeijuVisible: false,//枚举删除弹框显示
      divisions: "", //区分型号类型
      dataTypePlus: [], //查询数据类型
      funListEventType: "信息",
      funListEventMovement: "运营平台",
      mdeditopen: false,//编辑弹框显示
      innerVisible: false,//新增弹框显示
      ruleForm: {//编辑时data
        proType: "",
        proName: "",
        min: "",
        max: "",
        steplength: "",
        type: [],
        timeunit: "",
        description: "",
        plustype: [],
        scheme: {
          enumList: [],
          unit:""
        },
        parameters: [],
        openFilter:false
      },
      meijuarr: [{ meijuval: "1", meijuname: "2" }],
      plustype: {//新增时data
        parameterName: "",
        meijuarr: [{ meijuname: "1", meijuval: "2" }],
        min: "",
        max: "",
        steplength: "",
        content: "",
        resource: "",
        scheme: {}
      },
      rules: {
        eventUrl: [{ required: true, validator: eventUrls }],//新增时枚举项表单验证
        openFilter:[{ pattern: /.{1,1000}$/,
            required: true,
            message:
              "1-1000个字符", trigger: "blur" }],
        proName: [
          {
            required: true,
            pattern: /^[A-Za-z0-9\u4e00-\u9fa5][A-Za-z0-9\u4e00-\u9fa5\-\_]{0,49}$/,
            message:
              "1-50个字符(支持汉字、字母、数字、-和_，必须以汉字、字母或数字开头)",
            trigger: "blur"
          }
        ],
        bloo: [{ required: true, validator: bloocheck }],//布尔值验证
        blooPlus: [{ required: true, validator: bloocheckPlus }],//新增时布尔值验证
        minmax: [{ required: true, validator: checkmax, trigger: "blur" }],//新增参数时整数浮点取值范围表单验证
        minmaxindex: [//整数浮点取值范围表单验证
          { required: true, validator: checkmaxindex, trigger: "blur" }
        ],
        datasteplength: [{ required: true, validator: stepL, trigger: "blur" }],//字符串数据长度表单验证
        step: [//新增时步长验证
          { required: true, validator: stepLplus, trigger: "blur" }
        ],
        steplengthindex: [//步长验证
          { required: true, validator: stepLplusindex, trigger: "blur" }
        ],
        strsteplength: [//新增参数时字符串数据长度表单验证
          { required: true, validator: strstepLplus, trigger: "blur" }
        ],
        parameterName: [//新增时参数名称验证
          {
            pattern: /^[a-zA-Z0-9\u4e00-\u9fa5][a-zA-Z0-9\u4e00-\u9fa5\-\_]{0,49}$/,
            required: true,
            message:
              "1-50个字符(支持汉字、字母、数字、-和_，必须以汉字、字母或数字开头)",
            trigger: "blur"
          }
        ],
        key: [//新增时标识符验证
          {
            pattern: /^[a-zA-Z][a-zA-Z0-9\_]{0,49}$/,
            required: true,
            message: "1-50个字符(支持字母、数字和_、必须以字母开头)",
            trigger: "blur"
          }
        ],
        dataType: [//新增时数据类型验证
          { required: true,message:"请选择数据类型" }
        ],
        resource: [{ required: true, validator: resources, trigger: "change" }],//数组元素类型验证
        arrayDataType: [//新增时数组元素类型验证
          { required: true, validator: arrayDataNames, trigger: "change" }
        ],
        eventMsgMattern: [//消息格式验证
          {
            message:
              '如果参数为常量，可在该参数后添加，如："msgType" : "notify"',
            trigger: "blur"
          }
        ],
        deliveryAddressConst: [//推送URL地址
          { required: true, validator: validateAddress, trigger: "blur" }
        ],
        constantData: [//新增时常量验证
          { required: true, validator: constantDatas, trigger: "blur" }
        ],
        UnitNameindex: [//自定义单位验证
          { required: true, validator: unitNameindex, trigger: "blur" }
        ],
        unitNamesecond: [//新增时自定义单位验证
          { required: true, validator: Funitnamesecond, trigger: "blur" }
        ]
      },
      meijuarrNew: null,
      unitCustom: false, //新增单位自定义input
      plustypeNew: null,
      canShuBianJi: false,
      test: [],
      deliverTypeArr: [], // 推送类型
      eventTypeArr: [], // 事件类型
      selectArrayDataArr:[],//数据类型
      unitList: require('../../../static/unit.json'),  // 单位列表
    };
  },
  mounted() {
    this.meijuarrNew = JSON.parse(JSON.stringify(this.meijuarr));
    this.plustypeNew = JSON.parse(JSON.stringify(this.plustype));
    // 7数据类型
    selectDataTypeList({ type: true }).then(res => {
      this.dataTypePlus = res.data.data;
    });
    // 推送类型
    getDeliveryType().then(res => {
      this.deliverTypeArr = res.data.data;
    })
    // 事件类型
    getEventType().then(res => {
      this.eventTypeArr = res.data.data;
    })
    // 数据类型
    selectArrayDataType().then(res => {
      this.selectArrayDataArr = res.data.data;
    })
    this.abilityParameterBody = JSON.parse(
      JSON.stringify(this.templateMsgBody)
    );

    this.ruleForm.parameters.forEach(param => {
      var defaultValue;
      switch (param.dataType) {
        case 1:
        case 2:
          defaultValue = 0;
          break;
        case 3:
          defaultValue = false;
          break;
        case 4:
          defaultValue = "";
          break;
        case 5:
          defaultValue = [];
          break;
        case 6:
          defaultValue = 0.0;
          break;
        case 7:
          defaultValue = JSON.parse(param.scheme.constant);
        default:
          break;
      }
      let keyName = param.key;
      this.abilityParameterBody.contents[0][keyName]=defaultValue;
    });
    let params = JSON.parse(JSON.stringify(this.abilityParameterBody))
    this.messageTemplate = JSON.stringify(params, null, 4);

  },
  watch: {
    show() {
      this.mdeditopen = this.mdeditopens;
    },
    ruleForm: {
      handler(value) {
        this.abilityParameterBody = JSON.parse(
          JSON.stringify(this.templateMsgBody)
        );
        if(this.ruleForm.parameters)
        this.ruleForm.parameters.forEach(param => {
          var defaultValue;
          switch (param.dataType) {
            case 1:
            case 2:
              defaultValue = 0;
              break;
            case 3:
              defaultValue = false;
              break;
            case 4:
              defaultValue = "";
              break;
            case 5:
              defaultValue = [];
              break;
            case 6:
              defaultValue = 0.0;
              break;
            default:
              break;
          }
          if(param.dataType == 7) {
          		if(param.scheme&&param.scheme.constant) {
          				defaultValue = JSON.parse(param.scheme.constant);
          		}else {
          				defaultValue = {};
          		}
          }
          let keyName = param.key;
          this.abilityParameterBody.contents[0][keyName]=defaultValue;
          this.messageTemplate = JSON.stringify(
            this.abilityParameterBody,
            null,
            4
          );
        });
      },
      deep: true
    }
  },
  methods: {
    shaixuanChange(val){

      this.opyan=false
      this.$set(val,'yanZ',false)
      if(val.openFilter==0){
        this.$set(val,'openFilter',false)
        val.filter=''
      }else{
        this.$set(val,'openFilter',true)
      }
    },
    shaiInpYanZ(val,value){
      this.opyan=false
      let rex=/.{1,1000}$/
      if(!rex.test(val) || val==undefined){
        this.$set(value,'yanZ',true)
      }else{
         this.$set(value,'yanZ',false)
      }
    },
    deledianji(v, i, m) {//枚举删除
      v.plusMeijuVisible = !v.plusMeijuVisible;
      if (m) {
        // 确定
        let index = this.plustype.scheme.enumList.indexOf(v);
        if (index > -1) {
          if (this.plustype.scheme.enumList.length <= 1) {
            this.plustype.scheme.enumList[i].plusMeijuVisible = false;
            this.$message.error("枚举项至少一个！");
          } else {
            this.plustype.scheme.enumList.splice(index, 1);
          }
        }
      } else {
        this.ruleForm.scheme.enumList[i].plusMeijuVisible = false;
      }
    },
    deledianjiindex(v, i, m) {//新增时枚举删除
      v.plusMeijuVisible = !v.plusMeijuVisible;
      if (m) {
        // 确定
        let index = this.ruleForm.scheme.enumList.indexOf(v);
        if (index > -1) {
          if (this.ruleForm.scheme.enumList.length <= 1) {
            this.ruleForm.scheme.enumList[i].meijuindexdelete = false;
            this.$message.error("枚举项至少一个！");
          } else {
            this.ruleForm.scheme.enumList.splice(index, 1);
          }
        }
      } else {
        this.ruleForm.scheme.enumList[i].meijuindexdelete = false;
      }
    },
    deleteModel(v, i, m) {//能力删除参数
      v.plusMeijuVisible = !v.plusMeijuVisible;
      if (m) {
        if (this.ruleForm.deleteParameterIds) {
          this.ruleForm.deleteParameterIds.push(v.parameterId);
        } else {
          this.ruleForm.deleteParameterIds = [];
          this.ruleForm.deleteParameterIds.push(v.parameterId);
        }
        this.ruleForm.parameters.splice(i, 1);
      } else {
        this.ruleForm.parameters[i].meijuindexdelete = false;
      }
    },
    plusEnum(val) {//新增时添加枚举项

      if (this.plustype["scheme"]["enumList"].length > 24) {
        this.$message.error("最多可添加25条枚举项");
      } else {
        let obj = { name: "", value: "" };
        let arr = JSON.parse(
          JSON.stringify(this.plustype["scheme"]["enumList"])
        );
        arr.push(obj);
        let schem = JSON.parse(JSON.stringify(this.plustype["scheme"]));
        this.$set(schem, "enumList", arr);
        this.$set(this.plustype, "scheme", schem);
      }
    },
    plusEnumindex(val) {//添加枚举项
      if (this.ruleForm["scheme"]["enumList"].length > 24) {
        this.$message.error("最多可添加25条枚举项");
      } else {
        let obj = { name: "", value: "" };
        let arr = JSON.parse(
          JSON.stringify(this.ruleForm["scheme"]["enumList"])
        );
        arr.push(obj);
        let schem = JSON.parse(JSON.stringify(this.ruleForm["scheme"]));
        this.$set(schem, "enumList", arr);
        this.$set(this.ruleForm, "scheme", schem);
      }
    },
    unitChange(val) {//单位切换

      if (val == "") {
        this.unitCustom = true;
      } else {
        this.unitCustom = false;
      }

    },
    parametersCancel(formName) {//新增时取消编辑
      this.$confirm("是否放弃编辑？").then(_ => {
      	this.$nextTick(() => {
      			this.$refs["plustype"].resetFields();
      	})
      	this.$refs["plustype"].resetFields();
        this.innerVisible = !this.innerVisible;
      });
    },
    mdeditout(formName) {//放弃编辑
      this.$confirm("是否放弃编辑？").then(_ => {
        this.mdeditopen = false;
        this.funListEventType = "信息";
        this.funListEventMovement = "运营平台";
        this.meijuarr = this.meijuarrNew;
        this.$nextTick(() => {
      			this.$refs["ruleForm"].resetFields();
      	})
        this.$refs["ruleForm"].resetFields();
      });
    },
    mdeditoutX() {
      this.$emit("modelScroll");
      this.$confirm("是否放弃编辑？").then(_ => {
        this.mdeditopen = false;
        this.funListEventType = "信息";
        this.funListEventMovement = "运营平台";
        this.meijuarr = this.meijuarrNew;
        this.$nextTick(() => {
      			this.$refs["ruleForm"].resetFields();
      	})
        this.$refs["ruleForm"].resetFields();
      });
    },
    mdeditright(formName) {
      //确定编辑
      let aa=true
      if(this.ruleForm.openFilter==1 && (!/.{1,1000}$/.test(this.ruleForm.filter) || this.ruleForm.filter==null)){
        this.opyan=true
      }
      this.$refs[formName].validate(valid => {
        if (valid && !this.opyan && this.funCanClick) {
        	this.funCanClick = false;
          if (this.ruleForm.proType == "能力") {
            let arr = [];
            if (this.ruleForm.parameters) {
              this.ruleForm.parameters.forEach((v, i) => {
                let obj = {};
                obj.abilityId = v.abilityId;
                obj.dataType = v.dataType;
                obj.dataTypeId = v.dataTypeId;
                obj.key = v.key;
                obj.parameterId = v.parameterId;
                obj.parameterName = v.parameterName;
                let objscheme = {};
                if (v.dataType == 1) {
                  //整数型
                  objscheme.dataId = v.dataTypeId;
                  objscheme.dataType = v.dataType;
                  objscheme.dataName = "整数型";
                  if(v.scheme){
                    objscheme.max = v.scheme.max;
                    objscheme.min = v.scheme.min;
                    objscheme.step = v.scheme.step;
                    if (v.scheme.unit == "自定义") {
                      objscheme.unit = v.scheme.unitName;
                    } else {
                      objscheme.unit = v.scheme.unit;
                    }
                  }
                } else if (v.dataType == 2) {
                  //枚举型
                  objscheme.dataId = v.dataTypeId;
                  objscheme.dataType = v.dataType;
                  objscheme.dataName = "枚举型";
                  objscheme.enumList = [];
                  if(v.scheme){
                    if (v.scheme.enumList) {
                      v.scheme.enumList.forEach((meijuarrv, meijuarri) => {
                        let meijuarrobj = {};
                        meijuarrobj.value = meijuarrv.value;
                        meijuarrobj.name = meijuarrv.name;
                        meijuarrobj.enumId = meijuarrv.enumId;
                        meijuarrobj.dataId = v.dataTypeId;
                        objscheme.enumList.push(meijuarrobj);
                      });
                    }
                  }
                } else if (v.dataType == 3) {
                  //布尔型
                  objscheme.dataId = v.dataTypeId;
                  objscheme.dataType = v.dataType;
                  objscheme.dataName = "布尔型";
                  if(v.scheme){
                    objscheme.positive = v.scheme.positive;
                    objscheme.negative = v.scheme.negative;
                  }
                } else if (v.dataType == 4) {
                  //字符串
                  objscheme.dataId = v.dataTypeId;
                  objscheme.dataType = v.dataType;
                  objscheme.dataName = "字符串";
                  objscheme.minLength = 0;
                  if(v.scheme){
                    objscheme.maxLength = v.scheme.maxLength;
                  }
                } else if (v.dataType == 5) {
                  //数组
                  objscheme.dataId = v.dataTypeId;
                  objscheme.dataType = v.dataType;
                  objscheme.dataName = "数组";
                  if (v.scheme.arrayDataType == "1") {
                    objscheme.arrayDataType = 1;
                    objscheme.arrayDataName = "整数型";
                  } else if (v.scheme.arrayDataType == "2") {
                    objscheme.arrayDataType = 2;
                    objscheme.arrayDataName = "浮点型";
                  } else if (v.scheme.arrayDataType == "3") {
                    objscheme.arrayDataType = 3;
                    objscheme.arrayDataName = "字符串";
                  }
                } else if (v.dataType == 6) {
                  //浮点型
                  objscheme.dataId = v.dataTypeId;
                  objscheme.dataType = v.dataType;
                  objscheme.dataName = "浮点型";
                  if(v.scheme){
                    objscheme.max = v.scheme.max;
                    objscheme.min = v.scheme.min;
                    objscheme.step = v.scheme.step;
                    if (v.scheme.unit == "自定义") {
                      objscheme.unit = v.scheme.unitName;
                    } else {
                      objscheme.unit = v.scheme.unit;
                    }
                  }
                } else if (v.dataType == 7) {
                  //常量
                  objscheme.dataId = v.dataTypeId;
                  objscheme.dataType = v.dataType;
                  if(v.scheme){
                    objscheme.constant = v.scheme.constant;
                  }
                }
                obj.scheme = objscheme;
                arr.push(obj);
              });
            }
            let data = {
              abilityId: this.ruleForm.abilityId,
              abilityName: this.ruleForm.proName,
              deleteParameterIds: this.ruleForm.deleteParameterIds,
              description: this.ruleForm.description,
              key: this.ruleForm.key,
              modelTypeId: this.ruleForm.modelTypeId,
              msgTemplate: JSON.stringify(this.abilityParameterBody),
              parameters: arr
            };
            if (this.divisions == "type") {
              updateTypeAbility(data).then(res => {
              		if (res.err_CODE === 0) {
                	this.$nextTick(() => {
					      			this.$refs["ruleForm"].resetFields();
					      	})
                	this.mdeditopen = false;
                  this.$message({
                    type: "success",
                    message: res.err_MESSAGE
                  });
                  if (this.divisions == "model") {
	                  this.$emit("modelClose", true);
	                }
	                if (this.divisions == "type") {
	                  this.$emit("typeClose", true);
	                }
                } else {
                	this.funCanClick = true;
                  this.$message.error(res.err_MESSAGE);
                }
              });
            }
            if (this.divisions == "model") {
              updateModelAbility(data).then(res => {
              		if (res.err_CODE === 0) {
                	this.$nextTick(() => {
					      			this.$refs["ruleForm"].resetFields();
					      	})
                  this.mdeditopen = false;
                  this.$message({
                    type: "success",
                    message: res.err_MESSAGE
                  });
                  if (this.divisions == "model") {
	                  this.$emit("modelClose", true);
	                }
	                if (this.divisions == "type") {
	                  this.$emit("typeClose", true);
	                }
                } else {
                	this.funCanClick = true;
                  this.$message.error(res.err_MESSAGE);
                }
              });
            }
          } else if (this.ruleForm.proType == "属性") {
            let data = {};
            data.propertyId = this.ruleForm.propertyId;
            data.cateType = this.ruleForm.cateType;
            data.modelTypeId = this.ruleForm.modelTypeId;
            data.propertyName = this.ruleForm.proName;
            data.key = this.ruleForm.key;
            data.dataType = this.ruleForm.dataType;
            data.description = this.ruleForm.description;
            data.dataId = this.ruleForm.dataTypeId;
            if(this.ruleForm.openFilter==false){
              data.openFilter=0
            }else{
              data.openFilter=1
              data.filter=this.ruleForm.filter
            }
            if (this.ruleForm.dataTypeName == "布尔型") {
              data.scheme = {};
              data.scheme.positive = this.ruleForm.scheme.positive;
              data.scheme.negative = this.ruleForm.scheme.negative;
              data.scheme.dataId = this.ruleForm.dataTypeId;
              data.scheme.dataType = this.ruleForm.dataType;
            }
            if (this.ruleForm.dataTypeName == "枚举型") {
              if (!this.listenBooleanValue(0)) {
              	this.funCanClick = true;
              	return;
             	}
              let meiarr = [];
              if (this.ruleForm.scheme.enumList) {
                this.ruleForm.scheme.enumList.forEach((meiv, meii) => {
                  let meiobj = {};
                  meiobj.enumId = meiv.enumId;
                  meiobj.name = meiv.name;
                  meiobj.value = meiv.value;
                  meiarr.push(meiobj);
                });
              }
              data.scheme = {};
              data.scheme.enumList = meiarr;
              data.scheme.dataId = this.ruleForm.dataTypeId;
              data.scheme.dataType = this.ruleForm.dataType;
            }
            if (this.ruleForm.dataTypeName == "数组") {
              data.scheme = {};
              data.scheme.arrayDataType=this.ruleForm.scheme.arrayDataType
              data.scheme.dataId = this.ruleForm.dataTypeId;
              data.scheme.dataType = this.ruleForm.dataType;
            }
            if (this.ruleForm.dataTypeName == "字符串") {
              data.scheme = {};
              data.scheme.minLength = 1;
              data.scheme.maxLength = this.ruleForm.scheme.maxLength;
              data.scheme.dataId = this.ruleForm.dataTypeId;
              data.scheme.dataType = this.ruleForm.dataType;
            }
            if (this.ruleForm.dataTypeName == "整数型") {
              data.scheme = {};
              data.scheme.max = this.ruleForm.scheme.max;
              data.scheme.min = this.ruleForm.scheme.min;
              data.scheme.step = this.ruleForm.scheme.step;
              if (this.ruleForm.scheme.unit == "自定义") {
                data.scheme.unit = this.ruleForm.scheme.unitName;
              } else {
                data.scheme.unit = this.ruleForm.scheme.unit;
              }
              data.scheme.dataId = this.ruleForm.dataTypeId;
              data.scheme.dataType = this.ruleForm.dataType;
            }
            if (this.ruleForm.dataTypeName == "浮点型") {
              data.scheme = {};
              data.scheme.max = this.ruleForm.scheme.max;
              data.scheme.min = this.ruleForm.scheme.min;
              data.scheme.step = this.ruleForm.scheme.step;
              if (this.ruleForm.scheme.unit == "自定义") {
                data.scheme.unit = this.ruleForm.scheme.unitName;
              } else {
                data.scheme.unit = this.ruleForm.scheme.unit;
              }
              data.scheme.dataId = this.ruleForm.dataTypeId;
              data.scheme.dataType = this.ruleForm.dataType;
            }
            if (this.divisions == "type") {
              updateTypeProperty(data).then(res => {
              	if (res.err_CODE === 0) {
                	this.$nextTick(() => {
					      			this.$refs["ruleForm"].resetFields();
					      	})
                	this.mdeditopen = false;
                  this.$message({
                    type: "success",
                    message: res.err_MESSAGE
                  });
                  if (this.divisions == "model") {
	                  this.$emit("modelClose", true);
	                }
	                if (this.divisions == "type") {
	                  this.$emit("typeClose", true);
	                }
                } else {
                	this.funCanClick = true;
                  this.$message.error(res.err_MESSAGE);
                }
              });
            }
            if (this.divisions == "model") {
              updateModelProperty(data).then(res => {
              	if (res.err_CODE === 0) {
                	this.$nextTick(() => {
					      			this.$refs["ruleForm"].resetFields();
					      	})
                	this.mdeditopen = false;
                  this.$message({
                    type: "success",
                    message: res.err_MESSAGE
                  });
                  if (this.divisions == "model") {
	                  this.$emit("modelClose", true);
	                }
	                if (this.divisions == "type") {
	                  this.$emit("typeClose", true);
	                }
                } else {
                	this.funCanClick = true;
                  this.$message.error(res.err_MESSAGE);
                }
              });
            }
          } else if (this.ruleForm.proType == "事件") {

            let data = {};
            data.cateType = this.ruleForm.cateType;
            if (this.ruleForm.deliveryType == "1") {
              data.deliveryAddress = "";
              data.deliveryType = 1;
            } else if (this.ruleForm.deliveryType == "2") {
              data.deliveryAddress = "";
              data.deliveryType = 2;
            } else if (this.ruleForm.deliveryType == "3") {
              data.deliveryAddress = this.ruleForm.deliveryAddress;
              data.deliveryType = 3;
            }
            data.description = this.ruleForm.description;
            data.eventId = this.ruleForm.eventId;
            data.eventName = this.ruleForm.proName;
            data.eventType=this.ruleForm.eventType
            data.key = this.ruleForm.key;
            data.modelTypeId = this.ruleForm.modelTypeId;
            if(this.ruleForm.openFilter==false){
              data.openFilter=0
            }else{
              data.openFilter=1
              data.filter=this.ruleForm.filter
            }
            if (this.divisions == "type") {
              updateTypeEvent(data).then(res => {
              	if (res.err_CODE === 0) {
                	this.$nextTick(() => {
					      			this.$refs["ruleForm"].resetFields();
					      	})
                	this.mdeditopen = false;
                  this.$message({
                    type: "success",
                    message: res.err_MESSAGE
                  });
                  if (this.divisions == "model") {
	                  this.$emit("modelClose", true);
	                }
	                if (this.divisions == "type") {
	                  this.$emit("typeClose", true);
	                }
                } else {
                	this.funCanClick = true;
                  this.$message.error(res.err_MESSAGE);
                }
              });
            }
            if (this.divisions == "model") {
              updateModelEvent(data).then(res => {
              	if (res.err_CODE === 0) {
                	this.$nextTick(() => {
					      			this.$refs["ruleForm"].resetFields();
					      	})
                	this.mdeditopen = false;
                  this.$message({
                    type: "success",
                    message: res.err_MESSAGE
                  });
                  if (this.divisions == "model") {
	                  this.$emit("modelClose", true);
	                }
	                if (this.divisions == "type") {
	                  this.$emit("typeClose", true);
	                }
                } else {
                	this.funCanClick = true;
                  this.$message.error(res.err_MESSAGE);
                }
              });
            }
          }
        } else {
        	this.funCanClick = true;
          return false;
        }
      });
    },
    datatypechange(val) {//编辑能力新增时选择数据类型赋予默认值
      
      this.$refs["plustype"].clearValidate();
      this.plustype.scheme = {};
      let schemeF = {};
      this.$set(schemeF, "unit", "无");
      if (this.plustype.scheme.arrayDataType) {
      } else {
        this.$set(schemeF, "arrayDataType", 1);
      }
      this.$set(this.plustype, "scheme", schemeF);
      if (Array.isArray(this.plustype["scheme"]["enumList"])) {
      } else {
        let obj = { name: "", value: "" };
        let arr = [];
        arr.push(obj);
        let schem = JSON.parse(JSON.stringify(this.plustype["scheme"]));
        if (schem == null) {
          schem = {};
        }
        this.$set(schem, "enumList", arr);
        this.$set(this.plustype, "scheme", schem);
      }
    },
    receiveParams() {
    	this.$nextTick(() => {
	    	//赋值操作
	    	this.ruleForm = JSON.parse(JSON.stringify(this.newRuleForm));
	      if (this.ruleForm.deliveryType == "1") {
	        this.ruleForm.deliveryAddress = "";
	        this.ruleForm.deliveryType = 1;
	      } else if (this.ruleForm.deliveryType == "2") {
	        this.ruleForm.deliveryAddress = "";
	        this.ruleForm.deliveryType = 2;
	      } else if (this.ruleForm.deliveryType == "3") {
	        this.ruleForm.deliveryAddress = this.ruleForm.deliveryAddress;
	        this.ruleForm.deliveryType = 3;
	      }
	      if(this.ruleForm.openFilter=='是'){
	        this.$set(this.ruleForm,'openFilter',true)
	      }else{
	        this.$set(this.ruleForm,'openFilter',false)
	        this.$set(this.ruleForm,'filter','')
	      }
	      //判断是否是单位文件的单位
	      let exitUnit = false;
	    	this.unitList.forEach(item => {
	    		if(item.value == this.ruleForm.scheme.unit) {
	    			exitUnit = true;
	    		}
	    	})
	      if (this.ruleForm.scheme) {
	        if (!exitUnit) {
	          let unitname = this.ruleForm.scheme.unit;
	          this.ruleForm.scheme.unit = '自定义';
						this.$set(this.ruleForm.scheme,"unitName",unitname)
	        }
	      }
	      if (this.ruleForm["parameters"]) {
	        this.ruleForm["parameters"].forEach(Rvalue => {
	        	if(Rvalue.scheme) {
	        		if (Rvalue.scheme.enumList) {
		            Rvalue.scheme.enumList.forEach(v => {
		              v.plusMeijuVisible = false;
		            });
		          }
	        	}
	          
	          if (!Rvalue.scheme) {
	            Rvalue.scheme = {
	            		enumList: [
	            			{
			                name: "",
			                value: ""
			              }
	            		]
	            };
	          }
	        });
	      }
	      let params = JSON.parse(this.ruleForm.msgTemplate)
	      this.messageTemplate= JSON.stringify(params, null, 4);
	    })
    },
    parentHandleclick(val, value, division) {
      //获取父组件数据
      this.opyan=false
      this.newRuleForm = value;
      this.mdeditopen = val;
      this.divisions = division;		//区分型号或者类型调用页面
      this.funCanClick = true;
      setTimeout(e => {
      	this.$set(this.$refs["MDetail"], "moveY", 0);
      	this.$set(this.$refs["MDetail"]["wrap"], "scrollTop", 0);
      })
    },
    addParams() {
    	//编辑参数接收数据
    	
    },
    editName(val, ind, item) {//能力编辑参数
      this.plusCanShudata = "编辑参数";
      this.innerVisible = true;
      this.paramsCanClick = true;
     	this.plustype = {
        parameterName: item.parameterName,
        key: item.key,
        dataType: item.dataType,
        parameterId: item.parameterId,
        dataTypeId: item.dataTypeId,
        scheme: JSON.parse(JSON.stringify(item.scheme))
      };
      this.plustype.have = 1;
      this.plustype.ind = ind;
      if (!this.plustype.scheme) {
        this.plustype.scheme = {};
        this.plustype.scheme.unit = '无';
        this.plustype["scheme"]["enumList"] = [
          {
            name: "",
            value: "",
            enumId: ""
          }
        ];
      } else {
        if (this.plustype.scheme.arrayDataName) {
        } else {
          this.$set(this.plustype.scheme, "arrayDataName", "1");
        }
        if (this.plustype["scheme"]["enumList"]) {
          this.plustype["scheme"]["enumList"].forEach(v => {
            v.plusMeijuVisible = false;
          });
        }
      }
    },
    // 新增参数
    plusCanShu() {
      if (this.ruleForm.parameters.length == 25) {
        this.$message.error("最多可增加25条参数！");
      } else {
        this.plusCanShudata = "新增参数";
        this.plustype = JSON.parse(JSON.stringify(this.plustypeNew));
        this.plustype.have = 2;
        this.plustype["scheme"]["enumList"] = [];
	      this.plustype["scheme"]["enumList"].push({
	        value: "",
	        name: ""
	      });
        let schemeF = {};
        this.$set(schemeF, "unit", "无");
       	this.$set(this.plustype, "scheme", schemeF);
       	this.$set(this.plustype, "parameterName", "");
        this.$set(this.plustype, "key", "");
				this.innerVisible = true;
				this.paramsCanClick = true;
      }
    },
    // 确定新增参数
    parametersPlus(formName) {
      this.$refs[formName].validate(valid => {
      	if (valid && this.paramsCanClick) {
      		this.paramsCanClick = false;
          if (this.plustype.dataType == "7") {
            var constantValid = true;
            try {
              var result = JSON.parse(this.plustype["scheme"].constant);
            } catch (err) {
              constantValid = false;
            }
            if (!constantValid) {
              this.paramsCanClick = true;
              this.$message.error("常量值必须为合法的JSON字符串");
              return;
            }
          }
          if (this.plustype.have == 1) {
            let parameters = JSON.parse(
              JSON.stringify(this.ruleForm.parameters)
            );
            let plindex = this.plustype.ind;
            parameters[plindex] = {
              dataType: this.plustype.dataType,
              key: this.plustype.key,
              parameterName: this.plustype.parameterName,
              parameterId: this.plustype.parameterId,
              dataTypeId: this.plustype.dataTypeId,
              scheme: JSON.parse(JSON.stringify(this.plustype.scheme))
            };

            if (this.templateMsgBody[this.plustype.key] !== undefined) {
            	this.paramsCanClick = true;
              return;
            }

            if (this.plustype.dataType == "2") {
              if (!this.listenBooleanValue(1)) {
              	this.paramsCanClick = true;
              	return;
              }
              parameters[plindex].scheme.enumList = [];
              this.plustype.scheme.enumList.forEach((value, index) => {
                parameters[plindex].scheme.enumList.push({});
                let namev = this.plustype.scheme.enumList[index].name;
                let valuev = this.plustype.scheme.enumList[index].value;
                let enumIdv = this.plustype.scheme.enumList[index].enumId;

                this.$set(
                  parameters[plindex].scheme.enumList[index],
                  "value",
                  valuev
                );
                this.$set(
                  parameters[plindex].scheme.enumList[index],
                  "name",
                  namev
                );
                this.$set(
                  parameters[plindex].scheme.enumList[index],
                  "enumId",
                  enumIdv
                );
              });
            }
            this.paramsCanClick = true;
            for (let i = 0; i < parameters.length; i++) {
              if (
                i !== plindex &&
                parameters[i].parameterName == parameters[plindex].parameterName
              ) {
                this.$message.error("参数名称已存在!");
                return;
              } else if (
                i !== plindex &&
                parameters[i].key == parameters[plindex].key
              ) {
                this.$message.error("标识符已存在!");
                return;
              }
            }
            this.$nextTick(() => {
		      			this.$refs["plustype"].resetFields();
		      	})
            this.innerVisible = false;
            this.$set(this.ruleForm, "parameters", [...parameters]);
          } else {
            if (Array.isArray(this.ruleForm.parameters)) {
              let parameters = JSON.parse(
                JSON.stringify(this.ruleForm.parameters)
              );
              let child = {
                dataType: this.plustype.dataType,
                key: this.plustype.key,
                dataTypeId: this.plustype.dataTypeId,
                parameterName: this.plustype.parameterName,
                scheme: JSON.parse(JSON.stringify(this.plustype.scheme))
              };
              this.paramsCanClick = true;
              if (this.plustype.dataType == "2") {
                if (!this.listenBooleanValue(1)){
                	return;
                } 
              }

              if (this.templateMsgBody[this.plustype.key] !== undefined) {
                this.$message.error("标识符已存在!");
                return;
              }
              for (let i = 0; i < parameters.length; i++) {
                if (parameters[i].parameterName == child.parameterName) {
                  this.$message.error("参数名称已存在!");
                  return;
                } else if (parameters[i].key == child.key) {
                  this.$message.error("标识符已存在!");
                  return;
                }
              }
              this.$set(this.ruleForm, "parameters", [...parameters, child]);
              this.$refs.plustype.resetFields();
              this.innerVisible = false;
            } else {
              this.ruleForm.parameters = [];
              if (this.plustype.dataType == "2") {
                if (!this.listenBooleanValue(1)) return;
              }
              this.ruleForm.parameters.push(
                JSON.parse(JSON.stringify(this.plustype))
              );
              this.paramsCanClick = true;
              this.$refs.plustype.resetFields();
            }
          }
        } else {
          return false;
        }
      });
    },
    // 枚举验证
    //输入清除重复验证信息
    listenBooleanChange(type) {
      if (type == 0) {
        let enumList = JSON.parse(
          JSON.stringify(this.ruleForm.scheme.enumList)
        );
        for (let i = 0; i < enumList.length; i++) {
          this.$set(this.ruleForm.scheme.enumList[i], "isValueError", false);
          this.$set(this.ruleForm.scheme.enumList[i], "isNameError", false);
        }
      } else {
        let enumList = JSON.parse(
          JSON.stringify(this.plustype.scheme.enumList)
        );
        for (let i = 0; i < enumList.length; i++) {
          this.$set(this.plustype.scheme.enumList[i], "isValueError", false);
          this.$set(this.plustype.scheme.enumList[i], "isNameError", false);
        }
      }
    },

    // 验证枚举类重复
    listenBooleanValue(type) {
      let flag;
      if (type == 0) {
        let enumList = JSON.parse(
          JSON.stringify(this.ruleForm.scheme.enumList)
        );
        const reg = /^-?[1-9]\d{0,1}$/;
        flag = true;
        for (let i = 0; i < enumList.length; i++) {
          this.$set(this.ruleForm.scheme.enumList[i], "isValueError", false);
          this.$set(this.ruleForm.scheme.enumList[i], "isNameError", false);
        }
        for (let i = 0; i < enumList.length; i++) {
          for (let j = i + 1; j < enumList.length; j++) {
            if (enumList[i].value == enumList[j].value) {
              flag = false;
              this.$set(this.ruleForm.scheme.enumList[i], "isValueError", true);
              this.$set(
                this.ruleForm.scheme.enumList[i],
                "valueError",
                "参数值不能相同"
              );
              this.$set(this.ruleForm.scheme.enumList[j], "isValueError", true);
              this.$set(
                this.ruleForm.scheme.enumList[j],
                "valueError",
                "参数值不能相同"
              );
            }
            if (enumList[i].name == enumList[j].name) {
              flag = false;
              this.$set(this.ruleForm.scheme.enumList[i], "isNameError", true);
              this.$set(
                this.ruleForm.scheme.enumList[i],
                "nameError",
                "参数描述不能相同"
              );
              this.$set(this.ruleForm.scheme.enumList[j], "isNameError", true);
              this.$set(
                this.ruleForm.scheme.enumList[j],
                "nameError",
                "参数描述不能相同"
              );
            }
          }
        }
        return flag;
      } else {
        let enumList = JSON.parse(
          JSON.stringify(this.plustype.scheme.enumList)
        );
        const reg = /^-?[1-9]\d{0,1}$/;
        flag = true;
        for (let i = 0; i < enumList.length; i++) {
          this.$set(this.plustype.scheme.enumList[i], "isValueError", false);
          this.$set(this.plustype.scheme.enumList[i], "isNameError", false);
        }
        for (let i = 0; i < enumList.length; i++) {
          for (let j = i + 1; j < enumList.length; j++) {
            if (enumList[i].value == enumList[j].value) {
              flag = false;
              this.$set(this.plustype.scheme.enumList[i], "isValueError", true);
              this.$set(
                this.plustype.scheme.enumList[i],
                "valueError",
                "参数值不能相同"
              );
              this.$set(this.plustype.scheme.enumList[j], "isValueError", true);
              this.$set(
                this.plustype.scheme.enumList[j],
                "valueError",
                "参数值不能相同"
              );
            }
            if (enumList[i].name == enumList[j].name) {
              flag = false;
              this.$set(this.plustype.scheme.enumList[i], "isNameError", true);
              this.$set(
                this.plustype.scheme.enumList[i],
                "nameError",
                "参数描述不能相同"
              );
              this.$set(this.plustype.scheme.enumList[j], "isNameError", true);
              this.$set(
                this.plustype.scheme.enumList[j],
                "nameError",
                "参数描述不能相同"
              );
            }
          }
        }
      }
      return flag;
    },
    // 验证枚举项value
    validateEnumListValue(rule, value, callback) {
      const reg = /^[\s\S]{1,30}$/;
      if (value && value.length>=1 && value.length <=30) {
        callback();
      } else {
        return callback(new Error("1-30个字符"));
      }
    },

    // 验证枚举项name
    validateEnumListName(rule, value, callback) {
      const reg = /^[\s\S]{1,20}$/;
      if(value && value.length>=1 && value.length <=20){
	      callback();
	    }else{
	      return callback(new Error('1-20个字符'));
	    }
    }
  }
};
</script>
<style lang="scss">
@import "../../styles/new-index.scss";
.form-item-bottom {
		padding-bottom: 10px!important;
}
#modelDetailEdit .dialogindex .el-dialog .el-form #meiju .meiinp input {
		width: 190px!important;
}
#modelDetailEdit .dialogindex #meiju .meiJuDiv {
		width: 190px!important;
}
#modelDetailEdit {
  display: flex;
  flex-direction: row;
  
  .el-dialog__body {
    padding: 0;
  }
  .el-input__inner {
    padding: 0 5px !important;
  }
  .error {
    position: absolute;
    left:0;
    top:22px;
    color: #f56c6c;
    font-size: 12px;
    text-decoration: none;
  }
  .formItem {
    .el-form-item__content {
      width: 430px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      .el-input {
        width: 201px;
        .el-input__inner {
          width: 201px !important;
        }
      }
      .span {
        display: inline-block;
        width: 20px;
        text-align: center;
      }
    }
  }
  .formItemmeiju {
  	.el-form-item__content {
      width: 455px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      .el-input {
        width: 203px;
        .el-input__inner {
          width: 195px !important;
        }
      }
      .meijuline {
        display: inline-block;
        width: 20px;
        text-align: center;
      }
    }
  }
  .text-area-tip {
    padding-left: 85px;
    color: #adadad;
    font-size: 12px;
    padding-bottom: 5px;
    padding-top: 5px;
  }
  .el-dialog .el-form-item__label {
    font-weight: 400;
    color: rgba(50, 50, 50, 1);
    padding: 0;
    font-size: 12px;
  }
  .el-dialog__body {
    overflow-y: auto;
  }
  .dialogindex .el-dialog__body .el-scrollbar .el-scrollbar__wrap {
    min-height: 522px;
  }
  .dialogindex
    .el-dialog__body
    .el-scrollbar
    .el-scrollbar__wrap
    .el-scrollbar__view {
    min-height: 522px;
    max-height: 522px;
  }
  .el-dialog__body::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 4px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 1px;
  }
  .el-dialog__body::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 2px;
    -webkit-box-shadow: inset 0 0 5px rgba(144, 147, 153, 0.2);
    background: rgba(144, 147, 153, 0.2);
  }
  .el-dialog__body::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px #fff;
    border-radius: 2px;
    background: #ededed;
  }
  .el-scrollbar {
    .el-scrollbar__wrap {
      box-sizing: border-box;
      overflow-x: hidden;
      padding-right: 5px;
    }
  }
  .dialogindex {
    height: 100%;
    .formItemInput {
      position: relative;
      .iconSpan {
          position: absolute;
          left: -20px;
          top: 1px;
      }
    }
    .el-scrollbar {
      height: 100%;
      .el-scrollbar__wrap {
        box-sizing: border-box;
        overflow-x: hidden;
      }
    }
    .el-form {
      .el-form-item__error {
        padding-top: 0;
      }
    }
    .parameters {
      line-height: 20px;
    }
    .deleteR {
      margin-left: 11px;
      .el-icon-circle-close {
        cursor: pointer;
        font-size: 18px;
        color: #af7c58;
      }
    }
    .el-dialog__body
      .el-form
      .el-form-item
      .el-form-item__content
      .el-radio-group
      .el-radio__label {
      font-size: 12px;
    }
    .el-dialog__header {
      padding: 20px;
      padding-bottom: 10px;
    }
    .funtype .el-form-item__content {
      height: auto;
      font-size: 12px;
      font-weight: 500;
      color: rgba(50, 50, 50, 1);
    }
    .meiju {
      .meijulable {
        width: 210px;
        display: inline-block;
        font-size: 12px;
        font-weight: 400;
        color: rgba(50, 50, 50, 1);
        font-style: normal;
      }
      .meiJuDiv {
        display: inline-block;
        width: 203px;
        div {
          display: inline-block;
          width: 203px;
          .el-form-item__error {
            width: 230px;
          }
        }
      }
    }
    .el-form-item {
      height: auto;
      margin: 0;
      margin-bottom: 10px !important;
      .el-form-item__label {
        font-size: 12px;
        font-weight: 400;
        color: rgba(50, 50, 50, 1);
        margin: 0;
        border: 1px solid transparent;
      }
      .el-form-item__content {
        height: auto;
        margin: 0;
        .meijulable {
          width: 210px;
          display: inline-block;
          font-size: 12px;
          font-weight: 400;
          color: rgba(50, 50, 50, 1);
          font-style: normal;
        }
      }
    }
    .el-dialog__footer {
      padding-bottom: 24px !important;
    }
    .dialog-footer {
      .el-button {
        padding: 0;
        width: 88px;
        height: 28px;
        text-align: center;
        font-size: 12px;
      }
    }
    .el-dialog .el-form {
      .el-input__inner {
        font-size: 12px;
        font-weight: 400;
        color: rgba(50, 50, 50, 1);
      }
      .name .el-input__inner {
        width: 430px;
      }
      .minmax .el-input__inner {
        width: 203px;
      }
      .stepleng .el-input__inner {
        width: 430px;
      }
      .meiinp {
        width: 203px !important;
        .el-input {
          width: 203px !important;
        }
        input {
          width: 203px !important;
        }
      }
    }
    .el-col-10 {
      width: 203px;
    }
    .line {
      text-align: center;
      width: 20px;
    }
    .datatimeleng {
      width: 167px;
      input {
        width: 167px;
        font-size: 12px;
        font-weight: 400;
        color: rgba(50, 50, 50, 1);
      }
    }
    .dataacq {
      span {
        font-size: 12px;
      }
      .datatimeunit {
        z-index: 2000;
        .el-input {
          width: 50px;
          background: #1e2e4c;
        }
        width: 50px;
        background: #1e2e4c;
        .el-input__inner {
          width: 50px;
          background: #1e2e4c;
          color: #e5e7ea;
          padding: 1px;
        }
        .el-input__suffix {
          width: 9px;
          right: 12px;
          top: 8px;
        }
        .el-select-dropdown {
          width: 50px;
          margin-top: 0;
        }
      }
    }
    .proedit {
      .shaiX{
        .el-form-item__error{
          color: red;
          margin-left: 85px;
        }
        .el-textarea{
          width: auto;
          margin-top: 10px;
          margin-bottom: 5px;
        }
        .el-checkbox{
          width: 85px;
          float: left;
          margin-right: 0;
        }
        .el-checkbox__label{
          padding-left: 3px
        }
      }
      .eventParameter {
        height: auto;
        .deleteR {
          .el-icon-delete {
            cursor: pointer;
            font-size: 12px;
            color: #af7c58;
          }
        }
        .el-form-item__content {
          height: auto;
        }
        .el-button {
          border: none;
          width: 86px;
          height: 28px;
          background: #AF7C58;
          border-radius: 2px;
          text-align: center;
          padding: 0;
          margin-bottom: 15px;
        }
        .el-form-item__label {
          line-height: 20px;
          padding-left: 11px;
        }
      }
      .blooinput {
        .el-input {
          width: 169px;
          .el-input__inner {
            width: 169px;
          }
        }
        .el-form-item__content {
          .el-form-item__error {
            margin-left: 35px;
          }
        }
      }
      .el-form-item__label {
        padding: 0;
      }
      .describ {
        min-height: 132px;
        .el-form-item__label {
          line-height: 17px;
          padding-left: 11px;
        }
        .el-form-item__content {
          min-height: 132px;
        }
        .el-textarea__inner {
          width: 430px !important;
          min-height: 132px !important;
          font-size: 12px;
          padding: 5px 6px;
        }
      }
      .messTemp{
        .el-textarea__inner {
          min-height: 294px !important;
        }
      }
    }
    .fixedtimel {
      margin-right: 6px;
      margin-left: 10px;
      .el-radio__label {
        padding: 0;
        padding-left: 5px;
      }
    }
    .changeacq {
      .el-radio__label {
        padding: 0;
        padding-left: 4px;
      }
      margin-right: 8px;
    }

    .el-dialog__body {
      padding-top: 0;
      padding-left: 24px;
    }
    .el-dialog__header {
      padding-bottom: 16px;
      padding-left: 24px;
    }
    .el-form-item__error {
      width: auto;
    }
  }
  .el-form .el-form-item .el-form-item__content .commenselect {
    width: 430px;
    .el-input {
      width: 430px;
    }
    input {
      width: 430px;
      font-size: 12px;
      font-weight: 400;
      color: rgba(50, 50, 50, 1);
    }
  }
}
.innerplus {
  .el-dialog__body
    .outerS
    .el-form
    .el-form-item
    .el-form-item__content
    .el-form-item__error {
    padding: 0;
  }
  .el-input__inner {
    padding: 0 5px !important;
  }
  .el-form .el-scrollbar .el-scrollbar__wrap {
    min-height: 374px;
  }
  .outerS .el-form .el-scrollbar .el-scrollbar__wrap .el-scrollbar__view {
    min-height: 374px;
    max-height: 374px;
  }
  .el-dialog__body::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 4px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 1px;
  }
  .el-dialog__body::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 2px;
    -webkit-box-shadow: inset 0 0 5px rgba(144, 147, 153, 0.5);
    background: rgba(144, 147, 153, 0.5);
  }
  .el-dialog__body::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px #fff;
    border-radius: 2px;
    background: #ededed;
  }
  .el-scrollbar {
    max-height: 374px;
    .el-scrollbar__wrap {
      box-sizing: border-box;
      overflow-x: hidden;
      padding-right: 5px;
      .el-scrollbar__view {
      }
    }
  }
  .stringS {
    .el-form-item__error {
      top: auto;
    }
  }
  .constantP {
    .el-form-item__error {
      font-size: 12px;
      top: 37px;
    }
    .text-area-tip-chang {
      width: 460px;
      font-size: 12px;
      color: #c0c4cc;
      padding-bottom: 5px;
    }
  }
  .el-form {
    margin-bottom: 10px;
  }
  .error {
    position: absolute;
    left: 0;
    top: 22px;
    color: #f56c6c;
    font-size: 12px;
    text-decoration: none;
  }
  .el-dialog {
    display: flex;
    flex-direction: column;
  }
  .el-dialog__body {
    overflow-y: auto;
    overflow-x: hidden;
  }
  &.el-dialog__body {
    padding: 0 0 0 16px;
  }
  .el-dialog__body
    .el-form
    .el-form-item
    .el-form-item__content
    .el-radio-group
    .el-radio__label {
    font-size: 12px;
  }
  .meijuline {
    display: inline-block;
    width: 14px;
    text-align: center;
    font-size: 12px;
    font-weight: 400;
    color: rgba(50, 50, 50, 1);
  }
  .deleteR {
    position: absolute;
    top: -3px;
    right: -5px;
    bottom: 12px;
    .el-icon-circle-close {
      cursor: pointer;
      font-size: 18px;
      color: #AF7C58;
      vertical-align: middle;
    }
  }
  .el-dialog {
    .el-form-item__label {
      font-weight: 400;
      color: rgba(50, 50, 50, 1);
      padding: 0;
      font-size: 12px;
    }
    .commeninput {
      width: 430px !important;
      .el-input {
        width: 430px !important;
      }
      input {
        width: 430px !important;
        font-size: 12px;
        font-weight: 400;
        color: #323232;
      }
    }
    .el-dialog__body .outerS .el-form .el-form-item .el-form-item__content {
      width: 100%;
      .meiJuDiv {
        display: inline-block;
        width: 200px;
        div {
          display: inline-block;
          width: 195px;
          .el-form-item__error {
            width: 195px;
            padding-top: 4px;
          }
        }
      }
    }
    .el-dialog__body .outerS .el-scrollbar__bar.is-horizontal {
    	display: none;
    }
    .el-form .el-form-item .el-form-item__content .commenselect {
      width: 430px;
      .el-input {
        width: 430px;
      }
      input {
        width: 430px;
        font-size: 12px;
        font-weight: 400;
        color: rgba(50, 50, 50, 1);
      }
    }
    .meiinp {
      width: 190px !important;
      .el-input {
        width: 190px !important;
      }
      input {
        width: 190px !important;
      }
    }
  }
  .el-dialog__footer {
    margin-top: 14px;
    padding-bottom: 20px;
    .dialog-footer {
      .el-button:first-child {
        margin-right: 0;
      }
    }
    .el-button--default {
      font-size: 12px;
      font-weight: 400;
      color: #323232;
      border: none;
    }
    .el-button--default:hover {
      background: rgba(175,124,88,0.2);
      color:rgb(175,124,88);
    }
  }
  .el-dialog .el-form .el-form-item__content {
    font-size: 12px;
    width: 450px;
    .minmax {
      width: 203px;
      .el-input__inner {
        width: 203px;
      }
    }
    .line {
      display: inline-block;
      width: 15px;
      text-align: center;
    }
    .stepleng {
      .el-input__inner {
        width: 430px;
      }
      width: 430px;
    }
    .meijulable {
      width: 198px;
      display: inline-block;
      font-size: 12px;
      font-weight: 400;
      color: rgba(50, 50, 50, 1);
      font-style: normal;
    }
  }
  .el-dialog__body {
    padding: 0 0 0 16px;
    width: 580px;
  }
  .el-dialog__header {
    padding-bottom: 16px;
  }
  .el-form-item__error {
    width: auto;
  }
  .el-dialog .el-form .blooinput {
    .el-form-item__content {
      .el-form-item__error {
        margin-left: 35px;
      }
    }
    .minmax:nth-of-type(1) {
      margin-right: 20px;
    }
    .el-input {
      width: 169px;
      .el-input__inner {
        width: 169px;
      }
    }
  }
}
</style>
