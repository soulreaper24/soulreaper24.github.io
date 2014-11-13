'use strict';

angular.module('game')  
.service('GameService', function($filter, ChanceService, LogService, WondersService, TechsService, CombatService) {
	
	var NEGATIVE_PPT_COEFF = 0.85;
	var MINIMUM_CONQUEST_REWARD = 20;
	var ENEMY_MULTIPLIER = 3;
	var CONQUEST_COEFF = 1.01;
	var ENEMY_COEFF = 1.03;
	var service = {};
	service.data = { 
		GROWTH_COEFF: 1.15,
		totalProd: 0,
		totalSci: 0,

		conquestsThisAge: 0,
		techsThisAge: 0,
		currentTurn: {numConquests : 0},
		age : 0, 
		year: -4000, 
		production: 100, 
		productionPerTurn: 0, 
		productionMultiplier: 1.0,
		science: 100, 
		sciencePerTurn: 0, 
		scienceMultiplier: 1.0,
		techs: [],
		wonders: [],

		maxConquests: 1,
		damageMultiplier : 1.0,
		hpMultiplier: 1.0,
		negatives: [/* {name, type, turns, lossPerTurn}*/],
		positives: [/* {name, type, turns, gainPerTurn}*/],
		enemy: [],
		aliens: [],

		turnsSinceAlienInvaded: -3
	};

	service.getAgeName = function(age) {
	  var ageName;
      switch (age) {
        case 0: ageName = 'Ancient Age';
                break;
        case 1: ageName = 'Classical Age';
                break;
        case 2: ageName = 'Medieval Age';
                break;
        case 3: ageName = 'Renaissance Age';
                break;
        case 4: ageName = 'Industrial Age';
                break;
        case 5: ageName = 'Modern Age';
                break;
        case 6: ageName = 'Atomic Age';
                break;
        case 7: ageName = 'Information Age';
                break;
        case 8: ageName = 'Future Age';
                break;      
      }
      return ageName;
	}

	service.getEnemy = function() {
		return service.data.enemy;
	};

	service.findBuildingWithName = function(name) {
		for (var i = 0; i < service.data.availableBuildings.length; i++) {
			if (service.data.availableBuildings[i].name === name) {
				return service.data.availableBuildings[i];
			}
		}
	};

	service.findWonderWithName = function(name) {
		for (var i = 0; i < service.data.availableWonders.length; i++) {
			if (service.data.availableWonders[i].name === name) {
				return service.data.availableWonders[i];
			}
		}
	};

	service.findUnitWithName = function(name) {
		for (var i = 0; i < service.data.availableUnits.length; i++) {
			if (service.data.availableUnits[i].name === name) {
				return service.data.availableUnits[i];
			}
		}
	};

	service.setAvailableBuildings = function(buildings) {
		for (var i = 0; i < buildings.length; i++) {
			buildings[i].multiplier = 1;
			buildings[i].count = 0;
		}
		service.data.availableBuildings = buildings;
	};

	service.setAvailableUnits = function(units) {
		for (var i = 0; i < units.length; i++) {
			units[i].toTrain = 1;			
			units[i].count = 0;
			units[i].normalName = units[i].name;
		}
		service.data.availableUnits = units;
		service.data.enemy[0] = angular.copy(service.data.availableUnits[0]);
		service.data.enemy[0].baseCount = 3;
		service.data.enemy[0].count = 3;
	};

	service.getProduction = function() {
		return service.data.production;
	};	

	service.setProduction = function(value) {
		service.data.production = value;
	};

	var getPositiveProductionPerTurn = function() {
		var i, total = 0;
		for (i = 0; i < service.data.availableBuildings.length; i++) {
			if (service.data.availableBuildings[i].productionPerTurn) {
				total += service.data.availableBuildings[i].count * service.data.availableBuildings[i].productionPerTurn * service.data.availableBuildings[i].multiplier;
			}
		}
		for (i = 0; i < service.data.positives.length; i++) {
			negative += service.data.positives[i].gainPerTurn;
		}
		return total;
	};

	var getNegativeProductionPerTurn = function() {
		var negative = 0;
		for (var i = 0; i < service.data.negatives.length; i++) {
			negative += service.data.negatives[i].lossPerTurn;
		}
		return negative;
	};

	service.getProductionPerTurn = function() {
		var i, result, positive = getPositiveProductionPerTurn(), negative = getNegativeProductionPerTurn();
		result = Math.ceil(positive * service.data.productionMultiplier - negative);

		if (result < 0) {
			result = Math.ceil(positive * service.data.productionMultiplier * NEGATIVE_PPT_COEFF - negative);
		}

		return result;
	};

	service.setProductionPerTurn = function(building) {		
		service.data.productionPerTurn += building.productionPerTurn * building.multiplier;
	};

	service.getScience = function() {
		return service.data.science;
	};

	service.setScience = function(value) {
		service.data.science = value;
	};

	service.getSciencePerTurn = function() {
		var total = 0;
		for (var i = 0; i < service.data.availableBuildings.length; i++) {
			if (service.data.availableBuildings[i].sciencePerTurn) {
				total += service.data.availableBuildings[i].count * service.data.availableBuildings[i].sciencePerTurn * service.data.availableBuildings[i].multiplier;
			}
		}
		if (service.getProductionPerTurn() >= 0) {
			return Math.ceil(total * service.data.scienceMultiplier);
		} else {
			return Math.ceil(total * service.data.scienceMultiplier * NEGATIVE_PPT_COEFF);
		}
	};

	service.setSciencePerTurn = function(building) {
		service.data.sciencePerTurn += Math.ceil(building.sciencePerTurn * building.multiplier); 
	};	

	service.conquestWon = function() {
		LogService.logSuccess('Your army won.');

		//handout rewards
		var productionWon = getPositiveProductionPerTurn() * service.data.productionMultiplier * Math.pow(CONQUEST_COEFF ,service.data.conquestsThisAge);
		if (ChanceService.tinyChance()) {
			productionWon *= 2;
		} else if (ChanceService.mediumChance()) {
			productionWon *= service.data.GROWTH_COEFF;
		} 

		var scienceWon = 0;
		if ((service.data.age < 6 && ChanceService.smallChance()) || (service.data.age >=6 && ChanceService.mediumChance()))  {
			scienceWon = service.getSciencePerTurn();
			scienceWon = Math.ceil(ChanceService.getRandomInRange(scienceWon * 0.9, scienceWon * 1.1));
		}

		productionWon = Math.max(productionWon, MINIMUM_CONQUEST_REWARD);
		productionWon = Math.ceil(ChanceService.getRandomInRange(productionWon * 0.9, productionWon * 1.1));

		LogService.logSuccess('Your army salvaged ' + $filter('number')(productionWon) + '<i class="fa fa-gavel"></i>.');
		service.setProduction(service.getProduction() + productionWon);
		service.data.totalProd += productionWon;
		if (scienceWon > 0) {
			LogService.logSuccess('Your army salvaged ' + $filter('number')(scienceWon) + '<i class="fa fa-flask"></i>.');
			service.setScience(service.getScience() + scienceWon);
			service.data.totalSci += scienceWon;
		}

		// increase enemy strength
		service.data.conquestsThisAge++;

		service.data.enemy[0].count = Math.max(Math.ceil(service.data.enemy[0].baseCount * Math.pow(ENEMY_COEFF, service.data.conquestsThisAge)),
			service.data.enemy[0].baseCount + service.data.conquestsThisAge);
	};

	service.conquestLost = function() {
		LogService.logAlert('Your army lost.');
	};

	service.handleNegatives = function() {
		for (var i = service.data.negatives.length - 1; i >= 0; i--) {
	        service.data.negatives[i].turns -= 1;
	        if (service.data.negatives[i].turns == 0) {	            
	            if (service.data.negatives[i].type === 'Wonder') {
	            	LogService.logSuccess('Construction of <i class="fa fa-star"></i> <b>' + service.data.negatives[i].name + '</b> has completed.');
	            	WondersService.setWonderBuilt(service, service.findWonderWithName(service.data.negatives[i].name));
	            }
	            service.data.negatives.splice(i, 1);
	        }
	    }
	};

	service.handlePositives = function() {
		for (var i = service.data.positives.length - 1; i >= 0; i--) {
	        service.data.positives[i].turns -= 1;
	        if (service.data.positives[i].turns == 0) {	            	            
	            service.data.positives.splice(i, 1);
	        }
	    }
	};

	service.handleYear = function() {
		if (service.data.year < -800) {
			service.data.year += 80;
		} else if (service.data.year < 800) {
			service.data.year += 40;
		} else if (service.data.year < 1550) {
			service.data.year += 30;
		} else if (service.data.year < 1775) {
			service.data.year += 15;
		} else if (service.data.year < 1950) {
			service.data.year += 5;
		} else if (service.data.year < 2000) {
			service.data.year += 2;
		} else {
			service.data.year += 1;
		} 
	};

	service.numberOfAvailableTechs = function() {
      var count = 0;
      for (var i = 0; i < service.data.availableTechs.length; i++) {
        if (service.data.availableTechs[i].age <= service.data.age) {
          count ++;
        }
      }
      return count - service.data.techs.length;
    };

	service.endTurn = function() {
		service.data.totalProd += service.getProductionPerTurn();
		service.data.totalSci += service.getSciencePerTurn();
	    service.setScience(service.getScience() + service.getSciencePerTurn());
        service.setProduction(service.getProduction() + service.getProductionPerTurn());
        service.handleNegatives();
        service.handlePositives();

        if (service.getProduction() < 0) {
            LogService.logAlert('Your <i class="fa fa-gavel"></i> is negative. <i class="fa fa-gavel"></i> and <i class="fa fa-flask"></i> per Turn are reduced by 15%.');
        }

        service.handleYear();        
        service.data.currentTurn.numConquests = 0;

        LogService.log('--- Turn End ---');
	};

	service.newAge = function(options) {		
		service.data.age += 1;		

		//combat
		var oldBaseCount = service.data.enemy[0].baseCount;
		if (service.data.availableUnits[service.data.age].name === service.data.availableUnits[service.data.age].eliteName) {
			service.data.availableUnits[service.data.age].name = service.data.availableUnits[service.data.age].normalName;
			service.data.availableUnits[service.data.age].damage = Math.floor(service.data.availableUnits[service.data.age].damage / 1.5);
		}
		service.data.enemy[0] = angular.copy(service.data.availableUnits[service.data.age]);
		service.data.enemy[0].baseCount = oldBaseCount * ENEMY_MULTIPLIER;
		service.data.enemy[0].count = service.data.enemy[0].baseCount;
		service.data.maxConquests += 1;

		if (options.production) {
			service.data.productionMultiplier *= 1.1;
		} else if (options.science) {
			service.data.scienceMultiplier *= 1.1;
		} else {
			service.data.maxConquests += 1;
			service.data.availableUnits[service.data.age + 1].name = service.data.availableUnits[service.data.age + 1].eliteName;
			service.data.availableUnits[service.data.age + 1].damage = Math.ceil(1.5 * service.data.availableUnits[service.data.age + 1].damage);
		}

		service.data.conquestsThisAge = 0;
		service.data.techsThisAge = 0;
	}

	return service;
});