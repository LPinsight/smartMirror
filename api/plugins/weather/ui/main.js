class WeatherPlugin extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <style>
        .weather {
          font-family: sans-serif;
          color: white;
          text-align: center;
        }
      </style>
      <div class="weather">
        <h2>☀️ Weather Plugin</h2>
        <div id="temp">Loading...</div>
      </div>
    `;

    // Beispiel-Logik
    fetch('https://api.open-meteo.com/v1/forecast?latitude=50&longitude=8&current_weather=true')
      .then(res => res.json())
      .then(data => {
        const temp = data.current_weather.temperature;
        this.querySelector("#temp").textContent = `${temp}°C`;
      });
  }
}

customElements.define('weather-plugin', WeatherPlugin);