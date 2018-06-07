const Twitch = require("tmi.js");

async function start(config, rec){
  const options = {
    connection:{
      reconnect: true
    },
    identity: {
      username: config['username'],
      password: 'oauth:' + config['tmi-key']
    }
  }
  const bot = new Twitch.client(options);

  bot.on('connected', () => {
    console.log(`Logged into twitch irc as ${bot.getUsername()}!`);
  });

  await bot.connect();

  return bot;
}

module.exports = {start};