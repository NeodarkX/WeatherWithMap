var OpenWeatherAppKey = "9047098713f4a4d27de751d529a39745";

function getWeatherWithZipCode() {

  var zipcode = $('#zip-code-input').val();

  var queryString =
      'http://api.openweathermap.org/data/2.5/weather?zip='
      + zipcode + ',us&appid=' + OpenWeatherAppKey + '&units=imperial';

  $.getJSON(queryString, function (results) {

      showWeatherData(results);

      }).fail(function (jqXHR) {
          $('#error-msg').show();
          $('#error-msg').text("Error retrieving data. " + jqXHR.statusText);
      });

      return false;
}

function getWeatherWithCityCode() {

  var zipcode = $('#search').val();

  var queryString =
      'http://api.openweathermap.org/data/2.5/weather?q='
      + zipcode + ',pe&appid=' + OpenWeatherAppKey + '&units=imperial';
  
  var r;

  $.getJSON(queryString, function (results) {
      r = results;   
      
      console.log(results);  
      return results;

      }).fail(function (jqXHR) {
          $('#error-msg').show();
          $('#error-msg').text("Error obteniendo data. " + jqXHR.statusText);
      });
      return r;

}

function showWeatherData(results) {

  if (results.weather.length) {

      console.log(results);

      $('#error-msg').hide();
      $('#weather-data').show();

      $('#title').text(results.name);
      $('#temperature').text(results.main.temp);
      $('#wind').text(results.wind.speed);
      $('#humidity').text(results.main.humidity);
      $('#visibility').text(results.weather[0].main);

      var sunriseDate = new Date(results.sys.sunrise * 1000);
      $('#sunrise').text(sunriseDate.toLocaleTimeString());

      var sunsetDate = new Date(results.sys.sunset * 1000);
      $('#sunset').text(sunsetDate.toLocaleTimeString());

  } else {
      $('#weather-data').hide();
      $('#error-msg').show();
      $('#error-msg').text("Error retrieving data. ");
  }
}