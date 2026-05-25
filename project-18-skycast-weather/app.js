const API_KEY = "fbe526e2ed1fd6710849c4a143ca1421";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather?units=metric&";

const weatherForm = document.getElementById('weatherForm');
const cityInput = document.getElementById('cityInput');
const loadingSpinner = document.getElementById('loadingSpinner');
const weatherDisplayCard = document.getElementById('weatherDisplayCard');
const errorDisplay = document.getElementById('errorDisplay');

const cityName = document.getElementById('cityName');
const weatherDescription = document.getElementById('weatherDescription');
const temperatureDisplay = document.getElementById('temperatureDisplay');
const humidityDisplay = document.getElementById('humidityDisplay');
const windDisplay = document.getElementById('windDisplay');

weatherForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const city = cityInput.value.trim();
    if (city) {
        fetchWeatherData(city);
    }
});


async function fetchWeatherData(city) {
    // Structural UI Reset
    loadingSpinner.classList.remove('d-none');
    weatherDisplayCard.classList.add('d-none');
    errorDisplay.classList.add('d-none');

    try {
        const response = await fetch(`${BASE_URL}q=${encodeURIComponent(city)}&appid=${API_KEY}`);
        
        if (!response.ok) {
            throw new Error("City not found or server error encountered.");
        }

        const data = await response.json();
        
        loadingSpinner.classList.add('d-none');
        populateWeatherUI(data);

    } catch (error) {
        loadingSpinner.classList.add('d-none');
        errorDisplay.classList.remove('d-none');
        errorDisplay.innerText = `⚠️ Error: ${error.message}`;
    }
}


function populateWeatherUI(payload) {
    cityName.innerText = `${payload.name}, ${payload.sys.country}`;
    weatherDescription.innerText = payload.weather[0].description;
    temperatureDisplay.innerText = Math.round(payload.main.temp);
    humidityDisplay.innerText = `${payload.main.humidity}%`;
    windDisplay.innerText = `${payload.wind.speed} m/s`;

    // Make the compiled result card visible to user
    weatherDisplayCard.classList.remove('d-none');
}