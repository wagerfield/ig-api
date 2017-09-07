import pidcrypt from 'pidcrypt'
import { get } from 'lodash'
import {
  toByteArray,
  decodeBase64,
  encodeBase64,
  convertFromHex
} from 'pidcrypt/pidcrypt_util'
import 'pidcrypt/asn1'
import 'pidcrypt/rsa'

const { RSA, ASN1 } = pidcrypt

export function publicEncrypt(key, value) {
  const asn = ASN1.decode(toByteArray(decodeBase64(key)))
  const rsa = new RSA()
  rsa.setPublicKeyFromASN(asn.toHexTree())
  return encodeBase64(convertFromHex(rsa.encrypt(value)))
}

export function getOption(key, options, defaults) {
  return get(options, key, defaults[key])
}
