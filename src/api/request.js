import Axios from 'axios'
import Store from '@/store'
import Router from '@/router'

let requestConfig = {
	method: 'GET',
	baseURL: '/api/',
	timeout: 8000,
	headers: {token: null}
}

const successCall = (res, params) => {
	if (parseInt(res.data.code) != 0) {
		if (typeof params.failure === 'function') {
			params.failure(res)
		} else {
			UIkit.notification(res.data.msg, {pos: 'top-center', status: "danger"})
		}
		// typeof params.failure === 'function' && params.failure(res)
		if (parseInt(res.data.code) == 401) {
			Router.push('/')
		}
	} else {
		typeof params.success === 'function' && params.success(res)
	}
	if (typeof params.finally === 'function') {
		params.finally(res)
	} else if (typeof params.always === 'function') {
		params.always(res)
	}
}

const failureCall = (res, params) => {
	if (typeof params.error === 'function'){
		params.error(res)
	} else {
		UIkit.notification(res, {pos: 'top-center', status:'danger'})
	}
	if (typeof params.always === 'function') {
		params.always(res)
	}
}

let Request = (config, params) =>{
	config = Object.assign({}, requestConfig, config)

	if (Store.getters.userToken)
		config.headers['X-Token'] = Store.getters.userToken

	if (config.method.toLowerCase() == 'delete') {
		Axios.delete(config.url, config).then(res => {
			successCall(res, params)
		}).catch(res => {
			failureCall(res, params)
		})
	} else {
		Axios(config).then(function(res){
			successCall(res, params)
		}).catch(function(res){
			failureCall(res, params)
		})
	}
}

export default {
	request(config, params) {
		Request(config, params)
	},

	postFile(config) {
		let data = new FormData()
		for (let k in config.data) {
			if (config.data[k] != undefined) {
				if (Object.prototype.toString.call(config.data[k]) == '[object Blob]') {
					data.append(k, config.data[k], config.data[k].name)
				} else {
					data.append(k, config.data[k])
				}
			}
		}
		Axios.post(requestConfig.baseURL + config.url, data, 
			{headers: {"Content-Type": "multipart/form-data", 'token': Store.getters.userToken.token}}).then(data => {
			if (typeof config.success === 'function')
				config.success(data)
		}, err => {
			if (typeof config.error === 'function')
				config.error(err)
		})
	}
}
