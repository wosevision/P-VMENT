angular.module('pavment.controllers')
.controller('DiscoverCtrl', function($scope, Hills) {
	$scope.intensities = ["Flat", "Leisure", "Cruise", "Shred", "Bomb", "Kamikaze"];
    $scope.getIntensity = function(value) {
      if (value < 20) { return $scope.intensities[0]; }
      else if (value >= 20 && value < 40) { return $scope.intensities[1]; }
      else if (value >= 40 && value < 60) { return $scope.intensities[2]; }
      else if (value >= 60 && value < 80) { return $scope.intensities[3]; }
      else if (value >= 80 && value < 100) { return $scope.intensities[4]; }
      else if (value == 100) { return $scope.intensities[5]; }
    }
    $scope.slides = [
        { 'path' : 'img/bomb.svg',
          'label' : 'Bomb'},
        { 'path' : 'img/carve.svg',
          'label' : 'Carve'},
        { 'path' : 'img/distance.svg',
          'label' : 'Distance'},
        { 'path' : 'img/trick.svg',
          'label' : 'Trick'},
        { 'path' : 'img/slide.svg',
          'label' : 'Slide'}
    ];
});
