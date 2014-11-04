'use strict';

angular.module('game')
.controller('BuildingsCtrl', function($scope, GameService) {
	$scope.availableBuildings = GameService.availableBuildings;	

	$scope.production = function(building) {
		return building.age <= GameService.age && building.productionPerTurn;
	};

	$scope.science = function(building) {
		return building.age <= GameService.age && building.sciencePerTurn;
	};

	$scope.getProduction = function() {
	  return GameService.getProduction();
	};

	$scope.build = function(building) {
	  GameService.setProduction(GameService.getProduction() - building.cost);
	  building.cost = Math.ceil(building.cost * 1.15);
	  building.count ++;
	  if (building.productionPerTurn) {
	  	GameService.setProductionPerTurn(building);
	  } else {
	  	GameService.setSciencePerTurn(building);
	  }
	};
})
.config(function($stateProvider) {
  $stateProvider          
    .state('game.productionBuildings', {
      url: '/productionBuildings',
      templateUrl: 'scripts/app/buildings/game.productionBuildings.html',      
      controller: 'BuildingsCtrl'
    })
    .state('game.scienceBuildings', {
      url: '/scienceBuildings',
      templateUrl: 'scripts/app/buildings/game.scienceBuildings.html',      
      controller: 'BuildingsCtrl'
    })
    ;
});