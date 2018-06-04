function run(config){
  require('./web/Webserver.js').start(config['web']);
}

module.exports = {run};
