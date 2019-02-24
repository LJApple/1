import axios from 'axios'
// import store from '@/store'
import { getToken,  removeToken} from '@/utils/auth'
import * as tools from './tools'
import { router } from '../router'
const baseURL = 'http://tyg.sztymk.com:1004/rbac-v1.0'

const http = axios.create({
  baseURL,
  timeout: 30000
})

// request 拦截器
http.interceptors.request.use(
  config => {
    const token = getToken()
    if (token) {
      config.headers['Authorization'] = token
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// respone 拦截器
http.interceptors.response.use(
  response => {
    const res = response.data
    if (res.error) {
      tools.notify({
        type: 'error',
        message: res.error.message
      })
      return Promise.reject(res)
    }
    return Promise.resolve(res)
  },
  error => {
    tools.notify({
      type: 'error',
      message: error.message,
      duration: 5000
    })
    const {status} = error.response
    if (status === 403 || status === 401) {
      removeToken()
      router.replace({
        path: '/login'
      })
    }
    return Promise.reject(error)
  }
)

export default http
