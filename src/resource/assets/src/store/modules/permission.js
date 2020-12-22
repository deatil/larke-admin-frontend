import { asyncRoutes, constantRoutes } from '@/router'
import extensions from '@/utils/extensions'

/** 
 * 合并扩展路由 
 */
function mergeExtension(routes, extensionRoutes) {
  const res = []

  const route404 = routes.pop()

  routes.forEach(route => {
    const tmp = { ...route }
    res.push(tmp)
  })

  extensionRoutes.forEach(route => {
    const tmp = { ...route }
    res.push(tmp)
  }) 

  const tmp404 = { ...route404 }
  res.push(tmp404)

  return res  
}

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes

      const asyncRoutes2 = mergeExtension(asyncRoutes, extensions)

      accessedRoutes = filterAsyncRoutes(asyncRoutes2, roles)

      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
