<template>
  <div class="project-container">
    <div class="project-box-container" v-if="projects.length">
      <div v-for="item in projects">
        <router-link
          v-if="item.type === '1'"
          :to="{ path: `/admin/${item.id}` }"
          @click="handleClick(item.id)"
          class="project-box"
        >
          {{ item.name }}
        </router-link>
        <div v-else @click="hanleManageClick(item.id)" class="project-box">
          {{ item.name }}
        </div>
      </div>
    </div>
    <div v-else>您的角色暂时没有项目</div>
    <div class="btn-container">
      <el-button type="primary" style="margin: 20px">添加项目</el-button>
    </div>
  </div>
</template>

<script>
import { getAllProjectByRole, getAllRouterByAuthByProject } from "@/api/http.js";
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
  methods: {
    handleClick(id) {
      this.$store.commit("setNowProjectId", id);
    },
    async hanleManageClick(id) {
      this.$store.commit("setNowProjectId", id);
      const res = await getAllRouterByAuthByProject(id);
      if(res.errno === 0) {
        const data = res.data.data;
        this.$store.commit("setNowRouter", data);
      }
      this.$router.push("/manage");
    },
  },
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
