import { path } from 'rambda'

const message = path('message')
const statusCode = path('response.status')
const statusText = path('response.statusText')
const errorCode = path('response.data.errorCode')
const method = path('config.method')
const params = path('config.params')
const data = path('config.data')
const url = path('config.url')

export default function IGError(error) {
  console.error(error)
  this.name = 'IGError'
  this.type = error.response ? 'response' : error.request ? 'request' : 'internal'
  this.message = message(error)
  if (error.config) {
    this.url = url(error)
    this.data = data(error)
    this.params = params(error)
    this.method = method(error)
  }
  if (error.response) {
    this.errorCode = errorCode(error)
    this.statusCode = statusCode(error)
    this.statusText = statusText(error)
  }
}
