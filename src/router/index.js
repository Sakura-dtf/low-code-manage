import Vue from "vue";
import VueRouter from "vue-router";
import Layout from "@/layout";
import Login from "@/views/Login";
import ProjectManage from "@/views/ProjectManage";
import Dashboard from "@/views/Dashboard";

const originalPush = VueRouter.prototype.push;

VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: Layout,
    redirect: "/login",
  },
  {
    path: "/login",
    component: Login,
  },
  { path: "/projectManage", component: ProjectManage },
  {
    path: "/admin/:id",
    component: Layout,
    redirect: "/admin/:id/dashboard",
    children: [
      {
        path: "/admin/:id/dashboard",
        name: "dashboard",
        meta: {
          title: "系统首页",
        },
        component: () => import("@/components/Auth/UserAdmin.vue"),
      },
      {
        path: "/admin/:id/useradmin",
        name: "useradmin",
        meta: {
          title: "用户管理",
        },
        component: () => import("@/components/Auth/UserAdmin.vue"),
      },
      {
        path: "/admin/:id/roleadmin",
        name: "roleadmin",
        meta: {
          title: "角色管理",
        },
        component: () => import("@/components/Auth/RoleAdmin.vue"),
      },
      {
        path: "/admin/:id/routeradmin",
        name: "routeradmin",
        meta: {
          title: "菜单管理",
        },
        component: () => import("@/components/Auth/RouterAdmin.vue"),
      },
    ],
  },
];

// const routes = [
//   {
//     path: "/",
//     component: Layout,
//     redirect: "/login",
//   },
//   {
//     path: "/login",
//     component: Login,
//   },
//   { path: "/projectManage", component: ProjectManage },
//   {
//     path: "/home",
//     redirect: "/projectManage",
//     component: Layout,
//     meta: { title: "首页" },
//     children: [
//       {
//         path: "/dashboard",
//         component: () => import("../views/Dashboard"),
//         meta: { title: "仪表盘" },
//       },
//       {
//         path: "/bookManage",
//         component: () => import("../views/BookManage"),
//         meta: { title: "图书管理" },
//       },
//     ],
//   },
//   {
//     path: "/admin",
//     redirect: "/13",
//     component: Layout,
//     meta: { title: "首页" },
//     children: [
//       {
//         path: "/13",
//         component: () => import("../views/Dashboard"),
//         meta: { title: "仪表盘" },
//       },
//       {
//         path: "/useradmin",
//         component: () => import("../components/Auth/UserAdmin.vue"),
//         meta: { title: "仪表盘" },
//       },
//       {
//         path: "/routeradmin",
//         component: () => import("../components/Auth/RouterAdmin.vue"),
//         meta: { title: "仪表盘" },
//       },
//       {
//         path: "/roleadmin",
//         component: () => import("../components/Auth/RoleAdmin.vue"),
//         meta: { title: "仪表盘" },
//       },
//     ],
//   },
// ];

const router = new VueRouter({
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.path === "/login") {
    next();
  } else {
    if (window.localStorage.getItem("token")) {
      next();
    } else {
      next("/login");
    }
  }
});

export default router;
