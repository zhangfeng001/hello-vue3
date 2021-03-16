
<template>
  <div class="helloWordPage">
    <h1>{{ msg }}</h1>
    <!-- <a-tag>{{count}}</a-tag> -->
    <a-input v-model="count" :value="count" placeholder="Basic usage" />
    <a-button @click="inCrement" type="primary">点击修改store</a-button>
  </div>
</template>
 
<script>
 import { defineComponent ,computed } from 'vue'
 import { useStore } from '../store'
  export default defineComponent({
    name: 'HelloWorld',
    props: {
      msg: {
        type: String,
        default: ''
      },
    },
    setup() {
      const store = useStore()
      const count = computed(() => store.state.userModule.count)

      const inCrement = () => {
        store.commit('userModule/SET_INCREASE')
      }
      return {
        count,
        inCrement
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