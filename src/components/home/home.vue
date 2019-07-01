<template>
  <div class="home">
    <!--<div class="head_wrap">
      <div class="head">
        <Dropdown style="margin-left: 20px" trigger="click" class="user_info">
          <Button type="primary">
            {{"admin"}}
            <Icon type="ios-arrow-down"></Icon>
          </Button>
          <DropdownMenu slot="list">
            <DropdownItem>修改密码</DropdownItem>
            <DropdownItem><span @click="logOff">退出登录</span></DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>-->
    <router-view class="home_main"></router-view>
  </div>
</template>

<script>
  export default {
    name: "home",
    components: {},
    data() {
      return {
        isLogin: true,
        switchover: false,
        session_id: "",
      }
    },
    created() {
    },
    beforeMount() {
/*      if(!sessionStorage.myLogin){
        this.$router.push("/login")
      }*/
    },
    mounted() {
      this.session_id = JSON.parse(sessionStorage.getItem("myLogin")).data.id;
    },
    watch: {},
    computed: {},
    methods: {
      toggle() {
        this.switchover = !this.switchover
      },
      leaveUl() {
        this.switchover = false
      },
      dropOut() {
      },
      logOff(){
        this.$axios({
          method: "DELETE",
          url: `${this.$baseURL}/v1/backstage/sessions/${this.session_id}`,
          data: this.$querystring.stringify({})
        }).then(res => {
          sessionStorage.removeItem("myLogin");
          this.$router.push("/login")
        }).catch(error => {
          console.log(error)
        })
      }
    },
  }
</script>

<style scoped lang="stylus">
  .home {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    .home_main{
      flex: 1;
      min-width 1200px
      //margin: 0 auto;
    }
  }
</style>
