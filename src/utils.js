import pidcrypt from 'pidcrypt'
import {
  path,
  pipe,
  type,
  equals
} from 'rambda'
import {
  toByteArray,
  decodeBase64,
  encodeBase64,
  convertFromHex
} from 'pidcrypt/pidcrypt_util'
import 'pidcrypt/asn1'
import 'pidcrypt/rsa'
import createError from './error'

const { RSA, ASN1 } = pidcrypt

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

export const isFunction = pipe(type, equals('Function'))
export const isUndefined = pipe(type, equals('Undefined'))

export function publicEncrypt(key, value) {
  const asn = ASN1.decode(toByteArray(decodeBase64(key)))
  const rsa = new RSA()
  rsa.setPublicKeyFromASN(asn.toHexTree())
  return encodeBase64(convertFromHex(rsa.encrypt(value)))
}

export function get(inputObject, inputPath, defaultValue) {
  const inputValue = path(inputPath, inputObject)
  return isUndefined(inputValue) ? defaultValue : inputValue
}

export function getOption(key, options, defaults) {
  return get(options, key, path(key, defaults))
}

export function transformResponse(response) {
  return path('data', response)
}

export function transformError(error) {
  throw createError(error)
}

export function uniqueId(length = 15, chars = CHARS) {
  let i, result = ''
  for (i = length; i > 0; --i) {
    result += chars[Math.floor(Math.random() * chars.length)]
  }
  return result
}
