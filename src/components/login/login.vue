<template>
  <div class="login">
    <div class="login-container">
      <div class="content">
        <p class="title">人人积分管理后台</p>
        <el-form :model="ruleform" :rules="rules" ref="ruleForms" >
          <el-form-item prop="phone">
            <div class="input-wraper">
              <el-input class="phone-wrap" v-model="ruleform.phone" clearable placeholder="请输入手机号"></el-input>
              <img src="@/common/images/icon_user.png" alt="">
            </div>
          </el-form-item>
          <el-form-item prop="password" :error="errorAccount">
            <div class="input-wraper">
              <el-input clearable type="password" class="text" placeholder="请输入密码" v-model="ruleform.password"></el-input>
              <img src="@/common/images/icon_password.png" alt="">
            </div>
          </el-form-item>
          <el-form-item prop="captchaCode" class="code-box" :error="errorCode">
            <div class="input-wraper">
              <el-input clearable class="text" placeholder="请输入验证码" v-model="ruleform.captchaCode"></el-input>
              <img src="@/common/images/icon_code.png" alt="">
              <img class="captcha-code" @click="getCaptcha" :src="captcha_number" alt="">
            </div>
          </el-form-item>
        </el-form>
        <div class="link-box">
          <router-link :to="{path:'/forgetPwd'}" class="to-password">忘记密码？</router-link>
          <router-link :to="{path:'/register'}" class="to-register">去注册</router-link>
        </div>
        <p class="login-btn" @click="login('ruleForms')">登录</p>
        <div class="errorTip_wrap">
          <div class="errorTip" v-if="errorTip">{{errorMessage}}</div>
        </div>
      </div>
    </div>
    <div class="info-footer">
      <div>
        <p>商务负责人：张经理&nbsp;&nbsp;&nbsp;电话：18001226131（同微信）</p>
        <p>邮箱：zhangqing@cnlaunch.com</p>
      </div>
      <a href="javascript:void(0);" @click="downLoadFile()">下载帮助手册</a>
    </div>
  </div>
</template>

<script>
  var fileDownload = require('downloadjs');

  export default {
    name: "login",
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
      var checkPassword = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
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
          captchaCode: "", // 验证码
        },
        rules: {
          phone: [
            {validator: checkPhone, trigger: 'blur'},
            {}
          ],
          password: [
            {validator: checkPassword, trigger: 'blur'},
            {}
          ],
          captchaCode: [
            {validator: checkVerify, trigger: 'blur'},
            { min: 1, max: 4, message: '验证码长度不对', trigger: 'blur' }
          ],

        },
        captcha_number: require("../../common/images/code.png"), // 1.预设图片占位。火狐不显示 2.webpack要求require
        captcha_id: "",
        errorMessage: "",//错误提示信息
        errorTip: false,
        errorCode: "", //验证码错误信息
        errorAccount: "", //账户或密码错误
      }
    },
    created() {
    },
    beforeMount() {
    },
    mounted() {
      this.$nextTick(() => {
         this.getCaptcha()
      })
    },
    watch: {},
    computed: {},
    methods: {
      //下载帮助手册
      downLoadFile(){
        this.fileLinkToStreamDownload("https://launchain.oss-cn-zhangjiakou.aliyuncs.com/docs/rrpoints-saas/manual.pdf","帮助手册","pdf")
        //fileDownload("http://qiniu-assets.xinxicdn.com/rrpoints-saas/documents/manual.pdf")
      },
      fileLinkToStreamDownload(url, fileName, type) {
        let reg = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+).)+([A-Za-z0-9-~\/])+$/;
        if (!reg.test(url)) {
          throw new Error("传入参数不合法, 不是标准的文件链接");
        } else {
          let that=this
          let xhr = new XMLHttpRequest();
          xhr.open('get', url, true);
          xhr.setRequestHeader('Content-Type', `application/${type}`);
          xhr.setRequestHeader('Access-Control-Allow-Origin', `*`);
          xhr.responseType = "blob";
          xhr.onload = function () {
            if (this.status == 200) {
              // 接受二进制文件流
              let blob = this.response;
              that.downloadExportFile(blob, fileName, type)
            }
          }
          xhr.send();
        }
      },
      downloadExportFile(blob, tagFileName, fileType) {
        let downloadElement = document.createElement('a');
        let href = blob;
        if (typeof blob == 'string') {
          downloadElement.target = '_blank';
        } else {
          href = window.URL.createObjectURL(blob); // 创建下载的链接
        }
        downloadElement.href = href;
        downloadElement.download = tagFileName + '.' + fileType; // 下载后文件名
        document.body.appendChild(downloadElement);
        downloadElement.click(); // 点击下载
        document.body.removeChild(downloadElement); // 下载完成移除元素
        if (typeof blob != 'string') {
          window.URL.revokeObjectURL(href); // 释放掉 blob 对象
        }
      },
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
            //校验图形验证码
            this.$axios({
              method: 'get',
              url: `${this.$baseURL}/v1/captcha/${this.captcha_id}/code/${this.ruleform.captchaCode}`
            }).then(res => {
              //去登录
              let data = {
                phone: '+86'+ this.ruleform.phone, // 手机号
                password: this.ruleform.password, // 密码
                code: this.ruleform.captchaCode, // 验证码
              };
              this.$axios({
                method: 'post',
                url: `${this.$baseURL}/v1/rrpoints-saas/web/sessions`,
                data: this.$querystring.stringify(data)
              }).then(res => {
                window.sessionStorage.setItem("userInfo", JSON.stringify(res.data));
                this.$router.push("/home")
              }).catch(error => {
                if (error.response.data.code === "10005"){
                  this.errorAccount = "账户或密码错误"
                }
              })
            }).catch(error => {
              console.log(error);
              this.errorCode = "图形验证码错误"
            })
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
  .login {
    width: 100%
    height: 100%
    background: url("../../common/images/bg.png") no-repeat center
    background-size 100% 100%

    .login-container {
      width: 420px;
      height: 500px;
      background: url("../../common/images/login-box.png") no-repeat center
      margin-top 8%
      margin-left 16%

      .content {
        width: 280px
        margin 0 auto
        padding-top: 50px;
        position relative
        .title {
          font-size: 18px;
          color: #0d0d0d;
          text-align center
          margin: 75px 0 18px 0;
        }

        .input-wraper{
          display: flex;
          flex-direction: row;
          align-items: center;
          img{
            width: 26px;
            height: 20px;
            position: relative;
            right: 305px;
          }
          .captcha-code{
            width: 88px;
            height: 38px;
            right: 166px;
            cursor pointer
          }
          .el-input__inner{
            width: 270px;
            height: 48px;
            background-color: #f6f8fe;
            border-radius: 10px;
            padding-left: 42px;
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
          margin-top 10px
          margin-right: 10px;
          cursor pointer
          line-height 54px
          text-align center
          color #ffffff
          font-size: 20px;
        }
        .link-box{
          width: 270px;
          display flex
          flex-direction row
          justify-content space-between
          .to-password{
          }
          .to-register{
          }
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


    .info-footer{
      display flex
      flex-direction row
      align-items center
      justify-content: flex-end;
      margin-right 5%
      div{
        line-height normal
        p{
          font-size:20px;
          color:rgba(51,51,51,1);
          margin-right 16px
        }
      }
      a{
        width:144px;
        height:46px;
        line-height 46px
        font-size:20px;
        text-align center
        color:rgba(255,255,255,1);
        background:rgba(48,106,246,1);
        border-radius:10px;
        display inline-block
      }
    }
  }
</style>
