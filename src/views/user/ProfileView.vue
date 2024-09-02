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
                    <el-form-item label="年龄">
                        <el-input-number v-model="user.age" :min="0" :max="100"
                            :disabled="!isEditing"></el-input-number>
                    </el-form-item>
                    <el-form-item label="身高(cm)">
                        <el-input-number v-model="user.height" :min="0" :max="300"
                            :disabled="!isEditing"></el-input-number>
                    </el-form-item>
                    <el-form-item label="体重(kg)">
                        <el-input-number v-model="user.weight" :min="0" :max="300"
                            :disabled="!isEditing"></el-input-number>
                    </el-form-item>
                    <el-form-item label="性别" prop="gender">
                        <el-radio-group v-model="user.gender" :disabled="!isEditing">
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
import { ref, onMounted } from 'vue';
import Header from '../../components/Header.vue';
import Footer from '../../components/Footer.vue';
import { useAuthStore } from '@/stores/auth';
import { ElMessage } from 'element-plus';

// 使用 ref 创建状态变量
const authStore = useAuthStore();
const isEditing = ref(false);

// 用户数据
const user = ref({
    username: '',
    age: 0,
    height: 0,
    weight: 0,
    gender: '0',
});

// 表单验证规则
const rules = {
    username: [
        { required: true, message: '用户名不能为空', trigger: 'blur' },
        { pattern: /^[^\s!@#$%^&*()_+=[\]{};':"\\|,.<>/?]*$/, message: '用户名不能包含空白字符或特殊符号', trigger: 'blur' }
    ],
    gender: [
        { required: true, message: '性别不能为空', trigger: 'change' }
    ]
};

// 获取表单引用
const formRef = ref<any>(null);

// 在页面加载时自动获取用户信息
onMounted(async () => {
    try {
        // await authStore.fetchUser();
        user.value = {
            username: '测试用户',
            age: 30,
            height: 175,
            weight: 70,
            gender: '0', // 默认性别（用字符串）
        };
    } catch (error) {
        console.error('加载用户信息失败', error);
    }
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
                ElMessage.success('修改成功');
                console.log(user.value);
            } catch (error) {
                ElMessage.error('修改失败');
            }
        } else {
            ElMessage.error('格式错误，请修正输入信息');
        }
    });
};

// 取消编辑
const cancelEdit = () => {
    // 取消编辑，重置数据
    isEditing.value = false;
    // 重新获取或重置用户数据
    user.value = {
        username: '测试用户',
        age: 30,
        height: 175,
        weight: 70,
        gender: '0', // 默认性别（用字符串）
    };
};

</script>

<style scoped>
.user-info-form {
    max-width: 400px;
    margin: 20px auto;
}
</style>
