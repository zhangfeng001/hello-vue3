<template>
    <div ref="tagcanvasbox" class="tagcanvasbox">
        <canvas ref="tagcanvas" 
            width='800' height='400'
            @mousedown ="mouseDown($event)" 
            @mouseup ="mouseUp($event)"
            @mousemove ="mouseMove($event)"
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
                recs:[{h: 36,w: 58,x: 404,y: 161},{h: 67,w: 58,x: 239,y: 49}],  //两个矩形的宽高与坐标
                x:0, // 交叉轴的x
                y:0, // 交叉轴的y
                radious:5, // 边框可拖拽区间
                showLitRecs:true, // 显示9个可拖拽点
                recSize:5, // 可拖拽点的宽高
                drag:false, // 要拖拽
                resize:false, // 要缩放
                draw:false, // 要画新的矩形
                index:-1, //正在操作哪个矩形
                side:0, // 代表9个区域
                isRightClick:false // 是否正在使用右键点击
            }
        }
    },
    mounted(){
        this.ctx = this.$refs.tagcanvas.getContext('2d');
        this.drawOldRecs(this.tagObj.recs, this.ctx); //画老的矩形
    },
    methods:{
        // 按下 OK
        mouseDown(e){
            console.log('mouseDown');
            this.tagObj.x = e.offsetX; // 每次落脚的落脚点为轴线圆心
            this.tagObj.y = e.offsetY; // 每次落脚的落脚点为轴线圆心
            //得到落点所在框的序数
            this.tagObj.index = this.getEventIndex(this.tagObj.recs, this.tagObj.x, this.tagObj.y, this.tagObj.radious);
            if (e.button == 2) { // e.button==2 代表是右键
                if (this.tagObj.index >= 0) { // 并且在矩形里
                    this.tagObj.isRightClick = true;
                    console.log('右键点击鼠标')
                }
                return;
            }
            if (this.tagObj.index >= 0) { //在矩形里，移动或者放缩
                // 9个区域
                this.tagObj.side = this.getEventArea(this.tagObj.recs[this.tagObj.index], this.tagObj.x, this.tagObj.y, this.tagObj.radious);
                if (this.tagObj.side < 9) { // 并且在边边上
                    console.log('在矩形的边边上，此时要缩放')
                    this.tagObj.resize = true; // 这时候鼠标移动（mouseMove）就会缩放
                } else { //并且在里边
                    console.log('在矩形的里边，此时要拖动')
                    this.tagObj.drag = true; // 这时候鼠标移动（mouseMove）就会拖动
                }
            } else { // 不再矩形里，在矩形外边
                console.log('在矩形的外边，此时要添加')
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
                console.log(`删除索引为${this.tagObj.index}的矩形`)
                return;
            }
            // 这里往下是左键抬起
            this.tagObj.resize = false; // 还原 缩放标识
            this.tagObj.drag = false; // 还原 拖拽标识
            this.tagObj.draw = false; // 还原添加矩形标识
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
                console.log('鼠标在第'+index+'个矩形里边')
                side = this.getEventArea(this.tagObj.recs[index], e.offsetX, e.offsetY, this.tagObj.radious); //得到落点在一个框中的区域
            } else {
                side = 0;
            }
            var text = 
                side ==1?'左上':
                side==2?'左中':
                side==3?'左下':
                side==4?'右上':
                side==5?'右中':
                side==6?'右下':
                side==7?'上中':
                side==8?'下中':
                side==9?'里边':
                side==0?'外边':'啥也不是'
                console.log('位置在',text)
                console.log('紧接着画出鼠标css样式')
            this.changeResizeCursor(this.$refs.tagcanvas, side); // 配置鼠标样式
            if (this.tagObj.showLitRecs && index >= 0 && side > 0) { // 说明在方框里呢（包括在边边）
                console.log('此时要出现9个区域的方框')
                this.drawLitRecs(this.ctx, this.prepareLitRecs(this.tagObj.recs[index]), this.tagObj.recSize); // 在方框里就会出现四周九个可操作点
            }
            if (this.tagObj.draw) {// 在方框外按下的状态 添加矩形
                this.tagObj.draw = true; // 还原添加矩形标识
                console.log('添加')
            }
            if (this.tagObj.drag) {// 在方框里按下的状态 拖拽
                this.tagObj.drag = true; // 还原 拖拽标识
                console.log('拖拽')
            }
            if (this.tagObj.resize) {// 在方框边框上按下的状态 缩放
                this.tagObj.resize = true; // 还原 缩放标识
               console.log('缩放')
            }
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
                ctx.strokeRect(data[i][0] - size / 2, data[i][1] - size / 2, size, size);
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
                this.ctx.beginPath();
                ctx.lineWidth = 3;
                ctx.strokeStyle = "rgb(121, 245, 57)";
                ctx.strokeRect(recs[i].x, recs[i].y, recs[i].w, recs[i].h);
            }
        },
    }
}
</script>
<style scoped>
.tagcanvasbox{
    width: 100%;
    height: 100%;
    position: relative;

}
canvas{
    position: absolute;
    top: 10px;
    left: 10px;
    border: 1px solid #ccc;
}
</style>