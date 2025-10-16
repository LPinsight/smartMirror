class WeatherPlugin extends HTMLElement {
  async connectedCallback() {
    const config = this.config || {};
    // 1. CSS laden
    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = 'http://localhost:8080/plugins/weather/ui/style.css';
    this.appendChild(style);

    // 2. HTML laden
    const htmlResponse = await fetch('http://localhost:8080/plugins/weather/ui/template.html');
    const html = await htmlResponse.text();
    this.innerHTML += html; // HTML in Shadow DOM oder direkt ins Element

    // 3. Logik
    const tempEl = this.querySelector("#temp");
    fetch('https://api.open-meteo.com/v1/forecast?latitude=50&longitude=8&current_weather=true')
      .then(res => res.json())
      .then(data => {
        tempEl.textContent = `${data.current_weather.temperature}°C`;
      });

      console.log(config);
      
  }
}

customElements.define('weather-plugin', WeatherPlugin);