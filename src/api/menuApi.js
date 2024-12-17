import BaseApi from './baseApi'

export default Object.create(BaseApi, {
    baseUrl: {value: '/menu'},
    
    getListByRole: {
		value: function(params) {
			return BaseApi.request({url: this.baseUrl + '/listByRole', method: 'GET', params: params.data}, params)
		},
		enumerable: true
	}
})
