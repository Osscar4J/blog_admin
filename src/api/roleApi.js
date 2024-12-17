import BaseApi from './baseApi'

export default Object.create(BaseApi, {
	baseUrl: {value: '/role'},

	// 更新角色的菜单列表
	updateRoleMenus: {
		value: function(params) {
			return BaseApi.request({url: this.baseUrl + '/menus', method: 'PUT', data: params.data}, params)
		},
		enumerable: true
	}
})
