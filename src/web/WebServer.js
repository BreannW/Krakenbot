const koa = require('koa');
const Router = require('koa-router');
const static = require('koa-static');
const mount = require('koa-mount');
const session = require('koa-session');
const bodyParser = require('koa-bodyparser');
const path = require('path');

const pages = require('./pages');

function start(config, rec){
  const app = new koa();
  const router = new Router();

  // Adding program resources to ctx
  app.context.krakenbot = rec;

  // I think it is probably important to change this?
  app.keys = ['kaergjnarejng'];

  const sconfig = {}

  if (!rec.argv.nodb && config['use-db-for-sessions']){
    const db = rec.db.collection('sessions');
    db.createIndex('key', {
      unique: true
    });
    sconfig.store = {
      async get(key, maxage, {rolling}){
        return await db.findOne({key});
      },
      async set(key, sess, maxage, {rolling, changed}){
        await db.updateOne({key}, {$set: sess}, {
          upsert: true
        });
      },
      async destroy(key){
        await db.deleteOne({key});
      }
    }
  }

  app.use(session(sconfig, app));

  app.use(async (ctx, next) => {
    ctx.session.views = ctx.session.views || 0;
    ctx.session.views++;
    return next();
  });

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