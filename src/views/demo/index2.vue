<!--
 * @Descripttion: 
 * @version: 
 * @Author: lzy
 * @Date: 2021-03-29 10:43:52
 * @LastEditors: Andy
 * @LastEditTime: 2021-03-29 11:26:46
-->
<template>
</template>
<script>
import {getCurrentInstance,ref} from 'vue';
export default {
  setup(props,content){
        const num =ref(0)
        const name =ref('刘宗怡')
        const ctx = getCurrentInstance()
        console.log(props)
        console.log(content)
        console.log(ctx.appContext.config.globalProperties) //ctx包含content
        return {
        }
    }
}
</script>