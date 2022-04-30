import Vue from "vue";
import Vuex from "vuex";
import router from "@/router/index.js";
import root from "@/main.js";
Vue.use(Vuex);

function addOneRouter(item) {
  // router.addRouter({
  //   path: "/aaa",
  //   component: () => import("@/views/Login.vue"),
  // });

  router.addRoute("manage", {
    path: "/manage" + item.path,
    name: item.name,
    component: () => import("@/components/Container/index.vue"),
    meta: {
      title: item.name,
      id: item.webConfigId,
    },
  });

  console.log(router);
}

export default new Vuex.Store({
  state: {
    asyncRouterMap: [],
    nowProjectid: "",
    nowRouter: [],
  },
  getters: {
    projectId(state) {
      if (state.nowProjectid) {
        return state.nowProjectid;
      } else {
        if (window.sessionStorage.getItem("nowProjectid")) {
          state.nowProjectid = window.sessionStorage.getItem("nowProjectid");
          return state.nowProjectid;
        } else {
          // 跳转操作
        }
      }
    },
    router(state) {
      if (state.nowRouter.length) {
        return state.nowRouter;
      } else {
        if (window.sessionStorage.getItem("nowRouter")) {
          console.log(Vuex);
          root.$store.commit(
            "setNowRouter",
            JSON.parse(window.sessionStorage.getItem("nowRouter"))
          );
          return state.nowRouter;
        } else {
          // 跳转操作
        }
      }
    },
  },
  mutations: {
    setNowProjectId(state, id) {
      this.nowProjectid = id;
      window.sessionStorage.setItem("nowProjectid", id);
    },
    setNowRouter(state, routers) {
      state.nowRouter = routers;
      window.sessionStorage.setItem("nowRouter", JSON.stringify(routers));
      if (routers && routers.length) {
        routers.forEach((item) => {
          if (item.type == 2) {
            addOneRouter(item);
          }

          if (item.children && item.children.length) {
            item.children.forEach((children) => {
              if (children.type == 2) {
                addOneRouter(children);
              }
            });
          }
        });
      }
    },
  },
  actions: {},
  modules: {},
});
