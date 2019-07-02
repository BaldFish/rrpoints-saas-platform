<template>
  <div class="userDetails">
    <div class="list_wrap">
      <div style="position: relative; background-color: rgb(241,243,249);padding-left: 16px;">
        <div class="content-title">
          <img src="@/common/images/dianpu.png" alt="">
          <h3>店铺管理</h3>
        </div>
        <div class="user-info">
          <h3>店铺信息</h3>
          <br>
          <table>
            <tbody>
            <tr>
              <td class="table-title">店铺名称：</td>
              <td>燕鑫兆元洗车店</td>
              <td class="table-title">店铺注册日期：</td>
              <td>2019-05-22 10:11:20</td>
            </tr>
            <tr>
              <td class="table-title">店铺联系方式：</td>
              <td>010-34467242；010-78476331；</td>
              <td class="table-title">钱包地址：</td>
              <td>0x79f2132138793741264749532549870x79f213213879374126474953254987</td>
            </tr>
            <tr>
              <td class="table-title">店铺地址：</td>
              <td>北京市朝阳区八里庄西里100号</td>
              <td class="table-title">经纬度：</td>
              <td>116°28′E,39°54′N</td>
            </tr>
            </tbody>
          </table>
        </div>
        <div class="user-amount">
          <h3>账户金额</h3>
          <br>
          <div class="num-box">
            <div class="yuan-num">
              <h4>元积分</h4>
              <p>9000</p>
            </div>
            <div class="taibao-num">
              <h4>太保积分</h4>
              <p>2000</p>
            </div>
            <!--<div class="yuan-num">
              <h4>XX积分</h4>
              <p>6000</p>
            </div>
            <div class="taibao-num">
              <h4>XX积分</h4>
              <p>8000</p>
            </div>-->
          </div>
        </div>
      </div>
      <div class="table-box">
        <div class="content-table">
          <div class="table-title">
            <h3>账户金额</h3>
            <br>
            <ul>
              <li :class="{ 'li-active': tabStatus}" @click="tabChange(tabStatus)">元积分</li>
              <li :class="{ 'li-active': !tabStatus}" @click="tabChange(tabStatus)">太保积分</li>
            </ul>
            <div class="search-box">
              <div class="total-num">
                <label>当前总额：</label>
                <p>78823.00</p>
              </div>
              <div class="search-right">
                <label>创建时间：</label>
                <el-date-picker class="date_input" v-model="time" type="daterange" range-separator="~" start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                :default-time="['00:00:00', '23:59:59']">
                </el-date-picker>
                <input type="button" class="search-btn" value="搜索">
              </div>
            </div>
          </div>
          <div class="table-details">
            <el-table :data="userList" style="width: 100%" ref="multipleTable" tooltip-effect="dark" @selection-change="handleSelectionChange"
                       @sort-change='sortChange'>
              <el-table-column label="手机号码" align="center" min-width="110" sortable='custom'>
                <template slot-scope="scope">
                  <span>18611471680</span>
                </template>
              </el-table-column>
              <el-table-column label="创建时间" align="center" min-width="150"  sortable='custom'>
                <template slot-scope="scope">
                  <span>{{ "2019-06-25 10:15:55" }}</span>
                </template>
              </el-table-column>
              <el-table-column label="消费内容" align="center" min-width="130" sortable='custom'>
                <template slot-scope="scope">
                  <span>{{ "服务1：标准洗车1次" }}</span>
                </template>
              </el-table-column>
              <el-table-column label="金额" align="center"  min-width="100"  sortable='custom'>
                <template slot-scope="scope">
                  <span>{{ "+200" }}</span>
                </template>
              </el-table-column>
              <el-table-column label="备注" align="center"  min-width="100"  sortable='custom'>
                <template slot-scope="scope">
                  <span>{{ "汽车清洗" }}</span>
                </template>
              </el-table-column>
            </el-table>
            <div class="table-footer">
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
    name: "userDetails",
    components: {},
    data() {
      return {
        totalUser: 100,
        count_user: "",
        count_with_address: "",
        count_with_idcard: "",
        count_with_vehicle: "",
        totalYJF: "",
        totalYDD: "",
        totalGGD: "",
        userList: [{},{},{},{},{},{},{},{},{},{},],
        phone: "",
        name: "",
        idcard: "",
        multipleSelection: [],
        //multipleDelete: [],
        loading: false,
        currentPage: 1,
        //total: 10,
        page: 1,
        limit: 10,
        time:["",""],
        email:"",
        address:"",

        platform:"",
        appname:"",
        direction:"",
        sort:"",
        tabStatus: true
      }
    },
    created() {
    },
    beforeMount() {
    },
    mounted() {
      this.token = JSON.parse(sessionStorage.getItem("myLogin")).data.token;
      this.getUserList()
    },
    watch: {
      time: function () {
        if(this.time===null){
          this.time=["",""]
        } else {
          this.time[0] = new Date(this.time[0]).toUTCString() === "Invalid Date" ? "" : new Date(this.time[0]).toUTCString();
          this.time[1] = new Date(this.time[1]).toUTCString() === "Invalid Date" ? "" : new Date(this.time[1]).toUTCString();
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
      tabChange(){
        this.tabStatus = !this.tabStatus
      },
      //获取用户列表
      getUserList() {
        //手机号格式化
        let initPhone = "";
        if(this.phone){
          initPhone = "+86" + this.phone
        }
        this.$axios({
          method: "GET",
          url: `${this.$baseURL}/v1/backstage/users?phone=${initPhone}&name=${this.name}&email=${this.email}&idcard=${this.idcard}&address=${this.address}&platform=${this.platform}&appname=${this.appname}&created_since=${this.time[0]}&created_to=${this.time[1]}&sort=${this.sort}&direction=${this.direction}&page=${this.page-1}&limit=${this.limit}`,
          headers: {
            'X-Access-Token': this.token,
          }
        }).then(res => {
          //this.totalUser = res.data.count;
          this.count_user = res.data.count;
          this.count_with_address = res.data.count_with_address;
          this.count_with_idcard = res.data.count_with_idcard;
          this.count_with_vehicle = res.data.count_with_vehicle;
          this.totalYJF = res.data.TSD;
          this.totalYDD = res.data.YDD;
          this.totalGGD = res.data.ADE;
          let that = this;
          res.data.users.forEach(function (item) {
            if (item.created_at) {
              item.created_at = that.$utils.formatDate(new Date(item.created_at), "yyyy-MM-dd hh:mm:ss");
            }
          });
          //this.userList = res.data.users;
        }).catch(error => {
          console.log(error)
        })
      },
      //排序
      sortChange: function(column, prop, order) {
        if(column.column.label == "邮箱"){
          this.sort = "email";
        }else if(column.column.label == "钱包地址"){
          this.sort = "address";
        }else if(column.column.label == "注册时间"){
          this.sort = "created_at";
        }else if(column.column.label == "手机号码"){
          this.sort = "phone";
        }else if(column.column.label == "真实姓名"){
          this.sort = "name";
        }else if(column.column.label == "身份证号"){
          this.sort = "idcard";
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
          this.getUserList()
        } else if (column.order == "ascending"){
          this.direction = "asc";
          this.getUserList()
        }
      },
      //点击搜索按钮搜索用户列表
      btnSearchUserList() {
        this.page = 1;//按钮搜索时初始化page
        this.getUserList()
      },
      //获取所点击行的信息
      getClickInfo(row){
        sessionStorage.setItem("clickInfo", JSON.stringify(row));
        //this.$router.push("/home/userManagement/userDetails");
        window.open("/home/userManagement/userDetails",'_blank');
      },
      //更改每页显示条数
      handleSizeChange(val) {
        this.limit = val;
        this.getUserList()
      },
      //切换分页
      handleCurrentChange(val) {
        this.page = val;
        this.getUserList()
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
            this.getUserList();
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
  .userDetails {
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
      .user-info{
        height: 210px;
        background-color: #ffffff;
        margin-top 15px
        padding:20px
        h3{
          font-size: 18px;
          color: #333333;
        }
        table{
          width: 1130px;
          height: 126px;
          background-color: #f6f8fe;
          border-radius: 4px;
          tbody{
            tr{
              height:42px
              line-height 42px
              td{
                border 2px solid #FFFFFF
              }
              .table-title{
                text-align right
                width:130px
              }
              td:nth-child(even){
                width: 300px;
                padding-left: 10px;
              }
            }
          }
        }
      }
      .user-amount{
        height: 130px;
        background-color: #ffffff;
        margin-top 15px
        padding:20px
        h3{
          font-size: 18px;
          color: #333333;
        }
        .num-box{
          display flex
          flex-direction row
          h4{
            font-size: 14px;
            padding: 10px 0 4px 0
          }
          p{
            font-size: 24px;
          }
          .yuan-num{
            width: 138px;
            height: 56px;
            text-align center
            background url("../../../common/images/yuan.png") no-repeat center
            background-size 100% 100%
            margin-right 24px
            color: #FFFFFF
          }
          .taibao-num{
            width: 138px;
            height: 56px;
            text-align center
            background url("../../../common/images/taibao.png") no-repeat center
            background-size 100% 100%
            color: #FFFFFF
            margin-right 24px
          }
        }
      }
      .table-box{
        padding-top: 15px;
        padding-left 16px
        background-color: rgb(241, 243, 249);
        .content-table{
          background-color #fff
          .table-title{
            padding 20px
            h3{
              font-size: 18px;
              color: #333333;
            }
            ul{
              display: flex
              flex-direction row
              li{
                width: 120px;
                height: 46px;
                line-height 46px
                text-align center
                border-radius: 4px;
                font-size: 18px;
                border: solid 1px #386cff;
                color: #386cff;
                margin-right 30px
                cursor pointer
              }
              .li-active{
                background-color: #386cff;
                color: #ffffff;
              }
            }
            .search-box{
              margin-top 12px
              display flex
              flex-direction row
              justify-content space-between
              .total-num{
                color: #333333;
                display flex
                flex-direction row
                align-items baseline
                margin-top: 10px;
                label{
                  font-size: 14px;
                }
                p{
                  font-size: 24px;
                }
              }
              .search-right{
                .search-btn{
                  width: 100px;
                  height: 48px;
                  background-color: #386cff;
                  border-radius: 4px;
                  margin 0 70px
                  font-size: 18px;
                  color: #fefefe;
                  outline none
                  cursor pointer
                }
              }
            }
          }
        }
      }
      .delete-btn{
        margin: 10px 0 0 20px;
      }
      .block{
        margin: 20px 0;
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
    margin: 0 16px
    //background-color: #f0f3fa;
    .table-footer{
      display flex
      flex-direction row
      align-items center
      justify-content flex-end
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
