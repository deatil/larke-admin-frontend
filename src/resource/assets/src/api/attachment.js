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
