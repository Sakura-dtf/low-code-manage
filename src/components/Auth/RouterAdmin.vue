<template>
  <div class="router-admin-container">
    <el-button
      size="small"
      type="primary"
      style="width: 80px"
      @click="handleClick('', 'add')"
      >添加</el-button
    >
    <el-card style="margin-top: 20px">
      <el-table
        :data="tableData"
        border
        row-key="id"
        style="width: 100%"
        default-expand-all
        :tree-props="{ children: 'children' }"
        >>
        <el-table-column prop="name" label="名称" width="180">
        </el-table-column>
        <el-table-column prop="icon" label="图标" width="200"> </el-table-column>
        <el-table-column prop="type" label="类型">
          <template slot-scope="scope">
            {{ scope.row.type == 1 ? "目录" : "菜单" }}
          </template>
        </el-table-column>
        <el-table-column prop="path" label="节点路由" min-width="200"> </el-table-column>
        <el-table-column
          prop="updatedAt"
          label="更新时间"
          width="250"
        >
          <template slot-scope="scope">
            <div>
              {{ scope.row.updatedAt | datefmt("YYYY-MM-DD HH:mm:ss") }}
            </div>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="300">
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
              @click="handleClick(scope.row, 'webconfig')"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              :disabled="scope.row.type == 1"
              @click="handleClick(scope.row, 'button')"
              >按钮编辑</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog title="角色切换" :visible.sync="dialogVisible" width="40%">
      <div v-if="type === 'view'">
        <div>角色权限</div>
        <div class="tagList">
          <el-tag v-for="item in authComputedList" class="tagBox" :key="item">{{
            item.roleName
          }}</el-tag>
        </div>
        <div style="margin-top: 10px">按钮权限</div>
        <div class="tagList">
          <el-tag
            v-for="item in buttonViewList"
            class="tagBox"
            closable
            :key="item.id"
            >{{ item.name }} {{ item.identificat }}</el-tag
          >
        </div>

        <div style="margin-top: 10px">路由页面</div>
        <div class="tagList">
          <el-tag class="tagBox">{{
            webConfigComputed ? webConfigComputed.label : ""
          }}</el-tag>
        </div>
      </div>
      <div v-if="type === 'button'">
        <div style="margin-top: 10px">按钮权限</div>
        <div class="tagList">
          <el-tag
            v-for="item in buttonViewList"
            class="tagBox"
            closable
            :key="item.id"
            >{{ item.name }} {{ item.identificat }}</el-tag
          >
        </div>

        <el-form
          :inline="true"
          :model="buttonForm"
          ref="buttonForm"
          style="margin-top: 10px"
        >
          <el-form-item label="按钮名称" prop="name" required="">
            <el-input
              v-model="buttonForm.name"
              size="medium"
              style="width: 400px"
              placeholder="按钮名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="按钮标识" prop="identificat" required>
            <el-input
              v-model="buttonForm.identificat"
              size="medium"
              style="width: 400px"
              placeholder="按钮标识"
            ></el-input>
          </el-form-item>
          <el-form-item label="按钮权限" prop="auth" required>
            <el-select
              v-model="buttonForm.auth"
              placeholder="按钮权限"
              multiple
              style="width: 400px"
            >
              <el-option
                v-for="item in authList"
                :key="item.id"
                :label="item.roleName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div v-if="type === 'webconfig'">
        <el-form :model="webConfigForm" ref="webConfigForm" label-width="100px">
          <el-form-item label="路由名称" prop="name" required>
            <el-input
              v-model="webConfigForm.name"
              placeholder="路由名称"
              style="width: 400px"
            ></el-input>
          </el-form-item>
          <el-form-item label="父级路由" prop="fatherId" required>
            <el-select
              v-model="webConfigForm.fatherId"
              placeholder="父级路由"
              style="width: 400px"
            >
              <el-option
                v-for="item in fatherList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="路由路径" prop="path" required>
            <el-input
              v-model="webConfigForm.path"
              placeholder="路由路径"
              style="width: 400px"
            ></el-input>
          </el-form-item>
          <el-form-item label="路由类型" prop="type" required>
            <el-select
              v-model="webConfigForm.type"
              placeholder="路由类型"
              style="width: 400px"
            >
              <el-option
                v-for="item in typeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="路由图标" prop="icon">
            <el-input
              v-model="webConfigForm.icon"
              placeholder="路由图标"
              style="width: 400px"
            ></el-input>
          </el-form-item>
          <el-form-item label="路由权限" prop="auth">
            <el-select
              v-model="webConfigForm.auth"
              placeholder="路由权限"
              multiple
              style="width: 400px"
            >
              <el-option
                v-for="item in authList"
                :key="item.id"
                :label="item.roleName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="绑定网页" prop="webConfigId">
            <el-select
              v-model="webConfigForm.webConfigId"
              placeholder="绑定网页"
              style="width: 400px"
            >
              <el-option
                v-for="item in webConfigList"
                :key="item.id"
                :label="item.label"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div v-if="type === 'add'">
        <el-form :model="routeForm" ref="routeForm" label-width="100px">
          <el-form-item label="路由名称" prop="name" required>
            <el-input
              v-model="routeForm.name"
              placeholder="路由名称"
              style="width: 400px"
            ></el-input>
          </el-form-item>
          <el-form-item label="父级路由" prop="fatherId" required>
            <el-select
              v-model="routeForm.fatherId"
              placeholder="父级路由"
              style="width: 400px"
            >
              <el-option
                v-for="item in fatherList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="路由路径" prop="path" required>
            <el-input
              v-model="routeForm.path"
              placeholder="路由路径"
              style="width: 400px"
            ></el-input>
          </el-form-item>
          <el-form-item label="路由类型" prop="type" required>
            <el-select
              v-model="routeForm.type"
              placeholder="路由类型"
              style="width: 400px"
            >
              <el-option
                v-for="item in typeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="路由图标" prop="icon">
            <el-input
              v-model="routeForm.icon"
              placeholder="路由图标"
              style="width: 400px"
            ></el-input>
          </el-form-item>
          <el-form-item label="路由权限" prop="auth">
            <el-select
              v-model="routeForm.auth"
              placeholder="路由权限"
              multiple
              style="width: 400px"
            >
              <el-option
                v-for="item in authList"
                :key="item.id"
                :label="item.roleName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="绑定网页" prop="webConfigId">
            <el-select
              v-model="routeForm.webConfigId"
              placeholder="绑定网页"
              style="width: 400px"
            >
              <el-option
                v-for="item in webConfigList"
                :key="item.id"
                :label="item.label"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" size="small" @click="handleConfirm"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getAllRouterByAuthByAdminProject,
  getAllWebCOnfig,
  GetAllAuthByProjectId,
  addRouter,
  addButton,
  getOneRouterById,
  getButton,
  setRouter,
} from "@/api/http.js";
export default {
  data() {
    return {
      tableData: [],
      dialogVisible: false,
      type: "view",
      tagList: ["图书管理员1", "图书管理员2", "图书管理员3"],
      authViewList: [],
      buttonViewList: [],
      webConfigViewName: "",
      roleForm: {
        roleId: [],
      },
      buttonForm: {
        name: "",
        auth: null,
        identificat: "",
      },
      routeForm: {
        name: "",
        path: "",
        icon: "",
        fatherId: null,
        auth: "",
        type: "",
        webConfigId: "",
      },
      webConfigForm: {
        name: "",
        path: "",
        icon: "",
        fatherId: null,
        auth: "",
        type: "",
        webConfigId: "",
      },
      fatherList: [{ label: "无", value: 0 }],
      typeList: [
        { label: "菜单", value: "2" },
        { label: "目录", value: "1" },
      ],
      webConfigList: [],
      authList: [],
      row: {
        id: ""
      },
    };
  },
  computed: {
    authComputedList() {
      let res = [];
      this.authViewList.forEach((item) => {
        this.authList.forEach((i) => {
          if (i.id === item) {
            res.push(i);
          }
        });
      });
      return res;
    },
    webConfigComputed() {
      let res;
      this.webConfigList.forEach((i) => {
        if (this.webConfigViewName === i.id) {
          res = i;
        }
      });
      return res;
    },
  },
  async created() {
    await this.getAllRouter();
    await this.getAllWebConfig();
    await this.getAllAuth();
  },
  methods: {
    submit() {
      console.log("submit");
    },
    reset() {
      console.log("reset");
    },
    async getAllRouter() {
      const res = await getAllRouterByAuthByAdminProject(this.$route.params.id);
      if (res.errno === 0) {
        this.tableData = res.data.data;
        let data = [{ label: "无", value: 0 }];
        this.tableData.forEach((item) => {
          data.push({ label: item.name, value: item.id });
        });
        this.fatherList = data;
      }
    },
    async getAllWebConfig() {
      const res = await getAllWebCOnfig();
      console.log(res);
      if (res.errno === 0) {
        this.webConfigList = res.data.data;
      }
    },
    async getAllAuth() {
      const res = await GetAllAuthByProjectId(this.$route.params.id);
      console.log(res);
      if (res.errno === 0) {
        this.authList = res.data.data;
      }
    },
    async handleClick(row, type) {
      this.type = type;
      this.row = row;
      if (type === "webconfig") {
        await this.getOneRouter();
      } else if (type === "button") {
        await this.getButtonById();
      } else if (type === "view") {
        await this.getOneRouter();
        await this.getButtonById();
      }
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.clearField();
      });
    },
    async getButtonById() {
      const res = await getButton({ RouterId: this.row.id });
      console.log(res);
      if (res.errno === 0) {
        this.buttonViewList = res.data.data;
      }
    },
    async getOneRouter() {
      const res = await getOneRouterById({ id: this.row.id });
      if (res.errno === 0) {
        this.webConfigForm = JSON.parse(JSON.stringify(res.data.data));
        this.webConfigForm.fatherId = res.data.data.fatherId
          ? Number(res.data.data.fatherId)
          : 0;
        this.webConfigForm.auth = res.data.data.auth.split(" ").map(Number);
        this.webConfigViewName = this.webConfigForm.webConfigId;
        this.authViewList = this.webConfigForm.auth;
      }
    },
    clearField() {
      if (this.type === "button") {
        this.buttonForm = {
          name: "",
          auth: null,
          identificat: "",
        };
        this.$refs["buttonForm"].resetFields();
      }
    },
    handleConfirm() {
      if (this.type === "add") {
        this.handlerAddRouter();
      } else if (this.type === "button") {
        this.handleAddButton();
      } else if (this.type === "webconfig") {
        this.handleSetRouter();
      }
    },
    handleSetRouter() {
      this.$refs["webConfigForm"].validate(async (valid) => {
        if (valid) {
          const res = await setRouter({
            projectId: this.$route.params.id,
            ...this.webConfigForm,
            id: this.row.id,
          });
          if (res.errno === 0) {
            this.$message.success("创建成功");
            this.dialogVisible = false;
            await this.getAllRouter();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleAddButton() {
      this.$refs["buttonForm"].validate(async (valid) => {
        if (valid) {
          const res = await addButton({
            RouterId: this.row.id,
            ...this.buttonForm,
          });
          if (res.errno === 0) {
            this.$message.success("创建成功");
            // this.dialogVisible = false;
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handlerAddRouter() {
      this.$refs["routeForm"].validate(async (valid) => {
        if (valid) {
          const res = await addRouter({
            projectId: this.$route.params.id,
            ...this.routeForm,
          });
          if (res.errno === 0) {
            this.$message.success("创建成功");
            this.dialogVisible = false;
            await this.getAllRouter();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>

<style>
.router-admin-container {
  background: #fff;
  padding: 5px;
}
.tagList {
  margin-top: 5px;
}

.tagBox {
  margin: 10px;
}
</style>
