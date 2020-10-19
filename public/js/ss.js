const COOKIE_USERNAME = "username",
      SESSION_ANIMELIST = "sessionAnimeList",
      SEARCH = "search",
      ANIME = "anime",
      PERSON = "person",
      CHARACTER = "character";


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

async function generateUserList(username){
  if (!sessionStorage.getItem(SESSION_ANIMELIST)){
    console.log("Constructing User Watch Library...");
    $.ajax({
        type: 'GET',
        url: `/api/animelist/${username}`,
        dataType: 'json',
        success: function(data) {
          if (data != null){
            console.log("Finished constructing User Watch Library...");
            sessionStorage.setItem(SESSION_ANIMELIST, JSON.stringify(data.result));
          }
        }
      });
  }
}

function highlightRoles(){
  const userList = JSON.parse(sessionStorage.getItem(SESSION_ANIMELIST));
  if (userList){
    $(".personResultRow").each(function(index) {
        const mal_id = $(this).attr("id");
        if (userList[mal_id] && userList[mal_id] != 6){
          $(this).css("background-color", "#FFD95C");
        }
    });
  }
}

function populateSearchResults(data){
  $("#searchResultsList").empty();
  const searchResults = data.result;
  if (searchResults) {
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
      const searchParameters = $(this).attr('id').split("-"),
            name = $(this).attr('name'),
            type = searchParameters[0],
            mal_id = searchParameters[1];
      window.location.href = `/${type}/${mal_id}`;
    });
  }
}

function redirect(route){
  window.location.href = route;
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
        populateSearchResults(data);
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

    if ($("#searchBarAJAX").length){
      $("#searchBarAJAX").focus();
    }

    if ($("#personResultsList").length){
      highlightRoles();
    }

    $("#setUser").click(function(e) {
        e.preventDefault();
        if (getCookie(COOKIE_USERNAME).length == 0){
            var namePrompt = prompt("Enter your MAL username");
            if (!namePrompt || namePrompt.length == 0){
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
            if (!newName || newName.length == 0){
                return;
            }
            $("#currentUserText").empty();
            $("#setUser").text(newName);
            setCookie(COOKIE_USERNAME, newName, 1);
            location.reload(true);
        }
    });

    $("#searchBarAJAX").on('input', function() {
        var query = $(this).val();
        if (query.length >= 3){
            search(query);
        }
    });

    $("#searchBar").on('click', function(){ redirect("/search") });
    $("#headerDiv").on('click', function(){ redirect("/") } );

    $(".characterImageUrl, .voiceActorImageUrl").click(function(e) {
      const searchParameters = $(this).attr('id').split("-"),
            name = $(this).attr('name'),
            type = searchParameters[0],
            mal_id = searchParameters[1];

      window.location.href = `/${type}/${mal_id}`;
    });
});
