import IG from '../src/index'
import getConfig from './env'

const demo = getConfig(true)
const live = getConfig(false)

test('login to live account', async () => {
  expect.assertions(1)
  const ig = new IG(live.apiKey, live.isDemo)
  const summary = await ig.login(live.username, live.password)
  expect(summary).toHaveProperty('accounts')
})

test('login to demo account', async () => {
  expect.assertions(1)
  const ig = new IG(demo.apiKey, demo.isDemo)
  const summary = await ig.login(demo.username, demo.password)
  expect(summary).toHaveProperty('accounts')
})

// test('login to live account with encrypted password', async () => {
//   expect.assertions(1)
//   const ig = new IG(live.apiKey, live.isDemo)
//   const summary = await ig.login(live.username, live.password, true)
//   expect(summary).toHaveProperty('accounts')
// })

// test('login to demo account with encrypted password', async () => {
//   expect.assertions(1)
//   const ig = new IG(demo.apiKey, demo.isDemo)
//   const summary = await ig.login(demo.username, demo.password, true)
//   expect(summary).toHaveProperty('accounts')
// })

test('logout from live account', async () => {
  expect.assertions(1)
  const ig = new IG(live.apiKey, live.isDemo)
  await ig.login(live.username, live.password)
  const data = await ig.logout()
  expect(data).toBe('')
})

test('logout from demo account', async () => {
  expect.assertions(1)
  const ig = new IG(demo.apiKey, demo.isDemo)
  await ig.login(demo.username, demo.password)
  const data = await ig.logout()
  expect(data).toBe('')
})

test('get accounts', async () => {
  expect.assertions(1)
  const ig = new IG(demo.apiKey, demo.isDemo)
  await ig.login(demo.username, demo.password)
  const accounts = await ig.get('accounts')
  expect(accounts).toHaveProperty('accounts')
})

test.only('static transformResponse', () => {
  expect(IG.transformResponse).toEqual(expect.any(Function))
  expect(IG.transformResponse({ data: 'foo' })).toBe('foo')
})

test('custom transformResponse', async () => {
  const transformResponse = jest.fn(IG.transformResponse)
  const ig = new IG(demo.apiKey, demo.isDemo, { transformResponse })
  await ig.login(demo.username, demo.password)
  expect(transformResponse.mock.calls.length).toBe(1)
})
