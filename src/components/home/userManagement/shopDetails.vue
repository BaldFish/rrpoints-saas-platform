<template>
  <div class="shopDetails">
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
              <td>{{userTable.name}}</td>
              <td class="table-title">店铺注册日期：</td>
              <td>{{userTable.registed_data}}</td>
            </tr>
            <tr>
              <td class="table-title">店铺联系方式：</td>
              <td>{{userTable.contact}}</td>
              <td class="table-title">店铺类型：</td>
              <td>{{userTable.type}}</td>
            </tr>
            <tr>
              <td class="table-title">店铺地址：</td>
              <td style="line-height: 22px">{{userTable.addr}}</td>
              <td class="table-title">经纬度：</td>
              <td>{{userTable.location}}</td>
            </tr>
            <tr>
              <td class="table-title">精修车型：</td>
              <td>{{userTable.serve_cars}}</td>
              <td class="table-title">服务范围：</td>
              <td>{{userTable.serve_range}}</td>
            </tr>
            <tr>
              <td class="table-title">营业时间：</td>
              <td>{{userTable.serve_time}}</td>
              <td class="table-title">钱包地址：</td>
              <td>{{userTable.wallet_addr}}</td>
            </tr>
            <tr>
              <td class="table-title" colspan="1">标签：</td>
              <td colspan="3">{{userTable.sign}}</td>
            </tr>
            <tr>
              <td class="table-title" colspan="1">商家介绍：</td>
              <td colspan="3">{{userTable.introduce}}</td>
            </tr>
            </tbody>
          </table>
        </div>
        <div class="user-amount">
          <div class="amount-left">
            <h3>账户金额</h3>
            <br>
            <div class="num-box">
              <div class="yuan-num">
                <h4>元积分</h4>
                <p>{{balance}}</p>
              </div>
           <!--   <div class="taibao-num">
                <h4>太保积分</h4>
                <p>2000</p>
              </div>-->
            </div>
          </div>
          <div class="amount-right">
            <h3>下载打印收款二维码可便于商户日常经营</h3>
            <input type="button" @click="showImg(258,258)" value="258x258">
            <input type="button" @click="showImg(344,344)" value="344x344">
            <input type="button" @click="showImg(430,430)" value="430x430">
            <input type="button" @click="showImg(860,860)" value="860x860">
            <input type="button" @click="showImg(1280,1280)" value="1280x1280">
            <!-- 创建一个div，并设置id为qrcode -->
            <div id="qrcode" style="display: none"></div>
          </div>
        </div>
      </div>
      <div class="table-box">
        <div class="content-table">
          <div class="table-title">
            <h3>交易流水</h3>
            <br>
            <div class="search-box">
              <div class="total-num">
                <label>当前总额：</label>
                <p>{{totalAmount}}</p>
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
            <el-table :data="flowList" style="width: 100%" ref="multipleTable" tooltip-effect="dark"
                       @sort-change='sortChange'>
              <el-table-column label="手机号码" align="center" min-width="110" sortable='custom'>
                <template slot-scope="scope">
                  <span>{{ scope.row.phone }}</span>
                </template>
              </el-table-column>
              <el-table-column label="创建时间" align="center" min-width="150"  sortable='custom'>
                <template slot-scope="scope">
                  <span>{{ scope.row.create_time }}</span>
                </template>
              </el-table-column>
              <el-table-column label="消费内容" align="center" min-width="130" sortable='custom'>
                <template slot-scope="scope">
                  <span>{{ scope.row.content }}</span>
                </template>
              </el-table-column>
              <el-table-column label="金额" align="center"  min-width="100"  sortable='custom'>
                <template slot-scope="scope">
                  <span>{{ scope.row.consume }}</span>
                </template>
              </el-table-column>
              <el-table-column label="备注" align="center"  min-width="100"  sortable='custom'>
                <template slot-scope="scope">
                  <span>{{ scope.row.remark }}</span>
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

      <el-dialog
        title="图片预览"
        :visible.sync="dialogVisible"
        :width="dialogWidth">
        <img :src="downLoadImg" alt="">
        <span slot="footer" class="dialog-footer">
          <a :href="downLoadImg" download>下载</a>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import QRCode from 'qrcodejs2'  // 引入qrcode

  export default {
    name: "shopDetails",
    components: {},
    data() {
      return {
        totalUser: 0,
        totalAmount: 0,

        flowList: [],
        phone: "",
        name: "",
        idcard: "",

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

        userTable:{}, //用户信息
        balance: 0,//账户金额
        token: "",
        user_id: "",
        clickInfo: "",

        dialogWidth: "30%",
        dialogVisible: false,
        downLoadImg: ""
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
      if (sessionStorage.getItem("clickInfo")){
        this.clickInfo = JSON.parse(sessionStorage.getItem("clickInfo"))
      }
      this.getUserList();
      this.getFlowList()
    },
    watch: {
      time: function () {
        if(this.time===null){
          this.time=["",""]
        } else {
          if (this.time[0] && this.time[1]){
            this.time[0] = this.$utils.formatDate(this.time[0],"yyyy-MM-dd");
            this.time[1] = this.$utils.formatDate(this.time[1],"yyyy-MM-dd");
          }
        }
      }
    },
    computed: {
    },
    methods: {
      //获取用户列表
      getUserList() {
        this.$axios({
          method: "GET",
          url: `${this.$baseURL}/v1/rrpoints-saas/web/stores/${this.clickInfo.id}?user_id=${this.user_id}`,
          headers: {
            'X-Access-Token': this.token,
          }
        }).then(res => {
          this.balance = res.data.data.balance;
          let shopTypes = [
              {
                id: 0,
                name: "4S店、停车、加油、充电、洗车"
              },
              {
                id: 1,
                name: "4S店"
              },
              {
                id: 2,
                name: "停车"
              },
              {
                id: 3,
                name: "加油"
              },
              {
                id: 4,
                name: "充电"
              },
              {
                id: 5,
                name: "洗车"
              }
          ];
          shopTypes.forEach(function (data) {
            if (data.id === Number(res.data.data.store.type)){
              res.data.data.store.type = data.name
            }
          });
          this.userTable = res.data.data.store
        }).catch(error => {
          if(error.response.status === 401){
            this.$router.push("/login")
          }
        })
      },
      //获取交易流水
      getFlowList() {
        this.$axios({
          method: "GET",
          url: `${this.$baseURL}/v1/rrpoints-saas/web/stores/${this.clickInfo.id}/transaction?user_id=${this.user_id}&start_time=${this.time[0]}&end_time=${this.time[1]}&sort=${this.sort}&direction=${this.direction}&page=${this.page-1}&limit=${this.limit}`,
          headers: {
            'X-Access-Token': this.token,
          }
        }).then(res => {
          this.totalUser = Number(res.data.data.pages);
          this.totalAmount = res.data.data.total;
          let that = this;
          if (res.data.data.transactions.length > 0){
            res.data.data.transactions.forEach(function (item) {
              if (item.create_time) {
                item.create_time = that.$utils.formatDate(new Date(item.create_time), "yyyy-MM-dd hh:mm:ss");
              }
            })
          }
          this.flowList = res.data.data.transactions
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
          this.getFlowList()
        } else if (column.order == "ascending"){
          this.direction = "asc";
          this.getFlowList()
        }
      },
      //点击搜索按钮搜索用户列表
      btnSearchUserList() {
        this.page = 1;//按钮搜索时初始化page
        this.getFlowList()
      },
      //更改每页显示条数
      handleSizeChange(val) {
        this.limit = val;
        this.getFlowList()
      },
      //切换分页
      handleCurrentChange(val) {
        this.page = val;
        this.getFlowList()
      },
      //预览图片
      showImg(width,height){
        this.dialogWidth = width + 100 + "px";
        this.dialogVisible = true;
        //生成二维码
        document.getElementById("qrcode").innerHTML = "";
        let qrcode = new QRCode('qrcode', {
          width: width,
          height: height,
          text: this.userTable.wallet_addr, // 二维码地址
          colorDark : "#000",
          colorLight : "#fff",
        });
        setTimeout(()=> {
          this.downLoadImg = document.getElementById("qrcode").getElementsByTagName('img')[0].getAttribute('src')
        })
      }

    }
  }
</script>

<style scoped lang="stylus">
  .shopDetails {
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
        height: 400px;
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
        display: flex;
        flex-direction: row;
        .amount-left{
          border-right 12px solid #f1f3f9;
          width: 330px;
          h3{
            font-size: 18px;
            color: #333333;
            margin: 20px 0 0 20px;
          }
          .num-box{
            display flex
            flex-direction row
            margin-left: 90px;
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
        .amount-right{
          h3{
            font-size: 18px;
            color: #333333;
            margin: 20px 0 20px 20px;
          }
          input{
            width: 120px;
            height: 48px;
            background-color: #386cff;
            border-radius: 4px;
            margin: 0 22px;
            font-size: 18px;
            color: #fefefe;
            outline: none;
            cursor: pointer;
            margin-right 18px
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


  .shopDetails{
    .el-dialog__body{
      text-align center
    }
    .el-dialog__footer{
      text-align center
      a{
        width: 120px;
        height: 48px;
        line-height 48px
        display inline-block
        background-color: #386cff;
        border-radius: 4px;
        margin: 0 22px;
        font-size: 18px;
        color: #fefefe;
        outline: none;
        cursor: pointer;
      }
    }
  }
</style>
