angular.module('pavment.services')
.factory('Hills', function($http) {

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
  this.hills = [];

  // HILL OBJECT PROTOTYPE
  function hill(data) {
    this = {
      name: data.name,
      locale: data.locale,
      tags: data.tags,
      path: {
        type: { type: 'LineString' },
        coordinates: data.coordinates
      },
      distance: data.distance,
      steepness: data.steepness,
      notes: data.notes
    }
  };

  return {
    new: function(data) {
      newHill = new hill(data);
      return hill;
    },
    getAll: function() {
      return $http.get('https://desolate-atoll-24478.herokuapp.com/hills', { cache: true }).then(function(result) {
        this.hills = result.data;
        return this.hills;
      });
    },
    get: function(id) {
      return $http.get('https://desolate-atoll-24478.herokuapp.com/hills/'+id).then(function(result) {
        return result.data;
      });
    },
    add: function(hill) {
      var params = $.param({
        json: JSON.stringify({
          name: hill.name,
          locale: hill.locale,
          tags: hill.tags,
          coordinates: hill.coordinates,
          distance: hill.distance,
          steepness: hill.steepness,
          notes: hill.notes
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