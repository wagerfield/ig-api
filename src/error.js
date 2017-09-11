import { path } from 'rambda'

const message = path('message')
const status = path('response.status')
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
      status: status(error),
      statusText: statusText(error),
      code: errorCode(error)
    })
  } else {
    return new IGError({
      type: 'request',
      message: message(error)
    })
  }
}
