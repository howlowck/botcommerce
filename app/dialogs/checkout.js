const getCustomer = require('../services/getCustomer')

module.exports = function (bot, connection) {
  bot.dialog('/checkout', [
    function (session, args, next) {
      getCustomer(session, args, connection, next)
    },
    function (session, args, next) {
      session.endDialog('CHECKOUT DIALOG! YAY')
    }
  ])
}
