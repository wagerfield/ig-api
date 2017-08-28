Minimalistic JavaScript wrapper around [IG's API][api].

## Install

```bash
yarn add ig-api
```

## Usage

```js
import IG from 'ig-api'

// Create API instance
const ig = new IG(apiKey, isDemo)

// Using promises
ig.login(username, password)
  .then((summary) => {
    console.log(summary)
    ig.get('positions')
      .then((positions) => {
        console.log(positions)
      })
  })
  .catch((error) => {
    console.error(error)
  })

// Using async await
const summary = await ig.login(username, password)
const positions = await ig.get('positions')
```

## API

The `IG` class is simply a thin wrapper around [`axios`][axios]—a Promise based HTTP client.

The `pick` argument that is passed

### `constructor(apiKey, isDemo, pick)`

parameter | type    | default | description
----------|---------|---------|------------
apiKey    | string  | null    | IG API Key
isDemo    | boolean | null    | Whether or not the API Key is associated with a demo account
pick      | boolean | true    | Instance setting for picking the `data` object from response objects

### `request(method, url, version, data, pick)`

- `method:string` Request method
    - Options: `get`, `put`, `post` or `delete`
- `url:string` API endpoint
    - Eg. `history/transactions`
    - See [API Reference][api]
- `version:number` can be `1`, `2` or `3`
    - See [API Reference][api]
- `data:object` Data to send with request (`put` and `post` only)
    - Eg. `{ trailingStopsEnabled: true }`
- `pick:boolean` Whether or not to pick the `data` from the `response`
    - Defaults to `true` so that the result of the promise is the response `data` object
    - Passing `false` will mean that the `response` object is returned

### `get(url, version, pick)`

### `put(url, version, data, pick)`

### `post(url, version, data, pick)`

### `delete(url, version, pick)`

### `login(username, password, pick)`

### `logout(pick)`

## Errors

## Testing

To run the tests locally, you will need to create a `.env` file at the root of the repository that contains the following key values:

```
# Live Account
LIVE_API_KEY=yourLiveApiKey
LIVE_USERNAME=yourLiveUsername
LIVE_PASSWORD=yourLivePassword

# Demo Account
DEMO_API_KEY=yourDemoApiKey
DEMO_USERNAME=yourDemoUsername
DEMO_PASSWORD=yourDemoPassword
```

Tests rely on a _live_ and _demo_ account, so you will need both setup.

To create your API keys, login to IG and go to:

```
My IG > Settings > API keys
```

Here you will be able to create API keys for both your _live_ and _demo_ accounts.

If you don't have a demo account, you will need to create one.

**NOTE:** After creating a _demo_ account for the first time, it is important that you login to your account, go to the **Dashboard** and make one of your _demo_ accounts a `default` by clicking the radio button next to it. If you don't do this, you will get a "[Transformation failure](https://labs.ig.com/node/562)" error when attempting to login using your demo credentials.

[api][https://labs.ig.com/rest-trading-api-reference]
[axios][https://www.npmjs.com/package/axios]
