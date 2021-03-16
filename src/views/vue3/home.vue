<template>
  <div>
    <HelloWorld msg="Hello Vue 3.0 + Vite(组件传递props)" />
    <div>
      <h1>爱好数量： {{todos.length}}</h1>
      <div v-for="item in todos">
        <div>{{item.text}}</div>
      </div>
    </div>
    <p>{{count}}</p>
  </div>
</template>

<script lang='ts'>
  import { computed, reactive } from 'vue'
  import { useStore } from 'vuex'
  import { key } from '../../store'
  import HelloWorld from '../../components/HelloWorld.vue'
  export default {
    name: 'App',
    components: {
      HelloWorld
    },
    // 相当于vue2 的beforeCreate 和 created  是vue3新增的一个属性 所有的操作都在此属性中完成
    setup(){
      // 通过reactive 可以初始化一个相应的数据
      const listState = reactive({
        todoList: [
        {
          id:1,
          hobby:false,
          text:'吃饭'
        },{
          id:2,
          hobby:true,
          text:'睡觉'
        },{
          id:3,
          hobby:true,
          text:'打豆豆'
        }]
      });
      // 使用计算属性
      const todos = computed(()=>{
        return listState.todoList.filter(item => item.hobby)
      })
      // 获取store里的值
      const store = useStore(key)
      const count = computed(() => store.state.count)
      return {
        todos,
        count
      }
    }
  }
</script>
