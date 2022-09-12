<template>
  <div class="low-code-container">
    <el-card>
      <el-form-schema
        :schema="efsSchema"
        v-model="formValue"
        v-bind="{ ...efsConfig }"
        :is-search-form="true"
        style="margin: 5px"
        @submit="handlerSubmit"
      >
      </el-form-schema>
    </el-card>
    <el-card style="margin-top: 15px">
      <EditButton
        :buttonData="buttonData"
        @handleBtnClick="handleBtnClick"
        :selectRow="selectRow"
      ></EditButton>

      <EasyTable
        :columns="columns"
        :tableOption="tableOption"
        :pageOption="pageOption"
        :sizeChange="sizeChange"
        :tableData="tableJson"
        @handleSelectionChange="handleSelectionChange"
        @handleTable="handleTable"
        @openDialog="openDialog"
        :formValue="efsValue"
        :efsConfig="efsConfig"
        style="margin: 20px 5px 5px 5px"
      ></EasyTable>
    </el-card>

    <EasyDialog
      :dialogSchema="dialogSchema"
      :dialogValue="dialogValue"
      :dialogComponentData="dialogComponentData"
      :dialogEfsSchema="dialogEfsSchema"
      :dialogEfsValue="dialogEfsValue"
      :dialogTableColums="dialogTableColums"
      :dialogTableJson="dialogTableJson"
      @closeDialog="closeDialog"
      ref="EasyDialog"
    ></EasyDialog>
  </div>
</template>

<script>
import EditButton from "./components/EditButton";
import EasyTable from "./components/EasyTable";
import EasyDialog from "./components/EasyDialog";

export default {
  props: {
    efsSchema: {
      type: Object,
      require: true,
    },
    efsValue: {
      type: Object,
      require: true,
    },
    efsConfig: {
      type: Object,
      require: true,
    },
    buttonData: {
      type: Array,
      default: () => [],
    },
    columns: {
      type: Array,
      default: () => [],
    },
    tableJson: {
      type: Array,
      default: () => [],
    },
    tableOption: {
      type: Object,
      default: () => {},
    },
    pageOption: {
      type: Object,
      default: () => {
        return {
          size: 5,
          curPage: 1,
          sizes: [5, 10, 15, 20],
          total: 0,
        };
      },
    },
    sizeChange: String,
    isDialogEfs: {
      type: Boolean,
      default: false,
    },
    dialogField: String,
    dialogSchema: {
      type: Array,
      default: () => [],
    },
    dialogComponentData: {
      type: Object,
      default: () => {},
    },
    dialogValue: {
      type: Object,
      default: () => {},
    },
    dialogEfsSchema: {
      type: Object,
      default: () => {},
    },
    dialogEfsValue: {
      type: Object,
      default: () => {},
    },
    dialogTableColums: {
      type: Object,
      default: () => {},
    },
    dialogTableJson: {
      type: Object,
      default: () => {},
    },
  },
  components: {
    EditButton,
    EasyTable,
    EasyDialog,
  },
  data() {
    return {
      formValue: {},
      selectRow: [],
      flag: true,
    };
  },
  created() {
    this.formValue = this.efsValue;
    console.log(this.dialogSchema, 1);
  },
  watch: {
    formValue(val) {
      this.$emit("handleEFSChange", val);
    },
    efsConfig() {
      const { shouldSubmit } = this.efsConfig;
      if (shouldSubmit && this.flag) {
        this.handlerSubmit();
        this.flag = false;
      }
    },
  },
  methods: {
    handleBtnClick(field) {
      let btn;
      this.buttonData &&
        this.buttonData.forEach((item) => {
          if (item.field === field) {
            btn = item;
          }
        });
      let fn = new Function("return " + btn.on.click.toString().trim())();
      let tableCtx = {
        selectRow: this.selectRow,
      };
      let dialogCtx = {
        cb: (field, value, type) => {
          console.log(field, value, type, "adsad")
          this.$emit("openDialog", field, value, type);
        },
      };
      fn.call(this, tableCtx, dialogCtx);
    },
    handleSelectionChange(rows) {
      this.selectRow = rows;
    },
    handlerSubmit() {
      console.log(this.efsConfig.onSubmit.toString().trim(), "test");
      let formCtx = {
        formValue: this.efsValue,
        pageInfo: this.pageOption,
        cb: async (url, type) => {
          let res = await this.$http.post(url, {
            ...formCtx.formValue,
            pageIndex: formCtx.pageInfo.pageCurpage,
            pageSize: formCtx.pageInfo.pageSize,
          });
          if (res.data) {
            this.$emit("handleTable", res.data.data, res.data.total);
          }
        },
      };
      let tableCtx = {
        cb: (val, total) => {},
        pageInfo: this.pageOption,
      };

      let fn = new Function(
        "return " + this.efsConfig.onSubmit.toString().trim()
      )();

      fn.call(this, formCtx, tableCtx);
    },
    closeDialog(field) {
      console.log(field);
      this.$emit("closeDialog", field);
    },
    openDialog(field, row, type) {
      this.$emit("openDialog", field, row, type);
    },
    handleTable(data, total) {
      this.$emit("handleTable", data, total);
    },
  },
};
</script>

<style>
.low-code-container {
  background: #fff;
  padding: 5px;
}
</style>
