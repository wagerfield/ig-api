import IG from '../src/index'
import getAccount from './env'

const account = getAccount(true)

test('login to account', async () => {
  expect.hasAssertions()
  try {
    const ig = new IG(account.apiKey, account.isDemo)
    const result = await ig.login(account.username, account.password)
    expect(result).toHaveProperty('accounts')
  } catch (error) {
    console.error(error)
  }
})

test('login to account with encrypted password', async () => {
  expect.hasAssertions()
  try {
    const ig = new IG(account.apiKey, account.isDemo)
    const result = await ig.login(account.username, account.password, true)
    expect(result).toHaveProperty('accounts')
  } catch (error) {
    console.error(error)
  }
})

test('logout from account', async () => {
  expect.hasAssertions()
  try {
    const ig = new IG(account.apiKey, account.isDemo)
    await ig.login(account.username, account.password)
    const result = await ig.logout()
    expect(result).toBe('')
  } catch (error) {
    console.error(error)
  }
})
