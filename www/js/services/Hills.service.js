angular.module('pavment.services')
.factory('Hills', function($http, Panorama) {

  // JSON array generation algo
  /*
  [
    '{{repeat(20)}}',
    {
      id: '{{index(0)}}',
      guid: '{{guid()}}',
      name: '{{street()}}',
      locale: '{{city()}}, {{state()}}',
      coords: {
        lat: '{{floating(40.31304321, 41.83682786)}}',
        lng: '{{floating(-80.81542969, -79.49707031)}}'
      },
      distance: '{{floating(0.1, 20, 2)}}',
      steepness: '{{floating(-8, 8, 4)}}',
      notes: '{{lorem(1, "paragraphs")}}'
    }
  ]
  */

  // Blank array to cache returned Hills
  var Hills = [];

  // HILL OBJECT
  // • accepts object literal of Hill data
  // • sets sensible defaults if values not found
  // • checks .coords and path.coords before defaulting
  function Hill(data) {
    this.name = data.name || '';
    this.locale = data.locale || '';
    this.tags = data.tags || [];
    this.coordinates = data.path.coordinates || data.coordinates || [];
    this.distance = data.distance || 0;
    this.steepness = data.steepness || 0;
    this.notes = data.notes || 0;
  };
  // • reassign Hill constructor
  // Save:
  // • loop through data; assign to self
  // GetPano:
  // • build params from self coords
  // • use Panorama service to return src
  Hill.prototype = {
    constructor: Hill,
    save: function(data) {
      for (key in data) {
        if (data.hasOwnProperty(key)) {
          alldata += key + " -> " + data[key] + "\n";
          alert(alldata);
        }
      }
    },
    getPano: function() {
      params = { 
        size: '640x281',
        location: this.coordinates[0][1] + ',' + this.coordinates[0][0],
        fov: 120
      };
      return Panorama.get(params);
    }
  }


  return {
    new: function(data) {
      return new Hill(data);
    },
    getAll: function() {
      return $http.get('https://desolate-atoll-24478.herokuapp.com/hills', { cache: true }).then(function(result) {
        Hills = result.data;
        return Hills;
      });
    },
    get: function(id) {
      return $http.get('https://desolate-atoll-24478.herokuapp.com/hills/'+id).then(function(result) {
        return result.data;
      });
    },
    add: function(Hill) {
      var params = $.param({
        json: JSON.stringify(Hill)
      });
      $http.post('https://desolate-atoll-24478.herokuapp.com/hills', params).then(function(result) {
          return result.data;
      });
    },
    remove: function(id) {
      return $http.delete('https://desolate-atoll-24478.herokuapp.com/hills/'+id).then(function(result) {
        return result;
      });
    }
  };

});