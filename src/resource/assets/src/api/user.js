import request from '@/utils/request'

export function getInfo() {
  return request({
    url: '/profile',
    method: 'get'
  })
}

export function getRoles() {
  return request({
    url: '/frontend/roles',
    method: 'get'
  })
}

export function changePassword(data) {
  return request({
    url: '/profile/password',
    method: 'patch',
    data
  })
}

export function updateInfo(data) {
  return request({
    url: '/profile/update',
    method: 'put',
    data
  })
}

export function updateAvatar(data) {
  return request({
    url: '/profile/avatar',
    method: 'patch',
    data
  })
}
