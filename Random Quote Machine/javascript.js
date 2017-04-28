/* jshint -W117 */

//Grab random quote from API.
function newQuote() {
    
    // Note: The Forismatic call currently only works in Firefox.
    if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1){
        var apiData = $.getJSON("http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=jsonp&jsonp=?")
        .done(externalQuote)
        .fail(localQuote);
    } else {
        localQuote();
    }
}

//Prints the quote.
function externalQuote(responseJSON) {
    document.getElementById("quoteText").innerHTML = responseJSON.quoteText;
    if (responseJSON.quoteAuthor === "") {
         document.getElementById("quoteAuthor").innerHTML = "- " + "Unknown";
    } else {
        document.getElementById("quoteAuthor").innerHTML = "- " + responseJSON.quoteAuthor;
    }
    
    updateTweet(responseJSON.quoteText, responseJSON.quoteAuthor);
    animateColours();
}

//Fallback local quotes in the event the quote API fails.
function localQuote () {    
    var localQuotes = [  ["The only cure for grief is action.", "George Henry Lewes"],
                    ["Regret for the things we did can be tempered by time; it is regret for the things we did not do that is inconsolable.", "Sidney J. Harris"],
                    ["Please write again soon. Though my own life is filled with activity, letters encourage momentary escape into others lives and I come back to my own with greater contentment.", "Elizabeth Forsythe Hailey"],
                    ["The safest way to double your money is to fold it over and put it in your pocket.", "Kin Hubbard"],
                    ["This became a credo of mine... attempt the impossible in order to improve your work.", "Bette Davis"],
                    ["Research is what I'm doing when I don't know what I'm doing.", "Wernher von Braun"],
                    ["Somewhere, something incredible is waiting to be known.", "Carl Sagan"],
                    ["For small creatures such as we the vastness is bearable only through love.", "Carl Sagan"],
                    ["For me, it is far better to grasp the Universe as it really is than to persist in delusion, however satisfying and reassuring.", "Carl Sagan"],
                    ["We're made of star stuff. We are a way for the cosmos to know itself.", "Carl Sagan"],
                    ["Intellectual growth should commence at birth and cease only at death.", "Albert Einstein"],
                    ["When something is important enough, you do it even if the odds are not in your favor.", "Elon Musk"],
                    ["I think it's fair to say that personal computers have become the most empowering tool we've ever created. They're tools of communication, they're tools of creativity, and they can be shaped by their user.", "Bill Gates"],
                    ["If you can't make it good, at least make it look good.", "Bill Gates"] ]; 
    
    var random = Math.floor((Math.random()) * localQuotes.length);
    
    document.getElementById("quoteText").innerHTML = localQuotes[random][0];
    document.getElementById("quoteAuthor").innerHTML = localQuotes[random][1];
    
    updateTweet(localQuotes[random][0], localQuotes[random][1]);
    
    animateColours();
}

//Randomly selects one of 20 select colours to style the page with.
function animateColours () {
    
    var backgroundColours = ["#80275e", "#6c62d9", "#b56dde", "#cf44c2", "#7ec799", "#59b295", "#468d84", "#03001e", "#120f38", "#1f1d4f", "#3b3e5a", "#c16a6a", "#ab4646", "#811e1e", "#560808", "#380909", "#a7226e", "#ec2035", "#f26b38", "#2f9599"];
    
    var randomColour = Math.floor((Math.random()) * backgroundColours.length);
    
    $("#quoteText, #quoteAuthor, .fa-quote-left, .fa-quote-right, .fa-twitter-square, footer").animate({
        color: backgroundColours[randomColour]
    }, 1000);
    
    $("body, button").animate({
        backgroundColor: backgroundColours[randomColour]
    }, 1000);
}

//Updates the Twitter button to Tweet the current quote.
function updateTweet(quoteText, quoteAuthor) {
    document.getElementById("tweetButton").setAttribute("href", "https://twitter.com/home?status=" + quoteText + " - " + quoteAuthor);
}

//Immediately loads and presents a quote.
window.onload = newQuote;