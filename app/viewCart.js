const builder = require('botbuilder')
const Request = require('tedious').Request

module.exports = function (bot, db) {
  bot.dialog('/viewCart', [
    (session) => {
      builder.Prompts.text(session, 'Hi! What is your name?')
    },
    (session, results) => {
      const firstName = results.response
      const nameRequest = new Request(`SELECT * FROM dbo.Customers as c WHERE c.firstName = '${firstName}';`, function (err, rowCount) {
        if (err) {
          console.log(err)
        } else {
          console.log(rowCount + ' rows')
        }
      })

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

        session.send(`Hi ${firstName} ${lastName}`)
        session.userData.name = firstName + ' ' + lastName
      
        session.endDialog()
      })

      db.execSql(nameRequest)
      // session.userData.name = results.response
      // session.endDialog()
    },
    (session, args, next) => {
      session.endDialog('VIEWCART DIALOG! YAY')
    }
  ])
}
