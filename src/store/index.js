import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    asyncRouterMap: [],
    nowProjectid: "",
  },
  mutations: {
    setNowProjectId(state, id) {
      this.nowProjectid = id;
    },
  },
  actions: {},
  modules: {},
});
