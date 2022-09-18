import {
  createRouter,
  createWebHistory,
  RouteRecordRaw,
  createWebHashHistory,
} from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/recommend",
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/404",
    //    通配符 * 被取消
  },
  {
    path: "/recommend",
    name: "recommend",
    component: () => import("@/views/recommend/recommend.vue"), // 建议进行路由懒加载，优化访问性能
    children: [
      {
        path: ":id",
        component: () => import("@/views/album/album.vue"), // 建议进行路由懒加载，优化访问性能
      },
    ],
  },
  {
    path: "/singer",
    name: "singer",
    component: () => import("@/views/singer/singer.vue"), // 建议进行路由懒加载，优化访问性能
    children: [
      {
        path: ":id",
        component: () => import("@/views/singer-detail/singer-detail.vue"), // 建议进行路由懒加载，优化访问性能
      },
    ],
  },
  {
    path: "/topList",
    name: "topList",
    component: () => import("@/views/topList/topList.vue"), // 建议进行路由懒加载，优化访问性能
    children: [
      {
        path: ":id",
        component: () => import("@/views/topList-detail/topList-detail.vue"), // 建议进行路由懒加载，优化访问性能
      },
    ],
  },
  {
    path: "/search",
    name: "search",
    component: () => import("@/views/search/search.vue"), // 建议进行路由懒加载，优化访问性能
    children: [
      {
        path: ":id",
        component: () => import("@/views/singer-detail/singer-detail.vue"), // 建议进行路由懒加载，优化访问性能
      },
    ],
  },
  {
    path: "/user",
    components: {
      user: () => import("@/views/user-center/user-center.vue"), // 建议进行路由懒加载，优化访问性能
    },
  },
];

const router = createRouter({
  // history: createWebHistory(),
  history: createWebHashHistory(),
  routes,
});

export default router;
