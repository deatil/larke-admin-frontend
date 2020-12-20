import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/log',
    method: 'get',
    params
  })
}

export function getDetail(id) {
  return request({
    url: `/log/${id}`,
    method: 'get'
  })
}

export function deleteLog(id) {
  return request({
    url: `/log/${id}`,
    method: 'delete'
  })
}

export function clearLog(data) {
  return request({
    url: '/log/clear',
    method: 'delete',
    data
  })
}
