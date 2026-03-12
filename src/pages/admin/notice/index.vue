<template>
  <div class="notice-container">
    <div class="toolbar">
      <el-form :inline="true" class="search-form">
        <el-form-item>
          <el-input
            v-model="searchForm.title"
            placeholder="请输入标题"
            clearable
            @keyup.enter="handleSearch"
            @clear="handleSearch"
          >
            <template #append>
              <el-button :icon="Search" @click="handleSearch" link />
            </template>
          </el-input>
        </el-form-item>
      </el-form>
      
      <el-button type="primary" @click="handleAdd">
        新增公告
      </el-button>
    </div>

    <el-table :data="tableData" v-loading="loading" border>
      <el-table-column type="expand">
        <template #default="{ row }">
          <div 
            class="notice-content"
            v-html="row.content"
          ></div>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="标题" min-width="200" show-overflow-tooltip />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'info'">
            {{ row.status === 1 ? '已发布' : '未发布' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="类型" width="100">
        <template #default="{ row }">
          <el-tag>{{ row.type === 1 ? '普通' : row.type === 2 ? '其他' : 'VIP' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="readCount" label="阅读数" width="100" />
      <el-table-column prop="createTime" label="创建时间" width="180">
        <template #default="{ row }">
          {{ formatDateTime(row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="更新时间" width="180">
        <template #default="{ row }">
          {{ formatDateTime(row.updateTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
          <el-button 
            link 
            :type="row.status === 1 ? 'warning' : 'success'" 
            @click="handleToggleStatus(row)"
          >
            {{ row.status === 1 ? '取消发布' : '发布' }}
          </el-button>
          <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        :total="total"
        :page-size="10"
        background
        layout="prev, pager, next"
        @current-change="handlePageChange"
      />
    </div>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="800px"
      @close="resetForm"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="form.type">
            <el-option label="普通" :value="1" />
            <el-option label="其他" :value="2" />
            <el-option label="VIP" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-editor v-model="form.content" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          保存
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import noticeApi from '@/api/noticeApi'
import ElEditor from '@/components/Editor.vue'

// 搜索表单
const searchForm = ref({
  title: ''
})

// 表格数据
const loading = ref(false)
const tableData = ref([])
const currentPage = ref(1)
const total = ref(0)

// 对话框控制
const dialogVisible = ref(false)
const dialogTitle = computed(() => form.value.id ? '编辑公告' : '新增公告')
const submitting = ref(false)

// 表单相关
const formRef = ref(null)
const form = ref({
  id: '',
  title: '',
  type: 1,
  content: '',
  status: 0
})

const rules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  type: [{ required: true, message: '请选择类型', trigger: 'change' }],
  content: [{ required: true, message: '请输入内容', trigger: 'blur' }]
}

// 获取列表数据
const loadData = async () => {
  try {
    loading.value = true
    const res = await noticeApi.getList({ 
      current: currentPage.value,
      title: searchForm.value.title
    })
    if (res.code === 0) {
      tableData.value = res.content.records
      total.value = res.content.total
    }
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  loadData()
}

// 分页变化
const handlePageChange = (page) => {
  currentPage.value = page
  loadData()
}

// 新增
const handleAdd = () => {
  form.value = {
    id: '',
    title: '',
    type: 1,
    content: '',
    status: 0
  }
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row) => {
  form.value = { ...row }
  dialogVisible.value = true
}

// 切换发布状态
const handleToggleStatus = async (row) => {
  try {
    const newStatus = row.status === 1 ? 0 : 1
    await noticeApi.save({
      ...row,
      status: newStatus
    })
    ElMessage.success(newStatus === 1 ? '发布成功' : '取消发布成功')
    loadData()
  } catch (error) {
    console.error(error)
  }
}

// 删除
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确认删除该公告吗？', '提示', {
      type: 'warning'
    })
    await noticeApi.delete(row.id)
    ElMessage.success('删除成功')
    loadData()
  } catch (error) {
    console.error(error)
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    submitting.value = true
    await noticeApi.save(form.value)
    ElMessage.success('保存成功')
    dialogVisible.value = false
    loadData()
  } catch (error) {
    console.error(error)
  } finally {
    submitting.value = false
  }
}

// 重置表单
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
}

// 格式化日期时间
const formatDateTime = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

onMounted(() => {
  loadData()
})
</script>

<style lang="scss" scoped>
.notice-container {
  background: #fff;
  padding: 20px;
  border-radius: 4px;

  .notice-content {
    padding: 20px;
    background: #f8f9fa;
    
    :deep(img) {
      max-width: 100%;
      height: auto;
    }
    
    :deep(p) {
      margin: 8px 0;
      line-height: 1.6;
    }
    
    :deep(ul, ol) {
      padding-left: 20px;
      margin: 8px 0;
    }
  }

  .toolbar {
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .search-form {
      margin-bottom: 0;
      
      .el-form-item {
        margin-bottom: 0;
      }
    }
  }

  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style> 