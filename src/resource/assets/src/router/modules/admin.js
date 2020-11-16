import Layout from '@/layout'

const router = {
  path: '/admin',
  component: () => import('@/views/admin/index'),
  redirect: '/admin/index',
  name: 'Admin',
  meta: {
    title: 'Admin',
    icon: 'user',
    roles: ['larke-admin-admin-index'] // or you can only set roles in sub nav
  },
  children: [
    {
      path: '/admin/index',
      component: () => import('@/views/admin/index'),
      name: 'Admin',
      meta: {
        title: 'Admin',
        roles: ['larke-admin-admin-index'], // or you can only set roles in sub nav
        activeMenu: '/admin/index'
      },
    },
    {
      path: '/admin/create',
      component: () => import('@/views/admin/create'),
      name: 'CreateAdmin',
      meta: { 
        title: 'CreateAdmin', 
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

  ]
}

export default router
