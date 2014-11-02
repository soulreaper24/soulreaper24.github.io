'use strict';

angular.module('game')  
.service('TechsService', function() {	
	var service = {};

	service.setTechResearched = function(gameService, techName) {
		gameService.techs.push(techName);
		if (techName === 'Mining') {
			gameService.findBuildingWithName('Mine').multiplier *= 2;
		}
	};

	return service;
});