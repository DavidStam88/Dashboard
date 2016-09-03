var
http = require('http'),
apikey = '92f824dc0f05628449bc72164d391b34';

exports.getWeather = function(req, res) {
  //The url we want is: 'www.random.org/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new'
  var options = {
    host: 'api.openweathermap.org',
    path: '/data/2.5/weather?q=' + req.query.city + ',' + req.query.country + '&units=metric&APPID=' + apikey + ''
  };

  callback = function(response) {
    var str = '';

    //another chunk of data has been recieved, so append it to `str`
    response.on('data', function (chunk) {
      str += chunk;
    });

    //the whole response has been recieved, so we just print it out here
    response.on('end', function () {
      var weather = JSON.parse(str);
      res.send(weather);
    });
  }

  http.request(options, callback).end();
};

exports.getForecast = function(req, res) {
  //The url we want is: 'www.random.org/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new'
  var options = {
    host: 'api.openweathermap.org',
    path: '/data/2.5/forecast?q=' + req.query.city + ',' + req.query.country + '&units=metric&APPID=' + apikey + ''
  };

  callback = function(response) {
    var str = '';

    //another chunk of data has been recieved, so append it to `str`
    response.on('data', function (chunk) {
      str += chunk;
    });

    //the whole response has been recieved, so we just print it out here
    response.on('end', function () {
      var forecast = JSON.parse(str);
      res.send(forecast);
    });
  }

  http.request(options, callback).end();
};
