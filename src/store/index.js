import { createStore } from 'vuex'

export default createStore({
	state: {
		token: localStorage.getItem('token') || '',
		userInfo: JSON.parse(localStorage.getItem('userInfo')) || { username: 'admin', avatar: '' },
		sideBarWidth: '220px'
	},
	getters: {
		userToken: state => state.token,
		userInfo: state => state.userInfo
	},
	mutations: {
		setSideBarWidth(state, width) {
			state.sideBarWidth = width
		},
		setUserToken(state, token) {
			state.token = token
			localStorage.setItem('token', token)
		},
		setUserInfo(state, userInfo) {
			state.userInfo = userInfo
			localStorage.setItem('userInfo', JSON.stringify(userInfo))
		},
		clearUserInfo(state) {
			state.token = ''
			state.userInfo = {}
			localStorage.removeItem('token')
			localStorage.removeItem('userInfo')
		}
	}
})
