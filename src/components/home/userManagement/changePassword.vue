<template>
  <div class="changePassword">
    <div class="list_wrap">
      <div style="position: relative; background-color: rgb(241,243,249);padding-left: 16px;">
        <div class="content-title">
          <img src="@/common/images/dianpu.png" alt="">
          <h3>修改密码</h3>
        </div>
        <div class="content-box">
          <div class="bg-box">
            <div class="pwd-box">
              <el-form :model="ruleform" :rules="rules" ref="ruleForms" >
                <el-form-item prop="oldPassword">
                  <div class="input-wraper">
                    <el-input clearable type="password" v-model="ruleform.oldPassword" placeholder="请输入原密码"></el-input>
                    <img src="@/common/images/icon_user.png" alt="">
                  </div>
                </el-form-item>
                <el-form-item prop="password">
                  <div class="input-wraper">
                    <el-input clearable type="password" class="text" placeholder="请输入新密码 (6-20位数字、字母或特殊符号）" v-model="ruleform.password"></el-input>
                    <img src="@/common/images/icon_password.png" alt="">
                  </div>
                </el-form-item>
                <el-form-item prop="checkPassword">
                  <div class="input-wraper">
                    <el-input clearable type="password" class="text" placeholder="请再次输入密码" v-model="ruleform.checkPassword"></el-input>
                    <img src="@/common/images/icon_password.png" alt="">
                  </div>
                </el-form-item>
              </el-form>
              <p class="login-btn" @click="">修改密码</p>
              <div class="errorTip_wrap" >
                <div class="errorTip" v-if="errorTip">{{errorMessage}}</div>
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
    name: "changePassword",
    components: {},
    data() {
      var validateOldPass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入原密码'));
        } else {
          if (this.ruleform.oldPassword !== '') {
            this.$refs.ruleform.validateField('oldPassword');
          }
          callback();
        }
      };
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleform.checkPassword !== '') {
            this.$refs.ruleform.validateField('checkPassword');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleform.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        ruleform: {
          oldPassword: "", // 旧密码
          password: "", // 密码
          checkPassword: "", // 密码
        },
        rules: {
          oldPassword: [
            {validator: validateOldPass, trigger: 'blur'},
            {}
          ],
          password: [
            {validator: validatePass, trigger: 'blur'},
            {}
          ],
          checkPassword: [
            {validator: validatePass2, trigger: 'blur'},
            {}
          ],
        },
        errorMessage: "",//错误提示信息
        errorTip: false,


        totalUser: 100,
        count_user: "",
        count_with_address: "",
        count_with_idcard: "",
        count_with_vehicle: "",
        totalYJF: "",
        totalYDD: "",
        totalGGD: "",
        userList: [
          {
            "address":"0x319f6b90********240x314C19",
            "shopName": "王宏洗车店维修保养",
            "time": "2019-06-27 17:25:25",
            "location": "北京市朝阳区八里庄西里100号远洋国际中心A座6273"
          },
          {
            "address":"0x75f0C181********4C1x314317",
            "shopName": "北京朝阳燕鑫兆元洗车店（北京朝阳0-1分店）",
            "time": "2019-05-22 10:11:20",
            "location": "北京市朝阳区太阳共镇下家园0-3院"
          },
          {
            "address":"0x95f8637c********5f9p4f9312",
            "shopName": "昌平奔驰4S店分院",
            "time": "2018-05-22 13:01:50",
            "location": "北京市通州区安顺路257号"
          },
          {
            "address":"0x79f21321********5f0C4314C26",
            "shopName": "北京市德安汽车修理厂",
            "time": "2019-09-27 16:16:28",
            "location": "北京市安德里北街25号"
          },
          {
            "address":"0x9ht51p81********cf0942gwD15",
            "shopName": "北京鹏程汽修",
            "time": "2018-04-16 10:28:05",
            "location": "北京市通州区京榆旧路四海公寓附近"
          },
          {
            "address":"0x2h8j7ct4********67d6c8gk7fp",
            "shopName": "万达汽车修理有限公司(万达洗车)",
            "time": "2019-07-03 06:54:17",
            "location": "城南路22号(东寺渠大桥南50米路东)"
          },
          {
            "address":"0x9p4fw0C1********x314429f6b9",
            "shopName": "有壹手快修(京密路店)",
            "time": "2018-10-22 11:32:12",
            "location": "朝阳区来广营东路甲2号(近平治汽车服务有限公司)"
          },
          {
            "address":"0x976ff0wj********1q0df224wx0",
            "shopName": "月福洗车",
            "time": "2019-12-05 14:45:09",
            "location": "北京市通州区九棵树东路25号"
          },
          {
            "address":"0x4f938gk7f********c9f212fgC24",
            "shopName": "汽车维修养护洗车",
            "time": "2019-09-15 08:18:55",
            "location": "北京市玉带河西街171号附近"
          },
          {
            "address":"0df22Wjp86********gB79g4G6h73",
            "shopName": "宝马4s店",
            "time": "2018-02-16 17:16:17",
            "location": "北京市丰台区西罗园街道西罗园南里44号"
          }
        ],
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
        //this.$router.push("/home/userManagement/shopDetails");
        window.open("/home/userManagement/shopDetails",'_blank');
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

<style lang="stylus">
  .changePassword {
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

      .content-box{
        width: 100%
        height: 700px
        background-color: #FFFFFF
        margin-top 16px
        display: flex;
        align-items: flex-end;
        .bg-box{
          width: 100%
          height: 470px
          background url("../../../common/images/bg_2.png") no-repeat center
          background-size 100% 100%
          .pwd-box{
            width: 460px;
            height: 340px;
            background-color: #ffffff;
            box-shadow: 0 14px 42px 3px rgba(195, 195, 195, 0.44);
            border-radius: 30px;
            position: relative;
            left: 400px;
            top: -80px;
            padding: 40px 50px 50px 70px;
            .input-wraper{
              display: flex;
              flex-direction: row;
              align-items: center;
              img{
                width: 26px;
                height: 20px;
                position: relative;
                right: 355px;
              }
              .el-input__inner{
                width: 326px
                height: 48px;
                background-color: #f6f8fe;
                border-radius: 10px;
                padding-left: 52px;
              }
            }
            .login-btn {
              width: 270px;
              height: 54px;
              background-color: #306af6;
              border-radius: 10px;
              margin 0 auto
              margin-top 30px
              margin-right: 48px;
              cursor pointer
              line-height 54px
              text-align center
              color #ffffff
              font-size: 20px;
            }
            .errorTip_wrap {
              width 100%
              text-align center
              font-size 0
              position absolute
              top 50%
              .errorTip {
                display inline-block
                box-sizing border-box
                line-height 1.2
                max-width 520px;
                padding 20px 30px
                background-color #000000
                opacity 0.7
                font-size 18px;
                color #ffffff
                border-radius 30px
              }
            }
          }
        }
      }
    }
  }
</style>
