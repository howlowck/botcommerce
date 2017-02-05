const builder = require('botbuilder')

const extractEntities = (session, args) => {
  var foundEntities = []

  // Try to find entities
  var product = builder.EntityRecognizer.findEntity(args.entities, 'productName')
  var color = builder.EntityRecognizer.findEntity(args.entities, 'color')

  if (product) {
    // We found a product entity
    foundEntities.push(product)

    if (color) {
      // We found a color entity
      foundEntities.push(color)
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
      var entities = extractEntities(session, args)

      if (entities) {
        // Call Azure Search API
        // Display cards
        session.send('You want to ')
      } else {
        builder.Prompts.text('What product would you like to search for?')
      }
    },
    function (session, args, next) {
      var product = args.response

      session.send('You want to search for ' + product)
      session.endDialog()
    }
  ])
}
