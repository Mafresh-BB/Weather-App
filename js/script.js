// OpenWeatherMap API Key
const apiKey = "0f686c2d06fdfaac50d85518cbd4b8dc";

// DOM Elements
const searchButton = document.getElementById('search-button');
const cityInput = document.getElementById('city-input');
const errorMessage = document.getElementById('error-message');
const weatherCard = document.getElementById('weather-card');
const cityNameEl = document.getElementById('city-name');
const temperatureEl = document.getElementById('temperature');
const weatherConditionEl = document.getElementById('weather-condition');

// Convert Kelvin to Celsius
const kelvinToCelsius = (kelvin) => (kelvin - 273.15).toFixed(1);

// Update dynamic background based on weather condition
const updateBackground = (condition) => {
  document.body.classList.remove("Clear", "Clouds", "Rain", "Snow");
  document.body.classList.add(condition);
};

// Show error message
const showError = (message) => {
  errorMessage.textContent = message;
  errorMessage.classList.remove('hidden');
  setTimeout(() => {
    errorMessage.classList.add('hidden');
  }, 3000);
};

// Update weather information in the DOM
const updateWeather = (data) => {
  const { name, main, weather } = data;
  const tempCelsius = kelvinToCelsius(main.temp);
  const condition = weather[0].main;
  
  cityNameEl.textContent = name;
  temperatureEl.textContent = `Temperature: ${tempCelsius} °C`;
  weatherConditionEl.textContent = `Condition: ${condition}`;
  
  weatherCard.classList.remove('hidden');
  updateBackground(condition);
};

// Fetch weather data from OpenWeatherMap
const getWeather = (city) => {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}`;
  
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('City not found');
      }
      return response.json();
    })
    .then(data => {
        console.log(data);  // Debug API response
        if (data.cod !== 200) {
            throw new Error(data.message || "City not found");
        }
        updateWeather(data);
    })
    
    .catch(error => {
      showError(error.message);
    });
};

// Event listener for search button
searchButton.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city === "") {
    showError("Please enter a city name.");
    return;
  }
  getWeather(city);
});
