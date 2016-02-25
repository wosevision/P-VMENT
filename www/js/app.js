// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic','ionic.service.core', 'ionic.contrib.drawer.vertical', 'googlechart', 'starter.controllers', 'starter.services']) //'ionic-pullup',

.run(function($ionicPlatform, $rootScope, Elevation, Chart) {

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    $rootScope.Map = '';
    $rootScope.chartData = {};
    var elevDisplay = false;

    var mapDiv = document.getElementById("map_canvas");
    //var mapDiv = document.getElementById("map_canvas");

    var markers = { 'pointA': '', 'pointB': ''};
    var path = [];
    var polyline;

    var animation = plugin.google.maps.Animation.DROP;
    var icon = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxOS4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiDQoJIHdpZHRoPSIzMnB4IiBoZWlnaHQ9IjMycHgiIHZpZXdCb3g9IjAgMCAzMiAzMiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMzIgMzI7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+DQoJLnN0MHtmaWxsOiNGRkZGRkY7fQ0KCS5zdDF7ZmlsbDojRUMxOTQ0O30NCjwvc3R5bGU+DQo8ZyBpZD0iWE1MSURfNDFfIj4NCgk8cGF0aCBpZD0iWE1MSURfMzhfIiBjbGFzcz0ic3QwIiBkPSJNMTYsMjguMWMtOC42LDAtOC42LTYuOS04LjYtNi45bDYuMy0xNy41bDQuNiwwbDYuMywxNy41QzI0LjYsMjEuMSwyNC42LDI4LjEsMTYsMjguMXoiLz4NCgk8cGF0aCBpZD0iWE1MSURfMzZfIiBjbGFzcz0ic3QxIiBkPSJNMTYsMjAuMWMzLjgsMCw2LjktMS4zLDcuMS0zYy0wLjYtMS42LTEuMi0zLjMtMS44LTVjLTAuNCwxLjItMi43LDIuMS01LjMsMi4xDQoJCXMtNC45LTAuOS01LjMtMi4xYy0wLjYsMS43LTEuMiwzLjQtMS44LDVDOS4xLDE4LjgsMTIuMiwyMC4xLDE2LDIwLjF6IE0xNiw5LjVjMS44LDAsMy40LTAuNSwzLjktMS40Yy0wLjctMS45LTEuMi0zLjUtMS42LTQuNQ0KCQljLTAuMi0wLjctMS4zLTEtMi4zLTFzLTIuMSwwLjMtMi4zLDFjLTAuNCwxLTAuOSwyLjYtMS42LDQuNUMxMi42LDguOSwxNC4yLDkuNSwxNiw5LjV6IE0yOS45LDIxLjZsLTUuOS0yLjRsMC43LDEuOQ0KCQljMCwyLTQsMy42LTguNiwzLjZjLTQuNywwLTguNi0xLjYtOC42LTMuNmwwLjctMS45bC01LjksMi40Yy0xLjcsMC43LTEuNywxLjktMC4yLDIuOGwxMS4yLDZjMS42LDAuOCw0LjIsMC44LDUuNywwbDExLjItNg0KCQlDMzEuNiwyMy41LDMxLjUsMjIuMywyOS45LDIxLjZ6Ii8+DQo8L2c+DQo8L3N2Zz4NCg==';

    // Invoking Map using Google Map SDK v2 by dubcanada
    $rootScope.Map = plugin.google.maps.Map.getMap(mapDiv,{
        'camera': {
            'latLng': setPosition(-19.9178713, -43.9603117),
            'zoom': 10
        }
    });
    $rootScope.Map.setDebuggable(false);
    // Capturing event when Map load are ready.
    $rootScope.Map.addEventListener(plugin.google.maps.event.MAP_READY, function(){
      // INIT
      $rootScope.Map.addEventListener(plugin.google.maps.event.MAP_LONG_CLICK, function(latLng){

        if (markers.pointA == '' && markers.pointB == '') {
          path[0] = latLng;
          addPoint(latLng, 'A');
          //displayLocationElevation(latLng, elevator, infowindow, document.getElementById('point_a_value') );

        } else if (markers.pointA != '' && markers.pointB == '') {
          path[1] = latLng;
          addPoint(latLng, 'B');
          //displayLocationElevation(latLng, elevator, infowindow, document.getElementById('point_b_value') );
          displayPathElevation(path);
        } else {
          path = [];
          polyline.remove();
          markers.pointA.remove();
          markers.pointB.remove();
          markers.pointA = '';
          markers.pointB = '';
        }
      });

    });


    function addPoint(latLng, id) {
      if (id == 'A') {
        $rootScope.Map.addMarker({
          'position': latLng,
          'icon': icon,
          'animation': animation,
          'draggable': true
        }, function(marker) {
          Elevation.point(latLng);
          markers.pointA = marker;
        });
      } else {
        $rootScope.Map.addMarker({
          'position': latLng,
          'icon': icon,
          'animation': animation,
          'draggable': true
        }, function(marker) {
          Elevation.point(latLng);
          markers.pointB = marker;
        });
      }
    }

    function displayPathElevation(path) {
      $rootScope.Map.addPolyline({
        points: path,
        'color' : '#F00B47',
        'width': 3,
      }, function(line) {
        polyline = line;
      });
      distance = Elevation.distance(path);
      
      Elevation.path(path, function(data) {
        Chart.sync(data, distance);
      });
    }

    // Function that return a LatLng Object to Map
    function setPosition(lat, lng) {
        return new plugin.google.maps.LatLng(lat, lng);
    }

    $rootScope.Map.toggleElevation = function() {
      if (elevDisplay === false) {
        $rootScope.Map.setMapTypeId(plugin.google.maps.MapTypeId.TERRAIN);
        //alert('terrain!');
      } else {
        $rootScope.Map.setMapTypeId(plugin.google.maps.MapTypeId.ROADMAP);
        //alert('roadmap!');
      }
      elevDisplay = !elevDisplay;
    };
    
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.discover', {
    url: '/discover',
    views: {
      'tab-discover': {
        templateUrl: 'templates/tab-discover.html',
        controller: 'DiscoverCtrl'
      }
    }
  })

  .state('tab.saved', {
    url: '/saved',
    views: {
      'tab-saved': {
        templateUrl: 'templates/tab-saved.html',
        controller: 'SavedCtrl'
      }
    }
  })
    .state('tab.saved-detail', {
      url: '/saved/:hillID',
      views: {
        'tab-saved': {
          templateUrl: 'templates/saved-detail.html',
          controller: 'SavedDetailCtrl'
        }
      }
    })

  .state('tab.profile', {
    url: '/profile',
    views: {
      'tab-profile': {
        templateUrl: 'templates/tab-profile.html',
        controller: 'ProfileCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');

});
