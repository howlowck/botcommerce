const builder = require('botbuilder')
const searchService = require('../services/searchService')

const extractEntities = (session, args) => {
  var foundEntities = []

  // Try to find entities
  var product = builder.EntityRecognizer.findEntity(args.entities, 'productName')
  var color = builder.EntityRecognizer.findEntity(args.entities, 'color')

  // check for null values
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
      // find LUIS entities and load into array
      var entities = extractEntities(session, args)
      if (entities) {
        console.log('entities: ', entities[0], entities[1])
        // Call Azure Search API
        const searchResult = searchService.search(entities[0], entities[1])
        session.send(`You want to search for a ${entities[1]} ${entities[0]}`)
        searchResult.then((productsFound) => {
          console.log('productsFound: ', productsFound)
          // Display cards
          session.beginDialog('/addToCart', session, productsFound, next)
          session.endDialog()
        })
      } else {
        console.log('entities: ', entities)
        // entities are undefined.. prompt for a product
        builder.Prompts.text(session, 'What product would you like to search for?')
      }
    },
    function (session, args, next) {
      var product = args.response
      session.send(`You want to search for ${product}`)
      const searchRequest2 = searchService.search(product, null)
      searchRequest2.then(productsFound => {
        console.log('productsFound: ', productsFound)
        // Display cards
        session.beginDialog('/addToCart', session, productsFound, next)
        session.endDialog()
      })
    }
  ])
}
