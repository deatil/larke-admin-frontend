import variables from '@/styles/element-variables.scss'
import defaultSettings from '@/settings'

const { 
  title, 
  version, 
  showSettings, 
  tagsView, 
  fixedHeader, 
  sidebarLogo, 
  supportPinyinSearch,
  langMap
} = defaultSettings

const state = {
  theme: variables.theme,
  title, 
  version, 
  showSettings,
  tagsView,
  fixedHeader,
  sidebarLogo,
  supportPinyinSearch,
  langMap
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    // eslint-disable-next-line no-prototype-builtins
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  }
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

