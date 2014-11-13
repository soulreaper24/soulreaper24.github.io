'use strict';

angular.module('game')
.controller('TechsCtrl', function($scope, GameService, TechsService) {	
	$scope.getAvailableTechs = function () {
		if (GameService.data.age === 8) {			
			var techs = [];

			for (var i = GameService.data.availableTechs.length - 1; i >= 0; i--) {
				if (!GameService.data.availableTechs[i].turns || GameService.data.availableTechs[i].turns <= GameService.data.turnsSinceAlienInvaded) {
					techs.push(GameService.data.availableTechs[i]);
				}
			}
			return techs;
		} else {
			return GameService.data.availableTechs;
		}
	}

	$scope.getTechCost = function(tech) {		
		if (GameService.data.age < 8) {
			return Math.ceil(Math.pow(2, Math.min(GameService.data.techsThisAge, 3)) * tech.cost);
		} else {
			return Math.ceil(Math.pow(GameService.data.GROWTH_COEFF, GameService.data.techsThisAge) * tech.cost);
		}
	};

	$scope.researched = function(tech) {
		return tech.age <= GameService.data.age && GameService.data.techs.indexOf(tech.name) > -1;
	};

	$scope.notResearched = function(tech) {
		return tech.age <= GameService.data.age && GameService.data.techs.indexOf(tech.name) === -1;
	};

	$scope.getScience = function() {
	  return GameService.getScience();
	};

	$scope.research = function(tech) {
	  GameService.setScience(GameService.getScience() - $scope.getTechCost(tech));
	  TechsService.setTechResearched(GameService, tech);
	  GameService.data.techsThisAge++;
	};

	$scope.techResearched = function(techName) {
		return GameService.data.techs.indexOf(techName) > -1;
	};
})
.config(function($stateProvider) {
  $stateProvider          
    .state('game.techs', {
      url: '/techs',
      templateUrl: 'scripts/app/techs/game.techs.html',
      controller: 'TechsCtrl'
    });
});