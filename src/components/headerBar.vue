<template>
  <div class="header-bar" :style="{ left: sideBarWidth }">
    <div class="left">
      <el-button type="text" @click="handleCollapse">
        <el-icon :size="20">
          <Fold v-if="!isCollapsed" />
          <Expand v-else />
        </el-icon>
      </el-button>
      <breadcrumb />
    </div>
    
    <div class="right">
      <el-dropdown trigger="click" @command="handleCommand">
        <div class="avatar-wrapper">
          <el-avatar :size="30" :src="userInfo.avatar">
            {{ userInfo.username?.charAt(0)?.toUpperCase() }}
          </el-avatar>
          <span class="username">{{ userInfo.username }}</span>
          <el-icon><CaretBottom /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">个人信息</el-dropdown-item>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { Fold, Expand, CaretBottom } from '@element-plus/icons-vue'
import Breadcrumb from './breadcrumb.vue'
import commonApi from '@/api/commonApi'
import { ElMessage } from 'element-plus'
const props = defineProps({
  widthToggle: {
    type: Function,
    required: true
  }
})

const store = useStore()
const router = useRouter()

const sideBarWidth = computed(() => store.state.sideBarWidth)
const isCollapsed = computed(() => sideBarWidth.value === '0rem')
const userInfo = computed(() => store.state.userInfo)

const handleCollapse = () => {
  props.widthToggle()
}

const handleCommand = async (command) => {
  if (command === 'profile') {
    router.push('/admin/profile')
  } else if (command === 'logout') {
    try {
      await ElMessageBox.confirm('确认退出登录吗？', '提示', {
        type: 'warning'
      })
      let res = await commonApi.logout()
      if (res.code === 0) {
        store.commit('clearUserInfo')
        router.push('/login')
      }
    } catch (error) {
      console.error(error)
    }
  }
}
</script>

<style lang="scss" scoped>
.header-bar {
  position: fixed;
  top: 0;
  right: 0;
  height: 50px;
  padding: 0 15px;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: left .2s ease-in;
  z-index: 1000;

  .left {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .right {
    .avatar-wrapper {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      padding: 5px;
      
      &:hover {
        background: rgba(0,0,0,.025);
      }

      .username {
        font-size: 14px;
        color: #333;
      }
    }
  }
}
</style>