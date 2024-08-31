<template>
    <div class="common-layout">
        <el-container>
            <el-header>
                <Header />
            </el-header>
            <el-main>
                <div class="content">
                    <h1>欢迎使用运动姿态评估系统</h1>
                    <p>
                        在当今数字化时代，人体关键点识别技术正成为各行业关注的焦点，为体育健身领域带来了前所未有的革新。我们的项目旨在利用先进的人体关键点识别技术，从静态体态检测到健身动作检测再到数据可视化报告，为用户提供全方位、精准的服务。
                    </p>
                    <p>
                        通过我们的系统，您可以获得专业的姿态分析、实时的健身动作评估以及个性化的健康报告。无论您是职业运动员、健身教练还是健康爱好者，我们都能帮助您优化训练效果，实现健康目标。
                    </p>
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
.content {
    margin: 50px 200px;
}
</style>