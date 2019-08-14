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
            <h3>开启手机身份验证</h3>
            <p class="up">使用微信扫描左侧二维码并关注我们的微信公众号，您将会收到验证码</p>
            <p class="down">输入您收到的微信消息中的验证码：</p>
            <input type="text"><span>验证并开启</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "paymentVerification",
    components: {},
    data() {
      return {}
    },
    created() {
    },
    beforeMount() {
    },
    mounted() {
    },
    watch: {},
    computed: {},
    methods: {},
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
  }
</style>