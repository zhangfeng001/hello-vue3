<template>
  <div class="container">
    <input type="file" id="input-img" @change="compress" />
    <a :download="fileName" :href="compressImg">普通下载</a>
    <button @click="downloadImg">兼容 IE 下载</button>
    <div>
      <img :src="compressImg" />
    </div>
  </div>
</template>
<script>
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
    compress() {
      // 获取文件对象
      const fileObj = document.querySelector("#input-img").files[0];
      // 获取文件名称，后续下载重命名
      this.fileName = `${new Date().getTime()}-${fileObj.name}`;
      // 获取文件后缀名
      const fileNames = fileObj.name.split(".");
      const type = fileNames[fileNames.length - 1];
      // 压缩图片
      this.handleCompressImage(fileObj, type);
    },
    handleCompressImage(img, type, quality = 0.5) {
      const vm = this;
      let reader = new FileReader();
      // 读取文件
      reader.readAsDataURL(img);
      reader.onload = function (e) {
        let image = new Image(); //新建一个img标签
        image.src = e.target.result;
        image.onload = function () {
          let that = this;
          let canvas = document.createElement("canvas");
          let context = canvas.getContext("2d");
          let w = that.width,
            h = that.height,
            scale = w / h;
          w = quality ? w*quality : w;
          h = quality ? w/scale : h ;
          // 创建属性节点
          var anw = document.createAttribute("width");
          anw.nodeValue = w;
          var anh = document.createAttribute("height");
          anh.nodeValue = h;
          canvas.setAttributeNode(anw);
          canvas.setAttributeNode(anh);
          context.drawImage(image, 0, 0, w, h);
          // 图片去截取指定位置载入
          vm.compressImg = canvas.toDataURL(`image/${type}`);
        };
      };
    },
    // base64 图片转 blob 后下载
    downloadImg() {
      let parts = this.compressImg.split(";base64,");
      let contentType = parts[0].split(":")[1];
      let raw = window.atob(parts[1]);
      let rawLength = raw.length;
      let uInt8Array = new Uint8Array(rawLength);
      for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
      }
      const blob = new Blob([uInt8Array], { type: contentType });
      this.compressImg = URL.createObjectURL(blob);
      if (window.navigator.msSaveOrOpenBlob) {
        // 兼容 ie 的下载方式
        window.navigator.msSaveOrOpenBlob(blob, this.fileName);
      } else {
        const a = document.createElement("a");
        a.href = this.compressImg;
        a.setAttribute("download", this.fileName);
        a.click();
      }
    },
  },
};
</script>
