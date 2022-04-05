<template>
  <div class="dialog-container">
    <template v-for="dialog in dialogSchema">
      <template>
        <el-dialog
          :title="dialog.propValue.title"
          :key="dialog.field"
          :visible.sync="dialogValue[dialog.field]"
          :width="dialog.propValue.width"
          append-to-body
        >
          <template v-if="dialog.tag === 'el-dialog-efs'">
            <el-form-schema
              ref="editEfs"
              :schema="dialogEfsSchema[dialog.field]"
              v-model="dialogEfsValue[dialog.field]"
              :dialogField="dialog.field"
              :isDialogEfs="true"
            >
            </el-form-schema>
          </template>
          <template v-if="dialog.tag === 'el-dialog-table'">
            <EasyTable
              :columns="dialogTableColums[dialog.field]"
              :tableData="dialogTableJson[dialog.field]"
              :tableOption="{
                border: true,
              }"
              :isDialogEfs="true"
              :dialogField="dialog.field"
              :sizeChange="dialog.on.click"
            ></EasyTable>
          </template>

          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogValue[dialog.field] = false" size="small"
              >取 消</el-button
            >
            <el-button type="primary" @click="handleSubmit(dialog)" size="small"
              >确 定</el-button
            >
          </span>
        </el-dialog>
      </template>
    </template>
  </div>
</template>

<script>
import EasyTable from "../EasyTable";

export default {
  inheritAttrs: false,
  props: {
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
    }
  },
  data() {
    return {
    };
  },
  components: { EasyTable },
  methods: {
    handleSubmit(dialog) {
      let dialogValue;
      console.log(dialog);
      if(dialog.tag === "el-dialog-efs") {
        dialogValue = this.dialogEfsValue[dialog.field];
      } else if(dialog.tag === "el-dialog-table") {
        dialogValue = this.dialogTableJson[dialog.field];
      }
      let dialogCtx = {
        dialogValue
      }
      let cbs = {
        cbHttp: () => {

        },
        cbClose: () => {
          this.$emit("closeDialog", dialog.field);
        }
      }

      let formCtx = this.dialogEfsValue[dialog.field];
      let fn = new Function("return " + dialog.on.click.trim())();
      fn.call(this, dialogCtx, cbs);
      // this.$store.commit("closeDialog", dialog.field);
    },
  },
};
</script>

<style>
.mode {
  box-shadow: 0 1px 3px rgb(0 0 0 / 30%);
  background: #e0e0e0;
  margin: 20px 0;
}
.dialog-context {
  margin: 0 auto;
  min-height: 400px;
  background: #fff;
}
.dialog-title {
  line-height: 24px;
  font-size: 18px;
  color: #303133;
  padding: 20px;
}
</style>