// const builder = require('botbuilder')
const Request = require('tedious').Request
const {ThumbnailCard, Message, CardImage} = require('botbuilder')

// query SQL dbo.Customers to get user's full name
function getCart (session, db, next) {
  // instantiate cart as empty array
  session.userData.cart = []
  // find user by skypeId
  const userId = session.userData.userId
  const sql = `select c.quantity, p.price, p.name, p.category, p.description, p.image from dbo.Carts as c left join dbo.Products as p on c.productId = p.id where c.customerId = ${userId}`
  const productsRequest = new Request(sql, function (err, rowCount, rows) {
    if (err) {
      console.log(err.stack)
    }
    const products = rows.map((columns) => {
      return {
        quantity: columns[0].value,
        price: columns[1].value,
        name: columns[2].value,
        category: columns[3].value,
        description: columns[4].value,
        image: columns[5].value
      }
    })
    next(products)
    // store user's name in userData
  })

  db.execSql(productsRequest)
}

function displayCart (session, products, next) {
  session.sendTyping()
  const cards = products.map(product => {
    return new ThumbnailCard(session)
      .title(product.name)
      .subtitle('$' + product.price)
      .images([CardImage.create(session, product.image)])
      .text(`${product.description} | quantity: ${product.quantity}`)
  })
  session.send(new Message(session)
    .attachmentLayout('list')
    .attachments(cards))

  const price = products.reduce((prev, current, currentIndex) => {
    return prev + (current.price * current.quantity)
  }, 0)

  session.send(`Total price: ${price}`)
}

module.exports = function (bot, db) {
  bot.dialog('/viewCart', [
    (session, args, next) => {
      getCart(session, db, next)
    },
    displayCart
  ])
}
