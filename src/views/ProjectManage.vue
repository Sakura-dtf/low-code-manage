<template>
  <div class="project-container">
    <div class="project-box-container" v-if="projects.length">
      <div v-for="item in projects">
        <router-link
          v-if="item.type === '2'"
          :to="{ path: `/admin/${item.id}` }"
          @click="handleClick(item.id)"
          class="project-box"
        >
          {{ item.name }}
        </router-link>
        <router-link v-else :to="{ path: '/project', params: { id: 1 }}" class="project-box"> {{ item.name }}</router-link>
      </div>
    </div>
    <div v-else>您的角色暂时没有项目</div>
    <div class="btn-container">
      <el-button type="primary" style="margin: 20px">添加项目</el-button>
    </div>
  </div>
</template>

<script>
import { getAllProjectByRole } from "@/api/http.js";
export default {
  data() {
    return {
      projects: [],
    };
  },
  async created() {
    const { data: res } = await getAllProjectByRole();
    console.log(res.data);
    this.projects = res.data;
  },
  handleClick(id) {
    this.$store.commit("setNowProjectId", id)
  }
};
</script>

<style scoped>
.project-container {
  padding: 30px;
}
.project-box-container {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
.project-box {
  width: 280px;
  height: 200px;
  line-height: 150px;
  font-size: 30px;
  font-weight: bold;
  cursor: pointer;
  margin: 20px;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  transition: all ease 0.3s;
  display: flex;
  justify-content: center;
  padding: 10px 10px;
  align-items: center;
}
.project-box:hover {
  transform: translateY(-10px);
}
</style>
