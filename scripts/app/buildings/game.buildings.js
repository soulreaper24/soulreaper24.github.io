'use strict';

angular.module('game')
.controller('BuildingsCtrl', function($scope, GameService) {
	$scope.getAvailableBuildings = function() {
		return GameService.data.availableBuildings;	
	};

	$scope.production = function(building) {
		return building.age <= GameService.data.age && building.productionPerTurn;
	};

	$scope.science = function(building) {
		return building.age <= GameService.data.age && building.sciencePerTurn;
	};

	$scope.getProduction = function() {
	  return GameService.getProduction();
	};

	$scope.build = function(building) {
	  GameService.setProduction(GameService.getProduction() - building.cost);
	  building.cost = Math.ceil(building.cost * GameService.data.GROWTH_COEFF);
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