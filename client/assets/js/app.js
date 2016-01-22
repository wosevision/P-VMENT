(function() {
  'use strict';

  angular.module('application', [
    'ui.router',
    'ngAnimate',

    //foundation
    'foundation',
    'foundation.dynamicRouting',
    'foundation.dynamicRouting.animations',

    //flickity
    'bc.Flickity'
  ])
    .controller('hillFinder', hillFinder)
    .service('UserService')
    .config(config)
    .run(run)
  ;

  hillFinder.$inject = ['$scope'];
  function hillFinder ($scope) {
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
        { 'path' : 'assets/img/bomb.svg',
          'label' : 'Bomb'},
        { 'path' : 'assets/img/carve.svg',
          'label' : 'Carve'},
        { 'path' : 'assets/img/distance.svg',
          'label' : 'Distance'},
        { 'path' : 'assets/img/trick.svg',
          'label' : 'Trick'},
        { 'path' : 'assets/img/slide.svg',
          'label' : 'Slide'}
    ];
  }

  config.$inject = ['$urlRouterProvider', '$locationProvider'];
  function config($urlProvider, $locationProvider) {
    $urlProvider.otherwise('/');

    $locationProvider.html5Mode({
      enabled:true,
      requireBase: false
    });

    $locationProvider.hashPrefix('!');
  }

  function run() {
    FastClick.attach(document.body);
  }

})();
