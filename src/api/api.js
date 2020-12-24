import axios from './http'
import Qs from 'qs'
import {
    Message,
    Loading
} from 'element-ui'
import {
    API_ROOT, SSO_ROOT
} from './config'
//IOT平台私有的appId
export const appId = '7a852a76';
//获取国家、省、市列表
export const getAllCountryCity = params => { return axios.get(`${API_ROOT}CityInfo/selectAllCountryCity`, { params: params }); }
    // 控件模板管理-模板管理

// 上传图片(获取信息)
export const uploadFileToken = params => { return axios.get(`${API_ROOT}Upload/uploadFileToken`, { params: params }); }

//mqtt实例
// 开发环境
export const mqttUrl = 'mqtt://10.58.237.237:61615';
export const mqttUser = 'user';
export const mqttPWD = 'user';
// 生产环境
// export const mqttUrl = 'wss://berry.ai.jinmaolvjian.com:8084/mqtt';
// 模板管理-空间名称管理（模块）
export const spacePageRoom = params => { return axios.get(`${API_ROOT}roomsName/selectPageRoom`, { params: params }); } // 获取项目名列表
export const spaceAddRoomName = params => { return axios.post(`${API_ROOT}roomsName/addRoomName`, params).then(res => res.data).catch(error => { console.log(error); }) } // 新增项目名
export const spaceUpdateRoomName = params => { return axios.post(`${API_ROOT}roomsName/updateRoomName`, params).then(res => res.data).catch(error => { console.log(error); }) } // 修改项目名
export const spaceDelRoomName = params => { return axios.post(`${API_ROOT}roomsName/deleteRoomName`, params).then(res => res.data).catch(error => { console.log(error); }) } // 删除项目名
export const selectSpaceTypeList = params => { return axios.get(`${API_ROOT}roomsName/selectSpaceTypeList`, { params: params }); } // 获取空间类型下拉列表

// 模板管理-列表、新增、删除
export const modelAdd = params => { return axios.post(`${API_ROOT}SpaceModel/add`, params).then(res => res.data).catch(error => { console.log(error); }) } // 新增模板
export const modelDelete = params => { return axios.post(`${API_ROOT}SpaceModel/delete`, params).then(res => res.data).catch(error => { console.log(error); }) } // 删除模板
export const getProjectName = params => { return axios.get(`${API_ROOT}houseInfo/selectProjectName`, { params: params }); } // 项目下拉选择
export const SpaceModelSelect = params => { return axios.post(`${API_ROOT}SpaceModel/select`, params).then(res => res.data).catch(error => { console.log(error); }) } // 模板列表
export const findAllHouseInfo = params => { return axios.get(`${API_ROOT}houseInfo/selectAllHouseInfo`, { params: params }); } // 获取项目下的房源


export const newGetProjectName = params => { return axios.get(`${API_ROOT}roomsName/selectProjectName`, { params: params }); } // 项目下拉选择

// 模板管理-详情
export const select = params => { return axios.get(`${API_ROOT}SpaceModel/select`, { params: params }); } //模板管理列表
export const details = params => { return axios.get(`${API_ROOT}SpaceModel/selectDetails`, { params: params }).then(res => res.data).catch(error => { console.log(error); }) } //空间模版管理,模板详情
export const selects = params => { return axios.post(`${API_ROOT}OperateLog/select`, params).then(res => res.data).catch(error => { console.log(error); }) } //空间模版管理,模板详情
export const updateSpaceModel = params => { return axios.post(`${API_ROOT}spaceModel/updateSpaceModel`, params).then(res => res.data).catch(error => { console.log(error); }) } //空间模版管理,模板详情

// 模板设备编辑
export const modelSelectDetails = params => { return axios.get(`${API_ROOT}SpaceModel/selectDetailsForUpdate`, { params: params }); } // 获取空间设备信息
export const modelSelectRoomName = params => { return axios.get(`${API_ROOT}spaceModel/selectRoomName`, { params: params }); } // 空间名称下拉选项
export const modelSelectOriented = params => { return axios.get(`${API_ROOT}spaceModel/selectOriented`, { params: params }); } // 朝向下拉选项
export const modelSelectListModel = params => { return axios.get(`${API_ROOT}ProductCategory/selectAllModelList`, { params: params }); } // 产品类型、型号三级联动
export const modelUpdateDevice = params => { return axios.post(`${API_ROOT}spaceModel/updateSpaceModelDevice`, params).then(res => res.data).catch(error => { console.log(error); }) } // 设备信息更新
export const modelFindAllhouse = params => { return axios.get(`${API_ROOT}houseInfo/selectAllHouseInfo`, { params: params }); } // 获取项目下所有模板
export const modelInserToUser = params => { return axios.get(`${API_ROOT}spaceModel/addRoomNameToUserModel`, { params: params }); } // 导入其他模板的空间名称


// 户内设备管理(模块)
export const getAllHouselist = params => { return axios.get(`${API_ROOT}SpaceManage/selectAllProjectHouseByArea`, { params: params }).then(res => res.data).catch(error => { console.error(error) }) } //获取项目下的所有房源
export const getDimensionsInfo = params => { return axios.get(`${API_ROOT}SpaceManage/selectAllProjectNumber`, { params: params }) } //获取页面维度信息
export const chartData = params => { return axios.get(`${API_ROOT}SpaceManage/selectChart`, { params: params }) } //获取设备chart数据；
export const getBuildingInfo = params => { return axios.get(`${API_ROOT}SpaceManage/selectProjectBuildCondition`, { params: params }).then(res => res.data).catch(error => { console.log(error) }) } // 获取下拉项目、楼号
export const getUnitAndFloorInfo = params => { return axios.get(`${API_ROOT}SpaceManage/selectUnitFloorCondition`, { params: params }).then(res => res.data).catch(error => { console.log(error) }) } // 获取下拉楼层号、单元号
export const deleteAparments = params => { return axios.post(`${API_ROOT}HouseInfo/deleteHouse`, params).then(res => res.data).catch(error => { console.log(error) }) } // 删除房源
export const batchUpdate = params => { return axios.post(`${API_ROOT}batchHouseInfo/updateBatchHouse`, params).then(res => res.data).catch(error => { console.error(error) }) } // 批量修改楼号、单元、楼层、标签

export const newGetBuildingInfo = params => { return axios.get(`${API_ROOT}deviceShadow/selectProjectBuildCondition`, { params: params }).then(res => res.data).catch(error => { console.log(error) }) } // 获取下拉项目、楼号

// 添加房源
export const getTopNTags = params => { return axios.get(`${API_ROOT}label/selectLabelByCount`, { params: params }).then(res => res.data).catch(error => { console.log(error) }) } // 获取常用标签
export const createNewTag = params => { return axios.post(`${API_ROOT}label/addTag`, params).then(res => res.data).catch(error => { console.log(error); }) } // 直接新建标签
export const verifyAppartment = params => { return axios.post(`${API_ROOT}houseInfo/selectVerify`, params).then(res => res.data).catch(error => { console.log(error); }) } // 添加房源之前的校验
export const mulVerifyAppartment = params => { return axios.post(`${API_ROOT}houseInfo/selectVerifyBatch`, params).then(res => res.data).catch(error => { console.log(error); }) } // 添加房源之前的批量校验
export const addAppartment = params => { return axios.post(`${API_ROOT}houseInfo/addHouse`, params).then(res => res.data).catch(error => { console.log(error); }) } // 添加房源信息并校验
export const getTwoDimensionalCode = params => { return axios.get(`${API_ROOT}houseInfo/getTwoDimensionalCode?`+params, {}).then(res => res.data).catch(error => { console.log(error) }) } // 查询房源基本信息
export const getFamilyByHouseIds = params => { return axios.get(`${API_ROOT}houseInfo/getFamilyByHouseIds?`+params, {}).then(res => res.data).catch(error => { console.log(error) }) } // 房源批量编辑 批量删除 详情编辑

// 户内设备管理详情
export const selectBasicHouse = params => { return axios.get(`${API_ROOT}houseInfo/selectBasicHouse`, { params: params }).then(res => res.data).catch(error => { console.log(error) }) } // 查询房源基本信息
export const selectHouseDeviceInfo = params => { return axios.get(`${API_ROOT}houseInfo/selectHouseDeviceInfo`, { params: params }).then(res => res.data).catch(error => { console.log(error) }) } // 查询房源空间设备信息
export const updateHouseBasic = params => { return axios.post(`${API_ROOT}houseInfo/updateHouseBasic`, params).then(res => res.data).catch(error => { console.log(error) }) } // 修改房源基本信息
export const addTag = params => { return axios.post(`${API_ROOT}label/addTag`, params).then(res => res.data).catch(error => { console.log(error) }) } // 直接新建标签

// 空间设备编辑
export const spaceSelectDetails = params => { return axios.get(`${API_ROOT}houseInfo/selectRedactHouseDeviceInfo`, { params: params }); } // 获取空间设备信息
export const spaceUpdateDevice = params => { return axios.post(`${API_ROOT}houseInfo/updateHouseRoomeDevice`, params).then(res => res.data).catch(error => { console.log(error); }) } // 设备信息更新

// 设备绑定
export const selectGatewayInfo = params => { return axios.get(`${API_ROOT}deviceBinding/selectGatewayInfo`, { params: params }); } // 网关信息
export const selectDeviceBindList = params => { return axios.get(`${API_ROOT}deviceBinding/selectDeviceBindList`, { params: params }); } // 设备绑定状态列表
export const selectUnboundIoTList = params => { return axios.get(`${API_ROOT}deviceBinding/selectUnboundIoTList`, { params: params }); } // 未绑定iot设备列表

export const bindingGateway = params => { return axios.post(`${API_ROOT}deviceBinding/bindingGateway`, params).then(res => res.data).catch(error => { console.log(error); }) } // 绑定网关(及所有设备)
export const unbindGateway = params => { return axios.get(`${API_ROOT}deviceBinding/unbindGateway`, { params: params }); } // 取消绑定
export const matchingDevice = params => { return axios.get(`${API_ROOT}deviceBinding/matchingDevice`, { params: params }); } // 匹配网关
export const bindDevice = params => { return axios.post(`${API_ROOT}deviceBinding/bindDevice`, params).then(res => res.data).catch(error => { console.log(error); }) } // 绑定iot设备
export const unbindDevice = params => { return axios.post(`${API_ROOT}deviceBinding/unbindDevice`, params).then(res => res.data).catch(error => { console.log(error); }) } //解绑iot设备
export const updateVisualIntercomId = params => { return axios.post(`${API_ROOT}HouseInfo/updateVisualIntercomId?houseId=${params.houseId}&visualIntercomId=${params.visualIntercomId}`).then(res => res.data).catch(error => { console.log(error); }) } //编辑可视对讲室内机id

export const selectUnboundGatewayList = params => { return axios.get(`${API_ROOT}deviceBinding/selectUnboundGatewayList`, { params: params }); } // 网关联想输入框
export const selectDeviceSpaceList = params => { return axios.get(`${API_ROOT}deviceBinding/selectDeviceSpaceList`, { params: params }); } // 空间下拉框
export const selectDeviceTypeList = params => { return axios.get(`${API_ROOT}deviceBinding/selectDeviceTypeList`, { params: params }); } // 类别下拉框


// 产品管理(模块)
export const selectProType = params => { return axios.post(`${API_ROOT}ProductModel/selectAll
`, params).then(res => res.data).catch(error => { console.log(error) }) } // 查询型号列表
export const selectProCategory = params => { return axios.get(`${API_ROOT}ProductCategory/getClassification
`, params).then(res => res.data).catch(error => { console.log(error) }) } // 分类查询列表
export const productModelAdd = params => { return axios.post(`${API_ROOT}ProductModel/add`, params).then(res => res.data).catch(error => { console.log(error); }) } // 产品型号添加
export const productModelDelete = params => { return axios.post(`${API_ROOT}ProductModel/delete`, params).then(res => res.data).catch(error => { console.log(error); }) } // 删除产品型号
export const producTypeD = params => { return axios.post(`${API_ROOT}ProductType/selectDetails`, params).then(res => res.data).catch(error => { console.log(error); }) } // 新增获取节点类型

//产品型号详情页面
export const proTypeDetailBase = params => { return axios.get(`${API_ROOT}ProductModel/selectByProductModelId
`, { params: params }) } // 查询产品型号详情页面基本信息
export const getProgramList = params => { return axios.post(`${API_ROOT}ProductModel/selectProcedureByProductModelId`, params).then(res => res.data).catch(error => { console.log(error); }) } // 产品型号详情页面调试程序列表查询
export const updateProductModel = params => { return axios.post(`${API_ROOT}ProductModel/update`, params).then(res => res.data).catch(error => { console.log(error); }) } //编辑产品型号详情页面基本信息
export const productAddProcedure = params => { return axios.post(`${API_ROOT}ProductModel/addProcedure`, params).then(res => res.data).catch(error => { console.log(error); }) } // 上传调试程序
export const productDeletProcedure = params => { return axios.post(`${API_ROOT}ProductModel/deleteProcedure`, params).then(res => res.data).catch(error => { console.log(error); }) }
export const proModelFunListDelet = params => { return axios.post(`${API_ROOT}productFunction/deleteFunction`, params).then(res => res.data).catch(error => { console.log(error) }) } // 删除功能列表
export const updateModelAbility = params => { return axios.post(`${API_ROOT}productFunction/updateModelAbility`, params).then(res => res.data).catch(error => { console.log(error) }) } // 修改功能--型号能力
export const updateModelEvent = params => { return axios.post(`${API_ROOT}productFunction/updateModelEvent`, params).then(res => res.data).catch(error => { console.log(error) }) } // 修改功能--事件事件
export const updateModelProperty = params => { return axios.post(`${API_ROOT}productFunction/updateModelProperty`, params).then(res => res.data).catch(error => { console.log(error) }) } // 修改功能--属性属性
export const proModelFunListSelect = params => { return axios.get(`${API_ROOT}productFunction/selectFunctionsByModelId`, { params: params }).then(res => res.data).catch(error => { console.log(error) }) } // 获取功能列表
export const proModelStandardFunctionByModelId = params => { return axios.get(`${API_ROOT}productFunction/selectTypeFunctionsByModelId`, { params: params }).then(res => res.data).catch(error => { console.log(error) }) } //根据型号id查询型号功能列表（包含属性、能力、事件）集合
export const proModelOthersFunction = params => { return axios.post(`${API_ROOT}productFunction/selectOtherFunctionsByModelId`, params).then(res => res.data) } //产品型号--标准功能--其他功能列表数据获取
export const addProModelStandardFun = params => { return axios.post(`${API_ROOT}productFunction/addNormFunctionsToModel`, params).then(res => res.data) } //产品型号--添加标准功能
export const selectLabelTypeList = params => { return axios.get(`${API_ROOT}ProductModelLabel/selectAllLabel`, { params: params }).then(res => res.data).catch(error => { console.log(error) }) } //选择标签分类下拉


export const getAllTag = params => { return axios.get(`${API_ROOT}ProductModelLabel/selectLabelsOfModel`, { params: params }).then(res => res.data).catch(error => { console.log(error) }) } //产品型号详情 查看标签
export const deleteSelectedTag = params => { return axios.post(`${API_ROOT}ProductModelLabel/deleteModelLabelRelation`, params).then(res => res.data) } // 删除标签
export const getTagName = params => { return axios.get(`${API_ROOT}ProductModelLabel/selectLabelList`, { params: params }).then(res => res.data).catch(error => { console.log(error) }) } // 通过标签分类查询标签名称
export const addSelectTag = params => { return axios.post(`${API_ROOT}ProductModelLabel/addBindingModelToLabel`, params).then(res => res.data) } //添加  选择标签 确认
export const addUserSettingTag = params => { return axios.post(`${API_ROOT}ProductModelLabel/addProductModelLabelAndBinding`, params).then(res => res.data) } //添加  自定义标签 确认


// 产品类型管理
export const productTypeList = params => { return axios.post(`${API_ROOT}ProductType/selectMain`, params).then(res => res.data).catch(error => { console.log(error); }) } // 产品类型列表查询
export const productTypeAdd = params => { return axios.post(`${API_ROOT}ProductType/addProductType`, params).then(res => res.data).catch(error => { console.log(error); }) } // 新增类型
export const productTypeDelete = params => { return axios.post(`${API_ROOT}ProductType/deleteProductType`, params).then(res => res.data).catch(error => { console.log(error); }) } // 删除类型
export const selectCategoryList = params => { return axios.get(`${API_ROOT}ProductCategory/selectCategoryList`, { params: params }); } // 产品类别下拉
export const getClassification = params => { return axios.get(`${API_ROOT}ProductCategory/getClassification`, { params: params }); } // 科技系统分类
export const productTypeDetails = params => { return axios.post(`${API_ROOT}ProductType/selectDetails`, params).then(res => res.data).catch(error => { console.log(error); }) } //查询类型详情
export const updateProductType = params => { return axios.post(`${API_ROOT}ProductType/updateProductType`, params).then(res => res.data).catch(error => { console.log(error); }) } //编辑类型详情
export const standardFunctionByTypeId = params => { return axios.post(`${API_ROOT}productFunction/selectOtherFunctionsByTypeId`, params).then(res => res.data) }; //根据类型id查询非所属类型下功能列表（包含属性、能力、事件）集合
export const addStandardFunctionToType = params => { return axios.post(`${API_ROOT}productFunction/addNormFunctionsToType`, params).then(res => res.data) } //产品类型添加标准功能
export const selectFunctionsByTypeId = params => { return axios.get(`${API_ROOT}productFunction/selectFunctionsByTypeId`, { params: params }).then(res => res.data).catch(error => { console.log(error) }) } //查询功能列表（包含属性、能力、事件）集合

export const updateTypeAbility = params => { return axios.post(`${API_ROOT}productFunction/updateTypeAbility`, params).then(res => res.data).catch(error => { console.log(error) }) } // 修改功能--型号能力
export const updateTypeEvent = params => { return axios.post(`${API_ROOT}productFunction/updateTypeEvent`, params).then(res => res.data).catch(error => { console.log(error) }) } // 修改功能--事件事件
export const updateTypeProperty = params => { return axios.post(`${API_ROOT}productFunction/updateTypeProperty`, params).then(res => res.data).catch(error => { console.log(error) }) } // 修改功能--属性属性

//产品类别管理页面
export const getProductGenreData = params => { return axios.get(`${API_ROOT}ProductCategory/selectAll`, { params: params }); } // 获取产品类别管列表数据
export const addProductGenre = params => { return axios.post(`${API_ROOT}ProductCategory/add`, params).then(res => res.data).catch(error => { console.log(error); }) } // 新建类别名称
export const updateProductGenre = params => { return axios.post(`${API_ROOT}ProductCategory/update`, params).then(res => res.data).catch(error => { console.log(error); }) } // 编辑类别名称
export const deleteProductGenre = params => { return axios.post(`${API_ROOT}ProductCategory/delete`, params).then(res => res.data).catch(error => { console.log(error); }) } // 删除类别名称

// 添加自定义功能
export const selectDataTypeList = params => { return axios.get(`${API_ROOT}Enum/selectDataTypeList`, { params: params }); } // 获取数据类型下拉列表
export const selectTimeType = params => { return axios.get(`${API_ROOT}Enum/selectTimeType`, { params: params }); } // 查询时间单位下拉框

export const addTypeProperty = params => { return axios.post(`${API_ROOT}productFunction/addTypeProperty`, params).then(res => res.data).catch(error => { console.log(error); }) } // 新增类型-属性
export const addTypeAbility = params => { return axios.post(`${API_ROOT}productFunction/addTypeAbility`, params).then(res => res.data).catch(error => { console.log(error); }) } // 新增类型-能力
export const addTypeEvent = params => { return axios.post(`${API_ROOT}productFunction/addTypeEvent`, params).then(res => res.data).catch(error => { console.log(error); }) } // 新增类型-事件

export const addModelProperty = params => { return axios.post(`${API_ROOT}productFunction/addModelProperty`, params).then(res => res.data).catch(error => { console.log(error); }) } // 新增型号-属性
export const addModelAbility = params => { return axios.post(`${API_ROOT}productFunction/addModelAbility`, params).then(res => res.data).catch(error => { console.log(error); }) } // 新增型号-能力
export const addModelEvent = params => { return axios.post(`${API_ROOT}productFunction/addModelEvent`, params).then(res => res.data).catch(error => { console.log(error); }) } // 新增型号-事件

export const getDeliveryType = params => { return axios.get(`${API_ROOT}productFunction/getDeliveryType`, { params: params }); } // 获取所有事件推送至类型
export const getEventType = params => { return axios.get(`${API_ROOT}productFunction/getEventType`, { params: params }); } // 获取所有事件类型
export const selectArrayDataType = params => { return axios.get(`${API_ROOT}Enum/selectArrayDataType`, { params: params }); } // 获取所有数据类型

// 产品标签管理
export const getProductLabelTypeArr = params => { return axios.get(`${API_ROOT}ProductModelLabel/selectModelLabelType`, { params: params }); } // 获取产品标签分类下拉列表
export const getProductLabelList = params => { return axios.get(`${API_ROOT}ProductModelLabel/selectModelLabel`, { params: params }); } // 根据产品标签分类获取产品标签列表
export const addProductLabel = params => { return axios.post(`${API_ROOT}ProductModelLabel/addModelLabel`, params).then(res => res.data).catch(error => { console.log(error); }) }
export const updateProductLabel = params => { return axios.post(`${API_ROOT}ProductModelLabel/updateModelLabel`, params).then(res => res.data).catch(error => { console.log(error); }) }
export const deleteProductLabel = params => { return axios.post(`${API_ROOT}ProductModelLabel/deleteModelLabel`, params).then(res => res.data).catch(error => { console.log(error); }) }

//设备影子管理
export const deviceShadowProject = params => { return axios.post(`${API_ROOT}deviceShadow/selectProject`, params).then(res => res.data).catch(error => { console.log(error); }) } //设备管理/设备影子管理/项目
export const deviceShadowBuilding = params => { return axios.post(`${API_ROOT}deviceShadow/selectBuilding`, params).then(res => res.data).catch(error => { console.log(error); }) } //设备管理/设备影子管理/栋
export const deviceShadowUnit = params => { return axios.post(`${API_ROOT}deviceShadow/selectUnit`, params).then(res => res.data).catch(error => { console.log(error); }) } //设备管理/设备影子管理/单元
export const deviceShadowFloor = params => { return axios.post(`${API_ROOT}deviceShadow/selectFloor`, params).then(res => res.data).catch(error => { console.log(error); }) } //设备管理/设备影子管理/层
export const deviceShadowDoor = params => { return axios.post(`${API_ROOT}deviceShadow/selectDoor`, params).then(res => res.data).catch(error => { console.log(error); }) } //设备管理/设备影子管理/户
export const deviceShadowFition = params => { return axios.get(`${API_ROOT}ProductCategory/getClassification`, params).then(res => res.data).catch(error => { console.log(error); }) } //设备管理/设备影子管理/科技系统分类
export const deviceShadowStatus = params => { return axios.get(`${API_ROOT}Enum/selectAllDeviceStatus`, params).then(res => res.data).catch(error => { console.log(error); }) } //设备管理/设备影子管理/选择设备健康状态
export const deviceShadowModelList = params => { return axios.get(`${API_ROOT}ProductCategory/selectAllModelList`, params).then(res => res.data).catch(error => { console.log(error); }) } //设备管理/设备影子管理/选择类别-类型-型号

export const projectRank = params => { return axios.get(`${API_ROOT}/Project/selectProjectRank`, params).then(res => res.data).catch(error => { console.log(error); }) } //设备管理/设备影子管理/项目排名

export const deviceShadowAllLabel = params => { return axios.get(`${API_ROOT}ProductModelLabel/selectAllLabel`, params).then(res => res.data).catch(error => { console.log(error); }) } //设备管理/设备影子管理/选择产品标签
export const deviceShadowSticsNum = params => { return axios.post(`${API_ROOT}deviceShadow/statisticsNum`, params).then(res => res.data).catch(error => { console.log(error); }) } //设备管理/设备影子管理/统计信息
export const deviceShadowSelectAll = params => { return axios.post(`${API_ROOT}deviceShadow/selectAll`, params).then(res => res.data).catch(error => { console.log(error); }) } //设备管理/设备影子管理/列表
//设备影子详情页
export const deviceShadowById = params => { return axios.post(`${API_ROOT}deviceShadow/selectBasicInfoById`, params).then(res => res.data).catch(error => { console.log(error); }) } //设备管理/设备影子管理/列表
export const deviceShadowMain = params => { return axios.post(`${API_ROOT}deviceShadow/deviceMaintain`, params).then(res => res.data).catch(error => { console.log(error); }) } //设备管理/设备影子管理/列表
export const deviceShadowReset = params => { return axios.post(`${API_ROOT}deviceShadow/deviceReset`, params).then(res => res.data).catch(error => { console.log(error); }) } //设备管理/设备影子管理/列表
export const deviceShadowAll = params => { return axios.post(`${API_ROOT}deviceLog/selectAll`, params).then(res => res.data).catch(error => { console.log(error); }) } //设备管理/设备影子管理/列表
export const deviceShadowOperate = params => { return axios.get(`${API_ROOT}deviceShadow/status`, { params: params }); } //项目下拉框get
export const deviceShadowOperation = params => { return axios.post(`${API_ROOT}deviceShadow/operation`, params).then(res => res.data).catch(error => { console.log(error); }) } //设备管理/设备影子管理/列表

//设备影子详情页面--事件信息部分
export const handleEvent = params => { return axios.post(`${API_ROOT}event/handleEvent`, params).then(res => res.data).catch(error => { console.log(error); }) } //设备管理/设备影子管理/事件处理弹框
export const eventMsgList = params => { return axios.post(`${API_ROOT}event/selectEventList`, params).then(res => res.data).catch(error => { console.log(error); }) } //设备管理/设备影子管理/时间信息列表
export const eventStatusOption = params => { return axios.get(`${API_ROOT}event/selectEventStatus`, { params: params }); } //设备管理/设备影子管理/事件状态下拉框

// iot设备管理
export const selectProject = params => { return axios.get(`${API_ROOT}deviceIoT/selectProject`, { params: params }); } //项目下拉框get
export const selectGateway = params => { return axios.get(`${API_ROOT}deviceIoT/selectGateway`, { params: params }); } //网关下拉框get
export const selectBrand = params => { return axios.get(`${API_ROOT}deviceIoT/selectBrand`, { params: params }); } //品牌下拉框get
export const selectModel = params => { return axios.get(`${API_ROOT}deviceIoT/selectModel`, { params: params }); } //型号下拉框get
export const selectBindingStatus = params => { return axios.get(`${API_ROOT}deviceIoT/selectBindingStatus`, { params: params }); } //绑定状态下拉框get
export const selectRunStatus = params => { return axios.get(`${API_ROOT}deviceIoT/selectRunStatus`, { params: params }); } //运行状态下拉框get
export const selectAll = params => { return axios.post(`${API_ROOT}deviceIoT/selectAll`, params).then(res => res.data).catch(error => { console.log(error); }) } //iot设备管理列表
export const selectNum = params => { return axios.post(`${API_ROOT}deviceIoT/selectNum`, params).then(res => res.data).catch(error => { console.log(error); }) } //IoT设备统计信息
export const selectNode = params => { return axios.get(`${API_ROOT}deviceIoT/selectNodeType`, { params: params }); } //节点类型下拉框

// 项目配置
export const settingList = params => { return axios.post(`${API_ROOT}Project/selectAll`, params).then(res => res.data).catch(error => { console.log(error); }) } //项目配置列表
export const pUpdateCode = params => { return axios.post(`${API_ROOT}Project/updateCode`, params).then(res => res.data).catch(error => { console.log(error); }) } //添加项目code（编辑+添加）
export const pDeleteCode = params => { return axios.get(`${API_ROOT}Project/deleteCode`, { params: params }); } //删除项目code

// 概览
export const oGeneral = params => { return axios.get(`${API_ROOT}overview/general`, { params: params }); } //总体项目
export const oIntelligent = params => { return axios.get(`${API_ROOT}overview/intelligent`, { params: params }); } //已接入项目
export const oAlarm = params => { return axios.get(`${API_ROOT}overview/alarm`, { params: params }); } //项目告警
export const pSelectModelLabelType = params => { return axios.get(`${API_ROOT}ProductModelLabel/selectModelLabelType`, { params: params }); } //热点标签分类下拉
export const oDeviceCategory = params => { return axios.get(`${API_ROOT}overview/deviceCategory`, { params: params }); } //设备分类统计
export const oDeviceLabel = params => { return axios.post(`${API_ROOT}overview/deviceLabel`, params).then(res => res.data).catch(error => { console.log(error); }) } //热点标签
export const oDeviceRegion = params => { return axios.get(`${API_ROOT}overview/region`, { params: params }); }  //按区域显示项目的设备统计
export const oDeviceGrowthTrend = params => { return axios.get(`${API_ROOT}overview/deviceGrowthTrend`, { params: params }); }  //设备增长趋势
//拿tokeykey换取token
export const obtainToken = params =>  { return axios.post(`${SSO_ROOT}login/getAuthorityToken`, params).then(res => res.data).catch(error => { console.log(error); }) }
//修改密码和注销
export const modifyPassword = params => { return axios.post(`${SSO_ROOT}user/modifyPassword`, params).then(res => res.data).catch(error => { console.log(error); }) } // 修改密码
export const loginLogout = params =>  {return axios.post(`${SSO_ROOT}login/logout`, params).then(res => res.data).catch(error => { console.log(error); }) }//注销
//地块管理
export const landList = params => { return axios.get(`${API_ROOT}land/selectAll`, { params: params })}  //地块管理列表
export const createLand = params => { return axios.post(`${API_ROOT}land/insert`,params).then(res => res.data).catch(error => { console.log(error); })}  //新建地块
export const peojectList = params => { return axios.get(`${API_ROOT}land/selectProjectList`, { params: params })}  //项目列表
export const buildingList = params => { return axios.get(`${API_ROOT}land/selectBuildingList`, { params: params })}  //建筑列表
export const deletesList = params => { return axios.post(`${API_ROOT}land/delete`,params).then(res => res.data).catch(error => { console.log(error); })}  //删除地块
export const editerList = params => { return axios.post(`${API_ROOT}land/update`,params).then(res => res.data).catch(error => { console.log(error); })}  //编辑地块

//单点登录平台切换
export const onlyLogin = params => { return axios.get(`${SSO_ROOT}platform/getPlatformList`, { params: params })}
//安全
export const sectivityStatu = params => {return axios.get(`${API_ROOT}deviceShadow/getSeStatus/`, {params: params})} //设备影子安全状态
export const findNewHistory = params => {return axios.post(`${API_ROOT}deviceShadow/getIotSeNewLog`,params).then(res => res.data).catch(error => {console.log(error)})} //查询最新记录系统解析失败次数
export const findDatewayHistory = params => {return axios.post(`${API_ROOT}deviceShadow/getGatewaySeNewLog`,params).then(res => res.data).catch(error => {console.log(error)})} //查询最新记录网关解析失败次数
export const oldHistoryToltal = params => {return axios.post(`${API_ROOT}deviceShadow/getIotSeBygoneLog`,params).then(res => res.data).catch(error => {console.log(error)})} //查询历史记录系统解析失败次数
export const oldHistoryDateway = params => {return axios.post(`${API_ROOT}deviceShadow/getGatewaySeBygoneLog`,params).then(res => res.data).catch(error => {console.log(error)})} //查询历史记录网关解析失败次数
export const resetTotal = params => {return axios.get(`${API_ROOT}deviceShadow/maintainGateway`, {params: params})} //安全监控重置操作
export const findSectivityStatus = params => {return axios.get(`${API_ROOT}SpaceManage/selectSeStatus`, {params: params})} //安全状态下拉框
export const findSectivityNewStatus = params => {return axios.get(`${API_ROOT}SpaceManage/selectDeviceSeStatus`, {params: params})} //户内安全状态下拉框
export const IndoorQuery = params => {return axios.post(`${API_ROOT}SpaceManage/selectSeStatusHouseNum`,params).then(res => res.data).catch(error => {console.log(error)})} //户内安全查询图表
export const deviceChart = params => {return axios.post(`${API_ROOT}deviceShadow/selectGatewaySecurityStatusNumForShadowList`,params).then(res => res.data).catch(error => {console.log(error)})} //设备影子图表
export const timeChange = params => {return axios.get(`${API_ROOT}deviceShadow/seLogTime`, {params: params})} //日志时间筛选
