// Ionic Starter App


// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.controller('micontrolador',function ($scope,$state,$ionicLoading) {
  var miUbicacion ={}

  
  var OpenWeatherAppKey = "9047098713f4a4d27de751d529a39745";

  var mapOptions = {
    center: new google.maps.LatLng(43.069452, -89.411373),
    zoom: 18,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions)

  var search = document.getElementById('search');

  var text = search.value;

  console.log(text);

  var searchBox = new google.maps.places.SearchBox(search);
  $scope.map.controls[google.maps.ControlPosition.TOP_LEFT].push(search);

  searchBox.addListener('places_changed', function(text){
    var places = searchBox.getPlaces();   

    var queryString = 'http://api.openweathermap.org/data/2.5/weather?q='+ text + ',us&appid=' + OpenWeatherAppKey + '&units=imperial';

     $.getJSON(queryString, function (results) {
        places.forEach(function(place){
          var ubicacion  = place.geometry.location;
          addMarker(ubicacion,results);
          $scope.map.setCenter(ubicacion);
        })
     })

    
  })

  

  $scope.locateMe = function () {
    $ionicLoading.show({})

    navigator.geolocation.getCurrentPosition(onGetLocationSuccess, onGetLocationError,{ enableHighAccuracy: true ,timeout : 4000});

    function onGetLocationSuccess(position) {
      miUbicacion.lat = position.coords.latitude;
      miUbicacion.lng = position.coords.longitude;

      var mapOptions = {
        center: miUbicacion,
        zoom: 18,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

      $ionicLoading.hide({})

      var result = getWeatherWithCityCode();

      addMarker(miUbicacion,result);
    }
    function onGetLocationError(error) {
      cordova.plugins.diagnostic.isLocationEnabled(
        function(e) {
          if (e){

          }
          else {
            alert("Location Not Turned ON");
            cordova.plugins.diagnostic.switchToLocationSettings();
          }
        },
        function(e) {
          alert('Error ' + e);
        }
      )

      $ionicLoading.hide({})
    }
  }

  addMarker = function(ubicacion,result) {
      var marker = new google.maps.Marker({
        map: $scope.map,
        position: ubicacion
      })
      
      console.log(result);

      /*var info = '<div jstcache="0" style="display: inline-block;">'+
      '<div jstcache="0" style="border-bottom: 1px solid rgb(204, 204, 204); margin-bottom: 7px; padding-bottom: 10px;">'+
        '<div jstcache="80" class="poi-info-window gm-style">'+
          '<div jstcache="12">'+
            '<div jstcache="13" class="title full-width">'+result.name+'</div>'+
            '<div class="address">'+
              '<div jstcache="14" jsinstance="0" class="address-line full-width">'+result.weather[0].main+
              '</div>'+
              '<div jstcache="14" jsinstance="*1" class="address-line full-width">'+result.weather[0].description+
              '</div>'+
            '</div>'
         +'</div>'
       +'</div>'+'</div>'+'</div>';*/
       
       var sunriseDate = new Date(result.sys.sunrise * 1000);
       var sunsetDate = new Date(result.sys.sunset * 1000);
       
       var info = '<ul id="weather-data" data-role="listview" data-inset="true" class="ui-listview ui-listview-inset ui-corner-all ui-shadow not-displayed">'+
            '<li data-role="list-divider" id="title" class="ui-li-divider ui-bar-a">'+result.name+'</li>'+
            '<li><span id="summary"><span id="temperature">'+result.main.temp+'</span> F <img src="" /></span></li>'+
            '<li>Wind: <span id="wind">'+result.wind.speed+'</span> knots</li>'+
            '<li>Humidity: <span id="humidity">'+result.main.humidity+'</span> %</li>'+
            '<li>Visibility: <span id="visibility">'+result.weather[0].main+'</span></li>'+
            '<li>Sunrise: <span id="sunrise">'+sunriseDate.toLocaleTimeString()+'</span></li>'+
            '<li>Sunset: <span id="sunset">'+sunsetDate.toLocaleTimeString()+'</span></li>'+
        '</ul>';
      

      var infowindow = new google.maps.InfoWindow({
        content: info
      });

      google.maps.event.addListener(marker,'click',function(){
        infowindow.open($scope.map,marker);
      })
    }

})
