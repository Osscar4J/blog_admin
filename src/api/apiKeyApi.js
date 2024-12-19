import request from './request'

export default {
  // 获取 API Key 列表
  getList(params) {
    return request({
      url: '/sys/apiKey',
      method: 'get',
      params
    })
  },

  // 新增或修改 API Key
  save(data) {
    return request({
      url: '/sys/apiKey',
      method: 'post',
      data
    })
  },

  // 删除 API Key
  delete(apiKey) {
    return request({
      url: '/sys/apiKey/' + apiKey,
      method: 'delete'
    })
  },

  // 刷新 API Key 缓存
  refresh(apiKey) {
    return request({
      url: '/sys/apiKey/refresh/' + apiKey,
      method: 'put'
    })
  }
} 
