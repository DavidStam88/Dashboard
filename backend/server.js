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
gagController = require("./controllers/gagController"),
gmailController = require("./controllers/gmailController"),

gag = router.route("/9gag"),
headlines = router.route("/headlines"),
forecast = router.route("/forecast"),
mail = router.route("/mail"),
weather = router.route("/weather");

headlines.get(newsController.getHeadlines);
weather.get(weatherController.getWeather);
forecast.get(weatherController.getForecast);
gag.get(gagController.getLatestPost);
mail.get(gmailController.getMail);

app.use("/api", router);
app.use("/", express.static(path.join(__dirname + "/../frontend")));

app.listen(port, function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Dashboard is active on port:" + port);
  }
});
