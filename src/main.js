import Vue from 'vue'

import App from './App.vue'
import router from './router'
import { store } from './store'
import vuetify from './plugins/vuetify'
import VueClipboard from 'vue-clipboard2'
import SETTINGS from '@/store/settings'

import http from './plugins/axios'
import userAxios from './plugins/user-axios'

import '@/components/globals'

import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'
import '@/assets/css/main.scss'
import './registerServiceWorker'

Vue.use(VueClipboard)

Vue.config.productionTip = false
Vue.prototype.$axios = http
Vue.prototype.$userAxios = userAxios
Vue.prototype.$settings = SETTINGS

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
