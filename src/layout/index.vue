<template>
  <el-container style="height: 100%">
    <el-aside
      :style="{
        width: !collapse ? '200px' : '64px',
      }"
    >
      <v-side :collapse="collapse"></v-side>
    </el-aside>
    <el-container>
      <el-header style="padding: 0; height: 110px">
        <v-head :collapse="collapse" @handle-collapse="handleCollapse"></v-head>
        <v-tags ref="tags"></v-tags>
      </el-header>
      <el-main style="padding: 10px; overflow: auto;">
        <transition name="move" mode="out-in">
          <keep-alive>
            <router-view  :key="key"></router-view>
          </keep-alive>
        </transition>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { vHead, vSide, vTags } from "./components";
export default {
  name: "Layout",
  components: {
    vHead,
    vSide,
    vTags,
  },
  data: function () {
    return {
      collapse: false,
    };
  },
  computed: {
    key() {
      return this.$route.name !== undefined
        ? this.$route.name + new Date()
        : this.$route + new Date();
    },
  },
  methods: {
    handleCollapse() {
      this.collapse = !this.collapse;
    },
  },
};
</script>

<style lang="scss" scoped></style>
