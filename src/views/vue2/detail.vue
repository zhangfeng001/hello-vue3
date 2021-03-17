<template>
    <h1>详情页： {{isDetail[0].title}}</h1>
    <img :src="isDetail[0].img" alt="">
    <div>{{isDetail[0].content}}</div>
</template>
<script>
export default {
    data () {
        return {
            detailList:[
            {
                id:1,
                title:'option APIdog',
                content:'dogdogdogdogdogdogdogdogdogdogdogdogdogdogdogdogdogdogdogdogdogdogv',
                img:'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2980445260,41238050&fm=26&gp=0.jpg'
            },{
                id:2,
                title:'option APIcat',
                content:'catcatcatcatcatcatcatcatcatcatcatcatcatcatcatcatcatcatcatcatcatcatcatcatv',
                img:'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1196368842,2473465511&fm=11&gp=0.jpg'
            },{
                id:3,
                title:'option APIpig',
                content:'pigpigpigpigpigpigpigpigpigpigpigpigpigpigpigpigpigpigpigpigpigpigpigpigpigpigv',
                img:'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2022157757,2962275850&fm=26&gp=0.jpg'
            }],
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
    }
}
</script>