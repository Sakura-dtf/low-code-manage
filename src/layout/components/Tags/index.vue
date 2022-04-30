<template>
  <div class="tags-container" v-if="showTags">
    <el-tabs
      v-model="tagValue"
      type="card"
      closable
      @tab-remove="removeTab"
      style="height: 30px"
    >
      <el-tab-pane
        :key="item.name"
        v-for="(item, index) in tagsList"
        :label="item.title"
        :name="item.name"
      >
        <span slot="label"
          ><i class="el-icon-location"></i> {{ item.title }}</span
        >
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: "Tags",
  data: function () {
    return {
      tagsList: [],
      tagValue: "",
    };
  },
  watch: {
    $route: {
      handler: function(newValue) {
        this.setTags(newValue);
        console.log(newValue, "value");
      },
      deep: true,
    },
    tagValue(val) {
      this.goToPath(val);
    },
  },
  mounted() {
    this.setTags(this.$route);
  },
  methods: {
    async goToPath(val) {
      for (let i = 0; i <= this.tagsList.length; i++) {
        if (this.tagsList[i].name === val) {
          await this.$router.push(this.tagsList[i].path);
          break;
        }
      }
    },
    setTags(route) {
      const isExist = this.tagsList.some((item) => {
        return item.path === route.fullPath;
      });

      if (!isExist) {
        if (this.tagsList.length >= 8) {
          this.tagsList.shift();
        }
        if (route.matched[1]) {
          console.log({
            title: route.meta.title,
            path: route.fullPath,
            name: route.name,
          });
          this.tagsList.push({
            title: route.meta.title,
            path: route.fullPath,
            name: route.name,
          });
        }
        this.tagValue = this.tagsList[this.tagsList.length - 1].name;
      } else {
        this.tagValue = route.name;
      }
      
    },

    removeTab(val) {
      for (let i = 0; i <= this.tagsList.length; i++) {
        if (this.tagsList[i].name === val) {
          let delItem = this.tagsList.splice(i, 1);
          if (this.tagsList.length) {
            // this.$router.push(this.tagsList[this.tagsList.length - 1].path);
            this.tagValue = this.tagsList[this.tagsList.length - 1].name;
          } else {
            let path = this.$route.path.split("/");
            path[3] = "dashboard";
            this.$router.push(path.join("/"));
          }
          break;
        }
      }
    },
  },
  computed: {
    showTags() {
      return this.tagsList.length > 0;
    },
  },
};
</script>

<style>
.el-tabs--card > .el-tabs__header {
  border-bottom: 1px solid #f4f4f4;
}

.el-tabs--card > .el-tabs__header .el-tabs__nav {
  border: 1px solid #f4f4f4 !important;
  border-top: none !important;
  border-radius: 0 !important;
}
.el-tabs--top.el-tabs--card > .el-tabs__header .el-tabs__item {
  height: 35px !important;
  line-height: 35px !important;
}
</style>
