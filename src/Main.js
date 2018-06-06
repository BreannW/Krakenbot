const rec = {};
function run(config, argv){
  rec.config = config;
  require('./web/Webserver.js').start(config['web'], rec);
  if (!argv.nodb)
  require('./database/DatabaseConnection.js').start(config['database'], rec);
}

module.exports = {run};
