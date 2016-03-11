angular.module('pavment.controllers')
.controller('SavedDetailCtrl', function($location, $scope, $stateParams,  $cordovaSocialSharing, Hills, Panorama) {
  
  $scope.editorEnabled = {}; // init (all disabled)
  $scope.editableContent = {}; // holds temporary editable versions

  // $scope.hill = Hills.get($stateParams.hillID);

  // Hills.get($stateParams.hillID).success(function(res){
  //   $scope.hill = res;
  // });
  $scope.hill = {};

  Hills.get($stateParams.hillID).then(function(response) {
    $scope.hill = response.data;
  });

  $scope.getPano = function(hill) {
    if (hill) {
      params = { 
        size: '640x281',
        location: hill.path.coordinates[0][1] + ',' + hill.path.coordinates[0][0],
        fov: 120
      };
      return Panorama.get(params);
    }
  }

  $scope.share = function(hill, service) {
    message = "Check out the " + hill.distance + "km longboard cruise I mapped using the PA\u0305VMENT hill finder app!";
    subject = "Shared PA\u0305VMENT hill";
    url = $location.path();
    image = '';
    switch (service) {
      case 'twitter':
        $cordovaSocialSharing
        .shareViaTwitter(message, image, url) // Share via native share sheet
        .then(function(result) {
          // Success!
          //alert(result);
        }, function(err) {
          // An error occured. Show a message to the user
        });
        break;
      case 'facebook':
        $cordovaSocialSharing
        .shareViaFacebook(message, image, url) // Share via native share sheet
        .then(function(result) {
          // Success!
          //alert(result);
        }, function(err) {
          // An error occured. Show a message to the user
        });
        break;
      case 'email':
        $cordovaSocialSharing
        .shareViaEmail(message, subject) // Share via native share sheet
        .then(function(result) {
          // Success!
          //alert(result);
        }, function(err) {
          // An error occured. Show a message to the user
        });
        break;
      default:
        $cordovaSocialSharing
        .share(message, subject, image, url) // Share via native share sheet
        .then(function(result) {
          // Success!
          //alert(result);
        }, function(err) {
          // An error occured. Show a message to the user
        });
      break;
    }
    
  }

  $scope.enableEditor = function(content) {
    $scope.editorEnabled[content] = true;
    $scope.editableContent[content] = $scope.hill[content];
  };
  
  $scope.save = function(content) {
    $scope.hill[content] = $scope.editableContent[content];
    $scope.disableEditor(); 
  };
  
  $scope.disableEditor = function() {
    $scope.editorEnabled = {};
  };

});
