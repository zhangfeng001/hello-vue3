# vueRouter4.X 新增api

 router.addRoute // 手动新增页面
 
 router.removeRoute // 手动删除页面

# vueRouter修改api
>切换模式由原来胡 mode :'history' 更改为 history: createWebHistory()

示例：
```
// vue2-router
const router = new VueRouter({
  mode:  history ,
  ...
})
 
// vue-next-router
import { createRouter, createWebHistory } from  vue-next-router
const router = createRouter({
  history: createWebHistory(),
  ...
})
```
>传给 createWebHistory()（和其他模式） 的第一个参数作为 base。

示例：
```

//vue2-router
const router = new VueRouter({
  base: __dirname,
})
 
// vue-next-router
import { createRouter, createWebHistory } from  vue-next-router
const router = createRouter({
  history: createWebHistory( / ),
  ...
})
```
>没有全局 $router、$route

**我们知道在 vue2-router 中，通过在 Vue 根实例的 router 配置传入 router 实例，下面这些属性成员会被注入到每个子组件。**

- this.$router - router 实例。

- this.$route - 当前激活的路由信息对象。

**但是 3.0 中，没有 this，也就不存在在 this.$router | $route 这样的属性，那么在 3.0 中应该如何使用这些属性呢？**
```
import { useRoute, useRouter } from  vue-next-router
...
setup() {
  const route = useRoute()
  const router = useRouter()
  ...
  // router -> this.$router
  // route > this.$route
  router.push( /foo )
  console.log(route) // 路由对象信息
}
```
