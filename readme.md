Wrapper around [IG's API](https://labs.ig.com/rest-trading-api-reference)

## Install

```bash
yarn add ig-api
```

## Usage

```js
const ig = new IG(key, demo)

ig.login(username, password).then((respose) => {
  console.log(respose)
}).catch((error) => {
  console.error(error)
})
```
