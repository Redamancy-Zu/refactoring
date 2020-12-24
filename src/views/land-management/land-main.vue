<template>
  <div id="land-management" :style="{minHeight: minHeight + 'px'}">
    <div class="spaceMA">
      <span>您没有查看地块列表权限！</span>
    </div>
    <div
      class="spaceMB"
      :style="{minHeight: minHeightInner + 'px'}"
      v-fence="{data:'', functions:['查看地块列表']}"
    >
      <div class="select-container">
        <el-col
          v-fence="{data:'', functions:['编辑地块（新增、编辑、删除）']}"
          :span="24"
          class="el-landes"
        >
          <el-button type="primary" class="createLands" icon="el-icon-plus" @click="creatLand">新建地块</el-button>
        </el-col>
      </div>
      <div class="table-container">
        <template>
          <el-table :data="langList">
            <el-table-column prop="projectName" label="项目名">
              <template slot-scope="scope">
                <span>{{scope.row.projectName}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="landName" label="地块名">
              <template slot-scope="scope">
                <span class="descrCont">{{scope.row.landName}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="landAlias" label="地块别名">
              <template slot-scope="scope">
                <span class="descrCont">{{scope.row.landAlias}}</span>
              </template>
            </el-table-column>
            <el-table-column
              v-fence="{data:'', functions:['编辑地块（新增、编辑、删除）']}"
              prop="buildingList"
              label="建筑总数"
            >
              <template slot-scope="scope">
                <a
                  @click="buildDetail(scope.row)"
                  class="buildNum"
                  v-if="scope.row.buildingList.length!==0"
                >{{`${scope.row.buildingList.length}`}}</a>
                <a
                  class="buildNumCheck"
                  v-else
                  :disabled="true"
                >{{`${scope.row.buildingList.length}`}}</a>
              </template>
            </el-table-column>
            <el-table-column prop="description" label="备注">
              <template slot-scope="scope">
                <el-tooltip v-if="scope.row.description!==''" class="tooltis" placement="top">
                  <div
                    class="showCont"
                    slot="content"
                  >{{scope.row.description}}</div>
                  <span class="descrCont">{{scope.row.description || '--'}}</span>
                </el-tooltip>
                <span v-else class="descrCont">{{scope.row.description || '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <span v-fence="{data:'', functions:['编辑地块（新增、编辑、删除）']}">
                  <span class="operation">
                    <i class="el-icon-edit" @click="landEditer(scope.row)"></i>
                  </span>
                  <span>
                    <i class="el-icon-delete" @click="deleteLands(scope.row)"></i>
                  </span>
                </span>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <div v-if="this.langList.length" class="paging fr">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="page.pageNum"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="page.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
        <createLand
          :createLoading="createLoading"
          :allList="allList"
          @createStatus="createLands"
          @uploadList="uploadList"
        ></createLand>
        <editerLand
          :editer="editer"
          @editerStatus="editerLand"
          :landNow="landNow"
          @uploadList="uploadList"
        ></editerLand>
        <deleteLand
          :deletes="deletes"
          :deletesId="deletesId"
          @uploadLand="deletesland"
          @uploadList="uploadList"
        ></deleteLand>
        <detailLand :details="details" @detailLand="detailLands" :buildList="buildList"></detailLand>
      </div>
    </div>
  </div>
</template>
<script>
import createLand from "./create-land"; //新建地块
import editerLand from "./land-editer"; //编辑地块
import deleteLand from "./delete-land"; //删除地块
import detailLand from "./land-detail"; //建筑详情
import { landList } from "../../api/api.js"; //地块管理列表
import { mapActions, mapGetters } from "vuex"; //全局城市选择
export default {
  components: {
    createLand,
    editerLand,
    deleteLand,
    detailLand
  },
  name: "land-management",
  data() {
    return {
      minHeight: null,
      minHeightInner: null,
      langList: [], //地块列表
      createLoading: false, //新增地块
      editer: false, //编辑地块
      deletes: false, //删除地块
      details: false, //地块详情
      //分页器
      page: {
        pageNum: 1,
        pageSize: 10,
        provinceId: null,
        countryId: 1,
        cityId: null
      },
      total: 0, //数据总数
      deletesId: 0, //地块删除id
      buildList: [], //详情列表
      landNow: {}, //地块编辑
      allList: [] //新增地块数据
    };
  },
  mounted() {
    this.minHeight = window.innerHeight - 95;
    this.minHeightInner = window.innerHeight - 195;
    this.page.countryId = this.getCurrentCityId[0] || null;
    this.page.provinceId = this.getCurrentCityId[1] || null;
    this.page.cityId = this.getCurrentCityId[2] || null;
    this.langManList();
  },
  computed: {
    ...mapGetters(["getCurrentCityId"])
  },
  watch: {
    getCurrentCityId: {
      handler: function(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.page.countryId = newVal[0] || null;
          this.page.provinceId = newVal[1] || null;
          this.page.cityId = newVal[2] || null;
          this.pageNum = 1;
          this.langManList();
        }
      },
      // 深度观察监听
      deep: true
    }
  },
  methods: {
    langManList() {
      const loading = this.$loading({
        lock: true,
        target: document.querySelector('#land-management')
      });
      landList({
        countryId: this.page.countryId,
        provinceId: this.page.provinceId,
        cityId: this.page.cityId,
        pageNumber: this.page.pageNum,
        pageSize: this.page.pageSize
      })
        .then(res => {
          this.langList = res.data.data.list;
          this.total = res.data.data.total;
          loading.close();
        })
        .catch(() => {
         loading.close();
        });
    },
    creatLand() {
      this.createLoading = true;
      this.filsLook();
    },
    landEditer(value) {
      this.editer = true;
      this.landNow = value;
    },
    deleteLands(val) {
      this.deletes = true;
      this.deletesId = val.landId;
    },
    buildDetail(vals) {
      this.details = true;
      this.buildList = vals.buildingList;
    },
    deletesland(val) {
      this.deletes = val;
    },
    editerLand(res) {
      this.editer = res;
    },
    createLands(date) {
      this.createLoading = date;
    },
    detailLands(vals) {
      this.details = vals;
    },
    langManLists() {
      this.$emit("oploadLand", this.langManList);
    },
    handleSizeChange(val) {
      this.page.pageSize = val;
      this.page.pageNum = 1;
      this.langManList();
    },
    handleCurrentChange(val) {
      this.page.pageNum = val;
      this.langManList();
    },
    uploadList() {
      this.langManList();
    },
    filsLook() {
      landList({
        pageNumber: this.page.pageNum,
        pageSize: 9999
      }).then(res => {
        this.allList = res.data.data.list;
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../styles/new-index.scss";
#land-management {
  padding: 10px 24px;
  background: $content-bgColor;
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
    }
  }
  .spaceMB {
    position: relative;
    z-index: 100;
    background: #fff;
    .buildNum{
      margin-left:4px;
      color:#AF7C58;
      border-bottom:1px solid #AF7C58;
    }
    .buildNumCheck{
      margin-left:4px;
      color:#323232
    }
    .operation{
      cursor:pointer;
      margin-right:15px;
    }
  }
  .select-container {
    color: $new-font-color;
    padding: 10px 0;
    display: flex;
    flex-direction: row;
    .el-button {
      padding: 8px 15px;
      border-radius: 2px;
      font-size: 12px;
      background: #0fadff;
    }
    .el-button:hover {
      background: rgba(15, 173, 255, 0.8);
    }
    .el-landes{
      text-align:right;
    }
  }
  .table-container {
    overflow: auto;
    padding: 10px 0;
    .el-icon-edit {
      color: $y-color;
    }
    .el-icon-delete {
      color: $y-color;
      cursor: pointer;
    }
  }
  .descrCont {
    display: inline-block;
    width: 80px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .showCont {
    width: 200px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
  }
  .createLands{
    border:none;
  }
  .paging{
    margin-top:10px;
  }
}
</style>
<style lang="scss">
.addTypeName {
  .el-dialog__body {
    padding: 30px 40px 30px 20px !important;
  }
}
.typeIcon {
  .el-upload {
    width: 400px !important;
    overflow: hidden;
    margin-left: -10px !important;
    .filename {
      float: left !important;
      width: 342px !important;
    }
    .el-button {
      float: left !important;
      margin-top: 5px;
    }
  }
  .fileIcon {
    float: right !important;
  }
}
#edmitIcon {
  float: left;
  .filename {
    width: 363px !important;
    margin-left: -10px !important;
  }
}
#iconTap {
  margin-left: 5px !important;
}
@import "../../styles/new-index.scss";
#land-management {
  background: $content-bgColor;
  .el-table {
    background: transparent !important;
    th {
      background: #ebf4fc;
      color: $new-font-color;
      text-align: center;
      font-size: 12px;
      border: none;
      border-right: 1px solid #fff;
      padding: 6.5px 0;
    }
    tr {
      td {
        font-size: 12px;
        color: $new-font-color;
        background: $content-bgColor;
        border-bottom: $td-border;
        text-align: center;
        .txt_underline {
          color: $y-color;
          text-decoration: underline;
          cursor: pointer;
        }
      }
    }
  }
  .el-table::before {
    height: 0;
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
}
</style>
