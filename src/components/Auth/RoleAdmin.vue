<template>
  <div class="router-admin-container">
    <el-button size="small" type="primary" style="width: 80px">添加</el-button>
    <el-card style="margin-top: 20px">
      <el-table :data="tableData" border  style="width: 100%">
        <el-table-column prop="roleName" label="名称"> </el-table-column>
        <el-table-column prop="identificat" label="标识"> </el-table-column>
        <el-table-column prop="createdAt" label="更新时间"> </el-table-column>
        <el-table-column prop="updatedAt" label="更新时间"> </el-table-column>
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
import { GetAllAuthByProjectId } from "@/api/http.js";
export default {
  data() {
    return {
      tableData: [],
    };
  },
  async created() {
     const res = await GetAllAuthByProjectId(this.$route.params.id);
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
.router-admin-container {
  background: #fff;
  padding: 5px;
}
</style>
