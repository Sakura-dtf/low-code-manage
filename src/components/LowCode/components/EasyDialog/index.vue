<template>
  <div class="dialog-container">
    <template v-for="dialog in dialogSchema">
      <template>
        <el-dialog
          :title="dialog.propValue.title"
          :key="dialog.field"
          :visible.sync="dialogValue[dialog.field]"
          :width="dialog.propValue.width"
          :ref="dialog.field"
          append-to-body
        >
          <template v-if="dialog.tag === 'el-dialog-efs'">
            <el-form-schema
              :ref="'editEfs' + dialog.field"
              :schema="dialogEfsSchemaCopy[dialog.field]"
              v-model="formValue[dialog.field]"
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
    },
    dialogComponentData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      formValue: {},
      first: 1,
      dialogEfsSchemaCopy: {},
    };
  },
  created() {
    this.formValue = this.dialogEfsValue;

    this.dialogEfsSchemaCopy = JSON.parse(JSON.stringify(this.dialogEfsSchema));
  },
  watch: {
    // dialogEfsSchema(val) {
    //   console.log(val, "copy1");
    //   this.dialogEfsSchemaCopy = JSON.parse(JSON.stringify(val));
    //   if (
    //     JSON.stringify(val) !== "{}" &&
    //     JSON.stringify(this.formValue) !== "{}"
    //   ) {
    //     this.handlerUrl();
    //   }
    // },
    formValue(val) {
      if (
        JSON.stringify(this.dialogEfsSchema) !== "{}" &&
        JSON.stringify(val) !== "{}"
      ) {
        this.handlerUrl();
      }
    },
    dialogValue: {
      handler(val) {
        console.log(val, "aaa");
        this.$nextTick(() => {
          this.handlerUrl();
        });
      },
      deep: true,
    },
    dialogEfsValue: {
      handler(val, old) {
        Object.keys(val).forEach((item) => {
          let flag = true;
          Object.keys(val[item]).forEach((key) => {
            if (val[item][key]) {
              flag = false;
            }
          });
          if (!flag) {
            if (!this.formValue[item]) {
              this.formValue[item] = {};
            }
            Object.assign(this.formValue[item], val[item]);
            this.handlerUrl();
          }
        });
        console.log(this.formValue, "formValue");
      },
      deep: true,
    },
    dialogComponentData: {
      handler(val) {
        let fields = Object.keys(val);
        let schemaData = {};
        fields.forEach((field) => {
          this.dialogSchema.forEach((item) => {
            if (item.field === field) {
              if (item.id === 23) {
                const schema = {};
                const names = [
                  "items",
                  "rules",
                  "required",
                  "vif",
                  "inline",
                  "labelWidth",
                  "watchField",
                  "url",
                ];
                const props = [
                  "disabled",
                  "size",
                  "max",
                  "min",
                  "clearable",
                  "type",
                  "placeholder",
                  "show-password",
                  "labelWidth",
                  "border",
                  "is-range",
                  "format",
                  "show-word-limit",
                  "step-strictly",
                  "precision",
                  "max",
                  "min",
                  "show-all-levels",
                  "multiple",
                  "collapse-tags",
                  "checkStrictly",
                  "options",
                ];
                const attrs = ["maxlength", "minLength", "readonly", "rows"];

                const styles = ["width", "top"];

                const timeOption = ["start", "end", "step", "selectableRange"];

                val[field].forEach((item) => {
                  schema[item.field] = {};

                  schema[item.field].label = item.propValue.label;
                  schema[item.field].tag = item.tag;

                  Object.keys(item).forEach((key) => {
                    if (names.join().indexOf(key) > -1) {
                      schema[item.field][key] = item[key];
                    }
                  });

                  const keys = Object.keys(item.propValue);

                  if (typeof schema[item.field]["props"] !== "object") {
                    schema[item.field]["props"] = {};
                  }

                  if (typeof schema[item.field]["attrs"] !== "object") {
                    schema[item.field]["attrs"] = {};
                  }

                  if (typeof schema[item.field]["style"] !== "object") {
                    schema[item.field]["style"] = {};
                  }

                  let tiemFlag = false;

                  keys.forEach((key) => {
                    if (props.join().indexOf(key) > -1) {
                      if (key === "disabled") {
                        if (item.propValue[key] === "true") {
                          schema[item.field]["props"][key] = true;
                        } else if (item.propValue[key] === "false") {
                          schema[item.field]["props"][key] = false;
                        } else {
                          console.log(
                            schema[item.field]["props"][key],
                            item.propValue[key],
                            "sssss"
                          );
                          schema[item.field]["props"][key] =
                            item.propValue[key];
                          console.log(
                            schema[item.field]["props"][key],
                            item.propValue[key],
                            "sssss"
                          );
                        }
                      } else if (key === "multiple") {
                        schema[item.field]["props"][key] = item.propValue[key];
                      } else {
                        schema[item.field]["props"][key] = item.propValue[key];
                      }
                    } else if (attrs.join().indexOf(key) > -1) {
                      schema[item.field]["attrs"][key] = item.propValue[key];
                    } else if (styles.join().indexOf(key) > -1) {
                      schema[item.field]["style"][key] = item.propValue[key];
                    } else if (timeOption.join().indexOf(key) > -1) {
                      if (
                        typeof schema[item.field]["props"]["picker-options"] !==
                        "object"
                      ) {
                        schema[item.field]["props"]["picker-options"] = {};
                      }
                      if (key === "selectableRange") {
                        tiemFlag = true;
                        let obj = {};
                        obj[key] = item.propValue[key];
                        schema[item.field]["props"]["picker-options"] = obj;
                      } else if (!tiemFlag) {
                        if (key === "step" && item.id !== 5) {
                          schema[item.field]["props"][key] =
                            item.propValue[key];
                        } else {
                          schema[item.field]["props"]["picker-options"][key] =
                            item.propValue[key];
                        }
                      }
                    }
                  });
                });
                schemaData[field] = schema;
              }
            }
          });
        });
        this.dialogEfsSchemaCopy = JSON.parse(JSON.stringify(schemaData));
      },
      deep: true,
    },
  },
  components: { EasyTable },
  methods: {
    handleSubmit(dialog) {
      this.$refs["editEfs" + dialog.field][0].validate((valid) => {
        if (valid) {
          let dialogValue;
          if (dialog.tag === "el-dialog-efs") {
            dialogValue = this.dialogEfsValue[dialog.field];
          } else if (dialog.tag === "el-dialog-table") {
            dialogValue = this.dialogTableJson[dialog.field];
          }
          let dialogCtx = {
            dialogValue,
          };
          let cbs = {
            cbHttp: async (url, type) => {
              console.log(this.dialogEfsValue);
              const res = await this.$http.post(
                url,
                this.formValue[dialog.field]
              );
              if (res) {
                this.$message.success(res.data.msg);
                this.$emit("closeDialog", dialog.field);
              }
            },
            cbClose: () => {
              this.$emit("closeDialog", dialog.field);
            },
          };
          if (dialog.id === 23) {
            let formCtx = this.dialogEfsValue[dialog.field];
            let fn = new Function("return " + dialog.on.click.trim())();
            fn.call(this, dialogCtx, cbs);
          }
        }
      });
    },
    handlerUrl() {
      let keys = Object.keys(this.dialogEfsSchemaCopy);

      keys.forEach((key) => {
        console.log(key, "key");
        console.log(this.$refs[`editEfs${key}`]);
        if (this.$refs[`editEfs${key}`]) {
          let efsSchema = this.dialogEfsSchemaCopy[key];
          let fields = Object.keys(efsSchema);

          fields.forEach(async (item) => {
            if (efsSchema[item]["url"]) {
              if (efsSchema[item]["watchField"]) {
                if (efsSchema[item]["watchField"].indexOf(",") > -1) {
                  let fields = efsSchema[item]["watchField"].split(",");
                  fields.forEach((i) => {
                    this.$watch(
                      `formValue.${key}.${i}`,
                      async (val) => {
                        let data = {};
                        fields.forEach((item) => {
                          console.log(this.formValue, key);
                          data[item] = this.formValue[key][item];
                        });
                        const res = await this.$http.post(
                          efsSchema[item]["url"],
                          data
                        );
                        if (res.data) {
                          efsSchema[item].items = res.data;
                        }
                      },
                      {
                        immediate: true,
                      }
                    );
                  });
                } else {
                  this.$watch(
                    `formValue.${key}.${efsSchema[item]["watchField"]}`,
                    async (val) => {
                      let data = {};
                      data[efsSchema[item]["watchField"]] =
                        this.formValue[key][efsSchema[item]["watchField"]];
                      const res = await this.$http.post(
                        efsSchema[item]["url"],
                        data
                      );
                      if (res.data) {
                        console.log(efsSchema[item]);
                        efsSchema[item].items = res.data;
                      }
                    },
                    {
                      immediate: true,
                    }
                  );
                }
              } else {
                const res = await this.$http.post(efsSchema[item]["url"]);
                if (res.data) {
                  efsSchema[item].items = res.data;
                }
              }
            }
          });
        }
      });
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
