// not the actual [secondary] admin/api-key
var queryKey = 'D313DF388316446D8E255E783BA327D4'
let queryString = ''
var searchEndpoint = `https://botcommercev2.search.windows.net
/indexes/product/docs?${queryString}&api-version=2016-09-01&api-key=${queryKey}`

module.exports = {

    search: function search (term) {
        // search=helmet&facet=Color AND $filter=Color eq ‘Red’
        queryString = 'search=helmet&facet=Color'

        require('http').get(searchEndpoint, (res) => {
            res.setEncoding('utf8')
            res.on('data', function (body) {
                console.log(body)
            })
        })
    }
}
