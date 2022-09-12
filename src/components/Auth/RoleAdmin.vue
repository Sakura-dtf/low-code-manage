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
      <el-table
        :data="tableData"
        style="width: 100%"
        @expand-change="expandChange"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <div class="expand-container">
              <el-table
                :data="authMine"
                style="width: 80%; margin-bottom: 20px"
                :border="false"
                row-key="nodeKey"
                default-expand-all
                :tree-props="{ children: 'children' }"
              >
                <el-table-column prop="name" label="名称" width="180">
                </el-table-column>
                <el-table-column prop="type" label="类型">
                  <template slot-scope="scope">
                    {{ scope.row.type == 1 ? "目录" : "菜单" }}
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <dir v-if="scope.row.button">
                      <el-tag
                        v-for="item in scope.row.button"
                        :key="item.id"
                        style="margin: 0 5px"
                        >{{ item.name + " " + item.identificat }}
                      </el-tag>
                    </dir>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </template>
        </el-table-column>
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
            <!-- <el-button
              @click="handleClick(scope.row, 'view')"
              size="mini"
              type="primary"
              >查看</el-button
            > -->
            <el-button
              size="mini"
              type="success"
              :disabled="scope.row.type == 1"
              @click="handleClick(scope.row, 'edit')"
              >编辑</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog title="查看角色" :visible.sync="dialogVisible" width="60%">
      <!-- <div v-if="type === 'view'">
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
      </div> -->
      <div v-if="type === 'edit'">
        <el-table
          :data="authList"
          style="width: 90%; margin: 0 auth"
          :border="false"
          row-key="id"
          ref="editTable"
          default-expand-all
          :expand-row-keys="routerId"
          :tree-props="{ children: 'children' }"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column prop="name" label="名称" width="180">
          </el-table-column>
          <el-table-column prop="type" label="类型">
            <template slot-scope="scope">
              {{ scope.row.type == 1 ? "目录" : "菜单" }}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <dir v-if="scope.row.button && scope.row.button.length">
                <el-checkbox-group v-model="buttonId[scope.row.id]">
                  <el-checkbox
                    v-for="item in scope.row.button"
                    :key="item.id"
                    :label="item.identificat"
                  >
                    {{ item.name }}</el-checkbox
                  >
                </el-checkbox-group>

                <!-- <el-tag :key="item.id"
                  >{{ item.name + " " + item.identificat }}
                </el-tag> -->
              </dir>
            </template>
          </el-table-column>
        </el-table>
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
  setRouterAuth,
  setButtonAuth,
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
      list: [
        {
          name: "aaa",
          id: 1,
        },
        {
          name: "bbbb",
          id: 2,
        },
      ],
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
      routerId: [],
      buttonId: {},
      copyRouterId: [],
      copyButtonId: [],
      roleInfo: {},
    };
  },
  async created() {
    try {
      await this.getRoles();
    } catch (error) {

    }
    
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
      
    },
    reset() {
      
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
      this.dialogVisible = true;
      this.setAuthMine(row.id);
      if (type === "edit") {
        this.roleInfo = row;
        this.$nextTick(() => {
          let k = 0;
          const recurse = (list) => {
            for (let i = 0; i < list.length; i++) {
              const item = list[i];
              let flag = true;

              for (let j = 0; j < this.routerId.length; j++) {
                if (this.routerId[j] === item.id) {
                  flag = false;
                  this.$refs.editTable.toggleRowSelection(item, true);
                }
              }
              if (flag) {
                this.$refs.editTable.toggleRowSelection(item, false);
              }
     
              if (list[i].children && list[i].children.length) {
                recurse(list[i].children);
              }
            }
          };
          recurse(this.authList);
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
          _this.$set(_this.buttonId, item.id, []);
          _this.$set(_this.copyButtonId, item.id, []);
          if ((item.auth + " ").indexOf(id) > -1) {
            let button = [];
            _this.routerId.push(item.id);
            _this.copyRouterId.push(item.id);
            if (item.button && item.button.length) {
              item.button.forEach((i) => {
                if (i.auth.indexOf(id) > -1) {
                  _this.buttonId[item.id].push(i.identificat);
                  _this.copyButtonId[item.id].push(i.identificat);
                  button.push(i);
                }
              });
            }

            if (item.type) {
              list.push({
                nodeKey: item.nodeKey,
                type: item.type,
                name: item.name,
                button: button,
              });
            }

            if (!item.children) {
              _this.authId.push(item.nodeKey);
            }
          }
          if (item.children) {
            if (list && list.length !== 0) {
              list[list.length - 1].children = [];
              revser(item.children, list[list.length - 1].children);
            }
          }
        });
      }
      _this.routerId = [];
      revser(this.authList, this.authMine);
    },
    expandChange(row, expand) {
      console.log(row, expand);
      this.setAuthMine(row.id);
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
        this.handleEditForm(this.nodes);
      } else if (this.type === "view") {
        this.dialogVisible = false;
      }
    },
    handleEditForm(val) {
      console.log(
        this.routerId,
        this.copyRouterId,
        this.buttonId,
        this.copyButtonId
      );

      const p1 = () => {
        const { add, del } = findCb(this.routerId, this.copyRouterId);
        return setRouterAuth({
          add: add.join(","),
          del: del.join(","),
          AuthId: this.roleInfo.id,
        });
      };

      let keys = Object.keys(this.buttonId);
      let obj = [],
        i = 0;
      keys.forEach((item) => {
        const { add, del } = findCb(
          this.copyButtonId[item],
          this.buttonId[item]
        );
        if (add.length || del.length) {
          obj[i] = () => {
            return setButtonAuth({
              add: add.join(","),
              del: del.join(","),
              AuthId: this.roleInfo.id,
              RouterId: item,
            });
          };
        }
      });

      let arr = [p1()];

      obj.forEach((item) => {
        arr.push(item());
      });

      console.log(arr);

      Promise.all(arr).then((res) => {
        console.log(res);
        this.dialogVisible = false;
        this.$message.success("修改成功");
      });
      function findCb(list, copyList) {
        let temp = JSON.parse(JSON.stringify(list));
        let obj = {};
        for (let i = 0; i < temp.length; i++) {
          obj[temp[i]] = i;
        }

        let add = [],
          del = [];
        //  debugger;
        for (let i = 0; i < copyList.length; i++) {
          const item = copyList[i];
          if (obj[item] !== undefined) {
            temp.splice(temp.indexOf(item), 1);
          } else {
            add.push(item);
          }
        }
        for (let i = 0; i < temp.length; i++) {
          const item = temp[i];
          del.push(item);
        }
        return { add, del };
      }
    },
    handleSelectionChange(val) {
      this.copyRouterId = val && val.map((item) => item.id);
    },
  },
};
</script>

<style>
.router-admin-container {
  background: #fff;
  padding: 5px;
}
.expand-container {
  padding: 20px;
}
</style>
