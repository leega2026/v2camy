<template>
  <div class="drag-upload">
    <!-- 拖拽区域 -->
    <div
      class="drop-area"
      :class="{ dragging: isDragging }"
      @dragenter.prevent="handleDragEnter"
      @dragover.prevent="handleDragOver"
      @dragleave.prevent="handleDragLeave"
      @drop.prevent="handleDrop"
    >
      <p>拖拽文件到此处</p>
      <p class="tip">仅支持 .xls / .xlsx 格式</p>
    </div>
  </div>
</template>

<script>
import axios from '../lib/axios'

export default {
  name: 'FileDrop',
  data() {
    return {
      isDragging: false, // 是否正在拖拽
      fileData: null,
      allowSuffix: ['xls', 'xlsx']
    }
  },
  methods: {
    // 拖拽进入
    handleDragEnter() {
      this.isDragging = true
    },
    // 拖拽悬停（必须阻止默认事件）
    handleDragOver() {
      this.isDragging = true
    },
    // 拖拽离开
    handleDragLeave() {
      this.isDragging = false
    },
    // 拖拽释放 → 获取文件
    handleDrop(e) {
      this.isDragging = false
      const files = e.dataTransfer.files
      if (files.length) {
        var file = files[0]
        const suffix = file.name.slice(file.name.lastIndexOf('.') + 1).toLowerCase();
        if (!this.allowSuffix.includes(suffix)) {
          this.$message && this.$message.error('只能上传 Excel 文件(.xls/.xlsx)');
          return;
        }
        this.uploadFiles(file)
      }
    },
    uploadFiles(file) {
      // 真实项目替换这里：用 axios/axios 发 FormData
      const formData = new FormData()
      formData.append('file', file)
      axios.post('/api/excel', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
        }
      })
      .then((res) => {
        this.$parent.dropSuc(res.data.type, res.data)
        this.$message.success('文件导入成功！');
      })
      .catch((e) => {
        this.$message.error('文件解析失败！');
      })

    }
  }
}
</script>

<style scoped>
.drag-upload {
  width: 600px;
  margin: 20px auto;
}
/* 拖拽区域样式 */
.drop-area {
  width: 100%;
  height: 180px;
  border: 2px dashed #ccc;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: #fafafa;
  transition: all 0.3s;
}
.drop-area.dragging {
  border-color: #409eff;
  background: #ecf5ff;
}
.tip {
  color: #909399;
  font-size: 14px;
  margin-top: 5px;
}
/* 文件列表 */
.file-list {
  margin-top: 15px;
}
.file-item {
  padding: 10px;
  border: 1px solid #eee;
  margin-bottom: 8px;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.status {
  color: #409eff;
  font-size: 14px;
}
/* 进度条 */
.progress {
  width: 100px;
  height: 6px;
  background: #f5f5f5;
  border-radius: 3px;
  margin-left: 10px;
}
.progress-bar {
  height: 100%;
  background: #409eff;
  border-radius: 3px;
  transition: width 0.2s;
}
</style>