const requestPromise = require('request-promise'),
      querystring = require("querystring");

const ENDPOINT = "http://ec2-54-185-227-52.us-west-2.compute.amazonaws.com:9000/public/v3/";
const SEARCH = "search/";
const ANIME = "anime";
const CHARACTER = "character";

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


module.exports = {
    search
}
