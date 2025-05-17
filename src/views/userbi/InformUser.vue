<template>
  <div class="user-detail-container">
    <el-card class="detail-card">
      <div class="detail-header">
        <div class="user-info">
          <el-avatar 
            :size="100" 
            :src="userInfo.avatar_url || defaultAvatar"
            @error="handleAvatarError"
          >
            <img src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"/>
          </el-avatar>
          <div class="user-meta">
            <h2>{{ userInfo.name }}</h2>
            <p class="user-id">ID: {{ userInfo.media_id }}</p>
            <p class="user-desc">{{ userInfo.description || '暂无描述' }}</p>
          </div>
        </div>
        <div class="action-buttons">
          <el-button type="primary" icon="el-icon-edit" @click="handleEdit">编辑</el-button>
          <el-button icon="el-icon-back" @click="$router.push('/userBiList')">返回</el-button>
        </div>
      </div>

      <el-divider></el-divider>

      <el-tabs v-model="activeTab" class="detail-tabs">
        <el-tab-pane label="基本信息" name="basic">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="作者ID">{{ userInfo.author_id }}</el-descriptions-item>
            <el-descriptions-item label="媒体地址">
              <el-link type="primary" :href="userInfo.media_url" target="_blank">{{ userInfo.media_url }}</el-link>
            </el-descriptions-item>
            <el-descriptions-item label="认证信息">{{ userInfo.verified_msg || '未认证' }}</el-descriptions-item>
            <el-descriptions-item label="喜欢数量">{{ userInfo.like_num }}</el-descriptions-item>
            <el-descriptions-item label="粉丝数量">{{ userInfo.fans_num }}</el-descriptions-item>
            <el-descriptions-item label="关注数量">{{ userInfo.follow_num }}</el-descriptions-item>
            <el-descriptions-item label="作品数量">{{ userInfo.publish_num }}</el-descriptions-item>
          </el-descriptions>
        </el-tab-pane>

        <el-tab-pane label="数据统计" name="stats">
          <div class="stats-container">
            <el-row :gutter="20">
              <el-col :span="8">
                <el-card shadow="hover" class="stat-card">
                  <div class="stat-value">{{ userInfo.like_num }}</div>
                  <div class="stat-label">获赞数</div>
                </el-card>
              </el-col>
              <el-col :span="8">
                <el-card shadow="hover" class="stat-card">
                  <div class="stat-value">{{ userInfo.fans_num }}</div>
                  <div class="stat-label">粉丝数</div>
                </el-card>
              </el-col>
              <el-col :span="8">
                <el-card shadow="hover" class="stat-card">
                  <div class="stat-value">{{ userInfo.publish_num }}</div>
                  <div class="stat-label">作品数</div>
                </el-card>
              </el-col>
            </el-row>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import request from "@/utils/request";

export default {
  name: 'InformUserBi',
  data() {
    return {
      loading: false,
      activeTab: 'basic',
      defaultAvatar: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      userInfo: {
        name: '',
        media_id: '',
        author_id: '',
        media_url: '',
        description: '',
        verified_msg: '',
        avatar_url: '',
        like_num: 0,
        fans_num: 0,
        follow_num: 0,
        publish_num: 0
      }
    }
  },
  created() {
    this.loadUserData();
  },
  methods: {
    loadUserData() {
      const id = this.$route.query.id;
      if (!id) {
        this.$notify.error('未找到用户ID');
        this.$router.push('/userBiList');
        return;
      }

      this.loading = true;
      request.get("/userbi/" + id).then(res => {
        if (res.code === '200') {
          this.userInfo = res.data;
        } else {
          this.$notify.error(res.msg || '加载用户数据失败');
          this.$router.push('/userBiList');
        }
      }).catch(err => {
        this.$notify.error('加载用户数据失败：' + err.message);
        this.$router.push('/userBiList');
      }).finally(() => {
        this.loading = false;
      });
    },
    handleEdit() {
      this.$router.push({
        path: '/editUserBi',
        query: { id: this.$route.query.id }
      });
    },
    handleAvatarError() {
      this.userInfo.avatar_url = this.defaultAvatar;
      this.$notify.warning('头像加载失败，已使用默认头像');
    }
  }
}
</script>

<style scoped>
.user-detail-container {
  padding: 20px;
  background-color: #f0f2f5;
  min-height: calc(100vh - 64px);
}

.detail-card {
  max-width: 1200px;
  margin: 0 auto;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.user-info {
  display: flex;
  align-items: flex-start;
  gap: 20px;
}

.user-meta {
  flex: 1;
}

.user-meta h2 {
  margin: 0 0 10px;
  font-size: 24px;
  color: #1a237e;
}

.user-id {
  margin: 0 0 10px;
  color: #666;
  font-size: 14px;
}

.user-desc {
  margin: 0;
  color: #666;
  font-size: 14px;
  line-height: 1.5;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.detail-tabs {
  margin-top: 20px;
}

.stats-container {
  padding: 20px 0;
}

.stat-card {
  text-align: center;
  padding: 20px;
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-value {
  font-size: 36px;
  font-weight: bold;
  color: #1a237e;
  margin-bottom: 10px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .user-detail-container {
    padding: 10px;
  }

  .detail-header {
    flex-direction: column;
    gap: 20px;
  }

  .user-info {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .action-buttons {
    width: 100%;
    justify-content: center;
  }

  .el-col {
    width: 100%;
    margin-bottom: 20px;
  }
}

/* 动画效果 */
.detail-card {
  animation: slideUp 0.5s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
