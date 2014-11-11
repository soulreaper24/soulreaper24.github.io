'use strict';

angular.module('game')
.controller('WondersCtrl', function($scope, GameService) {	
	$scope.getAvailableWonders = function() {
		return GameService.data.availableWonders;
	};

	$scope.constructed = function(wonder) {
		return wonder.age <= GameService.data.age && GameService.data.wonders.indexOf(wonder.name) > -1;
	};

	$scope.notConstructed = function(wonder) {
		return wonder.age <= GameService.data.age && GameService.data.wonders.indexOf(wonder.name) === -1;
	};

	$scope.getProduction = function() {
	  return GameService.getProduction();
	}

	$scope.build = function(wonder) {
	  GameService.data.negatives.push({name : wonder.name, type: 'Wonder', turns: wonder.turns, lossPerTurn: wonder.lossPerTurn});	  
	}

	$scope.wonderBuilding = function(wonder) {
		for (var i = 0; i < GameService.data.negatives.length; i++) {
			if (GameService.data.negatives[i].name === wonder.name) {
				return Math.ceil((wonder.turns - GameService.data.negatives[i].turns) / wonder.turns * 100);
			}
		}
		return -1;
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