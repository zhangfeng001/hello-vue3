<template>
    <div>
        <div v-for="item in detailList" :key="item.id" class="listDetail" @click="hadnleClick(item.id)">
            <img :src="item.imgs" alt="">
            <div>{{item.title}}</div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            detailList:[
            {
                id:1,
                title:'option APIdog',
                imgs:'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2980445260,41238050&fm=26&gp=0.jpg'
            },{
                id:2,
                title:'option APIcat',
                imgs:'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1196368842,2473465511&fm=11&gp=0.jpg'
            },{
                id:3,
                title:'option APIpig',
                imgs:'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2022157757,2962275850&fm=26&gp=0.jpg'
            }],
        }
    },
    beforeCreate() {
        console.log('beforeCreate')
    },
    created() {
        console.log('created')
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
    },
    methods:{
        hadnleClick(id){
            this.$router.push({
                path:'/detail2',
                query:{
                    id
                }
            })
        }
    }
}
</script>
<style scoped>
.listDetail{
    width: 100%;
    height: 100px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    border: 1px solid #ccc;
    padding: 10px;
    margin: 10px 0 10px 0;
}
img{
    height: 100%;
}
</style>