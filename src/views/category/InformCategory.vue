<template>
  <div class="user-info-container">
    <!-- 上半部分 -->
    <div class="user-info-top">
      <!-- 用户头像 -->
      <div class="avatar">
        <img :src=" 'https://via.placeholder.com/150'" alt="用户头像" />
      </div>
      <!-- 用户详细信息 -->
      <div class="user-details">
        <p><strong>用户名：</strong>{{ form.username }}</p>
        <p><strong>邮箱：</strong>{{ form.email }}</p>
        <p><strong>手机号：</strong>{{ form.phone }}</p>
        <el-button type="primary" @click="goBack">返回</el-button>
      </div>
    </div>

    <!-- 下半部分 -->
    <div class="user-info-bottom">
      <p>下半部分留着有用...</p>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";

export default {
  name: 'InformCategory',
  data() {
    return {
      form: {
        username: '',
        email: '',
        phone: '',
      }
    }
  },
  created() {
    const id = this.$route.query.id;
    request.get(`/admin/${id}`)
        .then(res => {
          console.log("接口返回数据：", res.data);
          this.form = res.data; // 确保 data 结构和 `form` 绑定一致
        })
        .catch(error => {
          console.error("数据请求失败：", error);
        });
  }
};
</script>

<style scoped>
.user-info-container {
  padding: 20px;
  font-family: Arial, sans-serif;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.user-info-top {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.avatar img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #ddd;
}

.user-details {
  flex: 1;
}

.user-details p {
  margin: 5px 0;
  font-size: 16px;
}

.user-info-bottom {
  text-align: center;
  padding: 20px;
  border-top: 1px solid #ddd;
  font-size: 16px;
  color: #666;
}
</style>
