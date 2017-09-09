import IG from '../src/index'
import getConfig from './env'

const account = getConfig(true)

test('get positions', async () => {
  expect.assertions(1)
  const ig = new IG(account.apiKey, account.isDemo)
  await ig.login(account.username, account.password)
  const result = await ig.get('positions', 2)
  expect(result).toHaveProperty('positions')
})

test('get activity with query', async () => {
  expect.assertions(1)
  const ig = new IG(account.apiKey, account.isDemo)
  await ig.login(account.username, account.password)
  const result = await ig.get('history/activity', 3, {
    from: '2017-09-01'
  })
  expect(result).toHaveProperty('activities')
})

// test('open position', async () => {
//   const ig = new IG(account.apiKey, account.isDemo)
//   try {
//     const summary = await ig.login(account.username, account.password)
//     const search = await ig.get('markets', 1, { searchTerm: 'NVDA' })
//     const market = find(search.markets, { expiry: 'DFB' })
//     if (market.marketStatus === 'TRADEABLE') {
//       const detail = await ig.get(`markets/${market.epic}`, 3)
//       const result = await ig.post('positions/otc', 2, {
//         epic: detail.instrument.epic,
//         expiry: detail.instrument.expiry,
//         size: detail.dealingRules.minDealSize.value,
//         currencyCode: summary.currencyIsoCode,
//         stopDistance: detail.dealingRules.minNormalStopOrLimitDistance.value * 10,
//         orderType: 'MARKET',
//         direction: 'BUY',
//         dealReference: 'test',
//         guaranteedStop: false,
//         forceOpen: true
//       })
//     }
//   } catch (error) {
//     console.error(error)
//   }
// })
