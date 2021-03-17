<template>
    <div>
        <h1>{{isDetail[0].title}}</h1>
        <img :src="isDetail[0].img" alt="">
        <div>{{isDetail[0].content}}</div>
    </div>
</template>
<script lang="ts">
// beforeMount -> onBeforeMount
// mounted -> onMounted
// beforeUpdate -> onBeforeUpdate
// updated -> onUpdated
// beforeDestroy -> onBeforeUnmount
// destroyed -> onUnmounted
import { computed, 
        reactive,
        ref,
        getCurrentInstance,
        onBeforeMount,
        onMounted,
        onBeforeUpdate,
        onUpdated,
        onBeforeUnmount,
        onUnmounted
 } from 'vue'
import { onBeforeRouteLeave, onBeforeRouteUpdate,useRoute } from 'vue-router';
export default {
    setup() {
        const detail =reactive({
            list:[{
                    id:1,
                    title:'第一个详情',
                    img:'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3736593226,3587713655&fm=26&gp=0.jpg',
                    content:'今夜星光闪闪，爱你的心满满,今夜星光闪闪，爱你的心满满今夜星光闪闪，爱你的心满满今夜星光闪闪，爱你的心满满今夜星光闪闪，爱你的心满满'
                },{
                    id:2,
                    title:'第二个详情',
                    img:'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1804828432,1958321161&fm=26&gp=0.jpg',
                    content:'一giao我里giaogiao，一giao我里giaogiao一giao我里giaogiao一giao我里giaogiao一giao我里giaogiao一giao我里giaogiao'
                },{
                    id:3,
                    title:'第三个详情',
                    img:'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3628511760,2894116796&fm=26&gp=0.jpg',
                    content:'北鼻打蜡巴拉舅，北鼻打蜡巴拉舅北鼻打蜡巴拉舅北鼻打蜡巴拉舅北鼻打蜡巴拉舅北鼻打蜡巴拉舅北鼻打蜡巴拉舅'
                }]
            })
            const { ctx } = getCurrentInstance()
            const route = useRoute()
            const queryId = ref(route.query.id)
            const isDetail = computed(()=>{
                return detail.list.filter(item => item.id == queryId.value)
            })
            onBeforeMount(() => {
                console.log('onBeforeMount')
            })
            onMounted(() => {
                console.log('onMounted')
            })
            onBeforeUpdate(() => {
                console.log('onBeforeUpdate')
            })
            onUpdated(() => {
                console.log('onUpdated')
            })
            onBeforeUnmount(() => {
                console.log('onBeforeUnmount')
            })
            onUnmounted(() => {
                console.log('onUnmounted')
            })
            onBeforeRouteUpdate((to,from)=>{//当前组件路由改变后，进行触发
                console.log(to);
            })
            onBeforeRouteLeave((to,from)=>{//离开当前的组件，触发
                alert('我离开啦')
            })
        return {
            isDetail
        }
    },
}
</script>
