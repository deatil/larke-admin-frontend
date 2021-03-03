import request from '@/utils/request'

export function getGroupList(params) {
  return request({
    url: '/auth/group',
    method: 'get',
    params
  })
}

export function getGroupTreeList(params) {
  return request({
    url: '/auth/group/tree',
    method: 'get',
    params
  })
}

export function getGroupChildrenList(params) {
  return request({
    url: '/auth/group/children',
    method: 'get',
    params
  })
}

export function getGroupDetail(id) {
  return request({
    url: `/auth/group/${id}`,
    method: 'get'
  })
}

export function createGroup(data) {
  return request({
    url: '/auth/group',
    method: 'post',
    data
  })
}

export function updateGroup(id, data) {
  return request({
    url: `/auth/group/${id}`,
    method: 'put',
    data
  })
}

export function deleteGroup(id) {
  return request({
    url: `/auth/group/${id}`,
    method: 'delete'
  })
}

export function updateGroupSort(id, listorder) {
  return request({
    url: `/auth/group/${id}/sort`,
    method: 'patch',
    data: {
      listorder
    }
  })
}

export function enableGroup(id) {
  return request({
    url: `/auth/group/${id}/enable`,
    method: 'patch'
  })
}

export function disableGroup(id) {
  return request({
    url: `/auth/group/${id}/disable`,
    method: 'patch'
  })
}

export function updateGroupAccess(id, data) {
  return request({
    url: `/auth/group/${id}/access`,
    method: 'patch',
    data
  })
}
