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
	  GameService.negatives.push({name : wonder.name, type: 'Wonder', turns: wonder.turns, lossPerTurn: wonder.lossPerTurn});	  
	}

	$scope.wonderBuilding = function(wonder) {
		for (var i = 0; i < GameService.negatives.length; i++) {
			if (GameService.negatives[i].name === wonder.name) {
				return Math.ceil((wonder.turns - GameService.negatives[i].turns) / wonder.turns * 100);
			}
		}
		return -1;
	}

	$scope.wonderBuilt = function(wonderName) {
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