
<template>
  <div class="helloWordPage">
    <h1>{{ msg }}</h1>
    <a-button @click="inCrement" type="primary">点击修改store</a-button>
  </div>
</template>
 
<script>
 import { defineComponent } from 'vue'
 import { useStore } from 'vuex'
 import { key } from '../store'
  export default defineComponent({
    name: 'HelloWorld',
    props: {
      msg: {
        type: String,
        default: ''
      }
    },
    setup() {
      const store = useStore(key)
      return {
        inCrement: () => store.commit('increment')
      }
    }
  })
</script>
<style scoped>
 .helloWordPage{
   border:1px solid #ccc;
   padding: 10px;
   margin: 10px;
 }
</style>