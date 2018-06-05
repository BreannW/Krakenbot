function aTimeout(timeout){return new Promise((resolve, reject)=>setTimeout(()=>resolve(),timeout));}

/**
 * Rate Limiter Class
 */
class RateLimiter {
  /**
  * Initialize Rate Limiter
  */
  constructor() {
    this.busy = false;
    this.limited = false;
    this.queue = [];
  }
  
  /**
  * @private
  * @function handle
  */
  async handle() {
    if (this.busy || this.limited || this.queue.length === 0) return;
    this.busy = true;
    const item = this.queue.shift();
    try { 
      const res = await this.execute(item);
      this.busy = false;
      item.resolve(res);
    } catch (E) {
      if (E.timeout) {
        item.retried = true;
        this.queue.unshift(item);
        await aTimeout(E.timeout);
        this._reset();
      } else {
        item.reject(E);
      }
    }
    this.handle();
  }

  _reset() {
    this.busy = false;
    this.limited = false;
    this.reset();
  }

  reset() {};

  /**
  * This is run to process an item before it enters the queue.
  * @abstract
  * @param item - The item before preprocessing
  * @returns {} The item post processed, which will be fed to this.execute() from the queue.
  */
  build(item){
    return item;
  }

  /**
  * This is run to use the item when ready.
  * @async
  * @abstract
  * @param item - The item to be executed from the queue.
  * @returns {Promise}
  * @throws {timeout: number} - Thrown when ratelimit reached, timeout property is miliseconds to retry.
  */ 
  async execute(item){return item;}


  /**
  * Add an item to the queue and initiate handler.
  * @param item - The item to add to the queue.s
  * returns {Promise} - the promise that will resolve to the result.
  */
  push(request){
    return new Promise((resolve, reject)=>{
      const data = this.build(request);
      this.queue.push({data, resolve, reject});
      this.handle();
    });
  }
}

module.exports = RateLimiter;