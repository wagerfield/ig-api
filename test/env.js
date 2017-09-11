import { get, transform, snakeCase } from 'lodash'
import { load } from 'dotenv'

load()

export default function getAccount(isDemo) {
  const prefix = isDemo ? 'DEMO' : 'LIVE'
  const keys = [ 'apiKey', 'username', 'password' ]
  return transform(keys, (result, key) => {
    const constant = snakeCase(key).toUpperCase()
    result[key] = get(process, `env.${prefix}_${constant}`)
  }, { isDemo })
}
