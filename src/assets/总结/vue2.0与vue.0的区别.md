# Vue2.0与Vue3.0区别总结

## 1.程序主入口文件 main.js

- **vue2.0**

```
    import Vue from 'vue'
    import App from './App.vue'
    import router from "./router"
    import store from "./store"
    new Vue({
        store,
        router,
        render: h => h(App),
    }).$mount('#app')
```

- **vue3.0 暴露出 createApp方法**

```
    import { createApp } from 'vue';
    import App from './App.vue'
    import router from './router.js'

    createApp(App)
    .use(router)
    .mount('#app')
```


## 组件语法部分

- **vue2.0 Options api**

```
    data() {
        return {
            msg: "初始化"
        }
    },
    ///////////////////// 监听器
    watch: {
        //普通的
        msg:{
            handler(newValue,oldValue) {
                console.log("....")
            }
        },
        //深度
        person:{
            handler(newValue,oldValue) {

            },
            immediate:true,
            deep:true
        }
    },
    ///////////////////////////// 计算属性
    computed:{
     //无参数
        filterMsg() {
            return this.msg + "999"
        },
        //有参数
        filterMsg2(number) {
            return function() {
                return this.msg + number;
            }
        },
        // 自定义set方法
        filterMsg3: {
            get() {
                return this.msg + "999"
            },
            set(value) {
                ...
            }
        }
    }
    methods: {
        changeHandle() {
            this.msg = "改变的"
        }
    },
```
- **vue3.0 Composition api**

```
    setup() {
        let msg = ref("初始化");

        let person = reactive({name:"lisi",age:20})
        
        //////////////////////// 监听器
        watch(msg,(newValue,oldValue)=>{
            console.log(this);//undefined;箭头函数绑定父级作用域的上下文，所以this不会指向当前的组件
            console.log(newValue,oldValue);
        },{deep:false,immediate:false})

        watch(() => person.age,(newValue,oldValue) => {
            console.log(newValue,oldValue)
        })
        //////////////////计算属性
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
                count.value = val - 1
            }
        })

        plusOne.value = 1
        console.log(count.value) // 0
        
        const changeHandle = () => { msg.value = "改变的" }
         const changeHandle2 = () => { person.age = 30 }
        return {
            msg,
            changeHandle,
            changeHandle2
        }
    },
```

## vue-router
>yarn add vue-router@next--save 下载最新版本
 
 >Vue 3引入了 createApp API，它改变了将插件添加到Vue实例的方式。由于这个原因，过去版本的Vue Router将不兼容Vue 3，Vue Router的Vue3版本的主要区别在于我们必须导入新方法才能使代码正常工作。其中最重要的是 createRouter 和 createWebHistory。

- **vue3.X**

```
// router.ts
    import { 
        createRouter, 
        createWebHistory 
    } from 'vue-router'
    const router = createRouter({  
        // hash模式：createWebHashHistory，
        // history模式：createWebHistory
        history: createWebHistory(),  
        routes:[{
            path:"/home",
            name:"home",
            component:Home,
            beforeEnter:(to,from) =>{
                //to是当用户点击进入当前页面的时候,我们可以进行一些拦截设置
                //from当来自其他页面进入当前页面的时候，我们也可以进行拦截提示用户
                alert('我是路由独享守卫！！！')
            }
        }]
    })
    // todo 这是新添加的路由页面，如果有重复的属性，会先删除前面的，添加后面的路由页面
    router.addRoute({
        path:"/router",
        name:"router",
        component:()=>import('../views/router.vue')
    })
    router.removeRoute('router');
    // 1 添加子路由，第一个参数是父路由的name名，后面是子路由的数据
    router.addRoute({ name: 'admin', path: '/admin', component: Admin })//1 父路由
    router.addRoute('admin', { path: 'settings', component: AdminSettings })//1 子路由
    router.beforeEach((to, from) => {
    });

// hello.vue
    import { useRouter,useRoute } from "vue-router"
    import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router';
    export default({      
        setup(){
            const router = useRouter();
            const route = useRoute();
            const linkToHome = () => {
                router.push({path:'/'})
            }
            // 路由独享首位
            onBeforeRouteUpdate((to,from)=>{//当前组件路由改变后，进行触发
                console.log(to);
            })
            onBeforeRouteLeave((to,from)=>{//离开当前的组件，触发
                alert('我离开啦')
            })
            return{
                linkToHome
            }
        }
    })
```
- **vue2.X**
```
// router.ts
    const router = new VueRouter({
        // hash模式：'hash'，
        // history模式："history"
        mode: "history",
        routes: [{
            path:"/home",
            name:"home",
            component:Home,
            beforeEnter:(to,from) =>{
                //to是当用户点击进入当前页面的时候,我们可以进行一些拦截设置
                //from当来自其他页面进入当前页面的时候，我们也可以进行拦截提示用户
                alert('我是路由独享守卫！！！')
            }
        }]
    });
    router.beforeEach((to, from, next) => {
        next();
    });


// hello.vue
export default({       
    methods:{         
        linkToHome(){           
            this.$router.push({path:'/'   })
         }
       }
    })
```

## vuex
>npm install vuex@next --save 下载最新版本

- **vue2.X**
```
import Vue from 'vue'
import Vuex from 'vuex'

const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  }
})
Vue.use(Vuex)
new Vue({
  el: '#app',
  store: store, // 这样可以this.$store...
}) 
```
- **vue3.X**
```
/////////////////////////////////////store.ts
import { createApp } from 'vue'
import { createStore } from 'vuex'

// 创建 store 容器实例.
const store = createStore({
  state () {
    return {
      count: 0
    }
  },
  mutations: {
    increment (state) {
      state.count++
    }
  }
})
const app = createApp({ /* your root component */ })
// 通过 use 注册插件
app.use(store)

/////////////////////////////////////hello.vue 
import { useStore } from 'vuex'

export default {
  setup () {
    const store = useStore()
    return {
      // 在 computed 函数中访问一个 state
      count: computed(() => store.state.count),
      // 在 computed 函数中访问一个 getter
      double: computed(() => store.getters.double)
      // 访问一个 mutation
      increment: () => store.commit('increment'),
      // 访问一个 action
      asyncIncrement: () => store.dispatch('asyncIncrement')
    }
  }
}
```