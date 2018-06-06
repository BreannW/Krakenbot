const RateLimiter = require('../../util/RateLimiter');

class HelixAPI extends RateLimiter {
  constructor(reqfun){
    super();
    this.req = reqfun;
  }

  async execute(item) {
    try {
      const res = await this.req(item.data);
      return res;
    } catch (E){
      if (E.statusCode === 429){
        console.log("Rate Limit Hit");
        throw {timeout: parseInt(E.response.headers["ratelimit-reset"])*1000-Date.now()+250};
      } else {
        console.log(E);
        throw E;
      }
    }
  }
}

module.exports = HelixAPI;