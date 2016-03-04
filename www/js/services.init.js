angular.module('pavment.services', [])

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

.factory('BroadcastService', function($rootScope) {
    return {
        send: function(msg) {
            $rootScope.$broadcast(msg);
        }
    }
});
