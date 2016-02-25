angular.module('starter.controllers', ['ionic.contrib.drawer.vertical', 'googlechart'])

.controller('DashCtrl', function($rootScope, $scope, $ionicActionSheet, $ionDrawerVerticalDelegate, Elevation, Chart) {
  $scope.chartObject = {};
  $scope.chartObject.data = Chart.get();
  $scope.$on('drawChart', function(){
    setTimeout(function() {
      $scope.$apply();
    }, 0);
  });

  /* Quick-n-dirty delegate function to handle
  opening and closing of bottom drawer */
  $scope.toggleDrawer = function() {
    $ionDrawerVerticalDelegate.toggleDrawer();
  };
  $scope.drawerIs = function(state) {
    return $ionDrawerVerticalDelegate.getState() == state;
  };

  /* Disables map clickability, inits action sheet
  with options for bike paths and elevation shading */
  $scope.showMapOptions = function() {

    $rootScope.Map.setClickable(false);
    // Show the action sheet
    var hideSheet = $ionicActionSheet.show({
      buttons: [
        { text: 'Show bike paths' },
        { text: 'Toggle terrain shading' }
      ],
      titleText: 'Map Options',
      cancelText: 'Cancel',
      cancel: function() {
        $rootScope.Map.setClickable(true);
      },
      buttonClicked: function(index) {
        switch (index) {
          case 0:
            break;
          case 1:
            $rootScope.Map.toggleElevation();
            break;
          default:
            break;
        }
        $rootScope.Map.setClickable(true);
        return true;
      }
    });

  };

  /* Geolocation dohickey */
  $scope.getMyLocation = function() {
    function onSuccess(location) {
      var msg = ["Current your location:\n",
        "latitude:" + location.latLng.lat,
        "longitude:" + location.latLng.lng,
        "speed:" + location.speed,
        "time:" + location.time,
        "bearing:" + location.bearing].join("\n");
      $rootScope.Map.animateCamera({
        target: {
          lat: location.latLng.lat,
          lng: location.latLng.lng
        },
        zoom: 15
      });
      $rootScope.Map.addMarker({
        'position': location.latLng,
        'title': msg
      }, function(marker) {
        marker.showInfoWindow();
      });
    };

    function onError(msg) {
      alert("error: " + msg);
    };
    $rootScope.Map.getMyLocation(onSuccess, onError);
  };

  /* Google charts */
  //$scope.drawChart = function(data) {
    $scope.chartObject.type = "LineChart";
    $scope.chartObject.displayed = false;
    //$scope.chartObject.data = $scope.chartData;
    $scope.chartObject.options = {
        "legend": "none",
        "backgroundColor" : "transparent",
        "vAxis": {
          "title": "Elevation (m)",
          "gridlines": {
              "color": "#FFFFFF"
          }
        },
        "hAxis": {
          "gridlines": {
              "color": "#FFFFFF"
          }
        },
        animation: {
          duration: 1000,
          easing: 'inAndOut',
          startup: false
        }
    };

    $scope.chartObject.view = {
        columns: [0, 1, 2]
    };
  //}; // END drawChart()
})

.controller('DiscoverCtrl', function($scope, Hills) {
})

.controller('SavedCtrl', function($scope, Hills) {
  $scope.hills = Hills.all();
  $scope.remove = function(hill) {
    Hills.remove(hill);
  };
})

.controller('SavedDetailCtrl', function($scope, $stateParams, Hills) {
  $scope.hill = Hills.get($stateParams.hillID);
})

.controller('ProfileCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
