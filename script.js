const cityButtons = document.querySelectorAll(".city");
const clouds = document.querySelectorAll(".cloud");
let current = cityButtons[0];

async function loadWeather() {
  try {
    const url =
      "https://api.open-meteo.com/v1/forecast?latitude=" + current.dataset.lat +
      "&longitude=" + current.dataset.lon +
      "&current=temperature_2m,cloud_cover,wind_speed_10m,precipitation,is_day";
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Request failed");
    }
    const data = await response.json();
    showWeather(data.current);
  } catch (error) {
    document.querySelector("#details").textContent = "Could not load the weather.";
  }
}

function showWeather(weather) {
  const temperature = weather.temperature_2m;
  const cloudCover = weather.cloud_cover;
  const wind = weather.wind_speed_10m;
  const rainfall = weather.precipitation;
  const isDay = weather.is_day === 1;

  const warmth = Math.min(Math.max(temperature + 15, 0), 50);
  const hue = 215 - warmth * 3.8;
  const lightness = isDay ? 70 : 20;
  document.querySelector(".sky").style.background = "hsl(" + hue + ", 70%, " + lightness + "%)";

  const visible = Math.round((cloudCover / 100) * clouds.length);
  const duration = Math.max(10, 100 - wind * 3);
  clouds.forEach((cloud, i) => {
    cloud.style.opacity = i < visible ? 1 : 0;
    cloud.style.animationDuration = duration + "s";
    cloud.style.background = isDay ? "white" : "#889";
  });

  const rain = document.querySelector(".rain");
  rain.innerHTML = "";
  const drops = Math.min(80, Math.round(rainfall * 40));
  for (let i = 0; i < drops; i++) {
    const drop = document.createElement("span");
    drop.style.left = Math.random() * 100 + "%";
    drop.style.animationDuration = 0.6 + Math.random() * 0.6 + "s";
    drop.style.animationDelay = "-" + Math.random() + "s";
    rain.append(drop);
  }

  document.querySelector("#city").textContent = current.dataset.name + (isDay ? " (day)" : " (night)");
  document.querySelector("#temperature").textContent = Math.round(temperature) + "°C";
  document.querySelector("#details").textContent =
    "Cloud cover " + cloudCover + "% | Wind " + Math.round(wind) + " km/h | Rain " + rainfall + " mm";
}

cityButtons.forEach((button) => {
  button.addEventListener("click", () => {
    cityButtons.forEach((b) => b.classList.remove("active"));
    button.classList.add("active");
    current = button;
    loadWeather();
  });
});

document.querySelector("#refresh").addEventListener("click", loadWeather);

loadWeather();
setInterval(loadWeather, 10 * 60 * 1000);
