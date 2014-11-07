'use strict';

angular.module('game')  
.service('DebugService', function(GameService, TechsService, WondersService) {
	var years = [-4000, -600, 500, 1500, 1900, 1940, 1980, 2000, 2020];

	var service = {};

	service.setDebugAge = function(age) {
		var i, prodIndex = 0, sciIndex = 0;
		GameService.age = age;
		GameService.year = years[age];
		GameService.availableUnits[age].count = 20 * age;
		GameService.production = Math.pow(10, age + 1);
		GameService.science = Math.pow(10, age + 1);
		GameService.productionMultiplier *= Math.pow(1.1, age);

		for (i = 0; i < GameService.availableBuildings.length; i++) {
			if (GameService.availableBuildings[i].age < age) {
				if (GameService.availableBuildings[i].productionPerTurn) {
					GameService.availableBuildings[i].count = Math.min(26 + 5 * prodIndex++, 55);
					GameService.availableBuildings[i].cost *= Math.ceil(Math.pow(GameService.GROWTH_COEFF, GameService.availableBuildings[i].count));
				} else {
					GameService.availableBuildings[i].count = Math.min(30 + 5 * sciIndex++, 55);
					GameService.availableBuildings[i].cost *= Math.ceil(Math.pow(GameService.GROWTH_COEFF, GameService.availableBuildings[i].count));
				}
			}
		}

		for (i = 0; i < GameService.availableTechs.length; i++) {
			if (GameService.availableTechs[i].age < age) {
				TechsService.setTechResearched(GameService, GameService.availableTechs[i].name);
			}
		}

		for (i = 0; i < GameService.availableWonders.length; i++) {
			if (GameService.availableWonders[i].age < age) {
				WondersService.setWonderBuilt(GameService, GameService.availableWonders[i].name);
			}
		}
		GameService.enemy = [angular.copy(GameService.availableUnits[age])];
		GameService.enemy[0].baseCount = Math.pow(3, age);
		GameService.enemy[0].count = Math.pow(3, age);
		GameService.maxConquests += age;
	};

	return service;
});