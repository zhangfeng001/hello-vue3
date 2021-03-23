<!--
 * @Author: lzy
 * @Date: 2021-03-21 12:47:40
 * @Title: 
 * @Description: 
-->
<template>
<div class="farther">我是父组件--<span class="farther_span">我的两个组件共同使用</span></div>
<div>{{state.student}}</div>
<br/>
<br/>
<br/>

<one/>

<br/>
<br/>
<br/>

<two/>
</template>

<script>
import one from './compon/one.vue'
import two from './compon/two.vue'
import { reactive,toRefs } from 'vue'
import useRemoveModule from './state1'
export default {
  components: {
      one,
      two
    },
  setup(){
    const {state} = useRemoveModule();
    return {state}
  }
}
</script>

<style lang='scss' scoped>
$redbg:pink;
.farther{
  color:$redbg;
  height: (10+10) *2px;
  &_span{
    font-size: 22px;
    color: $red
  }

  font: {
      size: 20px;
      weight: bold
  }
}
</style>