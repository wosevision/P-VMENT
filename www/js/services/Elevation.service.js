angular.module('pavment.services')
.factory('Elevation', function($rootScope, BroadcastService, Initializer) {
  if (typeof(Number.prototype.toRad) === "undefined") {
    Number.prototype.toRad = function() {
      return this * Math.PI / 180;
    }
  }
  var distance;
  var height;
  Initializer.initialized.then(function(){
    elevator = new google.maps.ElevationService;
  });

  return {
    point: function(point, callback) {
      elevator.getElevationForLocations({
        'locations': [point]
      }, callback);
        $rootScope.$broadcast('drawChart');
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
        return callback(output);
      });
    }
  };

});