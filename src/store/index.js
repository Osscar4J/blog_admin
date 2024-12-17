import Vue from 'vue'
import Vuex from 'vuex'
import Storage from '@/utils/storage'
import Constants from '@/constants'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
	state: {
		userToken: Storage.getItem(Constants.USER_TOKEN) || null,
		userInfo: Storage.getItem(Constants.USER_INFO) || null,
		sideBarWidth: '17rem',

		// 权限编码
		auth: {
			role: { code: 10400, query: 10410, update: 10411, delete: 10412 }, // 角色
			menu: { code: 10500, query: 10510, update: 10511, delete: 10512 }, // 菜单
			group: { code: 10600, query: 10610, update: 10611, delete: 10612 }, // 分组
			user: { code: 10900, query: 10910, update: 10911, delete: 10912 }, // 用户
			article: { code: 11000, query: 11010, update: 11011, delete: 11012 }, // 文章
			banner: { code: 11100, query: 11110, update: 11111, delete: 11112 }, // 轮播图
			message: { code: 11200, query: 11210, update: 11211, delete: 11212 }, // 留言
			nmap: { code: 11300, query: 11310, update: 11311, delete: 11312 }, // 端口扫描记录
		}
	},

	mutations: {
		setUserToken(state, v) {
			state.userToken = v
			Storage.setItem(Constants.USER_TOKEN, v)
		},

		setUserInfo(state, v) {
			state.userInfo = v
			Storage.setItem(Constants.USER_INFO, v)
		},

		setSideBarWidth(state, v) {
			state.sideBarWidth = v
		},

		removeToken(state){
			state.userToken = null
			Storage.removeItem(Constants.USER_TOKEN)
		}
	},

	getters: {
		userToken: state => state.userToken,
		userInfo: state => state.userInfo,
		sideBarWidth: state => state.sideBarWidth,
		auth: state => state.auth
	}
})
