'use strict';

angular.module('game')  
.service('GameService', function() {
	var NEGATIVE_PPT_COEFF = 0.85;

	var service = { age : 0, /* 0 Ancient Age, 1 Classical Age, 2 Medieval Age, 3 Renaissance Age,  4 Industrial Age, 5 Modern Age, 6 Atomic Age, 7 Information Age, 8 Future Age */
		year: -4000, 
		production: 1000, 
		productionPerTurn: 0, 
		productionMultiplier: 1.0,
		science: 1000, 
		sciencePerTurn: 0, 
		scienceMultiplier: 1.0,
		techs: [],
		wonders: [],
		negatives: [/* {name, turns, loosPerTurn}*/],
		enemy: {}
	};

	service.setResearchedTech = function(techName) {
		service.techs.push(techName);
		if (techName === 'Mining') {
			findBuildingWithName('Mine').multiplier *= 2;
		}
	};

	service.setBuiltWonder = function(wonderName) {
		service.wonders.push(wonderName);
		if (wonderName === 'Pyramids') {
			findBuildingWithName('Mine').multiplier *= 2;
			service.productionMultiplier *= 1.2;
		}
	};

	var findBuildingWithName = function(name) {
		for (var i = 0; i < service.availableBuildings.length; i++) {
			if (service.availableBuildings[i].name === name) {
				return service.availableBuildings[i];
			}
		}
	};

	service.setAvailableBuildings = function(buildings) {
		for (var i = 0; i < buildings.length; i++) {
			buildings[i].multiplier = 1;
			buildings[i].count = 0;
		}
		service.availableBuildings = buildings;
	};

	service.setAvailableUnits = function(units) {
		for (var i = 0; i < units.length; i++) {			
			units[i].count = 0;
		}
		service.availableUnits = units;
		service.enemy = service.availableUnits[0];
		service.enemy.count = 10;
	};

	service.getProduction = function() {
		return service.production;
	};	

	service.setProduction = function(value) {
		service.production = value;
	};

	service.getProductionPerTurn = function() {
		var i, total = 0, negative = 0, result;
		/* positives */
		for (i = 0; i < service.availableBuildings.length; i++) {
			if (service.availableBuildings[i].productionPerTurn) {
				total += service.availableBuildings[i].count * service.availableBuildings[i].productionPerTurn * service.availableBuildings[i].multiplier;
			}
		}
		/* negatives */
		for (i = 0; i < service.negatives.length; i++) {			
			negative += service.negatives[i].lossPerTurn;
		}

		result = Math.ceil(total * service.productionMultiplier - negative);

		if (result < 0) {
			result = Math.ceil(total * service.productionMultiplier * NEGATIVE_PPT_COEFF - negative);
		}

		return result;
	};

	service.setProductionPerTurn = function(building) {		
		service.productionPerTurn += building.productionPerTurn * building.multiplier;
	};

	service.getScience = function() {
		return service.science;
	};

	service.setScience = function(value) {
		service.science = value;
	};

	service.getSciencePerTurn = function() {
		var total = 0;
		for (var i = 0; i < service.availableBuildings.length; i++) {
			if (service.availableBuildings[i].sciencePerTurn) {
				total += service.availableBuildings[i].count * service.availableBuildings[i].sciencePerTurn * service.availableBuildings[i].multiplier;
			}
		}
		if (service.getProductionPerTurn() > 0) {
			return Math.ceil(total * service.scienceMultiplier);
		} else {
			return Math.ceil(total * service.scienceMultiplier * NEGATIVE_PPT_COEFF);
		}
	};

	service.setSciencePerTurn = function(building) {
		service.sciencePerTurn += Math.ceil(building.sciencePerTurn * building.multiplier); 
	};	

	service.handleNegatives = function() {
		for (var i = service.negatives.length - 1; i >= 0; i--) {
	        service.negatives[i].turns -= 1;
	        if (service.negatives[i].turns == 0) {	            
	            if (service.negatives[i].type === 'Wonder') {
	            	service.setBuiltWonder(service.negatives[i].name);
	            }
	            service.negatives.splice(i, 1);
	        }
	    }
	}

	return service;
});