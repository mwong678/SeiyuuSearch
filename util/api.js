const tools = require("./tools"),
      request = require('request'),
      requestPromise = require('request-promise')
      logger = require('morgan');

const ENDPOINT = "http://ec2-54-185-227-52.us-west-2.compute.amazonaws.com:9000/public/v3/";
const SEARCH = "search/";
const ANIME = "anime";
const CHARACTER = "character";

const search = async (query) => {
    const animeParameters = {
        url: ENDPOINT + SEARCH + `${ANIME}?q=${query}&limit=25`,
        json: true
    };

    const characterParameters = {
        url: ENDPOINT + SEARCH + `${CHARACTER}?q=${query}&limit=25`,
        json: true
    };

    try{
        const results = [];
        var animeResult = (await requestPromise.get(animeParameters)).results;
        var characterResult = (await requestPromise.get(characterParameters)).results;

        for (var x = 0;x < animeResult.length;x++){
            const currAnime = animeResult[x];
            results.push({ url: currAnime.url, 
                           name: currAnime.title,
                           image_url: currAnime.image_url,
                           mal_id: currAnime.mal_id,
                           type: "anime"
                        });
            
        }

        for (var x = 0;x < characterResult.length;x++){
            const currCharacter = characterResult[x];
            results.push({ url: currCharacter.url, 
                           name: currCharacter.name,
                           image_url: currCharacter.image_url,
                           mal_id: currCharacter.mal_id,
                           type: "character"
                         });
        }
        
        var sortedResults = tools.sort(query, results);
        for (var x = 0;x < sortedResults.length;x++){
            var curr = sortedResults[x];
            console.log(curr.name);
        }

        console.log('\n\n');

        return characterResult;
    }catch(e){
        console.log(`ERROR SEARCHING JINKAN -> ${e.message}`, 'error');
        return null;
    }
}



module.exports = {
    search
}