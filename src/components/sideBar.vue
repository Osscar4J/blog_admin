<template>
	<div class="side-bar" :style="{ width: sideBarWidth }">
		<div class="logo">
			<span>博客管理系统</span>
		</div>
		
		<el-menu
			:default-active="activeMenu"
			class="el-menu-vertical"
			:collapse="isCollapse"
			background-color="#304156"
			text-color="#bfcbd9"
			active-text-color="#409EFF"
			router
		>
			<el-menu-item index="/admin/dashboard">
				<el-icon><Odometer /></el-icon>
				<template #title>仪表盘</template>
			</el-menu-item>
			
			<el-menu-item index="/admin/apiKey">
				<el-icon><Key /></el-icon>
				<template #title>API Key管理</template>
			</el-menu-item>
		</el-menu>
	</div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { Odometer, Document, Picture, Key } from '@element-plus/icons-vue'

const store = useStore()
const route = useRoute()

const sideBarWidth = computed(() => store.state.sideBarWidth)
const isCollapse = computed(() => sideBarWidth.value === '0rem')
const activeMenu = computed(() => route.path)
</script>

<style lang="scss" scoped>
.side-bar {
	position: fixed;
	top: 0;
	bottom: 0;
	left: 0;
	background-color: #304156;
	transition: width .2s ease-in;
	z-index: 1001;
	overflow: hidden;

	.logo {
		height: 50px;
		padding: 10px;
		display: flex;
		align-items: center;
		justify-content: center;
		
		span {
			color: #fff;
			font-size: 16px;
			font-weight: 600;
			white-space: nowrap;
		}
	}

	.el-menu {
		border: none;
		height: calc(100% - 50px);
		width: 100%;
	}
}
</style>
