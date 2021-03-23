<!--
 * @Author: lzy
 * @Date: 2021-03-21 13:04:22
 * @Title: 
 * @Description: 
-->
<template>
  <div style="border:1px solid #ccc;margin:10px">
    <a-button type="primary" @click="jian">第二个组件减少</a-button>
    <div v-for="item in state.student" :key="item.id">
      <div>{{item.name}}==={{item.age}}</div>
    </div>
  </div>
</template>
<script>
import useRemoveModule from '../state1'
export default {
  setup() {
    const {state,jian} = useRemoveModule();
    return {state,jian}
  },
}
</script>
