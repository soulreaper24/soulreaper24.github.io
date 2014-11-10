'use strict';

angular.module('game')  
.service('GameService', function(ChanceService, LogService, WondersService, TechsService, CombatService) {
	
	var NEGATIVE_PPT_COEFF = 0.85;
	var MINIMUM_CONQUEST_REWARD = 20;
	var ENEMY_MULTIPLIER = 3;
	var CONQUEST_COEFF = 1.01;
	var ENEMY_COEFF = 1.05;

	var service = { 
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

		turnsSinceFutureAgeStarts: 0
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
        case 7: ageName = 'Infomrmation Age';
                break;
        case 8: ageName = 'Future Age';
                break;      
      }
      return ageName;
	}

	service.getEnemy = function() {
		return service.enemy;
	};

	service.findBuildingWithName = function(name) {
		for (var i = 0; i < service.availableBuildings.length; i++) {
			if (service.availableBuildings[i].name === name) {
				return service.availableBuildings[i];
			}
		}
	};

	service.findWonderWithName = function(name) {
		for (var i = 0; i < service.availableWonders.length; i++) {
			if (service.availableWonders[i].name === name) {
				return service.availableWonders[i];
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
			units[i].normalName = units[i].name;
		}
		service.availableUnits = units;
		service.enemy[0] = angular.copy(service.availableUnits[0]);
		service.enemy[0].baseCount = 3;
		service.enemy[0].count = 3;
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
		if (service.getProductionPerTurn() >= 0) {
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
		var productionWon = getPositiveProductionPerTurn() * service.productionMultiplier * Math.pow(CONQUEST_COEFF ,service.conquestsThisAge);
		if (ChanceService.tinyChance()) {
			productionWon *= 2;
		} else if (ChanceService.mediumChance()) {
			productionWon *= service.GROWTH_COEFF;
		} 

		var scienceWon = 0;
		if ((service.age < 6 && ChanceService.smallChance()) || (service.age >=6 && ChanceService.mediumChance()))  {
			scienceWon = service.getSciencePerTurn();
			scienceWon = Math.ceil(ChanceService.getRandomInRange(scienceWon * 0.9, scienceWon * 1.1));
		}

		productionWon = Math.max(productionWon, MINIMUM_CONQUEST_REWARD);
		productionWon = Math.ceil(ChanceService.getRandomInRange(productionWon * 0.9, productionWon * 1.1));

		LogService.logSuccess('Your army salvaged ' + productionWon + '<i class="fa fa-gavel"></i>.');
		service.setProduction(service.getProduction() + productionWon);
		service.totalProd += productionWon;
		if (scienceWon > 0) {
			LogService.logSuccess('Your army salvaged ' + scienceWon + '<i class="fa fa-flask"></i>.');
			service.setScience(service.getScience() + scienceWon);
			service.totalSci += scienceWon;
		}

		// increase enemy strength
		service.conquestsThisAge++;

		service.enemy[0].count = Math.max(Math.ceil(service.enemy[0].baseCount * Math.pow(ENEMY_COEFF, service.conquestsThisAge)),
			service.enemy[0].baseCount + service.conquestsThisAge);
	};

	service.conquestLost = function() {
		LogService.logAlert('Your army lost.');
	};

	service.handleNegatives = function() {
		for (var i = service.negatives.length - 1; i >= 0; i--) {
	        service.negatives[i].turns -= 1;
	        if (service.negatives[i].turns == 0) {	            
	            if (service.negatives[i].type === 'Wonder') {
	            	WondersService.setWonderBuilt(service, service.findWonderWithName(service.negatives[i].name));
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

	service.handleYear = function() {
		if (service.year < 1800) {
			service.year += 40;
		} else if (service.year < 1940) {
			service.year += 5;
		} else if (service.year < 2000) {
			service.year += 2;
		} else if (service.year < 2200) {
			service.year += 1;
		} else {
			service.year += 0.5;
		}
	};

	service.numberOfAvailableTechs = function() {
      var count = 0;
      for (var i = 0; i < service.availableTechs.length; i++) {
        if (service.availableTechs[i].age <= service.age) {
          count ++;
        }
      }
      return count - service.techs.length;
    };

	service.endTurn = function() {
		service.totalProd += service.getProductionPerTurn();
		service.totalSci += service.getSciencePerTurn();
	    service.setScience(service.getScience() + service.getSciencePerTurn());
        service.setProduction(service.getProduction() + service.getProductionPerTurn());
        service.handleNegatives();
        service.handlePositives();

        if (service.getProduction() < 0) {
            LogService.logAlert('Your <i class="fa fa-gavel"></i> is negative. <i class="fa fa-gavel"></i> and <i class="fa fa-flask"></i> per Turn are reduced by 15%.');
        }

        service.handleYear();        
        service.currentTurn.numConquests = 0;

        LogService.log('--- Turn End ---');
	};

	service.newAge = function(options) {		
		service.age += 1;		

		//combat
		var oldBaseCount = service.enemy[0].baseCount;
		if (service.availableUnits[service.age].name === service.availableUnits[service.age].eliteName) {
			service.availableUnits[service.age].name = service.availableUnits[service.age].normalName;
			service.availableUnits[service.age].damage = Math.floor(service.availableUnits[service.age].damage / 1.5);
		}
		service.enemy[0] = angular.copy(service.availableUnits[service.age]);
		service.enemy[0].baseCount = oldBaseCount * ENEMY_MULTIPLIER;
		service.enemy[0].count = service.enemy[0].baseCount;
		service.maxConquests += 1;

		if (options.production) {
			service.productionMultiplier *= 1.1;
		} else if (options.science) {
			service.scienceMultiplier *= 1.1;
		} else {
			service.maxConquests += 1;
			service.availableUnits[service.age + 1].name = service.availableUnits[service.age + 1].eliteName;
			service.availableUnits[service.age + 1].damage = Math.ceil(1.5 * service.availableUnits[service.age + 1].damage);
		}

		service.conquestsThisAge = 0;
		service.techsThisAge = 0;
	}

	return service;
});