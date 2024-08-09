import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

// ie11
import DatePicker from 'vue2-datepicker'
import 'vue2-datepicker/index.css'
import 'vue2-datepicker/locale/zh-cn'
Vue.use(DatePicker)

import 'normalize.css/normalize.css'
import '@/styles/index.scss'
import '@/styles/font.css'
import '@/resolution'

import '@/components/SvgIcon'

import './navigation-guards'

if (process.env.NODE_ENV === 'demo') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

import './filter'

Vue.config.productionTip = false
Vue.prototype.$publicPath = process.env.BASE_URL
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
