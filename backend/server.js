var
express = require("express"),
app = express(),
path = require("path"),
port = 5000,
morgan = require("morgan"),
router = express.Router();

app.use(morgan("dev"));

var
weatherController = require("./controllers/weatherController"),
newsController = require("./controllers/newsController"),

headlines = router.route("/headlines"),
forecast = router.route("/forecast"),
weather = router.route("/weather");

headlines.get(newsController.getHeadlines);
weather.get(weatherController.getWeather);
forecast.get(weatherController.getForecast);

app.use("/api", router);
app.use("/", express.static(path.join(__dirname + "/../frontend")));

app.listen(port, function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Dashboard is active on port:" + port);
  }
});
