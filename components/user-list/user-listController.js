'use strict';

cs142App.controller('UserListController', ['$scope', '$resource', '$location',
    function ($scope, $resource, $location) {
        $scope.main.title = 'Users';
 
        var userList = $resource('http://localhost:3000/user/list', {}, {'query': {method: 'GET', isArray : true}});
        var object = userList.query({}, function() {
            $scope.nameList = object;
        });

        $scope.viewUser = function(user_id) {
        	$location.path("/users/"+user_id);
        }
    }]);

