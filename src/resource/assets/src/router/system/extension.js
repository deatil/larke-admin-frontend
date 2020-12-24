import Layout from '@/layout'

const route =  {
  path: '/extension',
  component: Layout,
  redirect: '/extension/index',
  alwaysShow: true, // will always show the root menu
  name: 'LocalExtension',
  meta: {
    title: 'LocalExtension',
    icon: 'el-icon-s-cooperation',
    roles: ['larke-admin.extension.index'] // you can set roles in root nav
  },
  children: [
    // 扩展管理
    {
      path: '/extension/index',
      component: () => import('@/views/extension/index'),
      name: 'Extension',
      meta: {
        title: 'Extension',
        icon: 'component',
        roles: ['larke-admin.extension.index'] // or you can only set roles in sub nav
      }
    }
  ]
}

export default route