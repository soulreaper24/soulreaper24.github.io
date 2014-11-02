'use strict';

angular.module('game')
.controller('UnitsCtrl', function($scope, GameService, CombatService) {
	$scope.availableUnits = GameService.availableUnits;	
	$scope.enemy = GameService.enemy;
	$scope.toTrain = 1;

	$scope.ageFilter = function(unit) {
		return unit.age === GameService.age;
	};

	$scope.getProduction = function() {
	  return GameService.getProduction();
	};

	$scope.train = function(unit, toTrain) {
	  GameService.setProduction(GameService.getProduction() - unit.cost * toTrain);
	  unit.count += toTrain * 1;
	};

	$scope.canConquest = function() {
		// 0 is neutral unit Wolf
		for (var i = 1; i < GameService.availableUnits.length; i++) {
			if (GameService.availableUnits[i].count > 0) {
				return true;
			}
		}
		return false;
	};

	$scope.conquest = function() {
		if (CombatService.conquest()) {
			GameService.conquestWon();
		} else {
			GameService.conquestLost();
		}
	};
})
.config(function($stateProvider) {
  $stateProvider          
    .state('game.units', {
      url: '/units',
      templateUrl: 'scripts/app/units/game.units.html',      
      controller: 'UnitsCtrl'
    });
});