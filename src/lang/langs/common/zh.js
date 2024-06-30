export default {
  route: {
    dashboard: '控制台',
    profile: '我的信息',

    icons: '图标',

    system: '系统设置',
    setting: '网站设置',
    config: '配置管理',
    menu: '菜单管理',

    attachment: '附件管理',

    permission: '权限管理',
    admin: '管理员',
    adminIndex: '管理员列表',
    authGroup: '管理分组',
    authGroupTree: '分组结构',
    authRule: '权限路由',
    authRuleTree: '权限结构',

    localExtension: '本地扩展',
    extension: '扩展管理'
  },
  navbar: {
    dashboard: '首页',
    logOut: '退出登录',
    profile: '我的信息',
    avatar: '修改头像',
    theme: '换肤',
    size: '布局大小'
  },
  login: {
    title: '系统登录',
    logIn: '登录',
    username: '账号',
    password: '密码',
    captcha: '验证码',
    refreshCaptcha: '刷新验证码',
    refreshCaptchaTip: '点击刷新验证码',

    'rules_username_required': '请输入你的用户名',
    'rules_password_required': '密码不能少于6位',
    'rules_captcha_required': '请输入四位数验证码',
  },
  tagsView: {
    refresh: '刷新',
    close: '关闭',
    closeOthers: '关闭其它',
    closeAll: '关闭所有'
  },
  settings: {
    title: '系统布局配置',
    theme: '主题色',
    tagsView: '开启 Tags-View',
    fixedHeader: '固定 Header',
    sidebarLogo: '侧边栏 Logo'
  },
  
  err401: {
      'title': '你没有权限去该页面',
      'content': '你可以进行以下操作解决你的问题',
      'relogin': '退出重新登录',
  },
  
  err404: {
      'content': '点击链接刷新重试或者返回首页',
  },

  // 公用
  common: {
      'go_back': '返回',
      'go_home': '回首页',
      
      'tips': '提示',
      'ok': '确定',
      'cancel': '取消',
      'save': '提交',

      'enable' : '启用',
      'disable': '禁用',
      
      'detail': '详情',
      'edit': '编辑',
      'delete': '删除',

      'goto_top': '回到顶部',
      
      'clear_cache': '清空缓存',
      'clear_cache_success': '清空网站缓存成功',
      'confirm_clear_cache': '确认要清空网站缓存吗？',
      'clear_cache_doing': '清空网站缓存中...',
      
      'confirm_logout': '确认要退出登录吗？',
      
      'close_page': '关闭页面',
  },
}
