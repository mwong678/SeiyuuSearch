const levenshtein = require('js-levenshtein');

function sort(query, array){
    query = query.toLowerCase();
    return array.sort(function(a, b){
       var aName = a.name.toLowerCase();
       var bName = b.name.toLowerCase();

       if (aName.indexOf(query) > -1){
            if (bName.indexOf(query) > -1){
                return levenshtein(aName, query) - levenshtein(bName, query);
            }else{
                return -1;
            }
       }else{
            if (bName.indexOf(query) == -1){
                return levenshtein(aName, query) - levenshtein(bName, query);
            }else{
                return 1;
            }
       }
    });
}

module.exports = {
    sort
}