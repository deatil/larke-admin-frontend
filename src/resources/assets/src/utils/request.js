import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    config.headers['Content-Type'] = 'application/json;charset=utf-8'

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      // config.headers['X-Token'] = getToken()
      config.headers['Authorization'] = 'Bearer ' + getToken()
    }

    // 设置语言
    const language = store.getters.language
    const langMap = store.getters.langMap
    if (language in langMap) {
      config.headers['Locale-Language'] = langMap[language]
    }

    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

const subscribers = []
let isRefreshing = true

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    if (res.code !== 0) {
      // ACCESS TOKEN TIMEOUT
      if (res.code === 106) {
        if (isRefreshing) {
          store.dispatch('user/refreshToken').then(() => {
            subscribers.forEach((callback) => {
              callback()
            })
            isRefreshing = true
          })
        }
        isRefreshing = false

        return new Promise((resolve) => {
          subscribers.push(() => {
            resolve(service(response.config))
          })
        })
      }

      // Token expires;
      else if (res.code === 104 || res.code === 107) {
        // to re-login
        MessageBox.confirm('登陆已过期，是否重新登陆？', '登陆提示', {
          confirmButtonText: '重登',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })

        return false;
      }

      // AccessToken error;
      else if (res.code === 103 || res.code === 105) {
        Message({
          message: res.message || 'Error',
          type: 'error',
          duration: 3 * 1000
        })

        return false;
      }

      // 只拦截通用错误
      else if (res.code === 1 
        || res.code === 99997
        || res.code === 99998
        || res.code === 99999
      ) {
        Message({
          message: res.message || 'Error',
          type: 'error',
          duration: 3 * 1000
        })
      }

      // return Promise.reject(new Error(res.message || 'Error'))
      
      return Promise.reject(res)
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 3 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
