const path = require('path');
const pug = require('pug');

const login = pug.compileFile(path.join(__dirname, '..', 'pug', 'login.pug'));  

module.exports = function(router){
  router.get('/login', async (ctx)=>{
    ctx.body = login();
  });
}