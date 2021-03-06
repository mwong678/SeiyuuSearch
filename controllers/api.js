const rest = require('../util/rest'),
      tools = require("../util/tools");

const ANIME = "anime",
      PERSON = "person",
      CHARACTER = "character";

const search = async (req, res, next) => {
    const results = [],
          query = req.body.query,
          encodedQuery = encodeURIComponent(req.body.query),
          animeResults = await rest.search(encodedQuery, ANIME),
          chracterResults = await rest.search(encodedQuery, CHARACTER);


    for (var x = 0;x < animeResults.length;x++){
        const currAnime = animeResults[x];
        results.push({
                       url: currAnime.url,
                       name: currAnime.title,
                       image_url: currAnime.image_url,
                       mal_id: currAnime.mal_id,
                       type: ANIME
                    });

    }


    for (var x = 0;x < chracterResults.length;x++){
        const currCharacter = chracterResults[x];
        if (currCharacter.anime.length > 0){
          results.push({
                         url: currCharacter.url,
                         name: tools.normalizeName(currCharacter.name),
                         image_url: currCharacter.image_url,
                         mal_id: currCharacter.mal_id,
                         type: CHARACTER
                       });
        }
    }

    res.send({result: tools.sort(query, results)});
}

const find = async (req, res, next) => {
    const type = req.params.type,
          mal_id = req.params.mal_id;

    const results = await rest.find(type, mal_id);

    if (type == PERSON){
      req.findResults = tools.sortByWatched(results.results.voice_acting_roles, req.session.animelist);
      //console.log(req.findResults)
    } else {
      req.findResults = results.results;
    }

    req.title = results.name;

    return next();
};

const animelist = async (req, res) => {
    const username = req.params.username;
    start = new Date().getTime();
    const results = await rest.animelist(username);
    console.log(`Time elapsed: ${new Date().getTime() - start}`);
    return results;
};



module.exports = {
    find,
    search,
    animelist
}
