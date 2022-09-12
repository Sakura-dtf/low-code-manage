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
        v-has="btn.propValue.auth"
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
    },
  },
  data() {
    return {};
  },
  directives: {
    has: {
      bind: () => {
        console.log("dsjklwsjlkj")
      },
      inserted: async (el, binding, vnode) => {
        // 获取页面按钮权限
        let that = vnode.context
        vnode.context.$nextTick(() => {
        let btnPermissions = that.$store.getters.btn;
        let AuthId = that.$store.getters.authId;
        console.log(binding, btnPermissions, AuthId , 11132);
        if (binding.value) {
          
          // 如果指令传值，获取指令参数，根据指令参数和当前登录人按钮权限做比较。
          let btn;

           console.log(btnPermissions);
          btnPermissions.forEach((item) => {
            if (binding.value == item.identificat) {
              btn = item;
            }
          });
          
          if (btn) {
            console.log(btn, String(Number(AuthId)), 12321)
            if ((btn.auth + " ").indexOf( AuthId) < 0 && AuthId !== '1') {
              el.parentNode.removeChild(el);
            }
          }
        }
        })
      },
    },
  },
  watch: {
    selectRow: {
      handler(val) {
        console.log(val, "watch");
      },
      deep: true,
    }
  },
  methods: {
    handleClick(field) {
      this.$emit("handleBtnClick", field);
    },
    handleDisabled(field) {
      let component = {};
      this.buttonData.forEach((item) => {
        if ((item.field === field)) {
          component = item;
        }
      });
      if (String(component.propValue.disabled) === "true") {
        return true;
      } else if (String(component.propValue.disabled) === "false") {
        return false;
      } else {
        if (component.propValue.disabled.includes("$selectRow")) {
          return this.evalTemplateString(component.propValue.disabled);
        }
        return false;
      }
    },
    evalTemplateString(str) {
      let res = str;
      if (str.includes("$selectRow")) {
        res = str.replace(/(\$selectRow)/g, "this.selectRow");
        try {
          if (String(eval(res)) === "true") {
            return true;
          } else if (String(eval(res)) === "false") {
            return false;
          } else {
            return false;
          }
        } catch (e) {
          return false;
        }
      }
      return false;
    },
  },
};
</script>

<style scoped>
.editBtn-content {
  display: flex;
}
</style>
