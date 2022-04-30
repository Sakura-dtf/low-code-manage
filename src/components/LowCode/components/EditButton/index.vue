<template>
  <div class="editBtn-content">
    <div
      class="button-wrap"
      style="padding: 5px"
      v-for="(btn, index) in buttonData"
      :key="index"
    >
      <el-button
        v-bind="{ ...btn.propValue }"
        :disabled="handleDisabled(btn.field)"
        @click="handleClick(btn.field)"
        icon=""
      >
        {{ btn.propValue.label }}
        <i :class="`${btn.propValue.icon} el-icon--right`"></i>
      </el-button>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    buttonData: {
      type: Array,
      require: true,
    },
    selectRow: {
      type: Array,
      default: () => [],
    }
  },
  data() {
    return {};
  },

  methods: {
    handleClick(field) {
      this.$emit("handleBtnClick", field)
    },
    handleDisabled(field) {
      // let component = {};
      // this.buttonData.forEach((item) => {
      //   if ((item.field === field)) {
      //     component = item;
      //   }
      // });

      // if (String(component.propValue.disabled) === "true") {
      //   return true;
      // } else if (String(component.propValue.disabled) === "false") {
      //   return false;
      // } else {
      //   if (component.propValue.disabled.includes("$model")) {
      //     return this.evalTemplateString(component.propValue.disabled);
      //   }
      //   return false;
      // }
    },
    evalTemplateString(str) {
      // let res = str;
      // if (str.includes("$model")) {
      //   res = str.replace(/(\$model)/g, "this.formValue");
      //   try {
      //     if (String(eval(res)) === "true") {
      //       return true;
      //     } else if (String(eval(res)) === "false") {
      //       return false;
      //     } else {
      //       return false;
      //     }
      //   } catch (e) {
      //     return false;
      //   }
      // }
      // return false;
    },
  },
};
</script>

<style scoped>
.editBtn-content {
  display: flex;
}
</style>