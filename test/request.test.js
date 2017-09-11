import { map, filter, includes } from 'rambda'
import IG from '../src/index'
import getAccount from './env'

const PREFIX = 'ig-api'
const EPIC_1 = 'UA.D.AAPL.DAILY.IP' // AAPL DFB
const EPIC_2 = 'UC.D.MSFT.DAILY.IP' // MSFT DFB

const account = getAccount(true)
const ig = new IG(account.apiKey, account.isDemo)

const uniqueName = () => `${PREFIX}-${IG.uniqueId(5)}`

const createWatchlist = () =>
  ig.post('watchlists', 1, {
    name: uniqueName(),
    epics: [ EPIC_1 ]
  })

const updateWatchlist = (watchlistId, epic) =>
  ig.put(`watchlists/${watchlistId}`, 1, { epic })

const deleteWatchlist = (watchlistId) =>
  ig.delete(`watchlists/${watchlistId}`)

const deleteWatchlists = map((watchlist) =>
  deleteWatchlist(watchlist.id))

const filterWatchlists = filter((watchlist) =>
  includes(PREFIX, watchlist.name))

beforeAll(async () => {
  try {
    await ig.login(account.username, account.password)
  } catch (error) {
    console.error(error)
  }
})

afterAll(async () => {
  try {
    const { watchlists } = await ig.get('watchlists')
    const testWatchlists = filterWatchlists(watchlists)
    const promises = deleteWatchlists(testWatchlists)
    await Promise.all(promises)
  } catch (error) {
    console.error(error)
  }
})

test('get activity with query (get)', async () => {
  expect.hasAssertions()
  try {
    const result = await ig.get('history/activity', 3, { from: '2017-09-01' })
    expect(result).toHaveProperty('activities')
  } catch (error) {
    console.error(error)
  }
})

test('create watchlist (post)', async () => {
  expect.hasAssertions()
  try {
    const result = await createWatchlist()
    expect(result).toHaveProperty('watchlistId')
  } catch (error) {
    console.error(error)
  }
})

test('update watchlist (put)', async () => {
  expect.hasAssertions()
  try {
    const { watchlistId } = await createWatchlist()
    const result = await updateWatchlist(watchlistId, EPIC_2)
    expect(result).toHaveProperty('status')
  } catch (error) {
    console.error(error)
  }
})

test('delete watchlist (delete)', async () => {
  expect.hasAssertions()
  try {
    const { watchlistId } = await createWatchlist()
    const result = await deleteWatchlist(watchlistId)
    expect(result).toHaveProperty('status')
  } catch (error) {
    console.error(error)
  }
})
