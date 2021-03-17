import { createRouter, createWebHashHistory} from "vue-router"
import { useStore } from '../store'
//  createRouter 创建路由
const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: "/",
            name:'index',
            component: () => import('../views/vue3/home.vue'),
        },
        {
            path: "/login",
            name:'login',
            component: () => import('../views/login.vue'),
        },
        {
            path: "/list3",
            name:'list3',
            component: () => import('../views/vue3/list.vue'),
        },
        {
            path: "/detail3",
            name:'detail3',
            component: () => import('../views/vue3/detail.vue'),
        },
        {
            path: "/list2",
            name:'list2',
            component: () => import('../views/vue2/list.vue'),
        },
        {
            path: "/detail2",
            name:'detail2',
            component: () => import('../views/vue2/detail.vue'),
        },
    ],
});
router.beforeEach((to,from,next)=>{
    const store = useStore()
//     const token = store.state.userModule.count.userName
    console.log('token', store.state.userModule.count)
//     if (!token) {
//         if (to.name !== 'login') {
//             next({path:'/login'})
//         }
//     }
    next()
    
})
router.afterEach((to,from)=>{})
export default router;