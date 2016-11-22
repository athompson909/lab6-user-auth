angular.module('myApp', [])
  .controller('myController', ['$scope', '$http',
                              function($scope, $http) {

    $http.get('/user/profile')
        .success(function(data, status, headers, config) {
      $scope.user = data;
      $scope.error = "";
    }).
    error(function(data, status, headers, config) {
      $scope.user = {};
      $scope.error = data;
    });

  }]);


var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 4
  });


  var uluru = {lat: -25.363, lng: 131.044};
  var marker = new google.maps.Marker({
    position: uluru,
    map: map
  });
}
