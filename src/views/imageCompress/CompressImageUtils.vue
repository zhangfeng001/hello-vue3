<template>
  <div class="container">
    <input type="file" id="input-img" @change="updateFile" />
  </div>
</template>
<script>
/**
 * 支持blob格式上传和base64格式上传
 * */ 
 import {compressImage} from '../../assets/ts/CompressImageUtiles.js'
export default {
  name: "compress",
  data: function () {
    return {
      compressImg: null,
      fileName: null,
    };
  },
  components: {},
  methods: {
    updateFile(){
      const fileObj = document.querySelector("#input-img").files[0];
      this._compressAndUploadFile(fileObj);

      },
      _compressAndUploadFile(file){
        let that = this;
        compressImage(file).then(resultObj => {
          let {blob,base64,fileName,oSize} = resultObj
          console.log('压缩后的结果', blob); // result即为压缩后的结果
          console.log('压缩前大小', oSize/1024);
          console.log('压缩后大小', blob.size/1024);
          if (blob.size > oSize){
            console.log('上传原图');
            //压缩后比原来更大，则将原图上传
            that._uploadFile(file, fileName);
          } else {
            //压缩后比原来小，上传压缩后的
            console.log('上传压缩图');
            that._uploadFile(blob, fileName)
          }
          // 下载
          this.downloadImg(base64,fileName)
        })
      },
      //上传
      _uploadFile(file){
        let params = new FormData();
        params.append("file", file);
      },

    // base64 图片转 blob 后下载
    downloadImg(base64,fileName) {
      let compressImg = base64 ;
      let parts = compressImg.split(";base64,");
      let contentType = parts[0].split(":")[1];
      let raw = window.atob(parts[1]);
      let rawLength = raw.length;
      let uInt8Array = new Uint8Array(rawLength);
      for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
      }
      const blob = new Blob([uInt8Array], { type: contentType });
      compressImg = URL.createObjectURL(blob);
      if (window.navigator.msSaveOrOpenBlob) {
        // 兼容 ie 的下载方式
        window.navigator.msSaveOrOpenBlob(blob, fileName);
      } else {
        const a = document.createElement("a");
        a.href = compressImg;
        a.setAttribute("download", fileName);
        a.click();
      }
    },
  },
};
</script>
