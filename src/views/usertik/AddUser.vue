<template>
  <div class="add-user-container">
    <el-card class="form-card">
      <div class="form-header">
        <h2>新增TikTok用户</h2>
        <p class="subtitle">添加新的TikTok用户信息</p>
      </div>

      <el-form 
        :model="form" 
        :rules="rules" 
        ref="ruleForm" 
        label-width="120px"
        class="user-form"
        :validate-on-rule-change="false"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="用户名" prop="nickName">
              <el-input 
                v-model="form.nickName" 
                placeholder="请输入用户名"
                prefix-icon="el-icon-user"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户ID" prop="uid">
              <el-input 
                v-model="form.uid" 
                placeholder="请输入用户ID"
                prefix-icon="el-icon-tickets"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="唯一ID" prop="uniqueId">
              <el-input 
                v-model="form.uniqueId" 
                placeholder="请输入唯一ID"
                prefix-icon="el-icon-key"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="安全标识" prop="secUid">
              <el-input 
                v-model="form.secUid" 
                placeholder="请输入安全用户标识"
                prefix-icon="el-icon-lock"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="粉丝数" prop="fansCount">
              <el-input-number 
                v-model="form.fansCount" 
                :min="0"
                :precision="0"
                style="width: 100%"
                placeholder="请输入粉丝数"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="关注数" prop="followCount">
              <el-input-number 
                v-model="form.followCount" 
                :min="0"
                :precision="0"
                style="width: 100%"
                placeholder="请输入关注数"
              ></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="视频数" prop="videoCount">
              <el-input-number 
                v-model="form.videoCount" 
                :min="0"
                :precision="0"
                style="width: 100%"
                placeholder="请输入视频数"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="点赞数" prop="diggCount">
              <el-input-number 
                v-model="form.diggCount" 
                :min="0"
                :precision="0"
                style="width: 100%"
                placeholder="请输入点赞数"
              ></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="头像" prop="headImage">
              <el-upload
                class="avatar-uploader"
                action="/api/upload"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="form.headImage" :src="form.headImage" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-select 
                v-model="form.status" 
                placeholder="请选择状态"
                style="width: 100%"
              >
                <el-option label="正常" value="1"></el-option>
                <el-option label="禁用" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="个性签名" prop="signature">
          <el-input 
            v-model="form.signature" 
            type="textarea"
            :rows="2"
            placeholder="请输入个性签名"
          ></el-input>
        </el-form-item>

        <el-form-item label="描述" prop="description">
          <el-input 
            v-model="form.description" 
            type="textarea"
            :rows="3"
            placeholder="请输入描述"
          ></el-input>
        </el-form-item>

        <el-form-item label="认证信息" prop="verified">
          <el-input 
            v-model="form.verified" 
            type="textarea"
            :rows="2"
            placeholder="请输入认证信息"
          ></el-input>
        </el-form-item>

        <el-form-item class="form-buttons">
          <el-button 
            type="primary" 
            @click="save" 
            :loading="loading"
            class="submit-button"
          >
            <i class="el-icon-check"></i> 提交
          </el-button>
          <el-button @click="goBack" class="back-button">
            <i class="el-icon-back"></i> 返回列表
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import request from "@/utils/request";

export default {
  name: 'AddUserTik',
  data() {
    return {
      loading: false,
      form: {
        fansCount: 0,
        followCount: 0,
        videoCount: 0,
        diggCount: 0,
        status: '1'
      },
      rules: {
        nickName: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
        ],
        uid: [
          { required: true, message: '请输入用户ID', trigger: 'blur' }
        ],
        uniqueId: [
          { required: true, message: '请输入唯一ID', trigger: 'blur' }
        ],
        secUid: [
          { required: true, message: '请输入安全用户标识', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    save() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          this.loading = true;
          request.post('/usertik/save', this.form).then(res => {
            if (res.code === '200') {
              this.$notify({
                title: '成功',
                message: '用户添加成功',
                type: 'success',
                duration: 2000
              });
              this.$refs['ruleForm'].resetFields();
              this.$router.push('/userTikList');
            } else {
              this.$notify.error(res.msg);
            }
          }).finally(() => {
            this.loading = false;
          });
        }
      });
    },
    goBack() {
      this.$router.push('/userTikList');
    },
    handleAvatarSuccess(res, file) {
      if (res.code === '200') {
        this.form.headImage = res.data;
        this.$notify.success('头像上传成功');
      } else {
        this.$notify.error('头像上传失败');
      }
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$notify.error('上传头像图片只能是 JPG/PNG 格式!');
      }
      if (!isLt2M) {
        this.$notify.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
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
  font-size: 24px;
  color: #1a237e;
  margin: 0 0 8px 0;
}

.subtitle {
  color: #666;
  margin: 0;
  font-size: 14px;
}

.user-form {
  padding: 20px;
}

.user-form :deep(.el-form-item__label) {
  font-weight: 500;
  color: #1a237e;
}

.user-form :deep(.el-input__inner) {
  border-radius: 8px;
}

.user-form :deep(.el-textarea__inner) {
  border-radius: 8px;
}

.form-buttons {
  text-align: center;
  margin-top: 40px;
}

.submit-button {
  background: linear-gradient(45deg, #1a237e, #0d47a1);
  border: none;
  padding: 12px 36px;
  font-size: 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.submit-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(26, 35, 126, 0.2);
}

.back-button {
  margin-left: 16px;
  padding: 12px 36px;
  font-size: 16px;
  border-radius: 8px;
}

.avatar-uploader {
  text-align: center;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s;
}

.avatar-uploader .el-upload:hover {
  border-color: #1a237e;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}

.avatar {
  width: 100px;
  height: 100px;
  display: block;
  object-fit: cover;
  border-radius: 6px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .add-user-container {
    padding: 10px;
  }

  .user-form {
    padding: 10px;
  }

  .el-col {
    width: 100% !important;
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

