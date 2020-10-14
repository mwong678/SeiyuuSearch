const API_ENDPOINT = "http://172.31.21.133:9000/public/v3/",
      COOKIE_USERNAME = "username",
      SEARCH = "search"
      ANIME = "anime",
      PERSON = "person",
      CHARACTER = "character";

var historyStack = new Stack();
var userList = {};


function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

function snapToTop(){
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

function showContainer(name){
  snapToTop();
  switch (name) {
    case SEARCH:
      $("#searchContainer").show();
      $("#animeContainer").hide();
      $("#characterContainer").hide();
      $("#personContainer").hide();
      break;
    case ANIME:
      $("#searchContainer").hide();
      $("#animeContainer").show();
      $("#characterContainer").hide();
      $("#personContainer").hide();
      break;
    case CHARACTER:
      $("#searchContainer").hide();
      $("#animeContainer").hide();
      $("#characterContainer").show();
      $("#personContainer").hide();
      break;
    case PERSON:
      $("#searchContainer").hide();
      $("#animeContainer").hide();
      $("#characterContainer").hide();
      $("#personContainer").show();
      break;
    default:
      break;
  }
}

async function generateUserList(username){
  console.log("Constructing User Watch Library...");
  $.ajax({
      type: 'GET',
      url: `/api/animelist/${username}`,
      dataType: 'json',
      success: function(data) {
        if (data != null){
          console.log("Finished constructing User Watch Library...");
          userList = data.result;
        }
      }
    });
}

function populateVoiceActorResults(name, data){
  const voiceActorResults = data.result;
  if (voiceActorResults != null) {
    const username = getCookie(COOKIE_USERNAME),
          voiceActingRoles = voiceActorResults.voice_acting_roles;

    showContainer(PERSON);
    $("#personResultsList").empty();
    $("#personTitle").text(name);
    for (var x = 0;x < voiceActingRoles.length; x++){
      const currResult = voiceActingRoles[x],
            currAnimeResult = currResult.anime,
            currCharacterResult = currResult.character,
            animeName = currAnimeResult.name,
            anime_mal_id = currAnimeResult.mal_id,
            anime_image_url = currAnimeResult.image_url,
            characterName = currCharacterResult.name,
            character_mal_id = currCharacterResult.mal_id,
            character_image_url = currCharacterResult.image_url,
            type = PERSON,
            display_name = `${name} (${type})`,
            rowColor = (userList[anime_mal_id] && userList[anime_mal_id] != 6) ? "rgb(255, 217, 92)" : "rgb(255, 255, 255)";

      $("#personResultsList").append(`<li class=personResultRow id=${anime_mal_id} style=\"background-color: ${rowColor};\">
                                      <div class=personResultDiv >
                                        <div class=voiceActorPictureDiv>
                                          <img src=${anime_image_url} class=animeCharacterImageUrl>
                                        </div>
                                        <div class=voiceActorTextDiv>
                                          <span class=voiceActorAnimeImageName>${animeName}</span>
                                          <span class=voiceActorCharacterImageName>${characterName}</span>
                                        </div>
                                        <div class=voiceActorPictureDiv>
                                          <img src=${character_image_url} class=animeCharacterImageUrl>
                                        </div>
                                      </div>
                                    </li>`);

    }
  }
}

function populateCharacterResults(name, data){
  const characterResults = data.result;
  if (characterResults != null) {
    const voiceActors = characterResults.voice_actors;
    showContainer(CHARACTER);
    $("#characterResultsList").empty();
    $("#characterTitle").text(name);
    for (var x = 0;x < voiceActors.length; x++){
      const currResult = voiceActors[x],
            name = currResult.name,
            mal_id = currResult.mal_id,
            type = PERSON,
            image_url = currResult.image_url,
            language = currResult.language,
            display_name = `${name} (${type})`;

      $("#characterResultsList").append(`<li class=characterResultRow>
                                      <div class=characterResultDiv>
                                        <img src=${image_url} id=${type}-${mal_id} name=\"${display_name}\" class=voiceActorImageUrl>
                                        <div class=voiceActorInfoDiv>
                                          <span class=voiceActorImageName>${name}</span>
                                          <span class=voiceActorImageLanguage>${language}</span>
                                        </div>
                                      </div>
                                    </li>`);
    }

    $(".voiceActorImageUrl").click(function(e) {
      historyStack.push(CHARACTER);
      const searchParameters = $(this).attr('id').split("-"),
            name = $(this).attr('name'),
            type = searchParameters[0],
            mal_id = searchParameters[1];

      $.ajax({
          type: 'GET',
          url: `/api/find/${type}/${mal_id}`,
          dataType: 'json',
          success: function(data) {
            populateVoiceActorResults(name, data)
          }
        });
    });
  }
}


function populateAnimeResults(name, data){
  const animeResults = data.result;
  if (animeResults != null) {
    const characters = animeResults.characters;
    showContainer(ANIME);
    $("#animeResultsList").empty();
    $("#animeTitle").text(name);
    for (var x = 0;x < characters.length; x++){
      const currResult = characters[x],
            name = currResult.name,
            mal_id = currResult.mal_id,
            type = CHARACTER,
            image_url = currResult.image_url,
            role = currResult.role,
            display_name = `${name} (${type})`;

      $("#animeResultsList").append(`<li class=animeResultRow>
                                      <div class=animeResultDiv>
                                        <img src=${image_url} id=${type}-${mal_id} name=\"${display_name}\" class=characterImageUrl>
                                        <div class=characterInfoDiv>
                                          <span class=characterImageName>${name}</span>
                                          <span class=characterImageRole>${role} Character</span>
                                        </div>
                                      </div>
                                    </li>`
                                  );
    }

    $(".characterImageUrl").click(function(e) {
      historyStack.push(ANIME);
      const searchParameters = $(this).attr('id').split("-"),
            name = $(this).attr('name'),
            type = searchParameters[0],
            mal_id = searchParameters[1];

      $.ajax({
          type: 'GET',
          url: `/api/find/${type}/${mal_id}`,
          dataType: 'json',
          success: function(data) {
            populateCharacterResults(name, data)
          }
        });

    });


  }
}

function populateSearchResults(data){
  $("#searchResultsList").empty();
  const searchResults = data.result;
  if (searchResults != null) {
    for (var x = 0;x < searchResults.length; x++){
      const currResult = searchResults[x],
            name = currResult.name,
            mal_id = currResult.mal_id,
            type = currResult.type,
            image_url = currResult.image_url,
            display_name = `${name} (${type})`;
      $("#searchResultsList").append(`<li class=searchResultRow>
                                        <div class=searchResultDiv>
                                          <img src=${image_url} id=${type}-${mal_id} name=\"${display_name}\" class=imageUrl>
                                            <span class=imageName>${display_name}</span>
                                        </div>
                                      </li>`
                                    );
    }

    $(".imageUrl").click(function(e) {
      historyStack.clearStack();
      historyStack.push(SEARCH);
      const searchParameters = $(this).attr('id').split("-"),
            name = $(this).attr('name'),
            type = searchParameters[0],
            mal_id = searchParameters[1];

      $.ajax({
          type: 'GET',
          url: `/api/find/${type}/${mal_id}`,
          dataType: 'json',
          success: function(data) {
            switch (type){
              case ANIME:
                populateAnimeResults(name, data);
                break;
              case CHARACTER:
                populateCharacterResults(name, data);
                break;
              default:
                break;
            }
          }
        });
    });
  }
}

function search(query){
    $.ajax({
        type: 'POST',
        url: '/api/search',
        data: {
          query: query
        },
        dataType: 'json',
        success: function(data) {
          populateSearchResults(data)
        }
      });
}

$(document).ready(function() {

    const usernameCookie = getCookie(COOKIE_USERNAME);

    if (usernameCookie.length > 0){
        $("#currentUserText").empty();
        $("#currentUserText").append("Using ");
        $("#currentUserText").append(`<a id=setUser href=#>${usernameCookie}</a>`);
        $("#currentUserText").append("'s list");
        generateUserList(usernameCookie);
    }else{
        $("#currentUserText").empty();
        $("#currentUserText").append("No Animelist Set. Click ");
        $("#currentUserText").append(`<a id=setUser href=#>here</a>`);
        $("#currentUserText").append(" to set");
    }

    $("#setUser").click(function(e) {
        e.preventDefault();
        if (getCookie(COOKIE_USERNAME).length == 0){
            var namePrompt = prompt("Enter your MAL username");
            if (namePrompt == null || namePrompt.length == 0){
                return;
            }
            $("#currentUserText").empty();
            $("#currentUserText").append("Using ");
            $("#currentUserText").append(`<a id=setUser href=#>${namePrompt}</a>`);
            $("#currentUserText").append("'s list");
            setCookie(COOKIE_USERNAME, namePrompt, 1);
            location.reload(true);
        } else {
            var newName = prompt("Enter different user");
            if (newName == null || newName.length == 0){
                return;
            }
            $("#currentUserText").empty();
            $("#setUser").text(newName);
            setCookie(COOKIE_USERNAME, newName, 1);
            location.reload(true);
        }
    });

    $(".fa.fa-angle-left.fa-3x").click(function(e) {
      historyStack.pop();
      showContainer(historyStack.peek());
    });

    $("#searchBar").on('input', function() {
        var query = $(this).val();
        showContainer(SEARCH);
        if (query.length >= 3){
            search(query);
        }
    });

});
