import { get, transform, snakeCase } from 'lodash'
import { config } from 'dotenv'

config()

export default function getConfig(isDemo) {
  const prefix = isDemo ? 'DEMO' : 'LIVE'
  const keys = [ 'apiKey', 'username', 'password' ]
  return transform(keys, (result, key) => {
    const constant = snakeCase(key).toUpperCase()
    result[key] = get(process, `env.${prefix}_${constant}`)
  }, { isDemo })
}
