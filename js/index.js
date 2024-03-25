const apiURL = "your_API";

const searchForm = document.querySelector('#searchForm');
const searchBox = document.querySelector('input[name="location"]');
const weatherIcon = document.querySelector(".weather-icon");

async function checkWeather(locationName) {
    const response = await fetch(apiURL + locationName);

    if (response.status == 404) {
        document.querySelector(".error").style.display = "block";
        document.querySelector(".weatherBox").style.display = "none";
    } else {
        const data = await response.json();

        // console data from the API
        console.log(data)

        document.querySelector(".location").innerHTML = data.name;
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°";
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
        document.querySelector(".wind").innerHTML = data.wind.speed + " km/hr";

        updateWeatherIcon(data.weather[0].main);

        const currentTime = new Date();
        const timezoneOffset = data.timezone / 3600;
        const currentUTCTime = currentTime.getTime() + (currentTime.getTimezoneOffset() * 60000);
        const locationLocalTime = new Date(currentUTCTime + (timezoneOffset * 3600000));
        // const timeFormat = locationLocalTime.getHours() >= 12 ? 'PM' : 'AM';
        const currentFormattedTime = locationLocalTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });

        document.getElementById("current-time").innerHTML = currentFormattedTime;

        const weatherData = {
            location: data.name,
            temp: Math.round(data.main.temp),
            humidity: data.main.humidity,
            wind: data.wind.speed,
            weatherCondition: data.weather[0].main,
            time: currentFormattedTime
        };
        localStorage.setItem('weatherData', JSON.stringify(weatherData));

        document.querySelector(".weatherBox").style.display = "block";
        document.querySelector(".error").style.display = "none";
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const savedWeatherData = localStorage.getItem('weatherData');
    if (savedWeatherData) {
        const weatherData = JSON.parse(savedWeatherData);
        document.querySelector(".location").innerHTML = weatherData.location;
        document.querySelector(".temp").innerHTML = weatherData.temp + "°";
        document.querySelector(".humidity").innerHTML = weatherData.humidity + "%";
        document.querySelector(".wind").innerHTML = weatherData.wind + " km/hr";
        updateWeatherIcon(weatherData.weatherCondition);
        document.getElementById("current-time").innerHTML = weatherData.time;
        document.querySelector(".weatherBox").style.display = "block";
    }
});

function updateWeatherIcon(weatherCondition) {
    switch (weatherCondition) {
        case "Clouds":
            weatherIcon.src = "/images/clouds.png";
            break;
        case "Rain":
            weatherIcon.src = "/images/rain.png";
            break;
        case "Drizzle":
            weatherIcon.src = "/images/drizzle.png";
            break;
        case "Mist":
            weatherIcon.src = "/images/mist.png";
            break;
        case "Clear":
            const currentHour = new Date().getHours();
            weatherIcon.src = currentHour >= 18 || currentHour <= 6 ? "/images/moon.png" : "/images/sun.png";
            break;
        default:
            weatherIcon.src = "/images/clouds.png";
            break;
    }
}

searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    checkWeather(searchBox.value);
    searchBox.value = '';
});

document.getElementById('reset').addEventListener('click', function () {
    localStorage.clear();
    document.getElementById('searchForm').reset();
    window.location.reload();
});