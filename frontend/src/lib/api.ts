import { Config } from '@/config/config'
import axios from 'axios'

const instance = axios.create({
  baseURL: `${Config.ApiBaseUrl}/api/v1`,
  headers: {
    'Content-type': 'application/json',
  },
})


export const api = instance;