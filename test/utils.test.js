import { uniqueId } from '../src/utils'

test('uniqueId()', () => {
  expect(uniqueId()).toMatch(/^[A-Z0-9]{15}$/)
})

test('uniqueId(5)', () => {
  expect(uniqueId(5)).toMatch(/^[A-Z0-9]{5}$/)
})

test('uniqueId(5, \'ABC\')', () => {
  expect(uniqueId(5, 'ABC')).toMatch(/^[ABC]{5}$/)
})
