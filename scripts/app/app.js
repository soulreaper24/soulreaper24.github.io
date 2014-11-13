'use strict';

angular.module('game', [ 'ui.router', 'mm.foundation', 'ngRoute', 'ngSanitize', 'luegg.directives'])  
  .config(function($stateProvider) {
    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'scripts/app/home.html',
        controller: function($scope, GameService) {
        	$scope.startInFutureAge = function() {
        		GameService.debug = true;
        	};
        }
      });
  })
  .controller('MainCtrl', function($scope, $state) {

  });
