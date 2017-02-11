require('dotenv').config()
const restify = require('restify')
const builder = require('botbuilder')
const productSearchDialog = require('./app/dialogs/productSearch')
const viewCartDialog = require('./app/dialogs/viewCart')
const checkoutDialog = require('./app/dialogs/checkout')
const getCustomer = require('./app/services/getCustomer')
const addToCart = require('./app/dialogs/addToCart')

// =========================================================
// Bot Setup
// =========================================================

var Connection = require('tedious').Connection
var config = {
  userName: process.env.SQL_USERNAME,
  password: process.env.SQL_PASSWORD,
  server: process.env.SQL_SERVER,
  // If you are on Microsoft Azure, you need this:
  options: {encrypt: true, database: process.env.SQL_DBNAME, rowCollectionOnRequestCompletion: true}
}

var connection = new Connection(config)

connection.on('connect', (err) => {
  if (err) {
    console.log(err.stack)
  }
// If no error, then good to proceed.
  console.log('Connected')
})

// Setup Restify Server
var server = restify.createServer()
server.listen(process.env.port || process.env.PORT || 3978, function () {
  console.log('%s listening to %s', server.name, server.url)
})

// Create chat bot
var connector = new builder.ChatConnector({
  appId: process.env.MICROSOFT_APP_ID,
  appPassword: process.env.MICROSOFT_APP_PASSWORD
})
var bot = new builder.UniversalBot(connector)
server.post('/api/messages', connector.listen())

// Create LUIS recognizer that points at our model and add it as the root '/' dialog for our Cortana Bot.
var model = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/7182db75-b755-45d0-bf6c-5f3b8b1edcd7?subscription-key=' + process.env.LUIS_KEY + '&verbose=true'
var recognizer = new builder.LuisRecognizer(model)
var dialog = new builder.IntentDialog({ recognizers: [recognizer] })
bot.dialog('/', dialog)

// =========================================================
// Bots Dialogs
// =========================================================

productSearchDialog(bot, connection)
viewCartDialog(bot, connection)
checkoutDialog(bot, connection)
addToCart(bot, connection)

dialog.matches('greeting', [
  function (session, args, next) {
    session.send('Welcome to BotCommerce!')
    session.beginDialog('/mainMenu', args)
  }
])

dialog.matches('productSearch', [
  function (session, args, next) {
    session.beginDialog('/productSearch', args)
  }
])

dialog.matches('viewCart', [
  function (session, args) {
    session.beginDialog('/viewCart', args)
  }
])

dialog.matches('checkout', [
  function (session, args, next) {
    session.beginDialog('/checkout', args)
  }
])

dialog.matches('None', [
  function (session, args, next) {
    session.send('I\'m sorry, I didn\'t understand..')
    session.beginDialog('/mainMenu', args)
  }
])

// Main menu
bot.dialog('/mainMenu', [
  function (session, args, next) {
    getCustomer(session, args, connection, next)
  },
  function (session, args, next) {
    const message = session.message.address.user.name ? `Hi ${session.message.address.user.name}! ` : 'Welcome to BotCommerce!'
    builder.Prompts.choice(session, message + ' What would you like to do?', ['Search for products', 'View cart', 'Checkout'])
  },
  function (session, args, next) {
    switch (args.response.index) {
      case 0:
        // Initiate "Search for products" dialog
        session.send('Search for products')
        session.beginDialog('/productSearch', args)
        break
      case 1:
        // Initiate "View Cart" dialog
        session.send('View cart')
        session.beginDialog('/viewCart', args)
        break
      case 2:
        // Initiate "Checkout" dialog
        session.send('Checkout')
        session.beginDialog('/checkout', args)
        break
    }
  }
])
