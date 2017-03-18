'use strict';

cs142App.controller('UserPhotosController', ['$scope', '$routeParams', '$resource', '$location', '$rootScope', '$http', '$mdDialog',
  function($scope, $routeParams, $resource, $location, $rootScope, $http, $mdDialog) {
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
                console.log("coment unsuccessful");
              }
          }); 
      }
    };

    $scope.like = function(photo_id){
        var url = '/like/' + photo_id;
        //var modelObj = JSON.stringify({userLiked_id : $scope.user._id});
        var modelObj = JSON.stringify({});

        $http.post(url, modelObj).then(function successfCallback(response){
            if(response.status === 200) {
                console.log($scope.currentUserId + "like successful");
                var photo = $resource('http://localhost:3000/photosOfUser/'+userId, {}, {'query': {method: 'GET', isArray : true}});
                var photoList = photo.query({}, function() {
                    $scope.photos = photoList;
                });
            }
          }, function errorCallback(response){
              if(response.status === 400) {
                  console.log("like unsuccessful");
              }
          }); 
    };

    $scope.unlike = function(photo_id){
        var url = '/unlike/' + photo_id;
        //var modelObj = JSON.stringify({userLiked_id : $scope.user._id});
        var modelObj = JSON.stringify({});

        $http.post(url, modelObj).then(function successfCallback(response){
            if(response.status === 200) {
                console.log($scope.currentUserId + "unlike successful");
                var photo = $resource('http://localhost:3000/photosOfUser/'+userId, {}, {'query': {method: 'GET', isArray : true}});
                var photoList = photo.query({}, function() {
                    $scope.photos = photoList;
                });
            }
          }, function errorCallback(response){
              if(response.status === 400) {
                  console.log("unlike unsuccessful");
              }
          }); 
    };

    $scope.deletePhoto = function(photo_id){
        var url = '/deletePhoto/' + photo_id;
        //var modelObj = JSON.stringify({userLiked_id : $scope.user._id});
        var modelObj = JSON.stringify({});

        $http.post(url, modelObj).then(function successfCallback(response){
            if(response.status === 200) {
                console.log($scope.currentUserId + "delete photo successful");
                var photo = $resource('http://localhost:3000/photosOfUser/'+userId, {}, {'query': {method: 'GET', isArray : true}});
                var photoList = photo.query({}, function() {
                    $scope.photos = photoList;
                });
            }
          }, function errorCallback(response){
              if(response.status === 400) {
                  console.log("delete photo unsuccessful");
              }
          }); 
    };

$scope.deleteComment = function(photo_id, comment_id){
        var url = '/deleteComment';
        var modelObj = JSON.stringify({photo_id : photo_id, comment_id : comment_id});

        $http.post(url, modelObj).then(function successfCallback(response){
            if(response.status === 200) {
                console.log($scope.currentUserId + "delete comment successful");
                var photo = $resource('http://localhost:3000/photosOfUser/'+userId, {}, {'query': {method: 'GET', isArray : true}});
                var photoList = photo.query({}, function() {
                    $scope.photos = photoList;
                });
            }
          }, function errorCallback(response){
              if(response.status === 400) {
                  console.log("delete comment unsuccessful");
              }
          }); 
    };

    $scope.deleteUser = function(ev){
        var confirm = $mdDialog.confirm()
            .title('Do you want to deleter your account?')
            .textContent('All of your photos and comments will be deleted.')
            .ariaLabel('Delete all')
            .targetEvent(ev)
            .ok('Delete')
            .cancel('Cancel');

        $mdDialog.show(confirm).then(function() {
            var url = '/deleteUser/' + $scope.main.currentUserId;
            var modelObj = JSON.stringify({});
            //var modelObj = JSON.stringify({photo_id : photo_id, comment_id : comment_id});

            $http.post(url, modelObj).then(function successfCallback(response){
                if(response.status === 200) {
                  console.log($scope.currentUserId + "delete user successful");
                  $scope.logOutClick();
                }
              }, function errorCallback(response){
                  if(response.status === 400) {
                      console.log("delete user unsuccessful");
                  }
            }); 
        }, function() {
       //$scope.status = 'You decided to keep your debt.';
        });     
    };

    $scope.$on('photoAdded', function() {
       var photo = $resource('http://localhost:3000/photosOfUser/'+$scope.main.currentUserId, {}, {'query': {method: 'GET', isArray : true}});
                var photoList = photo.query({}, function() {
                    $scope.photos = photoList;
                    console.log("upload refesh successful");
                });
      });

  }]);
