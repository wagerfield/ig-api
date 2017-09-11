import IG from '../src/index'
import getConfig from './env'

const account = getConfig(true)

test('login to account', async () => {
  expect.hasAssertions()
  const ig = new IG(account.apiKey, account.isDemo)
  const result = await ig.login(account.username, account.password)
  expect(result).toHaveProperty('accounts')
})

test('login to account with encrypted password', async () => {
  expect.hasAssertions()
  const ig = new IG(account.apiKey, account.isDemo)
  const result = await ig.login(account.username, account.password, true)
  expect(result).toHaveProperty('accounts')
})

test('logout from account', async () => {
  expect.hasAssertions()
  const ig = new IG(account.apiKey, account.isDemo)
  await ig.login(account.username, account.password)
  const result = await ig.logout()
  expect(result).toBe('')
})
