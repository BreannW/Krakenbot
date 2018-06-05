const koa = require('koa');
const Router = require('koa-router');
const static = require('koa-static');
const mount = require('koa-mount');
const bodyParser = require('koa-bodyparser');
const path = require('path');

const pages = require('./pages');

function start(config, rec){
  const app = new koa();
  const router = new Router();

  // Adding program resources to ctx
  app.context.krakenbot = rec;

  app.use(bodyParser());

  // serve files in static folder (css, js, images, etc)
  app.use(mount('/static', static(path.join(__dirname, 'static'),{
    // Max age to allow browsers to cache static assets
    maxage: config["browser-cache-time"]
  })));

  Object.values(pages).forEach(page => page(router));
  
  app
    .use(router.routes())
    .use(router.allowedMethods());
  
  
  app.listen(config["port"]);
}

module.exports = {start};