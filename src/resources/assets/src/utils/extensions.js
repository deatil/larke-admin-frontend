import i18n from '@/lang'
import { assiginObj, getFileName } from '@/utils'

/** 
 * 加载路由
 */
let routers = []
const routeFiles = require.context('@/extension/', true, /router.js$/)
routeFiles.keys().map(item => {
  routers.push(routeFiles(item).default)
})

/** 
 * 加载扩展语言包 
 */
const extensionLangs = require.context('@/extension/', true, /lang\/[\w\/]+\.js$/)
extensionLangs.keys().map(item => {
  const langName = getFileName(item)
  const langMessage = extensionLangs(item).default

  const newLangMessage = assiginObj(i18n.messages[langName], langMessage)
  i18n.setLocaleMessage(langName, newLangMessage)
})

export default routers
