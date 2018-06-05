const RateLimiter = require('../../util/RateLimiter');

class KrakenAPI extends RateLimiter {
  constructor(reqfun){
    super();
    this.limit = 30;
    this.time = 30;
    this.remaining = this.limit;
    this.resetTime = 0;
    this.req = reqfun;
  }

  checkLimit() {
    if (this.resetTime<Date.now()){
      this.reset();
    }
    const curr = this.remaining;
    this.remaining--;
    return curr;
  }

  reset() {
    this.remaining = this.limit;
    this.resetTime = Date.now()+this.time*1000;
  }

  async execute(item) {
    if (!this.checkLimit()) throw {timeout: this.resetTime-Date.now()};
    return await this.req(item.data);
  }
}

module.exports = KrakenAPI;