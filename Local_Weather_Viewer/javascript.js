/*jshint -W117 */

function updateLocalWeather() {
    
    var latitude;
    var longitude;
    var apiData;
    var weatherData;
    var location;
    var locationCountry;
    var tempC;
    var tempF;
    var description;
    var windSpeed;
    var windDeg;
    var humidity;
    var pressure;
    var sunrise;
    var sunset;
    var weatherID;
    var weatherIcon;
    var iconDiv;
    var visible;
    
    //HTML5 Geolocation success function.
    function getPositionSuccess(position) {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        
        getWeatherData(latitude, longitude);
    }
    
    //HTML5 Geolocation failure function.
    function getPositionError() {
        alert("HTML5 Error: Unable to retrieve location :( Try refreshing, or another browser.");
    }
    
    //Gets weather data using geolocation coordinates from OpenWeatherMap.
    function getWeatherData(latitude, longitude) {
        apiData = $.getJSON("http://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude + "&APPID=d799dea4a831df29468b867bb0dd3776")
        .done(displayLocalWeather);
    }
    
    //Swaps temperature unit.
    $("#unitText").click(function swapUnit() {
        
        if (document.getElementById("unitText").innerHTML == "F") {
            document.getElementById("tempText").innerHTML = tempC + "&deg;";
            document.getElementById("unitText").innerHTML = "C";
        } else {
            document.getElementById("tempText").innerHTML = tempF + "&deg;";
            document.getElementById("unitText").innerHTML = "F";
        }
        
    });
    
    //Displays additional information.
    $("#moreButton").click(function showMore () {
        if (visible === true) {
            document.getElementById("other").style.display = "none";
            document.getElementById("coordinates").style.display = "none";
            document.getElementById("moreButton").className = "fa fa-angle-double-down";
            visible = false;
        } else {
            document.getElementById("other").style.display = "table";
            document.getElementById("coordinates").style.display = "inline";
            document.getElementById("moreButton").className = "fa fa-angle-double-up";
            visible = true;
        }
        
    });
    
    //Processes and displays OpenWeatherMap weather data.
    function displayLocalWeather() {
        weatherData = apiData.responseJSON;
        console.log(weatherData);
        
        tempC = Math.round(weatherData.main.temp - 273.15);
        tempF = Math.round(weatherData.main.temp * 9/5 - 459.67);
        location = weatherData.name;
        locationCountry = weatherData.sys.country;
        description = weatherData.weather[0].main;
        windSpeed = weatherData.wind.speed;
        windDeg = Math.round(weatherData.wind.deg);
        humidity = weatherData.main.humidity;
        pressure = weatherData.main.pressure;
        sunrise = (new Date((weatherData.sys.sunrise) * 1000)).toLocaleString([], {hour: "2-digit", minute:"2-digit", second:"2-digit"});
        sunset = (new Date((weatherData.sys.sunset) * 1000)).toLocaleString([], {hour: "2-digit", minute:"2-digit", second:"2-digit"});
        
        document.getElementById("latitude").innerHTML = "Latitude: " + latitude.toFixed(2) + "&deg;";
        document.getElementById("longitude").innerHTML = "Longitude: " + longitude.toFixed(2) + "&deg;";
        document.getElementById("tempText").innerHTML = tempC + "&deg;";
        document.getElementById("locationText").innerHTML = location + ", " + locationCountry;
        document.getElementById("descText").innerHTML = description;
        document.getElementById("httpNote").innerHTML = "";
        document.getElementById("windSpd").innerHTML = Math.round(windSpeed * 3.6) + " km/h";
        document.getElementById("windDeg").innerHTML = windDeg + "&deg;";
        document.getElementById("humidity").innerHTML = humidity + "%";
        document.getElementById("pressure").innerHTML = pressure + " hPa";
        document.getElementById("sunrise").innerHTML = sunrise;
        document.getElementById("sunset").innerHTML = sunset;
        
        weatherID = String(weatherData.weather[0].id);
        
        if (weatherID[0] == "2") {
            console.log("Thunderstorm");
            document.body.style.backgroundImage = "url('http://i.imgur.com/K5a5jlM.jpg')";
            weatherIcon = 2;
        } else if (weatherID[0] == "3" ) {
            console.log("Rain");
            document.body.style.backgroundImage = "url('http://i.imgur.com/hfe7RPL.jpg')";
            weatherIcon = 6;
        } else if (weatherID[0] == "5") {
            switch (weatherData.weather[0].id) {
                case 500:
                case 501:
                case 502:
                case 503:
                case 504:
                    console.log("Sun-Rain");
                    document.body.style.backgroundImage = "url('http://i.imgur.com/hfe7RPL.jpg')";
                    weatherIcon = 1;
                    break;
                default:
                    console.log("Rain");
                    document.body.style.backgroundImage = "url('http://i.imgur.com/hfe7RPL.jpg')";
                    weatherIcon = 6;
            }
        } else if (weatherID[0] == "6") {
            console.log("Snow");
            document.body.style.backgroundImage = "url('http://i.imgur.com/38IhKHY.jpg')";
            weatherIcon = 4;
        } else if (weatherID[0] == "7") {
            switch (weatherData.weather[0].id) {
                case 701:
                case 721:
                case 741:
                    console.log("Fog");
                    document.body.style.backgroundImage = "url('http://i.imgur.com/mdPFzUA.jpg')";
                    weatherIcon = 3;
                    break;
                case 711:
                    console.log("Smoke");
                    document.body.style.backgroundImage = "url('http://i.imgur.com/vVxmIob.jpg')";
                    weatherIcon = 3;
                    break;
                case 731:
                case 751:
                case 761:
                    console.log("Dust");
                    document.body.style.backgroundImage = "url('http://i.imgur.com/ddYbnsg.jpg')";
                    weatherIcon = 3;
                    break;
                case 762:
                    console.log("Volcanic Ash");
                    document.body.style.backgroundImage = "url('http://i.imgur.com/vVxmIob.jpg')";
                    weatherIcon = 3;
                    break;
                case 771:
                    console.log("Squall");
                    document.body.style.backgroundImage = "url('http://i.imgur.com/m6ZRDMi.jpg')";
                    break;
                case 781:
                    console.log("Hurricane");
                    document.body.style.backgroundImage = "url('http://i.imgur.com/WwTZH92.jpg')";
                    weatherIcon = 2;
                    break;
            }
        } else if (weatherID[0] == "8") {
            switch (weatherData.weather[0].id) {
                case 800:
                    console.log("Clear");
                    document.body.style.backgroundImage = "url('http://i.imgur.com/RQqmovX.jpg')";
                    weatherIcon = 5;
                    break;
                case 801:
                case 802:
                case 803:
                    console.log("Cloudy");
                    document.body.style.backgroundImage = "url('http://i.imgur.com/HjvUrNH.jpg')";
                    weatherIcon = 3;
                    break;
                case 804:
                    console.log("Overcast");
                    document.body.style.backgroundImage = "url('http://i.imgur.com/cG0tSPD.jpg')";
                    weatherIcon = 3;
                    break;
            }
        } else if (weatherID[0] == "9") {
            if (weatherID[1] == "0") {
                switch(weatherData.weather[0].id) {
                    case 900:
                    case 901:
                    case 902:
                        console.log("Hurricane");
                        document.body.style.backgroundImage = "url('http://i.imgur.com/WwTZH92.jpg')";
                        weatherIcon = 3;
                        break;
                    case 903:
                        console.log("Snow");
                        document.body.style.backgroundImage = "url('http://i.imgur.com/38IhKHY.jpg')";
                        weatherIcon = 4;
                        break;
                    case 904:
                        console.log("Hot");
                        document.body.style.backgroundImage = "url('http://i.imgur.com/8MDZ79i.jpg')";
                        weatherIcon = 5;
                        break;
                    case 905:
                        console.log("Windy");
                        document.body.style.backgroundImage = "url('http://i.imgur.com/hmoDIkH.jpg')";
                        weatherIcon = 3;
                        break;
                    case 906:
                        console.log("Hail");
                        document.body.style.backgroundImage = "url('http://i.imgur.com/vLPAHBy.jpg')";
                        weatherIcon = 6;
                        break;
                }
            } else {
                switch (weatherData.weather[0].id) {
                    case 951:
                    case 952:
                    case 953:
                    case 954:
                    case 955:
                    case 956:
                        console.log("Clear");
                        document.body.style.backgroundImage = "url('http://i.imgur.com/RQqmovX.jpg')";
                        weatherIcon = 5;
                        break;
                    case 957:
                    case 958:
                    case 959:
                        console.log("Windy");
                        document.body.style.backgroundImage = "url('http://i.imgur.com/hmoDIkH.jpg')";
                        weatherIcon = 3;
                        break;
                    case 960:
                    case 961:
                    case 962:
                        console.log("Hurricane");
                        document.body.style.backgroundImage = "url('http://i.imgur.com/WwTZH92.jpg')";
                        weatherIcon = 3;
                        break;
                }
            }
        }
        
        switch(weatherIcon) {
            case 1:
                document.getElementById("iconDiv").className = "icon sun-shower";
                document.getElementById("iconDiv").insertAdjacentHTML("afterbegin", '<div class="cloud"></div><div class="sun"><div class="rays"></div></div><div class="rain"></div>');
                break;
            case 2:
                document.getElementById("iconDiv").className = "icon thunder-storm";
                document.getElementById("iconDiv").insertAdjacentHTML("afterbegin", '<div class="cloud"></div><div class="lightning"><div class="bolt"></div><div class="bolt"></div></div>');
                break;
            case 3:
                document.getElementById("iconDiv").className = "icon cloudy";
                document.getElementById("iconDiv").insertAdjacentHTML("afterbegin", '<div class="cloud"></div><div class="cloud"></div');
                break;
            case 4:
                document.getElementById("iconDiv").className = "icon flurries";
                document.getElementById("iconDiv").insertAdjacentHTML("afterbegin", '<div class="cloud"></div><div class="snow"><div class="flake"></div><div class="flake"></div></div>');
                break;
            case 5:
                document.getElementById("iconDiv").className = "icon sunny";
                document.getElementById("iconDiv").insertAdjacentHTML("afterbegin", '<div class="sun"><div class="rays"></div></div>');
                break;
            case 6:
                document.getElementById("iconDiv").className = "icon rainy";
                document.getElementById("iconDiv").insertAdjacentHTML("afterbegin", '<div class="cloud"></div><div class="rain"></div>');
                break;
        }
    }
    
//HTML5 Geolocation.
if (!navigator.getlocation) {
     navigator.geolocation.getCurrentPosition(getPositionSuccess, getPositionError);
} else {
    alert("Geolocation is not supported by this browser.");
    }
}

window.onload = function() {
    updateLocalWeather();
};
