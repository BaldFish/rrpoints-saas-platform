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
          <label>商家类型：</label>
          <el-select v-model="type" placeholder="请选择商家类型" style="width: 380px">
            <el-option
              v-for="item in shopTypes"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>

          <label>店铺名称：</label>
          <el-input v-model="name" placeholder="请输入店铺名称" clearable style="width: 380px"></el-input>
          <br/>
          <br/>
          <label>店铺联系方式：</label>
          <el-input v-model="contact" placeholder="请输入联系方式" clearable style="width: 380px"></el-input>
          <label>店铺地址：</label>
          <el-input v-model="addr" placeholder="请输入店铺地址" clearable style="width: 380px"></el-input>
          <br/>
          <br/>
          <label>精修车型：</label>
          <el-input v-model="serve_cars" placeholder="请输入精修车型" clearable style="width: 380px"></el-input>
          <label>服务范围：</label>
          <el-input v-model="serve_range" placeholder="请输入服务范围" clearable style="width: 380px"></el-input>
          <br/>
          <br/>
          <label>营业时间：</label>
          <el-input v-model="serve_time" placeholder="请输入营业时间" clearable style="width: 380px"></el-input>
          <label>标签：</label>
          <el-input v-model="sign" placeholder="请输入标签" clearable style="width: 380px"></el-input>
          <br/>
          <br/>
          <label>商家介绍：</label>
          <el-input v-model="introduce" placeholder="请输入商家介绍" clearable style="width: 888px"></el-input>
          <br/>
          <br/>
          <label>上传图片：</label>
          <div class="img-box">
            <el-upload
              :action="uploadUrl"
              :headers="{'X-Access-Token': token}"
              :data="{
                'user_id': user_id,
                'img': img,
                'ext': ext,
              }"
              list-type="picture-card"
              :on-change="handleImgChange"
              :on-success="handleAvatarSuccess"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove">
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
          </div>
          <div class="map-box">
            <template>              　　　　　
　　　　　　　　<div class="baiduMap">
　　　　　　　　　　<i-form :model="centerStr" :label-width="120">
　　　　　　　　　　　　<Form-item label="经度：">
　　　　　　　　　　　　　　<i-input :value.sync="centerStr.lng" readonly></i-input>
　　　　　　　　　　　　</Form-item>
　　　　　　　　　　　　<Form-item label="纬度：">
　　　　　　　　　　　　　　<i-input :value.sync="centerStr.lat" readonly></i-input>
　　　　　　　　　　　　</Form-item>              　　　　　　
　　　　　　　　　　</i-form>
　　　　　　　　　　<baidu-map
　　　　　　　　　　　　class="bm-view"
　　　　　　　　　　　　ak="APkv65l0uG6nxkiDW7Iq6S6GuglXpg2q"
　　　　　　　　　　　　:center="LocationCity"
　　　　　　　　　　　　:zoom="15"
　　　　　　　　　　　　:scroll-wheel-zoom="true"
　　　　　　　　　　　　@click="getClickInfo"
　　　　　　　　　　　　@moving="syncCenterAndZoom"
　　　　　　　　　　　　@moveend="syncCenterAndZoom"
　　　　　　　　　　　　@zoomend="syncCenterAndZoom">
　　　　　　　　　　　　　　<bm-view style="width: 100%; height:500px;"></bm-view>
　　　　　　　　　　　　　　<bm-marker
　　　　　　　　　　　　　　　　:position="{ lng: centerStr.lng, lat: centerStr.lat }"
　　　　　　　　　　　　　　　　:dragging="true"
　　　　　　　　　　　　　　　　animation="BMAP_ANIMATION_BOUNCE">
　　　　　　　　　　　　　　</bm-marker>
　　　　　　　　　　　　　　<bm-control>
　　　　　　　　　　　　　　　　<bm-auto-complete v-model="keyword" :sugStyle="{ zIndex: 999999 }">
　　　　　　　　　　　　　　　　　　<input
　　　　　　　　　　　　　　　　　　　　type="text"
　　　　　　　　　　　　　　　　　　　　placeholder="请输入搜索关键字"
　　　　　　　　　　　　　　　　　　　　class="serachinput"/>
　　　　　　　　　　　　　　　　</bm-auto-complete>
　　　　　　　　　　　　　　</bm-control>
　　　　　　　　　　　　　　<bm-local-search
　　　　　　　　　　　　　　　:keyword="keyword"
　　　　　　　　　　　　　　　:auto-viewport="true"
　　　　　　　　　　　　　　　style="width:0px;height:0px;overflow: hidden;"
　　　　　　　　　　　　　　></bm-local-search>
　　　　　　　　　　</baidu-map>
　　　　　　　　</div>              　　　
            </template>
          </div>
          <div class="search-btn" @click="addNewShop()">创建</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {cityCode} from '@/common/js/city.js';

  export default {
    name: "addShop",
    components: {},
    data() {
      return {
        token:"",
        user_id:"",
        type:"",
        shopTypes: [
          {
            id: 0,
            name: "所有"
          },
          {
            id: 1,
            name: "4S店"
          },
          {
            id: 2,
            name: "停车"
          },
          {
            id: 3,
            name: "加油"
          },
          {
            id: 4,
            name: "充电"
          },
          {
            id: 5,
            name: "洗车"
          }
        ],
        name: "",
        contact: "",
        addr: "",
        serve_cars: "",
        serve_range: "",
        serve_time: "",
        sign: "",
        introduce: "",
        region_code: "11", //北京市code
        dialogImageUrl: '',
        dialogVisible: false,
        //上传数据
        uploadUrl:`${this.$baseURL}/v1/rrpoints-saas/resources/upload`,
        img: "", // 图片数据的base64编码
        ext: "", // 扩展名
        filename: "", // 上传成功返回的文件名
        icons: [], // 头像
        //百度地图
        showMapComponent: this.value,
        keyword: "",
        centerStr: {
          lng: "",
          lat: ""
        },
        LocationProvince:"正在定位所在省",    //给渲染层定义一个初始值
        LocationCity:"北京市"     //给渲染层定义一个初始值
      }
    },
    created() {
    },
    beforeMount() {
    },
    watch: {
      value: function(currentValue) {
        this.showMapComponent = currentValue;
        if (currentValue) {
          this.keyword = "";
        }
      }
    },
    mounted() {
      if (sessionStorage.getItem("userInfo")){
        this.token = JSON.parse(sessionStorage.getItem("userInfo")).token;
        this.user_id = JSON.parse(sessionStorage.getItem("userInfo")).user_id;
      }
      //触发获取城市方法
      this.city()
    },
    methods: {
      //删除图片
      handleRemove(file, fileList) {
        this.filename = this.getCaption(file.response.img_url);
        this.$axios({
          method: 'DELETE',
          url: `${this.$baseURL}/v1/rrpoints-saas/resources/${this.filename}`,
          headers: {
            'X-Access-Token': this.token,
          }
        }).then(res => {
          this.icons.pop()
        }).catch(error => {
        })
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      //JS字符串截取（获取指定字符后面的所有字符内容）
      getCaption(obj){
        var index=obj.lastIndexOf("/");
        obj=obj.substring(index+1,obj.length);
        return obj;
      },
      //图片转化为base64
      getBase64Image(img) {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, img.width, img.height);
        var ext = img.src.substring(img.src.lastIndexOf(".")+1).toLowerCase();
        var dataURL = canvas.toDataURL("image/"+ext);
        return dataURL;
      },
      //文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
      handleImgChange(file, fileList){
        this.ext = this.getCaption(file.raw.type);
        // 图片转Bsae64
        var image = new Image();
        image.src = file.url;
        image.onload = (function(){
          this.img = this.getBase64Image(image).substring(22);
        }).bind(this)
      },
      //图片上传成功钩子
      handleAvatarSuccess(res, file, fileList){
        this.icons.push(res.img_url)
      },
      //百度地图
      getClickInfo(e) {
        this.centerStr.lng = e.point.lng;
        this.centerStr.lat = e.point.lat;
      },
      syncCenterAndZoom(e) {
        const { lng, lat } = e.target.getCenter();
        this.centerStr.lng = lng;
        this.centerStr.lat = lat;
        this.zoom = e.target.getZoom();
      },
      //定义获取城市方法
      city(){
        const geolocation = new BMap.Geolocation();
        var _this = this;
        geolocation.getCurrentPosition(function getinfo(position){
          let city = position.address.city;             //获取城市信息
          let province = position.address.province;     //获取省份信息
          _this.LocationProvince = province;
          _this.LocationCity = city;
          _this.getCityCode(_this.LocationCity)
        }, function(e) {
          _this.LocationCity = "定位失败"
        }, {provider: 'baidu'});
      },
      //获取城市地区编码
      getCityCode(cityName){
        let that = this;
        cityCode.forEach(function (item1) {
          if (item1.name === cityName){
            that.region_code = item1.code
          } else {
            item1.children.forEach(function (item2) {
              if (item2.name === cityName) {
                that.region_code = item2.code
              }
            })
          }
        })
      },
      //添加店铺
      addNewShop(){
        let data = {
          user_id: this.user_id,
          type: this.type,
          name: this.name,
          contact: this.contact,
          addr: this.addr,
          serve_cars: this.serve_cars,
          serve_range: this.serve_range,
          serve_time: this.serve_time,
          sign: this.sign,
          introduce: this.introduce,
          icons: this.icons,
          //百度地图
          longitude: this.centerStr.lng,
          latitude: this.centerStr.lat,
          region_code: this.region_code,
        };
        this.$axios({
          method: 'post',
          url: `${this.$baseURL}/v1/rrpoints-saas/web/stores`,
          data: this.$querystring.stringify(data),
          headers: {
            'X-Access-Token': this.token,
          }
        }).then(res => {
          this.$router.push("/home/userManagement/shopsQuery")
        }).catch(error => {
        })
      },


    }
  }
</script>

<style lang="stylus">
  .baiduMap{
    width: 100%
    form{
      display: flex;
      flex-direction: row;
      .ivu-form-item{
        .ivu-form-item-label{
          font-size 16px
          padding-right 0
        }
        .ivu-form-item-content{
          margin-left 124px !important
          input{
            height:40px
            background-color: #f6f8fe;
            border: solid 1px #dfe6f7;
            border-radius: 4px;
          }
          .ivu-input:focus{
            box-shadow none
          }
        }
      }
    }
    .serachinput{
      width:300px
      box-sizing :border-box
      padding:9px
      border:1px solid #dddee1
      line-height: 20px;
      font-size: 16px;
      height: 38px;
      color: #333;
      position: relative;
      border-radius: 4px;
      outline none
      -webkit-box-shadow: #666 0 0 10px;
      -moz-box-shadow: #666 0 0 10px;
      box-shadow: #666 0 0 10px
    }
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
        .img-box{
          margin-left: 124px;
          margin-bottom: 20px;
        }
        .map-box{
          margin:0 auto
          display flex
          flex-direction row
          align-items center
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
          width: 120px
          display: inline-block;
          text-align: right;
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
  .addShop{
    .el-select-dropdown{
      min-width: 380px !important;
    }
    .el-select .el-input.is-focus .el-input__inner{
      border-color: #dfe6f7
    }
    .el-select .el-input__inner:focus {
      border-color: #dfe6f7;
    }
  }
  .addShop{
    .el-input {
      margin-right: 0;
    }
  }
</style>
