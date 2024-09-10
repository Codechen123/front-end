<template>
    <div class="common-layout">
        <el-container>
            <el-header>
                <Header />
            </el-header>
            <el-main>
                <h1>静态图片评估</h1>
                <p>请上传正面和侧面两张照片</p>
                <div class="upload-card">
                    <div id="box1" class="preview-container">
                        <img v-for="(url, index) in imageUrls" :key="index" :src="url" alt="图片预览"
                            class="preview-image" />
                        <img v-for="(url, index) in uploadedImageUrls" :key="'uploaded-' + index" :src="url"
                            alt="上传后的图片" class="preview-image" />
                    </div>
                    <div id="box2" class="upload-controls">
                        <input type="file" accept="image/png, image/jpeg" @change="handleFileChange" id="fileInput"
                            multiple />
                        <label for="fileInput" class="file-label">选择图片</label>
                        <span v-if="selectedFiles.length" class="file-name">{{ selectedFiles.map(file =>
                            file.name).join(', ') }}</span>
                        <button @click="uploadImages" :disabled="selectedFiles.length !== 2"
                            class="upload-button">提交</button>
                        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
                    </div>
                </div>
            </el-main>
            <el-footer>
                <Footer />
            </el-footer>
        </el-container>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import axios from '@/stores/axios'
import Header from '../../components/Header.vue'
import Footer from '../../components/Footer.vue'
import { useAuthStore } from '@/stores/auth'
import { ElMessage } from 'element-plus'

const imageUrls = ref<string[]>([])
const uploadedImageUrls = ref<string[]>([])
const errorMessage = ref<string | null>(null)
const selectedFiles = ref<File[]>([])
const authStore = useAuthStore();

const handleFileChange = (event: Event) => {
    const fileInput = event.target as HTMLInputElement
    const files = fileInput.files
    if (files) {
        // 清除之前的数据
        imageUrls.value = []
        selectedFiles.value = []
        errorMessage.value = null

        if (files.length > 2) {
            errorMessage.value = '一次只能上传两张图片。'
            return
        }

        Array.from(files).forEach(file => {
            if (file.type === 'image/png' || file.type === 'image/jpeg') {
                imageUrls.value.push(URL.createObjectURL(file))
                selectedFiles.value.push(file)
            } else {
                errorMessage.value = '只能上传 PNG 或 JPG 格式的图片。'
            }
        })
    }
}

const uploadImages = async () => {
    if (selectedFiles.value.length !== 2) {
        errorMessage.value = '必须选择两张图片进行上传。'
        return
    }

    const formData = new FormData()
    formData.append('file1', selectedFiles.value[0])
    formData.append('file2', selectedFiles.value[1])
    formData.append('userID', authStore.user.userID)


    try {
        // 上传图片到服务器
        ElMessage.warning('正在评估，清稍等');
        const response = await axios.post('/report/shape', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })

        const baseUrl = 'http://192.168.69.10:5000';

        // 假设response.data.urls是一个包含URLs的数组
        uploadedImageUrls.value = response.data.urls.map(url => baseUrl + url);

    } catch (error) {
        errorMessage.value = '上传图片失败，请重试。'
    }
}
</script>

<style scoped>
#box1 {
    min-height: 400px;
}

/* 主容器样式 */
.upload-card {
    background-color: #f9f9f9;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    width: 95%;
    margin: 20px auto;
    text-align: center;
}

h1,
p {
    margin-left: 70px;
}

/* 预览图片样式 */
.preview-container {
    margin-bottom: 20px;
}

.preview-image {
    max-width: 42%;
    height: auto;
    border-radius: 8px;
    border: 1px solid #ddd;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin: 20px 8px;
}

/* 上传控件样式 */
.upload-controls {
    display: flex;
    flex-direction: column;
    align-items: center;
}

/* 文件选择输入框隐藏，使用自定义按钮 */
#fileInput {
    display: none;
}

.file-label {
    background-color: #2196F3;
    color: white;
    padding: 10px 20px;
    border-radius: 8px;
    cursor: pointer;
    margin-bottom: 10px;
    transition: background-color 0.3s ease;
}

.file-label:hover {
    background-color: #1976D2;
}

/* 显示文件名 */
.file-name {
    margin-bottom: 10px;
    font-size: 14px;
    color: #333;
}

/* 提交按钮样式 */
.upload-button {
    background-color: #4CAF50;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s ease;
}

.upload-button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

.upload-button:hover:not(:disabled) {
    background-color: #45a049;
}

/* 错误信息样式 */
.error-message {
    color: red;
    margin-top: 10px;
}

.el-footer {
    padding: 0;
}
</style>
