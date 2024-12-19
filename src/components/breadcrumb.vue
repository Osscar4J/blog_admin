<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item v-for="item in breadcrumbs" :key="item.path">
      <span 
        :class="{ 'no-redirect': item.redirect === 'noredirect' || index === breadcrumbs.length - 1 }"
        @click="handleLink(item)"
      >
        {{ item.meta?.title || item.name }}
      </span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const breadcrumbs = ref([])

const getBreadcrumbs = () => {
  let matched = route.matched.filter(item => item.meta && item.meta.title)
  const first = matched[0]
  
  if (first && first.path !== '/admin') {
    matched = [{ path: '/admin', meta: { title: '首页' } }].concat(matched)
  }
  
  breadcrumbs.value = matched
}

const handleLink = (item) => {
  const { redirect, path } = item
  if (redirect) {
    router.push(redirect)
    return
  }
  router.push(path)
}

watch(() => route.path, getBreadcrumbs, { immediate: true })
</script>

<style lang="scss" scoped>
.el-breadcrumb {
  display: inline-block;
  line-height: 50px;
  
  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style> 