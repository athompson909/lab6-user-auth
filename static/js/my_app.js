angular.module('myApp', ['uiGmapgoogle-maps'])
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


    $scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };
  }]);
