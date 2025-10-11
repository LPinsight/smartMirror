class WeatherPlugin extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const unit = this.getAttribute('unit') || 'Celsius';
        const showHumidity = this.getAttribute('showHumidity') === 'true';
        this.render(unit, showHumidity);
    }

    async render(unit, showHumidity) {
        const res = await fetch('/plugins/weather/data');
        const data = await res.json();

        this.shadowRoot.innerHTML = `
            <div style="border:1px solid #ccc;padding:10px;margin:5px;">
                <h3>Weather Plugin</h3>
                <p>Temperature: ${data.temp}°${unit}</p>
                <p>Condition: ${data.condition}</p>
                ${showHumidity ? `<p>Humidity: ${data.humidity}%</p>` : ''}
            </div>
        `;
    }
}

customElements.define('plugin-weather', WeatherPlugin);