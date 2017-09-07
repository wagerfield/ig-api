import IG from '../src/index'
import getConfig from './env'

const demo = getConfig(true)

test('static transformResponse', () => {
  expect(IG.transformResponse).toEqual(expect.any(Function))
  expect(IG.transformResponse({ data: 'foo' })).toBe('foo')
})

test('custom transformResponse', async () => {
  const transformResponse = jest.fn(IG.transformResponse)
  const ig = new IG(demo.apiKey, demo.isDemo, { transformResponse })
  await ig.login(demo.username, demo.password)
  expect(transformResponse.mock.calls.length).toBe(1)
})
