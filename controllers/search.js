const api = require('../util/api'),
      tools = require("../util/tools");

const ANIME = "anime";
const CHARACTER = "character";

const searchJinkan = async (req, res) => {
    var results = [];
    var query = encodeURIComponent(req.body.query);
    var animeResults = await api.search(query, ANIME);
    var chracterResults = await api.search(query, CHARACTER);


    for (var x = 0;x < animeResults.length;x++){
        const currAnime = animeResults[x];
        results.push({ url: currAnime.url,
                       name: currAnime.title,
                       image_url: currAnime.image_url,
                       mal_id: currAnime.mal_id,
                       type: "anime"
                    });

    }


    for (var x = 0;x < chracterResults.length;x++){
        const currCharacter = chracterResults[x];
        if (currCharacter.anime.length > 0){
          //console.log(`${currCharacter.name} -> ${currCharacter.alternative_names}`);
          results.push({ url: currCharacter.url,
                         name: tools.normalizeName(currCharacter.name),
                         image_url: currCharacter.image_url,
                         mal_id: currCharacter.mal_id,
                         type: "character"
                       });
        }
    }

    res.send({result: tools.sort(query, results)});
}

module.exports = {
    searchJinkan
}
