'use strict';

angular.module('game')
.controller('TechsCtrl', function($scope, GameService, TechsService) {	
	$scope.getAvailableTechs = function () {
		return GameService.data.availableTechs;
	}

	$scope.getTechCost = function(tech) {		
		if (GameService.data.age < 8) {
			return Math.ceil(Math.pow(2, Math.min(GameService.data.techsThisAge, 3)) * tech.cost);
		} else {
			return tech.cost;
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