import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
// import tableRouter from './modules/table'

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'dashboard', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: 'profile', icon: 'user', noCache: true }
      }     
    ]
  },

  {
    path: '/icon',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/icons/index'),
        name: 'Icons',
        meta: { title: 'icons', icon: 'icon', noCache: true }
      }
    ]
  },
    
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/permission',
    component: Layout,
    redirect: '/admin/index',
    alwaysShow: true, // will always show the root menu
    name: 'Permission',
    meta: {
      title: 'Permission',
      icon: 'user',
      roles: ['larke-admin-admin-index'] // you can set roles in root nav
    },
    children: [
      // 管理员
      {
        path: '/admin/index',
        component: () => import('@/views/admin/index'),
        name: 'Admin',
        meta: {
          title: 'Admin',
          icon: 'user',
          roles: ['larke-admin-admin-index'] // or you can only set roles in sub nav
        }
      },
      {
        path: '/admin/create',
        component: () => import('@/views/admin/create'),
        name: 'CreateAdmin',
        meta: { 
          title: 'CreateAdmin', 
          icon: 'edit',
          roles: ['larke-admin-admin-create'],
          activeMenu: '/admin/index'
        },
        hidden: true
      },
      {
        path: '/admin/edit/:id(\\w+)',
        component: () => import('@/views/admin/edit'),
        name: 'EditAdmin',
        meta: { 
          title: 'EditAdmin', 
          noCache: true, 
          roles: ['larke-admin-admin-update'],
          activeMenu: '/admin/index' 
        },
        hidden: true
      },

      // 日志
      {
        path: '/adminlog/index',
        component: () => import('@/views/adminlog/index'),
        name: 'AdminLog',
        meta: {
          title: 'AdminLog',
          icon: 'user',
          roles: ['larke-admin-log-index'] 
        }
      },      

    ]
  },
  
  /** when your routing map is too long, you can split it into small modules **/
  // tableRouter,
  
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
