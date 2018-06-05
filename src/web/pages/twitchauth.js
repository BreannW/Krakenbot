const request = require('request-promise-native');
const jwt = require('jsonwebtoken');
const jwkToPem = require('jwk-to-pem');
const query = require('querystring').stringify;

const authurl = 'https://id.twitch.tv/oauth2/authorize?';
const tokenurl = 'https://id.twitch.tv/oauth2/token?';

var key;

request('https://id.twitch.tv/oauth2/keys', {json: true}).then(res=>key = (jwkToPem(res.keys[0])));

var pending = {};

module.exports = function(router){
  router.get('/login/twitch', async ctx=>{
    ctx.redirect(authurl + query({
      client_id: ctx.krakenbot.config.twitch['client-id'],
      redirect_uri: ctx.krakenbot.config.twitch['redirect-uri'],
      response_type: "code",
      scope: "openid"
    }));
    ctx.status = 302;
  });

  router.get('/auth/twitch', async ctx=>{
    var req = ctx.request.query;
    var response = await request({
      method: 'POST',
      url: tokenurl + query({
        client_id: ctx.krakenbot.config.twitch['client-id'],
        client_secret: ctx.krakenbot.config.twitch['client-secret'],
        redirect_uri: ctx.krakenbot.config.twitch['redirect-uri'],
        code: req['code'],
        grant_type: 'authorization_code'
      }),
      json: true
    });
    try {
      var package = {
        access: response.access_token,
        refresh: response.refresh_token,
        id: jwt.verify(response.id_token, key, {algorithms: ['RS256']})
      };
      ctx.body = 'Hello ' + package.id.preferred_username;
    } catch (E){
      ctx.body = E.toString();
      ctx.status = 401;
    }
  });
}