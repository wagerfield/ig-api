import { get, assign } from 'lodash'

export function IGError(error) {
  assign(this, error)
  this.name = 'IGError'
}

export function createError(error) {
  if (error.response) {
    return new IGError({
      type: 'response',
      message: get(error, 'message'),
      status: get(error, 'response.status'),
      statusText: get(error, 'response.statusText'),
      code: get(error, 'response.data.errorCode')
    })
  } else {
    return new IGError({
      type: 'request',
      message: get(error, 'message')
    })
  }
}
