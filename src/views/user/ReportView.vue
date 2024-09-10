<template>
    <div class="common-layout">
        <el-container>
            <el-header>
                <Header />
            </el-header>
            <el-main>
                <div class="main">
                    <h2 style="margin-bottom: 30px;">我的历史报告</h2>

                    <div class="table">
                        <el-table :data="tableData" border style="width: 60%;">
                            <el-table-column prop="id" label="报告ID" width="180" />
                            <el-table-column prop="sportsType" label="运动类型" width="180" />
                            <el-table-column prop="date" label="报告日期" />
                            <el-table-column label="查看报告">
                                <template v-slot="scope">
                                    <el-button type="primary" link @click="showReport(scope.row.id)">查看报告</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-pagination background layout="prev, pager, next" :total="total" :current-page="currentPage"
                            :page-size="pageSize" @current-change="handlePageChange" />
                    </div>
                </div>
            </el-main>
            <el-footer>
                <Footer />
            </el-footer>
        </el-container>
    </div>

    <div class="modal hidden">
        <button class="close-modal" @click="closeModal">&times;</button>
        <p>报告ID: {{ report.id }}</p>
        <p>运动类型: {{ report.sportsType }}</p>
        <p>报告内容: {{ report.content }}</p>
        <p>报告日期: {{ report.date }}</p>
    </div>
    <div class="overlay hidden"></div>
</template>


<script lang="ts" setup>
import Header from '../../components/Header.vue';
import Footer from '../../components/Footer.vue';
import { onMounted, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import axios from 'axios';
import { ElMessage } from 'element-plus';

const authStore = useAuthStore();

// 分页相关状态
const currentPage = ref(1);
const pageSize = ref(10); // 每页显示的条数
const total = ref(0); // 数据总数

const tableData = ref<Array<{
    id: number;
    sportsType: string;
    date: string;
    url: string;
}>>([]);

const report = ref({
    id: '',
    sportsType: '',
    content: '',
    date: ''
});

// 获取分页数据
const fetchTableData = async (page = 1) => {
    if (!authStore.token) return;
    try {
        const response = await axios.post('/api/user/reports', {
            headers: {
                Authorization: `Bearer ${authStore.token.value}`,
            },
            params: {
                page: page,
                pageSize: pageSize.value,
            },
        });

        tableData.value = response.data.data;
        total.value = response.data.total; // 从响应中获取总条目数
    } catch (error) {
        console.error('加载用户信息失败', error);
        ElMessage.error('加载用户信息失败');
    }
};

// 页面加载时获取数据
onMounted(() => {
    fetchTableData(currentPage.value);
});

const showReport = async (id) => {
    try {
        const response = await axios.get(`/api/report/${id}`, {
            headers: {
                Authorization: `Bearer ${authStore.token.value}`,
            },
        });
        report.value = response.data.data;

        document.querySelector('.modal').classList.remove('hidden');
        document.querySelector('.overlay').classList.remove('hidden');
    } catch (error) {
        ElMessage.error('获取报告失败');
    }
};

// 处理分页切换
const handlePageChange = (page) => {
    currentPage.value = page;
    fetchTableData(page);
};

const closeModal = () => {
    document.querySelector('.modal').classList.add('hidden');
    document.querySelector('.overlay').classList.add('hidden');
};


</script>

<style scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: inherit;
}

html {
    font-size: 62.5%;
    box-sizing: border-box;
}

body {
    font-family: sans-serif;
    color: #333;
    line-height: 1.5;
    height: 100vh;
    position: relative;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    background: linear-gradient(to top left, #28b487, #7dd56f);
}

.el-main {
    min-height: 80vh;
}

.show-modal {
    font-size: 2rem;
    font-weight: 600;
    padding: 1.75rem 3.5rem;
    margin: 5rem 2rem;
    border: none;
    background-color: aqua;
    color: #444;
    border-radius: 10rem;
    cursor: pointer;
}

.close-modal {
    position: absolute;
    top: 1.2rem;
    right: 2rem;
    font-size: 5rem;
    color: #333;
    cursor: pointer;
    border: none;
    background: none;
}

h1 {
    font-size: 2.5rem;
    margin-bottom: 2rem;
}

p {
    font-size: 1.8rem;
}

.hidden {
    display: none;
}

.modal {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 70%;

    background-color: white;
    padding: 6rem;
    border-radius: 5px;
    box-shadow: 0 3rem 5rem rgba(0, 0, 0, 0.3);
    z-index: 10;
}

.overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(3px);
    z-index: 5;
}

.main {
    padding: 30px 180px;
}

.table {
    display: flex;
    flex-direction: column;
    /* 让表格和分页垂直排列 */
    align-items: center;
    /* 水平居中 */
    justify-content: center;
    width: 100%;
    margin: 0 auto;
}

.el-table {
    margin-bottom: 20px;
    /* 添加表格与分页之间的间距 */
}
</style>
