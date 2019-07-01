<template>
  <div class="addShop">
    <div class="list_wrap">
      <div style="position: relative; background-color: rgb(241,243,249);padding-left: 16px;">
        <div class="content-title">
          <img src="@/common/images/dianpu.png" alt="">
          <h3>店铺管理</h3>
        </div>
        <div class="content-query">
          <h3>新增店铺</h3>
          <br>
          <br>
          <label>店铺名称：</label>
          <el-input v-model="address" placeholder="请输入店铺名称" clearable style="width: 380px"></el-input>
          <label>店铺联系方式：</label>
          <el-input v-model="idcard" placeholder="请输入联系方式" clearable style="width: 380px"></el-input>
          <br/>
          <br/>
          <br/>
          <label>店铺地址：</label>
          <el-input v-model="idcard" placeholder="请输入店铺地址" clearable style="width: 380px"></el-input>
          <br/>
          <br/>
          <br/>
          <div class="map-box">
            <template>
              <baidu-map class="map" :center="center" :zoom="zoom">
                <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
                <bm-marker :position="{lng: 116.404, lat: 39.915}" :dragging="true">
                  <bm-context-menu>
                    <bm-context-menu-item :callback="getPosition" text="获取坐标"></bm-context-menu-item>
                  </bm-context-menu>
                </bm-marker>
              </baidu-map>
            </template>
            <div class="fake-list">
              <img src="@/common/images/001.png" alt="">
              <img src="@/common/images/002.png" alt="">
              <img src="@/common/images/003.png" alt="">
              <img src="@/common/images/004.png" alt="">
            </div>
          </div>
          <div class="search-btn" @click="addNewShop()">创建</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "addShop",
    components: {},
    data() {
      return {
        totalUser: 10,
        count_user: "",
        count_with_address: "",
        count_with_idcard: "",
        count_with_vehicle: "",
        totalYJF: "",
        totalYDD: "",
        totalGGD: "",
        userList: [],
        phone: "",
        name: "",
        idcard: "",
        multipleSelection: [],
        //multipleDelete: [],
        loading: false,
        currentPage: 1,
        //total: 10,
        page: 1,
        limit: 10,
        time:["",""],
        email:"",
        address:"",

        platform:"",
        appname:"",
        direction:"",
        sort:"",

        center: {
          lng: 116.404,
          lat: 39.915
        },
        zoom: 15
      }
    },
    created() {
    },
    beforeMount() {
    },
    mounted() {
      this.token = JSON.parse(sessionStorage.getItem("myLogin")).data.token;
      this.getUserList()
    },
    watch: {
      time: function () {
        if(this.time===null){
          this.time=["",""]
        } else {
          this.time[0] = new Date(this.time[0]).toUTCString() === "Invalid Date" ? "" : new Date(this.time[0]).toUTCString();
          this.time[1] = new Date(this.time[1]).toUTCString() === "Invalid Date" ? "" : new Date(this.time[1]).toUTCString();
        }
      }
    },
    computed: {
      //筛查出选中的数据的user_id组成的数组
      multipleDelete:function () {
        return this.$_.map(this.multipleSelection, function (item) {
          return item.id
        });
      }
    },
    methods: {
      getPosition (e) {
        alert(`${e.point.lng} / ${e.point.lat}`)
      },

      addNewShop(){
        this.$router.push("/home/userManagement/userQuery")
      },

      //获取用户列表
      getUserList() {
        //手机号格式化
        let initPhone = "";
        if(this.phone){
          initPhone = "+86" + this.phone
        }
        this.$axios({
          method: "GET",
          url: `${this.$baseURL}/v1/backstage/users?phone=${initPhone}&name=${this.name}&email=${this.email}&idcard=${this.idcard}&address=${this.address}&platform=${this.platform}&appname=${this.appname}&created_since=${this.time[0]}&created_to=${this.time[1]}&sort=${this.sort}&direction=${this.direction}&page=${this.page-1}&limit=${this.limit}`,
          headers: {
            'X-Access-Token': this.token,
          }
        }).then(res => {
          this.totalUser = res.data.count;
          this.count_user = res.data.count;
          this.count_with_address = res.data.count_with_address;
          this.count_with_idcard = res.data.count_with_idcard;
          this.count_with_vehicle = res.data.count_with_vehicle;
          this.totalYJF = res.data.TSD;
          this.totalYDD = res.data.YDD;
          this.totalGGD = res.data.ADE;
          let that = this;
          res.data.users.forEach(function (item) {
            if (item.created_at) {
              item.created_at = that.$utils.formatDate(new Date(item.created_at), "yyyy-MM-dd hh:mm:ss");
            }
          });
          this.userList = res.data.users;
        }).catch(error => {
          console.log(error)
        })
      },
      //排序
      sortChange: function(column, prop, order) {
        if(column.column.label == "邮箱"){
          this.sort = "email";
        }else if(column.column.label == "钱包地址"){
          this.sort = "address";
        }else if(column.column.label == "注册时间"){
          this.sort = "created_at";
        }else if(column.column.label == "手机号码"){
          this.sort = "phone";
        }else if(column.column.label == "真实姓名"){
          this.sort = "name";
        }else if(column.column.label == "身份证号"){
          this.sort = "idcard";
        }else if(column.column.label == "元积分"){
          this.sort = "TSD";
        }else if(column.column.label == "广告豆"){
          this.sort = "ADE";
        }else if(column.column.label == "元豆豆"){
          this.sort = "YDD";
        }else if(column.column.label == "平台"){
          this.sort = "platform";
        }else if(column.column.label == "应用"){
          this.sort = "appname";
        }
        if (column.order == "descending"){
          this.direction = "desc";
          this.getUserList()
        } else if (column.order == "ascending"){
          this.direction = "asc";
          this.getUserList()
        }
      },
      //点击搜索按钮搜索用户列表
      btnSearchUserList() {
        this.page = 1;//按钮搜索时初始化page
        this.getUserList()
      },
      //获取所点击行的信息
      getClickInfo(row){
        sessionStorage.setItem("clickInfo", JSON.stringify(row));
        //this.$router.push("/home/userManagement/userDetails");
        window.open("/home/userManagement/userDetails",'_blank');
      },
      //更改每页显示条数
      handleSizeChange(val) {
        this.limit = val;
        this.getUserList()
      },
      //切换分页
      handleCurrentChange(val) {
        this.page = val;
        this.getUserList()
      },
      //删除按钮删除方法
      handleDeletes() {
        if (this.multipleDelete.length === 0) {
          return
        }
        this.$confirm('确定删除此店铺?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.$axios({
            method: "DELETE",
            url: `${this.$baseURL}/v1/backstage/users/${this.multipleDelete[0]}`,
            headers: {
              'X-Access-Token': this.token,
            }
          }).then((res) => {
            this.page=1;
            this.getUserList();
          }).catch((err) => {
          })
        }).catch(() => {
          console.log('已取消删除')
        });
      },
      //获取选中复选框数据
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
    }
  }
</script>

<style>
  /* The container of BaiduMap must be set width & height. */
  .map {
   /* width: 100%;
    height: 300px;*/
    width: 845px;
    height: 440px;
 /*   margin: 0 auto;*/
  }
</style>

<style scoped lang="stylus">
  .addShop {
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
      .content-query{
        width: 100%;
        margin-top 15px
        background-color #ffffff
        padding: 20px
        .map-box{
          margin:0 auto
          display flex
          flex-direction row
          align-items center
          .fake-list{
            display flex
            flex-direction column
            align-items center
            margin-left 16px
            img{
              width:365px
              height:70px
              margin-bottom 10px
              border:1px solid #f6f8fe
              cursor pointer
            }
          }

        }
        .search-btn{
          width: 100px;
          height: 48px;
          line-height 48px
          text-align center
          background-color: #386cff;
          border-radius: 4px;
          font-size: 18px;
          color: #fefefe;
          outline: none;
          cursor: pointer;
          margin: 0 auto;
          margin-top 24px
        }
        h3{
          font-size: 18px;
          color: #333333;
        }
        label{
          font-size: 16px;
          color: #333333;
        }
      }
      .delete-btn{
        margin: 10px 0 0 20px;
      }
      .block{
        margin-top: 12px;
      }
    }
    .mar{
      padding-right 20px
      font-size: 18px;
      color: #333333;
    }
  }
</style>
<style lang="stylus">
  .el-input{
    margin-right 50px
    .el-input__inner{
      background-color: #f6f8fe;
      border: solid 1px #dfe6f7;
      border-radius 4px
    }
  }
  .el-date-editor{
    border-radius: unset;
    background-color: #f6f8fe;
    border: solid 1px #dfe6f7;
    input{
      background-color: #f6f8fe;
    }
  }
  .el-range-editor.is-active, .el-range-editor.is-active:hover{
    border-color #dfe6f7
  }


</style>
