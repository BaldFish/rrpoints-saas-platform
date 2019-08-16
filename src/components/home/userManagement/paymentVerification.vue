<template>
  <div class="paymentVerification">
    <div class="head_wrap">
      <img src="@/common/images/shoukuan.png" alt="">
      <h3>商户收款验证</h3>
    </div>
    <div class="content_wrap">
      <div class="content">
        <div class="code_wrap">
          <img src="@/common/images/erweima.png" alt="">
          <div class="tips_wrap">
            <h3>开启商户收款验证</h3>
            <p class="up">使用微信扫描左侧二维码并关注我们的微信公众号，您将会收到验证码</p>
            <p class="down">输入您收到的微信消息中的验证码：</p>
            <input type="text" v-model="code"><span @click="verification">验证并开启</span>
          </div>
        </div>
      </div>
    </div>
    <div class="errorTip_wrap" v-if="errorTip">
      <div class="errorTip">{{errorMessage}}</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "paymentVerification",
    components: {},
    data() {
      return {
        storeId:"",
        token:"",
        userId:"",
        code:"",
        errorTip: false,
        errorMessage: "",
      }
    },
    created() {
      if (sessionStorage.getItem("userInfo")){
        this.userId = JSON.parse(sessionStorage.getItem("userInfo")).user_id;
        this.token = JSON.parse(sessionStorage.getItem("userInfo")).token;
      } else {
        this.$router.push("/login")
      }
    },
    beforeMount() {
    },
    mounted() {
    },
    watch: {
      code: function (val) {
        if (this.code && !/^\d{1,6}$/.test(val)) {
          this.code = this.code.slice(0, this.code.length - 1)
        }
      }
    },
    computed: {},
    methods: {
      verification(){
        if(this.code&&this.code.length===6){
          this.$axios({
            method: 'post',
            url: `${this.$baseURL}/v1/rrpoints-saas/web/bind`,
            data: this.$querystring.stringify({
              user_id: this.userId,
              code: this.code
            }),
            headers: {
              'X-Access-Token': this.token,
            }
          }).then(res => {
            this.errorMessage = "开启成功";
            this.errorTip = true;
            this.code="";
            window.setTimeout(() => {
              this.errorTip = false;
            }, 2000);
          }).catch(error => {
            this.errorMessage = error.response.data.message;
            this.errorTip = true;
            window.setTimeout(() => {
              this.errorTip = false;
            }, 2000);
          })
        }else{
          this.errorMessage = "请输入正确的验证码";
          this.errorTip = true;
          window.setTimeout(() => {
            this.errorTip = false;
          }, 2000);
        }
      }
    },
  }
</script>

<style scoped lang="stylus">
  .paymentVerification {
    min-width:1167px;
    background-color #f0f3fa
    .head_wrap{
      margin-left 15px
      height:60px;
      background:rgba(255,255,255,1);
      font-size 0
      display flex
      align-items center
      img{
        margin-left 15px
      }
      h3{
        margin-left 13px
        font-size:18px;
        font-family:SourceHanSansCN-Regular;
        color:rgba(51,51,51,1);
      }
    }
    .content_wrap{
      margin-top 17px
      margin-left 15px
      height:823px;
      background:rgba(255,255,255,1);
      padding-top 56px
      padding-left 40px
      padding-right 40px
      .content{
        min-width:1087px;
        height:739px;
        background:rgba(246,248,254,1);
        border-radius:4px;
        display flex
        justify-content center
        align-items center
        .code_wrap{
          width:951px;
          height:430px;
          background:rgba(255,255,255,1);
          display flex
          //justify-content center
          align-items center
          img{
            margin-left 95px
            margin-right 92px
          }
          .tips_wrap{
            h3{
              font-size:20px;
              font-family:SourceHanSansCN-Regular;
              font-weight:bold;
              color:rgba(51,51,51,1);
            }
            .up{
              margin-top 16px
              width:391px;
              font-size:14px;
              line-height 15px
              font-family:SourceHanSansCN-Normal;
              color:rgba(51,51,51,1);
            }
            .down{
              margin-top 28px
              font-size:12px;
              font-family:SourceHanSansCN-Normal;
              color:rgba(51,51,51,1);
              margin-bottom 14px
            }
            input{
              width:120px;
              height:26px;
              border:1px solid rgba(210,210,210,1);
              border-radius:4px;
              text-align center
              outline:none;
            }
            span{
              display inline-block
              font-size:14px;
              font-family:SourceHanSansCN-Normal;
              color:rgba(255,255,255,1);
              padding 6px 11px
              background:rgba(56,108,255,1);
              border-radius:4px;
              margin-left 8px
              cursor pointer
            }
          }
        }
      }
    }
    .errorTip_wrap {
      width 100%
      height 100%
      position fixed
      left 0
      top 0
      display flex
      align-items center
      justify-content center
  
      .errorTip {
        line-height 1.6
        max-width 300px;
        padding 10px 15px
        background-color #000000
        opacity 0.7
        font-size 16px; /*px*/
        color #ffffff
        border-radius 15px
      }
    }
  }
</style>