import BaseApi from './baseApi'

export default Object.create(BaseApi, {
	baseUrl: {value: ''},
	login: {
		value: function(params) {
			BaseApi.request({url: this.baseUrl + '/login', method: 'POST', data: params.data}, params)
		},
		enumerable: true
	}
})
