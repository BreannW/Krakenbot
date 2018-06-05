const request = require('request-promise-native');
const jwt = require('jsonwebtoken');
const jwkToPem = require('jwk-to-pem');
const query = require('querystring').stringify;

const {Keygen} = require('../../util');

const authurl = 'https://id.twitch.tv/oauth2/authorize?';
const tokenurl = 'https://id.twitch.tv/oauth2/token?';

var key;

// Grabbing twitches public jwt signature for verifying id tokens.
request('https://id.twitch.tv/oauth2/keys', {json: true}).then(res=>key = (jwkToPem(res.keys[0])));

var pending = {};

module.exports = function(router){
  // We send users to /login/twitch to start the "Log in Twitch" process
  router.get('/login/twitch', async ctx=>{
    // We redirect them to twitches authentication 
    // server where they get the message "Authorize... to use you account?...."
    ctx.redirect(authurl + query({
      client_id: ctx.krakenbot.config.twitch['client-id'],
      redirect_uri: ctx.krakenbot.config.twitch['redirect-uri'],
      response_type: "code",
      scope: "openid"
    }));
    ctx.status = 302;
  });

  // When authenticated twitch will redirect them back here with a code for us.
  router.get('/auth/twitch', async ctx=>{
    var req = ctx.request.query;
    // We need to veryfy with twitch that the code sent to us is valid
    // If it is, they will respond with an access toekn, a refresh token and an signed ID
    var response = await request({
      method: 'POST',
      url: tokenurl + query({
        client_id: ctx.krakenbot.config.twitch['client-id'],
        client_secret: ctx.krakenbot.config.twitch['client-secret'],
        redirect_uri: ctx.krakenbot.config.twitch['redirect-uri'],
        code: req['code'], // The code the users browser sent us to be verified
        grant_type: 'authorization_code'
      }),
      json: true
    });
    try {
      var package = {
        access: response.access_token,
        refresh: response.refresh_token,
        // We need to using twitches public key decode and verify our id token.
        id: jwt.verify(response.id_token, key, {algorithms: ['RS256']}) 
      };
      ctx.body = 'Hello ' + package.id.preferred_username;
    } catch (E){
      // If there was an error in there tell the user they are not authenticated.
      ctx.body = E.toString();
      ctx.status = 401;
    }
  });
}