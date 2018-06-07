module.exports = function(router){
  router.get('/control/joinbot', async (ctx)=>{
    if (ctx.twitch_user){
      ctx.status = 202;
      setImmediate(async ()=>{
        const channel = `#${ctx.twitch_user.login}`;
        await ctx.krakenbot.twitch.bot.join(channel);
        ctx.krakenbot.twitch.bot.say(channel, "o/");
      });
    } else {
      ctx.status = 400;
      ctx.body = 'Please login in to perform that command.';
    }
  });
}