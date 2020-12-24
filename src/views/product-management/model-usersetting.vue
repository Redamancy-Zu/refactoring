<template>
  <div id="usersetting">
    <!-- 添加自定义功能 -->
    <el-dialog
      id="addUserSettingDialog"
      class="custom"
      title="添加自定义功能"
      :visible.sync="addUserDefineFunctionVisible"
      :before-close="dialogClose"
      :show="show"
      width="650px"
      top="16vh">
      <el-scrollbar>
        <div class="tabMenu">
          <span><i style="color:red">*</i> 功能类型</span><span @click="selectType(index)" :key="index" :class="activeName == index ? 'active' : ''"  v-for="(item,index) in tablist">{{item}}</span>
          <el-popover
          	style="margin-left: -180px;float:left"
            placement="top"
            width="300"
            trigger="hover"
            content="属性一般是设备的运行状态，如当前温度等；能力是设备可被调用的方法，支持定义参数，如执行某项任务；事件则是设备上报的通知，如告警，需要被及时处理；">
            <i style="font-size:14px" class="el-icon-warning" slot="reference"></i>
          </el-popover>
        </div>
        <div class="tabCon">
          <ul>
            <!-- 属性 -->
            <li v-if="activeName == 0">
              <el-form :model="addUserSetting" label-width="90px" ref="addUserSetting" :rules="addUserSettingRule" @submit.native.prevent>
                <el-form-item label="功能名称" prop="propertyName" :key="11">
                  <el-input v-model.trim="addUserSetting.propertyName" placeholder="支持汉字、字母、数字、-和_，必须以汉字、字母或数字开头" size="mini"></el-input>
                </el-form-item>
                <el-form-item label="筛选条件" label-width="90px" class="formItemInput" :class="!addUserSetting.openFilter?'formItemLabelColor':''" style="margin-top:15px;">
                	<el-popover
                		class="iconSpan"
								    placement="top-start"
								    width="339"
								    trigger="hover"
								    :content="messageTemplate1">
								    <i slot="reference" style="color:#D8D8D8" class="el-icon-info"></i>
								  </el-popover>
                	<el-checkbox @change="openFilterBox" v-model="addUserSetting.openFilter"></el-checkbox>
                 <el-input
                  :disabled="!addUserSetting.openFilter"
                  type="textarea"
                  v-model.trim="addUserSetting.filter"
                  minlength='1'
                  maxlength="1000"
                  placeholder='1-1000个字符，例："objid"：1，"name"："light"，'
                  :class="addUserSetting.filterInput?'err_border':''"
                  @blur="filterInput"
                  resize="none"
                  :autosize="{ minRows: 6, maxRows: 10}"
                  size="mini">
                  </el-input>
                  <div v-if="addUserSetting.filterInput" class="inputErr">1-1000个字符</div>
                </el-form-item>
                <el-form-item label="标识符" prop="key" :key="12">
                  <el-input v-model.trim="addUserSetting.key" placeholder="支持字母、数字和_，必须以字母开头" size="mini"></el-input>
                </el-form-item>
                <el-form-item label="数据类型" prop="dataType" :key="13">
                  <el-select v-model="addUserSetting.dataType" placeholder="请选择数据类型" size="mini" @change="dataTypeChange(addUserSetting.dataType,0)">
                    <el-option
                      v-for="item in data_type"
                      :key="item.typeId"
                      :label="item.type"
                      :value="item.typeId"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>

                <!-- 选择不同的数据类型---整数型 -->
                <div class="typeCon" v-if="addUserSetting.dataType == '1'">
                  <el-form-item label="取值范围" class="formItem" prop="scheme.maxAndmin">
                    <el-input v-model="addUserSetting.scheme.min" maxlength="11" placeholder="最小值" size="mini"></el-input>
                    <span>-</span>
                    <el-input v-model="addUserSetting.scheme.max" maxlength="11" placeholder="最大值" size="mini"></el-input>
                    <el-popover
                    	style="margin-left: -485px;float:left"
                      placement="top"
                      width="300"
                      trigger="hover"
                      content="最大值必须大于最小值，支持整数，取值范围：-2147483648 ~ 2147483647">
                      <i class="el-icon-warning" style="color:#D8D8D8;" slot="reference"></i>
                    </el-popover>
                  </el-form-item>
                  <el-form-item label="步长" prop="scheme.stepValidate">
                    <el-input v-model="addUserSetting.scheme.step" maxlength="10" placeholder="支持正整数，步长不能大于取值范围的差值" size="mini"></el-input>
                  </el-form-item>
                  <el-form-item label="单位" required :rules="[{required: true, message: '请选择单位', trigger: 'blur'}]">
                    <el-select v-model.trim="addUserSetting.scheme.unit" placeholder="请选择单位" size="mini">
                      <el-option
                        v-for="item in unit_list"
                        :key="item.id"
                        :label="item.value"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item prop="scheme.unitName" label="" v-if="addUserSetting.scheme.unit == '自定义'" :rules="[{required: true, message: '1-30个字符', pattern: /^.{1,30}$/ , trigger: 'blur'}]">
                    <el-input v-model.trim="addUserSetting.scheme.unitName" placeholder="1-30个字符" size="mini"></el-input>
                  </el-form-item>
                </div>

                <!-- 选择不同的数据类型---浮点型 -->
                <div class="typeCon" v-if="addUserSetting.dataType == '6'">
                  <el-form-item label="取值范围" class="formItem" prop="scheme.maxAndmin">
                    <el-input v-model="addUserSetting.scheme.min" maxlength="17" placeholder="最小值" size="mini"></el-input>
                    <span>-</span>
                    <el-input v-model="addUserSetting.scheme.max" maxlength="17" placeholder="最大值" size="mini"></el-input>
                    <el-popover
                    	style="margin-left: -485px;float:left"
                      placement="top"
                      width="300"
                      trigger="hover"
                      content="最大值必须大于最小值，支持小数点后五位，整数支持10位">
                      <i class="el-icon-warning" style="color:#D8D8D8;" slot="reference"></i>
                    </el-popover>
                  </el-form-item>
                  <el-form-item label="步长" prop="scheme.stepValidate">
                    <el-input v-model="addUserSetting.scheme.step" maxlength="16" placeholder="支持正数，小数点后五位，整数位支持10位，步长不能大于取值范围的差值" size="mini"></el-input>
                  </el-form-item>
                  <el-form-item label="单位" required :rules="[{required: true, message: '请选择单位', trigger: 'blur'}]">
                    <el-select v-model.trim="addUserSetting.scheme.unit" placeholder="请选择单位" size="mini">
                      <el-option
                        v-for="item in unit_list"
                        :key="item.id"
                        :label="item.value"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item prop="scheme.unitName" label="" v-if="addUserSetting.scheme.unit == '自定义'" :rules="[{required: true, message: '1-30个字符', pattern: /^.{1,30}$/ , trigger: 'blur'}]">
                    <el-input v-model.trim="addUserSetting.scheme.unitName" placeholder="1-30个字符" size="mini"></el-input>
                  </el-form-item>
                </div>

                <!-- 选择不同的数据类型---枚举项 -->
                <div class="typeCon boolean" v-else-if="addUserSetting.dataType == '2'">
                  <el-form-item label="枚举项" class="formItem blank-line" required >
                    <span class="name">参数值</span>
                    <span class="name">参数描述</span>
                  </el-form-item>
                  <template v-for="(item,index) in  addUserSetting.scheme.enumList">
                    <el-form-item label="" class="formItem boolean-line" :key="index">
                        <el-form-item :prop="'scheme.enumList.' + index + '.value'" :rules="[{required: true, validator: validateEnumListValue, trigger: 'blur'}]">
                          <el-input v-model="item.value" placeholder="1-30个字符" @keyup.native="listenBooleanChange(0)" size="mini"></el-input>
                          <span class="error" v-if="item.isValueError">{{item.valueError}}</span>
                        </el-form-item>
                        <span>-</span>
                        <el-form-item :prop="'scheme.enumList.' + index + '.name'" :rules="[{required: true, validator: validateEnumListName, trigger: 'blur'}]">
                          <el-input v-model="item.name" placeholder="1-20个字符" size="mini" @keyup.native="listenBooleanChange(0)"></el-input>
                          <span class="error" v-if="item.isNameError">{{item.nameError}}</span>
                        </el-form-item>
                      <el-popover
                        placement="top"
                        width="180"
                        v-model="item.isDelete">
                        <p>是否确认删除该枚举项？</p>
                        <div style="text-align: right; margin: 5px 0 0 0;">
                          <el-button size="mini" type="text" @click="item.isDelete = false">取消</el-button>
                          <el-button type="primary" size="mini" @click="deleteEnumList(index,0);item.isDelete = false;">确定</el-button>
                        </div>
                        <i class="el-icon-circle-close" slot="reference"></i>
                      </el-popover>
                    </el-form-item>
                  </template>
                  <el-form-item>
                    <el-button type="primary" icon="el-icon-plus" size="mini" @click="addEnumList(0)">添加枚举项</el-button>
                  </el-form-item>
                </div>

                <!-- 选择不同的数据类型---布尔型 -->
                <div class="typeCon" v-if="addUserSetting.dataType == '3'">
                  <el-form-item label="布尔值" class="formItem bolean" prop="booleanValue">
                    <span>false-</span><el-input v-model="addUserSetting.scheme.negative" placeholder="必须以汉字、字母、数字开头" size="mini"></el-input>
                    <span>true-</span><el-input v-model="addUserSetting.scheme.positive" placeholder="必须以汉字、字母、数字开头" size="mini"></el-input>
                  </el-form-item>
                </div>
                <!-- 选择不同的数据类型---字符串 -->
                <div class="typeCon" v-if="addUserSetting.dataType == '4'">
                  <el-form-item label="数据长度" prop="length">
                    <el-input v-model="addUserSetting.scheme.maxLength" placeholder="支持最小值为1，最大值为2048，整数型不能有小数位" size="mini"><template style="color:#323232;" slot="suffix">字节</template></el-input>
                  </el-form-item>
                </div>

                <!-- 选择不同的数据类型---数组 -->
                <div class="typeCon" v-if="addUserSetting.dataType == '5'">
                  <el-form-item label="元素类型" prop="scheme.arrayDataType" >
                    <el-radio-group v-model="addUserSetting.scheme.arrayDataType">
                      <el-radio :label="1">整数型</el-radio>
                      <el-radio :label="2">浮点型</el-radio>
                      <el-radio :label="3">字符串</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </div>

                <!-- 选择不同的数据类型---布尔型(数字) -->
                <div class="typeCon" v-if="addUserSetting.dataType == '8'">
                  <el-form-item label="布尔值(数字)" class="formItem bolean" prop="booleanValue">
                    <span>0-</span><el-input v-model="addUserSetting.scheme.negative" placeholder="必须以汉字、字母、数字开头" size="mini"></el-input>
                    <span>1-</span><el-input v-model="addUserSetting.scheme.positive" placeholder="必须以汉字、字母、数字开头" size="mini"></el-input>
                  </el-form-item>
                </div>

                <el-form-item label="描述" prop="description" style="margin-top:15px;">
                  <el-input
                  type="textarea"
                  v-model.trim="addUserSetting.description"
                  maxlength="100"
                  placeholder="0-100个字符"
                  resize="none"
                  :autosize="{ minRows: 6, maxRows: 10}"
                  size="mini">
                  </el-input>
                </el-form-item>
              </el-form>
            </li>
            <!-- 能力 -->
            <li v-else-if="activeName == 1">
              <el-form :model="addAbilityForm" label-width="90px" ref="addAbilityForm" :rules="addAbilityFormRule" :key="2">
                <el-form-item label="功能名称" prop="abilityName">
                  <el-input v-model="addAbilityForm.abilityName" placeholder="支持汉字、字母、数字、-和_，必须以汉字、字母或数字开头" size="mini"></el-input>
                </el-form-item>
                <el-form-item label="标识符" prop="key" :key="22">
                  <el-input v-model="addAbilityForm.key" placeholder="支持字母、数字和_，必须以字母开头" size="mini"></el-input>
                </el-form-item>
                <div class="ability overh">
                  <div class="list">
                    <label>参数</label>
                    <div>
                      <p v-for="(item, index) in addAbilityForm.parameters" :key="index">
                        <template v-if="addAbilityForm.parameters.length > 0">
                          <span>参数名称：{{item.parameterName}}</span>
                          <span>标识符：{{item.key}}</span>
                          <span class="right">
                            <i class="el-icon-edit" @click="addChildAblity(index)"></i>
                            <el-popover
                              placement="top"
                              width="180"
                              v-model="item.isDelete">
                              <p>是否确认删除该参数？</p>
                              <div style="text-align: right; margin: 5px 0 0 0;">
                                <el-button size="mini" type="text" @click="item.isDelete = false">取消</el-button>
                                <el-button type="primary" size="mini" @click="deletParam(index);item.isDelete = false;">确定</el-button>
                              </div>
                              <i class="el-icon-delete" slot="reference"></i>
                            </el-popover>
                          </span>
                        </template>
                      </p>
                      <el-button type="primary" icon="el-icon-plus" size="mini" @click="addChildAblity(null)">增加参数</el-button>
                    </div>
                  </div>
                </div>
                <el-form-item class="messageIcon" label="消息格式">
                	<el-popover
                		class="iconSpan"
								    placement="top-start"
								    width="339"
								    trigger="hover"
								    :content="msgTemplate1">
								    <i slot="reference" style="color:#D8D8D8" class="el-icon-info"></i>
								  </el-popover>
                  <el-input
                    type="textarea"
                    size="mini"
                    :disabled="true"
                    resize="none"
                    :autosize="{ minRows: 6, maxRows: 20}"
                    placeholder=''
                    :value="messageTemplate"
                  >
                  </el-input>
                </el-form-item>
                <p class="text-area-tip">如果参数为常量，可在该参数后添加，如："msgType" : "notify"</p>
                <el-form-item label="描述">
                  <el-input
                    type="textarea"
                    size="mini"
                    resize="none"
                    maxlength="100"
                    :autosize="{ minRows: 6, maxRows: 10}"
                    placeholder="0-100个字符"
                    v-model.trim="addAbilityForm.description">
                  </el-input>
                </el-form-item>
              </el-form>
            </li>
            <!-- 事件 -->
            <li v-else>
              <el-form :model="addEventForm" label-width="90px" ref="addEventForm" :rules="addEventFormRule">
                <el-form-item label="功能名称" prop="eventName" :key="31">
                  <el-input v-model="addEventForm.eventName" placeholder="支持汉字、字母、数字、-和_，必须以汉字、字母或数字开头" size="mini"></el-input>
                </el-form-item>
                <el-form-item label="筛选条件" label-width="90px" class="formItemInput" :class="!addEventForm.openFilter?'formItemLabelColor':''" style="margin-top:15px;">
                	<el-popover
                		class="iconSpan"
								    placement="top-start"
								    width="339"
								    trigger="hover"
								    :content="messageTemplate1">
								    <i slot="reference" style="color:#D8D8D8" class="el-icon-info"></i>
								  </el-popover>
                	<el-checkbox @change="openFilterBox1" v-model="addEventForm.openFilter"></el-checkbox>
                  <el-input
                  :disabled="!addEventForm.openFilter"
                  type="textarea"
                  v-model.trim="addEventForm.filter"
                  :class="addEventForm.filterInput?'err_border':''"
                  minlength='1'
                  maxlength="1000"
                  @blur="filterInput1"
                  placeholder='1-1000个字符，例："objid"：1，"name"："light"，'
                  resize="none"
                  :autosize="{ minRows: 6, maxRows: 10}"
                  size="mini">
                  </el-input>
                  <div v-if="addEventForm.filterInput" class="inputErr">1-1000个字符</div>
                </el-form-item>
                <el-form-item label="标识符" prop="key" :key="32">
                  <el-input v-model="addEventForm.key" placeholder="支持字母、数字和_，必须以字母开头" size="mini"></el-input>
                </el-form-item>
                <el-form-item class="formItemIcon" label="事件类型" prop="eventType">
                  <el-radio-group v-model="addEventForm.eventType" text-color="#323232" size="mini">
                    <template v-for="(item, index) in eventTypeArr">
                      <el-radio :label="item.code" :key="index">{{item.name}}</el-radio>
                    </template>
                  </el-radio-group>
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
                </el-form-item>
                <el-form-item label="推送至">
                  <el-radio-group v-model="addEventForm.deliveryType" text-color="#323232" size="mini">
                    <template v-for="(item, index) in deliverTypeArr">
                      <el-radio :label="item.code" :key="index">{{item.name}}</el-radio>
                    </template>
                  </el-radio-group>
                  <el-form-item prop="deliveryAddress" :show-message="addEventForm.deliveryType == 3">
                    <el-input style="line-height:30px;" v-if="addEventForm.deliveryType == 3" v-model="addEventForm.deliveryAddress" placeholder="请填写URL地址" size="mini"></el-input>
                  </el-form-item>
                </el-form-item>
                <!-- 选择不同的数据类型，显示不同的input -->
                <el-form-item label="描述" style="margin-top:15px;">
                  <el-input
                    type="textarea"
                    size="mini"
                    resize="none"
                    maxlength="100"
                    :autosize="{ minRows: 6, maxRows: 10}"
                    placeholder="0-100个字符"
                    v-model.trim="addEventForm.description">
                  </el-input>
                </el-form-item>
              </el-form>
            </li>
          </ul>
        </div>
      </el-scrollbar>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogClose">取 消</el-button>
          <el-button type="primary" @click="UserDefinedFunctionPost">确 定</el-button>
        </span>
    </el-dialog>
    <!-- 自定义tab切换提示框 -->
    <el-dialog
      id="toggleTip"
      class="add-standard multiple"
      title=""
      :visible.sync="toggleTipVisible"
      width="450px"
      top="40vh">
        <div class="content">
          <p style="text-align:center;">切换功能类型，将清空当前类型所编辑的<br/>内容，是否确认放弃切换？</p>
        </div>
        <div style="text-align:right;" slot="footer" class="dialog-footer">
          <el-button class="closeQuck" @click="toggleTipVisible = false">取 消</el-button>
          <el-button class="sureQuck" type="primary" @click="sureSwitch">确 定</el-button>
        </div>
    </el-dialog>

    <!-- 新增参数和编辑参数 -->
    <el-dialog
      class="add-param"
      :title="this.isEdit?'编辑参数':'新增参数'"
      :visible.sync="addParamVisible"
      width="620px"
      :before-close="addParamClose"
      top="21vh">
      <el-scrollbar style="height:100%;">
        <div class="form-content">
          <div class="tabCon" style="overflow:hidden;padding-bottom:30px;">
            <el-form :model="editParamForm" label-width="90px" ref="editParamForm" :rules="editParamFormRule" @submit.native.prevent :key="41">
              <el-form-item label="参数名称" prop="propertyName">
                <el-input v-model="editParamForm.propertyName" placeholder="支持汉字、字母、数字、-和_，必须以汉字、字母或数字开头" size="mini"></el-input>
              </el-form-item>
              <el-form-item label="标识符" prop="key" :key="42">
                <el-input v-model="editParamForm.key" placeholder="支持字母、数字和_，必须以字母开头" size="mini"></el-input>
              </el-form-item>
              <el-form-item label="数据类型" prop="dataType">
                <el-select v-model="editParamForm.dataType" placeholder="请选择数据类型" size="mini" @change="dataTypeChange(editParamForm.dataType,1)">
                  <el-option
                    v-for="item in addData_type"
                    :key="item.typeId"
                    :label="item.type"
                    :value="item.typeId"
                  >
                  </el-option>
                </el-select>
              </el-form-item>

              <!-- 选择不同的数据类型---整数型 -->
              <div class="typeCon" v-if="editParamForm.dataType == '1'">
                <el-form-item label="取值范围" class="formItem" prop="maxAndmin" >
                  <el-input v-model="editParamForm.scheme.min" maxlength="11" placeholder="最小值" size="mini"></el-input>
                  <span>-</span>
                  <el-input v-model="editParamForm.scheme.max" maxlength="11" placeholder="最大值" size="mini"></el-input>
                  <el-popover
                  	style="margin-left: -485px;float:left"
                    placement="top"
                    width="300"
                    trigger="hover"
                    content="最大值必须大于最小值，支持整数，取值范围：-2147483648 ~ 2147483647">
                    <i class="el-icon-warning" style="color:#D8D8D8;" slot="reference"></i>
                  </el-popover>
                </el-form-item>

                <el-form-item label="步长" prop="stepValidate" >
                  <el-input v-model="editParamForm.scheme.step" maxlength="10" placeholder="支持正整数，步长不能大于取值范围的差值" size="mini"></el-input>
                </el-form-item>
                <el-form-item label="单位" required :rules="[{required: true, message: '请选择单位', trigger: 'blur'}]">
                  <el-select v-model="editParamForm.scheme.unit" placeholder="请选择单位" size="mini">
                    <el-option
                      v-for="item in unit_list"
                      :key="item.id"
                      :label="item.value"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="" prop="scheme.unitName" v-if="editParamForm.scheme.unit == '自定义'" :rules="[{required: true, message: '1-30个字符', pattern: /^.{1,30}$/ , trigger: 'blur'}]">
                  <el-input v-model="editParamForm.scheme.unitName" placeholder="1-30个字符" size="mini"></el-input>
                </el-form-item>
              </div>

              <!-- 选择不同的数据类型---浮点型 -->
              <div class="typeCon" v-if="editParamForm.dataType == '6'">
                <el-form-item label="取值范围" class="formItem" prop="maxAndmin" >
                  <el-input v-model="editParamForm.scheme.min" placeholder="最小值" maxlength="17" size="mini"></el-input>
                  <span>-</span>
                  <el-input v-model="editParamForm.scheme.max" placeholder="最大值" maxlength="17" size="mini"></el-input>
                  <el-popover
                  	style="margin-left: -485px;float:left"
                    placement="top"
                    width="300"
                    trigger="hover"
                    content="最大值必须大于最小值，支持小数点后五位，整数支持10位">
                    <i class="el-icon-warning" style="color:#D8D8D8;" slot="reference"></i>
                  </el-popover>
                </el-form-item>

                <el-form-item label="步长" prop="stepValidate" >
                  <el-input v-model="editParamForm.scheme.step" maxlength="16" placeholder="支持正数，小数点后五位，整数位支持10位，步长不能大于取值范围的差值" size="mini"></el-input>
                </el-form-item>
                <el-form-item label="单位" required :rules="[{required: true, message: '请选择单位', trigger: 'blur'}]">
                  <el-select v-model="editParamForm.scheme.unit" placeholder="请选择单位" size="mini">
                    <el-option
                      v-for="item in unit_list"
                      :key="item.id"
                      :label="item.value"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="" prop="scheme.unitName" v-if="editParamForm.scheme.unit == '自定义'" :rules="[{required: true, message: '1-30个字符', pattern: /^.{1,30}$/ , trigger: 'blur'}]">
                  <el-input v-model="editParamForm.scheme.unitName" placeholder="1-30个字符" size="mini"></el-input>
                </el-form-item>
              </div>

              <!-- 选择不同的数据类型---枚举项 -->
              <div class="typeCon boolean" v-else-if="editParamForm.dataType == '2'">
                <el-form-item label="枚举项" class="formItem blank-line">
                  <span class="name">参数值</span>
                  <span class="name">参数描述</span>
                </el-form-item>
                <template v-for="(item,index) in  editParamForm.scheme.enumList">
                  <el-form-item class="formItem boolean-line" :key="index">
                      <el-form-item :prop="'scheme.enumList.' + index + '.value'" :rules="[{required: true, validator: validateEnumListValue, trigger: 'blur'}]">
                        <el-input v-model="item.value" placeholder="1-30个字符" size="mini" @keyup.native="listenBooleanChange(1)"></el-input>
                        <span class="error" v-if="item.isValueError">{{item.valueError}}</span>
                      </el-form-item>
                      <span>-</span>
                      <el-form-item :prop="'scheme.enumList.' + index + '.name'" :rules="[{required: true, validator: validateEnumListName, trigger: 'blur'}]">
                        <el-input v-model="item.name" placeholder="1-20个字符" size="mini" @keyup.native="listenBooleanChange(1)"></el-input>
                        <span class="error" v-if="item.isNameError">{{item.nameError}}</span>
                      </el-form-item>
                      <el-popover
                        placement="top"
                        width="180"
                        v-model="item.isDelete">
                        <p>是否确认删除该枚举项？</p>
                        <div style="text-align: right; margin: 5px 0 0 0;">
                          <el-button size="mini" type="text" @click="item.isDelete = false">取消</el-button>
                          <el-button type="primary" size="mini" @click="deleteEnumList(index,1);item.isDelete = false;">确定</el-button>
                        </div>
                        <i class="el-icon-circle-close" slot="reference"></i>
                      </el-popover>
                  </el-form-item>
                </template>
                <el-form-item>
                  <el-button type="primary" icon="el-icon-plus" size="mini" @click="addEnumList(1);">添加枚举项</el-button>
                </el-form-item>
              </div>

              <!-- 选择不同的数据类型---布尔型 -->
              <div class="typeCon" v-if="editParamForm.dataType == '3'">
                <el-form-item label="布尔值" class="formItem bolean" prop="booleanValue">
                  <span>false-</span><el-input v-model="editParamForm.scheme.negative" placeholder="必须以汉字、字母、数字开头" size="mini"></el-input>
                  <span>true-</span><el-input v-model="editParamForm.scheme.positive" placeholder="必须以汉字、字母、数字开头" size="mini"></el-input>
                </el-form-item>
              </div>
              <!-- 选择不同的数据类型---字符串 -->
              <div class="typeCon" v-if="editParamForm.dataType == '4'">
                <el-form-item label="数据长度" prop="length">
                  <el-input v-model="editParamForm.scheme.maxLength" placeholder="支持最小值为1，最大值为2048，整数型不能有小数位" size="mini"><template slot="suffix">字节</template></el-input>
                </el-form-item>
              </div>

              <!-- 选择不同的数据类型---数组 -->
              <div class="typeCon" v-if="editParamForm.dataType == '5'">
                <el-form-item label="元素类型" prop="scheme.arrayDataType" >
                  <el-radio-group v-model="editParamForm.scheme.arrayDataType">
                    <el-radio :label="1">整数型</el-radio>
                    <el-radio :label="2">浮点型</el-radio>
                    <el-radio :label="3">字符串</el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>
              <!-- 选择不同的数据类型--- 常量 -->
              <div class="typeCon" v-if="editParamForm.dataType == '7'">
                <el-form-item label="值" prop="scheme.constant">
                  <el-input v-model.trim="editParamForm.scheme.constant" size="mini"></el-input>
                </el-form-item>
                <p class="text-area-tip">字符串类型的常量前后使用""，数组类型需要使用[]，例："notify"， [ "oic.r.light.dimming" ]</p>
              </div>
              <!-- 选择不同的数据类型---布尔型(数字) -->
              <div class="typeCon" v-if="editParamForm.dataType == '8'">
                <el-form-item label="布尔值(数字)" class="formItem bolean" prop="booleanValue">
                  <span>0-</span><el-input v-model="editParamForm.scheme.negative" placeholder="必须以汉字、字母、数字开头" size="mini"></el-input>
                  <span>1-</span><el-input v-model="editParamForm.scheme.positive" placeholder="必须以汉字、字母、数字开头" size="mini"></el-input>
                </el-form-item>
              </div>
            </el-form>
          </div>
        </div>
      </el-scrollbar>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addParamClose">取 消</el-button>
        <el-button
          type="primary"
          @click="addParamConfirm"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  selectDataTypeList,		//获取数据类型接口
  selectTimeType,				//时间类型接口 暂时没用
  addModelProperty,			//新增属性接口
  addModelAbility,			//新增能力接口
  addModelEvent,				//新增事件接口
  getDeliveryType,			//事件推送至接口
  getEventType					//事件类型接口
} from "../../api/api.js";
export default {
  props: {
    show: {
      type: Boolean,
      default: true
    },
    id: {
      type: Number,
    }
  },
  data () {
    return {
      addUserDefineFunctionVisible: this.show,	//是否显示该组件
      messageTemplate:'',		//能力消息格式
      messageTemplate1: '如果标识符在该类设备上报的消息中唯一，无需启用筛选条件。 启用筛选条件后，平台将根据筛选条件确定标识符在消息中的位置。筛选条件格式为："[条件标识符]"：[条件]，。可添加多个条件，如："objId": 1, "name" : "CO",',
      msgTemplate1: '增加的参数将添加到contents中，如标识符为rt，数据类型为常量[ "oic.r.switch.binary" ]，添加后显示contents[{"rt" : [ "oic.r.switch.binary" ], }]',
      toggleTipVisible:false, // 切换提示弹框
      addParamVisible: false, // 新增参数弹框
      isEdit: false,  // 是否为编辑参数
      editIndex: null,		//编辑参数下标
      activeName:0, 	// 切换弹框下标
      active:0,			//切换按钮下标
      tablist:['属性','能力','事件'],	//切换按钮内容
      userUnit: '', // 自定义单位
      templateMsgBody:{		//能力消息格式
        "cts":"",
        "msgType":'notfiy',
        "postman":'',
        "from":'',
        "to":'',
        "ntfTp": 1,
        "trigger": {
        	"objId":'',
        	"name":''
        },
        "contents": [
        {

        }
       ]
      },
      abilityParameterBody:{	//能力上送字段msgTemplate

      },
      addUserSetting:{  // 添加自定义功能-属性
        propertyName: "",
        modelTypeId: this.id,
        key: "",
        dataType: null,
        description: "",
        gatherType: 1,
        duration: null,
        durationUnit: 1,
        scheme: {},
        openFilter: false,
        filter: '',
        filterInput: false
      },
      addAbilityForm: { // 添加自定义功能-能力
        modelTypeId: this.id,
        abilityName: '',
        key: '',
        msgTemplate: JSON.stringify(this.abilityParameterBody),
        description: '',
        parameters: [
        ]
      },
      addEventForm: { // 添加自定义功能-事件
        modelTypeId: this.id,
        eventName: '',
        key: '',
        eventType: 1,
        deliveryType: 1,
        deliveryAddress: '',
        description: '',
        openFilter: false,
        filter: '',
        filterInput: false
      },
      editParamForm: {  // 新增和编辑参数
        propertyName: "",
        key: "",
        dataType: null,
        scheme: {},
      },
      addUserSettingRule:{		//属性验证规则
        propertyName: [		//功能名称
          {
            pattern: /^[a-zA-Z0-9\u4e00-\u9fa5][a-zA-Z0-9\u4e00-\u9fa5\-\_]{0,49}$/,
            required: true,
            message: "1-50个字符(支持汉字、字母、数字、-和_，必须以汉字、字母或数字开头)",
            trigger: "blur"
          }
        ],
        key: [		 //标识符
          {
            pattern: /^[a-zA-Z][a-zA-Z0-9\_]{0,49}$/,
            required: true,
            message: "1-50个字符(支持字母、数字和_、必须以字母开头)",
            trigger: "blur"
          }
        ],
        dataType: [		//数据类型
          {
            required: true,
            message: "请选择数据类型",
            trigger: "change"
          }
        ],
        scheme:{		//数据类型内验证
          arrayDataType: [{		//数组验证
              required: true,
          }],
          stepValidate: [{		//步长
            required: true,
            validator: this.validateStep,
            trigger: 'blur'
          }],
          maxAndmin: [{		//取值范围
            required: true,
            validator: this.validateMaxOrMin,
            trigger: 'blur'
          }]
        },
        gatherType: [
          {
            required: true,
            trigger: 'blur'
          }
        ],
        duration: [
          {
            message: "请填写时长!",
          }
        ],
        durationUnit: [
          {
          }
        ],
        booleanValue: [{	//boolean验证规则
          required: true,
          validator: this.validateBoolean,
          trigger: 'blur'
        }],
        length:[{		//数据长度
          required: true,
          validator: this.validateLength,
          trigger: 'blur'
        }]
      },
      addAbilityFormRule: {		//能力验证规则
        abilityName: [{		//功能名称
            pattern: /^[a-zA-Z0-9\u4e00-\u9fa5][a-zA-Z0-9\u4e00-\u9fa5\-\_]{0,49}$/,
            required: true,
            message: "1-50个字符(支持汉字、字母、数字、-和_，必须以汉字、字母或数字开头)",
            trigger: "blur"
        }],
        key: [{		//标识符
            pattern: /^[a-zA-Z][a-zA-Z0-9\_]{0,49}$/,
            required: true,
            message: "1-50个字符(支持字母、数字和_、必须以字母开头)",
            trigger: "blur"
        }],
      },
      addEventFormRule: {		//事件验证规则
        eventName: [{		//功能名称
            pattern: /^[a-zA-Z0-9\u4e00-\u9fa5][a-zA-Z0-9\u4e00-\u9fa5\-\_]{0,49}$/,
            required: true,
            message: "1-50个字符(支持汉字、字母、数字、-和_，必须以汉字、字母或数字开头)",
            trigger: "blur"
        }],
        key: [{		//标识符
            pattern: /^[a-zA-Z][a-zA-Z0-9\_]{0,49}$/,
            required: true,
            message: "1-50个字符(支持字母、数字和_、必须以字母开头)",
            trigger: "blur"
        }],
        eventType: [{		//事件类型
          required: true,
        }],
        deliveryAddress: [{		//推送至 手动添加
          required: true,
          validator: this.validateAddress,
          trigger: "blur"
        }]
      },
      editParamFormRule: {		//新增参数和编辑参数验证规则
        propertyName: [{		//参数名称
            pattern: /^[a-zA-Z0-9\u4e00-\u9fa5][a-zA-Z0-9\u4e00-\u9fa5\-\_]{0,49}$/,
            required: true,
            message: "1-50个字符(支持汉字、字母、数字、-和_，必须以汉字、字母或数字开头)",
            trigger: "blur"
        }],
        key: [{		//标识符
            pattern: /^[a-zA-Z][a-zA-Z0-9\_]{0,49}$/,
            required: true,
            message: "1-50个字符(支持字母、数字和_、必须以字母开头)",
            trigger: "blur"
        }],
        dataType: [{		//数据类型
          required: true,
          message: "请选择数据类型",
        }],
        scheme:{
          arrayDataType: [{		//数组
            required: true,
            message: "请选择数据类型",
          }],
          constant: [{		//常量
            required: true,
            message: "请填写常量值",
          }],
        },
        maxAndmin: [{		//取值范围
          required: true,
          validator: this.validateMaxOrMin,
          trigger: 'blur'
        }],
        stepValidate: [{		//步长
          required: true,
          validator: this.validateStep,
          trigger: 'blur'
        }],
        booleanValue: [{		//布尔值
          required: true,
          validator: this.validateBoolean,
          trigger: 'blur'
        }],
        length:[{		//数据长度
          required: true,
          validator: this.validateLength,
          trigger: 'blur'
        }]
      },
      data_type:[], // 数据类型
      addData_type: [], // 新增参数和编辑参数的数据类型
      data_type_item: [{		//清空参数值
        id: 1,
        scheme: {
          "max": null,
          "min": null,
          "step": null,
          "unit": '无',
          "unitName": null
        }
      },{
        id: 2,
        scheme: {
          "enumList": [{
            "name": "",
            "value": null
          }]
        }
      },{
        id: 3,
        scheme: {
          "positive": "",
          "negative": ""
        }
      },{
        id: 4,
        scheme: {
          "maxLength":null,
          "minLength":1
        }
      },{
        id: 5,
        scheme: {
          "arrayDataType": 1
        }
      },{
        id: 6,
        scheme: {
          "max": null,
          "min": null,
          "step": null,
          "unit": "无",
          "unitName": null
        }
      },{
        id: 7,
        scheme: {
          "constant": null
        }
      },{
        id: 8,
        scheme: {
          "positive": "",
          "negative": ""
        }
      }],
      time_list: [],  // 时间类型下拉框
      deliverTypeArr: [], // 推送类型
      eventTypeArr: [], // 事件类型
      unit_list: require('../../../static/unit.json'),  // 单位列表

    }
  },
  created() {
  },
  mounted() {
    this.getDataTypeList(false);
    this.abilityParameterBody = JSON.parse(JSON.stringify(this.templateMsgBody));
    this.messageTemplate = JSON.stringify(this.abilityParameterBody,null,4);
  },
  methods: {
  	//筛选条件
  	openFilterBox(value) {
  			if(!value) {
  					this.addUserSetting.filter = "";
  			}
  	},
  	filterInput() {
  		if(this.addUserSetting.openFilter) {
  				if(this.addUserSetting.filter.length>1000 || !this.addUserSetting.filter) {
  						this.addUserSetting.filterInput = true;
  				}else {
  						this.addUserSetting.filterInput = false;
  				}
  		}else {
  				this.addUserSetting.filterInput = false;
  		}
  	},
  	openFilterBox1(value) {
  			if(!value) {
  					this.addEventForm.filter = "";
  			}
  	},
  	filterInput1() {
  		if(this.addEventForm.openFilter) {
  				if(this.addEventForm.filter.length>1000 || !this.addEventForm.filter) {
  						this.addEventForm.filterInput = true;
  				}else {
  						this.addEventForm.filterInput = false;
  				}
  		}else {
  				this.addEventForm.filterInput = false;
  		}
  	},
		//是否切换属性能力事件
		sureSwitch() {
				this.toggleTipVisible = false;
				this.activeName = this.active;
				this.$set(this.addUserSetting, 'filterInput', false)
				this.$set(this.addUserSetting, 'openFilter', false)
				this.$set(this.addUserSetting, 'filter', '')
				this.$set(this.addEventForm, 'filterInput', false)
				this.$set(this.addEventForm, 'openFilter', false)
				this.$set(this.addEventForm, 'filter', '')
		},
    // 属性---------------
    // 添加枚举类项
    addEnumList(type) {
      let enumList;
      if(type == 0){
        enumList = JSON.parse(JSON.stringify(this.addUserSetting.scheme.enumList));
        if(enumList.length >= 25){
          this.$message.error('最多可添加25条枚举项!');
          return;
        }
        this.$set(this.addUserSetting.scheme, 'enumList',[...enumList,{"name": "","value": null}])
      }else{
        enumList = JSON.parse(JSON.stringify(this.editParamForm.scheme.enumList));
        if(enumList.length >= 25){
          this.$message.error('最多可添加25条枚举项!');
          return;
        }
        this.$set(this.editParamForm.scheme, 'enumList',[...enumList,{"name": "","value": null}])
      }
    },
    // 删除枚举类型
    deleteEnumList(index,type){
      if(type == 0){
        let enumList = JSON.parse(JSON.stringify(this.addUserSetting.scheme.enumList));
        if(enumList.length == 1){
          this.$message.error('枚举项至少一个!');
          return;
        }else{
          enumList.splice(index,1);
          this.$set(this.addUserSetting.scheme, 'enumList',enumList);
        }
      }else{
        let enumList = JSON.parse(JSON.stringify(this.editParamForm.scheme.enumList));
        if(enumList.length == 1){
          this.$message.error('枚举项至少一个!');
          return;
        }else{
          enumList.splice(index,1)
          this.$set(this.editParamForm.scheme, 'enumList',enumList);
        }
      }
    },

    // 获取数据类型下拉框和时间类型下拉框
    getDataTypeList(type){
      selectDataTypeList({type: type}).then(res => {
        console.log(11111,res)
        this.data_type = res.data.data;
      })
      // 时间类型
      selectTimeType().then(res => {
        this.time_list = res.data.data;
      })
      // 推送类型
      getDeliveryType().then(res => {
        this.deliverTypeArr = res.data.data;
      })
      // 事件类型
      getEventType().then(res => {
        this.eventTypeArr = res.data.data;
      })
    },

    // 选择数据类型
    dataTypeChange (val,type) {
      let self = this;
      if(type == 0){
        this.$refs['addUserSetting'].clearValidate();
        this.data_type_item.forEach(item => {
          if(item.id == val){
            this.$set(this.addUserSetting, 'scheme',JSON.parse(JSON.stringify(item.scheme)))
          }
        })
      }else{
        this.$refs['editParamForm'].clearValidate();
        this.data_type_item.forEach(item => {
          if(item.id == val){
            this.$set(this.editParamForm, 'scheme',JSON.parse(JSON.stringify(item.scheme)))
          }
        })
      }
    },

    // 切换时间类型
    timeTypeChange(command) {
      this.$set(this.addUserSetting.scheme, 'durationUnit' ,command)
    },

    // 关闭自定义弹框
    dialogClose() {
      this.$confirm('是否放弃编辑?' ,{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showClose:false,
      }).then(() => {
        this.$emit('dialogClose', true);
      }).catch(() => {});
    },

    // 确定提交
    UserDefinedFunctionPost() {
      if(this.activeName == 0){
        // 自定义单位的替换
      	this.filterInput()
      	let select = false;
      	if(this.addUserSetting.openFilter) {
      			if(this.addUserSetting.filterInput) {
      				select = false;
      			}else {
      				select = true;
      			}
      	}else {
      			select = true;
      	}
        this.$refs['addUserSetting'].validate(valid => {
          if (valid && select) {
          	let settingParams = {...this.addUserSetting};
          	if(this.addUserSetting.openFilter) {
		      			settingParams.openFilter = '1'
		      	}else {
		      			settingParams.openFilter = '0'
		      			delete settingParams.filter;
		      	}
            if(this.addUserSetting.dataType == 1 || this.addUserSetting.dataType == 6){
              let unit = this.addUserSetting.scheme.unit;
              let unitName = this.addUserSetting.scheme.unitName;
              if(unit && unit == "自定义" && unitName){
                let unitName = this.addUserSetting.scheme.unitName;
                this.$set(this.addUserSetting.scheme,'unit',unitName)
              }
            }
            if(this.addUserSetting.dataType == 2){
              if(!this.listenBooleanValue(0)) return;
            }
            addModelProperty(settingParams).then(res => {
              if(res.err_CODE == 0){
                this.$message.success(res.err_MESSAGE);
                this.$emit('dialogClose', true);
              }else{
                this.$message.error(res.err_MESSAGE);
              }
            })
          } else {
            return false;
          }
        });
      }else if(this.activeName == 1){
        this.$refs['addAbilityForm'].validate(valid => {
          if (valid) {
            this.addAbilityForm.msgTemplate = JSON.stringify(this.abilityParameterBody);
						let abilityParams = {...this.addAbilityForm};
            addModelAbility(abilityParams).then(res => {
              if(res.err_CODE == 0){
                this.$message.success(res.err_MESSAGE);
                this.$emit('dialogClose', true);
              }else{
                this.$message.error(res.err_MESSAGE);
              }
            })
          } else {
            return false;
          }
        });
      }else{
      	this.filterInput1()
      	let select = false;
      	if(this.addEventForm.openFilter) {
      			if(this.addEventForm.filterInput) {
      				select = false;
      			}else {
      				select = true;
      			}
      	}else {
      			select = true;
      	}
        this.$refs['addEventForm'].validate(valid => {
          if (valid && select) {
		      	let eventParams = {...this.addEventForm};
          	if(this.addEventForm.openFilter) {
		      			eventParams.openFilter = '1'
		      	}else {
		      			eventParams.openFilter = '0'
		      			delete eventParams.filter;
		      	}

            addModelEvent(eventParams).then(res => {
              if(res.err_CODE == 0){
                this.$message.success(res.err_MESSAGE);
                this.$emit('dialogClose', true);
              }else{
                this.$message.error(res.err_MESSAGE);
              }
            })
          } else {
            return false;
          }
        });
      }
    },

    //输入清除重复验证信息
    listenBooleanChange(type){
      if(type == 0){
        let enumList = JSON.parse(JSON.stringify(this.addUserSetting.scheme.enumList));
        for(let i = 0;i < enumList.length;i++){
          this.$set(this.addUserSetting.scheme.enumList[i],'isValueError', false);
          this.$set(this.addUserSetting.scheme.enumList[i],'isNameError', false);
        }
      }else{
        let enumList = JSON.parse(JSON.stringify(this.editParamForm.scheme.enumList));
        for(let i = 0;i < enumList.length;i++){
          this.$set(this.editParamForm.scheme.enumList[i],'isValueError', false);
          this.$set(this.editParamForm.scheme.enumList[i],'isNameError', false);
        }
      }
    },

    // 验证枚举类重复
    listenBooleanValue(type){
      let flag;
      if(type == 0){
        let enumList = JSON.parse(JSON.stringify(this.addUserSetting.scheme.enumList));
        const reg = /^-?[1-9]\d{0,1}$/;
        flag = true;
        for(let i = 0;i < enumList.length;i++){
          this.$set(this.addUserSetting.scheme.enumList[i],'isValueError', false);
          this.$set(this.addUserSetting.scheme.enumList[i],'isNameError', false);
        }
        for(let i = 0;i < enumList.length; i++){
          for(let j = i + 1; j < enumList.length;j++){
            if(enumList[i].value == enumList[j].value){
              flag = false;
              this.$set(this.addUserSetting.scheme.enumList[i],'isValueError', true);
              this.$set(this.addUserSetting.scheme.enumList[i],'valueError', '参数值不能相同');
              this.$set(this.addUserSetting.scheme.enumList[j],'isValueError', true);
              this.$set(this.addUserSetting.scheme.enumList[j],'valueError', '参数值不能相同');
            }
            if(enumList[i].name == enumList[j].name){
              flag = false;
              this.$set(this.addUserSetting.scheme.enumList[i],'isNameError', true);
              this.$set(this.addUserSetting.scheme.enumList[i],'nameError', '参数描述不能相同');
              this.$set(this.addUserSetting.scheme.enumList[j],'isNameError', true);
              this.$set(this.addUserSetting.scheme.enumList[j],'nameError', '参数描述不能相同');
            }
          }
        }
        return flag;
      }else{
        let enumList = JSON.parse(JSON.stringify(this.editParamForm.scheme.enumList));
        const reg = /^-?[1-9]\d{0,1}$/;
        flag = true;
        for(let i = 0;i < enumList.length;i++){
          this.$set(this.editParamForm.scheme.enumList[i],'isValueError', false);
          this.$set(this.editParamForm.scheme.enumList[i],'isNameError', false);
        }
        for(let i = 0;i < enumList.length; i++){
          for(let j = i + 1; j < enumList.length;j++){
            if(enumList[i].value == enumList[j].value){
              flag = false;
              this.$set(this.editParamForm.scheme.enumList[i],'isValueError', true);
              this.$set(this.editParamForm.scheme.enumList[i],'valueError', '参数值不能相同');
              this.$set(this.editParamForm.scheme.enumList[j],'isValueError', true);
              this.$set(this.editParamForm.scheme.enumList[j],'valueError', '参数值不能相同');
            }
            if(enumList[i].name == enumList[j].name){
              flag = false;
              this.$set(this.editParamForm.scheme.enumList[i],'isNameError', true);
              this.$set(this.editParamForm.scheme.enumList[i],'nameError', '参数描述不能相同');
              this.$set(this.editParamForm.scheme.enumList[j],'isNameError', true);
              this.$set(this.editParamForm.scheme.enumList[j],'nameError', '参数描述不能相同');
            }
          }
        }
      }
      return flag;
    },

    // tab 切换
    selectType(index){
      this.toggleTipVisible = true;
      this.active = index;
      this.$nextTick(function(){
        let addUserSetting = {
          propertyName: "",
          modelTypeId: this.id,
          key: "",
          dataType: null,
          description: "",
          gatherType: 1,
          duration: null,
          durationUnit: 1,
          scheme: {},
        };
        let addAbilityForm = {
          modelTypeId: this.id,
          abilityName: '',
          key: '',
          msgTemplate: JSON.stringify(this.abilityParameterBody),
          description: '',
          parameters: [
          ]
        };
        let addEventForm = {
          modelTypeId: this.id,
          eventName: '',
          key: '',
          eventType: 1,
          deliveryType: 1,
          deliveryAddress: '',
          description: ''
        };
        if(this.active == 0){
          this.addUserSetting = addUserSetting;
          if(this.$refs['addUserSetting']) this.$refs['addUserSetting'].resetFields();
        }else if(this.active == 1){
          this.addAbilityForm = addAbilityForm;
          if(this.$refs['addAbilityForm']) this.$refs['addAbilityForm'].resetFields();
        }else if(this.active == 2){
          this.addEventForm = addEventForm;
          if(this.$refs['addEventForm']) this.$refs['addEventForm'].resetFields();
        }
      })
    },


    // 能力-------------
    // 打开新增参数框
    addChildAblity(index) {
      this.$nextTick(function(){
        if(this.$refs['editParamForm'])this.$refs['editParamForm'].resetFields();
      })
      // 新增参数
      if(index == null){
        let parameters = JSON.parse(JSON.stringify(this.addAbilityForm.parameters));
        if(parameters.length >= 25){
          this.$message.error('最多可增加25条参数!');
          return;
        }
        this.isEdit = false;
        this.addParamVisible = true;
        selectDataTypeList({type: true}).then(res => {
          this.addData_type = res.data.data;
        })
      }else{
        // 编辑参数
        this.isEdit = true;
        this.editIndex = index;
        this.addParamVisible = true;
        let parameters = JSON.parse(JSON.stringify(this.addAbilityForm.parameters));
        this.editParamForm = {
          propertyName: parameters[index].parameterName,
          key: parameters[index].key,
          dataType: parameters[index].dataType,
          scheme: parameters[index].scheme
        }
      }
    },

    // 确定新增参数
    addParamConfirm() {
      if(this.editParamForm.dataType == 1 || this.editParamForm.dataType == 6){
        // 替换自定义单位
        let unit = this.editParamForm.scheme.unit;
        let unitName = this.editParamForm.scheme.unitName;

        if(unit && unit == "自定义" && unitName){
          let unitName = this.editParamForm.scheme.unitName;
          this.$set(this.editParamForm.scheme,'unit',unitName)
        }
      }

      if(this.editParamForm.dataType == 7){
        var constantValid = true;
        try{
          var result = JSON.parse(this.editParamForm.scheme.constant);

        }catch(err){
          constantValid = false;

        }

        if(!constantValid){

          this.$message.error('常量值必须为合法的JSON字符串');
          return;
        }
      }
      // 新增
      if(!this.isEdit){
        this.$refs['editParamForm'].validate(valid => {
          if (valid) {
            if(this.editParamForm.dataType == 2){
              if(!this.listenBooleanValue(1)) return;
            }
            let parameters = JSON.parse(JSON.stringify(this.addAbilityForm.parameters));
            let child = {
              dataType: this.editParamForm.dataType,
              key: this.editParamForm.key,
              parameterName: this.editParamForm.propertyName,
              scheme: JSON.parse(JSON.stringify(this.editParamForm.scheme))
            }

            if(this.templateMsgBody[this.editParamForm.key] !== undefined){
              this.$message.error("参数名称已存在!")
              return;
            }
            for(let i = 0;i < parameters.length;i++){
              if(parameters[i].parameterName == child.parameterName){
                this.$message.error("参数名称已存在!")
                return;
              }else if(parameters[i].key == child.key){
                this.$message.error("标识符已存在!")
                return;
              }
            }

            this.$set(this.addAbilityForm,'parameters',[...parameters,child]);
            this.addParamVisible = false;
          } else {
            return false;
          }
        });
      }else{
        this.$refs['editParamForm'].validate(valid => {
          if (valid) {
            if(this.editParamForm.dataType == 2){
              if(!this.listenBooleanValue(1)) return;
            }
            let index = this.editIndex;
            let parameters = JSON.parse(JSON.stringify(this.addAbilityForm.parameters));
            parameters[index] = {
              dataType: this.editParamForm.dataType,
              key: this.editParamForm.key,
              parameterName: this.editParamForm.propertyName,
              scheme: JSON.parse(JSON.stringify(this.editParamForm.scheme))
            };
            if(this.templateMsgBody[this.editParamForm.key] !== undefined){
              this.$message.error("标识符名称已存在!")
              return;
            }
            for(let i = 0;i < parameters.length;i++){
              if(i !== index && parameters[i].parameterName == parameters[index].parameterName){
                this.$message.error("参数名称已存在!")
                return;
              }else if(i !== index && parameters[i].key == parameters[index].key){
                this.$message.error("标识符已存在!")
                return;
              }
            }
            this.$set(this.addAbilityForm,'parameters',[...parameters]);
            this.addParamVisible = false;
          } else {
            return false;
          }
        });
      }
    },

    // 删除参数
    deletParam(index) {
      this.addAbilityForm.parameters.splice(index, 1);
    },

    // 关闭新增参数
    addParamClose() {
      this.$confirm('是否放弃编辑?' ,{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showClose:false,
      }).then(() => {
        this.addParamVisible = false;
        setTimeout(() => {
          this.$nextTick(function(){
            this.$refs['editParamForm'].resetFields();
          })
        }, 500);
      }).catch(() => {});
    },

    // 生成换行显示
    getWrapText(text){
      let arr = []
      for(let i = 0;i < text.length;i++){
        if(text[i] == "," || text[i] == "{"){
          arr.push(text[i] + '\n');
        }else if(text[i] == "}"){
          arr.push('\n' + text[i]);
        }else{
          arr.push(text[i]);
        }
      }
      return arr.join('');
    },

    // 验证方法
    validateMaxOrMin(rule,value,callback) {  // 验证最大值和最小值
      let dataType,min,max;
      if(this.active == 0){
        dataType = this.addUserSetting.dataType;
        min = this.addUserSetting.scheme.min;
        max = this.addUserSetting.scheme.max;
      }else if(this.active == 1){
        dataType = this.editParamForm.dataType;
        min = this.editParamForm.scheme.min;
        max = this.editParamForm.scheme.max;
      }
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
    },
    validateStep(rule,value,callback){  // 验证步长
      let dataType,min,max,step;
      if(this.active == 0){
        dataType = this.addUserSetting.dataType;
        min = this.addUserSetting.scheme.min;
        max = this.addUserSetting.scheme.max;
        step = this.addUserSetting.scheme.step;

      }else{
        dataType = this.editParamForm.dataType;
        min = this.editParamForm.scheme.min;
        max = this.editParamForm.scheme.max;
        step = this.editParamForm.scheme.step;
      }
      if(dataType == 1){
        const reg =  /^-?\d+$/;
        if(!isNaN(step) && reg.test(step) && step > 0 && step <= 2147483647){
          if(max - min < step){
            return callback(new Error('支持正整数，步长不能大于取值范围的差值'));
          }else{
            callback();
          }
        }else{
          return callback(new Error('支持正整数，步长不能大于取值范围的差值'));
        }
      }else{
        const reg = /^(([0-9][0-9]{0,9})|(([0]\.\d{1,5}|[1-9][0-9]{0,9}\.\d{1,5})))$/ ;
        if(reg.test(step) && !isNaN(step) && step > 0){
          if(max - min < step){
            return callback(new Error('支持正数，小数点后五位，整数位支持10位，步长不能大于取值范围的差值'));
          }else{
            callback();
          }
        }else{
          return callback(new Error('支持正数，小数点后五位，整数位支持10位，步长不能大于取值范围的差值'));
        }
      }
    },

    // 验证枚举项value
    validateEnumListValue(rule,value,callback){
      const reg = /^[\s\S]{1,30}$/;
      if(this.active == 0){
        if(value && value.length>=1 && value.length <=30){
          callback();
        }else{
          return callback(new Error('1-30个字符'));
        }
      }else{
        if(value && value.length>=1 && value.length <=30 ){
          callback();
        }else{
          return callback(new Error('1-30个字符'));
        }
      }
    },

    // 验证枚举项name
    validateEnumListName(rule,value,callback){
      let enumList = this.addUserSetting.scheme.enumList;
      const reg = /^[\s\S]{1,20}$/;
      if(this.active == 0){
        if(value && value.length>=1 && value.length <=20){
          callback();
        }else{
          return callback(new Error('1-20个字符'));
        }
      }else{
        if(value && value.length>=1 && value.length <=20 ){
          callback();
        }else{
          return callback(new Error('1-20个字符'));
        }
      }
    },

    // 验证布尔类型
    validateBoolean(rule,value,callback){  // 验证枚举项name
      let negative, positive;
      if(this.active == 0){
        negative = this.addUserSetting.scheme.negative;
        positive = this.addUserSetting.scheme.positive;
      }else{
        negative = this.editParamForm.scheme.negative;
        positive = this.editParamForm.scheme.positive;
      }
      const reg = /^[a-zA-Z0-9\u4e00-\u9fa5].{0,9}$/;
      if(negative && reg.test(negative) && positive && reg.test(positive)){
        if(negative === positive){
          return callback(new Error('布尔值不能相同'));
        }else{
          callback();
        }
      }else{
        return callback(new Error('1-10个字符(必须以汉字、字母、数字开头)'));
      }
    },

    // 验证字符串长度
    validateLength(rule,value,callback){
      let maxLength;
      if(this.active == 0){
        maxLength = this.addUserSetting.scheme.maxLength;
      }else{
        maxLength = this.editParamForm.scheme.maxLength;
      }
      const reg = /^-?[1-9]\d*$/;
      if(maxLength && reg.test(maxLength) && !isNaN(maxLength) && maxLength  >=1 && maxLength <= 2048){
          callback();
      }else{
        return callback(new Error('支持最小值为1，最大值为2048，整数型不能有小数位'));
      }
    },
    // 验证url地址
    validateAddress(rule,value,callback){
      const reg =  /(https):\/\/([\w.]+\/?)\S*/;
      let deliveryType = this.addEventForm.deliveryType;
      let deliveryAddress = this.addEventForm.deliveryAddress;
      if(deliveryType == 3){
        if(reg.test(deliveryAddress)){
          callback();
        }else{
          return callback(new Error('请填写正确的URL地址'));
        }
      }else{
        callback();
      }
    }
  },
  watch: {
    show() {
      this.visible = this.show
    },
    addAbilityForm:{
      handler(value){
        this.abilityParameterBody = JSON.parse(JSON.stringify(this.templateMsgBody));
        this.addAbilityForm.parameters.forEach(param=>{
          var defaultValue ;
          switch(param.dataType){
            case 1:
            case 2:
              defaultValue = 0;
              break;
            case 3:
              defaultValue = false;
              break;
            case 4:
              defaultValue = '';
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
          // this.abilityParameterBody[param.key] = defaultValue;
          let keyName = param.key;
          this.abilityParameterBody.contents[0][keyName]=defaultValue;
        });
        this.messageTemplate = JSON.stringify(this.abilityParameterBody,null,4);
      },
      deep:true
    }
  },
}
</script>

<style lang="scss" scoped>
@import '../../styles/new-index.scss';
  #usersetting{
    .base-message{
      padding: 12px 14px;
      background: #1E2E4C;
      .base-title{
        .back{
          display:inline-block;
          width:60px;
          height:24px;
          border-radius:2px;
          color:#fff;
          text-align:center;
          margin-right:8px;
          .el-button {
            padding: 5px 8px;
            border-radius: 2px;
            font-size: 12px;
            color:#fff;
            background: #0FADFF;
            margin-right:12px;
            border:none;
          }
        }
        .name{
          display:inline-block;
          font-size:14px;
          font-weight:600;
          color:#fff;
        }
        .el-button {
          padding: 8px 20px;
          border-radius: 2px;
          font-size: 12px;
          background: #0FADFF;
          margin-right:12px;
        }
        .el-button:hover {
          background:rgba(15,173,255,0.8);
        }
      }
      .msg{
        padding: 15px 12px 10px 12px;
        p{
          font-size: 12px;
          color: #ffffff;
          margin-bottom: 10px;
          span{
            margin-right: 36px;
          }
        }
      }
    }
    .program-table{
      margin-top: 12px;
      padding: 12px 14px;
      background: #1E2E4C;
    }
    .action-list{
      margin-top: 12px;
      padding: 12px 14px;
      background: #1E2E4C;
    }
    // 公共头部
    .title{
      overflow: auto;
      .left{
        font-size: 14px;
        font-weight:500;
        float: left;
        color: #ffffff;
      }
      .el-button {
        padding: 8px 20px;
        border-radius: 2px;
        font-size: 12px;
        background: #0FADFF;
        margin-right:12px;
      }
      .el-button:hover {
        background:rgba(15,173,255,0.8);
      }
    }
    // 公共data
    .data{
      padding: 20px 10px;
    }

    // 添加自定义功能
    #addUserSettingDialog,.add-param,.edit-param{
      div{
        div.tabMenu{
          display: flex;
          flex-direction: row;
          margin-bottom: 15px;
          span{
            font-size: 12px;
            color: #323232;
            width:50px;
            height:30px;
            line-height:30px;
            text-align: center;
            border:1px solid #dcdfe6;
            cursor: pointer;
            i{
              font-style: normal;
            }
          }

          span:first-child{
            width:90px;
            text-align: left;
            border:none;
            background: none;
            cursor: none;
          }

          span:nth-child(3){
            border-left: none;
            border-right: none;
          }

          span:last-child{
            width: 30px;
            border:none;

            i{
              color:#D8D8D8;
               cursor: pointer;
            }
          }

          span.active{
            background: #AF7C58;
            border:1px solid #AF7C58;
            color:#fff;
          }
        }
        div.tabCon{
          #dateType{
            width:120px !important;
          }
          .text-area-tip{
            padding-left: 80px;
            color: #ADADAD;
            font-size: 12px;
            padding-bottom: 5px;
          }
          .typeCon{
            .formItem{
              .el-form-item__content{
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                .el-input{
                  width: 100px;
                  .el-input__inner{
                    width:100px !important;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
</style>

<style lang='scss'>
@import '../../styles/new-index.scss';
  #usersetting{
  	.err_border {
  			.el-textarea__inner {
		  			border-color:red;
		  	}
  	}
    .base-message{

    }
    .program-table{

    }
    .action-list{
      .el-button{
        border: none;
      }
    }
    // 公共table
    .el-table{
      background:transparent !important;
      th{
        background:#20385B;
        color:#fff;
        text-align:center;
        font-size:12px;
        border:none;
        border-right: 1px solid #1E2E4C;
      }
      tr{
        td{
          font-size:12px;
          color:#fff;
          background:$content-bgColor;
          border-bottom: $td-border;
          text-align: center;
          .txt_underline{
            color:$y-color;
            text-decoration: underline;
            cursor: pointer;
          }
        }
      }
    }
    .el-scrollbar {
      // height: 80%;
      .el-scrollbar__wrap {
        box-sizing:border-box;
        overflow-x: hidden;
        padding-right:5px;
      }
    }
    .add-standard{
      .type-select{
        .el-radio-group{
          width: 100%;
          .el-radio-button{
            border:none;
            .el-radio-button__inner{
              width: 198px;
            }
          }
        }
      }
    }
    //添加自定义功能
    #addUserSettingDialog, .add-param, #addUserSettingDialog .edit-param{
      height: 100%;
      .el-dialog__body{
        max-height: 540px;
        height: 540px;
        padding:10px 5px 10px 20px;
      }
      .el-scrollbar {
        height: 100%;
        .el-scrollbar__wrap {
          box-sizing:border-box;
          overflow-x: hidden;
          // padding-right:17px;
        }
      }
      .el-form {
        .el-form-item__error {
          padding-top: 0px;
          white-space: nowrap!important;
        }
        .messageIcon {
        		position: relative;
        		.iconSpan {
        				position: absolute;
						    left: -25px;
						    top: 0;
        		}
        }
        .formItemIcon {
        		position: relative;
        		padding-bottom: 10px;
        		.iconSpan {
        				position: absolute;
						    left: -20px;
						    top: 0;
        		}
        }
        .formItemInput {
        		position: relative;
        		padding-bottom: 10px;
        		.inputErr {
        				position: absolute;
						    left: 0px;
						    bottom: -33px;
						    color: #F56C6C;
						    font-size: 12px;
        		}
        		.iconSpan {
        				position: absolute;
						    left: -18px;
						    top: 0;
        		}
	        	.el-checkbox {
	    					position: absolute;
	            	left: -88px;
	    					top: 0px;
	        	}
	        	.el-form-item__label {
	        			margin-left: 10px!important;
	        			width: 70px!important;
	        	}
	        	.el-textarea__inner {
	        			background: #ffffff;
	        	}
        }
        .formItemLabelColor {
        		.el-form-item__label {
        				color: #ADADAD!important;
        		}
        }
        .el-form-item{
          .el-form-item__label{
            padding-left: 8px;
          }
          &.is-required {
            .el-form-item__label{
              padding-left: 0;
            }
          }
          &.frequency {
            .el-form-item__label{
              width: 100px!important;
            }
            .el-form-item__error{
              left: 250px;
            }
            .el-form-item__content{
              line-height: 30px!important;
            }
            .el-input{
              width: 175px;
            }
            #dateType{
              width: 175px;
              display:inline-block;
            }
            // 时间选择
            .time-select{
              display: inline-block;
              width: 55px;
              margin-left: -3px;
              height: 30px;
              margin:0;
              .el-input{
                width: 55px;
                .el-input__inner{
                  width: 55px;
                  padding: 0 3px;
                  background: #1E2E4C;
                  color: #ffffff;
                }
              }
            }
          }
        }
        .el-form-item__label {
          text-align:left;
        }
        .el-input{
          width: 485px;
        }
        .el-input__inner {
          width: 485px;
        }
        textarea{
          width:485px;
          height:100px;
        }
        .el-radio{
          margin-right:10px;
        }
        .el-radio__label{
          font-size:12px;
        }

        #selType{
          width:30px !important;
        }
      }

      .typeCon{
        &.boolean{
          .el-form-item__content{
            line-height: 30px!important;
          }
          .boolean-line{
            position: relative;
            .error{
              position: absolute;
              top: 25px;
              color: #f56c6c;
              font-size: 12px;
            }
          }
        }
        .el-input__suffix{
          color: #323232;
        }
        .el-icon-circle-close{
          line-height: 30px!important;
          padding-top: 0!important;
        }
        .formItem{
          // 空行
          &.blank-line{
            line-height: 30px;
            margin-bottom: 0;
            .el-form-item__label{
              line-height: 30px;
            }
            .el-form-item__content{
              line-height: 30px!important;
            }
          }
          .el-form-item__error{
            white-space: nowrap!important;
          }
          // 枚举类型的删除图标
          .el-icon-circle-close{
            font-size: 16px;
            padding-top:12px;
            color: #AF7C58;
            cursor: pointer;
            margin-left: 10px;
            &::before{
              vertical-align:middle;
            }
          }
          .el-form-item__content{
            display: flex;
            flex-direction: row;
            line-height: 40px;
            span{
              margin-left:8px;
              margin-right:8px;
              &.name{
                width:220px !important;
              }
            }
            .el-input{
              width:220px !important;
              .el-input__inner{
                width:220px !important;
              }
            }
          }
          // 布尔值
          &.bolean{
            span{
              margin: 0 10px 0 0;
              font-size: 14px!important;
              &:last-of-type{
                margin-left:8px;
              }
            }
            .el-input{
              margin-right: 5px;
              width:191px !important;
              .el-input__inner{
                width:191px !important;
              }
            }
          }
        }
      }
    }
    .add-param{
      .el-dialog__body{
        max-height: 380px;
        height: 380px;
        padding:10px 0px 10px 20px;
      }
    }
    // 能力-参数
    .ability{
      margin-bottom: 10px;
      line-height: 35px;
      .list{
        label{
          float: left;
          width: 80px;
          padding-left:8px;
        }
        &>div{
          overflow: auto;
          width: 485px;
          p{
            width: 100%;
            font-size: 12px;
            color: #323232;
            span{
              margin-right: 20px;
              &:last-of-type{
                margin-right: 0px;
              }
            }
            .right{
              float: right;
              font-size: 12px;
              i{
                cursor: pointer;
                color: #AF7C58;
                margin: 0 5px;
              }
            }
          }
        }
      }
    }
    // 新增参数footer
    .add-param{
      .el-dialog .el-dialog__footer{
        text-align: right;
        .el-button{
          border: none;
          width: 60px;
          &:first-child{
            color: #AF7C58;
            margin-right: 10px;
          }
        }
      }
    }

    //切换提示框
    #toggleTip{
      .el-dialog{
        height: 160px;
      }
      .el-dialog__body{
        height:160px;
      }
      .closeQuck{
        margin-right:24px;
        border:0px;
        background:none;
        color:#AF7C58
      }
      .sureQuck{
        width:54px;
        height:24px;
      }
    }

    // radio选中文字颜色
    .el-radio__input.is-checked + .el-radio__label{
      color: #323232;
    }
  }
</style>
