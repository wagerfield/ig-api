import 'es6-promise/auto'
import { isBoolean } from 'lodash'
import { create, setTokens, pickData } from './api'
import { handleError } from './error'

export default class IG {

  constructor(apiKey, isDemo, pick) {
    this.api = create(apiKey, isDemo)
    this.pick = pick !== false
  }

  request(method, url, version, data, pick) {
    const headers = { Version: version || 1 }
    const request = this.api.request({
      method, url, data, headers
    }).catch(handleError)
    const shouldPick = isBoolean(pick) ? pick : this.pick
    return shouldPick ? request.then(pickData) : request
  }

  get(url, version, data, pick) {
    return this.request('get', url, version, data, pick)
  }

  put(url, version, data, pick) {
    return this.request('put', url, version, data, pick)
  }

  post(url, version, data, pick) {
    return this.request('post', url, version, data, pick)
  }

  delete(url, version, data, pick) {
    return this.request('delete', url, version, data, pick)
  }

  login(username, password, pick) {
    return this.post('session', 2, {
      encryptedPassword: false,
      identifier: username,
      password: password
    }, false).then((response) => {
      setTokens(this.api, response)
      const shouldPick = isBoolean(pick) ? pick : this.pick
      return shouldPick ? response.data : response
    })
  }

  logout(pick) {
    return this.delete('session', 1, null, pick)
  }
}
