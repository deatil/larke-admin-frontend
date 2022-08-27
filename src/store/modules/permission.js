import { isNumber, arraySort } from '@/utils'
import { asyncRoutes, constantRoutes } from '@/router'
import extensions from '@/utils/extensions'
import routes from '@/routes'

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
 * 菜单排序 
 */
function routesSort(route) {
  const newRoutes = { ...routes }

  let i = 0
  for (let key in newRoutes) {
    if (! isNumber(newRoutes[key])) {
      i++
      newRoutes[key] = 100+i      
    }
  }

  route.forEach(function(item, key) {
    if (item.name in newRoutes) {
      const sort = newRoutes[item.name]
      if (sort == undefined || sort == '') {
        route[key]['sort'] = 100
      } else {
        route[key]['sort'] = sort
      }
    } else {
      const sort = route[key]['sort']
      if (sort == undefined || sort == '') {
        route[key]['sort'] = 100
      }
    }

    if (item.children) {
      routesSort(item.children)
    }    
  })

  arraySort(route, 'sort')
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

      // 合并扩展路由
      const newAsyncRoutes = mergeExtension(asyncRoutes, extensions)

      // 排序
      routesSort(newAsyncRoutes)

      accessedRoutes = filterAsyncRoutes(newAsyncRoutes, roles)

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
