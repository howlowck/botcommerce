// const builder = require('botbuilder')
const Request = require('tedious').Request

// query SQL dbo.Customers to get user's full name
function getName (session, bot, db) {
  // instantiate cart as empty array
  session.userData.cart = []
  // find user by skypeId
  const skypeId = session.message.address.user
  const nameRequest = new Request(`SELECT * FROM dbo.Customers as c WHERE c.skypeId = '${skypeId}';`, function (err) {
    if (err) {
      console.log(err)
    }
  })

  // search each column in row for name info
  nameRequest.on('row', function (columns) {
    let firstName = ''
    let lastName = ''

    columns.forEach((column) => {
      if (column.metadata.colName === 'firstName') {
        firstName = column.value
      }
      if (column.metadata.colName === 'lastName') {
        lastName = column.value
      }
    })

    // store user's name in userData
    session.userData.name = firstName + ' ' + lastName
  })

  db.execSql(nameRequest)
  // session.userData.name = results.response
  // session.endDialog()
}

module.exports = function (bot, db) {
  bot.dialog('/viewCart', [
    (session) => {
      if (session.userData.name == null) {
        // get user name
        getName(session, bot, db)
      }
    }
  ])
}
