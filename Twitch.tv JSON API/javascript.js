/*jshint -W117 */

var channels = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", "streamthatdoesntexist"];

// Called onload - queries FCC Twitch API workaround for each string in channels.
function getChannels() {
    for (var i = 0; i < channels.length; i++) {
        var apiData = $.getJSON("https://wind-bow.gomix.me/twitch-api/streams/"+channels[i]+"?callback=?").done(displayResults);
    }
}

function displayResults(api) { // .done passes the responseJSON as an argument to the provided callback?
    
    // api.stream === null when channel is offline.
    if (api.stream === null) {
        getUserData(api);
    } else {
         displayOnline(api); 
    }
    
}

// If stream is offline, a user query is required in place of a channel query.
function getUserData(api) {
    var name = api._links.channel.split("/")[5]; // Gets the channel name. I couldn't just channels[i] or similar due to the asynchrosity of AJAX - this works.
    
    var userData = $.getJSON("https://wind-bow.gomix.me/twitch-api/users/"+name+"?callback=?").done(displayOfflineOrNotFound);
}

// Generates HTML from an online channel's JSON data.
function displayOnline(api) {
    var channel = api.stream.channel.display_name;
    var category = api.stream.game; 
    var title = api.stream.channel.status;
    var thumbnail = api.stream.channel.logo;
    
    if (title.length > 100) { //
                title = title.substring(0, 100);
                title += "...";
            }
    
    document.getElementById("results").innerHTML += "<a target='_blank' href='https://twitch.tv/"+channel+"'><div class='result online'><img class='image' src="+thumbnail+"><div class='text'><b>"+channel+"</b><span> Streaming "+category+"</span><p>"+title+"</p></div></div></a>";
}

// Determine whether a function is just offline or non-existent then display relevant information.
function displayOfflineOrNotFound(api) {
    if (api.error === "Not Found") { // Account deleted or never created.
        var name = api.message.split(/"/)[1]; // See line 26.
        
        document.getElementById("results").innerHTML += "<a target='_blank' href='https://twitch.tv/'><div class='result offline'><img class='image' src='https://dummyimage.com/100x100/ffffff/6441a4&text=Not Found'><div class='text'><b>"+name+"</b><span> Not Found</span><p>Account deleted or never created</p></div></div></a>";
        
    } else { // Channel exists and is offline.
        console.log(api);
        var channel = api.display_name;
        var bio;
        if (api.bio !== null) { // Displays a bio and cuts it short if necessary.
            bio = api.bio;
            if (bio.length > 100) {
                bio = bio.substring(0, 100);
                bio += "...";
            }
        } else {
            bio = "This user has not written a bio.";
        }
        
        document.getElementById("results").innerHTML += "<a target='_blank' href='https://twitch.tv/"+channel+"'><div class='result offline'><img class='image' src='https://dummyimage.com/100/ffffff/6441a4&text=Offline'><div class='text'><b>"+channel+"</b><span> Offline</span><p>Bio: "+bio+"</p></div></div></a>";
    }
}

// Filter results and highlight header.
function headerSelect(header) { // onclick in HTML
    
    switch (header) {
        case "result": // "Result" targets "all" results.
            // Highlight "All" header.
            document.getElementById("headerAll").className = "header selectedHeader";
            document.getElementById("headerOnline").className = "header unselectedHeader";
            document.getElementById("headerOffline").className = "header unselectedHeader";
            break;
        case "online":
            // Highlight "Online" header.
            document.getElementById("headerAll").className = "header unselectedHeader";
            document.getElementById("headerOnline").className = "header selectedHeader";
            document.getElementById("headerOffline").className = "header unselectedHeader";
            break;
        case "offline":
            // Highlight "Offline" header.
            document.getElementById("headerAll").className = "header unselectedHeader";
            document.getElementById("headerOnline").className = "header unselectedHeader";
            document.getElementById("headerOffline").className = "header selectedHeader";
            break;
    }
    
    // Display all, online, or offline results.
    var results = document.getElementsByClassName("result");
        for (i = 0; i < results.length; i++) {
            if (results[i].classList.contains(header)) {
                results[i].style.display = "flex";
            } else {
                results[i].style.display = "none";
            }
        }
    
    // Apply instant text search to the newly filtered results.
    instantTextSearch();
}

// Instant text search.
$('#input').on("input", instantTextSearch);
               
function instantTextSearch() {
    var input = document.getElementById("input").value.toLowerCase();
    
    // Get the currently selected header.
    var headers = document.getElementsByClassName("header");
    var selectedHeader;
    var headerColour;
    var twitchPurple = "rgb(100, 65, 165)";
    var highlightedTwitchPurple = "rgb(117, 80, 186)";
    
    for (var i = 0; i < 3; i++) {
        headerColour = window.getComputedStyle(headers[i]).backgroundColor;
        
        if (headerColour == twitchPurple || headerColour == highlightedTwitchPurple) { // 
            selectedHeader = headers[i].id;
        }
    }
    
    // Convert currently selected header ID to a class to limit instant text search to.
    var classToSearch;
    switch (selectedHeader) {
        case "headerAll":
            classToSearch = "result";
            break;
        case "headerOnline":
            classToSearch = "online";
            break;
        case "headerOffline":
            classToSearch = "offline";
            break;
    }
    
    // Search results under selected header and hide them if they do not contain the searched for string.
    var results = document.getElementsByClassName(classToSearch);
    for (i = 0, len = results.length; i < len; i++) {
        var title = results[i].textContent.substr(0, results[i].textContent.indexOf(" ")).toLowerCase(); // First word in result div.
        if (title.includes(input)) {
            results[i].style.display = "flex";
        } else {
            results[i].style.display = "none";
        }
    }
}

window.onload = getChannels;





































