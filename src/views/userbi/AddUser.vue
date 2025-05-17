<template>
  <div class="add-user-container">
    <el-card class="form-card">
      <div class="form-header">
        <h2>新增B站用户</h2>
        <p class="subtitle">请填写用户详细信息</p>
      </div>

      <el-form 
        :model="form" 
        :rules="rules" 
        ref="ruleForm" 
        label-width="120px"
        class="user-form"
        v-loading="loading"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="用户名" prop="name">
              <el-input 
                v-model="form.name" 
                placeholder="请输入用户名"
                prefix-icon="el-icon-user"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户ID" prop="media_id">
              <el-input 
                v-model="form.media_id" 
                placeholder="请输入用户ID"
                prefix-icon="el-icon-key"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="作者ID" prop="author_id">
              <el-input 
                v-model="form.author_id" 
                placeholder="请输入作者ID"
                prefix-icon="el-icon-user"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="媒体地址" prop="media_url">
              <el-input 
                v-model="form.media_url" 
                placeholder="请输入媒体地址（链接）"
                prefix-icon="el-icon-link"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="描述" prop="description">
          <el-input 
            type="textarea" 
            v-model="form.description" 
            placeholder="请输入描述"
            :rows="3"
          ></el-input>
        </el-form-item>

        <el-form-item label="认证信息" prop="verified_msg">
          <el-input 
            type="textarea" 
            v-model="form.verified_msg" 
            placeholder="请输入认证信息"
            :rows="2"
          ></el-input>
        </el-form-item>

        <el-form-item label="头像地址" prop="avatar_url">
          <el-input 
            v-model="form.avatar_url" 
            placeholder="请输入头像地址（链接）"
            prefix-icon="el-icon-picture"
          >
            <template slot="append">
              <el-button @click="previewAvatar">预览</el-button>
            </template>
          </el-input>
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="喜欢数量" prop="like_num">
              <el-input-number 
                v-model="form.like_num" 
                :min="0"
                controls-position="right"
                style="width: 100%"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="粉丝数量" prop="fans_num">
              <el-input-number 
                v-model="form.fans_num" 
                :min="0"
                controls-position="right"
                style="width: 100%"
              ></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="关注数量" prop="follow_num">
              <el-input-number 
                v-model="form.follow_num" 
                :min="0"
                controls-position="right"
                style="width: 100%"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="作品数量" prop="publish_num">
              <el-input-number 
                v-model="form.publish_num" 
                :min="0"
                controls-position="right"
                style="width: 100%"
              ></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>

        <div class="form-actions">
          <el-button @click="$router.push('/userBiList')">取消</el-button>
          <el-button type="primary" @click="save" :loading="loading">提交</el-button>
        </div>
      </el-form>
    </el-card>

    <!-- 头像预览对话框 -->
    <el-dialog
      title="头像预览"
      :visible.sync="previewVisible"
      width="300px"
      center
    >
      <div class="avatar-preview">
        <el-avatar 
          :size="200" 
          :src="form.avatar_url || defaultAvatar"
          @error="handleAvatarError"
        >
          <img src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"/>
        </el-avatar>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import request from "@/utils/request";

export default {
  name: 'AddUserBi',
  data() {
    return {
      loading: false,
      previewVisible: false,
      defaultAvatar: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      form: {
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
      },
      rules: {
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
        ],
        media_id: [
          { required: true, message: '请输入用户ID', trigger: 'blur' }
        ],
        author_id: [
          { required: true, message: '请输入作者ID', trigger: 'blur' }
        ],
        media_url: [
          { type: 'url', message: '请输入正确的URL地址', trigger: 'blur' }
        ],
        avatar_url: [
          { type: 'url', message: '请输入正确的URL地址', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    save() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          this.loading = true;
          request.post('/userbi/save', this.form).then(res => {
            if (res.code === '200') {
              this.$notify.success('新增成功');
              this.$refs['ruleForm'].resetFields();
              this.$router.push('/userBiList');
            } else {
              this.$notify.error(res.msg || '新增失败');
            }
          }).catch(err => {
            this.$notify.error('新增失败：' + err.message);
          }).finally(() => {
            this.loading = false;
          });
        }
      });
    },
    previewAvatar() {
      if (this.form.avatar_url) {
        this.previewVisible = true;
      } else {
        this.$notify.warning('请先输入头像地址');
      }
    },
    handleAvatarError() {
      this.form.avatar_url = this.defaultAvatar;
      this.$notify.warning('头像加载失败，已使用默认头像');
    }
  }
}
</script>

<style scoped>
.add-user-container {
  padding: 20px;
  background-color: #f0f2f5;
  min-height: calc(100vh - 64px);
}

.form-card {
  max-width: 1200px;
  margin: 0 auto;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.form-header {
  margin-bottom: 30px;
  text-align: center;
}

.form-header h2 {
  margin: 0;
  font-size: 24px;
  color: #1a237e;
}

.subtitle {
  margin: 10px 0 0;
  color: #666;
  font-size: 14px;
}

.user-form {
  padding: 20px;
}

.form-actions {
  margin-top: 40px;
  text-align: center;
}

.avatar-preview {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .add-user-container {
    padding: 10px;
  }

  .el-form-item {
    margin-bottom: 20px;
  }

  .el-col {
    width: 100%;
  }
}

/* 动画效果 */
.form-card {
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

