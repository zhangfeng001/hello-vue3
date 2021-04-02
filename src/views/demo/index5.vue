<template>
  <a-modal @contextmenu.prevent="contextMenu($event)" v-model:visible="visible" :mask='false' title="确认删除吗" @ok="handleOk" ok-text="确认" cancel-text="取消">
    <p>删除后该元素不再显示！</p>
  </a-modal>
  <div ref="tagcanvasbox" class="tagcanvasbox box">
    <div class="leftBox">
      <!-- 圆 -->
      <div class="circular">
        <div class="circular" id="circular"></div>
      </div>
      <!-- 三角 -->
      <div class="tri-box">
        <div class="triangle"></div>
        <div id="triangle"></div>
      </div>
      <!-- 矩形 -->
      <div class="rectangle">
        <div class="rectangle" id="rectangle"></div>
      </div>
    </div>
    <canvas
      ref="tagcanvas"
      width="844"
      height="475"
      @mousedown="mouseDown($event)"
      @mouseup="mouseUp($event)"
      @mousemove="mouseMove($event)"
      @contextmenu.prevent="contextMenu($event)"
      @mouseout="mouseOut($event)"
      @mousewheel ="mousewheel($event)"
    ></canvas>
  </div>
</template>
<script>
export default {
  name: "canvas1",
  data() {
    return {
      ctx: "",
      tagObj: {
        newrecsObj: {},
        recs: [
          {
            h: 100,
            w: 100,
            x: 100,
            y: 160,
            color: "rgba(111, 84, 153 , 0.8)",
            shape: 4,
          },
          {
            h: 85,
            w: 100,
            x: 250,
            y: 160,
            color: "rgba(228, 134, 50 , 0.8)",
            shape: 3,
          },
          {
            h: 100,
            w: 100,
            x: 400,
            y: 160,
            color: "rgba(0, 33, 66 , 0.8)",
            shape: 0,
          },
        ], //两个矩形的宽高与坐标
        x: 0, // 交叉轴的x
        y: 0, // 交叉轴的y
        url: "", // 保存图片URL
        radious: 5, // 边框可拖拽区间
        showLitRecs: true, // 显示9个可拖拽点
        recSize: 3, // 可拖拽点的宽高
        drag: false, // 要拖拽
        resize: false, // 要缩放
        draw: false, // 要画新的矩形
        index: -1, //正在操作哪个矩形
        side: 0, // 代表9个区域
        startX: 0, // 拖拽起点
        startY: 0, // 拖拽起点
        isRightClickIn: false, // 是否正在使用右键点击并且再矩形内
      },
      offset:{x:0,y:0}, // 可视区域外
      scale:1,
      scaleStep:0.1,
      maxScale:4,
      minScale:0.5,
      isTopIndex:-1,
      visible:false,
    };
  },
  mounted() {
    //alpha属性 {alpha:false}是否支持透明度，不支持会绘制相对快一些
    this.ctx = this.$refs.tagcanvas.getContext("2d");
    //画老的矩形
    this.drawOldRecs(this.tagObj.recs, this.ctx);
    document.oncontextmenu = (e) => { // 取消默认事件
        e.preventDefault()
    }
    document.addEventListener('keydown',(e)=>{
      if (this.tagObj.recs[this.tagObj.index]){ // 是左击了并且击了图案
        if(e.keyCode == 37 && this.tagObj.recs[this.tagObj.index].x >0) {
          this.tagObj.recs[this.tagObj.index].x--
        }else if (e.keyCode ==38 && this.tagObj.recs[this.tagObj.index].y >0) {
          this.tagObj.recs[this.tagObj.index].y--
        }else if (e.keyCode == 39 && this.tagObj.recs[this.tagObj.index].x <(this.$refs.tagcanvas.width-this.tagObj.recs[this.tagObj.index].w)) {
          this.tagObj.recs[this.tagObj.index].x++
        }else if (e.keyCode == 40 && this.tagObj.recs[this.tagObj.index].y <(this.$refs.tagcanvas.height-this.tagObj.recs[this.tagObj.index].h)) {
          this.tagObj.recs[this.tagObj.index].y++
        }else {
          alert('到边边了')
        }
        this.clearCanvas(this.$refs.tagcanvas, this.ctx); // 边移动边清除
        this.drawRuler(this.$refs.tagcanvas, this.ctx, e); // 交叉辅助线
        this.drawOldRecs(this.tagObj.recs, this.ctx); //画老的矩形
      }
    })
    // 拖拽
    this.drag("triangle");
    this.drag("circular");
    this.drag("rectangle");
  },
  methods: {
    handleOk(){
      // 删除掉这个矩形的数据
      this.tagObj.recs.splice(this.tagObj.index, 1);
      this.clearCanvas(this.$refs.tagcanvas, this.ctx); // 边移动边清除
      // this.drawRuler(this.$refs.tagcanvas, this.ctx, e); // 交叉辅助线
      this.drawOldRecs(this.tagObj.recs, this.ctx); //画老的矩形
      this.tagObj.isRightClickIn = false; // 还原右键统计
      this.visible = false
    },
    getOffsetLeft(obj) {
      //获取元素距离浏览器左侧距离
      var tmp = obj.offsetLeft;
      var node = obj.offsetParent;
      while (node != null) {
        tmp += node.offsetLeft;
        node = node.offsetParent;
      }
      return tmp;
    },
    getOffsetTop(obj) {
      //获取元素距离浏览器顶部距离
      var tmp = obj.offsetTop;
      var node = obj.offsetParent;
      while (node != null) {
        tmp += node.offsetTop;
        node = node.offsetParent;
      }
      return tmp;
    },
    drag(id) {
      //实例化拖拽
      var odiv = document.getElementById(id);
      var that = this;
      var flag = false;
      odiv.onmousedown = function (ev) {
        var ev = ev || event;
        var disX = ev.clientX - odiv.offsetLeft;
        var disY = ev.clientY - odiv.offsetTop;
        document.onmousemove = function (ev2) {
          var ev2 = ev2 || event;
          var left = ev2.clientX - disX;
          var top = ev2.clientY - disY;
          var w =  document.documentElement.clientWidth || document.body.clientWidth;
          var h =  document.documentElement.clientHeight || document.body.clientHeight;
          if (left > w - odiv.offsetWidth) {left = w - odiv.offsetWidth;}
          if (left < 0) {left = 0;}
          if (top < 0) {top = 0;}
          if (top > h - odiv.offsetHeight) {top = h - odiv.offsetHeight;}
          odiv.style.left = left + "px";
          odiv.style.top = top + "px";
        };
        document.onmouseup = function (ev2) {
          var currentTop = that.getOffsetTop(odiv);
          var currentLeft = that.getOffsetLeft(odiv);
          var canvasTop = that.getOffsetTop(that.$refs.tagcanvas);
          var canvasBottom = that.getOffsetTop(that.$refs.tagcanvas) + that.$refs.tagcanvas.height;
          var canvasLeft = that.getOffsetLeft(that.$refs.tagcanvas);
          var canvasRight = that.getOffsetLeft(that.$refs.tagcanvas) + that.$refs.tagcanvas.width;
          if (
            currentTop >= canvasTop &&
            currentTop <= canvasBottom &&
            currentLeft >= canvasLeft &&
            currentLeft <= canvasRight
          ) {
            //两个矩形的宽高与坐标
            if (!flag) {
              that.clearCanvas(that.$refs.tagcanvas, that.ctx); // 清除canvas
              if (odiv.id === "rectangle") {
                //矩形
                that.tagObj.recs.push({
                  h: 100 / that.scale,
                  w: 100 / that.scale,
                  x: ((currentLeft - canvasLeft) - that.offset.x) / that.scale,
                  y: ((currentTop - canvasTop) - that.offset.y) / that.scale,
                  color: "rgba(111, 84, 153 , 0.8)",
                  shape: 4,
                });
              } else if (odiv.id === "triangle") {
                //三角
                that.tagObj.recs.push({
                  h: 100 / that.scale,
                  w: 100 / that.scale,
                  x: ((currentLeft - canvasLeft) - that.offset.x) / that.scale,
                  y: ((currentTop - canvasTop) - that.offset.y) / that.scale,
                  color: "rgba(228, 134, 50 , 0.8)",
                  shape: 3,
                });
              } else if (odiv.id === "circular") {
                //圆
                that.tagObj.recs.push({
                  h: 100 / that.scale,
                  w: 100 / that.scale,
                  x: ((currentLeft - canvasLeft) - that.offset.x) / that.scale,
                  y: ((currentTop - canvasTop) - that.offset.y) / that.scale,
                  color: "rgba(0, 33, 66 , 0.8)",
                  shape: 0,
                });
              }
              that.drawOldRecs(that.tagObj.recs, that.ctx); //画老的矩形
              flag = true;
            }
          }
          odiv.style.left = "unset";
          odiv.style.top = "unset";
          flag = false;
          document.onmousemove = null;
        };
      };
    },
    // 中断
    mouseOut(e) {
      let dom = this.$refs.tagcanvas;
      let x = e.clientX; //此时鼠标区域距离body左边
      let y = e.clientY; //此时鼠标区域距离body上边
      let domx1 = dom.offsetLeft; //DOM左侧距离左侧距离
      let domy1 = dom.offsetTop; //DOM上测距离顶部距离
      let domx2 = dom.offsetLeft + dom.offsetWidth; //DOM右侧距离左侧距离
      let domy2 = dom.offsetTop + dom.offsetHeight; //DOM下测距离顶部距离
      if (x < domx1 || x > domx2 || y < domy1 || y > domy2) {
        // 如果鼠标落脚在canvas外边了
        this.clearCanvas(this.$refs.tagcanvas, this.ctx); // 清除canvas
        this.drawOldRecs(this.tagObj.recs, this.ctx); // 重新画所有存在的矩形，交叉辅助线没有了
      }
    },
    // 按下 OK
    mouseDown(e) {
      const canvasPosition = this.getCanvasPosition(e)
      const realCanvasPosition = {
          x:(canvasPosition.x - this.offset.x) / this.scale,
          y:(canvasPosition.y - this.offset.y) / this.scale,
      }
      this.tagObj.x = realCanvasPosition.x; // 每次落脚的落脚点为轴线圆心
      this.tagObj.y = realCanvasPosition.y; // 每次落脚的落脚点为轴线圆心
      //得到落点所在框的序数
      this.tagObj.index = this.getEventIndex(
        this.tagObj.recs,
        this.tagObj.x,
        this.tagObj.y,
        this.tagObj.radious
      );
      if (e.button == 2) {
        // e.button==2 代表是右键
        if (this.tagObj.index >= 0) {
          // 并且在矩形里
          this.tagObj.isRightClickIn = true;
        }else {
          this.tagObj.draw = true; // 这时候鼠标移动（mouseMove）就会添加矩形
        }
        return;
      }
      if (this.tagObj.index >= 0) {
        //在矩形里，移动或者放缩
        this.tagObj.startX = this.tagObj.recs[this.tagObj.index].x; // 每次拖拽的落脚点都要记录，不然就从左上角开始了
        this.tagObj.startY = this.tagObj.recs[this.tagObj.index].y; // 每次拖拽的落脚点都要记录，不然就从左上角开始了
        // 9个区域
        this.tagObj.side = this.getEventArea(
          this.tagObj.recs[this.tagObj.index],
          this.tagObj.x,
          this.tagObj.y,
          this.tagObj.radious
        );
        if (this.tagObj.side < 9) {
          // 并且在边边上
          this.tagObj.resize = true; // 这时候鼠标移动（mouseMove）就会缩放
        } else {
          //并且在里边
          this.tagObj.drag = true; // 这时候鼠标移动（mouseMove）就会拖动
        }
        //移动过程9个小框也在动
        this.drawLitRecs(
          this.ctx,
          this.prepareLitRecs(this.tagObj.recs[this.tagObj.index]),
          this.tagObj.recSize
        );
      }else {
        console.log('鼠标左击图形外边')
      }
      // 配置鼠标的css样式
      this.changeResizeCursor(this.$refs.tagcanvas, this.tagObj.side); //判断小框类型
    },
    // 抬起 OK
    mouseUp(e) {
      if (this.tagObj.isRightClickIn == true) {
        // 如果是右键点击图案里边
        this.tagObj.index = this.getEventIndex(
          this.tagObj.recs,
          this.tagObj.x,
          this.tagObj.y,
          this.tagObj.radious
        );
        this.visible = true // 显示出确认弹层
        this.tagObj.isRightClickIn = false
        return;
      }
      // 这里往下是左键抬起
      this.tagObj.resize = false; // 还原 缩放标识
      if(this.tagObj.drag == true) {
        //移动过程9个小框也在动
        this.drawLitRecs(
          this.ctx,
          this.prepareLitRecs(this.tagObj.recs[this.tagObj.index]),
          this.tagObj.recSize
        );
        this.tagObj.drag = false; // 还原 拖拽标识
      }
      if (this.tagObj.draw) {
        // 如果是在添加矩形
        this.addToRecs(this.$refs.tagcanvas, e); //那么就添加框
        this.tagObj.draw = false; // 还原添加矩形标识
      }
    },
    // 移动 OK
    mouseMove(e) {
      const canvasPosition = this.getCanvasPosition(e)
      const realCanvasPosition = {
          x:(canvasPosition.x - this.offset.x) / this.scale,
          y:(canvasPosition.y - this.offset.y) / this.scale,
      }
      var index;
      var side;
      this.clearCanvas(this.$refs.tagcanvas, this.ctx); // 边移动边清除
      this.drawRuler(this.$refs.tagcanvas, this.ctx, e); // 交叉辅助线
      this.drawOldRecs(this.tagObj.recs, this.ctx); //画老的矩形
      index = this.getEventIndex(
        this.tagObj.recs,
        realCanvasPosition.x,
        realCanvasPosition.y,
        this.tagObj.radious
      ); // 获得鼠标的落地所在的矩形
      if (index > -1) {
        side = this.getEventArea(
          this.tagObj.recs[index],
          realCanvasPosition.x,
          realCanvasPosition.y,
          this.tagObj.radious
        ); //得到落点在一个框中的区域
      } else {
        side = 0;
      }
      this.changeResizeCursor(this.$refs.tagcanvas, side); // 配置鼠标样式
      if (this.tagObj.showLitRecs && index >= 0 && side > 0) {
        // 说明在方框里呢（包括在边边）
        this.drawLitRecs(
          this.ctx,
          this.prepareLitRecs(this.tagObj.recs[index]),
          this.tagObj.recSize
        ); // 在方框里就会出现四周九个可操作点
      }
      if (this.tagObj.draw) {
        // 在方框外按下的状态 添加矩形
        this.drawRec(this.$refs.tagcanvas, this.ctx, e);
      }
      if (this.tagObj.drag) {
        // 在方框里按下的状态 拖拽
        this.moveRec(
          this.$refs.tagcanvas,
          this.tagObj.recs[this.tagObj.index],
          e
        );
      }
      if (this.tagObj.resize) {
        // 在方框边框上按下的状态 缩放
        this.reSizeRec(
          this.tagObj.side,
          this.tagObj.recs[this.tagObj.index],
          realCanvasPosition.x,
          realCanvasPosition.y,
          this.tagObj.recSize
        );
      }
    },
    // 鼠标滚轮事件
    mousewheel (e) {
        e.preventDefault()
        const canvasPosition = this.getCanvasPosition(e)
        const realCanvasPosition = {
            x:canvasPosition.x - this.offset.x,
            y:canvasPosition.y - this.offset.y,
        }
        const dealtX = realCanvasPosition.x / this.scale * this.scaleStep // 当前坐标/缩放系数*缩放系数升值 也就是滚出了canvas视口的数量
        const dealtY = realCanvasPosition.y / this.scale * this.scaleStep
        if (e.wheelDelta > 0 && this.scale < this.maxScale) {
            console.log('up')
            this.offset.x -= dealtX
            this.offset.y -= dealtY
            this.scale += this.scaleStep
        }else if (e.wheelDelta <=0 && this.scale > this.minScale){
            console.log('down')
            this.offset.x += dealtX
            this.offset.y += dealtY
            this.scale -= this.scaleStep
        }
        this.ctx.setTransform(this.scale,0,0,this.scale,this.offset.x,this.offset.y)
        this.clearCanvas(this.$refs.tagcanvas, this.ctx); // 边移动边清除
        this.drawRuler(this.$refs.tagcanvas, this.ctx, e); // 交叉辅助线
        this.drawOldRecs(this.tagObj.recs, this.ctx); //画老的矩形
    },
    // 获取鼠标距边测距离
    getCanvasPosition(e){
        return {
            x:e.offsetX,
            y:e.offsetY
        }
    },
    // 取消默认行为 OK
    contextMenu(e) {
      return false;
    },
    //得到落点所在框的序数，-1代表没有落在任何框内 OK
    getEventIndex(recs, x, y, radious) {
      if (recs.length == 0) {
        return -1;
      }
      for (var i = 0; i < recs.length; i++) {
        if (
          x > recs[i].x - radious &&
          x < recs[i].x + recs[i].w + radious &&
          y > recs[i].y - radious &&
          y < recs[i].y + recs[i].h + radious
        ) {
          return i;
        }
        if (i == recs.length - 1) {
          return -1;
        }
      }
    },
    // 橡皮擦 OK
    clearCanvas(canvas, ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    },
    //得到落点在一个框中的区域 OK
    getEventArea(data, x, y, radious) {
      if (x > data.x - radious && x < data.x + radious) {
        // =========左边
        if (y > data.y - radious && y < data.y + radious) {
          // 左上
          return 1;
        } else if (y > data.y + radious && y < data.y + data.h - radious) {
          //左中
          return 2;
        } else if (
          y > data.y + data.h - radious &&
          y < data.y + data.h + radious
        ) {
          // 左下
          return 3;
        }
      } else if (
        x > data.x + data.w - radious &&
        x < data.x + data.w + radious
      ) {
        // 右边
        if (y > data.y - radious && y < data.y + radious) {
          // =======右上
          return 4;
        } else if (y > data.y + radious && y < data.y + data.h - radious) {
          // 右中
          return 5;
        } else if (
          y > data.y + data.h - radious &&
          y < data.y + data.h + radious
        ) {
          // 右下
          return 6;
        }
      } else {
        if (
          y > data.y - radious &&
          y < data.y + radious &&
          x > data.x + radious &&
          x < data.x + data.w - radious
        ) {
          // 上中
          return 7;
        } else if (
          y > data.y + data.h - radious &&
          y < data.y + data.h + radious &&
          x > data.x + radious &&
          x < data.x + data.w - radious
        ) {
          // 下中
          return 8;
        } else {
          return 9;
        }
      }
    },
    // 画出9个点的矩形 OK
    drawLitRecs(ctx, data, size) {
      for (var i = 0; i < data.length; i++) {
          ctx.beginPath()
          ctx.fillStyle="#888";
          ctx.fillRect(data[i][0] - size / 2, data[i][1] - size / 2, size, size);
      }
    },
    // 配置鼠标的css样式 OK
    changeResizeCursor(canvas, index) {
      switch (index) {
        case 0:
          canvas.style.cursor = "crosshair";
          break;
        case 1:
          canvas.style.cursor = "se-resize";
          break;
        case 2:
          canvas.style.cursor = "e-resize";
          break;
        case 3:
          canvas.style.cursor = "ne-resize";
          break;
        case 4:
          canvas.style.cursor = "sw-resize";
          break;
        case 5:
          canvas.style.cursor = "w-resize";
          break;
        case 6:
          canvas.style.cursor = "nw-resize";
          break;
        case 7:
          canvas.style.cursor = "s-resize";
          break;
        case 8:
          canvas.style.cursor = "n-resize";
          break;
        case 9:
          canvas.style.cursor = "move";
          break;
        default:
          canvas.style.cursor = "default";
      }
    },
    // 添加矩形 OK
    addToRecs(canvas, e) {
      var rec = {};
      // this.tagObj.x 按下时的x  e.offsetX 抬起时的x
      // this.tagObj.y 按下时的y  e.offsetY 抬起时的y
      const canvasPosition = this.getCanvasPosition(e)
      const realCanvasPosition = {
          x:(canvasPosition.x - this.offset.x) / this.scale,
          y:(canvasPosition.y - this.offset.y) / this.scale,
      }
      rec.x = this.tagObj.x > realCanvasPosition.x ? realCanvasPosition.x : this.tagObj.x;
      rec.y = this.tagObj.y > realCanvasPosition.y ? realCanvasPosition.y : this.tagObj.y;
      rec.w = Math.abs(realCanvasPosition.x - this.tagObj.x);
      rec.h = Math.abs(realCanvasPosition.y - this.tagObj.y);
      rec.color = [
        "rgb(254, 67, 101)",
        "rgb(252, 157, 154)",
        "rgb(249, 205, 173)",
        "rgb(200, 200, 169)",
        "rgb(131, 175, 155)",
      ][Math.floor(Math.random() * 5 + 0)];
      rec.shape = [0, 3, 4][Math.floor(Math.random() * 3 + 0)]; // 随机数
      //rec.type = currentSelectedType;
      this.tagObj.newrecsObj = rec; //最后一个添加的矩形
      this.tagObj.recs.push(this.tagObj.newrecsObj); // 推向矩形数组里
      this.tagObj.url = this.$refs.tagcanvas.toDataURL(); // 每次画完就保存一下图片
    },
    // 交叉辅助线 OK
    drawRuler(canvas, ctx, e) {
      const canvasPosition = this.getCanvasPosition(e)
      const realCanvasPosition = {
          x:(canvasPosition.x - this.offset.x) / this.scale,
          y:(canvasPosition.y - this.offset.y) / this.scale,
      }
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = "#515050";
      ctx.setLineDash([5, 5]);
      ctx.moveTo(realCanvasPosition.x, 0);
      ctx.lineTo(realCanvasPosition.x, canvas.height);
      ctx.moveTo(0, realCanvasPosition.y);
      ctx.lineTo(canvas.width, realCanvasPosition.y);
      ctx.stroke();
    },
    //获得矩形9个点的坐标 OK
    prepareLitRecs(data) {
      var li = [];
      li[0] = [data.x, data.y]; // 左上坐标
      li[1] = [data.x, data.y + data.h / 2]; // 左中坐标
      li[2] = [data.x, data.y + data.h]; // 左下坐标
      li[3] = [data.x + data.w, data.y]; // 右上坐标
      li[4] = [data.x + data.w, data.y + data.h / 2]; // 右中坐标
      li[5] = [data.x + data.w, data.y + data.h]; // 右下坐标
      li[6] = [data.x + data.w / 2, data.y]; // 上中坐标
      li[7] = [data.x + data.w / 2, data.y + data.h]; // 下中坐标
      return li;
    },
    //画老的矩形 OK
    drawOldRecs(recs, ctx) {
      //鼠标画图后
      if (recs.length == 0) {
        return 0;
      }
      for (var i = 0; i < recs.length; i++) {
        if (recs[i].shape == 4) {
          // 四边形
          this.ctx.beginPath();
          ctx.lineWidth = 3;
          ctx.fillStyle = recs[i].color; //自定义颜色
          ctx.fillRect(recs[i].x, recs[i].y, recs[i].w, recs[i].h);
        }
        if (recs[i].shape == 3) {
          //三角形
          //填充三角形（等边）
          ctx.beginPath();
          ctx.moveTo(recs[i].x + recs[i].w / 2, recs[i].y); //从A（100,0）开始
          ctx.lineTo(recs[i].x, recs[i].y + recs[i].h);
          ctx.lineTo(recs[i].x + recs[i].w, recs[i].y + recs[i].h); //B(0,173)-C(200,173)
          // var grd = ctx.createLinearGradient(0, 0, 200, 0); //使用渐变颜色填充,从(0,0)到(200,0) （左到右）
          // grd.addColorStop(0, "#4CE8B2"); //起始颜色
          // grd.addColorStop(1, "#EFD458"); //终点颜色
          // ctx.fillStyle = grd; //以上面定义的渐变填充
          ctx.fillStyle = recs[i].color;
          ctx.fill(); //闭合形状并且以填充方式绘制出来
          ctx.closePath();
        }
        if (recs[i].shape == 0) {
          ctx.beginPath();
          ctx.fillStyle = recs[i].color;
          ctx.ellipse(
            recs[i].x + recs[i].w / 2,
            recs[i].y + recs[i].h / 2,
            recs[i].w / 2,
            recs[i].h / 2,
            0,
            0,
            Math.PI * 2,
            false
          );
          // ctx.arc(recs[i].x,recs[i].y,recs[i].w,0*Math.PI,2*Math.PI,false);
          ctx.fill();
          ctx.closePath();
        }
      }
    },
    // 鼠标拖拽画新矩形 OK
    drawRec(canvas, ctx, e) {
      // ctx.fillStyle = "rgb(121, 245, 57)";
      const canvasPosition = this.getCanvasPosition(e)
      const realCanvasPosition = {
          x:(canvasPosition.x - this.offset.x) / this.scale,
          y:(canvasPosition.y - this.offset.y) / this.scale,
      }
      ctx.fillRect(
        this.tagObj.x,
        this.tagObj.y,
        realCanvasPosition.x - this.tagObj.x,
        realCanvasPosition.y - this.tagObj.y
      );
    },
    // 拖拽让矩形移动 OK
    moveRec(canvas, rec, e) {
      const canvasPosition = this.getCanvasPosition(e)
      const realCanvasPosition = {
          x:(canvasPosition.x - this.offset.x) / this.scale,
          y:(canvasPosition.y - this.offset.y) / this.scale,
      }
      rec.x = this.tagObj.startX + realCanvasPosition.x - this.tagObj.x;
      rec.y = this.tagObj.startY + realCanvasPosition.y - this.tagObj.y;
    },
    // 9个点对应缩放 OK
    reSizeRec(index, rec, ex, ey, recSize) {
      var temX = rec.x;
      var temY = rec.y;
      if (index < 4 && temX + rec.w - ex > recSize) {
        rec.x = ex;
      }
      if (
        (index == 1 || index == 4 || index == 7) &&
        temY + rec.h - ey > recSize
      ) {
        rec.y = ey;
      }
      if (index < 4) {
        if (temX + rec.w - ex > recSize) {
          rec.w = temX + rec.w - ex;
        }
      } else if (index < 7) {
        if (ex - temX > recSize) {
          rec.w = ex - temX;
        }
      }
      if (index == 1 || index == 4 || index == 7) {
        if (temY + rec.h - ey > recSize) {
          rec.h = temY + rec.h - ey;
        }
      } else if (index == 3 || index == 6 || index == 8) {
        if (ey - temY > recSize) {
          rec.h = ey - temY;
        }
      }
    },
  },
};
</script>
<style scoped>
.tagcanvasbox {
  width: 100%;
  height: 100vh;
}
canvas {
  border: 1px solid #ccc;
  background-color: #c0e7ed;
}
html {
  margin: 0;
  padding: 0;
  height: 100%;
}
body {
  margin: 0;
  padding: 0;
  height: 100%;
}
.box {
  width: 100%;
  height: 100%;
  background: #f5f5f5;
  display: flex;
  justify-content: center;
}
.canvas {
  background: #ddd;
  max-height: 800px;
  cursor: pointer;
}
.leftBox {
  width: 200px;
  max-height: 800px;
  margin-right: 10px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
  background: #c0e7ed;
}
.circular {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: rgba(0, 33, 66, 0.8);
}
.tri-box {
  width: 100px;
  height: 85px;
}
.triangle {
  width: 0;
  height: 0;
  position: absolute;
  border-left: 50px solid transparent;
  border-right: 50px solid transparent;
  border-bottom: 85px solid rgba(228, 134, 50, 0.8);
}
.rectangle {
  width: 100px;
  height: 100px;
  background: rgba(111, 84, 153, 0.8);
}
#circular {
  position: absolute;
}
#triangle {
  width: 0;
  height: 0;
  border-left: 50px solid transparent;
  border-right: 50px solid transparent;
  border-bottom: 85px solid rgba(228, 134, 50, 0.8);
  position: absolute;
  z-index: 1;
}
#rectangle {
  position: absolute;
}
</style>