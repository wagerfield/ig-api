import {
  get,
  uniqueId,
  getOption,
  isFunction,
  isUndefined,
  transformResponse
} from '../src/utils'

const func1 = () => {
  return false
}

function func2() {
  return false
}

test('uniqueId', () => {
  expect(uniqueId()).toMatch(/^[A-Z0-9]{15}$/)
  expect(uniqueId(5)).toMatch(/^[A-Z0-9]{5}$/)
  expect(uniqueId(5, 'ABC')).toMatch(/^[ABC]{5}$/)
})

test('isFunction', () => {
  expect(isFunction()).toBe(false)
  expect(isFunction(1)).toBe(false)
  expect(isFunction(true)).toBe(false)
  expect(isFunction('ax')).toBe(false)
  expect(isFunction(func1)).toBe(true)
  expect(isFunction(func2)).toBe(true)
})

test('isUndefined', () => {
  expect(isUndefined()).toBe(true)
  expect(isUndefined(1)).toBe(false)
  expect(isUndefined(true)).toBe(false)
  expect(isUndefined('az')).toBe(false)
  expect(isUndefined(func1)).toBe(false)
  expect(isUndefined(func2)).toBe(false)
})

test('get', () => {
  expect(get()).toBeUndefined()
  expect(get({ a: { b: 2 } }, 'a.b')).toBe(2)
  expect(get({ c: { b: 2 } }, 'a.b')).toBeUndefined()
  expect(get({ c: { b: 2 } }, 'a.b', 'N/A')).toBe('N/A')
})

test('getOption', () => {
  expect(getOption()).toBeUndefined()
  expect(getOption('a')).toBeUndefined()
  expect(getOption('a', { a: 1 })).toBe(1)
  expect(getOption('a', { a: 1 }, { a: 2 })).toBe(1)
  expect(getOption('a', { b: 1 }, { a: 2 })).toBe(2)
  expect(getOption('a', null, { a: 2 })).toBe(2)
  expect(getOption('a', null, { b: 2 })).toBeUndefined()
})

test('transformResponse', () => {
  expect(transformResponse()).toBeUndefined()
  expect(transformResponse({ a: 1 })).toBeUndefined()
  expect(transformResponse({ data: 2 })).toBe(2)
})
