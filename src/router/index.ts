import { createRouter, createWebHashHistory } from "vue-router";
import { store } from "../store";
import todoList from "../assets/list.json";
//  createRouter 创建路由
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      name: "index",
      component: () => import("../views/vue3/home.vue"),
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/login.vue"),
    },
    {
      path: "/list3",
      name: "list3",
      component: () => import("../views/vue3/list.vue"),
      beforeEnter: ()=>{
        if (store.state.list.length == 0) {
          store.commit('SET_LIST',todoList)
        }
      }
    },
    {
      path: "/detail3",
      name: "detail3",
      component: () => import("../views/vue3/detail.vue"),
    },
    {
      path: "/list2",
      name: "list2",
      component: () => import("../views/vue2/list.vue"),
      beforeEnter: ()=>{
        if (store.state.list.length == 0) {
          store.commit('SET_LIST',todoList)
        }
      }
    },
    {
      path: "/detail2",
      name: "detail2",
      component: () => import("../views/vue2/detail.vue"),
    },
    {
      path:'/compsitionApi',
      name: "/compsitionApi",
      component: () => import("../views/vue3/compsitionApi.vue"),
    },
    {
      path:'/demo',
      name: "demo",
      component: () => import("../views/demo/index.vue"),
    },{
      path:'/imageCompress',
      name: "imageCompress",
      component: () => import("../views/imageCompress/imageCompress.vue"),
    },{
      path:'/CompressImageUtils',
      name: "CompressImageUtils",
      component: () => import("../views/imageCompress/CompressImageUtils.vue"),
    }
  ],
});
router.beforeEach((to, from, next) => {
  const token = store.state.userModule.token;
  if (!token) {
    if (to.name !== "login") {
      next({ path: "/login" });
    }
  }
  next();
});
router.afterEach((to, from) => {});
export default router;
