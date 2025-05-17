<template>
  <div class="app-container">
    <!-- 头部区域 -->
    <div class="header">
      <div class="logo-container">
        <img src="@/assets/logo.png" alt="" class="logo">
        <span class="system-title">互联网身份图谱系统MetaID</span>
      </div>
      <div class="user-info">
        <el-dropdown size="medium" trigger="click">
          <span class="el-dropdown-link">
            <el-avatar :size="32" :src="admin.avatar || defaultAvatar"></el-avatar>
            <span class="username">{{admin.username}}</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <div class="dropdown-item" @click="logout">
                <i class="el-icon-switch-button"></i>
                退出登录
              </div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

    <!--侧边栏和主体 -->
    <div class="main-container">
      <!--侧边栏导航-->
      <div class="sidebar">
        <el-menu 
          :default-active="$route.path" 
          router 
          class="el-menu-vertical"
          background-color="#001529"
          text-color="#fff"
          active-text-color="#409EFF">
          <el-menu-item index="/">
            <i class="el-icon-s-home"></i>
            <span slot="title">首页</span>
          </el-menu-item>

          <el-submenu index="user">
            <template slot="title">
              <i class="el-icon-user"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item index="/adduser">用户添加</el-menu-item>
            <el-menu-item index="/userList">用户列表</el-menu-item>
            <el-menu-item index="/relationList">关系列表</el-menu-item>
          </el-submenu>

          <el-submenu index="userbi">
            <template slot="title">
              <i class="el-icon-bilibili">
                <img src="https://www.bilibili.com/favicon.ico" alt="哔哩哔哩" style="width: 20px; height: 20px;">
              </i>
              <span>bilibili</span>
            </template>
            <el-menu-item index="/addbiuser">用户添加</el-menu-item>
            <el-menu-item index="/userBiList">用户列表</el-menu-item>
          </el-submenu>

          <el-submenu index="userdou">
            <template slot="title">
              <i class="el-icon-douyin">
                <img src="https://www.douyin.com/favicon.ico" alt="抖音" style="width: 20px; height: 20px;">
              </i>
              <span>抖音</span>
            </template>
            <el-menu-item index="/adddouuser">用户添加</el-menu-item>
            <el-menu-item index="/userDouList">用户列表</el-menu-item>
          </el-submenu>

          <el-submenu index="usertik">
            <template slot="title">
              <i class="el-icon-tiktok">
                <img src="https://www.tiktok.com/favicon.ico" alt="tiktok" style="width: 20px; height: 20px;">
              </i>
              <span>TikTok</span>
            </template>
            <el-menu-item index="/addtikuser">用户添加</el-menu-item>
            <el-menu-item index="/userTikList">用户列表</el-menu-item>
          </el-submenu>

          <el-submenu index="userface">
            <template slot="title">
              <i class="el-icon-facebook">
                <img src="https://www.facebook.com/favicon.ico" alt="facebook" style="width: 20px; height: 20px;">
              </i>
              <span>FaceBook</span>
            </template>
            <el-menu-item index="/addfaceuser">用户添加</el-menu-item>
            <el-menu-item index="/userFaceList">用户列表</el-menu-item>
          </el-submenu>

          <el-submenu index="usertie">
            <template slot="title">
              <i class="el-icon-tieba">
                <img src="https://www.baidu.com/favicon.ico" alt="baidu" style="width: 20px; height: 20px;">
              </i>
              <span>贴吧</span>
            </template>
            <el-menu-item index="/addtieuser">用户添加</el-menu-item>
            <el-menu-item index="/userTieList">用户列表</el-menu-item>
          </el-submenu>

          <el-submenu index="userlinkedin">
            <template slot="title">
              <i class="el-icon-linkin">
                <img src="https://www.linkedin.com/favicon.ico" alt="Linkedin" style="width: 20px; height: 20px;">
              </i>
              <span>Linkedin</span>
            </template>
            <el-menu-item index="/addlinkuser">用户添加</el-menu-item>
            <el-menu-item index="/userLinkList">用户列表</el-menu-item>
          </el-submenu>

          <el-submenu index="userweibo">
            <template slot="title">
              <i class="el-icon-weibo">
                <img src="https://www.weibo.com/favicon.ico" alt="Weibo" style="width: 20px; height: 20px;">
              </i>
              <span>微博</span>
            </template>
            <el-menu-item index="/addweiuser">用户添加</el-menu-item>
            <el-menu-item index="/userWeiList">用户列表</el-menu-item>
          </el-submenu>

          <el-submenu index="usertwitter">
            <template slot="title">
              <i class="el-icon-twitter">
                <img src="https://twitter.com/favicon.ico" alt="Twitter" style="width: 20px; height: 20px;">
              </i>
              <span>Twitter</span>
            </template>
            <el-menu-item index="/addtwitteruser">用户添加</el-menu-item>
            <el-menu-item index="/userTwitterList">用户列表</el-menu-item>
          </el-submenu>

          <el-submenu index="admin">
            <template slot="title">
              <i class="el-icon-user"></i>
              <span>管理员管理</span>
            </template>
            <el-menu-item index="/addAdmin">管理员添加</el-menu-item>
            <el-menu-item index="/adminList">管理员列表</el-menu-item>
          </el-submenu>

          <el-submenu index="category">
            <template slot="title">
              <i class="el-icon-s-operation"></i>
              <span>分类管理</span>
            </template>
            <el-menu-item index="/addCategory">分类添加</el-menu-item>
            <el-menu-item index="/CategoryList">分类列表</el-menu-item>
          </el-submenu>

          <el-submenu index="media">
            <template slot="title">
              <i class="el-icon-s-operation"></i>
              <span>媒体用户管理</span>
            </template>
            <el-menu-item index="/addMedia">用户添加</el-menu-item>
            <el-menu-item index="/MediaList">用户列表</el-menu-item>
          </el-submenu>
        </el-menu>
      </div>
      
      <!--主体数据-->
      <div class="main-content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script>
import Cookies from "js-cookie";

export default {
  name: "Layout",
  data() {
    return {
      admin: Cookies.get('admin') ? JSON.parse(Cookies.get('admin')) : {},
      defaultAvatar: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
    }
  },
  methods: {
    logout() {
      this.$confirm('确认退出登录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Cookies.remove('admin')
        this.$router.push('/login')
        this.$message.success('已安全退出')
      }).catch(() => {})
    }
  }
}
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  background-color: #f0f2f5;
}

.header {
  height: 64px;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.logo-container {
  display: flex;
  align-items: center;
}

.logo {
  width: 40px;
  height: 40px;
  margin-right: 12px;
}

.system-title {
  font-size: 20px;
  font-weight: 600;
  color: #001529;
}

.user-info {
  display: flex;
  align-items: center;
}

.el-dropdown-link {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.username {
  margin: 0 8px;
  color: #001529;
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: 8px 16px;
}

.dropdown-item i {
  margin-right: 8px;
}

.main-container {
  display: flex;
  margin-top: 64px;
  min-height: calc(100vh - 64px);
}

.sidebar {
  width: 240px;
  background: #001529;
  transition: width 0.3s;
  position: fixed;
  left: 0;
  top: 64px;
  bottom: 0;
  overflow-y: auto;
}

.main-content {
  flex: 1;
  margin-left: 240px;
  padding: 24px;
  transition: margin-left 0.3s;
}

.el-menu-vertical {
  border-right: none;
}

.el-menu-vertical:not(.el-menu--collapse) {
  width: 240px;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
}
</style>