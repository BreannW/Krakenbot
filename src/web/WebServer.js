const koa = require('koa');
const Router = require('koa-router');
const static = require('koa-static');
const mount = require('koa-mount');
const pug = require('pug');
const path = require('path');

function start(config){
  const app = new koa();
  const router = new Router();
  
  dashboard = pug.compileFile(path.join(__dirname, 'pug', 'dashboard.pug'));
  
  // serve files in static folder (css, js, images, etc)
  app.use(mount('/static', static(path.join(__dirname, 'static'),{
    // Max age to allow browsers to cache static assets
    maxage: config["browser-cache-time"]
  })));
  
  // rest endpoints
  router.get('/api/', async (ctx)=>{
    ctx.body = 'I\'m an api dur hurr';
  });
  
  //Pages
  router.get('/dashboard', async ctx=>{
    ctx.body = dashboard();
  });
  
  app
    .use(router.routes())
    .use(router.allowedMethods());
  
  
  app.listen(config["port"]);
}

module.exports = {start};