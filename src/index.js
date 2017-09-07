import { assign, isFunction } from 'lodash'
import { getOption, publicEncrypt } from './utils'
import { create, setHeaderTokens } from './api'
import { transformResponse } from './response'
import { transformError } from './error'

export default class IG {

  static transformResponse = transformResponse
  static transformError = transformError

  constructor(apiKey, isDemo, options) {
    this.api = create(apiKey, isDemo)
    this.defaults = assign({
      transformResponse,
      transformError
    }, options)
  }

  request(method, url, version, data, options) {
    const transformRes = getOption('transformResponse', options, this.defaults)
    const transformErr = getOption('transformError', options, this.defaults)
    const headers = { Version: version || 1 }

    let request = this.api.request({ method, url, data, headers })

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

  login(username, password, encrypt, options) {
    const processPassword = encrypt === true ?
      this.get('session/encryptionKey', 1, null, {
        transformResponse: transformResponse
      }).then(({ encryptionKey, timeStamp }) => {
        return publicEncrypt(encryptionKey, `${password}|${timeStamp}`)
      }) : Promise.resolve(password)

    return processPassword.then((result) => {
      return this.post('session', 2, {
        encryptedPassword: encrypt,
        identifier: username,
        password: result
      }, {
        transformResponse: false
      }).then((response) => {
        setHeaderTokens(this.api, response)
        const transformRes = getOption('transformResponse', options, this.defaults)
        return isFunction(transformRes) ? transformRes(response) : response
      })
    })
  }

  logout(options) {
    return this.delete('session', 1, null, options)
  }
}
