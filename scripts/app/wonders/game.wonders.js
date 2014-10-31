'use strict';

angular.module('game')
.controller('WondersCtrl', function($scope, GameService) {	
	$scope.availableWonders = GameService.availableWonders;

	$scope.ageFilter = function(building) {
		return building.age <= GameService.age;
	};

	$scope.getProduction = function() {
	  return GameService.getProduction();
	}

	$scope.build = function(wonder) {
	  GameService.setProduction(GameService.getProduction() - wonder.cost);
	  GameService.setBuiltWonder(wonder.name);
	}

	$scope.notBuiltWonder = function(wonderName) {
		return GameService.wonders.indexOf(wonderName) > -1;
	}
})
.config(function($stateProvider) {
  $stateProvider          
    .state('game.wonders', {
      url: '/wonders',
      templateUrl: 'scripts/app/wonders/game.wonders.html',
      controller: 'WondersCtrl'
    });
});