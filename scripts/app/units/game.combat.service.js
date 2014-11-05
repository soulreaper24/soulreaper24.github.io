'use strict';

angular.module('game')  
.service('CombatService', function($filter, ChanceService, LogService) {
	var service = {};

	var getOurDamage = function(ourUnits, ourDamageMultiplier) {
		// 0 is neutral unit Wolf
		var damage = 0;
		for (var i = 1; i < ourUnits.length; i++) {
			if (ourUnits[i].count > 0) {
				damage += ourUnits[i].count * ourUnits[i].damage * ourDamageMultiplier;
			}
		}
		return Math.ceil(ChanceService.getRandomInRange(damage * 0.9, damage * 1.1));
	};

	var getOurHp = function(ourUnits) {
		// 0 is neutral unit Wolf
		var hp = 0;
		for (var i = 1; i < ourUnits.length; i++) {
			if (ourUnits[i].count > 0) {
				hp += ourUnits[i].count * ourUnits[i].hp;
			}
		}
		return Math.ceil(hp);
	};

	var getEnemyDamage = function(enemy) {
		var damage = 0;
		for (var i = 0; i < enemy.length; i++) {
			if (enemy[i].count > 0) {
				damage += enemy[i].count * enemy[i].damage;
			}
		}
		return Math.ceil(ChanceService.getRandomInRange(damage * 0.9, damage * 1.1));
	};

	var getEnemyHp = function(enemy) {
		var hp = 0;
		for (var i = 0; i < enemy.length; i++) {
			if (enemy[i].count > 0) {
				hp += enemy[i].count * enemy[i].hp;
			}
		}
		return Math.ceil(hp);		
	};

	var weAttack = function(ourDamage, enemy) {
		while (ourDamage > 0 && getEnemyHp(enemy) > 0) {			
			for (var i = 0; i < enemy.length; i++) {
				var dmgDealt = ourDamage;
				if (enemy[i].count > 0) {
					var unitLoss = Math.ceil(ourDamage / enemy[i].hp);
					if (unitLoss > enemy[i].count) {
						unitLoss = enemy[i].count;
					} 
					ourDamage -= unitLoss * enemy[i].hp;
					dmgDealt = unitLoss * enemy[i].hp;
					enemy[i].count -= unitLoss;
					LogService.logSuccess('Your army dealt ' + $filter('number')(dmgDealt) +' damage. Enemy lost ' + $filter('number')(unitLoss) + ' ' + enemy[i].name + ' units.');
					if (ourDamage <= 0) {
						break;
					}

				}
			}
		}
	};

	var enemyAttack = function(enemyDamage, ourUnits) {
		while (enemyDamage > 0 && getOurHp(ourUnits) > 0) {			
			for (var i = 1; i < ourUnits.length; i++) {
				var dmgDealt = enemyDamage;
				if (ourUnits[i].count > 0) {
					var unitLoss = Math.ceil(enemyDamage / ourUnits[i].hp);
					if (unitLoss > ourUnits[i].count) {
						unitLoss = ourUnits[i].count;
					} 
					enemyDamage -= unitLoss * ourUnits[i].hp;
					dmgDealt = unitLoss * ourUnits[i].hp;
					ourUnits[i].count -= unitLoss;
					LogService.logAlert('Enemy dealt ' + $filter('number')(dmgDealt) +' damage. Your army lost ' + $filter('number')(unitLoss) + ' ' + ourUnits[i].name + ' units.');
					if (ourUnits[i].count > 0) {
						return;
					}
				}
			}
		}
	};

	service.conquest = function(ourUnits, ourDamageMultiplier, enemy) {
		var ourDamage = getOurDamage(ourUnits, ourDamageMultiplier), ourHp = getOurHp(ourUnits), enemyDamage = getEnemyDamage(enemy), enemyHp = getEnemyHp(enemy);

		while (ourHp > 0 && enemyHp > 0) {
			weAttack(ourDamage, enemy);
			enemyAttack(enemyDamage, ourUnits);

			ourDamage = getOurDamage(ourUnits, ourDamageMultiplier); 
			ourHp = getOurHp(ourUnits); 
			enemyDamage = getEnemyDamage(enemy); 
			enemyHp = getEnemyHp(enemy);
		}

		return enemyHp === 0;
	};

	return service;
});