'use strict';

angular.module('game')  
.service('DebugService', function(GameService, TechsService, WondersService) {
	var years = [-4000, -600, 600, 1500, 1850, 1930, 1956, 1970, 1990];

	var service = {};

	service.setDebugAge = function(age) {
		var i, prodIndex = 0, sciIndex = 0;
		GameService.data.age = age;
		GameService.data.year = 2028;//years[age];
		GameService.data.availableUnits[age + 1].count = 1 * age;
		GameService.data.production = Math.pow(100, age );
		GameService.data.science = Math.pow(100, age );
		GameService.data.productionMultiplier *= Math.pow(1.1, age);

		for (i = 0; i < GameService.data.availableBuildings.length; i++) {
			if (GameService.data.availableBuildings[i].age < age) {
				if (GameService.data.availableBuildings[i].productionPerTurn) {
					GameService.data.availableBuildings[i].count = Math.min(35 + 5 * prodIndex++, 56);
					GameService.data.availableBuildings[i].cost *= Math.ceil(Math.pow(GameService.data.GROWTH_COEFF, GameService.data.availableBuildings[i].count));
				} else {
					GameService.data.availableBuildings[i].count = Math.min(35 + 5 * sciIndex++, 56);
					GameService.data.availableBuildings[i].cost *= Math.ceil(Math.pow(GameService.data.GROWTH_COEFF, GameService.data.availableBuildings[i].count));
				}
			}
		}

		for (i = 0; i < GameService.data.availableTechs.length; i++) {
			if (GameService.data.availableTechs[i].age < age) {
				TechsService.setTechResearched(GameService, GameService.data.availableTechs[i]);
			}
		}

		for (i = 0; i < GameService.data.availableWonders.length; i++) {
			if (GameService.data.availableWonders[i].age < age) {
				WondersService.setWonderBuilt(GameService, GameService.data.availableWonders[i]);
			}
		}
		GameService.data.enemy = [angular.copy(GameService.data.availableUnits[age])];
		GameService.data.enemy[0].baseCount = Math.pow(3, age);
		GameService.data.enemy[0].count = Math.pow(3, age);
		GameService.data.maxConquests += age;
	};

	return service;
});