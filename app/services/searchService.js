var searchEndpoint = `http://botcommerce.search.windows.net/indexes/temp/docs?{$queryString}&api-version=2016-09-01`
// shopping, view cart and check out
module.exports = {

    search: function search(term) {
        // search=helmet&facet=Color AND $filter=Color eq ‘Red’
        var queryString = 'search=helmet&facet=Color'

        require('http').get(searchEndpoint, (res) => {
            res.setEncoding('utf8');
            res.on('data', function (body) {
                console.log(body);
            });
        });
    }
}
