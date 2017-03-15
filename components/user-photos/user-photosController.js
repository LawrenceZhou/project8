'use strict';

cs142App.controller('UserPhotosController', ['$scope', '$routeParams', '$resource', '$location', '$rootScope', '$http',
  function($scope, $routeParams, $resource, $location, $rootScope, $http) {
    /*
     * Since the route is specified as '/photos/:userId' in $routeProvider config the
     * $routeParams  should have the userId property set with the path from the URL.
     */
    var userId = $routeParams.userId;

    var photo = $resource('http://localhost:3000/photosOfUser/'+userId, {}, {'query': {method: 'GET', isArray : true}});
        var photoList = photo.query({}, function() {
            $scope.photos = photoList;
        });

    var user = $resource('http://localhost:3000/user/:id', {}, {});
    var object = user.get({id: userId}, function() {
        $scope.user = object;
        var firstName = $scope.user.first_name;
        var lastName = $scope.user.last_name;
        $scope.main.toolBar = "Photos of " + firstName + " " + lastName;
        $scope.user.name = firstName + " " + lastName;
    });

    $scope.newComment ={}; //input comment
    $scope.postComment = function(photo_id) {
      if($scope.newComment[photo_id]) {
          var url = '/commentsOfPhoto/' + photo_id;
          var modelObj = JSON.stringify({comment : $scope.newComment[photo_id]});

          $http.post(url, modelObj).then(function successfCallback(response){
              if(response.status === 200) {
                  $rootScope.$broadcast('Commented');
                  console.log("comment successful");
                  $scope.newComment[photo_id] = "";
                  var photo = $resource('http://localhost:3000/photosOfUser/'+userId, {}, {'query': {method: 'GET', isArray : true}});
                  var photoList = photo.query({}, function() {
                    $scope.photos = photoList;
                  });
              }             
          }, function errorCallback(response){
              if(response.status === 400) {
                console.log("cooment unsuccessful");
              }
          }); 
      }
    };


  }]);
