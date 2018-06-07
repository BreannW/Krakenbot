const querystring = require('querystring');
const request = require('request-promise-native');

const KrakenAPI = require('./api/Kraken.js');
const HelixAPI = require('./api/Helix.js');
const Chatbot = require('./Chatbot.js');

const noop = () => {}; // eslint-disable-line no-empty-function
const reflectors = [
  'toString', 'valueOf', 'inspect', 'constructor',
  Symbol.toPrimitive, Symbol.for('util.inspect.custom'),
];

function buildRoute(api, prefix = "") {
  const route = [''];
  const handler = {
    get(target, name) {
      if (reflectors.includes(name)) return route;
      route.push(name);
      return new Proxy(noop, handler);
    },
    apply(target, _, args) {
      var path = prefix + route.join('/');
      if (args.length>0) path = path + '?' + querystring.stringify(args[0]);
      return api.push(path);
    },
  };
  return new Proxy(noop, handler);
}

async function start(config, rec){
  const krakenapi = new KrakenAPI(request.defaults({
        baseUrl: 'https://api.twitch.tv/kraken/',
        headers: {
          'Accept': 'application/vnd.twitchtv.v5+json',
          'Client-ID': config['client-id']
        },
        json: true
      }));
  const helixapi = new HelixAPI(request.defaults({
        baseUrl: 'https://api.twitch.tv/helix/',
        headers: {
          'Accept': 'application/json',
          'Client-ID': config['client-id']
        },
        json: true
      }));
  const tmiapi = {push: request.defaults({
        baseUrl: 'https://tmi.twitch.tv/', json: true
      })};
  
  return {
    get tmi() {
      return buildRoute(tmiapi);
    },
    get kraken() {
      return buildRoute(krakenapi);
    },
    get helix(){
      return buildRoute(helixapi);
    },
    // get hook(){
    //   return buildRoute(webhookapi, 'https://api.twitch.tv/helix');
    // },
    bot: await Chatbot.start(config, rec)
  }
}

module.exports = {start};