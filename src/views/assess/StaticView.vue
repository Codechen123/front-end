<template>
    <div class="common-layout">
        <el-container>
            <el-header>
                <Header />
            </el-header>
            <el-main>
                <h1>静态图片评估</h1>
                <div class="upload-card">
                    <div id="box1" class="preview-container">
                        <img v-if="imageUrl" :src="imageUrl" alt="图片预览" class="preview-image" />
                        <img v-if="uploadedImageUrl" :src="uploadedImageUrl" alt="上传后的图片" class="preview-image" />
                    </div>
                    <div id="box2" class="upload-controls">
                        <input type="file" accept="image/png, image/jpeg" @change="handleFileChange" id="fileInput" />
                        <label for="fileInput" class="file-label">选择图片</label>
                        <span v-if="selectedFile" class="file-name">{{ selectedFile.name }}</span>
                        <button @click="uploadImage" :disabled="!selectedFile" class="upload-button">提交</button>
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
import axios from 'axios'
import Header from '../../components/Header.vue'
import Footer from '../../components/Footer.vue'

const imageUrl = ref<string | null>(null)
const uploadedImageUrl = ref<string | null>(null)
const errorMessage = ref<string | null>(null)
const selectedFile = ref<File | null>(null)

const handleFileChange = (event: Event) => {
    const fileInput = event.target as HTMLInputElement
    const file = fileInput.files?.[0]
    if (file) {
        // 检查文件类型
        if (file.type === 'image/png' || file.type === 'image/jpeg') {
            imageUrl.value = URL.createObjectURL(file)
            selectedFile.value = file
            errorMessage.value = null // 清除错误信息
        } else {
            errorMessage.value = '只能上传 PNG 或 JPG 格式的图片。'
            imageUrl.value = null // 清除之前的预览图片
            selectedFile.value = null
        }
    }
}

const uploadImage = async () => {
    if (!selectedFile.value) return

    const formData = new FormData()
    formData.append('file', selectedFile.value)

    uploadedImageUrl.value = 'https://pic3.zhimg.com/v2-5fb13110e1de13d4c11e6e7f5b8026da_r.jpg'

    try {
        // 上传图片到服务器
        const response = await axios.post('/api/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })

        // 假设服务器返回图片的 URL
        uploadedImageUrl.value = response.data.url
    } catch (error) {
        errorMessage.value = '上传图片失败，请重试。'
    }
}
</script>

<style scoped>
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

h1 {
    margin-left: 60px;
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
</style>
