import { createRouter, createWebHashHistory} from "vue-router"
 
//  createRouter 创建路由
const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: "/",
            component: () => import('../views/home.vue'),
        },
        {
            path: "/login",
            component: () => import('../views/login.vue'),
        },
        {
            path: "/list",
            component: () => import('../views/list.vue'),
        },
        {
            path: "/detail",
            component: () => import('../views/detail.vue'),
        },
    ],
});
 
export default router;