import { path } from 'rambda'

const statusCode = path('status')
const statusText = path('statusText')
const errorCode = path('data.errorCode')
const headers = path('headers')
const method = path('method')
const params = path('params')
const data = path('data')
const url = path('url')

export default function createError({ message, request, response, config }) {
  const error = new Error(message)
  error.type = response ? 'response' : request ? 'request' : 'internal'
  if (config) {
    error.url = url(config)
    error.data = data(config)
    error.params = params(config)
    error.method = method(config)
    error.headers = headers(config)
  }
  if (response) {
    error.errorCode = errorCode(response)
    error.statusCode = statusCode(response)
    error.statusText = statusText(response)
  }
  return error
}
