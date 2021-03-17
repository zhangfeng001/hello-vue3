<template>
    <div>
        <a-switch v-model:checked="checked3">
            <template #checkedChildren><check-outlined /></template>
            <template #unCheckedChildren><close-outlined /></template>
        </a-switch>
        <div v-for="item in todo.list" :key="item.id" class="listBox" @click="handleToDetail(item.id)">
            <img :src="item.img" alt="">
            <p>{{item.title}}</p>
        </div>
    </div>
</template>
<script lang="ts">
import { reactive,toRefs } from 'vue'
import { useRouter } from 'vue-router';
export default {
    setup(){
        const todo =reactive({
            list:[{
                id:1,
                img:'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3736593226,3587713655&fm=26&gp=0.jpg',
                title:'第一个详情'
            },{
                id:2,
                img:'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1804828432,1958321161&fm=26&gp=0.jpg',
                title:'第二个详情'
            },{
                id:3,
                img:'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3628511760,2894116796&fm=26&gp=0.jpg',
                title:'第三个详情'
            }]
        })
        const state = reactive({
            checked3:false
        })
        const router = useRouter()
        function handleToDetail(id){
            router.push({
                path: '/detail3',
                query: {
                    id,
                },
            })
        }
        return {
            todo,
            ...toRefs(state)
        }
    }
}
</script>

<style scoped>
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