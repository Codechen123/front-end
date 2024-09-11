<template>
    <div class="common-layout">
        <el-container>
            <el-header>
                <Header />
            </el-header>
            <el-main>
                <h1>实时评估</h1>
                <div class="video-container">
                    <div id="box1">
                        <video ref="videoElement" autoplay class="preview-video">
                        </video>
                        <!-- 显示最新的图像帧 -->
                        <img ref="outputElement" v-if="isCameraOn" class="preview-frame" />
                        <canvas ref="canvasElement" style="display: none;"></canvas>
                    </div>
                </div>

                <div class="btnBox">
                    <el-button type="primary" round @click="startCamera">开启摄像头</el-button>
                    <el-button type="success" round @click="stopCamera">关闭摄像头</el-button>
                </div>
            </el-main>
            <el-footer>
                <Footer />
            </el-footer>
        </el-container>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';
import Header from '../../components/Header.vue';
import Footer from '../../components/Footer.vue';
import { io } from 'socket.io-client';

const videoElement = ref<HTMLVideoElement | null>(null);
const canvasElement = ref<HTMLCanvasElement | null>(null);
const outputElement = ref<HTMLImageElement | null>(null);
let stream: MediaStream | null = null;
let socket: any = null;
let captureInterval: number | null = null;

const isCameraOn = ref(false);

onMounted(() => {
    // 创建 Socket.IO 连接
    socket = io('http://192.168.69.10:5000');

    socket.on('connect', () => {
        console.log('Socket.IO connection opened');
    });

    socket.on('disconnect', () => {
        console.log('Socket.IO connection closed');
    });

    // 接收处理后的图像
    socket.on('response', (data: { status: string, frames: ArrayBuffer[] }) => {
        console.log('response');

        if (data.status === "success" && data.frames.length > 0) {
            // 将 ArrayBuffer 转换为 Base64 字符串
            const reader = new FileReader();
            reader.onloadend = () => {
                if (outputElement.value) {
                    outputElement.value.src = reader.result as string;
                }
            };

            // 假设我们只显示最新的一帧
            const latestFrame = new Blob([data.frames[0]], { type: 'image/jpeg' });
            reader.readAsDataURL(latestFrame);
        }
    });
});

onUnmounted(() => {
    // 清理资源
    if (captureInterval) clearInterval(captureInterval);
    if (socket) socket.disconnect();
    stopCamera();
});

const startCamera = () => {
    if (videoElement.value) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((mediaStream) => {
                stream = mediaStream;
                videoElement.value!.srcObject = stream;
                startCapture();
                isCameraOn.value = true;
            })
            .catch((err) => {
                console.error("Error accessing camera: ", err);
            });
    }
};

const stopCamera = () => {
    if (captureInterval) {
        clearInterval(captureInterval);
        captureInterval = null;
    }
    if (stream) {
        // 停止所有视频流轨道
        stream.getTracks().forEach(track => track.stop());
        stream = null;
        if (videoElement.value) {
            videoElement.value.srcObject = null;
        }
        isCameraOn.value = false;
    }
    if (socket) socket.disconnect();
};

const captureFrame = () => {
    if (canvasElement.value && videoElement.value && socket && socket.connected) {
        const context = canvasElement.value.getContext("2d");
        if (context) {
            canvasElement.value.width = videoElement.value.videoWidth;
            canvasElement.value.height = videoElement.value.videoHeight;
            context.drawImage(
                videoElement.value,
                0,
                0,
                canvasElement.value.width,
                canvasElement.value.height
            );

            // 将图像数据转换为 Blob
            canvasElement.value.toBlob((blob) => {
                if (blob) {
                    blob.arrayBuffer().then(buffer => {
                        socket.emit('fitness', buffer);  // 发送图像数据
                    });
                }
            }, "image/jpeg");
        }
    }
};

const startCapture = () => {
    // 定时捕获并发送帧
    captureInterval = setInterval(captureFrame, 1000 / 15); // 15 FPS
};
</script>

<style scoped>
#box1 {
    display: flex;
    flex-direction: column;
    align-items: center;
}

h1 {
    margin-left: 60px;
}

.preview-video {
    max-width: 70%;
    border-radius: 8px;
    /* border: 1px solid #ddd;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); */
    margin: 20px 20px;
}

.video-container {
    align-items: center;
    background-color: #f9f9f9;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    width: 95%;
    min-height: 60vh;
    margin: 20px auto;
}

.btnBox {
    display: flex;
    justify-content: center;
}

button {
    margin-top: 10px;
}

.el-footer {
    padding: 0;
}
</style>
