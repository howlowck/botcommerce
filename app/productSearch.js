module.exports = function (bot) {
  bot.dialog('/productSearch', [
    function (session, args, next) {
      session.endDialog('PRODUCT DIALOG! YAY')
    }
  ])
}
