<template>
  <div class="router-admin-container">
    <el-button
      size="small"
      type="primary"
      style="width: 80px"
      @click="handleClick({}, 'add')"
      >添加</el-button
    >
    <el-card style="margin-top: 20px">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="roleName" label="名称"> </el-table-column>
        <el-table-column prop="identificat" label="标识"> </el-table-column>
        <el-table-column prop="id" label="角色所属项目">
          <template slot-scope="scope">
            <div>{{ isProject(scope.row.id) }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="updatedAt" label="更新时间">
          <template slot-scope="scope">
            <div>
              {{ scope.row.updatedAt | datefmt("YYYY-MM-DD HH:mm:ss") }}
            </div>
          </template>
        </el-table-column>

        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button
              @click="handleClick(scope.row, 'view')"
              size="mini"
              type="primary"
              >查看</el-button
            >
            <el-button
              size="mini"
              type="success"
              @click="handleClick(scope.row, 'edit')"
              >编辑</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog title="查看角色" :visible.sync="dialogVisible" width="40%">
      <div v-if="type === 'view'">
        <el-tree
          :data="authMine"
          node-key="nodeKey"
          :expand-on-click-node="false"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span v-if="data.type">{{
              data.type == 1 ? "目录 " : "菜单 "
            }}</span>
            <span v-if="data.identificat">按钮</span>
            {{ data.name }}
            <span v-if="data.identificat">{{ data.identificat }}</span>
          </span>
        </el-tree>
      </div>
      <div v-else-if="type === 'edit'">
        <el-tree
          :data="authList"
          ref="editTree"
          node-key="nodeKey"
          show-checkbox
          :default-checked-keys="authId"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span v-if="data.type">{{
              data.type == 1 ? "目录 " : "菜单 "
            }}</span>
            <span v-if="data.identificat">按钮</span>
            {{ data.name }}
            <span v-if="data.identificat">{{ data.identificat }}</span>
            {{ data.nodeKey }}
            {{ authId }}
          </span>
        </el-tree>
      </div>
      <div v-else-if="type === 'add'">
        <el-form
          :inline="true"
          :model="roleForm"
          ref="roleForm"
          style="margin-top: 10px"
          label-width="120px"
        >
          <el-form-item label="角色名称" prop="roleName" required>
            <el-input
              v-model="roleForm.roleName"
              size="medium"
              style="width: 350px"
              placeholder="角色名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="角色标识" prop="identificat" required>
            <el-input
              v-model="roleForm.identificat"
              size="medium"
              style="width: 350px"
              placeholder="角色标识"
            ></el-input>
          </el-form-item>
          <el-form-item label="角色所属项目" prop="projectId" required>
            <el-select
              v-model="roleForm.projectId"
              size="medium"
              style="width: 350px"
              placeholder="角色所属项目"
            >
              <el-option
                v-for="item in projectList"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleConfirm" size="small"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  GetAllAuthByProjectId,
  addRole,
  getProjectAndShowProject,
  getAllRouterByAdminProject,
} from "@/api/http.js";

export default {
  data() {
    return {
      tableData: [],
      dialogVisible: false,
      type: "view",
      data: [
        {
          label: "一级 1",
          children: [
            {
              label: "二级 1-1",
              children: [
                {
                  label: "三级 1-1-1",
                },
              ],
            },
          ],
        },
        {
          label: "一级 2",
          children: [
            {
              label: "二级 2-1",
              children: [
                {
                  label: "三级 2-1-1",
                },
              ],
            },
            {
              label: "二级 2-2",
              children: [
                {
                  label: "三级 2-2-1",
                },
              ],
            },
          ],
        },
        {
          label: "一级 3",
          children: [
            {
              label: "二级 3-1",
              children: [
                {
                  label: "三级 3-1-1",
                },
              ],
            },
            {
              label: "二级 3-2",
              children: [
                {
                  label: "三级 3-2-1",
                },
              ],
            },
          ],
        },
      ],
      defaultProps: {
        children: "children",
        label: "name",
      },
      roleForm: {
        roleName: "",
        identificat: "",
        projectId: "",
      },
      projectList: [],
      projectMap: {},
      authList: [],
      authId: [],
      authMine: [],
      nodes: [],
    };
  },
  async created() {
    await this.getRoles();
    await this.getProjectList();
  },
  async mounted() {
    await this.getRouterButton();
  },
  methods: {
    async getRoles() {
      const res = await GetAllAuthByProjectId(this.$route.params.id);
      if (res.errno === 0) {
        this.tableData = res.data.data;
      }
    },
    submit() {
      console.log("submit");
    },
    reset() {
      console.log("reset");
    },
    isProject(id) {
      let data;
      this.projectList.forEach((item) => {
        if ((item.auth + " ").indexOf(id) > -1) {
          data = item;
        }
      });
      return data.name;
    },
    handleClick(row, type) {
      this.type = type;
      this.setAuthMine(row.id);
      this.dialogVisible = true;
      if (type === "edit") {
        this.$nextTick(() => {
          this.nodes = this.$refs.editTree.getCheckedNodes();
        });
      }
      console.log(row);
    },
    setAuthMine(id) {
      this.authMine = [];
      const _this = this;
      this.authId = [];
      function revser(data, list) {
        if (!list) {
          list = [];
        }
        data.forEach((item, index) => {
          if ((item.auth + " ").indexOf(id) > -1) {
            if (item.type) {
              list.push({
                nodeKey: item.nodeKey,
                type: item.type,
                name: item.name,
              });
            }
            if (item.identificat) {
              list.push({
                nodeKey: item.nodeKey,
                identificat: item.identificat,
                name: item.name,
              });
            }
            if (!item.children) {
              _this.authId.push(item.nodeKey);
            }
          }
          console.log(list, _this.authMine);
          if (item.children) {
            if (list.length !== 0) {
              list[list.length - 1].children = [];
              revser(item.children, list[list.length - 1].children);
            }
          }
        });
      }
      revser(this.authList, this.authMine);
      // this.authList.forEach((item) => {
      //   if ((item.auth + " ").indexOf(id) > -1) {
      //     if (item.type) {
      //       this.authMine.push({
      //         nodeKey: item.nodeKey,
      //         type: item.type,
      //         name: item.name,
      //       });
      //     }
      //     if (item.identificat) {
      //       this.authMine.push({
      //         nodeKey: item.nodeKey,
      //         identificat: item.identificat,
      //         name: item.name,
      //       });
      //     }
      //   }
      // });
    },
    async getRouterButton() {
      const res = await getAllRouterByAdminProject({
        projectId: this.$route.params.id,
      });
      if (res.errno === 0) {
        console.log(res, "res");
        this.authList = res.data.data;
      }
    },
    async getProjectList() {
      const res = await getProjectAndShowProject({ id: this.$route.params.id });
      if (res.errno === 0) {
        this.projectList = res.data.data;
      }
    },
    handleConfirm() {
      if (this.type === "add") {
        console.log(this.$refs["roleForm"]);
        this.$refs["roleForm"].validate(async (valid) => {
          if (valid) {
            const res = await addRole(this.roleForm);
            if (res.errno === 0) {
              this.$message.success("创建角色成功");
              await this.getRoles();
              this.dialogVisible = false;
            }
          } else {
            console.log("submit error");
            return false;
          }
        });
      } else if (this.type === "edit") {

        if (this.nodes.toString() != this.$refs.editTree.getCheckedNodes().toString()) {
          this.nodes = this.$refs.editTree.getCheckedNodes();
          this.handleEditForm(this.nodes);
        } else {
          this.dialogVisible = false;
          this.$message.success("您没有修改");
        }
      } else if (this.type === "view") {
        this.dialogVisible = false;
      }
    },
    handleEditForm(val) {
      const routes = [],
        btns = [];
      function recurse(val) {
        if (val.children) {
          recurse(val.children);
        } else {
          val.forEach((item) => {
            if (item.type) {
              routes.push(item);
            }
            if (item.identificat) {
              btns.push(item);
            }
          });
        }
      }
      recurse(val);
      console.log( this.authMine,routes, btns);
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
