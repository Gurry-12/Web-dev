document.addEventListener('DOMContentLoaded', () => {
    // ---- IMPORTANT ----
    // Replace 'YOUR_API_KEY' with your actual OpenWeatherMap API key
const API_KEY = '5b48c874a5dd6fb073488659185f557c'; 

    const appContainer = document.getElementById('app-container');
    const cityInput = document.getElementById('city-input');
    const searchBtn = document.getElementById('search-btn');
    const locationBtn = document.getElementById('location-btn');
    const weatherDisplay = document.getElementById('weather-display');
    const loadingIndicator = document.getElementById('loading');
    const cityNameEl = document.getElementById('city-name');
    const currentDateEl = document.getElementById('current-date');
    const currentTempEl = document.getElementById('current-temp');
    const currentWeatherIconEl = document.getElementById('current-weather-icon');
    const currentWeatherDescEl = document.getElementById('current-weather-desc');
    const feelsLikeEl = document.getElementById('feels-like');
    const humidityEl = document.getElementById('humidity');
    const windSpeedEl = document.getElementById('wind-speed');
    const forecastContainer = document.getElementById('forecast-container');

    const mapIcon = (iconCode) => {
        const mapping = {
            '01d': 'day.svg', '01n': 'night.svg',
            '02d': 'cloudy-day-3.svg', '02n': 'cloudy-night-3.svg',
            '03d': 'cloudy.svg', '03n': 'cloudy.svg',
            '04d': 'cloudy.svg', '04n': 'cloudy.svg',
            '09d': 'rainy-4.svg', '09n': 'rainy-4.svg',
            '10d': 'rainy-6.svg', '10n': 'rainy-6.svg',
            '11d': 'thunder.svg', '11n': 'thunder.svg',
            '13d': 'snowy-6.svg', '13n': 'snowy-6.svg',
            '50d': 'cloudy.svg', '50n': 'cloudy.svg'
        };
        return `assets/icons/${mapping[iconCode] || 'weather.svg'}`;
    };

    const showLoading = (isLoading) => {
        loadingIndicator.style.display = isLoading ? 'block' : 'none';
        weatherDisplay.style.display = isLoading ? 'none' : 'block';
        if (isLoading) appContainer.classList.remove('loaded');
    };
    
    const getWeatherData = async (city) => {
        if (!city) return;
        showLoading(true);
        try {
            const currentResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
            if (!currentResponse.ok) throw new Error('City not found.');
            const currentData = await currentResponse.json();
            const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`);
            const forecastData = await forecastResponse.json();
            updateUI(currentData, forecastData);
            localStorage.setItem('lastCity', city);
        } catch (error) {
            alert(error.message);
        } finally {
            showLoading(false);
            appContainer.classList.add('loaded');
        }
    };
    
    const updateUI = (current, forecast) => {
        cityNameEl.textContent = current.name;
        currentDateEl.textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
        currentTempEl.textContent = `${Math.round(current.main.temp)}°C`;
        currentWeatherIconEl.src = mapIcon(current.weather[0].icon);
        currentWeatherDescEl.textContent = current.weather[0].description;
        feelsLikeEl.textContent = `${Math.round(current.main.feels_like)}°C`;
        humidityEl.textContent = `${current.main.humidity}%`;
        windSpeedEl.textContent = `${current.wind.speed} m/s`;
        updateBackground(current.weather[0].main);
        forecastContainer.innerHTML = '';
        const dailyForecasts = forecast.list.filter(item => item.dt_txt.includes("12:00:00"));
        dailyForecasts.forEach(day => {
            const dayName = new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
            forecastContainer.innerHTML += `
                <div class="forecast-card">
                    <p class="day">${dayName}</p>
                    <img src="${mapIcon(day.weather[0].icon)}" alt="Weather icon">
                    <p>${Math.round(day.main.temp)}°C</p>
                </div>`;
        });
    };
    
    const updateBackground = (weather) => {
        const body = document.body;
        let imagePath = '';
        appContainer.classList.remove('theme-dark');
        switch (weather) {
            case 'Clear':
                imagePath = 'assets/images/clear.jpg';
                appContainer.classList.add('theme-dark');
                break;
            case 'Clouds':
                imagePath = 'assets/images/clouds.jpg';
                appContainer.classList.add('theme-dark');
                break;
            case 'Rain': case 'Drizzle':
                imagePath = 'assets/images/rain.jpg';
                break;
            case 'Thunderstorm':
                imagePath = 'assets/images/thunderstorm.jpg';
                break;
            case 'Snow':
                imagePath = 'assets/images/snow.jpg';
                break;
            default:
                imagePath = 'assets/images/default.jpg';
                appContainer.classList.add('theme-dark');
        }
        body.style.backgroundImage = `url('${imagePath}')`;
    };

    searchBtn.addEventListener('click', () => getWeatherData(cityInput.value));
    cityInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') getWeatherData(cityInput.value); });
    locationBtn.addEventListener('click', () => {
        if (!navigator.geolocation) return alert('Geolocation is not supported by this browser.');
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            showLoading(true);
            try {
                const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
                const data = await response.json();
                getWeatherData(data.name);
            } catch (error) {
                alert('Could not fetch weather for your location.');
                showLoading(false);
            }
        }, () => alert('Unable to retrieve your location.'));
    });

    getWeatherData(localStorage.getItem('lastCity') || 'London');
});