import { createRouter, createWebHashHistory} from "vue-router"
 
//  createRouter 创建路由
const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: "/",
            component: () => import('../views/vue3/home.vue'),
        },
        {
            path: "/login",
            component: () => import('../views/login.vue'),
        },
        {
            path: "/list",
            component: () => import('../views/vue3/list.vue'),
        },
        {
            path: "/detail",
            component: () => import('../views/vue3/detail.vue'),
        },
    ],
});
router.beforeEach((to,from)=>{
    console.log('router')
    
})
router.afterEach((to,from)=>{})
export default router;