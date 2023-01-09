const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/", (req, res) => {
  const apiKey = "45c85a44545192c79ae92b579cf6cc13";
  const city = req.body.city_name.toUpperCase();
  const units = "metric";
  const url = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&q=${city}&units=${units}`;

  https.get(url, (response) => {
    if (response.statusCode === 200) {
      response.on("data", (data) => {
        weatherData = JSON.parse(data);
        const temp = Math.round(weatherData.main.temp);
        const icon = weatherData.weather[0].icon;
        const icon_url = `http://openweathermap.org/img/wn/${icon}@2x.png`;

        res.render("home", {
          city: city,
          url: icon_url,
          temp: temp,
          desc: weatherData.weather[0].description,
        });
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
