import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/config',
    method: 'get',
    params
  })
}

export function getSettings() {
  return request({
    url: '/config/list',
    method: 'get'
  })
}

export function getDetail(id) {
  return request({
    url: `/config/${id}`,
    method: 'get'
  })
}

export function create(data) {
  return request({
    url: '/config',
    method: 'post',
    data
  })
}

export function update(id, data) {
  return request({
    url: `/config/${id}`,
    method: 'put',
    data
  })
}

export function deleteConfig(id) {
  return request({
    url: `/config/${id}`,
    method: 'delete'
  })
}

export function enable(id) {
  return request({
    url: `/config/${id}/enable`,
    method: 'patch'
  })
}

export function disable(id) {
  return request({
    url: `/config/${id}/disable`,
    method: 'patch'
  })
}

export function updateSort(id, listorder) {
  return request({
    url: `/config/${id}/sort`,
    method: 'patch',
    data: {
      listorder
    }
  })
}

export function getSetting() {
  return request({
    url: '/config/settings',
    method: 'get'
  })
}

export function setting(data) {
  return request({
    url: '/config/setting',
    method: 'put',
    data
  })
}
