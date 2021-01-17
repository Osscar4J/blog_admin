import Request from './request'

export default {
	list(params) {
		if (typeof params.success == 'function'){
			let tempFun = params.success
			params.success = res => {
				res.data.content.total && (res.data.content.total = parseInt(res.data.content.total))
				res.data.content.size && (res.data.content.size = parseInt(res.data.content.size))
				res.data.content.pages && (res.data.content.pages = parseInt(res.data.content.pages))
				tempFun(res)
			}
		}
		return this.request({url: this.baseUrl, method: 'GET', params: params.data}, params)
	},

	add(params) {
		return this.request({url: this.baseUrl, method: 'POST', data: params.data}, params)
	},

	update(params) {
		return this.request({url: this.baseUrl, method: 'PUT', data: params.data}, params)
	},

	addOrUpdate(params) {
		return this.request({url: this.baseUrl, method: 'POST', data: params.data}, params)
	},

	delete(params) {
		return this.request({url: this.baseUrl + '/' + params.data.id, method: 'DELETE'}, params)
	},

	// 通过id获取详情
	getDetail(params) {
		return this.request({url: this.baseUrl + '/' + params.data.id}, params)
	},


	/**
	 * 公共请求方法，参数都是JSON格式
	 * @param  {[type]} config 请求参数配置，比如请求头、超时时长等
	 * @param  {[type]} params 业务参数，
	 *                         {
	 *                         	url：接口地址，
	 *                         	data：业务参数，json格式，
	 *                         	success：业务请求成功后的回调，
	 *                         	failure：业务请求失败后的回调，即返回状态码不是“1“，
	 *                         	error：请求出错时的回调，请求响应状态不是200的情况
	 *                         }
	 * @return {[type]}        [description]
	 */
	request(config, params) {
		return Request.request(config, params)
	},

	postFile(config) {
		return Request.postFile(config)
	}
}
