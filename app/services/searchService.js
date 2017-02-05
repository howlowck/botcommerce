// not the actual admin or secondary admin api-key, if given will provide access to modify our index XD
var queryKey = 'D313DF388316446D8E255E783BA327D4'
var queryString = ''
var searchEndpoint = `https://botcommercev2.search.windows.net/indexes/product/docs?${queryString}&api-version=2016-09-01&api-key=${queryKey}`

module.exports = {

    search: function search (productName, color) {
        queryString = 'search=${productName}'
        if (color !== null || color !== '') {
            queryString += '&filter= eq {color}'
        }

        require('https').get(searchEndpoint, (res) => {
            res.setEncoding('utf8')
            res.on('data', function (body) {
                console.log(body)
            })
        })
    }
}
