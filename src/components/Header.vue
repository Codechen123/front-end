<template>
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" :ellipsis="false"
        @select="handleSelect">
        <el-menu-item index="0">
            <h1>运动姿态评估系统</h1>
        </el-menu-item>
        <el-menu-item index="1">
            静态评估
        </el-menu-item>
        <el-menu-item index="2">
            运动评估
        </el-menu-item>
        <el-menu-item index="3">
            瑜伽评估
        </el-menu-item>
        <el-sub-menu index="4">
            <template #title> 个人中心 </template>
            <el-menu-item index="4-1">个人信息</el-menu-item>
            <el-menu-item index="4-2">历史报告</el-menu-item>
            <el-menu-item index="4-3">退出登录</el-menu-item>
        </el-sub-menu>
    </el-menu>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../stores/auth'

const activeIndex = ref('0');
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const user = authStore.user;

// Define the type for routeMap with an index signature
const routeMap: { [key: string]: string } = {
    '/home': '0',
    '/static': '1',
    '/exercise': '2',
    '/yoga': '3',
    '/user/info': '4-1',
    '/user/report': '4-2'
};

// Watch for route changes to update the activeIndex
watch(
    () => route.path,
    (newPath) => {
        activeIndex.value = routeMap[newPath] || '0';
    },
    { immediate: true }
);

const handleSelect = (key: string) => {
    switch (key) {
        case '0':
            router.push('/home');
            break;
        case '1':
            router.push('/static');
            break;
        case '2':
            router.push('/exercise');
            break;
        case '3':
            router.push('/yoga');
            break;
        case '4-1':
            router.push('/user/info');
            break;
        case '4-2':
            router.push('/user/report');
            break;
        case '4-3':
            authStore.logout();
        default:
            console.log('Unknown menu item');
    }
};
</script>

<style>
.el-menu--horizontal>.el-menu-item:nth-child(1) {
    margin-right: auto;
}
</style>
