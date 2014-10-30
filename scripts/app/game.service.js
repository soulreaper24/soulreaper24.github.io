'use strict';

angular.module('game')  
.service('GameService', function() {
	var service = {year: -4000, production: 1000, productionPerTurn: 0, science: 1000, sciencePerTurn: 0, techs: []};

	var buildingCounts = {'Mine' : 0};
	var buildingProductionValues = {};
	var productionMultipliers = {'Mine' : 1.0};
	var scienceMultipliers = {'Forum' : 1.0};

	service.getProduction = function() {
		return service.production;
	};	

	service.setProduction = function(value) {
		service.production = value;
	};

	service.getProductionPerTurn = function() {
		if (!buildingProductionValues['Mine']) {
			return 0;
		}
		return Math.ceil(buildingCounts['Mine'] * productionMultipliers['Mine'] * buildingProductionValues['Mine']);
	};

	service.setProductionPerTurn = function(buildingType, value) {
		buildingProductionValues[buildingType] = value;
		buildingCounts[buildingType]++;
		service.productionPerTurn += Math.ceil(value * productionMultipliers[buildingType]);
	};

	service.getScience = function() {
		return service.science;
	};

	service.setScience = function(value) {
		service.science = value;
	};

	service.getSciencePerTurn = function() {
		return service.sciencePerTurn;
	};

	service.setSciencePerTurn = function(buildingType, value) {
		service.sciencePerTurn += Math.ceil(scienceMultipliers[buildingType] * value); 
	};

	service.setResearchedTech = function(techName) {
		service.techs.push(techName);
		if (techName === 'Mining') {
			productionMultipliers['Mine'] *= 1.2;
		}
	};

	return service;
});