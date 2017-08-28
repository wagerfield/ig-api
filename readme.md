**Minimalistic JavaScript wrapper around [IG's API][ig-api-ref]**

## Install

With `yarn`:

```bash
yarn add ig-api
```

With `npm`:

```bash
npm install ig-api --save
```

## Usage

```js
import IG from 'ig-api'

// Create instance
const ig = new IG(apiKey, isDemo)

// Using promises
ig.login(username, password)
  .then((summary) => {
    console.log('summary:', summary)
    ig.get('history/activity')
      .then((activity) => {
        console.log('activity:', activity)
      })
      .catch((error) => {
        console.error(error)
      })
  })
  .catch((error) => {
    console.error(error)
  })

// Using async await
try {
  const summary = await ig.login(username, password)
  console.log('summary:', summary)
  try {
    const activity = await ig.get('history/activity')
    console.log('activity:', activity)
  } catch (error) {
    console.error(error)
  }
} catch (error) {
  console.error(error)
}
```

## API

The `IG` class is a thin wrapper around [`axios`][axios]—a Promise based HTTP client.

### `constructor(apiKey, isDemo, pick)`

parameter | type    | description
----------|---------|------------
apiKey    | string  | IG application API key
isDemo    | boolean | Whether or not the API key is associated with a demo account
pick      | boolean | Instance setting for picking the `data` object from response objects. Defaults to `true`. See [data picking][data-picking] for more information

### `request(method, url, version, data, pick)`

parameter | type    | description
----------|---------|------------
method    | string  | Request method to use (`get`, `put`, `post` or `delete`)
url       | string  | API endpoint eg. `history/transactions`
version   | number  | API version (`1`, `2` or `3`). Defaults to `1`
data      | object  | Optional data payload to send with the request
pick      | boolean | Whether or not to pick the `data` object from the response object. See [data picking][data-picking] for more information

### `get(url, version, pick)`

Shortcut to `request`, passing `get` as the `method`.

### `put(url, version, data, pick)`

Shortcut to `request`, passing `put` as the `method`.

### `post(url, version, data, pick)`

Shortcut to `request`, passing `post` as the `method`.

### `delete(url, version, pick)`

Shortcut to `request`, passing `delete` as the `method`.

### `login(username, password, pick)`

parameter | type    | description
----------|---------|------------
username  | string  | Account user name
password  | string  | Account password
pick      | boolean | Whether or not to pick the `data` object from the response object. See [data picking][data-picking] for more information

### `logout(pick)`

parameter | type    | description
----------|---------|------------
pick      | boolean | Whether or not to pick the `data` object from the response object. See [data picking][data-picking] for more information

## Data Picking

All `IG` instance methods take a `pick` argument as the final parameter.

When `pick` is `true`, the `data` object from the API `response` object is returned. This is generally the desired behaviour, otherwise you would have to access it by doing `response.data` each time.

When `pick` is `false`, the `response` object itself is returned. This is useful if you want to access the response `headers` or `status` code for example.

In addition to the `pick` argument on instance methods, you can also set the default value on the instance itself when constructing it. By default `pick` is set to `true` if no argument is provided. Passing `false` to the constructor will mean that all returned values are `response` objects, unless overridden in the instance method calls.

```js
import IG from 'ig-api'

const igPickTrue = new IG(apiKey, isDemo, true) // default
const igPickFalse = new IG(apiKey, isDemo, false)

const summary = await igPickTrue.login(username, password)
console.log('summary:', summary)

// Override instance pick setting
const response = await igPickTrue.login(username, password, false)
console.log('status:', response.status)
console.log('headers:', response.headers)
console.log('summary:', response.data)

const response = await igPickFalse.login(username, password)
console.log('status:', response.status)
console.log('headers:', response.headers)
console.log('summary:', response.data)

// Override instance pick setting
const summary = await igPickFalse.login(username, password, true)
console.log('summary:', summary)
```

## Errors

To do.

## Testing

To run the tests locally, you will need to create a `.env` file at the root of the repository that contains the following key values:

```bash
LIVE_API_KEY=yourLiveApiKey
LIVE_USERNAME=yourLiveUsername
LIVE_PASSWORD=yourLivePassword

DEMO_API_KEY=yourDemoApiKey
DEMO_USERNAME=yourDemoUsername
DEMO_PASSWORD=yourDemoPassword
```

Tests rely on a _live_ and _demo_ account, so you will need both setup.

To create your API keys, login to IG and go to:

```bash
My IG > Settings > API keys
```

Here you will be able to create API keys for both your _live_ and _demo_ accounts.

If you don't have a demo account, you will need to create one.

**NOTE:** After creating a _demo_ account for the first time, it is important that you login to your account, go to the **Dashboard** and make one of your _demo_ accounts a `default` by clicking the radio button next to it. If you don't do this, you will get a "[Transformation failure](https://labs.ig.com/node/562)" error when attempting to login using your demo credentials.

[ig-api-ref]: https://labs.ig.com/rest-trading-api-reference
[axios]: https://www.npmjs.com/package/axios
[data-picking]: #data-picking
