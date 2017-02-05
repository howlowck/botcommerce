const searchService = require('./services/searchService')

module.exports = function (bot) {
  bot.dialog('/productSearch', [
    function (session, args, next) {
      session.endDialog('PRODUCT DIALOG! YAY')
      // searchService.search(args[0], args[1])
      searchService.search('bike', 'red')
    }
  ])
}
