var
http = require('http'),
cheerio = require("cheerio");

var filterHeadlines = function (str) {
  var
  $ = cheerio.load(str),
  title = ($("header h2 a")[0].children[0].data).trim(),
  post;
  //console.log($(".badge-post-container video")[0].attribs.poster);
  //console.log($(".badge-post-container video")[0].children[1].attribs.src);
  if ($(".badge-post-container img")[0].attribs.src.toString() !== $(".badge-post-container video")[0].attribs.poster.toString()) {
    post = $(".badge-post-container img")[0].attribs.src;
  } else {
    post = $(".badge-post-container video")[0].children[1].attribs.src;
  }
  return {
    title: title,
    post: post
  };
};

exports.getLatestPost = function(req, res) {
  //The url we want is: 'www.random.org/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new'
  var options = {
    host: '9gag.com',
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
