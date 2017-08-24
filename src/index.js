export default class IG {

  constructor(key, demo) {
    this.demo = demo
    this.key = key
    this.api = `https://${demo && 'demo-'}api.ig.com/gateway/deal/`
  }

  login(username, password) {
  }

  logout() {
  }
}
