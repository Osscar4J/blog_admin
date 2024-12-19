<template>
  <div class="api-key-container">
    <div class="toolbar">
      <el-form :inline="true" class="search-form">
        <el-form-item>
          <el-input
            v-model="searchForm.apiKey"
            placeholder="请输入API Key"
            clearable
            @keyup.enter="handleSearch"
            @clear="handleSearch"
          >
            <template #append>
              <el-button :icon="Search" @click="handleSearch" />
            </template>
          </el-input>
        </el-form-item>
      </el-form>
      
      <el-button type="primary" @click="handleAdd">
        新增 API Key
      </el-button>
    </div>

    <el-table :data="tableData" v-loading="loading" border>
      <el-table-column label="API Key" width="280">
        <template #default="{ row }">
          <div class="api-key-cell">
            <span>{{ row.apiKey }}</span>
            <el-button 
              link 
              type="primary" 
              class="copy-btn"
              :data-clipboard-text="row.apiKey"
              @click="handleCopy"
            >
              <el-icon><DocumentCopy /></el-icon>
            </el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'danger'">
            {{ row.status === 1 ? '正常' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="maxUser" label="最大绑定人数" width="120" />
      <!-- <el-table-column prop="expireTime" label="有效时长(分钟)" width="120" /> -->
      <el-table-column prop="createDate" label="创建时间" width="180">
        <template #default="{ row }">
          {{ formatDateTime(row.createDate) }}
        </template>
      </el-table-column>
      <el-table-column prop="expireDate" label="失效时间" width="180">
        <template #default="{ row }">
          <span :class="getExpireDateClass(row.expireDate)">
            {{ formatDateTime(row.expireDate) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" show-overflow-tooltip />
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
          <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
          <el-button link type="primary" @click="handleRefresh(row)">
            <el-icon><Refresh /></el-icon>
          </el-button>
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
      width="500px"
      @close="resetForm"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="最大绑定人数" prop="maxUser">
          <el-input-number v-model="form.maxUser" :min="1" />
        </el-form-item>
        <el-form-item label="失效时间" prop="expireDate">
          <el-date-picker
            v-model="form.expireDate"
            type="datetime"
            placeholder="选择失效时间"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            :disabled-date="disabledDate"
            :default-time="defaultTime"
          />
        </el-form-item>
        <el-form-item label="有效时长" prop="expireTime">
          <el-input-number v-model="form.expireTime" :min="0" />
          <span class="unit">分钟</span>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注信息"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { DocumentCopy, Search, Refresh } from '@element-plus/icons-vue'
import apiKeyApi from '@/api/apiKeyApi'
import Clipboard from 'clipboard'
import { v4 as uuidv4 } from 'uuid'

// 搜索表单
const searchForm = ref({
  apiKey: ''
})

// 表格数据
const loading = ref(false)
const tableData = ref([])
const currentPage = ref(1)
const total = ref(0)

// 对话框控制
const dialogVisible = ref(false)
const dialogTitle = computed(() => form.value.apiKey ? '编辑 API Key' : '新增 API Key')
const submitting = ref(false)

// 表单相关
const formRef = ref(null)
const form = ref({
  apiKey: '',
  status: 1,
  maxUser: 1,
  expireTime: 0,
  expireDate: '',
  remark: ''
})

const rules = {
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  maxUser: [{ required: true, message: '请输入最大绑定人数', trigger: 'blur' }],
  expireTime: [{ required: true, message: '请输入有效时长', trigger: 'blur' }],
  expireDate: [{ required: true, message: '请选择失效时间', trigger: 'change' }]
}

// 禁用今天之前的日期
const disabledDate = (time) => {
  return time.getTime() < Date.now() - 8.64e7 // 86400000ms = 1天
}

// 默认选择时间为 23:59:59
const defaultTime = new Date(2000, 0, 1, 23, 59, 59)

// 获取列表数据
const loadData = async () => {
  try {
    loading.value = true
    const res = await apiKeyApi.getList({ 
      current: currentPage.value,
      apiKey: searchForm.value.apiKey
    })
    if (res.code === 0) {
      tableData.value = res.content.records
      total.value = res.content.pages * 10 // 假设每页10条
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
    apiKey: uuidv4().replace(/-/g, ''),
    status: 1,
    maxUser: 1,
    expireTime: 0,
    expireDate: '',
    remark: ''
  }
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row) => {
  form.value = {
    ...row,
    expireDate: row.expireDate ? new Date(row.expireDate).toISOString().slice(0, 19).replace('T', ' ') : ''
  }
  dialogVisible.value = true
}

// 删除
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确认删除该 API Key 吗？', '提示', {
      type: 'warning'
    })
    await apiKeyApi.delete(row.apiKey)
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
    const formData = { ...form.value }
    
    if (formData.expireDate) {
      formData.expireDate = new Date(formData.expireDate).getTime()
    }
    
    await apiKeyApi.save(formData)
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

// 复制 API Key
const handleCopy = (event) => {
  const clipboard = new Clipboard('.copy-btn')
  
  clipboard.on('success', () => {
    ElMessage.success('复制成功')
    clipboard.destroy()
  })
  
  clipboard.on('error', () => {
    ElMessage.error('复制失败')
    clipboard.destroy()
  })
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

// 获取失效时间的样式类
const getExpireDateClass = (timestamp) => {
  if (!timestamp) return ''
  
  const now = Date.now()
  const expireTime = new Date(timestamp).getTime()
  const oneMonth = 30 * 24 * 60 * 60 * 1000 // 30天的毫秒数
  
  if (expireTime < now) {
    return 'text-danger'  // 已失效
  } else if (expireTime - now < oneMonth) {
    return 'text-warning'  // 一个月内失效
  }
  return ''
}

// 刷新缓存
const handleRefresh = async (row) => {
  try {
    await ElMessageBox.confirm('确认刷新该 API Key 的缓存吗？', '提示', {
      type: 'warning'
    })
    const res = await apiKeyApi.refresh(row.apiKey)
    if (res.code === 0) {
      ElMessage.success('刷新成功')
      loadData()
    }
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  loadData()
})
</script>

<style lang="scss" scoped>
.api-key-container {
  background: #fff;
  padding: 20px;
  border-radius: 4px;

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

  .unit {
    margin-left: 10px;
    color: #666;
  }

  .api-key-cell {
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    .copy-btn {
      opacity: 0;
      transition: opacity 0.2s;
    }
    
    &:hover .copy-btn {
      opacity: 1;
    }
  }

  .text-danger {
    color: #f56c6c;
  }
  
  .text-warning {
    color: #e6a23c;
  }
}
</style> 