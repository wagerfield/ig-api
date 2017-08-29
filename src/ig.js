import 'es6-promise/auto'
import { assign, isFunction } from 'lodash'
import { create, setHeaderTokens } from './api'
import { transformResponse } from './response'
import { transformError } from './error'
import { getOption } from './utils'

export default class IG {

  constructor(apiKey, isDemo, options) {
    this.api = create(apiKey, isDemo)
    this.defaults = assign({
      transformResponse,
      transformError
    }, options)
  }

  request(method, url, version, data, options) {
    const headers = { Version: version || 1 }
    let request = this.api.request({ method, url, data, headers })

    const transformRes = getOption('transformResponse', options, this.defaults)
    const transformErr = getOption('transformError', options, this.defaults)

    if (isFunction(transformRes)) request = request.then(transformRes)
    if (isFunction(transformErr)) request = request.catch(transformErr)

    return request
  }

  get(url, version, data, options) {
    return this.request('get', url, version, data, options)
  }

  put(url, version, data, options) {
    return this.request('put', url, version, data, options)
  }

  post(url, version, data, options) {
    return this.request('post', url, version, data, options)
  }

  delete(url, version, data, options) {
    return this.request('delete', url, version, data, options)
  }

  login(username, password, options) {
    return this.post('session', 2, {
      encryptedPassword: false,
      identifier: username,
      password: password
    }, {
      transformResponse: false
    }).then((response) => {
      setHeaderTokens(this.api, response)
      const transformRes = getOption('transformResponse', options, this.defaults)
      return isFunction(transformRes) ? transformRes(response) : response
    })
  }

  logout(options) {
    return this.delete('session', 1, null, options)
  }
}
