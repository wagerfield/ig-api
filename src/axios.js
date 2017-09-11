import { create as axios } from 'axios'
import { path } from 'rambda'

const appToken = path('headers.x-security-token')
const clientToken = path('headers.cst')

export function create(apiKey, isDemo) {
  return axios({
    baseURL: `https://${isDemo ? 'demo-' : ''}api.ig.com/gateway/deal/`,
    headers: {
      'Accept': 'application/json; charset=UTF-8',
      'Content-Type': 'application/json; charset=UTF-8',
      'X-IG-API-KEY': apiKey
    }
  })
}

export function setHeaderTokens(instance, response) {
  instance.defaults.headers['X-SECURITY-TOKEN'] = appToken(response)
  instance.defaults.headers['CST'] = clientToken(response)
}

export default create
