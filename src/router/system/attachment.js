import Layout from '@/layout'

const route =  {
  path: '/attachment',
  component: Layout,
  redirect: '/attachment/index',
  alwaysShow: true, // will always show the root menu
  name: 'Attachment',
  meta: {
    title: 'attachment',
    icon: 'el-icon-paperclip',
    roles: [
      'larke-admin.attachment.index'
    ] // you can set roles in root nav
  },
  children: [
    // 附件管理
    {
      path: '/attachment/index',
      component: () => import('@/views/attachment/index'),
      name: 'Attachment',
      meta: {
        title: 'attachment',
        icon: 'el-icon-document',
        roles: [
          'larke-admin.attachment.index'
        ]
      }
    }
  ]
}

export default route