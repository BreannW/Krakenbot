async function run(config, argv){
  const twitch = require('./twitch/Twitch.js').start(config['twitch'], rec);
  var rec = {config, argv, twitch};
  if (!argv.nodb)
    await require('./database/DatabaseConnection.js').start(config['database'], rec);
  require('./web/Webserver.js').start(config['web'], rec);
}

module.exports = {run};
