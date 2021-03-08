import request from '@/utils/request'

export function getInfo() {
  return request({
    url: '/system/info',
    method: 'get'
  })
}

export function getLang(group, locale = '') {
  return request({
    url: '/system/lang',
    method: 'get',
    params: { 
      group, 
      locale 
    }
  })
}

export function setLang(locale) {
  return request({
    url: `/system/lang/${locale}`,
    method: 'patch'
  })
}

export function postCache() {
  return request({
    url: '/system/cache',
    method: 'post'
  })
}

export function clearCache() {
  return request({
    url: '/system/clear-cache',
    method: 'post'
  })
}
