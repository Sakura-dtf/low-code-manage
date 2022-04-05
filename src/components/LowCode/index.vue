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
      ></EditButton>

      <EasyTable
        :columns="columns"
        :tableOption="tableOption"
        :pageOption="pageOption"
        :sizeChange="sizeChange"
        :tableData="tableJson"
        @handleSelectionChange="handleSelectionChange"
        style="margin: 20px 5px 5px 5px"
      ></EasyTable>
    </el-card>

    <EasyDialog
      :dialogSchema="dialogSchema"
      :dialogValue="dialogValue"
      :dialogEfsSchema="dialogEfsSchema"
      :dialogEfsValue="dialogEfsValue"
      :dialogTableColums="dialogTableColums"
      :dialogTableJson="dialogTableJson"
      @closeDialog="closeDialog"
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
  },
  methods: {
    handleBtnClick(field) {
      debugger;
      console.log("yyyyy")
      let btn;
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
        cb: (field, value) => {
          this.$emit("openDialog", {
            field,
            value,
          })
        },
      };
      fn.call(this, tableCtx, dialogCtx);
    },
    handleSelectionChange(rows) {
      this.selectRow = rows;
    },
    handlerSubmit() {
      let fn = new Function(
        "return " + this.efsConfig.submit.toString().trim()
      )();
      let formCtx = {
        formValue: this.efsValue,
        pageInfo: this.pageOption,
      };
      let tableCtx = {
        cb: () => {},
      };
      fn.call(this, formCtx, tableCtx);
    },
    closeDialog(field) {
      console.log(field);
      this.$emit("closeDialog", field);
    }
  },
};
</script>

<style>
.low-code-container {
  background: #fff;
  padding: 5px;
}
</style>
