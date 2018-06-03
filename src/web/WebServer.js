const koa = require('koa');
const Router = require('koa-router');
const static = require('koa-static');
const mount = require('koa-mount');
const pug = require('pug');
const path = require('path');

const app = new koa();
const router = new Router();

dashboard = pug.compileFile(path.join(__dirname, 'pug', 'dashboard.pug'));

// serve files in static folder (css, js, images, etc)
app.use(mount('/static', static(path.join(__dirname, 'static'))));

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


app.listen(3000);