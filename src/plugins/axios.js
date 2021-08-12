import axios from 'axios'
import { store } from '@/store/index';

var axiosConfig = {
  // baseURL: 'http://localhost/api/v1/', // only for testing NOT mainnet
  baseURL: 'https://app.unicrypt.network/api/v1/',
  timeout: 30000
}

const http = axios.create(axiosConfig)

http.interceptors.response.use(
  (config) => {
    return config
  },
  (error) => {
    console.log(error)
    if (error.response.status === 401) {
      // sign out remove token
      store.commit('logout')
      // router.push('/account')
    }
    return Promise.reject(error)
  })

export default http