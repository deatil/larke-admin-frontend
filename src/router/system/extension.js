import Layout from '@/layout'

const route =  {
  path: '/extension',
  component: Layout,
  redirect: '/extension/index',
  alwaysShow: true, // will always show the root menu
  name: 'LocalExtension',
  meta: {
    title: 'localExtension',
    icon: 'el-icon-s-cooperation',
    roles: [
      'larke-admin.extension.index'
    ]
  },
  children: [
    // 扩展管理
    {
      path: '/extension/index',
      component: () => import('@/views/extension/index'),
      name: 'Extension',
      meta: {
        title: 'extension',
        icon: 'component',
        roles: [
          'larke-admin.extension.index'
        ]
      }
    },
    // 本地扩展
    {
      path: '/extension/local',
      component: () => import('@/views/extension/local'),
      name: 'LocalExtension',
      meta: {
        title: 'localExtension',
        activeMenu: '/extension/index',
        roles: [
          'larke-admin.extension.local'
        ]
      },
      hidden: true
    },
  ]
}

export default route