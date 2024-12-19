<template>
  <div class="login-container">
    <div class="login-box">
      <h2>博客管理系统</h2>
      <el-form 
        :model="loginForm" 
        :rules="rules" 
        ref="loginFormRef"
        class="login-form"
      >
        <el-form-item prop="account">
          <el-input 
            v-model="loginForm.account" 
            placeholder="用户名"
            prefix-icon="User"
          />
        </el-form-item>
        <el-form-item prop="passwd">
          <el-input 
            v-model="loginForm.passwd" 
            type="password" 
            placeholder="密码"
            prefix-icon="Lock"
            show-password
          />
        </el-form-item>
        <el-form-item>
          <el-button 
            type="primary" 
            @click="handleLogin" 
            :loading="loading"
            class="login-button"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import commonApi from '@/api/commonApi'
import store from '@/store'

const router = useRouter()
const loginFormRef = ref(null)
const loading = ref(false)

const loginForm = reactive({
  account: '',
  passwd: ''
})

const rules = {
  account: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  passwd: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  try {
    loading.value = true
    await loginFormRef.value.validate()
    const res = await commonApi.login(loginForm)
    console.log(res)
    if (res.code === 0) {
      store.commit('setUserToken', res.content.token)
      ElMessage.success('登录成功')
      router.push('/admin/dashboard')
    }
  } catch (error) {
    ElMessage.error(error.msg || '登录失败')
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  
  .login-box {
    width: 400px;
    padding: 40px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    
    h2 {
      text-align: center;
      margin-bottom: 30px;
      color: #303133;
    }
    
    .login-form {
      .login-button {
        width: 100%;
      }
    }
  }
}
</style> 