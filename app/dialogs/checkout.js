module.exports = function (bot) {
  bot.dialog('/checkout', [
    function (session, args, next) {
      session.endDialog('CHECKOUT DIALOG! YAY')
    }
  ])
}
