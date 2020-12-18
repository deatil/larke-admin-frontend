import { getInfo } from '@/api/system'

const state = {
  name: 'LarkeAdmin ',
  version: '1.0.2',
  info: {}
}

const mutations = {
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_VERSION: (state, version) => {
    state.version = version
  },  
  SET_INFO: (state, info) => {
    state.info = info
  }
}

const actions = {
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const { data } = response

        commit('SET_INFO', data)
        commit('SET_NAME', data.admin.name)
        commit('SET_VERSION', data.admin.version)

        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
