import request from './request'

export default {
  // 获取公告列表
  getList(params) {
    return request({
      url: '/sys/notice',
      method: 'get',
      params
    })
  },

  // 新增或修改公告
  save(data) {
    return request({
      url: '/sys/notice',
      method: 'post',
      data
    })
  },

  // 删除公告
  delete(id) {
    return request({
      url: `/sys/notice/${id}`,
      method: 'delete'
    })
  }
} 