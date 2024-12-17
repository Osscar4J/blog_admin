import BaseApi from './baseApi'

export default Object.create(BaseApi, {
	baseUrl: {value: '/tool'},
	portScanner: {
		value: function(params) {
			return BaseApi.request({url: this.baseUrl + '/port-map', method: 'POST', data: params.data}, params)
		},
		enumerable: true
	}
})
