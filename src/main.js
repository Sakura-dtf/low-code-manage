import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./plugins/element.js";
/*引入初始化*/
import "./assets/css/global.css";
import "./assets/css/icon.css";

import elFormSchema from "@kummy/el-form-schema";
Vue.use(elFormSchema);

Vue.config.productionTip = false;

export default new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
