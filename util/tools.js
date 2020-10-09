const levenshtein = require('js-levenshtein');

function sort(query, array){
    return array.sort(function(a, b){
        return levenshtein(a.name, query) - levenshtein(b.name, query);
    });
}

module.exports = {
    sort
}