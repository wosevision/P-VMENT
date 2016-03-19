angular.module('pavment.controllers')
.controller('SavedDetailCtrl', function($location, $scope, $stateParams,  $cordovaSocialSharing, Hills, Panorama) {

  // INIT
  // • build a blank Hill for the scope
  $scope.Hill = {};
  // • use the Hills service to fetch the Hill by :hillID
  Hills.get($stateParams.hillID).then(function(response) {
    $scope.Hill = Hills.new(response.data);
  });

  // VARS
  // Objects to hold:
  // • state of editables (is it being edited?)
  // • temporary (live) version of content (while it is being edited)
  $scope.editorEnabled = {}; // init (all disabled)
  $scope.editableContent = {}; // holds temporary editable versions
  // Functions for content editors:
  // • accepts key of property to edit
  // • loads property into temporary 
  $scope.enableEditor = function(content) {
    $scope.editorEnabled[content] = true;
    $scope.editableContent[content] = $scope.Hill[content];
  };
  // • accepts key of property to save
  // • loads value of temporary back into property and disables
  $scope.save = function(content) {
    $scope.Hill[content] = $scope.editableContent[content];
    $scope.disableEditor(); 
  };
  // • resets states of all editables
  $scope.disableEditor = function() {
    $scope.editorEnabled = {};
  };

  // Share buttons: 
  // • Twitter
  // • Facebook
  // • Email
  // • Other
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

});
