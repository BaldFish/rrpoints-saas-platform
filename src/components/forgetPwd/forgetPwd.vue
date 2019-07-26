<template>
  <div class="forgetPwd">
    <div class="login-container">
      <div class="content">
        <p class="title">找回密码</p>
        <div v-if="isNext">
          <p class="title-notice">请输入注册时的手机号码，将发送验证码给您</p>
          <el-form :model="ruleform" :rules="rules" ref="ruleForms" >
            <el-form-item prop="phone">
              <div class="input-wraper">
                <el-input class="phone-wrap" v-model="ruleform.phone" clearable placeholder="请输入手机号"></el-input>
                <img src="@/common/images/icon_user.png" alt="">
              </div>
            </el-form-item>
            <el-form-item prop="captchaCode" class="code-box">
              <div class="input-wraper">
                <el-input clearable class="text" placeholder="请输入短信验证码" v-model="ruleform.captchaCode"></el-input>
                <img src="@/common/images/icon_code.png" alt="">
                <!--<img class="captcha-code" @click="getCaptcha" :src="captcha_number" alt="">-->
                <div class="code-box">
                  <div class="img_change_img get_code" @click="getCode" v-if="codeValue">获取验证码</div>
                  <div class="img_change_img count_down" v-else>倒计时({{second}})</div>
                </div>
              </div>
            </el-form-item>
          </el-form>
          <p class="login-btn" @click="nextStep('ruleForms')">找回密码</p>
          <div class="errorTip_wrap" >
            <div class="errorTip" v-if="errorTip">{{errorMessage}}</div>
          </div>
        </div>
        <div v-else>
          <el-form :model="ruleform2" :rules="rules" ref="ruleForms2" >
            <el-form-item prop="password">
              <div class="input-wraper">
                <el-input clearable type="password" class="phone-wrap" v-model="ruleform2.password" placeholder="请输入新密码 (6-20位数字、字母或特殊符号）"></el-input>
                <img src="@/common/images/icon_password.png" alt="">
              </div>
            </el-form-item>
            <el-form-item prop="checkPassword" class="code-box">
              <div class="input-wraper">
                <el-input clearable type="password" class="text" placeholder="请再次输入密码" v-model="ruleform2.checkPassword"></el-input>
                <img src="@/common/images/icon_password.png" alt="">
              </div>
            </el-form-item>
          </el-form>
          <p class="login-btn" @click="submit('ruleForms2')">重置密码</p>
          <div class="errorTip_wrap" >
            <div class="errorTip" v-if="errorTip">{{errorMessage}}</div>
          </div>
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
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleform2.checkPassword !== '') {
            this.$refs.ruleForms2.validateField('checkPassword');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请再次输入密码'));
          } else if (value !== this.ruleform2.password) {
            callback(new Error('两次输入密码不一致!'));
          } else {
            callback();
          }
      };
      return {
        ruleform: {
          phone: "", // 手机号
          captchaCode: "", // 验证码
        },
        ruleform2: {
          password: "", // 密码
          checkPassword: "", // 密码
        },
        rules: {
          phone: [
            {validator: checkPhone, trigger: 'blur'},
            {}
          ],
          captchaCode: [
            {validator: checkVerify, trigger: 'blur'},
            { min: 1, max: 4, message: '验证码长度不对', trigger: 'blur' }
          ],
          password: [
            {validator: validatePass, trigger: 'blur'},
            { min: 6, max: 20, message: '6-20位数字、字母或特殊符号', trigger: 'blur' }
          ],
          checkPassword: [
            {validator: validatePass2, trigger: 'blur'},
            {}
          ],
        },
        captcha_number: "",
        captcha_id: "",
        errorMessage: "",//错误提示信息
        errorTip: false,
        second: 60,// 发送验证码倒计时
        codeValue: true,
        errorMsg: "",
        isNext: true,

      }
    },
    beforeMount() {
      /*this.$nextTick(() => {
        this.getCaptcha()
      });*/
    },
    mounted() {
      if (sessionStorage.getItem("userInfo")){
        this.token = JSON.parse(sessionStorage.getItem("userInfo")).token;
        this.user_id = JSON.parse(sessionStorage.getItem("userInfo")).user_id;
      }
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
      //获取短信验证码
      getCode() {
        if (this.ruleform.phone && /^1[3-9]\d{9}$/.test(this.ruleform.phone)){
          //倒计时
          let me = this;
          me.codeValue = false;
          let interval = window.setInterval(function () {
            if ((me.second--) <= 0) {
              me.second = 60;
              me.codeValue = true;
              window.clearInterval(interval);
            }
          }, 1000);
          //get短信验证码
          this.$axios({
            method: 'post',
            url: `${this.$baseURL}/v1/sms/code`,
            data: this.$querystring.stringify({
              phone: "+86" + this.ruleform.phone, //手机号
              type: 3 //1-注册，2-修改密码, 3-登录
            })
          }).then(res => {
          }).catch(error => {
            console.log(error);
          })
        }
      },
      //下一步
      nextStep(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            //校验短信验证码
            this.$axios({
              method: 'get',
              url: `${this.$baseURL}/v1/sms/+86${this.ruleform.phone}/code/${this.ruleform.captchaCode}`,
              data: this.$querystring.stringify({
                phone: "+86" + this.ruleform.phone, //手机号
                type: 3 //1-注册，2-修改密码, 3-登录
              })
            }).then(res => {
              this.isNext = false
            }).catch(error => {
              console.log(error);
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      },
      //重置密码
      submit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let data = {
              new: this.ruleform2.password, // 密码
              renew: this.ruleform2.checkPassword, // 密码
            };
            this.$axios({
              method: 'post',
              url: `${this.$baseURL}/v1/rrpoints-saas/web/${this.user_id}/password`,
              data: this.$querystring.stringify(data)
            }).then(res => {
              this.$router.push("/home")
            }).catch(error => {
              console.log(error);
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
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
          .code-box{
            position: relative
            right: 170px;
            .img_change_img{
              width: 88px;
              height: 38px;
              cursor pointer
              text-align: center;
            }
            .get_code{
              border: 1px solid #306af6;
              color: #306af6;
              border-radius 10px
            }
            .count_down{
              background-color: #7d7d7d;
              color: #ffffff;
              border-radius 10px
            }
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
