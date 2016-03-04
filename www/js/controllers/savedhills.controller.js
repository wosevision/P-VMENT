angular.module('pavment.controllers')
.controller('SavedCtrl', function($scope, $location, Hills, $ionicFilterBar, $ionicPopover, $cordovaSocialSharing, Panorama) {


  // Hills.getAll().then(function(response) {
  //   $scope.hills = response;
  // });
  Hills.getAll().success(function(response) {
    $scope.hills = response;
  });
  // $scope.hills = Hills.getAll().then(function(response) {
  //   return response;
  // });

  // $scope.hills = Hills.getAll();

  var template ='<ion-popover-view><ion-header-bar> <h1 class="title">Elevation graph</h1> </ion-header-bar> <ion-content><img width="100%" src="img/graph_example.png" /><p class="padding"><small>Link:<br/><strong>'+$location.path()+'</strong><small></p></ion-content></ion-popover-view>';

  $scope.popover = $ionicPopover.fromTemplate(template, {
    scope: $scope
  });
  $scope.share = function(hill) {
    message = "Check out the " + hill.distance + "km longboard cruise I mapped using the PA\u0305VMENT hill finder app!";
    $cordovaSocialSharing
    .share(message, "Shared PA\u0305VMENT hill", hill.distance, $location.path() ) // Share via native share sheet
    .then(function(result) {
      // Success!
      //alert(result);
    }, function(err) {
      // An error occured. Show a message to the user
    });
  }

  $scope.getPano = function(hill) {
    if (hill) {
      params = { 
        size: '640x281',
        location: hill.coords.lat+ ',' +hill.coords.lng,
        fov: 120
      };
      return Panorama.get(params);
    }
  }

  $scope.openPopover = function($event) {
    $scope.popover.show($event);
  };
  $scope.closePopover = function() {
    $scope.popover.hide();
  };
  //Cleanup the popover when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.popover.remove();
  });
  // Execute action on hide popover
  $scope.$on('popover.hidden', function() {
    // Execute action
  });
  // Execute action on remove popover
  $scope.$on('popover.removed', function() {
    // Execute action
  });
  
  $scope.remove = function(hill) {
    Hills.remove(hill);
  };
  filterConfig = {
    items: $scope.hills,
    update: function(matches,query) {
      $scope.hills = matches;
    },
    expression: function (filterText, value, index, array) {
      return value.name.includes(filterText) || value.distance.includes(filterText);
    },
    favoritesEnabled: true
  }
  $scope.showSearch = function() {
    $ionicFilterBar.show(filterConfig);
  }
});