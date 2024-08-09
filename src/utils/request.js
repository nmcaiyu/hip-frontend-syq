import axios from 'axios'
import { Notification } from 'element-ui'
import store from '@/store'
import { getToken, removeToken } from '@/utils/auth'
import router from '@/router'

// create an axios instance
const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
    // withCredentials: true, // send cookies when cross-domain requests
    timeout: 60000 // request timeout
})

// request interceptor
service.interceptors.request.use(
    config => {
        // ie11
        if (window.navigator.userAgent.indexOf('Trident') > -1) {
          config.params = { ...config.params, t: new Date().getTime() };
        }

        if (store.state.auth.token) {
            // let each request carry token
            config.headers['token'] = getToken()
        }
        return config
    },
    error => {
        console.log(error) // for debug
        return Promise.reject(error)
    }
)

// response interceptor
service.interceptors.response.use(
    response => {
        const resp = response.data
        if (resp.code === 0) {
            return resp.data
        } else {
            return Promise.reject(resp)
        }
        // return Promise.reject(new Error(resp.message || 'Error'))
    },
    error => {
        store.dispatch('session/stopLoading')
        if (error.response && error.response.status === 401) {
            removeToken().then(() => {
                store.commit('auth/reset')
                router.push({ name: 'Home' }).catch(err => err)
            })
        } else {
            console.error(error) // for debug
            Notification({
                title: 'Error',
                message: error.message,
                type: 'error'
            })
            return Promise.reject(error)
        }
    }
)

export default service
