let currentC = "–";
let currentF = "–";
let isCelsiusSelected = true;
let apiKey = "a85784d2dae7d5a007ca536ecd5baadb";
let units = "metric";

//Live clock

let weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
let month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function launchClockRefresher() {
    refreshCurrentTime();
    setInterval(refreshCurrentTime, 1000);
}

function refreshCurrentTime() {
    let now = new Date();

    document.querySelector("#time").innerHTML = `${month[now.getMonth()]} ${now.getDate()} , ${
        weekday[now.getDay()]
    }, ${now.toLocaleTimeString("sv-SE")}`;
}

launchClockRefresher();

//Live clock ends here

navigator.geolocation.getCurrentPosition(showLocation);

function showLocation(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;

    axios.get(apiUrl).then(showCityAndTemperature);
}

function showCityAndTemperature(response) {
    document.querySelector("#city").innerHTML = response.data.name;
    showWeatherConditions(response);
}

function searchCity(event) {
    event.preventDefault();
    let searchInput = document.querySelector("#exampleInputEmail1").value;
    document.querySelector("#city").innerHTML = searchInput;

    getCurrentTemperature(searchInput);
}

function getCurrentTemperature(city) {
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
    axios.get(apiUrl).then(showWeatherConditions);
}

function showWeatherConditions(response) {
    currentC = Math.round(response.data.main.temp);
    currentF = CtoF(currentC);

    let temp;

    if (isCelsiusSelected) {
        temp = currentC;
    } else {
        temp = currentF;
    }

    document.querySelector("#currentTemperatureBig").innerText = temp;
    document.querySelector("#weatherConditionsCurrently").innerText = response.data.weather[0].description;
    document.querySelector("#humidityCurrently").innerText = response.data.main.humidity;
    document.querySelector("#windCurrently").innerText = Math.round(response.data.wind.speed);
}

function CtoF(celsius) {
    return Math.round(celsius * (9 / 5) + 32);
}

let form = document.querySelector("form");
form.addEventListener("submit", searchCity);

//Converts C to F and vice versa

function chooseF(event) {
    event.preventDefault();
    document.querySelector("#currentTemperatureBig").innerHTML = currentF;
    isCelsiusSelected = false;
    event.target.classList.add("selected");
    document.querySelector("#currentC").classList.remove("selected");
}

function chooseC(event) {
    event.preventDefault();
    document.querySelector("#currentTemperatureBig").innerHTML = currentC;
    isCelsiusSelected = true;
    event.target.classList.add("selected");
    document.querySelector("#currentF").classList.remove("selected");
}

document.querySelector("#currentC").addEventListener("click", chooseC);
document.querySelector("#currentF").addEventListener("click", chooseF);

document.querySelector(".middleLayer").addEventListener("click", clickOnGlobe);

function clickOnGlobe() {
    navigator.geolocation.getCurrentPosition(showLocation);
}
