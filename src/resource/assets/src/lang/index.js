import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Cookies from 'js-cookie'
import { assiginObj, getFileName } from '@/utils'
import elementEnLocale from 'element-ui/lib/locale/lang/en' // element-ui lang
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN'// element-ui lang

Vue.use(VueI18n)

const messages = {
  en: {
    ...elementEnLocale
  },
  zh: {
    ...elementZhLocale
  }
}

export function getLanguage() {
  const chooseLanguage = Cookies.get('language')
  if (chooseLanguage) return chooseLanguage

  // if has not choose language
  const language = (navigator.language || navigator.browserLanguage).toLowerCase()
  const locales = Object.keys(messages)
  for (const locale of locales) {
    if (language.indexOf(locale) > -1) {
      return locale
    }
  }
  return 'en'
}
const i18n = new VueI18n({
  // set locale
  // options: en | zh
  locale: getLanguage(),
  fallbackLocale: 'zh',
  formatFallbackMessages: true,
  silentTranslationWarn: false,
  silentFallbackWarn: false,
  // set locale messages
  messages
})

// 动态加载系统语言包
const langs = require.context('./langs/', true, /\.js$/)
langs.keys().map(item => {
  const langName = getFileName(item)
  const langMessage = langs(item).default

  const newLangMessage = assiginObj(i18n.messages[langName], langMessage)
  i18n.setLocaleMessage(langName, newLangMessage)
})

export default i18n
