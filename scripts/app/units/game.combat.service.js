'use strict';

angular.module('game')  
.service('CombatService', function(GameService, ChanceService, LogService) {
	var service = {};

	var getOurDamage = function() {
		// 0 is neutral unit Wolf
		var damage = 0;
		for (var i = 1; i < GameService.availableUnits.length; i++) {
			if (GameService.availableUnits[i].count > 0) {
				damage += GameService.availableUnits[i].count * GameService.availableUnits[i].damage * GameService.damageMultiplier;
			}
		}
		return Math.ceil(ChanceService.getRandomInRange(damage * 0.9, damage * 1.1));
	};

	var getOurHp = function() {
		// 0 is neutral unit Wolf
		var hp = 0;
		for (var i = 1; i < GameService.availableUnits.length; i++) {
			if (GameService.availableUnits[i].count > 0) {
				hp += GameService.availableUnits[i].count * GameService.availableUnits[i].hp;
			}
		}
		return Math.ceil(hp);
	};

	var getEnemyDamage = function() {
		var damage = GameService.enemy.count * GameService.enemy.damage;
		return Math.ceil(ChanceService.getRandomInRange(damage * 0.9, damage * 1.1));
	};

	var getEnemyHp = function() {	
		return Math.ceil(GameService.enemy.count * GameService.enemy.hp);
	};

	var weAttack = function(ourDamage) {
		var enemyLoss = Math.ceil(ourDamage / GameService.enemy.hp);
		if (enemyLoss > GameService.enemy.count) {
			enemyLoss = GameService.enemy.count;			
		} 
		GameService.enemy.count -= enemyLoss;		
		LogService.log('Your army dealt ' + ourDamage +' damage. Enemy lost ' + enemyLoss + ' ' + GameService.enemy.name + ' units.');
	};

	var enemyAttack = function(enemyDamage) {
		while (enemyDamage > 0 && getOurHp() > 0) {			
			for (var i = 1; i < GameService.availableUnits.length; i++) {
				var dmgDealt = enemyDamage;
				if (GameService.availableUnits[i].count > 0) {
					var unitLoss = Math.ceil(enemyDamage / GameService.availableUnits[i].hp);
					if (unitLoss > GameService.availableUnits[i].count) {
						unitLoss = GameService.availableUnits[i].count;
						enemyDamage -= GameService.availableUnits[i].count * GameService.availableUnits[i].hp;
						dmgDealt = GameService.availableUnits[i].count * GameService.availableUnits[i].hp;
					} 
					GameService.availableUnits[i].count -= unitLoss;
					LogService.log('Enemy dealt ' + dmgDealt +' damage. Your army lost ' + unitLoss + ' ' + GameService.availableUnits[i].name + ' units.');
					if (GameService.availableUnits[i].count > 0) {
						return;
					}
				}
			}
		}
	};

	service.conquest = function() {
		var ourDamage = getOurDamage(), ourHp = getOurHp(), enemyDamage = getEnemyDamage(), enemyHp = getEnemyHp();

		while (ourHp > 0 && enemyHp > 0) {
			weAttack(ourDamage);
			enemyAttack(enemyDamage);

			ourDamage = getOurDamage(); 
			ourHp = getOurHp(); 
			enemyDamage = getEnemyDamage(); 
			enemyHp = getEnemyHp();
		}

		return enemyHp === 0;
	};

	return service;
});