import i18n from '@/lang'
import { assiginObj } from '@/utils'

const routeFiles = require.context('@/extension/', true, /router.js$/)

let routers = []
routeFiles.keys().map(item => {
  routers.push(routeFiles(item).default)
})

/** 扩展语言包 */
const locale = i18n.locale
if (locale == 'zh') {
  const extensionZhs = require.context('@/extension/', true, /zh.js$/)
  extensionZhs.keys().map(item => {
    const zh2 = extensionZhs(item).default
    const zhMessages2 = assiginObj(i18n.messages.zh, zh2)
    i18n.setLocaleMessage('zh', zhMessages2)
  })
}

if (locale == 'en') {
  const extensionEns = require.context('@/extension/', true, /en.js$/)
  extensionEns.keys().map(item => {
    const en2 = extensionEns(item).default
    const enMessages2 = assiginObj(i18n.messages.en, en2)
    i18n.setLocaleMessage('en', enMessages2)
  })
}

export default routers
