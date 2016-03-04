angular.module('pavment.services')
.factory('Panorama', function() {

	serialize = function(obj) {
	  var str = [];
	  for(var p in obj)
	    if (obj.hasOwnProperty(p)) {
	      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
	    }
	  return str.join("&");
	}

	baseUrl = 'https://maps.googleapis.com/maps/api/streetview'; //?size=640x281&location=43.8832703,-78.9045525&fov=120
	apiKey = 'AIzaSyBAPh3rPWS4U3yc-0FTNpXhwY3tjVS9Tqo';

  return {
    get: function(params) {
    	params.key = apiKey;
    	url = baseUrl + '?' + serialize(params);
      return url;
    }
  };

});