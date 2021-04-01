<!--
 * @Descripttion: 
 * @version: 
 * @Author: lzy
 * @Date: 2021-03-31 09:39:52
 * @LastEditors: Andy
 * @LastEditTime: 2021-03-31 15:01:28
-->
<template>
    <div>
        <canvas 
        ref="demo3canvas" 
        width="600" 
        height="600" 
        style="border:1px solid #ccc"
        @mousedown ="mousedown($event)"
        @mousemove ="mousemove($event)"
        @mouseup ="mouseup($event)"
        @mousewheel ="mousewheel($event)"
        ></canvas>
    </div>
</template>
<script>
export default {
    data () {
        return {
            ctx:'',
            width:'',
            height:'',
            scaleNum:2,
            curZoom:2,
            translateX: 0, // 圆心坐标x
            translateY: 0, // 圆心坐标y
        }
    },
    mounted () {
        this.ctx = this.$refs.demo3canvas.getContext('2d');
        this.width = this.$refs.demo3canvas.width
        this.height = this.$refs.demo3canvas.height
        this.draw()
    },
    methods:{
        draw(){
            this.ctx.scale(this.curZoom,this.curZoom);
            this.ctx.strokeStyle='black'
            this.ctx.strokeRect(5,5,25,15);
            this.ctx.strokeRect(50,50,25,15);
        },
        mousedown (e) {

        },
        mousemove (e) {
            this.clearCanvas(this.$refs.demo3canvas, this.ctx); // 边移动边清除
            this.drawRuler(this.$refs.demo3canvas, this.ctx, e); // 交叉辅助线
            this.ctx.strokeStyle='black'
            this.ctx.strokeRect(5,5,25,15);
            this.ctx.strokeRect(50,50,25,15);
        },
        mouseup (e) {

        },
        mousewheel (e) {
            let z = e.deltaY > 0 ? -0.1 : 0.1
            this.ctx.save()
            this.curZoom = this.scaleNum + z
            this.translateX = e.offsetX - (e.offsetX - this.translateX) * this.curZoom / this.scaleNum
            this.translateY = e.offsetY - (e.offsetY - this.translateY) * this.curZoom / this.scaleNum
            // 圆心位置移动数量 = 鼠标位置 - （鼠标位置减上次的鼠标位置所获得的差） * 缩放的比例 / 上次的缩放比例
            this.ctx.translate(this.translateX, this.translateY)
            this.ctx.scale(this.curZoom, this.curZoom); // 放大倍数在改变
            this.clearCanvas(this.$refs.demo3canvas, this.ctx); // 边移动边清除
            this.drawRuler(this.$refs.demo3canvas, this.ctx, e); // 交叉辅助线
            this.ctx.strokeStyle='black'
            this.ctx.strokeRect(5,5,25,15);
            this.ctx.strokeRect(50,50,25,15);
            this.ctx.restore()
            
            this.scaleNum = this.curZoom
        },
        // 橡皮擦
        clearCanvas(canvas, ctx) { 
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        },
        // 交叉辅助线
        drawRuler(canvas, ctx, e) { 
            ctx.beginPath();
            ctx.lineWidth = 1/this.scaleNum;
            ctx.strokeStyle="#dfdfdf";
            ctx.moveTo(e.offsetX/this.scaleNum, 0);
            ctx.lineTo(e.offsetX/this.scaleNum, canvas.height);
            ctx.moveTo(0, e.offsetY/this.scaleNum);
            ctx.lineTo(canvas.width, e.offsetY/this.scaleNum);
            ctx.stroke();
        },
    }
}
</script>
