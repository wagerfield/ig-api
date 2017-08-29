import { get } from 'lodash'

export function getOption(key, options, defaults) {
  return get(options, key, defaults[key])
}
