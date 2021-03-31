<!--
 * @Descripttion: 
 * @version: 
 * @Author: lzy
 * @Date: 2021-03-31 09:39:52
 * @LastEditors: Andy
 * @LastEditTime: 2021-03-31 13:09:22
-->
<template>
    <div>
        <canvas 
        ref="demo3canvas" 
        width="500" 
        height="500" 
        style="border:1px solid #ccc"
        @mousemove ="mouseMove($event)"
        ></canvas>
    </div>
</template>
<script>
export default {
    data () {
        return {
            ctx:'',
            rec:[{h: 36,w: 58,x: 104,y: 161},{h: 36,w: 58,x: 204,y: 101}],
            radious:10,
            fontZoom: 1, // 上一次缩放比例
            curZoom: 1, // 缩放比例
            translateX: 0, // 圆心坐标x
            translateY: 0, // 圆心坐标y
        }
    },
    mounted () {
        this.ctx = this.$refs.demo3canvas.getContext('2d');
        this.draw()
        //  鼠标滚轮事件
        this.$refs.demo3canvas.addEventListener('mousewheel', (e) => {
            // e.deltaY正值向下滚动 = 缩小，负值向上滚动 = 放大
            // e.offsetX,e.offsetY 滚动的圆点坐标
            let z = e.deltaY > 0 ? -10 : 10
            this.zoom(z)
        })
    },
    methods:{
        draw() {
            this.ctx.scale(1,1)
            this.ctx.fillStyle = 'red'
            this.rec.forEach(val => {
                this.ctx.fillRect(val.x, val.y, val.w, val.h)
            })
            // this.ctx.scale(2,2)
            // this.ctx.fillStyle = 'yellow'
            // this.ctx.fillRect(50, 50, 50, 50)

            // this.ctx.scale(2,2)
            // this.ctx.fillStyle = 'pink'
            // this.ctx.fillRect(50, 50, 50, 50)
        },
        mouseMove(e) {
            this.clearCanvas(this.$refs.demo3canvas, this.ctx); // 边移动边清除
            this.drawRuler(this.$refs.demo3canvas, this.ctx, e); // 交叉辅助线
            this.draw()
            this.index = this.getEventIndex(this.rec, e.offsetX, e.offsetY, this.radious); // 获得鼠标的落地所在的矩形
        },
        // 交叉辅助线
        drawRuler(canvas, ctx, e) { 
            // /4画板默认一共放大了4倍所以缩小4倍
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.strokeStyle="#dfdfdf";
            ctx.moveTo(e.offsetX, 0);
            ctx.lineTo(e.offsetX, canvas.height);
            ctx.moveTo(0, e.offsetY);
            ctx.lineTo(canvas.width, e.offsetY);
            ctx.stroke();
        },
        // 橡皮擦
        clearCanvas(canvas, ctx) { 
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        },
        //得到落点所在框的序数，-1代表没有落在任何框内
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
        zoom(z) {
            if (this.index<0) return
            if((this.rec[this.index].w<=10 || this.rec[this.index].h<=10) && z == -10) return
            this.rec[this.index].w += z
            this.rec[this.index].h += z
            this.draw()
        }
    }
}
</script>
