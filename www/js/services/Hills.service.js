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

  return {
    getAll: function() {
      // $http.get('hilldata.json', { cache: true }).then(function(res){
      //   hills = res;
      // });
      return $http.get('https://desolate-atoll-24478.herokuapp.com/hills').then(function(result) {
        return result.data;
      });
    },
    
    // VVV-- NOT CURENTLY WORKING --VVV
    get: function(id) {
      return $http.get('https://desolate-atoll-24478.herokuapp.com/hills/'+id).then(function(result) {
        return result.data;
      });
    },
    remove: function(hill) {
      this.hills.splice(hills.indexOf(hill), 1);
    }
  };
});