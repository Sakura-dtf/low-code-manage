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
import { searchWebConfigById } from '@/api/http.js';
export default {
  components: {
    LowCode,
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
      tableJson: [
      ],
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
  async created() {
    const data = await searchWebConfigById("1");
    console.log(data);
    this.efsSchema = JSON.parse(data.efsSchema);

    console.log(this.efsSchema, "schema 1")

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

    this.hanldeUrl();
  },
  methods: {
    handleEFSChange(val) {
      this.model = val;
    },
    openDialog({field, value}) {
      console.log(field, value);
      this.dialogValue[field] = true;
    },
    closeDialog(field) {
      this.dialogValue[field] = false;
    },
    hanldeUrl() {
      console.log(this.efsSchema, "schema")
    },
  },
};
</script>

<style></style>
