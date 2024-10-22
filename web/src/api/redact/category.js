import request from '@/api/request'

export default {

  getOne (connectionId, id) {
    return request.get(`/connections/${connectionId}/categories/${id}`)
  },
  getAll (connectionId) {
    return request.get(`/connections/${connectionId}/categories`)
  },
  create (connectionId, payload) {
    return request.post(`/connections/${connectionId}/categories`, payload)
  },
  delete (connId, id) {
    return request.delete(`/connections/${connId}/categories/${id}`)
  },
  update (connectionId, payload) {
    const { id } = payload
    return request.put(`/connections/${connectionId}/categories/${id}`, payload)
  }
}
