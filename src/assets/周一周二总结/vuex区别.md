# vuex4.x区别
### 创建区别
>vuex 3.x 版本通过 new 实例来创建，

>vuex 4.x 版本通过 createStore 这个工厂函数来创建实例

### 使用区别
> vuex 3.x 版本为了在 Vue 组件中访问 this.$store 属性，你需要为 Vue 实例提供创建好的 store。Vuex 提供了一个从根组件向所有子组件，以 store 选项的方式“注入”该 store 的机制。

```
new Vue({
  el: '#app',
  store: store,
}) 

TODO:  this.$store.state....
```

>vuex 4.x 版本在 setup() 内部，this 不会是该活跃实例的引用，所以如果是在 setup 函数中，需要使用 useStore 函数。这是一个新增的 API 。

```
import { useStore } from 'vuex'

export default {
  setup () {
    const store = useStore()
    return {
      // 在 computed 函数中访问一个 state
      count: computed(() => store.state.count),
      // 在 computed 函数中访问一个 getter
      double: computed(() => store.getters.double)
    }
  }
}
```