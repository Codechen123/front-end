<template>
    <div class="common-layout">
        <el-container>
            <el-header>
                <Header />
            </el-header>
            <el-main>
                <h1>动态视频评估</h1>
                <div class="upload-card">
                    <div id="box1" class="preview-container">
                        <video v-if="videoUrl" :src="videoUrl" controls class="preview-video"></video>
                        <video v-if="uploadedVideoUrl" :src="uploadedVideoUrl" controls class="preview-video"></video>
                    </div>
                    <div id="box2" class="upload-controls">
                        <input type="file" accept="video/mp4, video/x-msvideo" @change="handleFileChange"
                            id="fileInput" />

                        <label for="fileInput" class="file-label">选择视频</label>
                        <span v-if="selectedFile" class="file-name">{{ selectedFile.name }}</span>
                        <button @click="uploadVideo" :disabled="!selectedFile" class="upload-button">提交</button>
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

const videoUrl = ref<string | null>(null)
const uploadedVideoUrl = ref<string | null>(null)
const errorMessage = ref<string | null>(null)
const selectedFile = ref<File | null>(null)

const handleFileChange = (event: Event) => {
    const fileInput = event.target as HTMLInputElement
    const file = fileInput.files?.[0]
    if (file) {
        // 检查文件类型
        if (file.type.startsWith('video/')) {
            videoUrl.value = URL.createObjectURL(file)
            selectedFile.value = file
            errorMessage.value = null // 清除错误信息
        } else {
            errorMessage.value = '只能上传视频文件。'
            videoUrl.value = null // 清除之前的预览视频
            selectedFile.value = null
        }
    }
}

const uploadVideo = async () => {
    if (!selectedFile.value) return

    const formData = new FormData()
    formData.append('file', selectedFile.value)

    uploadedVideoUrl.value = 'https://media.w3.org/2010/05/sintel/trailer.mp4'

    try {
        // 上传视频到服务器
        const response = await axios.post('/api/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })

        // 假设服务器返回视频的 URL
        uploadedVideoUrl.value = response.data.url
    } catch (error) {
        errorMessage.value = '上传视频失败，请重试。'
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

h1 {
    margin-left: 60px;
}

/* 预览视频样式 */
.preview-container {
    margin-bottom: 20px;
}

.preview-video {
    max-width: 45%;
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
