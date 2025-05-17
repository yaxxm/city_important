<template>
  <div class="user-dashboard">
    <!-- 顶部统计卡片 -->
    <div class="stat-cards">
      <el-card shadow="hover" class="stat-card">
        <div class="stat-content">
          <i class="el-icon-user-solid stat-icon"></i>
          <div class="stat-info">
            <div class="stat-value">{{ total }}</div>
            <div class="stat-label">总用户数</div>
          </div>
        </div>
      </el-card>
      <el-card shadow="hover" class="stat-card">
        <div class="stat-content">
          <i class="el-icon-star-on stat-icon"></i>
          <div class="stat-info">
            <div class="stat-value">{{ verifiedCount }}</div>
            <div class="stat-label">认证用户</div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 搜索和操作区域 -->
    <el-card class="search-card" shadow="hover">
      <div class="search-header">
        <h3>用户管理</h3>
        <el-button type="primary" icon="el-icon-plus" @click="$router.push('/adddouuser')">添加用户</el-button>
      </div>
      
      <el-form :inline="true" :model="params" class="search-form">
        <el-form-item>
          <el-input
            v-model="params.name"
            placeholder="搜索用户名"
            prefix-icon="el-icon-search"
            clearable
            @clear="load"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="params.author_id"
            placeholder="搜索作者ID"
            prefix-icon="el-icon-key"
            clearable
            @clear="load"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" @click="load" :loading="loading">搜索</el-button>
            <el-button @click="reset">重置</el-button>
          </el-button-group>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格区域 -->
    <el-card class="table-card" shadow="hover">
      <el-table
        :data="tableData"
        v-loading="loading"
        border
        stripe
        style="width: 100%"
        :header-cell-style="{
          background: '#f5f7fa',
          color: '#606266',
          fontWeight: 'bold'
        }"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="table-expand">
              <el-form-item label="描述">
                <span>{{ props.row.description || '暂无描述' }}</span>
              </el-form-item>
              <el-form-item label="认证信息">
                <el-tag :type="props.row.verified_msg ? 'success' : 'info'" size="small">
                  {{ props.row.verified_msg || '未认证' }}
                </el-tag>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>

        <el-table-column prop="id" label="ID" width="60" align="center"></el-table-column>
        
        <el-table-column label="用户信息" min-width="200">
          <template slot-scope="scope">
            <div class="user-info">
              <el-avatar
                :size="40"
                :src="scope.row.avatar_url || defaultAvatar"
                @error="handleImageError(scope)"
              ></el-avatar>
              <div class="user-details">
                <div class="username">{{ scope.row.name }}</div>
                <div class="author-id">ID: {{ scope.row.author_id }}</div>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="200" fixed="right" align="center">
          <template slot-scope="scope">
            <div class="action-buttons">
              <el-tooltip content="编辑用户" placement="top" :enterable="false">
                <el-button
                  class="action-button edit"
                  type="text"
                  @click="$router.push('/editDouUser?id=' + scope.row.id)"
                >
                  <i class="el-icon-edit"></i>
                </el-button>
              </el-tooltip>
              <el-tooltip content="查看详情" placement="top" :enterable="false">
                <el-button
                  class="action-button view"
                  type="text"
                  @click="$router.push('/informDouUser?id=' + scope.row.id)"
                >
                  <i class="el-icon-view"></i>
                </el-button>
              </el-tooltip>
              <el-tooltip content="删除用户" placement="top" :enterable="false">
                <el-popconfirm
                  title="确定要删除该用户吗？"
                  @confirm="del(scope.row.id)"
                  confirm-button-text="确定"
                  cancel-button-text="取消"
                  icon="el-icon-warning"
                  icon-color="#F56C6C"
                >
                  <el-button
                    class="action-button delete"
                    type="text"
                    slot="reference"
                  >
                    <i class="el-icon-delete"></i>
                  </el-button>
                </el-popconfirm>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          background
          :current-page="params.pageNum"
          :page-size="params.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import request from "@/utils/request";

export default {
  name: 'UserDou',
  data() {
    return {
      loading: false,
      tableData: [],
      defaultAvatar: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      total: 0,
      verifiedCount: 0,
      params: {
        pageNum: 1,
        pageSize: 10,
        name: '',
        author_id: ''
      }
    }
  },
  created() {
    this.load()
  },
  methods: {
    load() {
      this.loading = true
      request.get('/userdou/page', {
        params: this.params
      }).then(res => {
        if(res.code === '200') {
          this.tableData = res.data.list
          this.total = res.data.total
          // 计算认证用户数量
          this.verifiedCount = this.tableData.filter(user => user.verified_msg).length
        } else {
          this.$message.error(res.msg || '加载失败')
        }
      }).catch(() => {
        this.$message.error('加载失败')
      }).finally(() => {
        this.loading = false
      })
    },
    reset() {
      this.params = {
        pageNum: 1,
        pageSize: 10,
        name: '',
        author_id: ''
      }
      this.load()
    },
    handleImageError(scope) {
      scope.row.avatar_url = this.defaultAvatar
      this.$message.warning('头像加载失败，已使用默认头像')
    },
    handleSizeChange(val) {
      this.params.pageSize = val
      this.load()
    },
    handleCurrentChange(val) {
      this.params.pageNum = val
      this.load()
    },
    del(id) {
      request.delete("/userdou/delete/" + id).then(res => {
        if(res.code === '200') {
          this.$message.success('删除成功')
          this.load()
        } else {
          this.$message.error(res.msg || '删除失败')
        }
      }).catch(() => {
        this.$message.error('删除失败')
      })
    }
  }
}
</script>

<style scoped>
.user-dashboard {
  padding: 20px;
  background-color: #f0f2f5;
  min-height: calc(100vh - 60px);
}

.stat-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.stat-card {
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-content {
  display: flex;
  align-items: center;
  padding: 10px;
}

.stat-icon {
  font-size: 48px;
  color: #409EFF;
  margin-right: 20px;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}

.stat-label {
  font-size: 14px;
  color: #909399;
}

.search-card {
  margin-bottom: 20px;
}

.search-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-header h3 {
  margin: 0;
  color: #303133;
}

.search-form {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.table-card {
  margin-bottom: 20px;
}

.table-expand {
  padding: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.username {
  font-weight: bold;
  color: #303133;
}

.author-id {
  font-size: 12px;
  color: #909399;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.action-button {
  position: relative;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  overflow: hidden;
}

.action-button.edit {
  color: #409EFF;
}

.action-button.view {
  color: #67C23A;
}

.action-button.delete {
  color: #F56C6C;
}

.action-button.edit:hover {
  background-color: rgba(64, 158, 255, 0.1);
}

.action-button.view:hover {
  background-color: rgba(103, 194, 58, 0.1);
}

.action-button.delete:hover {
  background-color: rgba(245, 108, 108, 0.1);
}

/* 添加波纹效果 */
.action-button::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 5px;
  height: 5px;
  background: rgba(255, 255, 255, 0.5);
  opacity: 0;
  border-radius: 100%;
  transform: scale(1, 1) translate(-50%);
  transform-origin: 50% 50%;
}

.action-button:active::after {
  animation: ripple 0.6s ease-out;
}

@keyframes ripple {
  0% {
    transform: scale(0, 0);
    opacity: 0.5;
  }
  100% {
    transform: scale(20, 20);
    opacity: 0;
  }
}

/* 响应式调整 */
@media screen and (max-width: 768px) {
  .user-dashboard {
    padding: 10px;
  }

  .stat-cards {
    grid-template-columns: 1fr;
  }

  .search-header {
    flex-direction: column;
    gap: 10px;
  }

  .search-form {
    flex-direction: column;
  }

  .search-form .el-form-item {
    margin-right: 0;
    width: 100%;
  }

  .search-form .el-input {
    width: 100%;
  }

  .action-buttons {
    gap: 4px;
  }
  
  .action-button {
    width: 28px;
    height: 28px;
  }
  
  .action-button i {
    font-size: 14px;
  }
}
</style>