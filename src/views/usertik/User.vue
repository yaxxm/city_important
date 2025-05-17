<template>
  <div class="user-tik-container">
    <el-card class="search-card">
      <div class="search-header">
        <h2>TikTok用户管理</h2>
        <p class="subtitle">管理TikTok用户信息和数据</p>
      </div>
      
      <el-form :inline="true" class="search-form">
        <el-form-item>
          <el-input
            v-model="params.nickName"
            placeholder="请输入用户名"
            prefix-icon="el-icon-user"
            clearable
            @keyup.enter.native="load"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="params.uid"
            placeholder="请输入用户ID"
            prefix-icon="el-icon-tickets"
            clearable
            @keyup.enter.native="load"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button 
            type="primary" 
            @click="load"
            :loading="loading"
            class="search-button"
          >
            <i class="el-icon-search"></i> 搜索
          </el-button>
          <el-button 
            @click="reset"
            class="reset-button"
          >
            <i class="el-icon-refresh"></i> 重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="table-card">
      <el-table 
        :data="tableData" 
        stripe 
        v-loading="loading"
        border
        class="user-table"
      >
        <el-table-column prop="id" label="编号" width="80" align="center"></el-table-column>
        <el-table-column prop="headImage" label="头像" width="100" align="center">
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
        <el-table-column prop="nickName" label="用户名" width="150" show-overflow-tooltip></el-table-column>
        <el-table-column prop="uid" label="用户ID" show-overflow-tooltip></el-table-column>
        <el-table-column prop="uniqueId" label="唯一ID" width="150" show-overflow-tooltip></el-table-column>
        <el-table-column prop="signature" label="个性签名" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="250" align="center" fixed="right">
          <template v-slot="scope">
            <div class="button-group">
              <el-button 
                type="primary" 
                size="small"
                icon="el-icon-edit"
                @click="$router.push('/editTikUser?id=' + scope.row.id)"
              >
                编辑
              </el-button>
              <el-button 
                type="success" 
                size="small"
                icon="el-icon-view"
                @click="$router.push('/informTikUser?id=' + scope.row.id)"
              >
                详情
              </el-button>
              <el-popconfirm
                title="确定要删除该用户吗？"
                confirm-button-text="确定"
                cancel-button-text="取消"
                icon="el-icon-warning"
                icon-color="red"
                @confirm="del(scope.row.id)"
              >
                <el-button 
                  type="danger" 
                  size="small"
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
  name: 'UserTik',
  data() {
    return {
      loading: false,
      tableData: [],
      defaultAvatar: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      total: 0,
      params: {
        pageNum: 1,
        pageSize: 10,
        nickName: '',
        uid: ''
      }
    }
  },
  created() {
    this.load()
  },
  methods: {
    load() {
      this.loading = true;
      request.get('/usertik/page', {
        params: this.params
      }).then(res => {
        if(res.code === '200') {
          this.tableData = res.data.list;
          this.total = res.data.total;
        } else {
          this.$notify.error(res.msg);
        }
      }).finally(() => {
        this.loading = false;
      });
    },
    reset() {
      this.params = {
        pageNum: 1,
        pageSize: 10,
        nickName: '',
        uid: ''
      };
      this.load();
    },
    handleImageError(scope) {
      scope.row.avatar_url = this.defaultAvatar;
    },
    handleCurrentChange(pageNum) {
      this.params.pageNum = pageNum;
      this.load();
    },
    del(id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request.delete("/usertik/delete/" + id).then(res => {
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
      }).catch(() => {
        this.$notify({
          type: 'info',
          message: '已取消删除'
        });          
      });
    }
  }
}
</script>

<style scoped>
.user-tik-container {
  padding: 20px;
  background-color: #f0f2f5;
  min-height: calc(100vh - 64px);
}

.search-card,
.table-card {
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.search-header {
  margin-bottom: 20px;
  text-align: center;
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
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.search-button {
  background: linear-gradient(45deg, #1a237e, #0d47a1);
  border: none;
  padding: 10px 20px;
  transition: all 0.3s ease;
}

.search-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(26, 35, 126, 0.2);
}

.reset-button {
  padding: 10px 20px;
}

.user-table {
  margin: 20px 0;
}

.button-group {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.pagination {
  padding: 20px 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .user-tik-container {
    padding: 10px;
  }

  .search-form {
    flex-direction: column;
  }

  .el-form-item {
    margin-right: 0;
    width: 100%;
  }

  .el-input {
    width: 100% !important;
  }

  .button-group {
    flex-direction: column;
  }

  .el-button {
    width: 100%;
    margin-left: 0 !important;
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