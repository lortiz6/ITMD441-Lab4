function getCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(successGetCurrentLocation, errorGetCurrentLocation);
  } else {
    showError("Geolocation is not supported by this browser.");
  }
}

function successGetCurrentLocation(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  const apiEndpoint = `https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}&timezone=America/Chicago`;
  fetchSunriseSunset(apiEndpoint);
}

function errorGetCurrentLocation(error) {
  showError(`Error getting current location: ${error.message}`);
}

function getSunriseSunset(location) {
  const geocodeApiEndpoint = `https://geocode.xyz/${encodeURIComponent(location)}?json=1`;
  fetch(geocodeApiEndpoint)
    .then(response => response.json())
    .then(data => {
      console.log("Geocode API response:", data); // Add this log
      if (data.error) {
        showError(`Error: ${data.error}`);
      } else if (data.lat && data.lon) {
        const latitude = data.lat;
        const longitude = data.lon;
        const apiEndpoint = `https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}&timezone=America/Chicago`;
        fetchSunriseSunset(apiEndpoint);
      } else {
        showError("Location not found");
      }
    })
    .catch(error => showError(`Error searching location: ${error.message}`));
}

function searchLocation() {
  const searchInput = document.getElementById('searchLocation').value;
  const geocodeApiEndpoint = `https://geocode.xyz/${encodeURIComponent(searchInput)}?json=1`;
  fetch(geocodeApiEndpoint)
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        showError(`Error: ${data.error.description}`);
      } else if (data.latt && data.longt) {
        const latitude = data.latt;
        const longitude = data.longt;
        const apiEndpoint = `https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}&timezone=America/Chicago`;
        fetchSunriseSunset(apiEndpoint);
      } else {
        showError("Location not found");
      }
    })
    .catch(error => showError(`Error searching location: ${error.message}`));
}

function fetchSunriseSunset(apiEndpoint) {
  fetch(apiEndpoint)
    .then(response => response.json())
    .then(data => updateDashboard(data))
    .catch(error => showError(`Error fetching sunrise and sunset data: ${error.message}`));
}

function updateDashboard(data) {
  const dashboard = document.getElementById('dashboard');
  if (data.status === 'OK') {
    const results = data.results;
    dashboard.innerHTML = `
      <h2>Results for ${results.formatted}</h2>
      <p>Sunrise Today: ${results.sunrise}</p>
      <p>Sunset Today: ${results.sunset}</p>
      <p>Dawn Today: ${results.civil_twilight_begin}</p>
      <p>Dusk Today: ${results.civil_twilight_end}</p>
      <p>Day Length Today: ${results.day_length}</p>
      <p>Solar Noon Today: ${results.solar_noon}</p>
      <p>Sunrise Tomorrow: ${results.sunrise_tomorrow}</p>
      <p>Sunset Tomorrow: ${results.sunset_tomorrow}</p>
      <p>Dawn Tomorrow: ${results.civil_twilight_begin_tomorrow}</p>
      <p>Dusk Tomorrow: ${results.civil_twilight_end_tomorrow}</p>
      <p>Day Length Tomorrow: ${results.day_length_tomorrow}</p>
      <p>Solar Noon Tomorrow: ${results.solar_noon_tomorrow}</p>
      <p>Timezone: ${results.timezone}</p>
      <p>Powered by <a href="https://sunrisesunset.io/" target="_blank">SunriseSunset.io</a> and 
        <a href="https://geocode.maps.co/" target="_blank">Geocode API</a></p>
    `;
  } else {
    showError(`Error: ${data.status}`);
  }
}

function showError(message) {
  const dashboard = document.getElementById('dashboard');
  dashboard.innerHTML = `<p class="error-message">${message}</p>`;
}
