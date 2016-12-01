var defaultCenter = {lat: -25.363, lng: 131.044};

var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: defaultCenter,
    zoom: 4
  });
}


angular.module('myApp', [])
  .controller('myController', ['$scope', '$http',
                              function($scope, $http) {

    $http.get('/user/profile')
        .success(function(data, status, headers, config) {
      // console.log(data);

      $scope.user = data;
      $scope.locations = data.locations;
      var myCenter = {
        lat:$scope.locations[0].lat,
        lng:$scope.locations[0].long
      }
      map = new google.maps.Map(document.getElementById('map'), {
        center: myCenter,
        zoom: 4
      });

      var markers = [];
      for(var i = 0; i < $scope.locations.length; ++i) {
        markers.push({
          lat:$scope.locations[i].lat,
          lng:$scope.locations[i].long
        });
      }

      for(var i = 0; i < markers.length; ++i) {
        var marker = new google.maps.Marker({
          position: markers[i],
          map: map
        });
      }

      console.log($scope.locations);
      $scope.error = "";

      $scope.$apply(function() {
        $scope.user;
        $scope.locations;
      });

    }).
    error(function(data, status, headers, config) {
      console.log("error...");
      $scope.user = {};
      $scope.error = data;
    });

  }]);
