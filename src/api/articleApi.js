import BaseApi from './baseApi'

export default Object.create(BaseApi, {
	baseUrl: {value: '/article'},
	list: {
		value: function(params) {
			BaseApi.request({url: this.baseUrl + '/list', method: 'GET', params: params.data}, params)
		},
		enumerable: true
	}
})
