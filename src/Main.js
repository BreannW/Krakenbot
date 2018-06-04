const rec = {};
function run(config){
  require('./web/Webserver.js').start(config['web']);
  require('./database/DatabaseConnection.js').start(config['database'], rec);
}

module.exports = {run};
