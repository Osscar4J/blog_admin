import BaseApi from './baseApi'

export default Object.create(BaseApi, {
	baseUrl: {value: '/user'},

	getUserInfo: {
		value: function(params) {
			return BaseApi.request({url: this.baseUrl + '/info', method: 'GET'}, params)
		},
		enumerable: true
	},

	updateRoles: {
		value: function(params) {
			return BaseApi.request({url: this.baseUrl + '/roles', method: 'PUT', data: params.data}, params)
		},
		enumerable: true
	}
})
