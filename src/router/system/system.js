import Layout from '@/layout'

const route =  {
  path: '/system',
  component: Layout,
  redirect: '/attachment/index',
  alwaysShow: true, // will always show the root menu
  name: 'System',
  meta: {
    title: 'system',
    icon: 'el-icon-setting',
    roles: [
      'larke-admin.config.setting',
      'larke-admin.config.index',
      'larke-admin.menu.index'
    ] // you can set roles in root nav
  },
  children: [
    // 网站设置
    {
      path: '/config/setting',
      component: () => import('@/views/config/setting'),
      name: 'Setting',
      meta: {
        title: 'setting',
        icon: 'el-icon-setting',
        roles: [
          'larke-admin.config.setting'
        ]
      }
    },

    // 配置管理
    {
      path: '/config/index',
      component: () => import('@/views/config/index'),
      name: 'Config',
      meta: {
        title: 'config',
        icon: 'el-icon-s-operation',
        roles: [
          'larke-admin.config.index'
        ]
      }
    },

    // 菜单管理
    {
      path: '/menu/index',
      component: () => import('@/views/menu/index'),
      name: 'Menu',
      meta: {
        title: 'menu',
        icon: 'list',
        roles: [
          'larke-admin.menu.index'
        ]
      }
    }
  ]
}

export default route