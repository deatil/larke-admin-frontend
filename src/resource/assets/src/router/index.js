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
    path: '/system',
    component: Layout,
    redirect: '/attachment/index',
    alwaysShow: true, // will always show the root menu
    name: 'System',
    meta: {
      title: 'System',
      icon: 'el-icon-setting',
      roles: ['larke-admin-attachment-index'] // you can set roles in root nav
    },
    children: [
      // 附件管理
      {
        path: '/attachment/index',
        component: () => import('@/views/attachment/index'),
        name: 'Attachment',
        meta: {
          title: 'Attachment',
          icon: 'el-icon-paperclip',
          roles: ['larke-admin-attachment-index'] // or you can only set roles in sub nav
        }
      }
    ]
  },

  {
    path: '/permission',
    component: Layout,
    redirect: '/admin/index',
    alwaysShow: true, // will always show the root menu
    name: 'Permission',
    meta: {
      title: 'Permission',
      icon: 'el-icon-s-management',
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
          icon: 'peoples',
          roles: ['larke-admin-admin-index'] // or you can only set roles in sub nav
        }
      },

      // 用户组
      {
        path: '/auth/group/index',
        component: () => import('@/views/auth-group/index'),
        name: 'AuthGroup',
        meta: {
          title: 'AuthGroup',
          icon: 'el-icon-s-operation',
          roles: ['larke-admin-auth-group-index'] 
        }
      },
      {
        path: '/auth/group/tree',
        component: () => import('@/views/auth-group/tree'),
        name: 'AuthGroupTree',
        meta: {
          title: 'AuthGroupTree',
          roles: ['larke-admin-auth-group-index'],
          activeMenu: '/auth/group/index'
        },
        hidden: true
      },

      // 权限
      {
        path: '/auth/rule/index',
        component: () => import('@/views/auth-rule/index'),
        name: 'AuthRule',
        meta: {
          title: 'AuthRule',
          icon: 'el-icon-menu',
          roles: ['larke-admin-auth-rule-index'] 
        }
      },
      {
        path: '/auth/rule/tree',
        component: () => import('@/views/auth-rule/tree'),
        name: 'AuthRuleTree',
        meta: {
          title: 'AuthRuleTree',
          roles: ['larke-admin-auth-rule-index'],
          activeMenu: '/auth/rule/index'
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
          icon: 'el-icon-document-add',
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
