const levenshtein = require('js-levenshtein');

function sort(query, array){
    return array.sort(function(a, b){
       if (a.name.indexOf(query) > -1){
            if (b.name.indexOf(query) > -1){
                return levenshtein(a.name, query) - levenshtein(b.name, query);
            }else{
                return -1;
            }
       }else{
            if (b.name.indexOf(query) == -1){
                return levenshtein(a.name, query) - levenshtein(b.name, query);
            }else{
                return 1;
            }
       }
    });
}

module.exports = {
    sort
}