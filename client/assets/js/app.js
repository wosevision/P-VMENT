(function() {
  'use strict';

  var app = angular.module('application', [
    'ui.router',
    'ngAnimate',

    //foundation
    'foundation',
    'foundation.dynamicRouting',
    'foundation.dynamicRouting.animations'
  ])
    .config(config)
    .run(run)
    .controller('hillFinder', hillFinder)
  ;

  hillFinder.$inject = ['$scope', '$log', '$state'];
  function hillFinder ($scope, $log, $state) {
    $scope.intensities = {
      0:["Flat","color-darkgrey"],1:["Flat","color-grrey"], 2:["Leisure","color-lightblue"], 3:["Leisure","color-blue"], 4:["Cruise","color-green"], 5:["Cruise","color-lightgreen"], 6:["Shred","color-yellow"], 7:["Shred","color-lightorange"], 8:["Bomb","color-orange"], 9:["Bomb","color-red"], 10:["Kamikaze","color-brand"]
    };
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
