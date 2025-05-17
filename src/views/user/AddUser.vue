<template>
  <div class="add-user-container">
    <el-card class="form-card">
      <div class="form-header">
        <h2>新增用户</h2>
        <p class="subtitle">请填写用户详细信息</p>
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
            <el-form-item label="用户名" prop="name">
              <el-input 
                v-model="form.name" 
                placeholder="请输入用户名"
                prefix-icon="el-icon-user"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别" prop="sex">
              <el-radio-group v-model="form.sex">
                <el-radio label="男">
                  <i class="el-icon-male"></i> 男
                </el-radio>
                <el-radio label="女">
                  <i class="el-icon-female"></i> 女
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input 
                v-model="form.email" 
                placeholder="请输入邮箱"
                prefix-icon="el-icon-message"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号" prop="phone">
              <el-input 
                v-model="form.phone" 
                placeholder="请输入手机号"
                prefix-icon="el-icon-phone"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="出生日期" prop="birthday">
              <el-date-picker
                v-model="form.birthday"
                type="date"
                placeholder="选择出生日期"
                style="width: 100%"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="IP地址" prop="ip_city">
              <el-input 
                v-model="form.ip_city" 
                placeholder="请输入IP地址"
                prefix-icon="el-icon-location"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="住址" prop="address">
              <el-input 
                v-model="form.address" 
                placeholder="请输入住址"
                prefix-icon="el-icon-house"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工作地址" prop="work">
              <el-input 
                v-model="form.work" 
                placeholder="请输入工作地址"
                prefix-icon="el-icon-office-building"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="QQ" prop="QQ">
              <el-input 
                v-model="form.QQ" 
                placeholder="请输入QQ"
                prefix-icon="el-icon-chat-dot-round"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="微信" prop="WeChat">
              <el-input 
                v-model="form.WeChat" 
                placeholder="请输入微信"
                prefix-icon="el-icon-chat-line-round"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="微博简介" prop="Introduction">
          <el-input 
            v-model="form.Introduction" 
            type="textarea"
            :rows="3"
            placeholder="请输入微博简介"
          ></el-input>
        </el-form-item>

        <el-form-item label="相关联系" prop="relatives">
          <el-input 
            v-model="form.relatives" 
            placeholder="请输入关联号"
            prefix-icon="el-icon-connection"
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
          <el-button @click="resetForm" class="reset-button">
            <i class="el-icon-refresh"></i> 重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import request from "@/utils/request";

export default {
  name: 'AddUser',
  data() {
    const checkPhone = (rule, value, callback) => {
      if (!value) {
        callback();
      } else if (!/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(value)) {
        callback(new Error('请输入合法的手机号'));
      } else {
        callback();
      }
    };

    const checkEmail = (rule, value, callback) => {
      if (!value) {
        callback();
      } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
        callback(new Error('请输入合法的邮箱地址'));
      } else {
        callback();
      }
    };

    return {
      loading: false,
      form: {
        sex: '男',
        name: '',
        email: '',
        address: '',
        ip_city: '',
        work: '',
        QQ: '',
        WeChat: '',
        Introduction: '',
        birthday: '',
        phone: '',
        relatives: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        email: [
          { validator: checkEmail, trigger: 'blur' }
        ],
        phone: [
          { validator: checkPhone, trigger: 'blur' }
        ],
        birthday: [
          { required: true, message: '请选择出生日期', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    save() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          this.loading = true;
          request.post('/user/save', this.form).then(res => {
            if (res.code === '200') {
              this.$notify({
                title: '成功',
                message: '新增用户成功',
                type: 'success',
                duration: 2000
              });
              this.resetForm();
            } else {
              this.$notify.error(res.msg);
            }
          }).finally(() => {
            this.loading = false;
          });
        }
      });
    },
    resetForm() {
      this.$refs['ruleForm'].resetFields();
      this.form = {
        sex: '男',
        name: '',
        email: '',
        address: '',
        ip_city: '',
        work: '',
        QQ: '',
        WeChat: '',
        Introduction: '',
        birthday: '',
        phone: '',
        relatives: ''
      };
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

.reset-button {
  margin-left: 16px;
  padding: 12px 36px;
  font-size: 16px;
  border-radius: 8px;
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

