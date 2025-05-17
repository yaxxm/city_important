<template>
  <div class="login-container">
    <div class="login-background">
      <div class="shape shape1"></div>
      <div class="shape shape2"></div>
      <div class="shape shape3"></div>
    </div>
    
    <el-card class="cover" v-if="loginAdmin.id">
      <slide-verify
          :l="42"
          :r="10"
          :w="310"
          :h="155"
          :accuracy="5"
          :imgs="imgs"
          slider-text="向右滑动"
          @success="onSuccess"
          @fail="onFail"
          @refresh="onRefresh"
      ></slide-verify>
    </el-card>

    <div class="login-box">
      <div class="login-header">
        <img src="@/assets/logo.png" alt="Logo" class="logo">
        <h1>互联网身份图谱系统</h1>
        <p class="subtitle">MetaID - 您的身份管理专家</p>
      </div>

      <el-form :model="admin" ref="loginForm" class="login-form" :rules="rules">
        <el-form-item prop="username">
          <el-input
              placeholder="请输入账号"
              prefix-icon="el-icon-user"
              size="large"
              v-model="admin.username"
              class="custom-input"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
              placeholder="请输入密码"
              prefix-icon="el-icon-lock"
              size="large"
              v-model="admin.password"
              show-password
              class="custom-input"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
              class="login-button"
              size="large"
              type="primary"
              @click="login"
              :loading="loading"
          >
            <span v-if="!loading">登 录</span>
            <span v-else>登录中...</span>
          </el-button>
        </el-form-item>
        <div class="login-footer">
          <a href="#" class="footer-link">忘记密码？</a>
          <span class="divider">|</span>
          <a href="#" class="footer-link">注册账号</a>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";
import Cookies from 'js-cookie';

export default {
  name: "Login",
  data() {
    return {
      loading: false,
      loginAdmin:{},
      imgs: [
        "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Flmg.jj20.com%2Fup%2Fallimg%2F1114%2F0406210Z024%2F2104060Z024-11-1200.jpg&refer=http%3A%2F%2Flmg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1668050452&t=a8eeec2f6f7b4aff883b85ee2276ea4d",
        "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Flmg.jj20.com%2Fup%2Fallimg%2F1114%2F121420113514%2F201214113514-6-1200.jpg&refer=http%3A%2F%2Flmg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1668047974&t=0545a1395151b9e52e3ae13d4c1f3a9d",
        "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Flmg.jj20.com%2Fup%2Fallimg%2F1114%2F033021091503%2F210330091503-6-1200.jpg&refer=http%3A%2F%2Flmg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1668050510&t=b07c3793fe21bd8cb17e2490a11b664d",
        "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Flmg.jj20.com%2Fup%2Fallimg%2F1114%2F041621122252%2F210416122252-1-1200.jpg&refer=http%3A%2F%2Flmg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1668050503&t=63bbb5a9c3ac56b66f20240b63e98f34",
      ],
      admin: {},
      rules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
        ]
      }
    };
  },
  methods: {
    login() {
      this.$refs["loginForm"].validate((valid) => {
        if(valid){
          this.loading = true;
          request.post("admin/login", this.admin).then((res) => {
            if (res.code === "200") {
              this.loginAdmin = res.data;
            } else {
              this.$notify.error(res.msg);
            }
          }).finally(() => {
            this.loading = false;
          });
        }
      });
    },
    onSuccess() {
      Cookies.set('admin', JSON.stringify(this.loginAdmin));
      this.$router.push('/');
      this.$notify.success("登录成功");
    },
    onFail() {
      this.$notify.error("验证失败，请重试");
    },
    onRefresh() {
      console.log('refresh');
    }
  }
};
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #1a237e, #0d47a1);
  position: relative;
  overflow: hidden;
}

.login-background {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.shape {
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 50%;
  animation: float 6s ease-in-out infinite;
}

.shape1 {
  width: 300px;
  height: 300px;
  top: -150px;
  left: -150px;
  animation-delay: 0s;
}

.shape2 {
  width: 200px;
  height: 200px;
  top: 50%;
  right: -100px;
  animation-delay: 2s;
}

.shape3 {
  width: 150px;
  height: 150px;
  bottom: -75px;
  left: 50%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(5deg);
  }
}

.cover {
  width: fit-content;
  background-color: white;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.login-box {
  width: 420px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  z-index: 2;
  animation: fadeIn 0.8s ease;
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.logo {
  width: 80px;
  height: 80px;
  margin-bottom: 16px;
  animation: pulse 2s infinite;
}

.login-header h1 {
  font-size: 28px;
  font-weight: 600;
  color: #1a237e;
  margin-bottom: 8px;
}

.subtitle {
  font-size: 16px;
  color: #666;
  margin: 0;
}

.login-form {
  margin-top: 30px;
}

.custom-input :deep(.el-input__inner) {
  height: 50px;
  border-radius: 25px;
  padding-left: 20px;
  background: #f5f7fa;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.custom-input :deep(.el-input__inner:focus) {
  background: #fff;
  border-color: #1a237e;
  box-shadow: 0 0 0 3px rgba(26, 35, 126, 0.1);
}

.custom-input :deep(.el-input__prefix) {
  left: 15px;
}

.login-button {
  width: 100%;
  height: 50px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(45deg, #1a237e, #0d47a1);
  border: none;
  margin-top: 20px;
  transition: all 0.3s ease;
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(26, 35, 126, 0.3);
}

.login-footer {
  text-align: center;
  margin-top: 30px;
  color: #666;
}

.footer-link {
  color: #1a237e;
  text-decoration: none;
  font-size: 14px;
  transition: all 0.3s ease;
}

.footer-link:hover {
  color: #0d47a1;
  text-decoration: underline;
}

.divider {
  margin: 0 10px;
  color: #ddd;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

/* 响应式设计 */
@media (max-width: 480px) {
  .login-box {
    width: 90%;
    padding: 30px 20px;
  }
  
  .login-header h1 {
    font-size: 24px;
  }
  
  .subtitle {
    font-size: 14px;
  }
}
</style>
