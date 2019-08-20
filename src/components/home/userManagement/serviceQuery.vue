<template>
  <div class="serviceQuery">
    <div class="list_wrap">
      <div style="position: relative; background-color: rgb(241,243,249);padding-left: 16px;">
        <div class="content-title">
          <img src="@/common/images/service.png" alt="">
          <h3>服务包管理</h3>
        </div>
        <div class="content-query">
          <label>店铺名称：</label>
          <el-input v-model="store_name" placeholder="请输入店铺名称" clearable style="width: 500px"></el-input>
          <label>服务包名称：</label>
          <el-input v-model="service_name" placeholder="请输入服务包名称" clearable style="width: 380px"></el-input>
          <br/>
          <br/>
          <br/>
          <label>创建时间：</label>
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
            <div class="points-box">
              <div class="shop-num">
                <h4>服务包总数</h4>
                <p>{{totalPkgs}}</p>
              </div>
             <!-- <div class="yuan-num">
                <h4>元积分</h4>
                <p>9000</p>
              </div>
              <div class="taibao-num">
                <h4>太保积分</h4>
                <p>2000</p>
              </div>-->
            </div>
            <div class="add-package"  @click="openModal()">
              <p>新增服务包</p>
            </div>
          </div>
          <div class="table-details">
            <el-table :data="servicePkgList" style="width: 100%" ref="multipleTable" tooltip-effect="dark" @selection-change="handleSelectionChange"
                       @sort-change='sortChange'>
              <el-table-column type="selection" align="center" width="50">
              </el-table-column>
              <el-table-column label="编号" align="center" type="index" width="50">
              </el-table-column>
              <el-table-column label="店铺名称" align="center" min-width="180" sortable='custom'>
                <template slot-scope="scope">
                  <span>{{ scope.row.store_name }}</span>
                </template>
              </el-table-column>
              <el-table-column label="服务包名称" align="center" min-width="120" sortable='custom'>
                <template slot-scope="scope">
                  <span>{{ scope.row.service_name }}</span>
                </template>
              </el-table-column>
              <el-table-column label="创建时间" align="center" min-width="120" sortable='custom'>
                <template slot-scope="scope">
                  <span>{{ scope.row.created_time }}</span>
                </template>
              </el-table-column>
              <el-table-column label="价格" align="center" sortable='custom'>
                <template slot-scope="scope">
                  <span>{{ scope.row.price }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" min-width="120"  align="center">
                <template slot-scope="scope">
                  <div class="operate">
                    <div class="upper" v-if="scope.row.state === 1?true:false">
                      <span @click="statusChange(scope.row)">上架</span>
                      <span>已下架</span>
                    </div>
                    <div class="under" v-else>
                      <span>已上架</span>
                      <span @click="statusChange(scope.row)">下架</span>
                    </div>
                    <div class="edit">
                      <span @click="editModal(scope.row)">编辑</span>
                    </div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <div class="table-footer">
              <div style="margin-top: 20px;margin-bottom: 20px;">
                <el-button type="primary" @click="handleDeletes" icon="el-icon-delete" class="delete-btn">删除服务包</el-button>
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

    <el-dialog :title="isAddNew?'新增服务包':'编辑服务包'" :visible.sync="dialogFormVisible" center>
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="指定店铺" prop="store_id"  :label-width="formLabelWidth">
          <el-select v-model="form.store_id" placeholder="请选择活动区域">
            <el-option
              v-for="item in shopsList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="服务包" prop="service_name"  :label-width="formLabelWidth">
          <el-input v-model="form.service_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="积分种类" :label-width="formLabelWidth">
          <!--<el-input v-model="form.name2" autocomplete="off"></el-input>-->
          <p>积分</p>
        </el-form-item>
        <el-form-item label="积分金额" prop="price"  :label-width="formLabelWidth">
          <el-input v-model="form.price" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="state"  :label-width="formLabelWidth">
          <el-radio-group v-model="form.state">
            <el-radio :label="0">上架</el-radio>
            <el-radio :label="1">下架</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <span class="confirm" @click="modalSubmit('form')" v-if="isAddNew">确定</span>
        <span class="confirm" @click="editSubmit('form')" v-else>确定</span>
        <span class="cancel" @click="modalCancel()">取消</span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "serviceQuery",
    components: {},
    data() {
      return {
        totalUser: 0,


        servicePkgList: [],
        phone: "",
        name: "",
        service_name: "",
        multipleSelection: [],
        //multipleDelete: [],
        loading: false,
        currentPage: 1,
        //total: 10,
        page: 1,
        limit: 10,
        time:["",""],
        email:"",
        store_name:"",

        platform:"",
        appname:"",
        direction:"",
        sort:"",

        isAddNew: true,
        totalPkgs: 0, //服务包总数
        shopsList:[], //店铺列表
        service_id: "", //服务包id

        dialogFormVisible: false,
        form: {
          service_name: '',
          price: '',
          store_id: '',
          state: '',
        },
        formLabelWidth: '120px',

        rules: {
          store_id: [
            { required: true, message: '请选择店铺名称', trigger: 'change' }
          ],
          service_name: [
            { required: true, message: '请输入服务包名称', trigger: 'blur' }
          ],
          price: [
            { required: true, message: '请输入积分金额', trigger: 'blur' }
          ],
          state: [
            { required: true, message: '请选择状态', trigger: 'change' }
          ],

        },
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
      this.getUserList();
      this.getShopsList()
    },
    watch: {
      time: function () {
        if(this.time===null){
          this.time=["",""]
        } else {
         /* this.time[0] = new Date(this.time[0]).toUTCString() === "Invalid Date" ? "" : new Date(this.time[0]).toUTCString();
          this.time[1] = new Date(this.time[1]).toUTCString() === "Invalid Date" ? "" : new Date(this.time[1]).toUTCString();*/
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
      // 服务包上架/下架
      statusChange(row){
        this.$axios({
          method: 'post',
          url: `${this.$baseURL}/v1/rrpoints-saas/web/services/${row.id}`,
          data: this.$querystring.stringify({
            user_id: this.user_id,
            state: row.state === 0 ? 1 : 0
          }),
          headers: {
            'X-Access-Token': this.token,
          }
        }).then(res => {
          this.getUserList()
        }).catch(error => {
        })
      },
      //打开modal
      openModal(){
        this.dialogFormVisible = true;
        this.isAddNew = true;
        this.form = {
          service_name: '',
          price: '',
          store_id: '',
          state: '',
        }
      },
      // 新增服务包
      modalSubmit(form){
        this.$refs[form].validate((valid) => {
          if (valid) {
            let data = {
              user_id: this.user_id,
              store_id: this.form.store_id,
              service_name: this.form.service_name,
              price: this.form.price,
              state: this.form.state,
            };
            this.$axios({
              method: 'post',
              url: `${this.$baseURL}/v1/rrpoints-saas/web/services`,
              data: this.$querystring.stringify(data),
              headers: {
                'X-Access-Token': this.token,
              }
            }).then(res => {
              this.modalCancel();
              this.getUserList()
            }).catch(error => {
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      },
      //编辑modal
      editModal(row){
        this.dialogFormVisible = true;
        this.isAddNew = false;
        this.form = {
          store_id: "",
          service_name: row.service_name,
          price: row.price,
          state: row.state,
        };
        this.service_id = row.id;
        if (this.shopsList){
          this.shopsList.forEach((function (item) {
            if (item.name === row.store_name){
              this.form.store_id = item.id
            }
          }).bind(this))
        }
      },
      //编辑服务包
      editSubmit(form){
        this.$refs[form].validate((valid) => {
          if (valid) {
            let data = {
              user_id: this.user_id,
              store_id: this.form.store_id,
              service_name: this.form.service_name,
              price: this.form.price,
              state: this.form.state,
            };
            this.$axios({
              method: 'post',
              url: `${this.$baseURL}/v1/rrpoints-saas/web/services/${this.service_id}`,
              data: this.$querystring.stringify(data),
              headers: {
                'X-Access-Token': this.token,
              }
            }).then(res => {
              this.modalCancel();
              this.getUserList()
            }).catch(error => {
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      },
      //关闭modal
      modalCancel(){
        this.dialogFormVisible = false;
        this.form = {
          service_name: '',
          price: '',
          store_id: '',
          state: '',
        }
      },
      //查询服务包列表 select
      getShopsList() {
        this.$axios({
          method: "GET",
          url: `${this.$baseURL}/v1/rrpoints-saas/web/stores?user_id=${this.user_id}&date_from=${this.time[0]}&date_to=${this.time[1]}&sort=${this.sort}&direction=${this.direction}&page=${this.page-1}&limit=${this.limit}`,
          headers: {
            'X-Access-Token': this.token,
          }
        }).then(res => {
          this.shopsList = res.data.data.stores;
        }).catch(error => {
          console.log(error)
        })
      },
      //获取服务包列表
      getUserList() {
        this.$axios({
          method: "GET",
          url: `${this.$baseURL}/v1/rrpoints-saas/web/services?user_id=${this.user_id}&service_name=${this.service_name}&store_name=${this.store_name}&start_time=${this.time[0]}&end_time=${this.time[1]}&sort=${this.sort}&direction=${this.direction}&page=${this.page-1}&limit=${this.limit}`,
          headers: {
            'X-Access-Token': this.token,
          }
        }).then(res => {
          this.totalUser = Number(res.data.data.total);
          this.totalPkgs = res.data.data.total;
          this.servicePkgList = res.data.data.services
        }).catch(error => {
          if(error.response.status === 401){
            this.$router.push("/login")
          }
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
        this.$confirm('确定删除此服务包?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.$axios({
            method: "DELETE",
            url: `${this.$baseURL}/v1/rrpoints-saas/web/services/${this.multipleDelete[0]}?user_id=${this.user_id}`,
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
  .serviceQuery {
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
          margin-right: 175px;
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
            padding: 18px 22px 0 22px
            color #FFFFFF
            display flex
            flex-direction row
            justify-content space-between
            .points-box{
              display flex
              flex-direction row
              align-items center
              h4{
                font-size: 14px;
                padding: 10px 0 4px 0
              }
              p{
                font-size: 24px;
              }
              .shop-num{
                width: 138px;
                height: 56px;
                text-align center
                background url("../../../common/images/shop.png") no-repeat center
                background-size 100% 100%
              }
              .yuan-num{
                width: 138px;
                height: 56px;
                text-align center
                background url("../../../common/images/yuan.png") no-repeat center
                background-size 100% 100%
                margin 0 24px
              }
              .taibao-num{
                width: 138px;
                height: 56px;
                text-align center
                background url("../../../common/images/taibao.png") no-repeat center
                background-size 100% 100%
              }
            }
            .add-package{
              width: 116px;
              height: 48px;
              line-height 48px
              background-color: #386cff;
              border-radius: 4px;
              cursor pointer
              color: #ffffff;
              text-align center
              margin-top: 4px;
              margin-right: 174px;
              p{
                font-size: 18px;
              }
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
    .operate{
      display flex
      flex-direction row
      align-items center
      .upper{
        span{
          display inline-block
        }
        span:nth-child(1){
          width: 50px;
          height: 24px;
          line-height 24px
          border-radius: 4px;
          border: solid 1px #386cff;
          font-size: 14px;
          color: #386cff;
          text-align center
          margin-right 20px
          cursor pointer
        }
        span:nth-child(2){
          font-size: 14px;
          color: #386cff;
        }
      }
      .under{
        span{
          display inline-block
        }
        span:nth-child(1){
          font-size: 14px;
          color: #386cff;
          margin-right 20px
        }
        span:nth-child(2){
          width: 50px;
          height: 24px;
          line-height 24px
          border-radius: 4px;
          border: solid 1px #386cff;
          font-size: 14px;
          color: #386cff;
          text-align center
          cursor pointer
        }
      }
      .edit{
        span{
          display inline-block
          font-size: 14px;
          color: #386cff;
          cursor pointer
          margin-left 20px
        }
      }
    }
  }
</style>
<style lang="stylus">
  .el-pagination__editor.el-input{
    margin-right 2px
  }
  .el-select-dropdown{
    min-width 287px !important
  }
  .el-dialog{
    width: 530px !important
    .el-dialog__body{
      padding-bottom 0
      .el-form-item{
        .el-input{
          width: 287px;
          .el-input__inner{
            border: solid 1px #dfe6f7;
            border-radius: unset;
          }
        }
      }
    }
    .el-dialog__footer{
      .dialog-footer{
        .confirm{
          width: 72px;
          height: 30px;
          line-height 30px
          background-color: #386cff;
          border-radius: 4px;
          display inline-block
          font-size: 14px;
          color: #ffffff;
          cursor pointer
          margin-right 36px
        }
        .cancel{
          width: 72px;
          height: 30px;
          line-height 30px
          border-radius: 4px;
          border: solid 1px #386cff;
          display inline-block
          font-size: 14px;
          color: #386cff;
          cursor pointer
        }
      }
    }

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
