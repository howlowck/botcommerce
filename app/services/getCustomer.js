// const builder = require('botbuilder')
const Request = require('tedious').Request

// query SQL dbo.Customers
function getCustomer (session, args, connection, next) {
  // find user by skypeId
  const skypeId = session.message.address.user.id
  console.log('skypeId: ', skypeId)

  const nameRequest = new Request(`SELECT * FROM dbo.Customers as c WHERE c.skypeId = '${skypeId}';`, function (err, rowCount, rows) {
    if (err) {
      console.log(err.stack)
    }
    var columns = rows[0]
    columns.forEach((column) => {
      if (column.metadata.colName === 'id') {
        session.userData.userId = column.value
        console.log('customerId: ', session.userData.userId)
      }
    })
    next()
  })

  connection.execSql(nameRequest)
}

module.exports = function (session, args, connection, next) {
  // check if user is in dbo.Customers
  getCustomer(session, args, connection, next)
}
