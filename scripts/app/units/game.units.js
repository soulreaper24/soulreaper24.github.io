'use strict';

angular.module('game')
.controller('UnitsCtrl', function($scope, GameService, CombatService) {
	$scope.toTrain = 1;
	$scope.availableUnits = GameService.availableUnits;	

	$scope.getUnitDamage = function(unit) {
		return Math.ceil(unit.damage * GameService.damageMultiplier);
	};

	$scope.getUnitHp = function(unit) {
		return Math.ceil(unit.hp * GameService.hpMultiplier);
	};

	$scope.getEnemy = function () {
		return GameService.enemy[0];
	};

	$scope.getRemainingConquestsThisTurn = function() {
		return GameService.maxConquests - GameService.currentTurn.numConquests;
	};

	$scope.previousAgeFilter = function(unit) {
		return unit.age > -1 && unit.count > 0 && unit.age < GameService.age;
	};

	$scope.ageFilter = function(unit) {
		return unit.age === GameService.age;
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
		for (var i = 1; i < GameService.availableUnits.length; i++) {
			if (GameService.availableUnits[i].count > 0) {
				return $scope.getRemainingConquestsThisTurn() > 0;
			}
		}
		return false;
	};

	$scope.conquest = function() {
		GameService.currentTurn.numConquests += 1;
		if (CombatService.conquest(GameService.availableUnits, GameService.damageMultiplier, GameService.hpMultiplier, GameService.getEnemy())) {
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