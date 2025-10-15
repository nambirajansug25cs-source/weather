// 1. Configuration (REPLACE 'YOUR_API_KEY')
const API_KEY = 'YOUR_API_KEY'; 
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// 2. Select HTML Elements
const cityInput = document.getElementById('city-input');
const getDataButton = document.getElementById('get-data-btn');
const weatherResultDiv = document.getElementById('weather-result');


// 3. Main Function to Fetch Weather Data
async function getWeatherData() {
    const cityName = cityInput.value.trim();

    // Basic Input Validation
    if (cityName === '') {
        displayError('Please enter a city name.');
        return;
    }

    // Construct the full API URL
    // &units=metric gets the temperature in Celsius (use 'imperial' for Fahrenheit)
    const apiUrl = `${BASE_URL}?q=${cityName}&appid=${API_KEY}&units=metric`;

    // Clear previous results and show loading message
    weatherResultDiv.innerHTML = '<p class="loading">Fetching weather data...</p>';

    try {
        // Fetch data from the API
        const response = await fetch(apiUrl);
        
        // Convert the response to JSON
        const data = await response.json();

        // Check if the API returned an error (e.g., city not found)
        if (data.cod !== 200) {
            // OpenWeatherMap uses 'cod' (code) to indicate status
            displayError(`City not found or error: ${data.message}`);
            return;
        }

        // If successful, display the results
        displayWeather(data);

    } catch (error) {
        // Handle network errors (e.g., internet is down)
        console.error('Network or API Error:', error);
        displayError('Could not connect to the weather service. Check your internet connection or API key.');
    }
}


// 4. Function to Display Weather Results
function displayWeather(data) {
    const city = data.name;
    const country = data.sys.country;
    const temp = Math.round(data.main.temp); // Temperature (rounded)
    const feelsLike = Math.round(data.main.feels_like);
    const description = data.weather[0].description; // e.g., 'clear sky'
    const iconCode = data.weather[0].icon; // e.g., '01d'
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed; // in m/s

    // URL to get the weather icon image
    const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;

    const htmlContent = `
        <div class="weather-card">
            <h2>${city}, ${country}</h2>
            <img src="${iconUrl}" alt="${description}" class="weather-icon">
            <p class="temperature">${temp}°C</p>
            <p class="description">${description.charAt(0).toUpperCase() + description.slice(1)}</p>
            
            <div class="details">
                <p>Feels like: <strong>${feelsLike}°C</strong></p>
                <p>Humidity: <strong>${humidity}%</strong></p>
                <p>Wind Speed: <strong>${windSpeed} m/s</strong></p>
            </div>
        </div>
    `;

    weatherResultDiv.innerHTML = htmlContent;
}


// 5. Function to Display Errors
function displayError(message) {
    weatherResultDiv.innerHTML = `<p class="error-message">❌ ${message}</p>`;
}


// 6. Event Listeners
// Attach the main function to the button click
getDataButton.addEventListener('click', getWeatherData);

// Optional: Allow the user to press 'Enter' in the input field
cityInput.addEventListener('keypress', function (event) {
    // Check if the key pressed is the 'Enter' key
    if (event.key === 'Enter') {
        getWeatherData();
    }
});

// Optional: Display default weather on page load (e.g., for London)
// This calls the function immediately upon script execution.
// getWeatherData('London'); 
