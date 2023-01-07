const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", (req, res) => {
  const apiKey = "45c85a44545192c79ae92b579cf6cc13";
  const city = req.body.city_name;
  const units = "metric";
  const url = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&q=${city}&units=${units}`;

  https.get(url, (response) => {
    if (response.statusCode === 200) {
      response.on("data", (data) => {
        weatherData = JSON.parse(data);
        const temp = weatherData.main.temp;
        const icon = weatherData.weather[0].icon;
        const icon_url = `http://openweathermap.org/img/wn/${icon}@2x.png`;

        res.write(`<h1>The temperature in ${city} is ${temp} Celcius</h1>`);
        res.write(
          `<h4>The weather is currently ${weatherData.weather[0].description}.</h4>`
        );
        res.write(`<img src="${icon_url}" />`);

        res.send();
      });
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
  });
});

app.post("/failure", (req, res) => {
  res.redirect("/");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => `Server is running on ${PORT}`);
