<template>
    <div>
        <div class="topPageination">
            <div>
                分页：<a-switch checked-children="开" un-checked-children="关" v-model:checked="checked" />
            </div>
            <div style="margin-left:30px" v-show="!checked" >
                不分页显示数量：<a-select v-model:value="valueSelect" style="width: 120px">
                    <a-select-option v-for="items in listSelect" :key="items" :value="items">{{items}}</a-select-option>
                </a-select>
            </div>
        </div>
        <div>
            <div class="topP"></div>
            <div v-for="item in detailList" :key="item.id" class="listBox" @click.self="handleToDetail(item.id)">
                <img :src="item.img" alt="">
                <p>{{item.title}}</p>
                <p><a-input v-model:value="item.input1" placeholder="Basic usage" /></p>
                <p><input type="text" v-model="item.input2" placeholder="Basic usage" /></p>
                <p>
                    <a-select style="width: 120px">
                        <a-select-option v-for="items in item.select" :key="items.id" :value="items">{{items}}</a-select-option>
                    </a-select>
                </p>
            </div>
            <div v-show="checked" class="bottomP"></div>
        </div>
        <div v-show="checked" class="bottomPageination">
            <a-pagination v-model:current="current" v-model:pageSize="pageSize" :total="total" show-size-changer show-quick-jumper @change="onChange" @showSizeChange="showSizeChange" />
        </div>
    </div>
</template>
<script>
// 数据库数据
import todoList from "../../assets/list.json"
export default {
    data(){
        return {
            detailList:[],
            checked:false,
            current:1,
            pageSize:10,
            total:0,
            valueSelect:100,
            listSelect:[100,200,300,400,500]
        }
    },
    watch:{
        checked(news){
            if (news) {
                console.log('分页')
                this.valueSelect = 100

                this.total = todoList.length
                this.detailList = todoList.slice((this.current-1)*this.pageSize,this.current*this.pageSize)
                scrollTo(0,0)
            }else {
                console.log('不分页')
                this.current = 1
                this.pageSize = 10

                this.detailList = todoList.slice(0,this.valueSelect)
                scrollTo(0,0)
            }
        },
        valueSelect(news){
            this.detailList = todoList.slice(0,news)
        }
    },
    methods:{
        onChange(){
            this.detailList = todoList.slice((this.current-1)*this.pageSize,this.current*this.pageSize)
            scrollTo(0,0)
        },
        showSizeChange(){
            this.current = 1
            this.detailList = todoList.slice((this.current-1)*this.pageSize,this.current*this.pageSize)
            scrollTo(0,0)
        },
        handleToDetail(id){
            this.$router.push({path:'/detail2',query:{id}
            })
        }
    },
    beforeCreate() {
        console.log('beforeCreate')
    },
    created() {
        console.log('created')
        this.detailList = todoList.slice(0,this.valueSelect)
        scrollTo(0,0)
    },
    beforeMount() {
        console.log('beforeMount')
    },
    mounted() {
        console.log('mounted')
    },
    beforeUpdate() {
        console.log('beforeUpdate')
    },
    updated() {
        console.log('updated')
    },
    beforeDestroy() {
        console.log('beforeDestroy')
    },
    destroyed() {
        console.log('destroyed')
    }
}
</script>
<style scoped>
.topPageination{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 60px;
    line-height: 60px;
    z-index: 999;
    background-color: #eeeeee;
    position: fixed;
    top: 0;
    left: 0;
}
.bottomPageination{
    background-color: #eeeeee;
    width: 100%;
    height: 60px;
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
}
.topP{
    width: 100%;
    height: 60px;
    background-color: #fff;
}
.bottomP{
    background-color: #ffffff;
    width: 100%;
    height: 60px;
}
.listBox{
    width: 100%;
    height: 100px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin: 10px 0 10px 0;
    border: 1px solid #ccc;
}
.listBox img {
    height: 100%;
}
</style>