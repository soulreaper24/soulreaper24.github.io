'use strict';

angular.module('game')  
.service('GameService', function() {
	var service = {production: 1000, science: 1000};

	service.getProduction = function() {
		return service.production;
	};

	service.setProduction = function(value) {
		service.production = value;
	};

	return service;
});