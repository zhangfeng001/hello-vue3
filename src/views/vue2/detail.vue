<template>
    <h1>详情页： {{isDetail[0].title}}</h1>
    <img :src="isDetail[0].img" alt="">
    <div>{{isDetail[0].content}}</div>
</template>
<script>
// 数据库数据
import todoList from "../../assets/list.json"
export default {
    data () {
        return {
            detailList:[],
            id:null,
        }
    },
    computed:{
        isDetail (){
            return this.detailList.filter(item => item.id == this.id)
        }
    },
    created(){
        this.id = this.$route.query.id
        this.detailList = todoList
    }
}
</script>