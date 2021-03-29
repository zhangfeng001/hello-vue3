<!--
 * @Author: yuanaohua
 * @Date: 2021-03-26 20:44:02
 * @FilePath: /demo-vue3/Users/yuanaohua/Desktop/vue3新的生命周期对比与api.md
-->
# vue3小结
[TOC]
## 生命周期vue2.0与vue3.0的对比
### 基本声明周期
| [vue2](https://cn.vuejs.org/v2/guide/)      |    Description | [vue3](https://www.vue3js.cn/docs/zh/api/options-lifecycle-hooks.html)  | Description |
| :-------- | --------| :-- | -- |
| beforeCreate  | 组件实例刚被创建，组件属性计算之前，如data属性等 |  setup   | 开始创建组件之前，在 beforeCreate 和 created 之前执行。创建的是 data 和 method|
| created     |   组件实例刚被创建，属性已绑定，但DOM还没生成，$el属性还不存在 |  setup  ||
| beforeMount      |    模块编译/挂载之前 | onBeforeMount  |模块编译/挂载之前|
| mounted      |    模块编译/挂载之后 | onMounted  |模块编译/挂载之后|
| beforeUpdate      |    组件更新之前 | onBeforeUpdate |组件更新之前|
| updated      |    组件更新之后 | onUpdated  |组件更新之后|
| beforeDestroy      |    组件销毁/卸载之前 | onBeforeUnmount  |组件销毁/卸载之前|
| destroyed      |    组件销毁/卸载后 | onUnmounted  |组件销毁/卸载后|

### 补充
| vue2      | vue3  | Description |
| :-------- | :-- | -- |
| activated|  onActivated   | 组件被激活时（手动）|
| deactivated|onDeactivated|组件被移除时（手动）|
|errorCaptured|onErrorCaptured|捕获一个来自子孙组件的错误时被调用（被动）|

## vue3.0常用的api
|vue3|Description|参数|
|---|---|---|
|setup|setup 函数也是 Compsition API 的入口函数，我们的变量、方法都是在该函数里定义的|两个对象，第一个对象是props对象，此 props 对象是响应式的，可以通过使用 watchEffect 或 watch 进行观测和响应，第二个参数是上下文 不是响应式的|
|reactive|`reactive` 方法是用来创建一个响应式的数据对象，该API也很好地解决了Vue2通过 defineProperty 实现数据响应式的缺陷('深层')|一个参数，即包装对象|
|shallowReactive|`shallowReactive`只有第一层被 Proxy 处理，也就是说只有修改第一层的值时，才会响应式更新('浅层')|一个参数，即包装对象|
|ref|`ref` 就是通过 `reactive` 包装的一个对象，返回一个响应式的数据对象。（'深层'）|一个参数，即包装对象|
|shallowRef|`shallowRef` 是监听 `.value` 的值的变化来更新视图的。（'浅层'）|一个参数，即包装对象|
|toRef|`toRef` 是将某个对象中的某个值转化为响应式数据|两个参数，第一个参数为对象；第二个参数为对象中的属性名|
|toRefs| `toRefs`将传入的对象里所有的属性的值都转化为响应式数据对象|一个参数，即所转化对象|
|toRaw| `toRaw` 方法是用于获取 `ref `或 `reactive` 对象的原始数据的|一个参数，需要获取原始数据的数据|
|markRaw| `markRaw `方法可以将原始数据标记为非响应式的，即使用 `ref` 或 `reactive` 将其包装，仍无法实现数据响应式，其接收一个参数，即原始数据，并返回被标记后的数据|一个参数，需要标记的数据|
|watch|`watch`监听器,只能监听指定的属性而做出变更|三个参数，第一个参数是表达式或函数，用于指定监听的依赖对象，第二个参数是依赖对象变化后执行的回调函数，第三个参数是可选参数，可以配置的属性有 immediate（立即触发回调函数）、deep（深度监听）|
|watchEffect|`watchEffect`监听器,不需要指定监听的属性，他会自动的收集依赖， 只要我们回调中引用到了 响应式的属性， 那么当这些属性变更的时候，这个回调都会执行，他可以停止监听,也可以初始化执行一次|一个参数，执行的回调函数|
|computed|`computed`计算属性|一个参数|
|getCurrentInstance|`getCurrentInstance`获取当前组件实例的,实际生产环境无用|暂无|
|useStore|`useStore`获取到`Vuex`实例|暂无|
|useRouter|`useRouter`获取到`router`实例|暂无|
|provide|`provide` ：向子组件以及子孙组件传递数据。|接收两个参数，第一个参数是 `key`，即数据的名称；第二个参数为 `value`，即数据的值。|
|inject|`inject `：接收父组件或祖先组件传递过来的数据。|接收一个参数 `key`，即父组件或祖先组件传递的数据名称|

***具体：***
### setup
>`setup` 函数也是 `Composition API` 的入口函数，我们的变量、方法都是在该函数里定义的

```
<template>
</template>
<script lang='ts'>
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
```



### reactive
>`reactive` 函数接收一个普通对象，返回一个响应式的数据对象。
>`reactive` API的定义为为传入一个对象并返回一个基于原对象的响应式代理，即返回一个 Proxy，相当于 Vue2x版本中的 Vue.observer。
>`reactive` API是基于 ES2015 Proxy实现对数据对象的响应式处理，即在 Vue3.0可以往对象中添加属性，并且这个属性也会具有响应式的效果。
>`reactive` 方法是用来创建一个响应式的数据对象，该API也很好地解决了Vue2通过 `defineProperty`实现数据响应式的缺陷

```
<template>
    <div>{{ listState.text }}</div>
    <div v-for="item in listState.list" :key='item'>{{item}}</div>
</template>
<script lang='ts'>
import { reactive } from 'vue'
export default {
    setup () {
        const listState = reactive({
            text: 'string',
            list:[1,2,3,4]
        });
        return {
          listState
        }
    }
}
</script>
```

### shallowReactive
>听这个`API`的名称就知道，这是一个浅层的 `reactive`，难道意思就是原本的 `reactive` 是深层的呗，没错，这是一个用于性能优化的`API`

```
<template>
  <!-- reactive -->
  <div>{{ reactiveState }}</div>
  <button @click="reactiveStateChange">改变reactiveState.b.c</button>

  <!-- shallowReactive -->
  <div>{{ shallowReactiveState }}</div>
  <button @click="shallowReactiveChange">改变shallowReactiveState.b.c</button>
</template>

<script>
import { shallowReactive, reactive } from 'vue'
export default {
  setup() {
    const reactiveState = reactive({
      a: 'a',
      b: {
        c: 'c',
        d: {
          e: 'e',
        },
      },
    })
    function reactiveStateChange() {
      reactiveState.b.c = 99999
      console.log(reactiveState, 'reactiveState发生了变化且视图更新了')
    }
    const shallowReactiveState = shallowReactive({
      a: 'a',
      b: {
        c: 'c',
        d: {
          e: 'e',
        },
      },
    })
    function shallowReactiveChange() {
      shallowReactiveState.b.c = 99999
      console.log(shallowReactiveState, 'shallowReactiveState发生了变化但视图未更新')
      // 打开下方这行注释视图将进行更新（因为首层对象发生了改变）
      // shallowReactiveState.a = 99999
    }
    return {
      reactiveState,
      reactiveStateChange,
      shallowReactiveState,
      shallowReactiveChange,
    }
  },
}
</script>
```


### ref

>在介绍 `setup` 函数时，我们使用了 `ref` 函数包装了一个响应式的数据对象，这里表面上看上去跟 `reactive` 好像功能一模一样啊，确实差不多，因为 `ref` 就是通过 `reactive` 包装了一个对象 ，然后是将值传给该对象中的 `value` 属性，这也就解释了为什么每次访问时我们都需要加上 `.value`
```
<template>
    <div @click="change">{{ newObj }}</div>
</template>
<script>
import { ref, toRef } from 'vue';
export default {
  setup(){
    let obj = {name : 'alice', age : 12};
    let newObj= ref(obj.name);
    function change(){
      newObj.value = 'Tom';
      console.log(newObj,obj) // 数据会更新，原始数据不会更新，视图会更新，ref的本质是拷贝，与原始数据没有引用关系
    }
    return {newObj,change}
  }
}
</script>
```

### shallowRef
>这是一个浅层的 `ref`，与 `shallowReactive `一样是拿来做性能优化的，`shallowReactive `是监听对象第一层的数据变化用于驱动视图更新，那么 `shallowRef` 则是监听 `.value` 的值的变化来更新视图的

[详细点这里](https://www.jianshu.com/p/bc0f212d39d4)
```
<template>
    <p>{{ state.a }}</p>
    <p>{{ state.first.b }}</p>
    <p>{{ state.first.second.c }}</p>
    <button @click="change1">改变1</button>
    <button @click="change2">改变2</button>
</template>

<script>
import {shallowRef} from 'vue'
export default {
    setup() {
        const obj = {
            a: 1,
            first: {
                b: 2,
                second: {
                    c: 3
                }
            }
        }

        const state = shallowRef(obj)
        console.log(state);

        function change1() {
            // 直接将state.value重新赋值
            state.value = { // 视图更新了
                a: 7,
                first: {
                    b: 8,
                    second: {
                        c: 9
                    }
                }
            }
        }

        function change2() {
            state.value.first.b = 8888
            state.value.first.second.c = 99999
            console.log(state); // 数据变了但是视图不更新
        }

        return {state, change1, change2}
    }
}
</script>
```

### toRef
>`toRef` 是将某个对象中的某个值转化为响应式数据，其接收两个参数，第一个参数为 `obj` 对象；第二个参数为对象中的属性名

[更说明细请点击](https://www.jianshu.com/p/0c6ad50a9055)
```
<template>
    <div @click="change">{{ newObj }}</div>
</template>
<script>
import { reactive, toRef } from 'vue';
export default {
  setup(){
//     let obj = reactive({name : 'alice', age : 12});
    let obj = {name : 'alice', age : 12};
    let newObj= toRef(obj, 'name');
    function change(){
      newObj.value = 'Tom';
      console.log(newObj,obj) 
        // toRef的本质是引用，与原始数据有关联，原始数据可以更新视图，他就更新视图，
        // 原始数据不能更新视图，他就不能更新视图
    }
    return {newObj,change}
  }
}
</script>
```


### toRefs
>了解完 `toRef` 后，就很好理解 `toRefs `了，其作用就是将传入的对象里所有的属性的值都转化为响应式数据对象，该函数支持一个参数，即 `obj `对象

```
<template>
    <div @click="change">{{ newObj.name.value }}{{ newObj.age.value }}</div>
</template>
<script>
import {reactive, toRefs} from 'vue';
export default {
  setup(){
    // let obj = reactive({name : 'alice', age : 12});
    let obj = {name : 'alice', age : 12};
    let newObj= toRefs(obj);
    function change(){
      newObj.name.value = 'Tom';
      obj.age = 18;
      console.log(obj,newObj)
      // toRefs的本质也是引用，与原始数据有关联，原始数据可以更新视图，他就更新视图，
    // 原始数据不能更新视图，他就不能更新视图
    }
    return {newObj,change}
  }
}
</script>
```

### toRaw
>`toRaw` 方法是用于获取 `ref `或 `reactive` 对象的原始数据的

```
<template>
    <p>{{ foo }}</p>
</template>

<script>
import {reactive,toRaw} from 'vue'
export default {
    setup() {
        const foo = {a:1,b:2}
        const reactiveFoo = reactive(foo)
        console.log(toRaw(reactiveFoo) === foo) // true
        return {
            foo
        }
    }
}
</script>
```

### markRaw
>`markRaw `方法可以将原始数据标记为非响应式的，即使用 `ref` 或 `reactive` 将其包装，仍无法实现数据响应式，其接收一个参数，即原始数据，并返回被标记后的数据

```
<template>
  <div>
    <div>{{state.name}}</div>
    <button @click="myFn">改变不会变吗  </button>
  </div>
</template>

<script>
import { markRaw, reactive } from 'vue'
  export default {
    setup(){
      let obj = markRaw({name:'tom'})//  相当于 let obj={name:'tom',__v_skip:true} 保证不会变成响应式
      let state=reactive(obj);
      function myFn(){
        state.name="jarry";
        console.log(state.name)
      }
      return {state,myFn}
    }
  }
</script>
```

### watch && watchEffect
>`watch` 和 `watchEffect`都是用来监视某项数据变化从而执行指定的操作的，但用法上还是有所区别 

```
<template>
  <button @click="change">改变名字</button>
  <button @click="change2">改变年龄</button>
    <div>{{ obj }}</div>
</template>
<script>
import {reactive,watch,watchEffect} from 'vue';
export default {
  setup(){
    let obj = reactive({name : 'alice', age : 12});
    //////////////// watch
    // 监听一个参数
    watch(()=>{return obj.name},()=>{
        console.log('watch监听一个参数监听到了')
    })
    // 监听两个参数
    watch([()=>obj.name,()=>obj.age],()=>{
        console.log('watch监听两个参数监听到了')
    })
    //////////////// watchEffect
    watchEffect(() => {
        console.log('watchEffect',obj.name)
        console.log('watchEffect',obj.age)
    })
    function change(){
      obj.name = 'Tom';
    }
    function change2(){
      obj.age = 8;
    }
    return {obj,change,change2}
  }
}
</script>
```

[查看区别](https://blog.csdn.net/lannieZ/article/details/110868683)

### computed

>`computed`计算属性

```
<template>
    <div>{{ msg }}</div>
    <div>{{ filterMsg }}</div>
    <div>{{ filterMsg2('参数') }}</div>
    <div>{{ count }}</div>
    <div>{{ plusOne }}</div>
    <input type="text" v-model="plusOne" />
</template>
<script>
import {ref,computed} from 'vue';
export default {
  setup(){
        const msg = ref(1)
        //无参数
        const filterMsg =computed( () => msg.value + "fdfasdf")
        //有参数
        const filterMsg2 =computed(() => {
            return function(num) {
                return msg.value + num
            }
        })
        // 自定义set方法和get方法
        const count = ref(1)
        const plusOne = computed({
            get: () => count.value + 1,
            set: val => {
                count.value = 10
            }
        })
        return {
            msg,
            filterMsg,
            filterMsg2,
            count,
            plusOne
        }
    }
}
</script>
```


### getCurrentInstance
>我们都知道在`Vue2`的任何一个组件中想要获取当前组件的实例可以通过 `this` 来得到，而在`Vue3`中我们大量的代码都在 `setup` 函数中运行，并且在该函数中 `this` 指向的是 `undefined`，那么该如何获取到当前组件的实例呢？这时可以用到另一个方法，即 `getCurrentInstance`

```
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
```

[查看明细](https://my.oschina.net/u/4355717/blog/4767509)


### useStore
>在`Vue2`中使用 `Vuex`，我们都是通过 `this.$store` 来与获取到`Vuex`实例，但上一部分说了原本`Vue2`中的 `this`的获取方式不一样了，并且我们在`Vue3`的 `getCurrentInstance().ctx` 中也没有发现 `$store` 这个属性，那么如何获取到`Vuex`实例呢？这就要通过 `vuex` 中的一个方法了，即 `useStore`

```
<script>
import { useStore } from 'vuex'
import { key } from './store'

export default {
  setup () {
    const store = useStore(key)

    store.state.count // typed as number
  }
}
</script>
```



### provide && inject
>与 `Vue2`中的 `provide` 和 `inject` 作用相同，只不过在`Vue3`中需要手动从 `vue` 中导入，这里简单说明一下这两个方法的作用：`provide` ：向子组件以及子孙组件传递数据。接收两个参数，第一个参数是 `key`，即数据的名称；第二个参数为 `value`，即数据的值。`inject `：接收父组件或祖先组件传递过来的数据。接收一个参数 `key`，即父组件或祖先组件传递的数据名称,假设这有三个组件，分别是 `A.vue 、B.vue 、C.vue`，其中 `B.vue` 是 `A.vue` 的子组件，`C.vue` 是 `B.vue` 的子组件

```
//假设这有三个组件，分别是 A.vue 、B.vue 、C.vue，其中 B.vue 是 A.vue 的子组件，C.vue 是 B.vue 的子组件
// A.vue
<script>
import {provide} from 'vue'
export default {
    setup() {
        const obj= {
          name: '小红书',
          age: 18
        }

        // 向子组件以及子孙组件传递名为info的数据
        provide('info', obj)
    }
}
</script>

// B.vue
<script>
import {inject} from 'vue'
export default {
    setup() { 
        // 接收A.vue传递过来的数据
        inject('info')  // {name: '小红书', age: 18}
    }
}
</script>

// C.vue
<script>
import {inject} from 'vue'
export default {
    setup() { 
        // 接收A.vue传递过来的数据
        inject('info')  // {name: '小红书', age: 18}
    }
}
</script>

```



## ......