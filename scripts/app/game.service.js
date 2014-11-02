'use strict';

angular.module('game')  
.service('GameService', function(ChanceService, LogService, WondersService, TechsService) {
	var NEGATIVE_PPT_COEFF = 0.85;
	var MINIMUM_CONQUEST_REWARD = 200;

	var service = { 
		age : 0, /* 0 Ancient Age, 1 Classical Age, 2 Medieval Age, 3 Renaissance Age,  4 Industrial Age, 5 Modern Age, 6 Atomic Age, 7 Information Age, 8 Future Age */
		year: -4000, 
		production: 1000, 
		productionPerTurn: 0, 
		productionMultiplier: 1.0,
		science: 1000, 
		sciencePerTurn: 0, 
		scienceMultiplier: 1.0,
		techs: [],
		wonders: [],
		negatives: [/* {name, type, turns, lossPerTurn}*/],
		positives: [/* {name, type, turns, gainPerTurn}*/],
		enemy: {}
	};

	service.findBuildingWithName = function(name) {
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
		service.enemy.baseCount = 10;
		service.enemy.count = 10;
	};

	service.getProduction = function() {
		return service.production;
	};	

	service.setProduction = function(value) {
		service.production = value;
	};

	var getPositiveProductionPerTurn = function() {
		var i, total = 0;
		for (i = 0; i < service.availableBuildings.length; i++) {
			if (service.availableBuildings[i].productionPerTurn) {
				total += service.availableBuildings[i].count * service.availableBuildings[i].productionPerTurn * service.availableBuildings[i].multiplier;
			}
		}
		for (i = 0; i < service.positives.length; i++) {
			negative += service.positives[i].gainPerTurn;
		}
		return total;
	};

	var getNegativeProductionPerTurn = function() {
		var negative = 0;
		for (var i = 0; i < service.negatives.length; i++) {
			negative += service.negatives[i].lossPerTurn;
		}
		return negative;
	};

	service.getProductionPerTurn = function() {
		var i, result, positive = getPositiveProductionPerTurn(), negative = getNegativeProductionPerTurn();
		result = Math.ceil(positive * service.productionMultiplier - negative);

		if (result < 0) {
			result = Math.ceil(positive * service.productionMultiplier * NEGATIVE_PPT_COEFF - negative);
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

	service.conquestWon = function() {
		LogService.logSuccess('Your army won.');

		//handout rewards
		var productionWon = getPositiveProductionPerTurn();
		if (ChanceService.tinyChance()) {
			productionWon *= 10;
		} else if (ChanceService.mediumChance()) {
			productionWon *= 2;
		} 

		productionWon = Math.max(productionWon, MINIMUM_CONQUEST_REWARD);
		productionWon = Math.ceil(ChanceService.getRandomInRange(productionWon * 0.9, productionWon * 1.1));

		LogService.logSuccess('Your army salvaged ' + productionWon + '<i class="fa fa-gavel"></i>.');
		service.setProduction(service.getProduction() + productionWon);

		// increase enemy strength
		service.enemy.baseCount = Math.ceil(service.enemy.baseCount * 1.1);
		service.enemy.count = service.enemy.baseCount;
	};

	service.conquestLost = function() {
		LogService.logAlert('Your army lost.');
	};

	service.handleNegatives = function() {
		for (var i = service.negatives.length - 1; i >= 0; i--) {
	        service.negatives[i].turns -= 1;
	        if (service.negatives[i].turns == 0) {	            
	            if (service.negatives[i].type === 'Wonder') {
	            	WondersService.setWonderBuilt(service, service.negatives[i].name);
	            }
	            service.negatives.splice(i, 1);
	        }
	    }
	};

	service.handlePositives = function() {
		for (var i = service.positives.length - 1; i >= 0; i--) {
	        service.positives[i].turns -= 1;
	        if (service.positives[i].turns == 0) {	            	            
	            service.positives.splice(i, 1);
	        }
	    }
	};

	service.endTurn = function() {
	    service.setScience(service.getScience() + service.getSciencePerTurn());
        service.setProduction(service.getProduction() + service.getProductionPerTurn());
        service.handleNegatives();
        service.handlePositives();

        if (service.getProduction() < 0) {
            LogService.logAlert('Your <i class="fa fa-gavel"></i> is negative. <i class="fa fa-gavel"></i> and <i class="fa fa-flask"></i> per Turn are reduced by 15%.');
        }

        service.year += 4;
        LogService.log('--- Turn End ---');
	};

	return service;
});