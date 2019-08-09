<template>
  <div class="shopsQuery">
    <div class="list_wrap">
      <div style="position: relative; background-color: rgb(241,243,249);padding-left: 16px;">
        <div class="content-title">
          <img src="@/common/images/dianpu.png" alt="">
          <h3>店铺管理</h3>
        </div>
        <div class="content-query">
          <label>钱包地址：</label>
          <el-input v-model="wallet_addr" placeholder="请输入钱包地址" clearable style="width: 500px"></el-input>
          <label>店铺名称：</label>
          <el-input v-model="store_name" placeholder="请输入店铺名称" clearable style="width: 380px"></el-input>
          <br/>
          <br/>
          <br/>
          <label>注册时间：</label>
          <el-date-picker class="date_input" v-model="time" type="daterange" range-separator="~" start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          :default-time="['00:00:00', '23:59:59']">
          </el-date-picker>
          <input type="button" @click="btnSearchUserList" class="search-btn" value="搜索">
        </div>
      </div>
      <div class="table-box">
        <div class="content-table">
          <div class="table-title">
            <div class="shop-num">
              <h4>店铺总数</h4>
              <p>{{totalUser}}</p>
            </div>
            <router-link class="add-shop" to="/home/userManagement/addShop">新增店铺</router-link>
          </div>
          <div class="table-details">
            <el-table :data="userList" style="width: 100%" ref="multipleTable" tooltip-effect="dark" @selection-change="handleSelectionChange"
                      @row-click="getClickInfo" @sort-change='sortChange'>
              <el-table-column type="selection" align="center" width="50">
              </el-table-column>
              <el-table-column label="编号" align="center" type="index" width="50">
              </el-table-column>
              <el-table-column label="钱包地址" align="center" min-width="130" sortable='custom'>
                <template slot-scope="scope">
                  <span>{{ scope.row.wallet_addr }}</span>
                </template>
              </el-table-column>
              <el-table-column label="店铺名称" align="center" min-width="130" sortable='custom'>
                <template slot-scope="scope">
                  <span>{{ scope.row.name }}</span>
                </template>
              </el-table-column>
              <el-table-column label="注册时间" align="center" sortable='custom'>
                <template slot-scope="scope">
                  <span>{{ scope.row.registed_time }}</span>
                </template>
              </el-table-column>
              <el-table-column label="地址" align="center"  min-width="160"  sortable='custom'>
                <template slot-scope="scope">
                  <span>{{ scope.row.addr }}</span>
                </template>
              </el-table-column>
            </el-table>
            <div class="table-footer">
              <div style="margin-top: 20px;margin-bottom: 20px;">
                <el-button type="primary" @click="handleDeletes" icon="el-icon-delete" class="delete-btn">删除店铺</el-button>
              </div>
              <div class="block" style="text-align:center">
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page.sync="currentPage"
                  :page-size=limit
                  :page-sizes="[5, 10, 20, 30]"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total=totalUser>
                </el-pagination>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "shopsQuery",
    components: {},
    data() {
      return {
        totalUser: 0,
        count_user: "",
        count_with_address: "",
        count_with_idcard: "",
        count_with_vehicle: "",
        totalYJF: "",
        totalYDD: "",
        totalGGD: "",
        userList: [],
        //phone: "",
        //name: "",
        store_name: "",
        multipleSelection: [],
        //multipleDelete: [],
        loading: false,
        currentPage: 1,
        //total: 10,
        page: 1,
        limit: 10,
        time:["",""],
        //email:"",
        wallet_addr:"",

        platform:"",
        appname:"",
        direction:"",
        sort:"",
      }
    },
    created() {
    },
    beforeMount() {
    },
    mounted() {
      if (sessionStorage.getItem("userInfo")){
        this.token = JSON.parse(sessionStorage.getItem("userInfo")).token;
        this.user_id = JSON.parse(sessionStorage.getItem("userInfo")).user_id;
      }
      this.getShopsList()
    },
    watch: {
      time: function () {
        if(this.time===null){
          this.time=["",""]
        } else {
     /*     this.time[0] = new Date(this.time[0]).toUTCString() === "Invalid Date" ? "" : new Date(this.time[0]).toUTCString();
          this.time[1] = new Date(this.time[1]).toUTCString() === "Invalid Date" ? "" : new Date(this.time[1]).toUTCString(); */
          if (this.time[0] && this.time[1]){
            this.time[0] = this.$utils.formatDate(this.time[0],"yyyy-MM-dd");
            this.time[1] = this.$utils.formatDate(this.time[1],"yyyy-MM-dd");
          }
        }
      }
    },
    computed: {
      //筛查出选中的数据的user_id组成的数组
      multipleDelete:function () {
        return this.$_.map(this.multipleSelection, function (item) {
          return item.id
        });
      }
    },
    methods: {
      //查询店铺列表
      getShopsList() {
        this.$axios({
          method: "GET",
          url: `${this.$baseURL}/v1/rrpoints-saas/web/stores?user_id=${this.user_id}&store_name=${this.store_name}&wallet_addr=${this.wallet_addr}&date_from=${this.time[0]}&date_to=${this.time[1]}&sort=${this.sort}&direction=${this.direction}&page=${this.page-1}&limit=${this.limit}`,
          headers: {
            'X-Access-Token': this.token,
          }
        }).then(res => {

          console.log(res.data)
          this.totalUser = Number(res.data.data.total);

         /* this.count_user = res.data.count;
          this.count_with_address = res.data.count_with_address;
          this.count_with_idcard = res.data.count_with_idcard;
          this.count_with_vehicle = res.data.count_with_vehicle;
          this.totalYJF = res.data.TSD;
          this.totalYDD = res.data.YDD;
          this.totalGGD = res.data.ADE;*/
          let that = this;
          res.data.data.stores.forEach(function (item) {
            if (item.registed_time) {
              item.registed_time = that.$utils.formatDate(new Date(item.registed_time), "yyyy-MM-dd hh:mm:ss");
            }
            if (item.wallet_addr){
              item.wallet_addr = item.wallet_addr.substr(0,10) + "........" + item.wallet_addr.substr(item.wallet_addr.length-10,item.wallet_addr.length)

            }
          });
          this.userList = res.data.data.stores;
        }).catch(error => {
          console.log(error)
        })
      },
      //排序
      sortChange: function(column, prop, order) {
        if(column.column.label == "邮箱"){
          this.sort = "email";
        }else if(column.column.label == "钱包地址"){
          this.sort = "wallet_addr";
        }else if(column.column.label == "注册时间"){
          this.sort = "created_at";
        }else if(column.column.label == "手机号码"){
          this.sort = "phone";
        }else if(column.column.label == "真实姓名"){
          this.sort = "name";
        }else if(column.column.label == "身份证号"){
          this.sort = "store_name";
        }else if(column.column.label == "元积分"){
          this.sort = "TSD";
        }else if(column.column.label == "广告豆"){
          this.sort = "ADE";
        }else if(column.column.label == "元豆豆"){
          this.sort = "YDD";
        }else if(column.column.label == "平台"){
          this.sort = "platform";
        }else if(column.column.label == "应用"){
          this.sort = "appname";
        }
        if (column.order == "descending"){
          this.direction = "desc";
          this.getShopsList()
        } else if (column.order == "ascending"){
          this.direction = "asc";
          this.getShopsList()
        }
      },
      //点击搜索按钮搜索用户列表
      btnSearchUserList() {
        this.page = 1;//按钮搜索时初始化page
        this.getShopsList()
      },
      //获取所点击行的信息
      getClickInfo(row){
        sessionStorage.setItem("clickInfo", JSON.stringify(row));
        //this.$router.push("/home/userManagement/shopDetails");
        window.open("/home/userManagement/shopDetails",'_blank');
      },
      //更改每页显示条数
      handleSizeChange(val) {
        this.limit = val;
        this.getShopsList()
      },
      //切换分页
      handleCurrentChange(val) {
        this.page = val;
        this.getShopsList()
      },
      //删除按钮删除方法
      handleDeletes() {
        if (this.multipleDelete.length === 0) {
          return
        }
        this.$confirm('确定删除此店铺?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.$axios({
            method: "DELETE",
            url: `${this.$baseURL}/v1/backstage/users/${this.multipleDelete[0]}`,
            headers: {
              'X-Access-Token': this.token,
            }
          }).then((res) => {
            this.page=1;
            this.getShopsList();
          }).catch((err) => {
          })
        }).catch(() => {
          console.log('已取消删除')
        });
      },
      //获取选中复选框数据
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
    }
  }
</script>

<style scoped lang="stylus">
  .shopsQuery {
    .list_wrap {
      margin 0 auto
      .content-title{
        width: 100%;
        height: 60px;
        line-height 60px
        background-color: #ffffff;
        border-left: none;
        font-size: 20px;
        color: #333333;
        padding-left:18px
        display flex
        flex-direction row
        align-items center
        img {
          margin-right 12px
        }
      }
      .content-query{
        width: 100%;
        height: 150px;
        margin-top 15px
        background-color #ffffff
        padding: 20px
        label{
          font-size: 16px;
          color: #333333;
        }
        .search-btn{
          width: 100px;
          height: 48px;
          background-color: #386cff;
          border-radius: 4px;
          float: right;
          margin-right: 190px;
          font-size: 18px;
          color: #fefefe;
          outline none
          cursor pointer
          position: relative;
          bottom: 8px;
        }
      }
      .table-box{
        padding-top: 15px;
        padding-left 16px
        background-color: rgb(241, 243, 249);
        .content-table{
          background-color #fff
          .table-title{
            font-size: 16px;
            color: #555555;
            padding: 18px 22px 0 22px
            display flex
            flex-direction row
            justify-content space-between
            .shop-num{
              width: 138px;
              height: 56px;
              text-align center
              background url("../../../common/images/shop.png") no-repeat center
              background-size 100% 100%
              color #FFFFFF
              h4{
                font-size: 14px;
                padding: 10px 0 4px 0
              }
              p{
                font-size: 24px;
              }
            }
            .add-shop{
              display inline-block
              width: 130px;
              height: 48px;
              text-align center
              line-height 48px
              background-color: #386cff;
              border-radius: 4px;
              margin-right: 190px;
              font-size: 18px;
              color: #fefefe;
              cursor pointer
            }
            span{
              margin-right 130px
            }
          }
        }
      }
      .delete-btn{
        margin: 10px 0 0 20px;
      }
      .block{
        margin-top: 12px;
      }
    }
    .mar{
      padding-right 20px
      font-size: 18px;
      color: #333333;
    }
  }
</style>
<style lang="stylus">
  .el-pagination__editor.el-input{
    margin-right 2px
  }
  .el-input{
    margin-right 50px
    .el-input__inner{
      background-color: #f6f8fe;
      border: solid 1px #dfe6f7;
      border-radius 4px
    }
  }
  .el-date-editor{
    border-radius: unset;
    background-color: #f6f8fe;
    border: solid 1px #dfe6f7;
    input{
      background-color: #f6f8fe;
    }
  }
  .el-range-editor.is-active, .el-range-editor.is-active:hover{
    border-color #dfe6f7
  }

  .table-details{
    margin: 16px
    margin-bottom 0
    //background-color: #f0f3fa;
    .table-footer{
      display flex
      flex-direction row
      align-items center
      justify-content space-between
    }
    .el-table{
      .el-table__header-wrapper{
        table{
          th{
            background-color: #f6f8fe;
            color: #222222;
          }
        }
      }
      .el-table__body-wrapper{
        background-color: #f6f8fe;
        .el-table__body{
          tbody {
            tr:nth-child(even){
              background-color: #f6f8fe;
            }
          }
        }
      }
    }
  }

</style>
