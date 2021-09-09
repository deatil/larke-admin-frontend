import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/admin',
    method: 'get',
    params
  })
}

export function getDetail(id) {
  return request({
    url: `/admin/${id}`,
    method: 'get'
  })
}

export function getRules(id) {
  return request({
    url: `/admin/${id}/rules`,
    method: 'get'
  })
}

export function getGroups() {
  return request({
    url: '/admin/groups',
    method: 'get'
  })
}

export function createAdmin(data) {
  return request({
    url: '/admin',
    method: 'post',
    data
  })
}

export function updateAdmin(id, data) {
  return request({
    url: `/admin/${id}`,
    method: 'put',
    data
  })
}

export function deleteAdmin(id) {
  return request({
    url: `/admin/${id}`,
    method: 'delete'
  })
}

export function enableAdmin(id) {
  return request({
    url: `/admin/${id}/enable`,
    method: 'patch'
  })
}

export function disableAdmin(id) {
  return request({
    url: `/admin/${id}/disable`,
    method: 'patch'
  })
}

export function updatePassword(id, data) {
  return request({
    url: `/admin/${id}/password`,
    method: 'patch',
    data
  })
}

export function updateAccess(id, data) {
  return request({
    url: `/admin/${id}/access`,
    method: 'patch',
    data
  })
}

export function logoutAdmin(refreshToken) {
  return request({
    url: `/admin/logout/${refreshToken}`,
    method: 'delete'
  })
}

