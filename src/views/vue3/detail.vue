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
 // 数据库数据
import todoList from "../../assets/list.json"
import { onBeforeRouteLeave, onBeforeRouteUpdate,useRoute } from 'vue-router';
export default {
    setup() {
        const detail =reactive({
            list:[]
        })
        detail.list = todoList
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
