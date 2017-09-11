import { path, reduce } from 'rambda'
import { load } from 'dotenv'

load()

export function constantCase(string) {
  return string.replace(/([A-Z])/g, '_$1').toUpperCase()
}

export default function getAccount(isDemo) {
  const prefix = isDemo ? 'DEMO' : 'LIVE'
  const keys = [ 'apiKey', 'username', 'password' ]
  return reduce((result, key) => {
    result[key] = path(`env.${prefix}_${constantCase(key)}`, process)
    return result
  }, { isDemo }, keys)
}
