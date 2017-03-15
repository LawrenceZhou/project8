'use strict';

var cs142App = angular.module('cs142App', ['ngRoute', 'ngMaterial', 'ngResource']);

cs142App.config(['$routeProvider', '$mdThemingProvider',
    function ($routeProvider, $mdThemingProvider) {
        $mdThemingProvider.theme('docs-dark', 'default')
        .primaryPalette('amber')
        .dark();

        $routeProvider.
            when('/users', {
                templateUrl: 'components/user-list/user-listTemplate.html',
                controller: 'UserListController'
            }).
            when('/users/:userId', {
                templateUrl: 'components/user-detail/user-detailTemplate.html',
                controller: 'UserDetailController'
            }).
            when('/photos/:userId', {
                templateUrl: 'components/user-photos/user-photosTemplate.html',
                controller: 'UserPhotosController'
            }).
            when('/login-register', {
                templateUrl: 'components/login-register/login-registerTemplate.html',
                controller: 'LoginRegisterController'
            }).
            otherwise({
                redirectTo: '/users'
            });
    }]);

cs142App.controller('MainController', ['$scope', '$resource', '$location', '$rootScope', '$http',
    function ($scope, $resource, $location, $rootScope, $http) {
        $scope.main = {};
        $scope.main.title = 'Users';
        $scope.main.toolBar = '';
        //console.log("changed", $scope.isLoggedIn);
        $scope.isLoggedIn = false;

         $scope.$on('LoggedIn', function() {
            $scope.isLoggedIn = true;

        });

        var version = $resource('http://localhost:3000/test/:param', {param: 'info'}, {});
        var object = version.get({param: 'info'}, function() {
            $scope.main.version = object.__v;
        }); 

        $rootScope.$on("$routeChangeStart", function(event, next, current) {
        console.log("flag", $scope.isLoggedIn);
            if (!$scope.isLoggedIn) {
                // no logged user, redirect to /login-register unless already there
                if (next.templateUrl !== "components/login-register/login-registerTemplate.html") {
                    $location.path("/login-register");
                }
            }
        });


        $scope.logOutClick = function() {
          var url = '/admin/logout';
           $rootScope.$broadcast('LoggedOut');
            $scope.isLoggedIn = false;
            $http.post(url, {}).then(function successfCallback(response){
              if(response.status === 200) {
                  console.log("log out successful");
                  $location.path("/login-register");
              }             
          }, function errorCallback(response){
                console.log("log out unsuccessful");
                //$scope.login.statusInfo = response.data;
              
          });
        };


        //Upload Photo
        var selectedPhotoFile;   // Holds the last file selected by the user
     
        // Called on file selection - we simply save a reference to the file in selectedPhotoFile
        $scope.inputFileNameChanged = function (element) {
            selectedPhotoFile = element.files[0];
        };

        // Has the user selected a file?
        $scope.inputFileNameSelected = function () {
            return !!selectedPhotoFile;
        };

        // Upload the photo file selected by the user using a post request to the URL /photos/new
        $scope.uploadClick = function () {
            if (!$scope.inputFileNameSelected()) {
                console.error("uploadPhoto called will no selected file");
                return;
            }
            console.log('fileSubmitted', selectedPhotoFile);

            // Create a DOM form and add the file to it under the name uploadedphoto
            var domForm = new FormData();
            domForm.append('uploadedphoto', selectedPhotoFile);
            // Using $http to POST the form
            $http.post('/photos/new', domForm, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined},
            }).success(function(newPhoto){
                $rootScope.$broadcast('photoAdded');
                                        // The photo was successfully uploaded. XXX - Do whatever you want on success.
            }).error(function(err){
                // Couldn't upload the photo. XXX  - Do whatever you want on failure.
                console.error('ERROR uploading photo', err);
                
            });
        };  
        
    }]);
