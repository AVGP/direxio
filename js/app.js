'use strict';


// Declare app level module which depends on filters, and services
window.Direxio = angular.module('DirexioApp', 
	['Centralway.lungo-angular-bridge']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.otherwise({redirectTo: '/'});
    $locationProvider.html5Mode(true);
  }]);  
