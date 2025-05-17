<template>
  <div class="error-page">
    <div class="error-content">
      <div class="error-animation">
        <div class="error-code">404</div>
        <div class="error-illustration">
          <div class="circle"></div>
          <div class="circle"></div>
          <div class="circle"></div>
        </div>
      </div>
      <div class="error-message">
        <h1>页面未找到</h1>
        <p>抱歉，您访问的页面不存在或已被移除</p>
      </div>
      <div class="error-actions">
        <el-button 
          type="primary" 
          @click="goBack" 
          class="back-button"
          icon="el-icon-back"
        >
          返回上一页
        </el-button>
        <el-button 
          @click="goHome" 
          class="home-button"
          icon="el-icon-s-home"
        >
          返回首页
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "404",
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    goHome() {
      this.$router.push('/');
    }
  }
};
</script>

<style scoped>
.error-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
  padding: 20px;
}

.error-content {
  text-align: center;
  max-width: 600px;
  padding: 40px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.5s ease;
}

.error-animation {
  position: relative;
  margin-bottom: 40px;
}

.error-code {
  font-size: 120px;
  font-weight: 800;
  background: linear-gradient(45deg, #1a237e, #0d47a1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 20px;
  animation: float 3s ease-in-out infinite;
}

.error-illustration {
  position: relative;
  height: 100px;
  margin: 20px 0;
}

.circle {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(45deg, #1a237e, #0d47a1);
  opacity: 0.1;
  animation: pulse 2s ease-in-out infinite;
}

.circle:nth-child(1) {
  width: 60px;
  height: 60px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  animation-delay: 0s;
}

.circle:nth-child(2) {
  width: 80px;
  height: 80px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  animation-delay: 0.3s;
}

.circle:nth-child(3) {
  width: 100px;
  height: 100px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  animation-delay: 0.6s;
}

.error-message {
  margin-bottom: 30px;
}

.error-message h1 {
  font-size: 24px;
  color: #1a237e;
  margin-bottom: 10px;
}

.error-message p {
  font-size: 16px;
  color: #666;
  margin: 0;
}

.error-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.back-button,
.home-button {
  padding: 12px 24px;
  font-size: 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.back-button {
  background: linear-gradient(45deg, #1a237e, #0d47a1);
  border: none;
}

.back-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(26, 35, 126, 0.2);
}

.home-button {
  border: 2px solid #1a237e;
  color: #1a237e;
}

.home-button:hover {
  background: #1a237e;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(26, 35, 126, 0.2);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.1;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0.2;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .error-content {
    padding: 20px;
  }

  .error-code {
    font-size: 80px;
  }

  .error-message h1 {
    font-size: 20px;
  }

  .error-message p {
    font-size: 14px;
  }

  .error-actions {
    flex-direction: column;
  }

  .back-button,
  .home-button {
    width: 100%;
  }
}
</style>
