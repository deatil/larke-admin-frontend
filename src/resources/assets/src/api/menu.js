import request from '@/utils/request'

export function getMenuList(params) {
  return request({
    url: '/menu',
    method: 'get',
    params
  })
}

export function getMenuTree(params) {
  return request({
    url: '/menu/tree',
    method: 'get',
    params
  })
}

export function getMenuChildren(params) {
  return request({
    url: '/menu/children',
    method: 'get',
    params
  })
}

export function createMenu(data) {
  return request({
    url: '/menu',
    method: 'post',
    data
  })
}

export function updateMenu(id, data) {
  return request({
    url: `/menu/${id}`,
    method: 'put',
    data
  })
}

export function deleteMenu(id) {
  return request({
    url: `/menu/${id}`,
    method: 'delete'
  })
}

export function getMenuJson() {
  return request({
    url: '/menu/json',
    method: 'get'
  })
}

export function saveMenuJson(data) {
  return request({
    url: '/menu/save-json',
    method: 'put',
    data
  })
}

export function getMenusList() {
  return request({
    url: '/frontend/menus',
    method: 'get'
  })
}

export function getMenusTree() {
  return request({
    url: '/frontend/menus-tree',
    method: 'get'
  })
}

