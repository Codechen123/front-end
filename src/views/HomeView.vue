<template>
    <div class="common-layout">
        <el-container>
            <el-header>
                <Header />
            </el-header>
            <el-main>

                <header>
                    <div class="container">
                        <h1>运动姿态评估系统</h1>
                        <p>提升运动表现，优化训练效果</p>
                    </div>
                </header>

                <div class="container main-content">
                    <div class="card">
                        <h2>静态评估</h2>
                        <img src="@/assets/static-assessment.jpg" alt="静态评估">
                        <p>通过上传图片，快速获取运动姿态的详细分析。系统将根据您的图片提供精确的静态姿态反馈。</p>
                    </div>
                    <div class="card">
                        <h2>动态评估</h2>
                        <img src="@/assets/dynamic-assessment.jpg" alt="动态评估">
                        <p>上传视频，系统将分析您的动态运动过程，并提供实时的改进建议，帮助您更好地调整训练方式。</p>
                    </div>
                    <div class="card">
                        <h2>实时评估</h2>
                        <img src="@/assets/real-time-assessment.jpg" alt="实时评估">
                        <p>开启摄像头，立刻进行实时姿态评估。系统将立即分析您的运动效果，让您迅速获得反馈。</p>
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
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'


</script>

<style scoped>
h2 {
    text-align: center;
}

.el-main {
    padding: 0;
    min-height: 80vh;
}

body {
    font-family: Arial, sans-serif;
    line-height: 1.6;
    margin: 0;
    padding: 0;
    background-color: #f4f4f4;
}

header {
    background: #303846;
    color: #fff;
    padding: 10px 0;
    text-align: center;
}

.container {
    width: 80%;
    margin: auto;
    overflow: hidden;
}

.main-content {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}

.main-content img {
    max-width: 100%;
    height: auto;
}

.card {
    background: #fff;
    margin: 10px;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    flex: 1;
    min-width: 300px;
}

.card h2 {
    margin-top: 0;
}

.card img {
    max-width: 100%;
    height: auto;
}

.el-footer {
    padding: 0;
}
</style>