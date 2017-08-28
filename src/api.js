import { get, assign } from 'lodash'
import axios from 'axios'

export function create(apiKey, isDemo) {
  return axios.create({
    baseURL: `https://${isDemo ? 'demo-' : ''}api.ig.com/gateway/deal/`,
    headers: {
      'Accept': 'application/json; charset=UTF-8',
      'Content-Type': 'application/json; charset=UTF-8',
      'X-IG-API-KEY': apiKey
    }
  })
}

export function setTokens(apiInstance, response) {
  assign(apiInstance.defaults.headers, {
    'X-SECURITY-TOKEN': get(response, 'headers.x-security-token', ''),
    'CST': get(response, 'headers.cst', '')
  })
}

export function pickData(response) {
  return response.data
}

export default create
