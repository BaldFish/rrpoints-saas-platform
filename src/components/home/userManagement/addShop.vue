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
          <label>签名：</label>
          <el-input v-model="sign" placeholder="请输入签名" clearable style="width: 380px"></el-input>
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
              <baidu-map class="map" :center="center" :zoom="zoom">
                <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
                <bm-marker :position="{lng: 116.404, lat: 39.915}" :dragging="true">
                  <bm-context-menu>
                    <bm-context-menu-item :callback="getPosition" text="获取坐标"></bm-context-menu-item>
                  </bm-context-menu>
                </bm-marker>
              </baidu-map>
            </template>
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
        //上传数据
        uploadUrl:`${this.$baseURL}/v1/rrpoints-saas/resources/upload`,
        /*uploadHeaders:{'X-Access-Token': this.token},
        uploadData:{
          user_id: this.user_id,
          img: "", // 图片数据的base64编码
          ext: "", // 扩展名
        },*/

        img: "", // 图片数据的base64编码
        ext: "", // 扩展名

        dialogImageUrl: '',
        dialogVisible: false,

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
      if (sessionStorage.getItem("userInfo")){
        this.token = JSON.parse(sessionStorage.getItem("userInfo")).token;
        this.user_id = JSON.parse(sessionStorage.getItem("userInfo")).user_id;
      }
    },
    methods: {
      handleRemove(file, fileList) {
        console.log(file,"handleRemove");
        console.log(fileList,"handleRemove");
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
      //图片转Base64
      getBase64Image (url,callback) {
        /*var canvas = document.createElement("canvas"); //创建canvas DOM元素，并设置其宽高和图片一样
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, img.width, img.height); //使用画布画图
        var dataURL = canvas.toDataURL("image/" + ext); //返回的是一串Base64编码的URL并指定格式
        canvas = null; //释放
        return dataURL;*/

        var canvas = document.createElement('canvas'),
          ctx = canvas.getContext('2d'),
          img = new Image;
        img.crossOrigin = 'Anonymous';
        img.onload = function(){
          canvas.height = img.height;
          canvas.width = img.width;
          ctx.drawImage(img,0,0);
          var dataURL = canvas.toDataURL('image/png');
          callback(dataURL);
          canvas = null;
        };
        img.src = url;
      },
      getBase64(imgUrl) {
        window.URL = window.URL || window.webkitURL;
        var xhr = new XMLHttpRequest();
        xhr.open("get", imgUrl, true);
        //var base64Address = "";
        // 至关重要
        xhr.responseType = "blob";
        xhr.onload = function () {
          if (this.status == 200) {
            //得到一个blob对象
            var blob = this.response;
            // 至关重要
            let oFileReader = new FileReader();
            oFileReader.onloadend = function (e) {
              let base64 = e.target.result;
              //base64Address = e.target.result;
              console.log("base64>>", base64)

            };
            oFileReader.readAsDataURL(blob);

           // return window.URL.createObjectURL(blob)

            console.log(window.URL.createObjectURL(blob),"6666")
          }
        };
        xhr.send();
        //console.log("666>>", base64Address)

      },
      //文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
      handleImgChange(file, fileList){
        //console.log(file);
        this.ext = this.getCaption(file.raw.type);
        this.img = this.getBase64Image(file.url.substring(5))
        console.log(  this.ext);
        console.log(  this.img);



      },
      //图片上传成功钩子
      handleAvatarSuccess(res, file, fileList){

        console.log(res,"res")
        console.log(file,"file")
        console.log(fileList,"fileList")
      },

      getPosition (e) {
        alert(`${e.point.lng} / ${e.point.lat}`)
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

          longitude: this.longitude,
          latitude: this.latitude,
          region_code: this.region_code,
          icons: this.icons,

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

<style>
  /* The container of BaiduMap must be set width & height. */
  .map {
   /* width: 100%;
    height: 300px;*/
    width: 90%;
    height: 340px;
    margin-left: 5%;
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

</style>
