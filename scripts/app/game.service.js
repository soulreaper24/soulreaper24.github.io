'use strict';

angular.module('game')  
.service('GameService', function() {
	var service = { age : 0, /* 0 Ancient Age, 1 Classical Age, 2 Medieval Age, 3 Renaissance Age,  4 Industrial Age, 5 Modern Age, 6 Atomic Age, 7 Information Age, 8 Future Age */
		year: -4000, 
		production: 1000, 
		productionPerTurn: 0, 
		productionMultiplier: 1.0,
		science: 1000, 
		sciencePerTurn: 0, 
		scienceMultiplier: 1.0,
		techs: [],
		wonders: []
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

	service.getProduction = function() {
		return service.production;
	};	

	service.setProduction = function(value) {
		service.production = value;
	};

	service.getProductionPerTurn = function() {
		var total = 0;
		for (var i = 0; i < service.availableBuildings.length; i++) {
			if (service.availableBuildings[i].productionPerTurn) {
				total += service.availableBuildings[i].count * service.availableBuildings[i].productionPerTurn * service.availableBuildings[i].multiplier;
			}
		}
		return Math.ceil(total * service.productionMultiplier);
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
		return Math.ceil(total * service.scienceMultiplier);
	};

	service.setSciencePerTurn = function(building) {
		service.sciencePerTurn += Math.ceil(building.sciencePerTurn * building.multiplier); 
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

	return service;
});