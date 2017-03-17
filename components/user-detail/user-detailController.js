'use strict';

cs142App.controller('UserDetailController', ['$scope', '$routeParams', '$resource', '$location',
  function ($scope, $routeParams, $resource, $location) {
    /*
     * Since the route is specified as '/users/:userId' in $routeProvider config the
     * $routeParams  should have the userId property set with the path from the URL.
     */
    var userId = $routeParams.userId;

    var photo = $resource('http://localhost:3000/photosOfUser/'+userId, {}, {'query': {method: 'GET', isArray : true}});
        var photoList = photo.query({}, function() {
            $scope.photos = photoList;
            for(var i = 0; i < $scope.photos.length; i++) {
                $scope.photos[i].col = $scope.getRandomInt(1, 3);
                $scope.photos[i].row = $scope.getRandomInt(1, 3);
            }
        });

    $scope.getRandomInt = function(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    };

    var user = $resource('http://localhost:3000/user/:id', {}, {});
        var object = user.get({id: userId}, function() {
            $scope.user = object;
            var firstName = $scope.user.first_name;
            var lastName = $scope.user.last_name;
            $scope.main.toolBar = firstName + " " + lastName;
            $scope.user.name = firstName + " " + lastName;
        });

    $scope.viewPhoto = function(user_id) {
        $location.path("/photos/" + user_id);
        console.log("/photos/" + user_id);
    };
  }]);