<template>
  <div class="userManagement">
    <el-container>
      <el-aside width="170px" class="nav-aside">
        <div class="header">
          <img src="@/common/images/header.png" alt="">
          <p>{{phone.substring(3)}}</p>
        </div>
        <el-menu default-active="userQuery" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose"
                 unique-opened>
          <el-menu-item index="userQuery">
            <router-link to="/home/userManagement/shopsQuery">
              <i class="icon1"></i>
              店铺管理
            </router-link>
          </el-menu-item>
          <el-menu-item index="accountRanking">
            <router-link to="/home/userManagement/serviceQuery">
              <i class="icon2"></i>
              服务包管理
            </router-link>
          </el-menu-item>
          <el-menu-item index="accountRanking">
            <router-link to="/home/userManagement/changePassword">
              <i class="icon3"></i>
              修改密码
            </router-link>
          </el-menu-item>
          <el-menu-item index="accountRanking">
            <router-link to="/home/userManagement/paymentVerification">
              <i class="icon5"></i>
              商户收款验证
            </router-link>
          </el-menu-item>
          <el-menu-item index="accountRanking">
            <a href="javascript:void(0);" class="{'is-checked',isChecked}" @click="logout()">
              <i class="icon4"></i>
              退出账号
            </a>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main class="" style="margin: 0;padding: 0;">
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  export default {
    name: "userManagement",
    components: {},
    data() {
      return {
        token: '',
        user_id: '',
        phone: '',
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
        this.phone = JSON.parse(sessionStorage.getItem("userInfo")).phone;
      } else {
        this.$router.push("/login")
      }
    },
    watch: {},
    computed: {},
    methods: {
      handleOpen(key, keyPath) {
        // console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        // console.log(key, keyPath);
      },
      logout(){
        this.$confirm('确定退出?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.$axios({
            method: 'delete',
            url: `${this.$baseURL}/v1/rrpoints-saas/web/sessions/${this.user_id}`,
            headers: {
              'X-Access-Token': this.token,
              'Del-Token': this.token,
            }
          }).then(res => {
            sessionStorage.removeItem("userInfo");
            this.$router.push("/login")
          }).catch(error => {
            console.log(error);
          })
        }).catch(() => {
        });
      }
    },
  }
</script>

<style scoped lang="stylus">
  .userManagement {
    .header{
      height: 160px
      text-align center
      font-size: 20px;
      color: #333333;
      img{
        margin: 20px 0 10px 0
      }
    }

    a {
      font-size: 18px;
      color #333333
      display inline-block
      width: 256px
      height: 60px
      i{
        width: 22px;
        height: 22px;
        display inline-block
        margin 0px 6px 0 20px
      }
      .icon1{
        background url("../../../common/images/dianpu_mr.png") no-repeat center
        background-size 100% 100%
      }
      .icon2{
        background url("../../../common/images/fuwu_mr.png") no-repeat center
        background-size 100% 100%
      }
      .icon3{
        background url("../../../common/images/mima_mr.png") no-repeat center
        background-size 100% 100%
      }
      .icon4{
        background url("../../../common/images/tuichu_mr.png") no-repeat center
        background-size 100% 100%
      }
      .icon5{
        background url("../../../common/images/shoukuan_icon.png") no-repeat center
        background-size 100% 100%
      }
    }

    .router-link-active {
      color: #ffffff;
/*      i{
        width: 22px;
        height: 22px;
        display inline-block
        background url("../../../common/images/dianpu_mr.png") no-repeat center
        background-size 100% 100%
      }*/
    }

  }
</style>
<style lang="stylus">
  .el-aside{
    width:256px
    overflow-x:hidden;
    .el-menu{
      border: none
      .el-menu-item{
        height: 60px;
        padding:0
        padding-left 0 !important
      }
      .router-link-active{
        background: linear-gradient(to right, rgb(161,175,255), rgb(49,107,246) ); /* 标准的语法 */
      }
    }

  }


</style>
