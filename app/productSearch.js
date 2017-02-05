const searchService = require('./services/searchService')

module.exports = function (bot) {
  bot.dialog('/productSearch', [
    function (session, args, next) {
      session.endDialog('PRODUCT DIALOG! YAY')
      searchService.search('foobar')
    }
  ])
}
