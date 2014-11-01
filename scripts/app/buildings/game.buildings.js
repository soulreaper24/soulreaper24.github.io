'use strict';

angular.module('game')
.controller('BuildingsCtrl', function($scope, GameService) {
	$scope.availableBuildings = GameService.availableBuildings;	

	$scope.ageFilter = function(building) {
		return building.age <= GameService.age;
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
    .state('game.buildings', {
      url: '/buildings',
      templateUrl: 'scripts/app/buildings/game.buildings.html',      
      controller: 'BuildingsCtrl'
    });
});