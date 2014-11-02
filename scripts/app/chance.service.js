'use strict';

angular.module('game')  
.service('ChanceService', function() {	
	var service = {};

	service.getRandomInRange = function(min, max) {
  		return Math.random() * (max - min) + min;
	};

	service.tinyChance = function() {		
		return Math.random() < 0.01;
	};

	service.smallChance = function() {		
		return Math.random() < 0.1;
	};

	service.mediumChance = function() {
		return Math.random() < 0.3;
	};

	service.bigChance = function() {
		return Math.random() < 0.8;
	};

	service.massiveChance = function() {
		return Math.random() < 0.99;
	};

	return service;
});