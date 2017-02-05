require('dotenv').config()
const restify = require('restify')
const builder = require('botbuilder')
const productSearchDialog = require('./app/productSearch')
const viewCartDialog = require('./app/viewCart')
const checkoutDialog = require('./app/checkout')

// =========================================================
// Bot Setup
// =========================================================

var Connection = require('tedious').Connection
var config = {
  userName: process.env.SQL_USERNAME,
  password: process.env.SQL_PASSWORD,
  server: process.env.SQL_SERVER,
  // If you are on Microsoft Azure, you need this:
  options: {encrypt: true, database: process.env.SQL_DBNAME}
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

// =========================================================
// Bots Dialogs
// =========================================================

// TODO:
//  Greeting
//  Bot Help: what can this bot do?

// Main menu
bot.dialog('/', [
  function (session, args, next) {
    builder.Prompts.choice(session, 'Welcome to BotCommerce! What would you like to do?', ['Search for products', 'View cart', 'Checkout'])
  },
  function (session, args, next) {
    switch (args.response.index) {
      case 0:
        // Initiate "Search for products" dialog
        session.send('Search for products')
        productSearchDialog(bot, connection)
        session.beginDialog('/productSearch')
        break
      case 1:
        // Initiate "View Cart" dialog
        session.send('View cart')
        viewCartDialog(bot, connection)
        session.beginDialog('/viewCart')
        break
      case 2:
        // Initiate "Checkout" dialog
        session.send('Checkout')
        checkoutDialog(bot, connection)
        session.beginDialog('/checkout')
        break
    }
  }
])
