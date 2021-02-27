import Vue from 'vue'

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
  this.$confirm(msg, this.$t('提示'), {
    confirmButtonText: this.$t('确定'),
    cancelButtonText: this.$t('取消'),
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
