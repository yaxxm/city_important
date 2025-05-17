<template>
  <div class="user-container">
    <!-- 搜索区域 -->
    <el-card class="search-card">
      <div class="search-header">
        <h2>用户管理</h2>
        <p class="subtitle">管理系统用户信息</p>
      </div>
      <div class="search-form">
        <el-input
          v-model="params.name"
          placeholder="请输入名称"
          prefix-icon="el-icon-user"
          class="search-input"
          clearable
        ></el-input>
        <el-input
          v-model="params.phone"
          placeholder="请输入联系方式"
          prefix-icon="el-icon-phone"
          class="search-input"
          clearable
        ></el-input>
        <el-button type="primary" @click="load" class="search-button">
          <i class="el-icon-search"></i>搜索
        </el-button>
        <el-button @click="reset" class="reset-button">
          <i class="el-icon-refresh"></i>重置
        </el-button>
      </div>
    </el-card>

    <!-- 表格区域 -->
    <el-card class="table-card">
      <el-table 
        :data="tableData" 
        stripe 
        border
        v-loading="loading"
        class="user-table"
      >
        <el-table-column prop="id" label="编号" width="80" align="center"></el-table-column>
        <el-table-column prop="name" label="用户名" width="120" align="center"></el-table-column>
        <el-table-column prop="username" label="用户卡号" width="150" align="center"></el-table-column>
        <el-table-column prop="sex" label="性别" width="80" align="center">
          <template v-slot="scope">
            <el-tag :type="scope.row.sex === '男' ? 'primary' : 'success'" size="small">
              {{ scope.row.sex }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="email" label="邮箱" min-width="180" align="center"></el-table-column>
        <el-table-column prop="address" label="住址" min-width="200" align="center"></el-table-column>
        <el-table-column prop="createtime" label="创建时间" width="160" align="center"></el-table-column>
        <el-table-column prop="updatetime" label="更新时间" width="160" align="center"></el-table-column>
        <el-table-column label="操作" width="200" fixed="right" align="center">
          <template v-slot="scope">
            <div class="operation-buttons">
              <el-tooltip content="编辑用户" placement="top">
                <el-button 
                  type="primary" 
                  size="small" 
                  icon="el-icon-edit"
                  @click="$router.push('/editUser?id=' + scope.row.id)"
                  circle
                ></el-button>
              </el-tooltip>
              <el-tooltip content="查看详情" placement="top">
                <el-button 
                  type="success" 
                  size="small" 
                  icon="el-icon-view"
                  @click="$router.push('/informUser?id=' + scope.row.id)"
                  circle
                ></el-button>
              </el-tooltip>
              <el-popconfirm
                title="确定要删除该用户吗？"
                confirm-button-text="确定"
                cancel-button-text="取消"
                icon="el-icon-warning"
                icon-color="red"
                @confirm="del(scope.row.id)"
              >
                <template #reference>
                  <el-tooltip content="删除用户" placement="top">
                    <el-button 
                      type="danger" 
                      size="small" 
                      icon="el-icon-delete"
                      circle
                    ></el-button>
                  </el-tooltip>
                </template>
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
          class="pagination"
        >
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import request from "@/utils/request";

export default {
  name: 'User',
  data() {
    return {
      loading: false,
      tableData: [],
      total: 0,
      params: {
        pageNum: 1,
        pageSize: 10,
        name: '',
        phone: ''
      }
    }
  },
  created() {
    this.load()
  },
  methods: {
    load() {
      this.loading = true;
      request.get('/user/page', {
        params: this.params
      }).then(res => {
        if(res.code === '200') {
          this.tableData = res.data.list;
          this.total = res.data.total;
        }
      }).finally(() => {
        this.loading = false;
      });
    },
    reset() {
      this.params = {
        pageNum: 1,
        pageSize: 10,
        name: '',
        phone: ''
      };
      this.load();
    },
    handleCurrentChange(pageNum) {
      this.params.pageNum = pageNum;
      this.load();
    },
    del(id) {
      request.delete("/user/delete/" + id).then(res => {
        if(res.code === '200') {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          });
          this.load();
        } else {
          this.$notify.error(res.msg);
        }
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
}

.search-header h2 {
  font-size: 24px;
  color: #1a237e;
  margin: 0 0 8px 0;
}

.subtitle {
  color: #666;
  margin: 0;
  font-size: 14px;
}

.search-form {
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
}

.search-input {
  width: 240px;
}

.search-input :deep(.el-input__inner) {
  border-radius: 8px;
}

.search-button {
  background: linear-gradient(45deg, #1a237e, #0d47a1);
  border: none;
  padding: 0 24px;
  height: 40px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.search-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(26, 35, 126, 0.2);
}

.reset-button {
  height: 40px;
  border-radius: 8px;
  padding: 0 24px;
}

.table-card {
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.user-table {
  width: 100%;
  margin-bottom: 20px;
}

.user-table :deep(th) {
  background-color: #f5f7fa !important;
  color: #1a237e;
  font-weight: 600;
}

.operation-buttons {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.pagination {
  padding: 20px 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .user-container {
    padding: 10px;
  }

  .search-form {
    flex-direction: column;
    align-items: stretch;
  }

  .search-input {
    width: 100%;
  }

  .search-button,
  .reset-button {
    width: 100%;
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