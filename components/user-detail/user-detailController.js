'use strict';

cs142App.controller('UserDetailController', ['$scope', '$routeParams', '$resource',
  function ($scope, $routeParams, $resource) {
    /*
     * Since the route is specified as '/users/:userId' in $routeProvider config the
     * $routeParams  should have the userId property set with the path from the URL.
     */
    var userId = $routeParams.userId;

    var user = $resource('http://localhost:3000/user/:id', {}, {});
        var object = user.get({id: userId}, function() {
            $scope.user = object;
            var firstName = $scope.user.first_name;
            var lastName = $scope.user.last_name;
            $scope.main.toolBar = firstName + " " + lastName;
            $scope.user.name = firstName + " " + lastName;
        });
  }]);