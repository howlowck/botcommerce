// const builder = require('botbuilder')
const Request = require('tedious').Request

// query SQL dbo.Customers to get user's full name
function getCart (session, bot, db, next) {
  // instantiate cart as empty array
  session.userData.cart = []
  // find user by skypeId
  const skypeId = session.message.address.user.id
  console.log('skypeId: ', skypeId)
  const nameRequest = new Request(`SELECT * FROM dbo.Customers as c WHERE c.skypeId = '${skypeId}';`, function (err, rowCount, rows) {
    if (err) {
      console.log(err.stack)
    }
    var columns = rows[0]
    console.log('columns', columns)
    columns.forEach((column) => {
      if (column.metadata.colName === 'id') {
        session.userData.user.id = column.value
      }
    })

    // store user's name in userData
    next({name: session.userData.name})
    session.endDialog()
  })

  db.execSql(nameRequest)
}

module.exports = function (bot, db) {
  bot.dialog('/viewCart', [
    (session, args, next) => {
      if (!session.userData.name) {
        // get user name
        getCart(session, bot, db, next)
      }
    },
    (session, payload, next) => {
      session.send(`hey! ${payload.name} !!`)
    }
  ])
}
