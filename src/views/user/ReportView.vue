<template>
    <div class="common-layout">
        <el-container>
            <el-header>
                <Header />
            </el-header>
            <el-main>
                <div class="main">
                    <h3>我的历史报告</h3>

                    <el-table :data="tableData" border style="width: 60%;">
                        <el-table-column prop="id" label="报告ID" width="180" />
                        <el-table-column prop="sportsType" label="运动类型" width="180" />
                        <el-table-column prop="date" label="报告日期" />
                        <el-table-column label="查看报告">
                            <template v-slot="scope">
                                <el-link :href="scope.row.url" target="_blank">查看</el-link>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-main>
            <el-footer>
                <Footer />
            </el-footer>
        </el-container>
    </div>
</template>

<script lang="ts" setup>
import Header from '../../components/Header.vue'
import Footer from '../../components/Footer.vue'
import { onMounted, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import axios from 'axios';

const authStore = useAuthStore();

// 使用 ref 创建一个响应式 tableData
const tableData = ref<Array<{
    id: number;
    sportsType: string;
    date: string;
    url: string;
}>>([]);

onMounted(async () => {
    if (!authStore.token) return;
    try {
        // await authStore.fetchUser();
        // 请求报告数据
        const response = await axios.get(`/api/user`, {
            headers: {
                Authorization: `Bearer ${authStore.token.value}`,
            },
        });
        tableData.value = response.data.data;
    } catch (error) {
        console.error('加载用户信息失败', error);
    }
});

</script>

<style scoped>
.main {
    padding: 0 80px;
}
</style>
