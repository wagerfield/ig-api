import IG from '../src/index'
import getAccount from './env'

const account = getAccount(true)

test('static transformResponse', () => {
  expect(IG.transformResponse).toEqual(expect.any(Function))
  expect(IG.transformResponse({ data: 'foo' })).toBe('foo')
})

test('custom transformResponse', async () => {
  const transformResponse = jest.fn(IG.transformResponse)
  const ig = new IG(account.apiKey, account.isDemo, { transformResponse })
  await ig.login(account.username, account.password)
  expect(transformResponse.mock.calls.length).toBe(1)
})
