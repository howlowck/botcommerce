// const builder = require('botbuilder')
const Request = require('tedious').Request
var TYPES = require('tedious').TYPES
var humanname = require('humanname')

// // add customer to dbo.Customers
function addCustomer (session, args, connection, next) {
  // Insert row...
  const addRequest = new Request(`INSERT INTO Customers (firstName, lastName, skypeId) VALUES (@firstNameVal, @lastNameVal, @skypeIdVal)`,
    function (err, rowCount, rows) {
      if (err) {
        console.log(err.stack)
      }
      // get id key
      getCustomer(session, args, connection, next)
    })

  var parsed = humanname.parse(session.message.address.user.name)
  addRequest.addParameter('firstNameVal', TYPES.VarChar, parsed.firstName)
  addRequest.addParameter('lastNameVal', TYPES.VarChar, parsed.lastName)
  addRequest.addParameter('skypeIdVal', TYPES.VarChar, session.message.address.user.id)
  connection.execSql(addRequest)
}

// query SQL dbo.Customers
function getCustomer (session, args, connection, next) {
  // find user by skypeId
  const skypeId = session.message.address.user.id
  console.log('skypeId: ', skypeId)
  console.log('address.user.name: ', session.message.address.user.name)

  const nameRequest = new Request(`SELECT * FROM dbo.Customers as c WHERE c.skypeId = '${skypeId}';`, function (err, rowCount, rows) {
    if (err) {
      console.log(err.stack)
    }
    console.log(rows)
    // check if a matching row returned
    if (rows.length === 0) {
      // user does not exist in dbo.Customers
      // add user to new row
      console.log('user does not exist in DB')
      addCustomer(session, args, connection, next)
    } else {
      var columns = rows[0]
      // user exists in dbo.Customers
      // get id key
      columns.forEach((column) => {
        if (column.metadata.colName === 'id') {
          session.userData.userId = column.value
          console.log('customerId: ', session.userData.userId)
          next()
        }
      })
    }
  })
  connection.execSql(nameRequest)
}

module.exports = getCustomer
