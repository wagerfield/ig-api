## Install

```bash
npm install ig-api --save
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
    // get(), put(), post() and delete()
    // methods to interact with IG's API
    ig.get('history/activity')
      .then((activity) => {
        console.log('activity:', activity)
      })
  })
  // Errors are automatically transformed
  // into a more user friendly format with
  // the response status and IG error code
  .catch(console.error)

// Using async await
await ig.login(username, password)
const activity = await ig.get('history/activity')
console.log('activity:', activity)
```

## API

```js
// ES6 Module
import IG from 'ig-api'

// Require
const IG = require('ig-api')
```

The `IG` class is a minimalistic wrapper around [`axios`][axios]—a Promise based HTTP client that works in browsers and node. Class instances take care of setting up the request URL, headers and authentication tokens when logging into an account.

Responses and errors are automatically transformed into a more user friendly format, though this can be customised or disabled if desired. See [options][options] for more information.

### `constructor(apiKey, isDemo, options)`

parameter | type    | required | description
----------|---------|----------|------------
apiKey    | string  | true     | Application API key
isDemo    | boolean | true     | Whether or not the API key is associated with a demo account
options   | object  | false    | See [options][options] for more information

### `request(method, url, version, data, options)`

parameter | type    | required | description
----------|---------|----------|------------
method    | string  | true     | Request method to use ('get', 'put', 'post' or 'delete')
url       | string  | true     | Endpoint url path eg. 'history/transactions'
version   | number  | false    | Endpoint version (1, 2 or 3). Defaults to 1
data      | object  | false    | Data payload to send with the request
options   | object  | false    | See [options][options] for more information

### `get(url, version, data, options)`

Shorthand to `request`, passing `'get'` as the `method`.

### `put(url, version, data, options)`

Shorthand to `request`, passing `'put'` as the `method`.

### `post(url, version, data, options)`

Shorthand to `request`, passing `'post'` as the `method`.

### `delete(url, version, data, options)`

Shorthand to `request`, passing `'delete'` as the `method`.

### `login(username, password, options)`

parameter | type    | required | description
----------|---------|----------|------------
username  | string  | true     | Account user name
password  | string  | true     | Account password
options   | object  | false    | See [options][options] for more information

### `logout(options)`

parameter | type    | required | description
----------|---------|----------|------------
options   | object  | false    | See [options][options] for more information

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

By default, the in-built transform functions are used. The in-built `transformResponse` function returns the `response.data` object while the in-built `transformError` function throws a new `IGError`—see [errors][errors] for more information.

When setting `transformResponse` to `false`, the original `response` object is _returned_ from the request's `resolve` method. This is useful if you want to access the response `headers` or `status` code for example.

When setting `transformError` to `false`, the original `error` object is _thrown_ from the request's `reject` method. This is useful if you want to access the error `request` or `response` objects and throw your own custom error for example.

You can also specify your own custom transform functions that map the `response` and `error` objects to whatever you so choose.

For example if you wanted to return the response `data` and `status` code for _all_ requests on an instance:

```js
import IG from 'ig-api'

const ig = new IG(apiKey, isDemo, {
  transformResponse(response) {
    return {
      code: response.status,
      data: response.data
    }
  }
})

const customResponse = await ig.login(username, password)
console.log(customResponse) // { code: 200, data: { ... } }
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

Unless the `transformError` function is disabled or overridden via [options][options], _all_ request errors are handled by the in-built transform function.

When an `error` is thrown from a `request`, a new `IGError` is created that has the following shape:

key        | description
-----------|------------
type       | Values are `'request'` or `'response'`
message    | Error message
status     | Response status code (`type:response` only)
statusText | Response status text (`type:response` only)
code       | Response IG error code (`type:response` only)

Using `type` and `code` can be very useful for handling IG error codes within your application:

```js
ig.login(username, password)
  .catch((error) => {
    if (error.type === 'response') {
      switch (error.code) {
        case 'error.security.invalid-details':
          alert('Incorrect username or password')
          break;
        default:
          console.error(error.message, error.code)
          break;
      }
    } else {
      console.error(error.message)
    }
  })
```

## Testing

To run the tests locally, you will need to create a `.env` file at the root of the repository that contains the following:

```bash
LIVE_API_KEY=yourLiveApiKey
LIVE_USERNAME=yourLiveUsername
LIVE_PASSWORD=yourLivePassword

DEMO_API_KEY=yourDemoApiKey
DEMO_USERNAME=yourDemoUsername
DEMO_PASSWORD=yourDemoPassword
```

Tests rely on a _live_ and _demo_ account, so you will need both.

To create your API keys, login to IG and go to:

```bash
My IG > Settings > API keys
```

Here you will be able to create API keys for both your _live_ and _demo_ accounts.

If you don't have a demo account, you will need to create one.

**NOTE:** After creating a _demo_ account for the first time, it is important that you login to your account, go to the **Dashboard** and make one of your _demo_ accounts a `default` by clicking the radio button next to it. If you don't do this, you will get a "[Transformation failure](https://labs.ig.com/node/562)" error when attempting to login using your demo credentials.

## Author

[Matthew Wagerfield][twitter]

## License

[MIT][mit]

[rest-api]: https://labs.ig.com/rest-trading-api-reference
[axios]: https://www.npmjs.com/package/axios
[mit]: https://opensource.org/licenses/MIT
[twitter]: https://twitter.com/wagerfield

[options]: #options
[errors]: #errors
