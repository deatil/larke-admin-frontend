const getters = {
  sidebar: state => state.app.sidebar,
  language: state => state.app.language,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,

  token: state => state.user.token,
  expiresIn: state => state.user.expires_in,
  refreshToken: state => state.user.refresh_token,
  name: state => state.user.name,
  nickname: state => state.user.nickname,
  avatar: state => state.user.avatar,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,

  systemTitle: state => state.settings.title,
  systemVersion: state => state.settings.version,
  langMap: state => state.settings.langMap,

  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs
}
export default getters
