import { create, setHeaderTokens } from './axios'
import {
  uniqueId,
  getOption,
  isFunction,
  publicEncrypt,
  transformError,
  transformResponse
} from './utils'

export default class IG {

  static transformResponse = transformResponse
  static transformError = transformError
  static uniqueId = uniqueId

  constructor(apiKey, isDemo, options) {
    this.api = create(apiKey, isDemo)
    this.defaults = Object.assign({
      transformResponse,
      transformError
    }, options)
  }

  request(method, path, version, config, options) {
    const transformRes = getOption('transformResponse', options, this.defaults)
    const transformErr = getOption('transformError', options, this.defaults)
    
    // Account for Delete inconsistensies as per 
    // https://labs.ig.com/node/36 which is still 
    // not resolved.
    let headers = { Version: version || 1 };
    
    if(method === 'delete'){
      method = 'post';
      headers['_method'] = 'DELETE';
    }

    let request = this.api.request(Object.assign({}, config, {
      method, url: path, headers: headers
    }))

    if (isFunction(transformRes)) request = request.then(transformRes)
    if (isFunction(transformErr)) request = request.catch(transformErr)

    return request
  }

  get(path, version, params, options) {
    return this.request('get', path, version, { params }, options)
  }

  post(path, version, data, options) {
    return this.request('post', path, version, { data }, options)
  }

  put(path, version, data, options) {
    return this.request('put', path, version, { data }, options)
  }

  delete(path, version, data, options) {
    return this.request('delete', path, version, { data }, options)
  }

  login(username, password, encryptPassword, options) {
    const encryptedPassword = encryptPassword === true
    const processPassword = encryptedPassword ?
      this.get('session/encryptionKey', 1, null, {
        transformResponse: transformResponse
      }).then(({ encryptionKey, timeStamp }) => {
        return publicEncrypt(encryptionKey, `${password}|${timeStamp}`)
      }) : Promise.resolve(password)

    return processPassword.then((result) => {
      return this.post('session', 2, {
        encryptedPassword,
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
