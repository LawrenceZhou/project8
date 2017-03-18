'use strict';

cs142App.controller('LoginRegisterController', ['$scope', '$routeParams', '$resource', '$location', '$rootScope', '$http',
  function($scope, $routeParams, $resource, $location, $rootScope, $http) {
      $scope.login = {};
      $scope.login.loginName = "";
      $scope.login.password = "";
      $scope.login.statusInfo = "";      

      $scope.loginClick = function() {
          var url = '/admin/login';
          var modelObj = JSON.stringify({login_name: $scope.login.loginName, password: $scope.login.password});
          $http.post(url, modelObj).then(function successfCallback(response){
              if(response.status === 200) {
                  $rootScope.$broadcast('LoggedIn');
                  $scope.main.first_name = response.data.first_name.toString();
                  $scope.main.last_name = response.data.last_name.toString();
                  console.log("log in successful");
                  $location.path("/users/" + response.data._id.toString());
                  console.log("/users/" + response.data._id.toString());
                  $rootScope.currentUserId = response.data._id.toString();
                  $scope.main.currentUserId = response.data._id.toString();
              }             
          }, function errorCallback(response){
              if(response.status === 400) {
                console.log("log in unsuccessful");
                  $scope.login.statusInfo = response.data;
              }
          }); 
      };


      $scope.register = {};
      $scope.register.loginName = "";
      $scope.register.password = "";
      $scope.register.password2 = "";
      $scope.register.firstName = "";
      $scope.register.lastName = "";
      $scope.register.location = "";
      $scope.register.occupation = "";
      $scope.register.description = "";
      $scope.register.statusInfo = "";

       $scope.registerClick = function() {
        if($scope.register.password !== $scope.register.password2) {
            $scope.register.statusInfo = "Password does not match";
        }else{
          var url = '/user';
          var modelObj = JSON.stringify({login_name: $scope.register.loginName, password: $scope.register.password,
            first_name : $scope.register.firstName, last_name : $scope.register.lastName, location : $scope.register.location,
            occupation : $scope.register.occupation, description : $scope.register.description});

          $http.post(url, modelObj).then(function successfCallback(response){
            if(response.status === 200) {
                  $rootScope.$broadcast('Registered');
                  console.log("registered successful");
                  $scope.register.loginName = "";
                  $scope.register.password = "";
                  $scope.register.password2 = "";
                  $scope.register.firstName = "";
                  $scope.register.lastName = "";
                  $scope.register.location = "";
                  $scope.register.occupation = "";
                  $scope.register.description = "";
                  $scope.register.statusInfo = "";
            }
          }, function errorfCallback(response){
                if(response.status === 400) {
                    console.log("registered unsuccessful");
                    $scope.register.statusInfo = response.data;
                }
          });
        }         
       };


  }]);
