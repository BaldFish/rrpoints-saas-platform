<template>
  <div class="forgetPwd">
    <div class="login-container">
      <div class="content">
        <p class="title">找回密码</p>
        <p class="title-notice">请输入注册时的手机号码，将发送验证码给您</p>
        <el-form :model="ruleform" :rules="rules" ref="ruleForms" >
          <el-form-item prop="userName">
            <div class="input-wraper">
              <el-input class="phone-wrap" v-model="ruleform.userName" clearable placeholder="请输入手机号"></el-input>
              <img src="@/common/images/icon_user.png" alt="">
            </div>
          </el-form-item>
          <el-form-item prop="captchaCode" class="code-box">
            <div class="input-wraper">
              <el-input clearable class="text" placeholder="请输入验证码" v-model="ruleform.captchaCode"></el-input>
              <img src="@/common/images/icon_code.png" alt="">
              <img class="captcha-code" @click="getCaptcha" :src="captcha_number" alt="">
            </div>
          </el-form-item>
        </el-form>
        <p class="login-btn" @click="login('ruleForms')">找回密码</p>
        <div class="errorTip_wrap" >
          <div class="errorTip" v-if="errorTip">{{errorMessage}}</div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  export default {
    name: "forgetPwd",
    components: {},
    data() {
      var checkPhone = (rule, value, callback) => {
        var reg = /^1[3-9]\d{9}$/; //验证规则
        if (value === '') {
          callback(new Error('请输入手机号'));
        } else {
          console.log(reg.test(value))
          if (reg.test(value)) {
            callback();
          } else {
            callback(new Error('请输入正确手机号'));
          }

        }
      };
      var checkVerify = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入验证码'));
        } else {
          callback();
        }
      };
      return {
        ruleform: {
          userName: "", // 手机号
          captchaCode: "", // 验证码
        },
        rules: {
          userName: [
            {validator: checkPhone, trigger: 'blur'},
            {}
          ],
          captchaCode: [
            {validator: checkVerify, trigger: 'blur'},
            { min: 1, max: 4, message: '验证码长度不对', trigger: 'blur' }
          ],

        },
        captcha_number: "",
        captcha_id: "",
        errorMessage: "",//错误提示信息
        errorTip: false,
      }
    },
    created() {
    },
    beforeMount() {
      this.$nextTick(() => {
        this.getCaptcha()
      });
    },
    mounted() {
    },
    watch: {},
    computed: {},
    methods: {
      //获取图片验证码
      getCaptcha() {
        this.$axios({
          method: 'post',
          url: `${this.$baseURL}/v1/captcha`,
          data: this.$querystring.stringify({})
        }).then(res => {
          this.captcha_number = `data:image/png;base64,${res.data.png}`;
          this.captcha_id = res.data.captcha_id;
        }).catch(error => {
          console.log(error);
        });
      },
      //登录
      login(formName) {

        this.$refs[formName].validate((valid) => {
          if (valid) {
            let loginData = { "code": "2000", "message": "success", "data": { "id": "5c6e61675fe92912f48c5f11", "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NzcxNTQwNTYsInVzZXJfaWQiOiI1YzZlNjE2NzVmZTkyOTEyZjQ4YzVmMTEiLCJkZXZpY2VfaWQiOiJhZG1pbkRldmljZUlEIn0.OMu1ibaHfM7hFpxX0AVwA0nDIlPOMsGygUSFP19h7xU" } }
            sessionStorage.setItem("myLogin", JSON.stringify(loginData));
            this.$router.push("/home")
          } else {
            console.log('error submit!!');
            return false;
          }
        });



        this.getCaptcha();
        /*let loginData = {
          username: this.ruleform.userName,
          password: this.ruleform.password,
          captcha_id: this.captcha_id,
          captcha_code: this.captchaCode,
        };
        this.$axios({
          method: "POST",
          url: `${this.$baseURL}/v1/backstage/sessions`,
          data: this.$querystring.stringify(loginData)
        }).then(res => {
          sessionStorage.setItem("myLogin", JSON.stringify(res.data));
          this.$router.push("/home")
        }).catch(error => {
          this.errorMessage = "登录失败";
          this.errorTip = true;
          let that = this;
          window.setTimeout(function () {
            that.errorTip = false;
          }, 2000);
        })*/
      }
    },
  }
</script>

<style lang="stylus">
  .forgetPwd {
    width: 100%
    height: 100%
    background: url("../../common/images/bg_2.png") no-repeat center
    background-size 100% 100%

    .login-container {
      width: 536px;
      height: 600px;
      background: url("../../common/images/forgetPwd-box.png") no-repeat center
      margin-top: 4%;
      margin-left: 24%;

      .content {
        width: 326px
        margin 0 auto
        padding-top: 50px;
        position relative

        .title {
          font-size: 18px;
          color: #0d0d0d;
          text-align center
          margin 130px 0 30px 0
        }

        .title-notice{
          font-size: 14px;
          color: #999999;
          margin-bottom: 20px;
        }

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
          .captcha-code{
            width: 88px;
            height: 38px;
            right: 170px;
            cursor pointer
          }
          .el-input__inner{
            width: 326px
            height: 48px;
            background-color: #f6f8fe;
            border-radius: 10px;
            padding-left: 52px;
          }
        }
        .code-box{
          .el-input__suffix{
            margin-right 100px
          }
        }

        .checkError {
          font-size: 14px;
          color: #e60000;
          margin: 14px 0 22px 0
        }

        .login-btn {
          width: 270px;
          height: 54px;
          background-color: #306af6;
          border-radius: 10px;
          margin 0 auto
          margin-top 30px
          margin-right: 26px;
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
</style>
