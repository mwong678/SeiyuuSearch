const levenshtein = require('js-levenshtein');


function normalizeName(name){
  if (name.indexOf(",") > -1){
    var split = name.split(",");
    return split[1].replace(/\s/g, '') + " " + split[0].replace(/\s/g, '');
  } else {
    return name
  }
}

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

/*
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
*/

module.exports = {
    sort,
    normalizeName
}
