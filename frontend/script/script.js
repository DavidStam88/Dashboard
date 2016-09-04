var
gotMail = false,
rounds = 0;

var getCurrentMonth = function (nu) {
  if (nu === 0) {
    return "January";
  } else if (nu === 1) {
    return "February"
  } else if (nu === 2) {
    return "March";
  } else if (nu === 3) {
    return "April"
  } else if (nu === 4) {
    return "May";
  } else if (nu === 5) {
    return "June";
  } else if (nu === 6) {
    return "July";
  } else if (nu === 7) {
    return "August";
  } else if (nu === 8) {
    return "September";
  } else if (nu === 9) {
    return "October";
  } else if (nu === 10) {
    return "November";
  } else if (nu === 11) {
    return "December";
  } else {
    return undefined;
  }
};

var getCurrentDay = function (nu) {
  if (nu === 1) {
    return "Monday"
  } else if (nu === 2) {
    return "Tuesday";
  } else if (nu === 3) {
    return "Wednesday";
  } else if (nu === 4) {
    return "Thursday";
  } else if (nu === 5) {
    return "Friday";
  } else if (nu === 6) {
    return "Saturday";
  } else if (nu === 0) {
    return "Sunday";
  } else {
    return undefined;
  }
};

var setCurrentDateTime = function () {
  var date = new Date();
  console.log($("#dateTime"));
  $("#dateTime")[0].innerHTML = "<b>" + getCurrentDay(date.getDay()) + ", " + getCurrentMonth(date.getMonth()) + " " + date.getDate() + " " + date.getFullYear() + "</b>";
};

var getMail = function (callback) {
  if (gotMail && rounds < 10) {
    rounds += 1;
    callback();
  } else {
    $.get("/api/mail", function(data, status) {
      $("#mailFrom")[0].innerHTML = "<b>" + data.from.value + "</b>";
      $("#mailSubject")[0].innerHTML = data.subject.value;
      gotMail = true;
      rounds = 0;
      callback();
    });
  }
};

var getWeatherIcon = function (condition, time) {
  if (condition === "rain") {
    return "<i class='wi wi-day-showers'></i>";
  } else if (condition === "clouds") {
    return "<i class='wi wi-day-cloudy'></i>";
  } else if (condition === "clear") {
    return "<i class='wi wi-day-sunny'></i>";
  } else if (condition === "snow") {
    return "<i class='wi wi-day-snow'></i>";
  } else if (condition === "mist") {
    return "<i class='wi wi-day-fog'></i>";
  } else if (condition === "thunderstorm") {
    return "<i class='wi wi-day-thunderstorm'></i>";
  } else {
    return undefined;
  }
};

var getWeather = function (callback) {
  var i, x = 0, time, temp, icon, minutes, hours, currentHours;
  $.get("/api/weather?city=Rotterdam&country=NL", function(data, status){
    hours = new Date().getHours(),
    minutes = new Date().getMinutes();
    if (Number(hours) < 10) {
      hours = "0" + hours;
    }
    if (Number(minutes) < 10) {
      minutes = "0" + minutes;
    }
    time = hours + ":" + minutes;
    temp = Math.floor(data.main.temp) + "&#176;";
    icon = getWeatherIcon(data.weather[0].main.toLowerCase(), 5);
    $(".weather")[0].children[0].children[0].innerHTML = icon + " " + temp;
    $(".weather")[0].children[0].children[1].innerHTML = time;
  });
  currentHours = new Date().getHours();
  $.get("/api/forecast?city=Rotterdam&country=NL", function(data, status){
    for (i = 0; i < 4; i += 1) {
      hours = data.list[0].dt_txt[11] + data.list[0].dt_txt[12];
      if (Number(hours) <= Number(currentHours)) {
        i += 1;
      }
      time = "" + data.list[i].dt_txt[11] + data.list[i].dt_txt[12] + data.list[i].dt_txt[13] + data.list[i].dt_txt[14] + data.list[i].dt_txt[15];
      temp = Math.floor(data.list[i].main.temp);
      icon = getWeatherIcon(data.list[i].weather[0].main.toLowerCase(), 5);
      $(".weather")[x + 1].children[0].children[0].innerHTML = icon + " " + temp + "&#176;";
      $(".weather")[x + 1].children[0].children[1].innerHTML = time;
      if (Number(hours) === Number(currentHours)) {
        i -= 1;
      }
      x += 1;
    }
    callback();
  });
}

var getNews = function (callback) {
  var i;
  $.get("/api/headlines", function(data, status){
    for (i = 0; i < 8; i += 1) {
      $("#newsItems").children()[i].innerHTML = data.headlines[i];
    }
    callback();
  });
}

var get9gag = function (callback) {
  var i;
  $.get("/api/9gag", function(data, status) {
    $("#9gagTitle")[0].innerHTML = "<b>" + data.title + "</b>";
    var extension = data.post.slice(-3);
    if (extension.toLowerCase() === "jpg") {
      $("#9gagImage")[0].src = data.post;
      $("#9gagImage").show();
      $("#9gagVideo").hide();
    } else if (extension.toLowerCase() === "mp4") {
      $("#9gagVideo").show();
      $("#9gagImage").hide();
      $("#9gagVideo")[0].children[0].src = data.post;
      console.log($("#9gagVideo")[0].children[0].src);
      $("#9gagVideo")[0].load();
    } else {
      console.log("9gag extension undefined");
    }
    callback();
  });
}

$(document).ready(function() {
  var w = window,
  d = document,
  e = d.documentElement,
  g = d.getElementsByTagName('body')[0],
  x = w.innerWidth || e.clientWidth || g.clientWidth,
  y = w.innerHeight|| e.clientHeight|| g.clientHeight;
  console.log(x + ' × ' + y);

  setCurrentDateTime();
  $(".screen").hide();

  var playDashboard = function () {
    getNews(function () {
      $("#gag").fadeOut(2000, function () {});
      $("#news").fadeIn(2000, function () {
        setTimeout(function () {
          getMail(function () {
            $("#news").fadeOut(2000, function () {});
            $("#email").fadeIn(2000, function () {
              setTimeout(function () {
                getWeather(function () {
                  $("#email").fadeOut(2000, function (){});
                  $("#weather").fadeIn(2000, function () {
                    setTimeout(function () {
                      get9gag(function () {
                        $("#weather").fadeOut(2000, function () {});
                        $("#gag").fadeIn(2000, function () {
                          setTimeout(function () {
                            playDashboard();
                          }, 10000);
                        });
                      });
                    }, 10000);
                  });
                });
              }, 10000);
            });
          });
        }, 10000);
      });
    });
  };
  playDashboard();
});
