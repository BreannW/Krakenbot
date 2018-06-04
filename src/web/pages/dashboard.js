const path = require('path');
const pug = require('pug');

const dashboard = pug.compileFile(path.join(__dirname, '..', 'pug', 'dashboard.pug'));  

module.exports = function(router){
  router.get('/dashboard', async (ctx)=>{
    ctx.body = dashboard();
  });
}