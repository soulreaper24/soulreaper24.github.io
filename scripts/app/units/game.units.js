'use strict';

angular.module('game')
.controller('UnitsCtrl', function($scope, GameService, CombatService) {
	$scope.toTrain = 1;
	$scope.availableUnits = GameService.data.availableUnits;	
	$scope.getTurnsSinceAlienInvaded = function() {
		return GameService.data.turnsSinceAlienInvaded;
	};

	$scope.getAliens = function() {
		return GameService.data.aliens;
	}

	$scope.getUnitDamage = function(unit) {
		return Math.ceil(unit.damage * GameService.data.damageMultiplier);
	};

	$scope.getUnitHp = function(unit) {
		return Math.ceil(unit.hp * GameService.data.hpMultiplier);
	};

	$scope.getEnemy = function () {
		return GameService.data.enemy[0];
	};

	$scope.getRemainingConquestsThisTurn = function() {
		return GameService.data.maxConquests - GameService.data.currentTurn.numConquests;
	};

	$scope.previousAgeFilter = function(unit) {
		return unit.age > -1 && unit.count > 0 && unit.age < GameService.data.age;
	};

	$scope.ageFilter = function(unit) {
		return unit.age === GameService.data.age;
	};

	$scope.getProduction = function() {
	  return GameService.getProduction();
	};

	$scope.max = function(unit) {
		$scope.toTrain = Math.floor($scope.getProduction() / unit.cost);
	};	

	$scope.train = function(unit, toTrain) {
	  GameService.setProduction(GameService.getProduction() - unit.cost * toTrain);
	  unit.count += toTrain * 1;
	};

	$scope.canConquest = function() {
		// 0 is neutral unit Wolf
		for (var i = 1; i < GameService.data.availableUnits.length; i++) {
			if (GameService.data.availableUnits[i].count > 0) {
				return $scope.getRemainingConquestsThisTurn() > 0;
			}
		}
		return false;
	};

	$scope.conquest = function() {
		GameService.data.currentTurn.numConquests += 1;
		if (CombatService.conquest(GameService.data.availableUnits, GameService.data.damageMultiplier, GameService.data.hpMultiplier, GameService.getEnemy())) {
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