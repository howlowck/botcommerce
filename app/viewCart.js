// const builder = require('botbuilder')
const Request = require('tedious').Request

// query SQL dbo.Customers to get user's full name
function getName (session, bot, db) {
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

    // // store user's name in userData
    session.userData.name = firstName + ' ' + lastName
    session.endDialog()
  })
  console.log('called before sql execute')
  // search each column in row for name info

  db.execSql(nameRequest)
}

module.exports = function (bot, db) {
  bot.dialog('/viewCart', [
    (session) => {
      if (!session.userData.name) {
        // get user name
        getName(session, bot, db)
        console.log('dialog! ', session.userData.name)
      }
    }
  ])
}
