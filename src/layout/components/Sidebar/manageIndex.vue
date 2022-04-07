<template>
  <div class="side-container">
    <div
      class="title"
      :style="{
        width: collapse ? '64px' : '200px',
      }"
    >
      <img src="@/static/images/logo.png" class="logoimg" alt="" />
      <h2 class="tit-title" v-show="!collapse">低代码展示平台</h2>
    </div>
    <el-menu
      class="sidebar-el-menu"
      :default-active="onRoutes"
      :collapse="collapse"
      background-color="#191a23"
      text-color="#fff"
      active-text-color="#fff"
      hover-bg-color="rgb(20, 21, 28)"
      active-color="#4D70FF"
      unique-opened
      router
      :collapse-transition="false"
    >
      <template v-for="item in items">
        <template v-if="item.children">
          <el-submenu :index="'/manage' + item.path" :key="item.id">
            <template slot="title">
              <i :class="item.icon"></i>
              <span slot="title" style="font-size: 13px">{{ item.name }}</span>
            </template>
            <template v-for="subItem in item.children">
              <el-submenu
                v-if="subItem.children"
                :index="'/manage' + subItem.path"
                :key="subItem.id"
              >
                <template slot="title" style="font-size: 13px">{{
                  subItem.name
                }}</template>
                <el-menu-item
                  v-for="(threeItem, i) in subItem.children"
                  :key="i"
                  :index="'/manage' + threeItem.path"
                  style="font-size: 13px"
                >
                  <i :class="threeItem.icon"></i>
                  <span slot="title" style="font-size: 13px">{{
                    threeItem.name
                  }}</span>
                </el-menu-item>
              </el-submenu>
              <el-menu-item
                v-else
                :index="'/manage' + subItem.path"
                :key="subItem.id"
                style="font-size: 13px"
              >
                <i :class="subItem.icon"></i>
                <span slot="title" style="font-size: 13px">{{
                  subItem.name
                }}</span>
              </el-menu-item>
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="'/manage' + item.path" :key="item.id">
            <i :class="item.icon"></i>
            <span slot="title" style="font-size: 13px">{{ item.name }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "SideBar",
  data: function () {
    return {};
  },
  methods: {},
  computed: {
    ...mapGetters(["router"]),
    items() {
      const res = JSON.parse(JSON.stringify(this.router));
      let dashboard = {
        name: "系统首页",
        path: "/dashboard",
        icon: "el-icon-menu"
      }
      res.unshift(dashboard)
      return res;
    },
    onRoutes() {
      return this.$route.path.replace("/", "");
    },
  },
  props: {
    collapse: {
      type: Boolean,
    },
  },
};
</script>

<style scoped>
.side-container {
  width: 200px;
  height: 100%;
  overflow-y: scroll;
  background: rgb(25, 26, 35);
}
.side-container::-webkit-scrollbar {
  width: 0;
}

.sidebar-el-menu:not(.el-menu--collapse) {
  width: 200px;
}
.side-container > ul {
  height: 100%;
}
.title {
  background: rgb(25, 26, 35);
  min-height: 60px;
  line-height: 60px;
  text-align: center;
}

.logoimg {
  width: 28px;
  height: 28px;
  vertical-align: middle;
  background: #fff;
  border-radius: 50%;
  padding: 3px;
}

.tit-title {
  display: inline-block;
  color: #fff;
  font-weight: 600;
  font-size: 16px;
  vertical-align: middle;
  padding-left: 10px;
}
</style>
