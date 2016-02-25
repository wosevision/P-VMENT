angular.module('starter.services', [])

.factory('BroadcastService', function($rootScope) {
    return {
        send: function(msg) {
            $rootScope.$broadcast(msg);
        }
    }
})

.factory('Initializer', function($window, $q){

    //Google's url for async maps initialization accepting callback function
    var asyncUrl = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyA3Z_tA7YdsRXkHdThiC-VA0dvwX6a4Kto&callback=',
        initDefer = $q.defer();

    //Callback function - resolving promise after maps successfully loaded
    $window.scriptInitialized = initDefer.resolve; // removed ()

    //Async loader
    var asyncLoad = function(asyncUrl, callbackName) {
      var script = document.createElement('script');
      //script.type = 'text/javascript';
      script.src = asyncUrl + callbackName;
      document.body.appendChild(script);
    };
    //Start loading google maps
    asyncLoad(asyncUrl, 'scriptInitialized');

    //Usage: Initializer.mapsInitialized.then(callback)
    return {
        initialized : initDefer.promise
    };
})

.factory('Hills', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var hills = [{
    id: 0,
    name: 'Mont Royal',
    distance: '0.8km',
    steepness: '5.2º',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Hollywood Blvd',
    distance: '1.4km',
    steepness: '3.1º',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'My Saved Hill 1',
    distance: '0.3km',
    steepness: '2º',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'My Saved Hill 2',
    distance: '0.6km',
    steepness: '5.5º',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Suburb in Oshawa',
    distance: '1.6km',
    steepness: '2.6º',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return hills;
    },
    remove: function(hill) {
      hills.splice(hills.indexOf(hill), 1);
    },
    get: function(hillID) {
      for (var i = 0; i < hills.length; i++) {
        if (hills[i].id === parseInt(hillID)) {
          return hills[i];
        }
      }
      return null;
    }
  };
})
.factory('Elevation', function($rootScope, BroadcastService, Initializer) {
    if (typeof(Number.prototype.toRad) === "undefined") {
    Number.prototype.toRad = function() {
      return this * Math.PI / 180;
    }
  }
  var distance;
  Initializer.initialized.then(function(){
    elevator = new google.maps.ElevationService;
  });

  return {
    point: function(point) {
      elevator.getElevationForLocations({
        'locations': [point]
      }, function(results, status) {
        if (status === google.maps.ElevationStatus.OK) {
          // Retrieve the first result
          if (results[0]) {
            return { latLng: point, metres: parseFloat( (results[0].elevation).toFixed(4) ) };
          } else {
           return 'No results found';
          }
        } else {
          return 'Elevation service failed: ' + status;
        }
      });
    },
    distance: function(path) {
      var R = 6371000; // km
      var dLat = (path[1].lat - path[0].lat).toRad();
      var dLon = (path[1].lng - path[0].lng).toRad();
      var lat1 = path[0].lat.toRad();
      var lat2 = path[1].lat.toRad();

      var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      distance = R * c;
      return distance;
    },
    path: function(path, callback) {
      var output;
      elevator.getElevationAlongPath({
        'path': path,
        'samples': 100
      }, function (elevations, status) {
        if (status === google.maps.ElevationStatus.OK) {
          output = elevations;
        } else {
          output = 'Elevation service failed: ' + status;
        }
        $rootScope.$broadcast('drawChart');
        return callback(output);
      });
    }
  };

})
.factory('Chart', function() {

  var angles = [];
  var data = { 
    cols: [
      {id: "sample", label: "Sample", type: "number"},
      {id: "elevation", label: "Elevation", type: "number"},
      {id: "style", type: "string", role: "style"}
    ],
    rows: []
  };

  return {
    sync: function(elevations, distance) {
      var distanceChunk = distance/elevations.length;
      var styles;
      for (var i = 0; i < elevations.length; i++) {

        if (i != 0) {
          elevationChange = (elevations[i].elevation - elevations[i-1].elevation)/distanceChunk;

          if (elevationChange > 0.03) { // UPHILL HAUL
            styles = 'color: #333333; stroke-width: 3;';
          } else if (elevationChange <= 0.03 && elevationChange > 0.005) { // UPHILL CLIMB
            styles = 'color: #2199e8; stroke-width: 3;';
          } else if (elevationChange <= 0.005 && elevationChange >= -0.005) { // FLAT GROUND
            styles = 'color: #8b8b8b; stroke-width: 3;';
          } else if (elevationChange < -0.005 && elevationChange >= -0.01) { // PLEASANT DOWNHILL
            styles = 'color: #3adb76; stroke-width: 3;';
          } else if (elevationChange < -0.01 && elevationChange >= -0.03) { // MODERATE DOWNHILL
            styles = 'color: #ffae00; stroke-width: 3;';
          } else if (elevationChange < -0.03) { // STEEP DOWNHILL
            styles = 'color: #ec5840; stroke-width: 3;';
          };
        }
        var label = (i == 0) ? "Start" : "Point "+i;
        label = (i == elevations.length - 1) ? "Finish" : label;
        var metres = parseFloat(elevations[i].elevation.toFixed(4));
        data.rows[i] = {
          c: [
            {v: i, f: label},
            {v: metres, f: metres+'m' },
            {v: styles }
          ]
        };

      }
      return data;
    },
    get: function() {
      return data;
    }
  };
});
