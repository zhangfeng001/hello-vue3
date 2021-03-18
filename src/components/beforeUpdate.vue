<template>
    <div>等待数据变化{{count}}</div>
</template>
<script lang="ts">
import { defineComponent ,onBeforeUpdate, computed, } from 'vue'
import { useStore } from '../store'

export default defineComponent({
    setup() {
        // 获取store里的值
      const store = useStore()
      const count = computed(() => store.state.userModule.count)
        onBeforeUpdate( () => {
            console.log('this is beforeUpdate comp')
            return false;
        })
        return {
           count 
        }
    },
})
</script>
