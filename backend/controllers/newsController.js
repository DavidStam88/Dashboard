var
http = require('http'),
cheerio = require("cheerio");

var filterHeadlines = function (str) {
  var
  $ = cheerio.load(str),
  headlines = [
    ($("h1")[0].children[0].data).trim(),
    $("span.title")[0].children[0].data,
    $("span.title")[1].children[0].data,
    $("span.title")[2].children[0].data,
    $("span.title")[3].children[0].data,
    $("span.title")[4].children[0].data,
    $("span.title")[5].children[0].data,
    $("span.title")[6].children[0].data,
    $("span.title")[7].children[0].data,
    $("span.title")[8].children[0].data
  ];
  console.log(headlines);
  return {
    headlines: headlines
  };
};

exports.getHeadlines = function(req, res) {
  //The url we want is: 'www.random.org/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new'
  var options = {
    host: 'www.nu.nl',
    path: '/'
  };

  callback = function(response) {
    var str = '';

    //another chunk of data has been recieved, so append it to `str`
    response.on('data', function (chunk) {
      str += chunk;
    });

    //the whole response has been recieved, so we just print it out here
    response.on('end', function () {
      filterHeadlines(str);
      res.send(filterHeadlines(str));
    });
  }

  http.request(options, callback).end();
};
