<template>
  <div class="userManagement">
    <el-container>
      <el-aside width="170px" class="nav-aside">
        <div class="header">
          <img src="@/common/images/header.png" alt="">
          <p>13512333333</p>
        </div>
        <el-menu default-active="userQuery" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose"
                 unique-opened>
          <el-menu-item index="userQuery">
            <router-link to="/home/userManagement/userQuery">
              <i class="icon1"></i>
              店铺管理
            </router-link>
          </el-menu-item>
          <el-menu-item index="accountRanking">
            <router-link to="/home/userManagement/merchantQuery">
              <i class="icon2"></i>
              服务包管理
            </router-link>
          </el-menu-item>
         <!-- <el-menu-item index="accountRanking">
            <router-link to="/home/userManagement/systemQuery">
              <i class="icon3"></i>
              修改密码
            </router-link>
          </el-menu-item>-->
          <el-menu-item index="accountRanking">
            <a href="javascript:void(0);" class="{'is-checked',isChecked}" @click="logout()">
              <i class="icon4"></i>
              退出账号
            </a>
          </el-menu-item>
        <!--  <el-menu-item index="accountRanking">
            <router-link to="/home/userManagement/apiUserQuery">
              <i class="icon5"></i>
              API账户查询
            </router-link>
          </el-menu-item>-->
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
      }
    },
    created() {
    },
    beforeMount() {
    },
    mounted() {
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
          sessionStorage.removeItem("myLogin");
          this.$router.push("/login")
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
