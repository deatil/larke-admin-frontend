import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import i18n from './lang' // internationalization
import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log

import * as filters from './filters' // global filters

import ElTreeGrid from 'element-tree-grid'

import JsonViewer from 'vue-json-viewer'

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
/*
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}
*/

Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

Vue.component(ElTreeGrid.name, ElTreeGrid)

Vue.use(JsonViewer)

/* 提示快速封装 */
Vue.prototype.successTip = function(msg, callback) {
  this.$message({
    showClase: true,
    message: msg,
    type: 'success',
    duration: 3 * 1000,
    onClose: callback
  })  
}
Vue.prototype.errorTip = function(msg, callback) {
  this.$message({
    showClase: true,
    message: msg,
    type: 'error',
    duration: 3 * 1000,
    onClose: callback
  })  
}
Vue.prototype.infoTip = function(msg) {
  this.$message.info(msg)
}
Vue.prototype.confirmTip = function(msg, okCallback, noCallback) {
  this.$confirm(msg, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    if (typeof okCallback == 'function') {
      okCallback()
    }
  }).catch(() => {
    if (typeof noCallback == 'function') {
      noCallback()
    }
  })
}

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
