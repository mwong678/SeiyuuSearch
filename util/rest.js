const requestPromise = require('request-promise'),
      querystring = require("querystring");

const //ENDPOINT = "http://172.31.21.133:9000/public/v3/", //"http://ec2-54-185-227-52.us-west-2.compute.amazonaws.com:9000/public/v3/",
      ENDPOINT = "http://ec2-54-185-227-52.us-west-2.compute.amazonaws.com:9000/public/v3/",
      SEARCH = "search/",
      ANIME = "anime",
      PERSON = "person",
      CHARACTER = "character";


const search = async(query, type) => {
  const searchParameters = {
        url: ENDPOINT + SEARCH + `${type}?q=${query}`,
        json: true
  };

  try {
    return (await requestPromise.get(searchParameters)).results;
  } catch(e) {
    if (e.statusCode != 404){
      console.error(`${e.statusCode}: Error searching for ${type} -> ${e.error}`);
    }
    return [];
  }
};

const find = async(type, mal_id) => {
  const url = (type == ANIME) ? `${ENDPOINT}${type}/${mal_id}/characters_staff` : `${ENDPOINT}${type}/${mal_id}`;
  const searchParameters = {
        url: url,
        json: true
  };

  try {
    var results =  (await requestPromise.get(searchParameters));
    return results;
  } catch(e) {
    if (e.statusCode != 404){
      console.error(`${e.statusCode}: Error searching for ${type} -> ${e.error}`);
    }
    return [];
  }
};


const animelist = async(username) => {
  const results = {};

  let offset = 0,
      url = `${ENDPOINT}user/${username}/animelist/all/${offset}`;

  var malParameters = {
        url: url,
        json: true
  };

  try {
    var malResults =  (await requestPromise.get(malParameters)).anime;

    if (malResults != null){
      while (malResults.length > 0){
        for (var x = 0; x < malResults.length;x++){
          const currTitle = malResults[x];
          results[currTitle.mal_id] = currTitle.watching_status;
        }
        offset += 1;
        malParameters = {
              url: `${ENDPOINT}user/${username}/animelist/all/${offset}`,
              json: true
        };
        malResults =  (await requestPromise.get(malParameters)).anime;
      }
    }

    return results;
  } catch(e) {
    if (e.statusCode != 404){
      console.error(`${e.statusCode}: Error get MAL list for ${username} -> ${e.error}`);
    }
    return results;
  }
};



module.exports = {
    search,
    find,
    animelist
}
