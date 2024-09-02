<template>
  <div class="login-container">
    <div class="left-side">
      <h1>运动姿态评估系统</h1>
      <div style="text-align:left">
        这是专业运动姿态评估工具。无论您是职业运动员、教练，还是健身爱好者，我们都致力于通过科学的姿态分析，帮助您更好地了解身体状况，优化训练效果。立即登录，开启您的精准评估之旅，让您的每一步都更有成效！
      </div>
    </div>

    <div class="right-side">
      <h1>账号登录</h1>
      <div class="form-container">
        <el-input class="input1" v-model="userPhoneNumber" style="max-width: 600px" placeholder="手机号"></el-input>
        <el-input class="input1" v-model="password" style="max-width: 600px" placeholder="密码" type="password"
          show-password required></el-input>

        <el-button style="max-width: 600px" class="input1" type="primary" @click="handleLogin">登录</el-button>
        <br />
        <el-link href="/signup" class="signup">注册</el-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useAuthStore } from '../stores/auth';

const userPhoneNumber = ref('');
const password = ref('');

const authStore = useAuthStore();

const handleLogin = async () => {
  if (!userPhoneNumber.value || !password.value) {
    ElMessage.error('用户名和密码不能为空');
    return;
  }

  try {
    await authStore.login(userPhoneNumber.value, password.value);
    ElMessage.success('登录成功');
  } catch (error) {
    ElMessage.error(error.message || '登录失败');
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: space-between;

  max-width: 900px;
  height: 450px;
  margin: 100px auto;
  border: 1px solid #ccc;
  background: orange;
}

.login-container .left-side {
  width: 50%;
  padding: 20px;
  background-image: url(../assets/sport.jpg);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  color: black;
  text-align: center;
}

.login-container .right-side {
  width: 50%;
  background-color: whitesmoke;
  padding: 20px;
  text-align: center;
  color: #484747;
}

.input1 {
  margin: 20px 0;
  width: 300px;
  height: 40px;
}
</style>
