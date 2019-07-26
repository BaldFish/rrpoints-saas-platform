<template>
  <div class="register">
    <div class="login-container">
      <div class="content">
        <div class="go-login">
          <p>已有账号&nbsp;&nbsp;<router-link to="/login">马上登录</router-link></p>
        </div>
        <p class="title">人人积分商户注册</p>
        <el-form :model="ruleform" :rules="rules" ref="ruleform" >
          <el-form-item prop="phone">
            <div class="input-wraper">
              <el-input class="phone-wrap" v-model="ruleform.phone" clearable placeholder="请输入手机号"></el-input>
              <img src="@/common/images/icon_user.png" alt="">
            </div>
          </el-form-item>
          <el-form-item prop="code" class="code-box">
            <div class="input-wraper">
              <el-input clearable class="text" placeholder="请输入验证码" v-model="ruleform.code"></el-input>
              <img src="@/common/images/icon_code.png" alt="">
              <!--<img class="captcha-code" @click="getCaptcha" :src="captcha_number" alt="">-->
              <div class="code-box">
                <div class="img_change_img get_code" @click="getCode" v-if="codeValue">获取验证码</div>
                <div class="img_change_img count_down" v-else>倒计时({{second}})</div>
              </div>
            </div>
          </el-form-item>
          <el-form-item prop="password">
            <div class="input-wraper">
              <el-input clearable type="password" class="text" placeholder="请输入密码" v-model="ruleform.password"></el-input>
              <img src="@/common/images/icon_password.png" alt="">
            </div>
          </el-form-item>
          <el-form-item prop="repassword">
            <div class="input-wraper">
              <el-input clearable type="password" class="text" placeholder="请再次输入密码" v-model="ruleform.repassword"></el-input>
              <img src="@/common/images/icon_password.png" alt="">
            </div>
          </el-form-item>
        </el-form>
        <p class="login-btn" @click="register('ruleform')">注册</p>
        <div class="errorTip_wrap" >
          <div class="errorTip" v-if="errorTip">{{errorMessage}}</div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  export default {
    name: "register",
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
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleform.repassword !== '') {
            this.$refs.ruleform.validateField('repassword');
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
      var checkVerify = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入验证码'));
        } else {
          callback();
        }
      };
      return {
        ruleform: {
          phone: "", // 手机号
          password: "", // 密码
          repassword: "", // 密码
          code: "", // 验证码
        },
        rules: {
          phone: [
            {validator: checkPhone, trigger: 'blur'},
            {}
          ],
          password: [
            {validator: validatePass, trigger: 'blur'},
            { min: 6, max: 20, message: '6-20位数字、字母或特殊符号', trigger: 'blur' }
          ],
          repassword: [
            {validator: validatePass2, trigger: 'blur'},
            {}
          ],
          code: [
            {validator: checkVerify, trigger: 'blur'},
            { min: 1, max: 4, message: '验证码长度不对', trigger: 'blur' }
          ],

        },
        captcha_number: "",
        captcha_id: "",
        errorMessage: "",//错误提示信息
        errorTip: false,
        second: 60,// 发送验证码倒计时
        codeValue: true,
      }
    },
    created() {
    },
    beforeMount() {
    /*  this.$nextTick(() => {
        this.getCaptcha()
      });*/
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
      //注册
      register(formName) {
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
              //去注册
              let data = {
                phone: '+86'+ this.ruleform.phone, // 手机号
                password: this.ruleform.password, // 密码
                repassword: this.ruleform.repassword, // 密码
                code: this.ruleform.code, // 验证码
              };
              this.$axios({
                method: 'post',
                url: `${this.$baseURL}/v1/rrpoints-saas/web/signup`,
                data: this.$querystring.stringify(data)
              }).then(res => {
                this.$router.push("/login")
              }).catch(error => {
                console.log(error);
              });
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
  .register {
    width: 100%
    height: 100%
    background: url("../../common/images/bg_2.png") no-repeat center
    background-size 100% 100%

    .login-container {
      width: 536px;
      height: 600px;
      background: url("../../common/images/register-box.png") no-repeat center
      margin-top: 4%;
      margin-left: 24%;

      .content {
        width: 326px
        margin 0 auto
        padding-top: 50px;
        position relative
        .go-login{
          font-size: 14px;
          color: #999999;
          float right
          margin-top: 36px;
          margin-right: -24px;
          a{
            font-size: 16px;
            color: #306af6;
          }
        }

        .title {
          font-size: 18px;
          color: #0d0d0d;
          text-align center
          margin 80px 0 24px 0
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
