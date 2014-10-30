'use strict';

angular.module('game')
.controller('BuildingsCtrl', function($scope, GameService, availableBuildings) {
	GameService.availableBuildings = availableBuildings;
	$scope.availableBuildings = availableBuildings.data.buildings;
	$scope.getProduction = function() {
	  return GameService.getProduction();
	}

	$scope.buy = function(building) {
	  GameService.setProduction(GameService.getProduction() - building.cost);
	  building.cost *= 2;
	  if (building.productionPerTurn) {
	  	GameService.setProductionPerTurn(building.name, building.productionPerTurn);
	  } else {
	  	GameService.setSciencePerTurn(building.name, building.sciencePerTurn);
	  }
	}
})
.config(function($stateProvider) {
  $stateProvider          
    .state('game.buildings', {
      url: '/buildings',
      templateUrl: 'scripts/app/buildings/game.buildings.html',
      resolve: {
        availableBuildings : function($q, $http, GameService) {
          if (!GameService.availableBuildings) {
	          var defer = $q.defer();
	          return $http.get('scripts/app/buildings/buildings.json').success (function(data){
	            defer.resolve(data.buildings);
	          });
	          return defer.promise;
	      } else {
	      	return GameService.availableBuildings;
	      }
        }
      },
      controller: 'BuildingsCtrl'
    });
});