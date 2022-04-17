// global variables here
var citySearchEl = document.getElementById("cityName");
var submitSearch = document.getElementById("btnSearch")

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

// build out current weather in city after data is returned
function currentWeatherCity(city, weatherObj) {
    let cityDate = new Date(weatherObj.current.dt * 1000).toLocaleString();
    let resultsEl = document.getElementById("current-weather");
    resultsEl.innerHTML = "";
    //set up 'box' to hold requested city's weather
    let resultBox = document.createElement('div');
    resultBox.classList.add('box');
    // title is city's name and the date
    let cityNameEl = document.createElement('h3');
    cityNameEl.textContent = city + " " + cityDate;
    let boxContentEl = document.createElement('p');
    boxContentEl.innerHTML = weatherObj.current.temp + '<br/>';

    resultContentEl.append(resultCard);
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
    });
  });// end of async functions
  console.log(forecastData);
  currentWeatherCity(weatherCity, forecastData);

};

// add event listener for 'search' button
submitSearch.addEventListener('click', handleSearchSubmit);