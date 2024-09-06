<template>
    <div class="user-profile">
        <el-container>
            <el-header>
                <Header />
            </el-header>
            <el-main>
                <el-form :model="user" :rules="rules" ref="formRef" label-width="100px" class="user-info-form">
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="user.username" :disabled="!isEditing"></el-input>
                    </el-form-item>
                    <el-form-item label="电话号码" prop="phoneNumber">
                        <el-input v-model="user.userPhoneNumber" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="年龄">
                        <el-input-number v-model="user.userAge" :min="0" :max="100"
                            :disabled="!isEditing"></el-input-number>
                    </el-form-item>
                    <el-form-item label="身高(cm)">
                        <el-input-number v-model="user.userHeight" :min="0" :max="300"
                            :disabled="!isEditing"></el-input-number>
                    </el-form-item>
                    <el-form-item label="体重(kg)">
                        <el-input-number v-model="user.userWeight" :min="0" :max="300"
                            :disabled="!isEditing"></el-input-number>
                    </el-form-item>
                    <el-form-item label="性别">
                        <el-radio-group v-model="user.userGender" :disabled="!isEditing">
                            <el-radio value="0">男</el-radio>
                            <el-radio value="1">女</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item>
                        <el-button v-if="!isEditing" type="primary" @click="isEditing = true">编辑</el-button>
                        <el-button v-if="isEditing" type="success" @click="saveChanges">保存</el-button>
                        <el-button v-if="isEditing" @click="cancelEdit">取消</el-button>
                    </el-form-item>
                </el-form>
            </el-main>
            <el-footer>
                <Footer />
            </el-footer>
        </el-container>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive } from 'vue';
import Header from '../../components/Header.vue';
import Footer from '../../components/Footer.vue';
import { useAuthStore } from '@/stores/auth';
import { ElMessage } from 'element-plus';

// 使用 ref 创建状态变量
const authStore = useAuthStore();
const isEditing = ref(false);

const user = ref({
    userID: 0,
    username: '张三',
    userPhoneNumber: '12345',
    userAge: 0,
    userHeight: 0,
    userWeight: 0,
    userGender: '0',
})

// 表单验证规则
const rules = {
    username: [
        { required: true, message: '用户名不能为空', trigger: 'blur' },
        { pattern: /^[^\s!@#$%^&*()_+=[\]{};':"\\|,.<>/?]*$/, message: '用户名不能包含空白字符或特殊符号', trigger: 'blur' }
    ],
    phoneNumber: [
        { required: true, message: '电话号码不能为空', trigger: 'blur' },
    ],
};

// 获取表单引用
const formRef = ref<any>(null);

// 在页面加载时自动获取用户信息
onMounted(() => {

    user.value = authStore.user;
    isEditing.value = false;

});

// 保存修改
const saveChanges = async () => {
    if (!formRef.value) {
        console.error('表单引用为空');
        return;
    }

    formRef.value.validate(async (valid: boolean) => {
        if (valid) {
            try {
                await authStore.updateUser(user.value);
                isEditing.value = false;
            } catch (error) {
                ElMessage.error('修改失败');
            }
        } else {
            ElMessage.error('格式错误，请修正输入信息');
        }
    });
};

// 取消编辑
const cancelEdit = async () => {
    // 重新获取或重置用户数据
    try {
        await authStore.fetchUser();
        user.value = authStore.user;
        isEditing.value = false;
    } catch (error) {
        console.error('加载用户信息失败', error);
        ElMessage.error('加载信息失败，请重新登录');
        authStore.logout();
    }
};

</script>

<style scoped>
.user-info-form {
    max-width: 400px;
    margin: 20px auto;
}
</style>
