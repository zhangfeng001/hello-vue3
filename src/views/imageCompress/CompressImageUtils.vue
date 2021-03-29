<template>
  <div class="container">
    <input type="file" id="input-img" @change="updateFile" />
  </div>
</template>
<script>
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
        let reader = new FileReader();
        let that = this;
        // 获取文件名称，后续下载重命名
        let fileName = `${new Date().getTime()}-${fileObj.name}`;
      // 压缩图片
        reader.readAsDataURL(fileObj);
        console.log(fileObj.size)
        reader.onload = function (e) {
          that._compressAndUploadFile(e.currentTarget.result,fileObj.size,fileName);
        }
      },
      _compressAndUploadFile(file,oSize,fileName){
        let that = this;
        compressImage(file).then(resultObj => {
          console.log(resultObj)
          console.log('压缩后的结果', resultObj.blob); // result即为压缩后的结果
          console.log('压缩前大小', oSize/1024);
          console.log('压缩后大小', resultObj.blob.size/1024);
          if (resultObj.blob.size > oSize){
            console.log('上传原图');
            //压缩后比原来更大，则将原图上传
            that._uploadFile(file, fileName);
          } else {
            //压缩后比原来小，上传压缩后的
            console.log('上传压缩图');
            that._uploadFile(resultObj.blob, fileName)
          }
          // 下载
          this.downloadImg(resultObj.base64,fileName)
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
