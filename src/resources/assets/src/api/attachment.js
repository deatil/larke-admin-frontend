import request from '@/utils/request'

export function getAttachmentList(params) {
  return request({
    url: '/attachment',
    method: 'get',
    params
  })
}

export function getAttachmentDetail(id) {
  return request({
    url: `/attachment/${id}`,
    method: 'get'
  })
}

export function deleteAttachment(id) {
  return request({
    url: `/attachment/${id}`,
    method: 'delete'
  })
}

export function uploadAttachment(data) {
  return request({
    url: `/upload/file`,
    method: 'post',
    data
  })
}

export function enableAttachment(id) {
  return request({
    url: `/attachment/${id}/enable`,
    method: 'patch'
  })
}

export function disableAttachment(id) {
  return request({
    url: `/attachment/${id}/disable`,
    method: 'patch'
  })
}

export function getAttachmentDowncode(id) {
  return request({
    url: `/attachment/downcode/${id}`,
    method: 'get'
  })
}

export function getAttachmentDownloadUrl(code) {
  const baseUrl = process.env.VUE_APP_BASE_API
  if (baseUrl.substring(baseUrl.length, baseUrl.length - 1) == '/') {
    return baseUrl.substring(0, baseUrl.length - 1) + '/attachment/download/' + code
  } else {
    return baseUrl + '/attachment/download/' + code
  }
}
