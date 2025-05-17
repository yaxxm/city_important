<template>
  <div class="user-info-container">
    <el-card class="user-info-card">
      <!-- 用户基本信息 -->
      <div class="user-info-header">
        <div class="user-avatar">
          <el-avatar :size="120" :src="form.headImage || 'https://via.placeholder.com/150'">
            <img src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"/>
          </el-avatar>
        </div>
        <div class="user-basic-info">
          <h2>{{ form.nickName }}</h2>
          <p class="user-id">ID: {{ form.uid }}</p>
          <p class="user-signature">{{ form.signature }}</p>
        </div>
        <div class="user-stats">
          <div class="stat-item">
            <span class="stat-value">{{ form.fansCount }}</span>
            <span class="stat-label">粉丝</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ form.followCount }}</span>
            <span class="stat-label">关注</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ form.videoCount }}</span>
            <span class="stat-label">视频</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ form.diggCount }}</span>
            <span class="stat-label">获赞</span>
          </div>
        </div>
      </div>

      <!-- 详细信息 -->
      <el-collapse v-model="activeCollapse" class="user-details">
        <el-collapse-item title="详细信息" name="1">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="唯一ID">{{ form.uniqueId }}</el-descriptions-item>
            <el-descriptions-item label="状态">
              <el-tag :type="form.status === '1' ? 'success' : 'danger'">
                {{ form.status === '1' ? '正常' : '禁用' }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="描述" :span="2">{{ form.description }}</el-descriptions-item>
            <el-descriptions-item label="认证信息" :span="2">{{ form.verified }}</el-descriptions-item>
          </el-descriptions>
        </el-collapse-item>
      </el-collapse>

      <!-- 视图切换 -->
      <div class="view-mode-switch">
        <el-radio-group v-model="viewMode" size="large">
          <el-radio-button label="table">用户列表</el-radio-button>
          <el-radio-button label="graph">知识图谱</el-radio-button>
        </el-radio-group>
      </div>

      <!-- 用户列表模式 -->
      <div v-if="viewMode === 'table'" class="table-section">
        <el-tabs type="border-card">
          <el-tab-pane label="TikTok平台">
            <el-table 
              :data="tableData" 
              stripe 
              border
              v-loading="loading"
              class="platform-table"
            >
              <el-table-column prop="nickName" label="用户名" min-width="120">
                <template v-slot="scope">
                  <div class="user-cell">
                    <el-avatar :size="30" :src="scope.row.headImage"></el-avatar>
                    <span>{{ scope.row.nickName }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="uid" label="用户ID" min-width="120"></el-table-column>
              <el-table-column prop="uniqueId" label="唯一ID" min-width="120"></el-table-column>
              <el-table-column prop="signature" label="签名" show-overflow-tooltip></el-table-column>
              <el-table-column label="操作" width="100" fixed="right">
                <template v-slot="scope">
                  <el-button
                    type="primary"
                    size="small"
                    icon="el-icon-view"
                    @click="navigateToDetail(scope.row.id)"
                  >
                    详情
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>

          <el-tab-pane label="其他平台">
            <el-table 
              :data="tableData1" 
              stripe 
              border
              v-loading="loading"
              class="platform-table"
            >
              <el-table-column prop="id" label="编号" width="80"></el-table-column>
              <el-table-column prop="name" label="用户名" min-width="120"></el-table-column>
              <el-table-column prop="username" label="用户卡号" min-width="120"></el-table-column>
              <el-table-column prop="sex" label="性别" width="80"></el-table-column>
              <el-table-column prop="email" label="邮箱" min-width="180"></el-table-column>
              <el-table-column prop="address" label="住址" show-overflow-tooltip></el-table-column>
              <el-table-column label="操作" width="100" fixed="right">
                <template v-slot="scope">
                  <el-button
                    type="primary"
                    size="small"
                    icon="el-icon-view"
                    @click="navigateToDetail1(scope.row.id)"
                  >
                    详情
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>

          <el-tab-pane label="BiliBili平台">
            <el-table 
              :data="tableDataBi" 
              stripe 
              border
              v-loading="loading"
              class="platform-table"
            >
              <el-table-column prop="id" label="编号" width="80"></el-table-column>
              <el-table-column prop="name" label="用户名" min-width="120"></el-table-column>
              <el-table-column prop="meidia_id" label="用户ID" min-width="120"></el-table-column>
              <el-table-column prop="description" label="描述" show-overflow-tooltip></el-table-column>
              <el-table-column label="操作" width="100" fixed="right">
                <template v-slot="scope">
                  <el-button
                    type="primary"
                    size="small"
                    icon="el-icon-view"
                    @click="navigateToDetailBi(scope.row.id)"
                  >
                    详情
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>

          <el-tab-pane label="抖音平台">
            <el-table 
              :data="tableDataDou" 
              stripe 
              border
              v-loading="loading"
              class="platform-table"
            >
              <el-table-column prop="name" label="用户名" min-width="120"></el-table-column>
              <el-table-column prop="author_id" label="作者ID" min-width="120"></el-table-column>
              <el-table-column prop="description" label="描述" show-overflow-tooltip></el-table-column>
              <el-table-column prop="verified_msg" label="认证信息" min-width="150" show-overflow-tooltip></el-table-column>
              <el-table-column label="操作" width="100" fixed="right">
                <template v-slot="scope">
                  <el-button
                    type="primary"
                    size="small"
                    icon="el-icon-view"
                    @click="navigateToDetailDou(scope.row.id)"
                  >
                    详情
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>

      <!-- 知识图谱模式 -->
      <div v-if="viewMode === 'graph'" class="graph-section">
        <div id="graph-container" class="graph-container"></div>
      </div>

      <!-- 返回按钮 -->
      <div class="action-buttons">
        <el-button 
          type="primary" 
          icon="el-icon-back"
          @click="goBack"
          class="back-button"
        >
          返回列表
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import request from "@/utils/request";
import neo4j from "neo4j-driver";
import cytoscape from 'cytoscape';

export default {
  name: "InformUserTik",
  data() {
    return {
      loading: false,
      activeCollapse: ['1'],
      nodenames: [],
      form: {
        nickName: "",
        uid: "",
        uniqueId: "",
        fansCount: "",
        followCount: "",
        videoCount: "",
        diggCount: "",
        signature: "",
        description: "",
        verified: "",
        status: ""
      },
      tableData: [],
      tableData1: [],
      tableDataDou: [],
      tableDataBi: [],
      total: 0,
      total1: 0,
      totaldou: 0,
      totalbi: 0,
      params: {
        pageNum: 1,
        pageSize: 1000,
        name: "",
        names: []
      },
      viewMode: "table",
      driver: null,
      session: null,
      graphData: []
    };
  },
  created() {
    this.fetchUserInfo();
  },
  watch: {
    '$route.query.id'(newId, oldId) {
      if (newId !== oldId) {
        this.fetchUserInfo();
        this.$nextTick(() => {
          this.changeViewMode("table");
        });
      }
    }
  },
  methods: {
    fetchUserInfo() {
      const id = this.$route.query.id;
      this.loading = true;
      request.get("/usertik/" + id).then(res => {
        if (res.code === '200') {
          this.form = res.data;
        } else {
          this.$notify.error(res.msg);
        }
      }).finally(() => {
        this.loading = false;
      });
    },
    handleViewModeChange(mode) {
      this.viewMode = mode;
      if (mode === 'graph') {
        this.$nextTick(() => {
          this.initGraph();
        });
      }
    },
    goBack() {
      this.$router.push('/userTikList');
    },
    navigateToDetail(id) {
      this.$router.push(`/informTikUser?id=${id}`);
    },
    navigateToDetail1(id) {
      this.$router.push(`/informUser?id=${id}`);
    },
    navigateToDetailBi(id) {
      this.$router.push(`/informBiUser?id=${id}`);
    },
    navigateToDetailDou(id) {
      this.$router.push(`/informDouUser?id=${id}`);
    }
  }
};
</script>

<style scoped>
.user-info-container {
  padding: 20px;
  background-color: #f0f2f5;
  min-height: calc(100vh - 64px);
}

.user-info-card {
  max-width: 1200px;
  margin: 0 auto;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.user-info-header {
  display: flex;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, #1a237e 0%, #0d47a1 100%);
  border-radius: 8px;
  color: white;
  margin-bottom: 20px;
}

.user-avatar {
  margin-right: 30px;
}

.user-basic-info {
  flex: 1;
}

.user-basic-info h2 {
  font-size: 24px;
  margin: 0 0 10px 0;
}

.user-id {
  font-size: 14px;
  opacity: 0.8;
  margin: 0 0 10px 0;
}

.user-signature {
  font-size: 14px;
  opacity: 0.9;
  margin: 0;
}

.user-stats {
  display: flex;
  gap: 30px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 24px;
  font-weight: bold;
}

.stat-label {
  font-size: 14px;
  opacity: 0.8;
}

.user-details {
  margin: 20px 0;
}

.view-mode-switch {
  text-align: center;
  margin: 20px 0;
}

.table-section {
  margin-top: 20px;
}

.platform-table {
  margin: 10px 0;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.graph-section {
  margin-top: 20px;
}

.graph-container {
  height: 600px;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.action-buttons {
  text-align: center;
  margin-top: 20px;
}

.back-button {
  background: linear-gradient(45deg, #1a237e, #0d47a1);
  border: none;
  padding: 12px 36px;
  font-size: 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.back-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(26, 35, 126, 0.2);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .user-info-container {
    padding: 10px;
  }

  .user-info-header {
    flex-direction: column;
    text-align: center;
  }

  .user-avatar {
    margin: 0 0 20px 0;
  }

  .user-stats {
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
  }

  .stat-item {
    width: calc(50% - 10px);
  }
}

/* 动画效果 */
.user-info-card {
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
