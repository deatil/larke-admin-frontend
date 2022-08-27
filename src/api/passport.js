import request from '@/utils/request'
import axios from '@/utils/axios'

export function captcha() {
  return axios({
    url: '/passport/captcha',
    method: 'get'
  })
}

export function passkey() {
  return axios({
    url: '/passport/passkey',
    method: 'get'
  })
}

export function login(data, header) {
  return request({
    url: '/passport/login',
    method: 'post',
    headers: header,
    data
  })
}

export function refreshToken(data) {
  return request({
    url: '/passport/refresh-token',
    method: 'put',
    data
  })
}

export function logout(data) {
  return request({
    url: '/passport/logout',
    method: 'delete',
    data
  })
}

