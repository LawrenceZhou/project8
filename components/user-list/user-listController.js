'use strict';

cs142App.controller('UserListController', ['$scope', '$resource',
    function ($scope, $resource) {
        $scope.main.title = 'Users';
 
        var userList = $resource('http://localhost:3000/user/list', {}, {'query': {method: 'GET', isArray : true}});
        var object = userList.query({}, function() {
            $scope.nameList = object;
        });
    }]);

