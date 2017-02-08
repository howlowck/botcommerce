const builder = require('botbuilder')
const searchService = require('./services/searchService')

const extractEntities = (session, args) => {
  var foundEntities = []

  // Try to find entities
  var product = builder.EntityRecognizer.findEntity(args.entities, 'productName')
  var color = builder.EntityRecognizer.findEntity(args.entities, 'color')

  if (product) {
    // We found a product entity
    foundEntities.push(product.entity)

    if (color) {
      // We found a color entity
      foundEntities.push(color.entity)
    } else {
      // If no color was found, send null
      foundEntities.push(null)
    }

    return foundEntities
  }

  // We didn't find a product entity
  return undefined
}

module.exports = function (bot) {
  bot.dialog('/productSearch', [
    function (session, args, next) {
      // console.log(JSON.stringify(session, null, 4))
      // console.log(JSON.stringify(args, null, 4))

      var entities = extractEntities(session, args)

      if (entities) {
        // Call Azure Search API
        // Display cards
        searchService.search(entities[0], entities[1])
        session.send('You want to search for %j' + entities)
      } else {
        builder.Prompts.text('What product would you like to search for?')
      }
    },
    function (session, args, next) {
      var product = args.response

      session.send('You want to search for ' + product)
      searchService.search(product, null)

      session.endDialog()
    }
  ])
}
