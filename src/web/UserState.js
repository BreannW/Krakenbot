module.exports = async (ctx, next) => {
  if (ctx.session.twitch_user){
    ctx.twitch_user = 
      (await ctx.krakenbot.twitch.helix.users({id: ctx.session.twitch_user})).data[0];
  }
  return next();
}