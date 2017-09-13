**Minimalistic wrapper around [IG's API][ig-rest-api]**

- [Installation](#install)
- [Usage](#usage)
- [Instance API](#instance-api)
    - [constructor](#api-constructor)
    - [login](#api-login)
    - [logout](#api-logout)
    - [request](#api-request)
    - [get](#api-get)
    - [post](#api-post)
    - [put](#api-put)
    - [delete](#api-delete)
- [Static API](#static-api)
    - [IG.transformResponse](#api-transform-response)
    - [IG.transformError](#api-transform-error)
    - [IG.uniqueId](#api-unique-id)
- [Options](#options)
- [Errors](#errors)
- [Promises](#promises)
- [Testing](#testing)

## Install

```bash
yarn add ig-api
```

## Usage

```js
import IG from 'ig-api'

const ig = new IG(apiKey, isDemo)

// Using promises
ig.login(username, password)
  // Response data is automatically
  // passed to the resolve callback
  .then((summary) => {
    console.log('summary:', summary)
    // Once logged in, use the shorthand
    // get(), post(), put() and delete()
    // methods to interact with IG's API
    ig.get('positions')
      .then((positions) => {
        console.log('positions:', positions)
      })
  })
  // Errors are automatically transformed
  // into a more user friendly format with
  // the response status and IG error code
  .catch(console.error)

// Using async await
try {
  await ig.login(username, password)
  const positions = await ig.get('positions')
  console.log('positions:', positions)
} catch (error) {
  console.error(error)
}
```

## Instance API

```js
// ES6 Module
import IG from 'ig-api'

// Common JS
const IG = require('ig-api')
```

The `IG` class is a minimalistic wrapper around [`axios`][axios]—a Promise based HTTP client that works in browsers and node. `IG` class instances take care of setting the request URL, headers and authentication tokens when logging into an account.

Responses and errors are automatically transformed into a more user friendly format, though this can be customised or disabled if desired. See [options](#options) for more information.

<a name="api-constructor"></a>
### `constructor(apiKey, isDemo, options)`

parameter | type    | required | description
----------|---------|----------|------------
apiKey    | string  | true     | Application API key
isDemo    | boolean | false    | Is the API key associated with a demo account? Defaults to false
options   | object  | false    | See [options](#options) for more information

<a name="api-login"></a>
### `login(username, password, encryptPassword, options)`

parameter       | type    | required | description
----------------|---------|----------|------------
username        | string  | true     | Account user name
password        | string  | true     | Account password
encryptPassword | boolean | false    | Encrypt password before posting to API. Defaults to false
options         | object  | false    | See [options](#options) for more information

<a name="api-logout"></a>
### `logout(options)`

parameter | type    | required | description
----------|---------|----------|------------
options   | object  | false    | See [options](#options) for more information

<a name="api-request"></a>
### `request(method, path, version, config, options)`

parameter | type    | required | description
----------|---------|----------|------------
method    | string  | true     | Request method to use ('get', 'post', 'put' or 'delete')
path      | string  | true     | Endpoint path eg. 'history/transactions'
version   | number  | false    | Endpoint version (1, 2 or 3). Defaults to 1
config    | object  | false    | Request config to pass to axios. See [documentation][axios-request-config]
options   | object  | false    | See [options](#options) for more information

<a name="api-get"></a>
### `get(path, version, params, options)`

Shorthand to `request`, passing `'get'` as the `method` and `params` as the key value to `config`.

```js
// Get detailed account activity since 25th December 2016
ig.get('history/activity', 3, {
  from: '2016-12-25',
  detailed: true
})
// ...is the same as
ig.request('get', 'history/activity', 3, {
  params: {
    from: '2016-12-25',
    detailed: true
  }
})
```

<a name="api-post"></a>
### `post(path, version, data, options)`

Shorthand to `request`, passing `'post'` as the `method` and `data` as the key value to `config`.

```js
// Create a new watchlist
ig.post('watchlist', 1, {
  name: 'Forex Majors',
  epics: [
    'CS.D.AUDUSD.TODAY.IP', // AUD/USD
    'CS.D.EURGBP.TODAY.IP', // EUR/GBP
    'CS.D.EURUSD.TODAY.IP', // EUR/USD
  ]
})
// ...is the same as
ig.request('post', 'watchlist', 1, {
  data: {
    name: 'Forex Majors',
    epics: [
      'CS.D.AUDUSD.TODAY.IP', // AUD/USD
      'CS.D.EURGBP.TODAY.IP', // EUR/GBP
      'CS.D.EURUSD.TODAY.IP', // EUR/USD
    ]
  }
})
```

<a name="api-put"></a>
### `put(path, version, data, options)`

Shorthand to `request`, passing `'put'` as the `method` and `data` as the key value to `config`.

```js
// Switch active account
ig.put('session', 1, {
  accountId: 'XXXXX'
})
// ...is the same as
ig.request('put', 'session', 1, {
  data: {
    accountId: 'XXXXX'
  }
})
```

<a name="api-delete"></a>
### `delete(path, version, data, options)`

Shorthand to `request`, passing `'delete'` as the `method` and `data` as the key value to `config`.

```js
// Close a position
ig.delete('positions/otc', 1, {
  epic: 'UA.D.AAPL.DAILY.IP', // AAPL DFB
  orderType: 'MARKET',
  direction: 'SELL',
  expiry: 'DFB',
  size: 0.5
})
// ...is the same as
ig.request('delete', 'positions/otc', 1, {
  data: {
    epic: 'UA.D.AAPL.DAILY.IP', // AAPL DFB
    orderType: 'MARKET',
    direction: 'SELL',
    expiry: 'DFB',
    size: 0.5
  }
})
```

## Static API

<a name="api-transform-response"></a>
### `IG.transformResponse(response)`

parameter | type    | required | description
----------|---------|----------|------------
response  | object  | true     | Response object

Simply returns `response.data`.

<a name="api-transform-error"></a>
### `IG.transformError(error)`

parameter | type    | required | description
----------|---------|----------|------------
error     | object  | true     | Error object

Throws a new `Error` from `error` with additional key values. See [errors](#errors) for more detail.

<a name="api-unique-id"></a>
### `IG.uniqueId(length, chars)`

parameter | type    | required | description
----------|---------|----------|------------
length    | number  | false    | Length of the unique id. Defaults to 15
chars     | string  | false    | Chars to use. Defaults to [A-Z0-9]

Creates a unique id that matches IG's format of 15 uppercase alphanumeric characters eg. `ABCDE12345WVXYZ`.

This can be useful when opening a new position and providing a unique `dealReference`.

## Options

The `IG` constructor and all instance methods take an `options` argument as the final parameter.

The `options` object has the following shape:

```js
{
  transformResponse: false || function(response) {
    // Transform and return a custom response
    return response
  },
  transformError: false || function(error) {
    // Transform and throw a custom error
    throw error
  }
}
```

Both `transformResponse` and `transformError` can be specified as functions or disabled by passing `false`.

By default, the built-in transform functions are used. See [IG.transformResponse](#api-transform-response) and [IG.transformError](#api-transform-error).

When setting `transformResponse` to `false`, the original `response` object is _returned_ from the request's `resolve` method. This is useful if you want to access the response `headers` or `status` code for example.

When setting `transformError` to `false`, the original `error` object is _thrown_ from the request's `reject` method. This is useful if you want to access the error `request` or `response` objects and throw your own custom error.

You can also specify your own custom transform functions that map the `response` and `error` objects to whatever you so choose.

For example if you wanted to return the response `data` and `status` code for _all_ requests on an instance and customise the error:

```js
import IG from 'ig-api'

const ig = new IG(apiKey, isDemo, {
  transformResponse(response) {
    return {
      code: response.status,
      data: response.data
    }
  },
  transformError(error) {
    throw new Error(`Uh oh! ${error.message}`)
  }
})

const customResponse = await ig.login(username, password)
console.log(customResponse) // { code: 200, data: { ... } }
```

If you want to use the built-in transform functions in your own code, they are available as static properties on the `IG` class:

```js
import IG from 'ig-api'

const ig = new IG(apiKey, isDemo, {
  transformResponse(response) {
    // Do something with the response...
    return IG.transformResponse(response)
  },
  transformError(error) {
    // Do something with the error...
    IG.transformError(error) // throw is called within IG.transformError
  }
})
```

Passing an `options` object to the `IG` constructor (as shown above) serves as a way for setting the default transform functions for _all_ requests on that instance.

If you want to override these transformation functions on a call-by-call basis, you can do so by passing an `options` object when calling an instance method:

```js
import IG from 'ig-api'

const ig = new IG(apiKey, isDemo)

// Default configuration
const summary = await ig.login(username, password)
console.log(summary) // response.data object by default

// Disable response transform on single call
const response = await ig.login(username, password, {
  transformResponse: false
})
console.log(response) // original response object

// Customise response transform on single call
const status = await ig.login(username, password, {
  transformResponse: (response) => response.status
})
console.log(status) // 200
```

## Errors

Unless the `transformError` function is disabled or overridden via [options](#options), _all_ request errors are handled by the built-in transform function.

When an `error` is thrown from a `request`, a new `Error` is created that has the following shape:

key        | description
-----------|------------
type       | Either 'request', 'response' or 'internal'
message    | Error message
url        | Request url
data       | Request data
params     | Request params
method     | Request method
headers    | Request headers
statusCode | Response status code (type: 'response' only)
statusText | Response status text (type: 'response' only)
errorCode  | Response IG error code (type: 'response' only)

Using `type` and `errorCode` can be very useful for handling IG error codes within your application:

```js
ig.login(username, password)
  .catch((error) => {
    if (error.type === 'response') {
      switch (error.errorCode) {
        case 'error.security.invalid-details':
          alert('Incorrect username or password')
          break;
        default:
          console.error(error.errorCode)
          break;
      }
    } else {
      console.error(error.message)
    }
  })
```

## Promises

This library depends on a native ES6 [Promise][promise-docs] implementation to be supported.

If your environment doesn't [support][promise-support] ES6 Promises, you can [polyfill][promise-polyfill].

## Testing

To run the tests locally, you will need to create a `.env` file at the root of the repository that contains the following:

```bash
DEMO_API_KEY=yourDemoApiKey
DEMO_USERNAME=yourDemoUsername
DEMO_PASSWORD=yourDemoPassword
```

### Creating API Keys

Since tests mutate your account by creating and deleting watchlists, **you must use a demo account and API key**.

_I will not take any resposibility for running tests using your live account credentials!_

To create an API key, login to IG and go to:

```bash
My IG > Settings > API keys
```

Here you will be able to create API keys for both your _live_ and _demo_ accounts.

If you don't have a demo account, you will need to create one.

**NOTE:** After creating a _demo_ account for the first time, it is important that you login to your account, go to the **Dashboard** and make one of your _demo_ accounts a `default` by clicking the radio button next to it. If you don't do this, you will get a "[Transformation failure](https://labs.ig.com/node/562)" error when attempting to login using your demo credentials.

### Running Tests

Tests are written using [jest][jest]. To run the tests:

```bash
yarn test
```

To run the tests continuously during development:

```bash
yarn test:watch
```

## Author

[Matthew Wagerfield][twitter]

## License

[MIT][mit]



[ig-rest-api]: https://labs.ig.com/rest-trading-api-reference
[promise-docs]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
[promise-polyfill]: https://www.npmjs.com/package/es6-promise
[promise-support]: http://caniuse.com/#feat=promises
[axios]: https://www.npmjs.com/package/axios
[axios-request-config]: https://www.npmjs.com/package/axios#request-config
[jest]: https://facebook.github.io/jest
[mit]: https://opensource.org/licenses/MIT
[twitter]: https://twitter.com/wagerfield
