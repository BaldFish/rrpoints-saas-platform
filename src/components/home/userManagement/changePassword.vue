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
              <el-form :model="ruleform" :rules="rules" ref="ruleform" >
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
              <p class="login-btn" @click="submit('ruleform')">修改密码</p>
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
            { min: 6, max: 20, message: '6-20位数字、字母或特殊符号', trigger: 'blur' }
          ],
          checkPassword: [
            {validator: validatePass2, trigger: 'blur'},
            {}
          ],
        },
        errorMessage: "",//错误提示信息
        errorTip: false,
        token: '',
        user_id: '',
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
      }
    },
    methods: {
      //修改密码
      submit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let formData = {
              old: this.ruleform.oldPassword,
              new: this.ruleform.password, // 密码
              renew: this.ruleform.checkPassword, // 密码
            };
            this.$axios({
              method: 'put',
              url: `${this.$baseURL}/v1/rrpoints-saas/web/${this.user_id}/password`,
              data: this.$querystring.stringify(formData),
              headers: {
                'X-Access-Token': this.token,
              }
            }).then(res => {
              this.$confirm('修改密码成功', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'success',
                center: true,
                showCancelButton: false
              }).then(() => {
                this.ruleform =  {
                  oldPassword: "", // 旧密码
                  password: "", // 密码
                  checkPassword: "", // 密码
                }
              }).catch(() => {
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
