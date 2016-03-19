angular.module('pavment.services')
.factory('Hills', function($http, Panorama) {

// Might use a resource here that returns a JSON array
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
  var Hills = [];

  // HILL OBJECT PROTOTYPE
  // function hill(data) {
  //   this = {
  //     name: data.name,
  //     locale: data.locale,
  //     tags: data.tags,
  //     path: {
  //       type: { type: 'LineString' },
  //       coordinates: data.coordinates
  //     },
  //     distance: data.distance,
  //     steepness: data.steepness,
  //     notes: data.notes
  //   }
  // };
  function Hill(data) {
    this.name = data.name || '';
    this.locale = data.locale || '';
    this.tags = data.tags || [];
    this.coordinates = data.path.coordinates || data.coordinates || [];
    this.distance = data.distance || 0;
    this.steepness = data.steepness || 0;
    this.notes = data.notes || 0;
      // for (key in data) {
      //   if (data.hasOwnProperty(key)) {
      //     alldata += key + " -> " + data[key] + "\n";
      //     alert(alldata);
      //   }
      // }
  };
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
        json: JSON.stringify({
          name: Hill.name,
          locale: Hill.locale,
          tags: Hill.tags,
          coordinates: Hill.coordinates,
          distance: Hill.distance,
          steepness: Hill.steepness,
          notes: Hill.notes
        })
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