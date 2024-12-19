import axios from 'axios'
import { ElMessage } from 'element-plus'
import store from '@/store'
const service = axios.create({
	baseURL: '/api',
	timeout: 5000
})

// 请求拦截器
service.interceptors.request.use(
	config => {
		const token = store.state.token
		if (token) {
			config.headers['x-token'] = token
		}
		return config
	},
	error => {
		return Promise.reject(error)
	}
)

// 响应拦截器
service.interceptors.response.use(
	response => {
		const res = response.data
		if (res.code !== 0) {
			ElMessage.error(res.msg || '请求失败')
		}
		return res
	},
	error => {
		ElMessage.error(error.msg || '请求失败')
		return Promise.reject(error)
	}
)

export default service
