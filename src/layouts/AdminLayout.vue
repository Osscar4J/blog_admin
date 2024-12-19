<template>
  <div class="admin-layout">
    <aside :style="{ width: sideBarWidth }">
      <nav-menu />
    </aside>
    <div class="main-content">
      <header-bar />
      <main>
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import NavMenu from '@/components/NavMenu.vue'
import HeaderBar from '@/components/HeaderBar.vue'

const store = useStore()
const sideBarWidth = computed(() => store.state.sideBarWidth)
</script> 