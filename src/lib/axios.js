import Axios from 'axios'
const axios = Axios.create({
  baseURL: 'http://192.168.1.112:3000',
  timeout: 2000
})

export default axios