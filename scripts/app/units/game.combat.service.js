'use strict';

angular.module('game')  
.service('CombatService', function($filter, ChanceService, LogService) {
	var FIRST_STRIKE = 'First Strike';
	var SPLASH = 'Splash Damage';
	var LAST_STRIKE = 'Last Strike';

	var service = {};

	var getOurDamage = function(ourUnits, ourDamageMultiplier, type) {
		// 0 is neutral unit Wolf
		var damage = 0;
		for (var i = 1; i < ourUnits.length; i++) {
			if (ourUnits[i].count > 0 && ourUnits[i].trait === type) {
				damage += ourUnits[i].count * ourUnits[i].damage * ourDamageMultiplier;
			}
		}
		return Math.ceil(ChanceService.getRandomInRange(damage * 0.9, damage * 1.1));
	};

	var getOurHp = function(ourUnits, hpMultiplier) {
		// 0 is neutral unit Wolf
		var hp = 0;
		for (var i = 1; i < ourUnits.length; i++) {
			if (ourUnits[i].count > 0) {
				hp += ourUnits[i].count * ourUnits[i].hp;
			}
		}
		return Math.ceil(hp * hpMultiplier);
	};

	var getEnemyDamage = function(enemy, type) {
		var damage = 0;
		for (var i = 0; i < enemy.length; i++) {
			if (enemy[i].count > 0 && enemy[i].trait === type) {
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

	var weAttack = function(ourDamage, splashDamage, enemy) {
		//while (ourDamage > 0 && getEnemyHp(enemy) > 0) {
			for (var i = 0; i < enemy.length; i++) {
				var dmgDealt = ourDamage;
				if (enemy[i].count > 0) {
					var unitLoss = Math.ceil((ourDamage + splashDamage) / enemy[i].hp);
					if (unitLoss > enemy[i].count) {
						unitLoss = enemy[i].count;
					} 
					dmgDealt = Math.min(enemy[i].count, Math.ceil(ourDamage / enemy[i].hp)) * enemy[i].hp;
					ourDamage = Math.max(ourDamage - dmgDealt, 0);
					if (dmgDealt > 0) {
						LogService.logSuccess('Your army dealt ' + $filter('number')(dmgDealt) + ' normal damage and ' + $filter('number')(splashDamage) + ' splash damage. Enemy lost ' + 
							$filter('number')(unitLoss) + ' (out of ' + $filter('number')(enemy[i].count) + ') ' + 
							enemy[i].name +' units.');
					} else if (splashDamage > 0){
						LogService.logSuccess('Your army dealt ' + $filter('number')(splashDamage) + ' splash damage. Enemy lost ' + 
							$filter('number')(unitLoss) + ' (out of ' + $filter('number')(enemy[i].count) + ') ' + 
							enemy[i].name +' units.');
					}
					enemy[i].count -= unitLoss;
				}
			}
		//}
	};

	var findHighestHpUnit = function(units) {
		var max = 0, unit;
		for (var i = 1; i < units.length; i++) {
			if (units[i].count > 0 && units[i].hp > max) {
				max = units[i].hp;
				unit = units[i];
			}
		}
		return unit;
	};

	var enemyAttack = function(enemyDamage, enemySplashDamage, ourUnits, hpMultiplier) {
		while (enemyDamage > 0 && getOurHp(ourUnits, hpMultiplier) > 0) {
			var unit = findHighestHpUnit(ourUnits);
			if (!unit) {
				break;
			}
			//for (var i = 1; i < ourUnits.length; i++) {
			var dmgDealt = enemyDamage;
			var unitLoss = Math.ceil((enemyDamage + enemySplashDamage) / (unit.hp * hpMultiplier));
			if (unitLoss > unit.count) {
				unitLoss = unit.count;
			} 
			dmgDealt = Math.ceil(Math.min(unit.count, Math.ceil(enemyDamage / (unit.hp * hpMultiplier))) * (unit.hp * hpMultiplier));
			enemyDamage = Math.max(enemyDamage - dmgDealt, 0);
			if (dmgDealt > 0) {
				LogService.logAlert('Enemy dealt ' + $filter('number')(dmgDealt) +' normal damage and ' + $filter('number')(enemySplashDamage) + ' splash damage. Your army lost ' + 
					$filter('number')(unitLoss) + ' (out of ' + $filter('number')(unit.count) + ') ' + 
					unit.name +' units.');
			} else if (enemySplashDamage > 0) {
				LogService.logAlert('Enemy dealt ' + $filter('number')(enemySplashDamage) + ' splash damage. Your army lost ' + 
					$filter('number')(unitLoss) + ' (out of ' + $filter('number')(unit.count) + ') ' + 
					unit.name +' units.');
			}

			unit.count -= unitLoss;
			//}
		}
	};

	service.conquest = function(ourUnits, ourDamageMultiplier, ourHpMultiplier, enemy) {
		var ourFirstStrikeDamage, enemyFirstStrikeDamage, ourSplashDamage, enemySplashDamage, 
		ourNonSplashDamage,	enemyNonSplashDamage, ourLastStrikeDamage, enemyLastStrikeDamage,
		round = 1,  ourHp = getOurHp(ourUnits, ourHpMultiplier), enemyHp = getEnemyHp(enemy);

		LogService.log('<b>COMBAT STARTS</b>');
		while (ourHp > 0 && enemyHp > 0) {
			LogService.log('<em>ROUND ' + (round++) + '</em>');			

			//first strike
			ourFirstStrikeDamage = getOurDamage(ourUnits, ourDamageMultiplier, FIRST_STRIKE);
			enemyFirstStrikeDamage = getEnemyDamage(enemy, FIRST_STRIKE);
			if (ourFirstStrikeDamage > 0 || enemyFirstStrikeDamage > 0) {
				LogService.log('<em>First Strike Units</em>');
				weAttack(ourFirstStrikeDamage, 0, enemy);
				enemyAttack(enemyFirstStrikeDamage, 0, ourUnits, ourHpMultiplier);
			}

			//normal
			LogService.log('<em>Normal Units</em>');
			ourSplashDamage = getOurDamage(ourUnits, ourDamageMultiplier, SPLASH);
			enemySplashDamage = getEnemyDamage(enemy, SPLASH);
			ourNonSplashDamage = getOurDamage(ourUnits, ourDamageMultiplier, undefined);
			enemyNonSplashDamage = getEnemyDamage(enemy, undefined);

			weAttack(ourNonSplashDamage, ourSplashDamage, enemy);
			enemyAttack(enemyNonSplashDamage, enemySplashDamage, ourUnits, ourHpMultiplier);			

			//last strike
			ourLastStrikeDamage = getOurDamage(ourUnits, ourDamageMultiplier, LAST_STRIKE);
			enemyLastStrikeDamage = getEnemyDamage(enemy, LAST_STRIKE);
			if (ourLastStrikeDamage > 0 || enemyLastStrikeDamage > 0) {
				LogService.log('<em>Last Strike Units</em>');
				weAttack(ourLastStrikeDamage, 0, enemy);
				enemyAttack(enemyLastStrikeDamage, 0, ourUnits, ourHpMultiplier);
			}
			
			ourHp = getOurHp(ourUnits, ourHpMultiplier); 
			enemyHp = getEnemyHp(enemy);
		}
		LogService.log('<b>COMBAT ENDS</b>');

		return enemyHp === 0;
	};

	return service;
});