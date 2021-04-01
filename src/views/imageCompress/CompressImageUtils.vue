<template>
  <div class="container">
    <input type="file" id="input-img" @change="updateFile" />
  </div>
</template>
<script>
/**
 * 支持blob格式上传和base64格式上传
 * */ 
  import {compressImage,
        downloadImgFromBlob,
        downloadImgFromBase64} 
  from '../../assets/ts/CompressImageUtiles.js'
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
          // console.log('压缩后大小', blob.size/1024);
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
          downloadImgFromBlob(blob,fileName)
        })
      },
      //上传
      _uploadFile(file){
        let params = new FormData();
        params.append("file", file);
      },
  },
};
</script>
