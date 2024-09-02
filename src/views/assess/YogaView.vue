<template>
    <div class="common-layout">
        <el-container>
            <el-header>
                <Header />
            </el-header>
            <el-main>
                <div class="main">
                    <div class="upload">
                        <el-upload ref="upload" class="upload-demo"
                            action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15" :limit="1"
                            :on-exceed="handleExceed" :auto-upload="false" accept="video/*">
                            <template #trigger>
                                <el-button type="primary">选择文件</el-button>
                            </template>
                            <el-button style="margin: 0 10px;" class="ml-3" type="success" @click="submitUpload">
                                上传到服务器
                            </el-button>
                            <template #tip>
                                <div class="el-upload__tip text-red">
                                    一次只能上传一个文件，新选择的文件会覆盖掉之前选择的文件
                                </div>
                            </template>
                        </el-upload>
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
import Header from '../../components/Header.vue'
import Footer from '../../components/Footer.vue'
import { ref } from 'vue'
import { genFileId } from 'element-plus'
import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus'

const upload = ref<UploadInstance>()

const handleExceed: UploadProps['onExceed'] = (files) => {
    upload.value!.clearFiles()
    const file = files[0] as UploadRawFile
    file.uid = genFileId()
    upload.value!.handleStart(file)
}

const submitUpload = () => {
    upload.value!.submit()
}

</script>

<style scoped>
.upload {
    text-align: center;
    width: 400px;
}
</style>