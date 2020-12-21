import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/extension/index',
    method: 'get',
    params
  })
}

export function getLocalList(params) {
  return request({
    url: '/extension/local',
    method: 'get',
    params
  })
}

export function install(name) {
  return request({
    url: `/extension/install/${name}`,
    method: 'post'
  })
}

export function uninstall(name) {
  return request({
    url: `/extension/uninstall/${name}`,
    method: 'delete'
  })
}

export function upgrade(name) {
  return request({
    url: `/extension/upgrade/${name}`,
    method: 'put'
  })
}

export function updateConfig(name, data) {
  return request({
    url: `/extension/${name}/config`,
    method: 'put',
    data
  })
}

export function updateSort(id, listorder) {
  return request({
    url: `/extension/${id}/sort`,
    method: 'patch',
    data: {
      listorder
    }
  })
}

export function enable(name) {
  return request({
    url: `/extension/${name}/enable`,
    method: 'patch'
  })
}

export function disable(name) {
  return request({
    url: `/extension/${name}/disable`,
    method: 'patch'
  })
}

