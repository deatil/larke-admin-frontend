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
    }
  ]
}

export default route