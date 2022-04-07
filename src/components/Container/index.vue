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
      :dialogEfsSchema="dialogEfsSchema"
      :dialogEfsValue="dialogEfsValue"
      :dialogTableColums="dialogTableColums"
      :dialogTableJson="dialogTableJson"
      @openDialog="openDialog"
      @closeDialog="closeDialog"
    />
  </div>
</template>

<script>
import LowCode from "@/components/LowCode";
import { searchWebConfigById } from "@/api/http.js";
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
    };
  },
  watch: {
    $route: {
      async handler(val) {
        debugger;
        if (val.meta.id) {

          const data = await searchWebConfigById(val.meta.id);

          this.efsSchema = JSON.parse(data.efsSchema);
          this.efsValue = JSON.parse(data.formValue);
          this.efsConfig = JSON.parse(data.efsConfig);

          this.buttonData = JSON.parse(data.buttonData);

          this.columns = JSON.parse(data.tableSchema);
          this.pageOption = JSON.parse(data.pageOption);
          this.sizeChange = JSON.parse(data.pageOption).sizeChange;

          this.dialogSchema = JSON.parse(data.dialogData);
          this.dialogValue = JSON.parse(data.dialogValue);
          this.dialogEfsSchema = JSON.parse(data.dialogEfsSchema);
          this.dialogEfsValue = JSON.parse(data.dialogEfsValue);
          this.dialogTableColums = JSON.parse(data.dialogTableColums);
        }
      },
      immediate: true,
      deep: true,
    },
  },
  async created() {},
  methods: {
    handleEFSChange(val) {
      this.model = val;
    },
    openDialog({ field, value }) {
      console.log(field, value);
      this.dialogValue[field] = true;
    },
    closeDialog(field) {
      this.dialogValue[field] = false;
    },
  },
};
</script>

<style></style>
