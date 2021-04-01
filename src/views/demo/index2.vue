<template>
    <div ref="tagcanvasbox" class="tagcanvasbox">
        <!-- <div>
            <p>1 判断鼠标落脚到哪个矩形</p>
            <p>2 移动到矩形内部，显示9个区域</p>
            <p>3 判断不同区域 显示不同鼠标样式</p>
            <p>4 鼠标在矩形内部，拖拽</p>
            <p>5 矩形在矩形边框，缩放</p>
            <p>6 矩形外添加矩形</p>
            <p>7 右键点击矩形删除矩形</p>
        </div> -->
        <canvas ref="tagcanvas" 
            width='844' height='475'
            @mousedown ="mouseDown($event)" 
            @mouseup ="mouseUp($event)"
            @mousemove ="mouseMove($event)"
            @contextmenu.prevent ="contextMenu($event)"
            @mouseout ="mouseOut($event)"
            @mousewheel ="mousewheel($event)"
            ></canvas>
    </div>
</template>
<script>
export default {
    name:'canvas',
    data(){
        return{
            ctx:'',
            tagObj:{
                newrecsObj:{},
                recs:[
                    {h: 36,w: 58,x: 404,y: 161,color:'rgba(0, 33, 66 , 0.8)',shape:4},
                    {h: 67,w: 58,x: 239,y: 49,color:'rgba(228, 134, 50 , 0.8)',shape:3},
                    {h: 67,w: 58,x: 20,y: 20,color:'rgba(111, 84, 153 , 0.8)',shape:0},
                ],// 画板上的图案
                x:0, // 交叉轴的x
                y:0, // 交叉轴的y
                url:'', // 保存图片URL
                radious:5, // 边框可拖拽区间
                showLitRecs:true, // 显示9个可拖拽点
                recSize:5, // 可拖拽点的宽高
                drag:false, // 要拖拽
                resize:false, // 要缩放
                draw:false, // 要画新的矩形
                index:-1, //正在操作哪个矩形
                side:0, // 代表9个区域
                startX:0,// 拖拽起点
                startY:0, // 拖拽起点
                isRightClick:false, // 是否正在使用右键点击
            },
            // fontX:0,
            // fontY:0,
            // fontZoom:1,
            // curZoom:1,
            // translateX:0,
            // translateY:0,
        }
    },
    mounted(){
        this.ctx = this.$refs.tagcanvas.getContext('2d');
        this.drawOldRecs(this.tagObj.recs, this.ctx); //画老的矩形
    },
    methods:{
        // 中断
        mouseOut(e){
          let dom = this.$refs.tagcanvas;
            let x =e.clientX; //此时鼠标区域距离body左边
            let y =e.clientY;//此时鼠标区域距离body上边
            let domx1 = dom.offsetLeft; //DOM左侧距离左侧距离
            let domy1 = dom.offsetTop; //DOM上测距离顶部距离
            let domx2 = dom.offsetLeft + dom.offsetWidth; //DOM右侧距离左侧距离
            let domy2 = dom.offsetTop + dom.offsetHeight; //DOM下测距离顶部距离
            console.log(x,y)
            console.log(domx1,domy1,domx2,domy2)
            if( x < domx1 || x > domx2 || y < domy1 || y > domy2){ // 如果鼠标落脚在canvas外边了
                this.clearCanvas(this.$refs.tagcanvas, this.ctx); // 清除canvas
                this.drawOldRecs(this.tagObj.recs, this.ctx); // 重新画所有存在的矩形，交叉辅助线没有了
            }
        },
        // 按下 OK
        mouseDown(e){
            console.log('mouseDown',e.button);
            this.tagObj.x = e.offsetX; // 每次落脚的落脚点为轴线圆心
            this.tagObj.y = e.offsetY; // 每次落脚的落脚点为轴线圆心
            //得到落点所在框的序数
            this.tagObj.index = this.getEventIndex(this.tagObj.recs, this.tagObj.x, this.tagObj.y, this.tagObj.radious);
            if (e.button == 2) { // e.button==2 代表是右键
                if (this.tagObj.index >= 0) { // 并且在矩形里
                    this.tagObj.isRightClick = true;
                }
                return;
            }
            if (this.tagObj.index >= 0) { //在矩形里，移动或者放缩
                this.tagObj.startX = this.tagObj.recs[this.tagObj.index].x; // 每次拖拽的落脚点都要记录，不然就从左上角开始了
                this.tagObj.startY = this.tagObj.recs[this.tagObj.index].y;// 每次拖拽的落脚点都要记录，不然就从左上角开始了
                // 9个区域
                this.tagObj.side = this.getEventArea(this.tagObj.recs[this.tagObj.index], this.tagObj.x, this.tagObj.y, this.tagObj.radious);
                if (this.tagObj.side < 9) { // 并且在边边上
                    this.tagObj.resize = true; // 这时候鼠标移动（mouseMove）就会缩放
                } else { //并且在里边
                    this.tagObj.drag = true; // 这时候鼠标移动（mouseMove）就会拖动
                }
                //移动过程9个小框也在动
                this.drawLitRecs(this.ctx, this.prepareLitRecs(this.tagObj.recs[this.tagObj.index]), this.tagObj.recSize);
            } else { // 不再矩形里，在矩形外边
                this.tagObj.draw = true;// 这时候鼠标移动（mouseMove）就会添加矩形
            }
            // 配置鼠标的css样式
            this.changeResizeCursor(this.$refs.tagcanvas, this.tagObj.side); //判断小框类型
        },
        // 抬起 OK
        mouseUp(e){
          // console.log('mouseUp',e);
            if (this.tagObj.isRightClick == true) { // 如果是右键点击抬起的
                // 获取当前是在哪里矩形里
                this.tagObj.index = this.getEventIndex(this.tagObj.recs, this.tagObj.x, this.tagObj.y, this.tagObj.radious);
                // 删除掉这个矩形的数据
                this.tagObj.recs.splice(this.tagObj.index, 1);
                // 清空画板
                this.clearCanvas(this.$refs.tagcanvas, this.ctx);
                // 重新画删除后所剩的矩形数据
                for (var i = 0; i < this.tagObj.recs.length; i++) {
                    this.ctx.strokeRect(this.tagObj.recs[i].x, this.tagObj.recs[i].y, this.tagObj.recs[i].w, this.tagObj.recs[i].h);
                }
                this.tagObj.isRightClick = false; // 还原右键统计
                return;
            }
            // 这里往下是左键抬起
            this.tagObj.resize = false; // 还原 缩放标识
            this.tagObj.drag = false; // 还原 拖拽标识
            if (this.tagObj.draw) { // 如果是在添加矩形
                this.addToRecs(this.$refs.tagcanvas, e); //那么就添加框
                this.tagObj.draw = false; // 还原添加矩形标识
            }
        },
        // 移动 OK
        mouseMove(e){
          // console.log('mouseMove',e);
            var index;
            var side;
            this.clearCanvas(this.$refs.tagcanvas, this.ctx); // 边移动边清除
            this.drawRuler(this.$refs.tagcanvas, this.ctx, e); // 交叉辅助线
            this.drawOldRecs(this.tagObj.recs, this.ctx); //画老的矩形
            index = this.getEventIndex(this.tagObj.recs, e.offsetX, e.offsetY, this.tagObj.radious); // 获得鼠标的落地所在的矩形
            if (index > -1) {
                // console.log('鼠标在第'+index+'个矩形里边')
                side = this.getEventArea(this.tagObj.recs[index], e.offsetX, e.offsetY, this.tagObj.radious); //得到落点在一个框中的区域
            } else {
                side = 0;
            }
            // var text = 
            //     side ==1?'左上':
            //     side==2?'左中':
            //     side==3?'左下':
            //     side==4?'右上':
            //     side==5?'右中':
            //     side==6?'右下':
            //     side==7?'上中':
            //     side==8?'下中':
            //     side==9?'里边':
            //     side==0?'外边':'啥也不是'
            //     console.log('text',text)
            this.changeResizeCursor(this.$refs.tagcanvas, side); // 配置鼠标样式
            if (this.tagObj.showLitRecs && index >= 0 && side > 0) { // 说明在方框里呢（包括在边边）
                this.drawLitRecs(this.ctx, this.prepareLitRecs(this.tagObj.recs[index]), this.tagObj.recSize); // 在方框里就会出现四周九个可操作点
            }
            if (this.tagObj.draw) {// 在方框外按下的状态 添加矩形
                this.drawRec(this.$refs.tagcanvas, this.ctx, e);
            }
            if (this.tagObj.drag) {// 在方框里按下的状态 拖拽
                this.moveRec(this.$refs.tagcanvas, this.tagObj.recs[this.tagObj.index], e);
            }
            if (this.tagObj.resize) {// 在方框边框上按下的状态 缩放
                this.reSizeRec(this.tagObj.side, this.tagObj.recs[this.tagObj.index], e.offsetX, e.offsetY, this.tagObj.recSize);
            }
        },
        // 鼠标滚轮事件
        mousewheel (e) {
            // let z = e.deltaY > 0 ? -0.1 : 0.1
            // this.ctx.save()
            // this.clearCanvas(this.$refs.tagcanvas, this.ctx); // 边移动边清除
            // this.drawRuler(this.$refs.tagcanvas, this.ctx, e); // 交叉辅助线
            // this.curZoom = this.fontZoom + z
            // this.translateX = e.offsetX - (e.offsetX - this.translateX) * this.curZoom / this.fontZoom
            // this.translateY = e.offsetY - (e.offsetY - this.translateY) * this.curZoom / this.fontZoom
            // this.ctx.translate(this.translateX, this.translateY)
            // this.ctx.scale(this.curZoom, this.curZoom);
            // this.drawOldRecs(this.tagObj.recs, this.ctx); //画老的矩形
            // this.ctx.restore()
            // this.fontY = e.offsetY
            // this.fontX = e.offsetX
            // this.fontZoom = this.curZoom
        },
        // 取消默认行为 OK
        contextMenu(e){
          return false;
        },
        //得到落点所在框的序数，-1代表没有落在任何框内 OK
        getEventIndex(recs, x, y, radious) {
            if (recs.length == 0) {
                return -1;
            }
            for (var i = 0; i < recs.length; i++) {
                if (x > (recs[i].x - radious) && x < (recs[i].x + recs[i].w + radious) &&
                    y > (recs[i].y - radious) && y < (recs[i].y + recs[i].h + radious)) {
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
            if (x > (data.x - radious) && x < (data.x + radious)) { // =========左边
                if (y > (data.y - radious) && y < (data.y + radious)) { // 左上
                    return 1;
                } else if (y > (data.y + radious) && y < (data.y + data.h - radious)) { //左中
                    return 2;
                } else if(y > (data.y + data.h - radious)&& y < (data.y + data.h + radious)){ // 左下
                    return 3;
                }
            } else if (x > (data.x + data.w - radious) && x < (data.x + data.w + radious)) { // 右边
                if (y > (data.y - radious) && y < (data.y + radious)) { // =======右上
                    return 4;
                } else if (y > (data.y + radious) && y < (data.y + data.h - radious)) { // 右中
                    return 5;
                } else if (y > (data.y + data.h - radious) && y < (data.y + data.h + radious)){ // 右下
                    return 6;
                }
            } else {
                if (y > (data.y - radious) && y < (data.y + radious) && x > (data.x + radious) && x < (data.x + data.w- radious)) { // 上中
                    return 7;
                } else if (y > (data.y + data.h - radious) && y < (data.y + data.h + radious) && x > (data.x + radious) && x < (data.x + data.w - radious)) {// 下中
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
            rec.x = (this.tagObj.x > e.offsetX) ? e.offsetX : this.tagObj.x;
            rec.y = (this.tagObj.y > e.offsetY) ? e.offsetY : this.tagObj.y;
            rec.w = Math.abs(e.offsetX - this.tagObj.x);
            rec.h = Math.abs(e.offsetY - this.tagObj.y);
            rec.color = ['rgb(254, 67, 101)','rgb(252, 157, 154)','rgb(249, 205, 173)','rgb(200, 200, 169)','rgb(131, 175, 155)'][Math.floor(Math.random()*5+0)];
            rec.shape = [0,3,4][Math.floor(Math.random()*3+0)];// 随机数
            //rec.type = currentSelectedType;
            this.tagObj.newrecsObj = rec; //最后一个添加的矩形
            this.tagObj.recs.push(this.tagObj.newrecsObj); // 推向矩形数组里
            this.tagObj.url = this.$refs.tagcanvas.toDataURL(); // 每次画完就保存一下图片
            // console.log('this.tagObj.url', this.tagObj.url)
        },
        // 交叉辅助线 OK
        drawRuler(canvas, ctx, e) { 
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.strokeStyle="#000";
            ctx.moveTo(e.offsetX, 0);
            ctx.lineTo(e.offsetX, canvas.height);
            ctx.moveTo(0, e.offsetY);
            ctx.lineTo(canvas.width, e.offsetY);
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
        drawOldRecs(recs, ctx) { //鼠标画图后
            if (recs.length == 0) {
                return 0;
            }
            for (var i = 0; i < recs.length; i++) {
                if(recs[i].shape == 4){ // 四边形
                    this.ctx.beginPath();
                    ctx.lineWidth = 3;
                    ctx.fillStyle = recs[i].color; //自定义颜色
                    ctx.fillRect(recs[i].x, recs[i].y, recs[i].w, recs[i].h);
                }
                if(recs[i].shape == 3){ //三角形
                    //填充三角形（等边）
                    ctx.beginPath();
                    ctx.moveTo(recs[i].x+recs[i].w/2,recs[i].y); //从A（100,0）开始
                    ctx.lineTo(recs[i].x,recs[i].y+recs[i].h);
                    ctx.lineTo(recs[i].x+recs[i].w,recs[i].y+recs[i].h); //B(0,173)-C(200,173)
                    var grd = ctx.createLinearGradient(0,0,200,0);//使用渐变颜色填充,从(0,0)到(200,0) （左到右）
                    grd.addColorStop(0,"#4CE8B2"); //起始颜色
                    grd.addColorStop(1,"#EFD458"); //终点颜色
                    ctx.fillStyle=grd; //以上面定义的渐变填充
                    ctx.fill(); //闭合形状并且以填充方式绘制出来
                    ctx.closePath();
                }
                if (recs[i].shape == 0) {
                    ctx.beginPath();
                    ctx.fillStyle = recs[i].color;
                    ctx.ellipse(recs[i].x+recs[i].w/2,recs[i].y+recs[i].h/2,recs[i].w/2,recs[i].h/2,0,0,Math.PI*2,false);
                    // ctx.arc(recs[i].x,recs[i].y,recs[i].w,0*Math.PI,2*Math.PI,false);
                    ctx.fill()
                    ctx.closePath();
                }
            }
        },
        // 鼠标拖拽画新矩形 OK
        drawRec(canvas, ctx, e) {
            ctx.fillStyle = "rgb(121, 245, 57)";
            ctx.fillRect(this.tagObj.x, this.tagObj.y, e.offsetX - this.tagObj.x, e.offsetY - this.tagObj.y);
        },
        // 拖拽让矩形移动 OK
        moveRec(canvas, rec, e) {
            rec.x = this.tagObj.startX + e.offsetX - this.tagObj.x;
            rec.y = this.tagObj.startY + e.offsetY - this.tagObj.y;
        },
        // 9个点对应缩放 OK
        reSizeRec(index, rec, ex, ey, recSize) {
            var temX = rec.x;
            var temY = rec.y;
            if (index < 4 && temX + rec.w - ex > recSize) {
                rec.x = ex;
            }
            if ((index == 1 || index == 4 || index == 7) && temY + rec.h - ey > recSize) {
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
        }
    }
}
</script>
<style scoped>
.tagcanvasbox{
    width: 100%;
    height: 100vh;
}
canvas{
    border: 1px solid #ccc;
    background-color: #c0e7ed;
}
</style>