const apiKey = ''; // fill '' with an API-KEY here to work 

async function fetchWeather() {

    const location = document.getElementById('location-input').value.trim();
    if (location === '') {
        alert('Please enter a city name.');
        return;
    }

    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`;

    try {

        const response = await fetch(apiUrl);
        const data = await response.json();

        if (response.ok) {
            document.getElementById('weather-container').scrollLeft = 0;
            document.getElementById('location-input').value='';
            displayWeather(data);
            
        } else {
            throw new Error('Failed to get the weather data.');
        }

    } catch (error) {
        console.error('Error finding weather:', error.message);
        alert('Error finding weather data. Please try again.');
    }
}

function displayWeather(data) {

    const weatherContainer = document.getElementById('weather-container');
    weatherContainer.innerHTML = ''
    const forecast = data.list.filter(entry => entry.dt_txt.includes('12:00:00'));

    for (let i = 0; i < 7; i++) {
        const matchingDayForecast = forecast.find(day => new Date(day.dt * 1000).getDate() === new Date().getDate() + i);

        if (matchingDayForecast) {

            const iconCode = matchingDayForecast.weather[0].icon;
            const iconURL = `https://openweathermap.org/img/w/${iconCode}.png`
            const weatherCard = document.createElement('div');
            const isToday = i === 0;

            weatherCard.classList.add('weather-card');
            weatherCard.innerHTML = `
                <h3>${data.city.name}, ${new Date(matchingDayForecast.dt * 1000).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}${isToday ? ' (Today)' : ''}</h3>

                <img src="${iconURL}" alt="Weather Icon">
                <p>${matchingDayForecast.weather[0].description}</p>
                <p>Temperature: ${matchingDayForecast.main.temp}°C</p>
                <p>Humidity: ${matchingDayForecast.main.humidity}%</p>
                <p>Wind Speed: ${matchingDayForecast.wind.speed} m/s</p>
            `;
            weatherContainer.appendChild(weatherCard);
        }
    }
}




document.getElementById('location-form').addEventListener('submit', function (e) {
    e.preventDefault();
    fetchWeather();
});
document.getElementById('weather-container').addEventListener('wheel', function (event) {
    if (event.deltaY !== 0) {
        this.scrollLeft += event.deltaY / 3;
        event.preventDefault();
    }
});
