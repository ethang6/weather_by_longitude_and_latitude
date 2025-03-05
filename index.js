const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

// Displays index.html at root path
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

// Invoked after hitting submit in the HTML form
app.post("/", function (req, res) {
  // Takes in latitude and longitude from the form input
  var lat = String(req.body.latInput);
  var lon = String(req.body.lonInput);
  console.log("Latitude:", lat, "Longitude:", lon);

  // Build URL for OpenWeather API query
  const units = "imperial";
  const apiKey = "7bd0f3dfa769a0108247a91a4b5d3a0b";
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;

  // Fetch data from OpenWeather API
  https.get(url, function (response) {
    console.log("Status Code:", response.statusCode);

    response.on("data", function (data) {
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const humidity = weatherData.main.humidity;
      const windSpeed = weatherData.wind.speed;
      const cloudiness = weatherData.clouds.all;
      const city = weatherData.name;
      const weatherDescription = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const imageURL = `http://openweathermap.org/img/wn/${icon}@2x.png`;

      // Display results
      res.setHeader("Content-Type", "text/html");
      res.write(`<h1>Weather in ${city}</h1>`);
      res.write(`<h2>Description: ${weatherDescription}</h2>`);
      res.write(`<h2>Temperature: ${temp}°C</h2>`);
      res.write(`<h2>Humidity: ${humidity}%</h2>`);
      res.write(`<h2>Wind Speed: ${windSpeed} m/s</h2>`);
      res.write(`<h2>Cloudiness: ${cloudiness}%</h2>`);
      res.write(`<img src="${imageURL}" alt="Weather Icon">`);
      res.send();
    });
  });
});

// Run server on port 3000 or any available open port
app.listen(process.env.PORT || 3000, function () {
  console.log("Server is running on port 3000");
});
