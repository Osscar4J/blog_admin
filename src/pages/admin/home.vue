<template>
  <div class="admin-layout">
    <side-bar></side-bar>
    <header-bar :widthToggle="widthToggle"></header-bar>
    <div 
      class="main-content"
      :style="{ marginLeft: sideBarWidth }"
    >
      <router-view v-slot="{ Component }">
        <transition 
          name="fade-transform" 
          mode="out-in"
          appear
        >
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import SideBar from '@/components/sideBar.vue'
import HeaderBar from '@/components/headerBar.vue'

const store = useStore()
const prevWidth = ref('0rem')

// 从 store 获取侧边栏宽度
const sideBarWidth = computed(() => store.state.sideBarWidth)

// 切换侧边栏宽度
const widthToggle = () => {
  const temp = sideBarWidth.value
  store.commit('setSideBarWidth', prevWidth.value)
  prevWidth.value = temp
}

// 监听窗口大小变化
const handleResize = () => {
  if (window.innerWidth < 640) {
    widthToggle()
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  handleResize() // 初始化时执行一次
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style lang="scss" scoped>
.admin-layout {
  min-height: 100vh;
  background-color: #f0f2f5;
  
  .main-content {
    padding: 65px 15px 15px;
    transition: margin-left .2s ease-in;
    min-height: 100vh;
    box-sizing: border-box;
  }
}

// 页面切换动画
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>
