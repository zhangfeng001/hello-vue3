# VUE3.0采坑记
[TOC]
### watch监听器
>首先，在vue3.0中，使用reactive 声明了一个动态数据后，使用下边的方法监听不到:

```
<script>
import * as vue3 from 'vue'
export default {
 setup () {
    // 双向数据绑定的数据
    const state = vue3.reactive({
      num : 1,
      num2 : 2
    })
    vue3.watch(state.num,(news,olds)=>{
      console.log('num1 改变了', news,olds)
    })
    vue3.watch(state.num2,(news,olds)=>{
      console.log('num2 改变了', news,olds)
    })
    const handleClick = () => {
      state.num ++
    }
    const handleClick2 = () => {
      state.num2 ++
    }
    return {
      state,
      handleClick,
      handleClick2
    }
 }
}
</script>
```
>正确的写法应该是:

```
<script>
import * as vue3 from 'vue'
export default {
 setup () {
    // 双向数据绑定的数据
    const state = vue3.reactive({
      num : 1,
      num2 : 2
    })
    vue3.watch(() => state.num,(news,olds)=>{
      console.log('num1 改变了', news,olds)
    })
    vue3.watch(() => state.num2,(news,olds)=>{
      console.log('num2 改变了', news,olds)
    })
    const handleClick = () => {
      state.num ++
    }
    const handleClick2 = () => {
      state.num2 ++
    }
    return {
      state,
      handleClick,
      handleClick2
    }
 }
}
</script>
```

### 页面跳转router

> 在vue2里的写法：

```
this.$router.push({path:'/detail2',query:{id}}) // 页面跳转并携带参数
this.id = this.$route.query.id // 获取携带参数
```
>但是在vue3中 setup函数获取不到this，因为setup在 beforeCreate 与created 之间，是获取不到this的，一直报错，后来才知道新写法：

```
// 跳转并携带参数
const router = useRouter()
function handleToDetail(id){
    router.push({path: '/detail3',query: {id,}})
} 
// 获取参数
const route = useRoute()
const queryId = ref(route.query.id)
```

### 配置全局scss文件

> 在配置全局css文件时，可以在main.ts里边

```
import './index.css' // 引入全局样式
```
>但是要引入scss预编译文件时，就要在vite.config.ts里引入

```
cssPreprocessOptions: {
    scss: {
      additionalData: '@import "./src/assets/scss/style.scss";' // 添加公共样式
    }
  }
```
***这里遇到了个坑，配置后怎么都不生效，后来重启下可以了，一定要记住配置vite.config.ts完后一定要重启，***