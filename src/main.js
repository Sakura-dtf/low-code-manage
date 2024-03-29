import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./plugins/element.js";
/*引入初始化*/
import "./assets/css/global.css";
import "./assets/css/icon.css";
import axios from "axios"; // 引入axios

import elFormSchema from "@kummy/el-form-schema";
Vue.use(elFormSchema);

import moment from "moment";

Vue.prototype.$http = axios.create({
  timeout: 5 * 1000, // 请求超时时间
  withCredentials: true,
});

Vue.filter("datefmt", function (input, fmtstring) {
  //当input为时间戳，需转为Number类型
  if (input) {
    return moment(input).format(fmtstring);
  } else {
    return "";
  }
});

Vue.config.productionTip = false;

export default new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
