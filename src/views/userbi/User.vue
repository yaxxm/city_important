<template>
  <div class="user-container">
    <!-- 搜索区域 -->
    <el-card class="search-card">
      <div class="search-header">
        <h2>B站用户管理</h2>
        <p class="subtitle">搜索和管理B站用户信息</p>
      </div>
      <el-form :inline="true" :model="params" class="search-form">
        <el-form-item>
          <el-input
            v-model="params.name"
            placeholder="请输入用户名"
            prefix-icon="el-icon-user"
            clearable
            @keyup.enter.native="load"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="params.media_id"
            placeholder="请输入用户ID"
            prefix-icon="el-icon-key"
            clearable
            @keyup.enter.native="load"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="load" :loading="loading">
            <i class="el-icon-search"></i> 搜索
          </el-button>
          <el-button @click="reset">
            <i class="el-icon-refresh"></i> 重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格区域 -->
    <el-card class="table-card">
      <div class="table-header">
        <el-button type="primary" @click="$router.push('/addBiUser')" icon="el-icon-plus">
          新增用户
        </el-button>
      </div>
      
      <el-table 
        :data="tableData" 
        stripe 
        v-loading="loading"
        border
        style="width: 100%"
      >
        <el-table-column prop="id" label="编号" width="80" align="center"></el-table-column>
        <el-table-column label="头像" width="100" align="center">
          <template v-slot="scope">
            <el-avatar
              :size="50"
              :src="scope.row.avatar_url || defaultAvatar"
              @error="handleImageError(scope)"
            >
              <img :src="defaultAvatar"/>
            </el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="用户名" min-width="120">
          <template v-slot="scope">
            <div class="user-name">
              <span>{{ scope.row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="media_id" label="用户ID" min-width="120"></el-table-column>
        <el-table-column prop="description" label="描述" min-width="200">
          <template v-slot="scope">
            <el-tooltip 
              :content="scope.row.description" 
              placement="top" 
              :disabled="!scope.row.description"
            >
              <span class="description-text">{{ scope.row.description }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250" fixed="right">
          <template v-slot="scope">
            <div class="action-buttons">
              <el-button 
                type="primary" 
                size="mini" 
                icon="el-icon-edit"
                @click="$router.push('/editBiUser?id=' + scope.row.id)"
              >
                编辑
              </el-button>
              <el-button 
                type="success" 
                size="mini" 
                icon="el-icon-view"
                @click="$router.push('/informBiUser?id=' + scope.row.id)"
              >
                详情
              </el-button>
              <el-popconfirm
                title="确定要删除该用户吗？"
                @confirm="del(scope.row.id)"
                confirm-button-text="确定"
                cancel-button-text="取消"
                icon="el-icon-warning"
                icon-color="red"
              >
                <el-button 
                  type="danger" 
                  size="mini" 
                  icon="el-icon-delete"
                  slot="reference"
                >
                  删除
                </el-button>
              </el-popconfirm>
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
          layout="total, prev, pager, next, jumper"
          :total="total"
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
  name: 'UserBi',
  data() {
    return {
      loading: false,
      tableData: [],
      defaultAvatar: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      total: 0,
      params: {
        pageNum: 1,
        pageSize: 10,
        name: '',
        media_id: ''
      }
    }
  },
  created() {
    this.load()
  },
  methods: {
    load() {
      this.loading = true;
      request.get('/userbi/page', {
        params: this.params
      }).then(res => {
        if (res.code === '200') {
          this.tableData = res.data.list;
          this.total = res.data.total;
        } else {
          this.$notify.error(res.msg || '加载数据失败');
        }
      }).catch(err => {
        this.$notify.error('加载数据失败：' + err.message);
      }).finally(() => {
        this.loading = false;
      });
    },
    reset() {
      this.params = {
        pageNum: 1,
        pageSize: 10,
        name: '',
        media_id: ''
      };
      this.load();
    },
    handleCurrentChange(pageNum) {
      this.params.pageNum = pageNum;
      this.load();
    },
    handleImageError(scope) {
      scope.row.avatar_url = this.defaultAvatar;
    },
    del(id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request.delete("/userbi/delete/" + id).then(res => {
          if (res.code === '200') {
            this.$notify.success('删除成功');
            this.load();
          } else {
            this.$notify.error(res.msg || '删除失败');
          }
        }).catch(err => {
          this.$notify.error('删除失败：' + err.message);
        });
      }).catch(() => {
        this.$notify.info('已取消删除');
      });
    }
  }
}
</script>

<style scoped>
.user-container {
  padding: 20px;
  background-color: #f0f2f5;
  min-height: calc(100vh - 64px);
}

.search-card {
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.search-header {
  margin-bottom: 20px;
  text-align: center;
}

.search-header h2 {
  margin: 0;
  font-size: 24px;
  color: #1a237e;
}

.subtitle {
  margin: 10px 0 0;
  color: #666;
  font-size: 14px;
}

.search-form {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
}

.table-card {
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.table-header {
  margin-bottom: 20px;
  display: flex;
  justify-content: flex-end;
}

.user-name {
  font-weight: 500;
  color: #1a237e;
}

.description-text {
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .user-container {
    padding: 10px;
  }

  .search-form {
    flex-direction: column;
  }

  .el-form-item {
    margin-bottom: 10px;
    width: 100%;
  }

  .el-input {
    width: 100% !important;
  }

  .action-buttons {
    flex-direction: column;
  }

  .action-buttons .el-button {
    margin-left: 0 !important;
    margin-bottom: 5px;
  }
}

/* 动画效果 */
.search-card,
.table-card {
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