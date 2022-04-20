// global variables here
var citySearchEl = document.getElementById("cityName");
var submitSearchBtn = document.getElementById("btnSearch")

// turn city name into geolocation coordinates
async function getGeolocation (cityLookup) {
    //this API limited to 1000 requests per origin, per day
    let url = new URL('https://api.geocode.city/search');
    let params = {'name': cityLookup, 'limit': '1'};
    url.search = new URLSearchParams(params);
    // put URL sent to 'fetch' into console window
    console.log(url.href); 
    // call fetch here, wait for reply
    let resp = await fetch(url.href);
    // make sure response is not an error
    if (resp.ok) {
        let myReply = await resp.json();
        return myReply;
    } else {
        return `HTTP error: ${resp.status}`;
    }
};

// get weather for requested location
async function weatherRequest(lat, lon) {
    // declare some function-scoped variables
    let cityLat = lat;
    let cityLon = lon;
    // this API limited to 60 calls/minute and 1,000,000 calls/month
    // build out URL for database API
    let url = new URL('https://api.openweathermap.org/data/2.5/onecall');
    let params = {'lat': cityLat, 'lon': cityLon, 'units': 'imperial', 'exclude': 'minutely,hourly','appid': '8ee63a0ac1d7da64365a8cddccb9a29f'};
    url.search = new URLSearchParams(params);
    // put URL sent to 'fetch' into console window
    console.log(url.href); 
    // call fetch here, wait for reply
    let resp = await fetch(url.href);
    // make sure response is not an error
    if (resp.ok) {
        let myReply = await resp.json();
        return myReply;
    } else {
        return `HTTP error: ${resp.status}`;
    };
};

// function to properly format the date for display
function formatDate(date) {
    return [
      date.getMonth() + 1, 
      date.getDate(), 
      date.getFullYear(),
        ].join('/');
};

// build out current weather in city after data is returned
function displayWeatherCity(city, weatherObj) {
    let cityName = city;
    //console.log(cityFormatted);
    let cityDate = new Date(weatherObj.current.dt * 1000);
    let formattedDate = formatDate(cityDate);
    let iconUrl = weatherObj.current.weather[0].icon;
    // Attach to second column for display
    let resultsEl = document.getElementById("current-weather");
    resultsEl.innerHTML = "";
    //set up 'box' to hold requested city's weather
    let resultBox = document.createElement('div');
    resultBox.classList.add('box', 'm-0', 'py-1','has-background-grey-lighter');
    // title is city's name and the date
    let cityNameEl = document.createElement('span');
    cityNameEl.classList.add('is-capitalized', 'is-size-2', 'has-text-weight-semibold');
    cityNameEl.textContent = cityName + " " + "(" + formattedDate + ")";
    const iconImage = new Image(50, 50);
    iconImage.src = "http://openweathermap.org/img/wn/" + iconUrl + "@2x.png";
    cityNameEl.append(iconImage);
    // Display current weather temp for city searched
    let boxTemp = document.createElement('p');
    boxTemp.classList.add('py-3');
    boxTemp.innerHTML = "Temp: " + weatherObj.current.temp + "&#8457;";
    // Display current wind speed for city searched
    let boxWind = document.createElement('p');
    boxWind.innerHTML = "Wind: " + weatherObj.current.wind_speed + " MPH";
    // Display current humidity for city searched
    let boxHumid = document.createElement('p');
    boxHumid.classList.add('py-3');
    boxHumid.innerHTML = "Humidity: " + weatherObj.current.humidity + " %";
    // Display current UV index for city searched
    let boxUV = document.createElement('p');
    boxUV.classList.add('pb-3');
    boxUV.innerHTML = "UV Index: " + weatherObj.current.uvi;
 
    // Build out current weather box
    resultBox.append(cityNameEl, boxTemp, boxWind, boxHumid, boxUV);
    resultsEl.append(resultBox);

    //build out 5-day forecast
    var headerForecast = document.createElement('p');
    headerForecast.classList.add('is-size-3', 'has-text-black', 'px-3', 'py-2')
    headerForecast.innerHTML = "5-Day Forecast:";
    resultsEl.append(headerForecast);
    // cards for daily forecast
    var cardsContain = document.createElement('div');
    cardsContain.classList.add('columns', 'm-1');
    for (let i = 0; i < 5; i++) {
        let tempDate = new Date(weatherObj.daily[i].dt * 1000);
        let forecastDate = formatDate(tempDate);
        let forecastIcon = weatherObj.daily[i].weather[0].icon;
        let forecastTemp = weatherObj.daily[i].temp.max;
        let forecastWind = weatherObj.daily[i].wind_speed;
        let forecastHumid = weatherObj.daily[i].humidity;
        let cardBaseHTML = `<span id="day-${i}" class="column notification is-info p-1 ml-1 mb-0 has-text-left has-text-white">
<p class="p-2 is-size-5 has-text-weight-medium">${forecastDate}</p>
<img src="http://openweathermap.org/img/wn/${forecastIcon}@2x.png" height="50" width="50">
<p class="pb-2">Temp: ${forecastTemp} &#8457;</p>
<p class="pb-2">Wind: ${forecastWind} MPH</p>
<p class="pb-2">Humidity: ${forecastHumid} %</p>
</span>`;
        // combine into HTML
        cardsContain.innerHTML += cardBaseHTML;
    };
    // append daily forecast cards
    resultsEl.append(cardsContain);
};

// handles the submitted data
function handleSearchSubmit(event) {
    event.preventDefault();
    // function scoped variables
    let weatherCity = document.querySelector('#cityName').value;
    let reqLat = "";
    let reqLon = "";
    let forecastData;
    //console.log(weatherCity);
    // turn city name into geolocation coords
    getGeolocation(weatherCity).then(geoData =>{
        //console.log(geoData);
        reqLat = geoData[0].latitude;
        reqLon = geoData[0].longitude;
        //console.log(reqLat);
        //console.log(reqLon);
    }).then(() => {
        // WAIT for geolocation API promise to resolve!
    // now get weather for lat/lon coordinates
    weatherRequest(reqLat, reqLon).then(data => {
       //console.log(data);
       forecastData = data;
    }).then(() => {
        console.log(forecastData);
        displayWeatherCity(weatherCity, forecastData);
    });
  });// end of async functions
};// end of function wrapper

// add event listener for 'search' button
submitSearchBtn.addEventListener('click', handleSearchSubmit);
