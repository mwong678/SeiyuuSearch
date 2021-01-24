const levenshtein = require('js-levenshtein');


function normalizeName(name){
  if (name.indexOf(",") > -1){
    const split = name.split(",");
    return `${split[1].replace(/\s/g, '')} ${split[0].replace(/\s/g, '')}`;
  } else {
    return name
  }
}

function sort(query, array){
    query = query.toLowerCase();
    return array.sort(function(a, b){
       const aName = a.name.toLowerCase(),
             bName = b.name.toLowerCase();

       if (aName.indexOf(query) > -1){
            if (bName.indexOf(query) > -1){
                return levenshtein(aName, query) - levenshtein(bName, query);
            } else {
                return -1;
            }
       } else {
            if (bName.indexOf(query) == -1){
                return levenshtein(aName, query) - levenshtein(bName, query);
            } else {
                return 1;
            }
       }
    });
}

function sortByWatched(voiceActorRoles, userList){
  return voiceActorRoles.sort(function(a, b){
     const malIdA = a.anime.mal_id,
           malIdB = b.anime.mal_id,
           malNameA = a.anime.name,
           malNameB = b.anime.name;

    if (!userList){
      return malNameA < malNameB;
    }

     if (userList[malIdA] && userList[malIdA] != 6){
       if (userList[malIdB] && userList[malIdB] != 6){
         return malNameA < malNameB;
       } else {
         return -1;
       }
     } else if (userList[malIdB] && userList[malIdB] != 6){
       return 1;
     } else {
       return malNameA < malNameB;
     }
  });
}

module.exports = {
    sort,
    sortByWatched,
    normalizeName
}
