<template>
  <div>
    <LowCode
      :efsSchema="efsSchema"
      :efsValue="efsValue"
      :efsConfig="efsConfig"
      @handleEFSChange="handleEFSChange"
      :buttonData="buttonData"
      :columns="columns"
      :tableOption="tableOption"
      :pageOption="pageOption"
      :tableJson="tableJson"
      :dialogSchema="dialogSchema"
      :dialogValue="dialogValue"
      :dialogComponentData="dialogComponentData"
      :dialogEfsSchema="dialogEfsSchema"
      :dialogEfsValue="dialogEfsValue"
      :dialogTableColums="dialogTableColums"
      :dialogTableJson="dialogTableJson"
      @openDialog="openDialog"
      @closeDialog="closeDialog"
      @handleTable="handleTable"
      ref="LowCode"
    />
  </div>
</template>

<script>
import LowCode from "@/components/LowCode";
import { searchWebConfigById, getButton } from "@/api/http.js";
import { mapGetters } from "vuex";
export default {
  props: {
    id: String,
  },
  components: {
    LowCode,
  },
  computed: {
    ...mapGetters(["projectId", "router"]),
  },
  data() {
    return {
      efsSchema: {},
      efsValue: {},
      efsConfig: {},
      buttonData: [],
      columns: [],
      tableOption: {
        border: true,
      },
      tableJson: [],
      sizeChange: "",
      pageOption: {},
      dialogSchema: [],
      dialogValue: {},
      dialogEfsSchema: {},
      dialogEfsValue: {},
      dialogTableColums: {},
      dialogTableJson: {},
      componentData: {},
      dialogComponentData: {},
    };
  },
  watch: {
    $route: {
      async handler(val) {
        if (val.meta.id) {
          this.handleButton(val.meta.routerId);
          const data = await searchWebConfigById(val.meta.id);
         
          this.componentData = JSON.parse(data.componentData);

          // this.efsSchema = JSON.parse(JSON.stringify(temp));
          this.efsValue = JSON.parse(data.formValue);
          this.efsConfig = JSON.parse(data.efsConfig);
          this.buttonData = JSON.parse(data.buttonData);
          this.columns = JSON.parse(data.tableSchema);
          this.pageOption = JSON.parse(data.pageOption);
          console.log(this.pageOption, "page");
          this.pageOption.pageSizes = this.pageOption.pageSizes.map((item) =>
            Number(item)
          );
          this.sizeChange = JSON.parse(data.pageOption).sizeChange;
          this.dialogEfsValue = JSON.parse(data.dialogEfsValue);
          this.dialogComponentData = JSON.parse(data.dialogComponentData)
          this.dialogSchema = JSON.parse(data.dialogData);
          this.dialogValue = JSON.parse(data.dialogValue);

          this.dialogEfsSchema = JSON.parse(data.dialogEfsSchema);

          this.dialogTableColums = JSON.parse(data.dialogTableColums);
          this.handlerUrl();
        }
      },
      immediate: true,
      deep: true,
    },
    componentData(formList) {
      console.log(formList, "watcj");
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
        "auth",
      ];
      const attrs = ["maxlength", "minLength", "readonly", "rows"];

      const styles = ["width", "top"];

      const timeOption = ["start", "end", "step", "selectableRange"];

      formList.forEach((item) => {
        schema[item.field] = {};

        if (typeof schema[item.field]["on"] !== "object") {
          schema[item.field]["on"] = {};
        }

        Object.keys(item.on).forEach((event) => {
          schema[item.field].on[event] = new Function(
            "return " + item.on[event].trimStart()
          )();
        });

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
                schema[item.field]["props"][key] = item.propValue[key];
              }
            } else if (key === "multiple") {
              if (item.propValue[key]) {
                this.formValue[item.field] = [];
                this.componentData.forEach((component) => {
                  if (component.field === item.field) {
                    component.default = [];
                  }
                });
                schema[item.field].default = [];
              }
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
              typeof schema[item.field]["props"]["picker-options"] !== "object"
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
                schema[item.field]["props"][key] = item.propValue[key];
              } else {
                schema[item.field]["props"]["picker-options"][key] =
                  item.propValue[key];
              }
            }
          }
        });
      });
      this.efsSchema = schema;
      this.handlerUrl();
    },
    
  },
  created() {},
  methods: {
    handleEFSChange(val) {
      this.efsValue = val;
    },
    async handleButton(id) {
      const res = await getButton({ RouterId: id });
      console.log(res);
      if (res) {
        this.$store.commit("setButton", res.data.data);
      }
    },
    openDialog(field, row, type ) {
      
      console.log(field, row, type, "type");
      if(type === "table") {
        this.dialogTableJson[field] = [row]
      } else if(type === "efs") {
        console.log(row, "efssss")
        this.dialogEfsValue[field] = row;
      }
      this.dialogValue[field] = true;
    },
    closeDialog(field) {
      this.dialogValue[field] = false;
    },
    handleTable(val, total) {
      this.tableJson = val;
      this.pageOption.pageTotal = total;
    },
    handlerUrl() {
      let fields = Object.keys(this.efsSchema);

      fields.forEach(async (item) => {
        if (this.efsSchema[item]["url"]) {
          if (this.efsSchema[item]["watchField"]) {
            if (this.efsSchema[item]["watchField"].indexOf(",") > -1) {
              let fields = this.efsSchema[item]["watchField"].split(",");
              fields.forEach((i) => {
                this.$watch(
                  `efsValue.${i}`,
                  async (val) => {
                    let data = {};
                    fields.forEach((item) => {
                      data[item] = this.efsValue[item];
                    });
                    const res = await this.$http.post(
                      this.efsSchema[item]["url"],
                      data
                    );
                    if (res.data) {
                      console.log(this.efsSchema[item]);
                      this.efsSchema[item].items = res.data;
                    }
                  },
                  {
                    immediate: true,
                  }
                );
              });
            } else {
              this.$watch(
                `efsValue.${this.efsSchema[item]["watchField"]}`,
                async (val) => {
                  let data = {};
                  data[this.efsSchema[item]["watchField"]] =
                    this.efsValue[this.efsSchema[item]["watchField"]];
                  const res = await this.$http.post(
                    this.efsSchema[item]["url"],
                    data
                  );
                  if (res.data) {
                    console.log(this.efsSchema[item]);
                    this.efsSchema[item].items = res.data;
                  }
                },
                {
                  immediate: true,
                }
              );
            }
          } else {
            //

            const res = await this.$http.post(this.efsSchema[item]["url"]);
            if (res.data) {
              this.efsSchema[item].items = res.data;
            }
          }
        }
      });
    },
  },
};
</script>

<style></style>
