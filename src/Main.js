const rec = {};
function run(config){
  rec.config = config;
  require('./web/Webserver.js').start(config['web'], rec);
  require('./database/DatabaseConnection.js').start(config['database'], rec);
}

module.exports = {run};
