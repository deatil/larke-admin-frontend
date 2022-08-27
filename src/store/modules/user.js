import md5 from 'js-md5'
import JSEncrypt from 'jsencrypt'
import { 
  captcha, 
  passkey, 
  login, 
  refreshToken, 
  logout 
} from '@/api/passport'
import { getInfo, getRoles } from '@/api/user'
import {
  getToken, setToken, removeToken,
  getTokenExpiresIn, setTokenExpiresIn, removeTokenExpiresIn,
  getRefreshToken, setRefreshToken, removeRefreshToken
} from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  expires_in: getTokenExpiresIn(),
  refresh_token: getRefreshToken(),
  name: '',
  nickname: '',
  avatar: require('@/assets/larke/avatar-default.jpg'),
  introduction: '',
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_EXPIRED_IN: (state, time) => {
    state.expires_in = time
  },
  SET_REFRESH_TOKEN: (state, refresh_token) => {
    state.refresh_token = refresh_token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_NICKNAME: (state, nickname) => {
    state.nickname = nickname
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  captcha({ commit }) {
    return new Promise((resolve, reject) => {
      captcha().then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  passkey({ commit }) {
    return new Promise((resolve, reject) => {
      passkey().then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user login
  login({ commit }, userInfo) {
    const { 
      username, password, 
      captcha, captchaKey, 
      passkeyId, passkey 
    } = userInfo

    // 密码加密
    var encrypt = new JSEncrypt();
    encrypt.setPublicKey(passkey);
    var encryptedPwd = encrypt.encrypt(md5(password));

    return new Promise((resolve, reject) => {
      login({
        name: username.trim(),
        password: passkeyId + encryptedPwd,
        captcha: captcha
      }, {
        'Larke-Admin-Captcha-Id': captchaKey
      }).then(response => {
        const { data } = response
        const token = data.access_token.trim()
        const expires_in = parseInt(data.expires_in) + (Date.parse(new Date())/1000)
        const refresh_token = data.refresh_token

        commit('SET_TOKEN', token)
        commit('SET_EXPIRED_IN', expires_in)
        commit('SET_REFRESH_TOKEN', refresh_token)

        setToken(token)
        setTokenExpiresIn(expires_in)
        setRefreshToken(refresh_token)
        
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { name, nickname, avatar, introduction } = data

        commit('SET_NAME', name)
        commit('SET_NICKNAME', nickname)
        commit('SET_AVATAR', avatar)
        commit('SET_INTRODUCTION', introduction)

        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // getRoles
  getRoles({ commit, state }) {
    return new Promise((resolve, reject) => {
      getRoles().then(response => {
        const { data } = response

        const roles = data.list

        commit('SET_ROLES', roles)

        resolve({
          roles: roles
        })
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    // 请求后台退出，先取消本地存储再请求退出
    return new Promise((resolve, reject) => {
      const refresh_token = getRefreshToken()
      logout({
        refresh_token: refresh_token
      }).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_EXPIRED_IN', '')
        commit('SET_REFRESH_TOKEN', '')
        commit('SET_ROLES', [])

        removeToken()
        removeTokenExpiresIn()
        removeRefreshToken()

        resetRouter()

        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // refresh token
  refreshToken({ commit }) {
    return new Promise((resolve, reject) => {
      const refresh_token = getRefreshToken()
      refreshToken({
        refresh_token: refresh_token
      }).then(response => {
        const { data } = response
        const token = data.access_token.trim()
        const expires_in = data.expires_in

        commit('SET_TOKEN', token)
        commit('SET_EXPIRED_IN', expires_in)

        setToken(token)
        setTokenExpiresIn(expires_in)

        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_EXPIRED_IN', '')
      commit('SET_REFRESH_TOKEN', '')
      commit('SET_ROLES', [])

      removeToken()
      removeTokenExpiresIn()
      removeRefreshToken()

      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getRoles')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
