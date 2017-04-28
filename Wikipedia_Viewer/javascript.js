/*jshint -W117 */

function wikipediaViewer() {
    
    var input;
    var apiData;
    var title;
    var extract;
    var results = document.getElementById("results");
    
    function displayResults() {
        
        results.innerHTML = "";
        
        apiData = apiData.responseJSON.query.pages;
        for (var i = 0; i < 10; i++) {
            title = apiData[Object.keys(apiData)[i]].title;
            extract = apiData[Object.keys(apiData)[i]].extract;
            
            results.innerHTML += "<a target='_blank' href='https://en.wikipedia.org/wiki/"+title+"'><div class='result'><b>"+title+"</b><p>"+extract+"</p></div></a>";
        }
    }
    
    function getSearchResults() {
        input = document.getElementById("input").value;
        
        apiData = $.getJSON("https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=extracts&generator=search&exchars=150&exlimit=10&exintro=1&explaintext=1&gsrlimit=10&gsrsearch=" + input).done(displayResults);      
    }
    
    
    $("#searchButton").click(function() {
       getSearchResults();                
    });
    
    $("#input").keyup(function(event) {
        if(event.keyCode == 13) {
            getSearchResults();
        }
    });
}

window.onload = function() {
    wikipediaViewer();
    document.getElementById("input").focus();
};

