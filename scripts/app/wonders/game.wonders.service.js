'use strict';

angular.module('game')  
.service('WondersService', function() {	
	var service = {};

	service.setWonderBuilt = function(gameService, wonderName) {
		gameService.wonders.push(wonderName);
		if (wonderName === 'Pyramids') {
			gameService.findBuildingWithName('Mine').multiplier *= 2;
			gameService.productionMultiplier *= 1.2;
		}
	};

	return service;
});