'use strict';

angular.module('game')
.controller('TechsCtrl', function($scope, GameService, TechsService) {	
	$scope.availableTechs = GameService.availableTechs;

	$scope.getTechCost = function(tech) {
		console.log(GameService.techsThisAge);
		return Math.ceil(Math.pow(2, Math.min(GameService.techsThisAge, 4) * tech.cost);
	};

	$scope.researched = function(tech) {
		return tech.age <= GameService.age && GameService.techs.indexOf(tech.name) > -1;
	};

	$scope.notResearched = function(tech) {
		return tech.age <= GameService.age && GameService.techs.indexOf(tech.name) === -1;
	};

	$scope.getScience = function() {
	  return GameService.getScience();
	};

	$scope.research = function(tech) {
	  GameService.setScience(GameService.getScience() - $scope.getTechCost(tech));
	  TechsService.setTechResearched(GameService, tech.name);
	  GameService.techsThisAge++;
	};

	$scope.techResearched = function(techName) {
		return GameService.techs.indexOf(techName) > -1;
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