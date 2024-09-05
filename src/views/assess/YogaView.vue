<template>
    <div class="common-layout">
        <el-container>
            <el-header>
                <Header />
            </el-header>
            <el-main>
                <div class="video-container">
                    <video ref="video" width="640" height="480" autoplay></video>
                    <button @click="startVideo">Start Camera</button>
                    <button @click="stopVideo">Stop Camera</button>
                </div>
            </el-main>
            <el-footer>
                <Footer />
            </el-footer>
        </el-container>
    </div>
</template>

<script lang="ts" setup>
import { ref, onUnmounted } from 'vue'
import Header from '../../components/Header.vue'
import Footer from '../../components/Footer.vue'

const video = ref<HTMLVideoElement | null>(null)
const stream = ref<MediaStream | null>(null)
const intervalId = ref<number | null>(null) // 用于存储定时器的 ID

// 启动视频流
const startVideo = async () => {
    if (video.value) {
        try {
            stream.value = await navigator.mediaDevices.getUserMedia({ video: true })
            video.value.srcObject = stream.value

            // 开始定时捕获帧
            startSendingFrames()
        } catch (err) {
            console.error('Error accessing webcam: ', err)
            alert('Please allow camera access in your browser settings.')
        }
    }
}

// 关闭视频流
const stopVideo = () => {
    if (stream.value) {
        stream.value.getTracks().forEach(track => track.stop())
        video.value!.srcObject = null
        stream.value = null
    }

    // 停止定时捕获帧
    stopSendingFrames()
}

// 启动定时捕获帧
const startSendingFrames = () => {
    // 每隔 1 秒捕获并发送帧
    intervalId.value = window.setInterval(async () => {
        if (video.value) {
            // 创建 canvas 元素用于捕获图像
            const canvas = document.createElement('canvas')
            canvas.width = video.value.videoWidth
            canvas.height = video.value.videoHeight
            const context = canvas.getContext('2d')
            if (context) {
                context.drawImage(video.value, 0, 0, canvas.width, canvas.height)

                // 将 canvas 转换为 blob 并发送到服务器
                canvas.toBlob(async (blob) => {
                    if (blob) {
                        const formData = new FormData()
                        formData.append('image', blob, 'frame.jpg')

                        try {
                            await fetch('http://localhost:3000/process_frame', {
                                method: 'POST',
                                body: formData,
                            })
                            console.log('Frame sent to server')
                        } catch (err) {
                            console.error('Error sending frame to server: ', err)
                        }
                    }
                }, 'image/jpeg')
            }
        }
    }, 1000) // 每秒发送一次
}

// 停止定时捕获帧
const stopSendingFrames = () => {
    if (intervalId.value !== null) {
        clearInterval(intervalId.value)
        intervalId.value = null
    }
}

// 在组件卸载时停止视频流和定时器
onUnmounted(() => {
    stopVideo()
    stopSendingFrames()
})
</script>

<style scoped>
.video-container {
    display: flex;
    flex-direction: column;
    align-items: center;
}

button {
    margin-top: 10px;
}
</style>
