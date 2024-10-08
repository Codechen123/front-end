<template>
    <div class="register-container">
        <div class="left-side">
            <h2>创建您的账号</h2>
            <p>欢迎加入运动姿态评估系统，立即注册，开启您的健康之旅！</p>
        </div>

        <div class="right-side">
            <h1>用户注册</h1>
            <div>
                <el-input class="input1" v-model="userPhoneNumber" style="max-width: 600px"
                    placeholder="手机号码"></el-input>
                <el-input class="input1" v-model="username" style="max-width: 600px" placeholder="用户名"></el-input>
                <el-input class="input1" v-model="password" style="max-width: 600px" placeholder="密码" type="password"
                    clearable required></el-input>
                <el-input class="input1" v-model="confirmPassword" style="max-width: 600px" placeholder="确认密码"
                    type="password" clearable required></el-input>
                <el-button style="max-width: 600px" class="submit" type="primary" @click="register">注册</el-button>
                <el-link href="/login" class="login">登录</el-link>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import axios from 'axios';

export default defineComponent({
    name: 'Register',
    setup() {
        const username = ref('');
        const userPhoneNumber = ref('');
        const password = ref('');
        const confirmPassword = ref('');
        const router = useRouter();

        const register = async () => {
            if (!username.value || !userPhoneNumber.value || !password.value || !confirmPassword.value) {
                ElMessage.error('所有字段都是必填项');
                return;
            }

            // 验证手机号码是否为11位数字
            const phoneRegex = /^[0-9]{11}$/;
            if (!phoneRegex.test(userPhoneNumber.value)) {
                ElMessage.error('手机号码必须为11位数字');
                return;
            }

            // 验证用户名不包含符号
            const usernameRegex = /^[a-zA-Z0-9\u4e00-\u9fa5]+$/;
            if (!usernameRegex.test(username.value)) {
                ElMessage.error('用户名不能包含符号');
                return;
            }

            // 验证密码不含空白字符
            const passwordRegex = /^\S+$/;
            if (!passwordRegex.test(password.value)) {
                ElMessage.error('密码不能包含空白字符');
                return;
            }

            if (password.value !== confirmPassword.value) {
                ElMessage.error('两次输入的密码不一致');
                return;
            }

            try {
                // 发送注册请求
                const response = await axios.post('http://192.168.69.10:5000/start/register', {
                    userPhoneNumber: userPhoneNumber.value,
                    username: username.value,
                    password: password.value,
                });

                if (response.data.code === 0) {
                    ElMessage.success('注册成功');
                    router.push('/login'); // 注册成功后跳转到登录页面
                } else {
                    ElMessage.error(response.data.message || '注册失败');
                }
            } catch (error) {
                ElMessage.error('注册过程中出现错误');
            }
        };

        return {
            username,
            userPhoneNumber,
            password,
            confirmPassword,
            register,
        };
    },
});
</script>

<style scoped>
.register-container {
    display: flex;
    justify-content: space-between;
    max-width: 800px;
    height: 500px;
    margin: 100px auto;
    border: 1px solid #ccc;
    background: orange;
}

.register-container .left-side {
    width: 50%;
    background-color: #f4f4f4;
    padding: 20px;
    background-image: url(../assets/bg2.jpg);
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    color: white;
    text-align: center;
}

.register-container .right-side {
    width: 50%;
    background-color: whitesmoke;
    padding: 20px;
    text-align: center;
    color: #484747;
}

.input1 {
    margin: 20px 0;
    width: 300px;
}

.submit {
    margin: 10px 0;
    width: 250px;
}

.login {
    margin-left: 20px;
}

h2 {
    margin: 50px auto;
}

p {
    margin: 50px 30px;
}
</style>
