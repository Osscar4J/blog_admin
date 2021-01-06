import Vue from 'vue'
import Vuex from 'vuex'
import Storage from '@/utils/storage'
import Constants from '@/constants'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
	state: {
		userToken: Storage.getItem(Constants.USER_TOKEN) || null
	},

	mutations: {
		setUserToken(state, v) {
			state.userToken = v
			Storage.setItem(Constants.USER_TOKEN, v)
		}
	},

	getters: {
		userToken: state => state.userToken
	}
})
