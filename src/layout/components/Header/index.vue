<template>
  <div class="header-container">
    <!--折叠按钮-->
    <div class="collapse-btn" @click="collapseChange">
      <i v-if="!collapse" class="el-icon-s-fold"></i>
      <i v-else class="el-icon-s-unfold"></i>
    </div>
    <div class="logo">设备管理系统</div>
    <div class="header-right">
      <div class="header-user-con">
        <!--全屏显示-->
        <div class="btn-fullscreen" @click="handleFullScreen">
          <el-tooltip
            effect="dark"
            :content="fullscreen ? '取消全屏' : '全屏'"
            placement="bottom"
          >
            <i class="el-icon-rank"></i>
          </el-tooltip>
        </div>
        <!--消息中心-->
        <div class="btn-bell">
          <el-tooltip
            effect="dark"
            :content="message > 0 ? `有 ${message}条未读信息` : `消息中心`"
            placement="bottom"
          >
            <router-link to="/">
              <i class="el-icon-bell" style="color: rgba(0, 0, 0, 0.65)"></i>
            </router-link>
          </el-tooltip>
          <span class="btn-bell-badge" v-if="message"></span>
        </div>
        <!--用户头像-->
        <div class="user-avator">
          <img src="@/static/images/avator.jpg" alt="头像" />
        </div>
        <!--用户名下拉菜单-->
        <el-dropdown class="user-name" trigger="click" @command="handleCommand">
          <span class="el-dropdown-link"> 
            {{ username }}
            <i class="el-icon-caret-bottom"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <a
              href="https://github.com/lin-xin/vue-manage-system"
              target="_blank"
            >
              <el-dropdown-item>项目仓库</el-dropdown-item>
            </a>
            <el-dropdown-item divided command="loginout"
              >退出登录</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Header",
  data: function() {
    return {
      fullscreen: false,
      name: "afeilovehanger",
      message: 1,
      router: [],
    };
  },

  computed: {
    username() {
      let username = localStorage.getItem("username");
      return username ? username : this.name;
    }
  },
  methods: {
    // 侧边栏折叠
    collapseChange() {
      this.$emit("handle-collapse");
    },
    // 全屏事件
    handleFullScreen() {
      let element = document.documentElement;
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen();
        }
      }
      this.fullscreen = !this.fullscreen;
    },
    // 用户名下拉菜单选择事件
    handleCommand(command) {
      if (command === "loginout") {
        localStorage.removeItem("username");
        this.$router.push("/login");
      }
    }
  },
  props: {
    collapse: {
      type: Boolean
    }
  }
};
</script>

<style scoped>
.header-container {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 70px;
  font-size: 22px;
  color: rgba(0, 0, 0, 0.65);
  border-bottom: 1px solid #f4f4f4;
}
.header-container {
  background-color: #fff;
}
.collapse-btn {
  float: left;
  padding: 0 21px;
  cursor: pointer;
  line-height: 70px;
}
.header-container .logo {
  float: left;
  width: 250px;
  line-height: 70px;
}
.header-right {
  float: right;
  padding-right: 50px;
}
.header-user-con {
  display: flex;
  height: 70px;
  align-items: center;
}
.btn-fullscreen {
  transform: rotate(45deg);
  margin-right: 5px;
  font-size: 24px;
}
.btn-bell,
.btn-fullscreen {
  position: relative;
  width: 30px;
  height: 30px;
  text-align: center;
  border-radius: 15px;
  cursor: pointer;
}
.btn-bell-badge {
  position: absolute;
  right: 0;
  top: -2px;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: #f56c6c;
  color: #fff;
}
.btn-bell .el-icon-bell {
  color: #fff;
}
.user-name {
  margin-left: 10px;
}
.user-avator {
  margin-left: 20px;
}
.user-avator img {
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.el-dropdown-link {
  color: rgba(0, 0, 0, 0.65);
  cursor: pointer;
}
.el-dropdown-menu__item {
  text-align: center;
}
</style>
