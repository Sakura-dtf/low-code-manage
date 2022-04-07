<template>
  <div class="user-admin-container">
    <el-card>
      <el-form-schema
        :schema="schema"
        v-model="model"
        :inline="true"
        :is-search-form="true"
        :use-enter-search="false"
        label-width="auto"
        component-width="220px"
        @submit="submit"
        @reset="reset"
      ></el-form-schema>
    </el-card>
    <el-card style="margin-top: 20px">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="AuthId" label="角色" >
        </el-table-column>
        <el-table-column prop="username" label="用户名">
        </el-table-column>
        <el-table-column prop="createdAt" label="更新时间">
        </el-table-column>
        <el-table-column prop="avatar" label="头像">
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small"
              >查看</el-button
            >
            <el-button type="text" size="small">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import {getAllUserByProjectId } from "@/api/http.js"
export default {
  data() {
    return {
      model: {
        name: "",
        role: "",
        project: "",
      },
      schema: {
        name: {
          tag: "el-input",
          label: "姓名",
        },
        role: {
          tag: "el-input",
          label: "角色",
        },
      },
      tableData: [],
    };
  },
  async created() {
    const res = await getAllUserByProjectId(this.$route.params.id);
     if(res.errno === 0) {
        this.tableData = res.data.data;
     }
  },
  methods: {
    submit() {
      console.log("submit");
    },
    reset() {
      console.log("reset");
    },
    handleClick(row) {
      console.log(row);
    },
  },
};
</script>

<style>
.user-admin-container {
  background: #fff;
  padding: 5px;
}
</style>
