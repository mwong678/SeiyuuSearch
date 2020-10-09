const API_ENDPOINT = "http://172.31.21.133:9000/public/v3/",
      COOKIE_USERNAME = "username";

//search/anime?q=haikyu

//COOKIE FUNCTIONS

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

function searchAPI(query){
    $.ajax({
        type: 'POST',
        url: '/',
        data: {
          query: query
        },
        dataType: 'json',
        success: function(data) {
            console.log(data)
        }
      });
} 


$(document).ready(function() {

    const usernameCookie = getCookie(COOKIE_USERNAME);

    if (usernameCookie.length > 0){
        $("#currentUserText").empty();
        $("#currentUserText").append("Using ");
        $("#currentUserText").append("<a id=\"setUser\" href=\"#\">" + usernameCookie + "</a>");
        $("#currentUserText").append("'s list");
    }else{
        $("#currentUserText").empty();
        $("#currentUserText").append("No Animelist Set. Click ");
        $("#currentUserText").append("<a id=\"setUser\" href=\"#\">here</a>");
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
            $("#currentUserText").append("<a id=\"setUser\" href=\"#\">" + namePrompt + "</a>");
            $("#currentUserText").append("'s list");
            setCookie(COOKIE_USERNAME, namePrompt, 1);
            location.reload(true);
        } else {
            var newName = prompt("Enter different user");
            if (newName == null || newName.length == 0){
                return;
            }
            setCookie(COOKIE_USERNAME, newName, 1);
            location.reload(true);
        }
    });

    $("#searchBar").on('input', function() {
        var query = $(this).val();
        if (query.length > 3){
            searchAPI(query);
        }
    });

});