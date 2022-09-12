import Vue from "vue";
import VueRouter from "vue-router";
import Layout from "@/layout/index.vue";
import Layout1 from "@/layout/index1.vue";
import Login from "@/views/Login";
import ProjectManage from "@/views/ProjectManage";
import Dashboard from "@/views/Dashboard";
import store from "@/store/index.js";

const originalPush = VueRouter.prototype.push;

VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

Vue.use(VueRouter);

const routes = [
  { path: "/test", component: () => import("@/views/test") },
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
    redirect: "/admin/:id/useradmin",
    children: [
      {
        path: "/admin/:id/dashboard",
        name: "dashboard",
        meta: {
          title: "系统首页",
        },
        component: () => import("@/components/Dashboard/index.vue"),
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
  {
    path: "/manage",
    name: "manage",
    component: Layout1,
    redirect: "/manage/dashboard",
    children: [
      {
        path: "/manage/dashboard",
        name: "系统首页",
        meta: {
          title: "系统首页",
        },
        component: () => import("@/components/Dashboard/index.vue"),
      },
    ],
  },
];

const router = new VueRouter({
  routes,
});

router.beforeEach((to, from, next) => {
  const token = window.localStorage.getItem("token");
  if (token) {
    if (store.state.nowRouter && store.state.nowRouter.length === 0) {
      // 重新获取数据
      store.commit(
        "setNowRouter",
        JSON.parse(window.sessionStorage.getItem("nowRouter"))
      );
      next(to.path);
    } else {
      next();
    }
  } else {
    if (to.path === "/login") {
      next();
    } else {
      next("/login");
    }
  }
});

export default router;
