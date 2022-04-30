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
        @submit="getAllUser"
        @reset="reset"
      ></el-form-schema>
    </el-card>
    <el-card style="margin-top: 20px">
      <el-button type="primary" size="small" @click="addUser"
        >添加用户</el-button
      >
      <el-table :data="tableData" border style="width: 100%; margin-top: 10px">
        <el-table-column prop="AuthId" label="角色">
          <template slot-scope="scope">
            <div>
              {{ authData[scope.row.AuthId] }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名"> </el-table-column>
        <el-table-column prop="username" label="用户名"> </el-table-column>
        <el-table-column prop="updatedAt" label="更新时间">
          <template slot-scope="scope">
            <div>
              {{ scope.row.updatedAt | datefmt("YYYY-MM-DD HH:mm:ss") }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="avatar" label="头像">
          <template slot-scope="scope">
            <div>
              <el-avatar
                size="medium"
                :src="scope.row.avatar ? scope.row.avatar : avatar"
              ></el-avatar>
            </div>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button
              type="success"
              size="mini"
              @click="openDialog(scope.row.AuthId, scope.row.id)"
              >切换角色</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="margin-top: 10px"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <el-dialog title="角色切换" :visible.sync="dialogVisible" width="40%">
      <div v-if="type === 'edit'">
        <el-form ref="form" :model="form" label-width="120px">
          <el-form-item label="角色切换">
            <el-select v-model="form.authId" prop="authId" style="width: 300px">
              <el-option
                v-for="item in authList"
                :key="item.id"
                :label="item.roleName"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div v-else-if="type === 'add'">
        <el-form ref="userForm" :model="userForm" label-width="120px">
          <el-form-item label="姓名" required prop="name">
            <el-input v-model="userForm.name" style="width: 300px"></el-input>
          </el-form-item>
          <el-form-item label="用户名" required prop="username">
            <el-input
              v-model="userForm.username"
              style="width: 300px"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码" required prop="password">
            <el-input
              v-model="userForm.password"
              type="password"
              style="width: 300px"
            ></el-input>
          </el-form-item>
          <el-form-item label="角色" required prop="AuthId">
            <el-select v-model="userForm.AuthId" style="width: 300px">
              <el-option
                v-for="item in authList"
                :key="item.id"
                :label="item.roleName"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import avatar from "@/static/images/avator.jpg";

import {
  getAllUserByProjectId,
  GetAllAuthByProjectId,
  registerUser,
  setUserAuth,
} from "@/api/http.js";
export default {
  data() {
    return {
      model: {
        name: "",
        username: "",
        role: "",
      },
      form: {
        authId: null,
        userId: null,
      },
      userForm: {
        username: "",
        name: "",
        password: "",
        AuthId: null,
      },
      dialogVisible: false,
      avatar: avatar,
      schema: {
        name: {
          tag: "el-input",
          label: "姓名",
        },
        username: {
          tag: "el-input",
          label: "用户名",
        },
        role: {
          tag: "el-select",
          label: "角色",
          keys: { label: "roleName", value: "id" },
          props: {
            clearable: true,
          },
          items: [],
        },
      },
      type: "",
      tableData: [],
      authData: {},
      authList: [],
      currentPage: 1,
      pageSize: 5,
      total: 0,
    };
  },
  async created() {
    await this.getAllAuth();
    await this.getAllUser();
  },
  methods: {
    submit() {
      console.log("submit");
    },
    addUser() {
      this.type = "add";
      this.dialogVisible = true;
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    handleSubmit() {
      if (this.type === "add") {
        this.$refs["userForm"].validate(async (valid) => {
          if (valid) {
            const res = await registerUser(this.userForm);
            console.log(res);
            if (res.errno === 0) {
              this.$message.success("创建用户成功");
              await this.getAllUser();
            }
            this.dialogVisible = false;
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      } else if(this.type === 'edit'){
        this.$refs["form"].validate(async (valid) => {
          if (valid) {
            const res = await setUserAuth({
              userId: this.form.userId,
              authId: this.form.authId
            });
            console.log(res);
            if (res.errno === 0) {
              this.$message.success("修改用户角色成功");
              await this.getAllUser();
            }
            this.dialogVisible = false;
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      }
    },
    async getAllAuth() {
      const res = await GetAllAuthByProjectId(this.$route.params.id);
      if (res.errno === 0) {
        res.data.data.forEach((item) => {
          this.authData[item.id] = item.roleName;
        });
        this.authList = res.data.data;
        this.schema.role.items = res.data.data;
      }
    },

    async getAllUser() {
      const res = await getAllUserByProjectId({
        projectId: this.$route.params.id,
        ...this.model,
        currentPage: this.currentPage,
        pageSize: this.pageSize,
      });
      if (res.errno === 0) {
        this.tableData = res.data.data;
        this.total = res.data.total;
      }
    },
    openDialog(authId, id) {
      this.type = "edit";
      this.dialogVisible = true;
      this.form.authId = authId;
      this.form.userId = id
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
