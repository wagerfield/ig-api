import { path } from 'rambda'

const message = path('message')
const statusCode = path('response.status')
const statusText = path('response.statusText')
const errorCode = path('response.data.errorCode')

export function IGError(error) {
  Object.assign(this, error)
  this.name = 'IGError'
}

export function createError(error) {
  if (error.response) {
    return new IGError({
      type: 'response',
      message: message(error),
      statusCode: statusCode(error),
      statusText: statusText(error),
      errorCode: errorCode(error)
    })
  } else {
    return new IGError({
      type: 'request',
      message: message(error)
    })
  }
}
