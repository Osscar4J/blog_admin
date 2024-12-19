import request from './request'

export default {
	// 登录
	login(data) {
		return request({
			url: '/login',
			method: 'post',
			data
		})
	},

	// 获取用户信息
	getUserInfo() {
		return request({
			url: '/user/info',
			method: 'get'
		})
	},

	// 登出
	logout() {
		return request({
			url: '/user/logout',
			method: 'post'
		})
	}
}
