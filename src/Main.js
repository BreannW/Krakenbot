async function run(config, argv){
  var rec = {config, argv};
  rec.twitch = await require('./twitch/Twitch.js').start(config['twitch'], rec);
  if (!argv.nodb)
    await require('./database/DatabaseConnection.js').start(config['database'], rec);
  require('./web/Webserver.js').start(config['web'], rec);
}

module.exports = {run};
