import request from './request'

export default {

  getCategories (connectionId) {
    return request.get(`/connections/${connectionId}/categories`)
  },
  create (params) {
    const { connectionId, ...payload } = params
    return request.post(`/connections/${connectionId}/categories`, payload)
  },
  delete (params) {
    const { connectionId, id } = params
    return request.delete(`/connections/${connectionId}/categories/${id}`)
  },
  update (params) {
    const { connectionId, id, ...payload } = params
    return request.update(`/connections/${connectionId}/categories/${id}`, payload)
  }
}
