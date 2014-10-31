'use strict';

angular.module('game')
.controller('TechsCtrl', function($scope, GameService) {	
	$scope.availableTechs = GameService.availableTechs;

	$scope.ageFilter = function(building) {
		return building.age <= GameService.age;
	};

	$scope.getScience = function() {
	  return GameService.getScience();
	}

	$scope.research = function(tech) {
	  GameService.setScience(GameService.getScience() - tech.cost);
	  GameService.setResearchedTech(tech.name);
	}

	$scope.notResearchedTech = function(techName) {
		return GameService.techs.indexOf(techName) > -1;
	}
})
.config(function($stateProvider) {
  $stateProvider          
    .state('game.techs', {
      url: '/techs',
      templateUrl: 'scripts/app/techs/game.techs.html',
      controller: 'TechsCtrl'
    });
});