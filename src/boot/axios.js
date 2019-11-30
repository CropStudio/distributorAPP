import axios from 'axios'

const axiosInstance = axios.create({
  // baseURL: 'http://103.230.48.151:5050'
  baseURL: 'http://103.230.48.151:5050'
})

export default async ({ Vue }) => {
  Vue.prototype.$axios = axiosInstance
}

export { axiosInstance }
