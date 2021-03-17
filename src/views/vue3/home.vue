<template>
  <div>
    <a-button type="primary"  style="margin-right:10px" @click="handleToTag(2)">去Options Api</a-button>
    <a-button type="primary" @click="handleToTag(3)">去Composition Api</a-button>
    <HelloWorld msg="Hello Vue 3.0 + Vite(组件传递props)" />
    <div>
      <h1>爱好数量： {{todos.length}}</h1>
      <div v-for="item in todos" :key="item.id">
        <div>{{item.text}}</div>
      </div>
    </div>
    <a-button @click="handleInCount" type="primary">增加数量</a-button>
    <a-button @click="handleReCount" type="danger">减少数量</a-button>
    <p>{{count}}</p>
  </div>
</template>

<script lang='ts'>
  import { computed, reactive } from 'vue'
  import { useStore  } from '../../store'
  import HelloWorld from '../../components/HelloWorld.vue'
import { useRouter } from 'vue-router'
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
      const router = useRouter()
      function handleToTag (tag) {
        tag == 2 ? router.push({
          path:'/list2'
        }): router.push({
          path:'/list3'
        })
      }
      // 获取store里的值
      const store = useStore()
      const count = computed(() => store.state.userModule.count)
      const handleInCount = () => {
        store.commit('userModule/SET_INCREASE')
      } 
      const handleReCount = () => {
        store.commit('userModule/SET_REDUCE')
      }
      return {
        todos,
        count,
        handleInCount,
        handleReCount
      }
    }
  }
</script>
