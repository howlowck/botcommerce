// not the actual admin or secondary admin api-key, if given will provide access to modify our index XD
var fetch = require('node-fetch')
var queryKey = process.env.AZURE_SEARCH_QUERY_KEY

module.exports = {
  search: function search (productName, color) {
    var queryString = `search=${productName}`
    if (color !== null || color !== '') {
      color = color[0].toUpperCase() + color.slice(1)
      queryString += `&$filter=Color eq '${color}'`
    }
    var searchEndpoint = `https://botcommercev2.search.windows.net/indexes/product/docs?${queryString}&api-version=2016-09-01&api-key=${queryKey}`
    fetch(searchEndpoint)
      .then(function (res) {
        return res.json()
      }).then(function (json) {
        console.log(json)
      })
  }
}
