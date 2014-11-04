'use strict';

angular.module('game')  
.service('WondersService', function() {	
	var service = {};

	service.setWonderBuilt = function(gameService, wonderName) {
		gameService.wonders.push(wonderName);
		if (wonderName === 'Pyramids' || wonderName === 'Hanging Gardens'
			|| wonderName === 'Angkor Wat' || wonderName === 'Taj Mahal'
			|| wonderName === 'Leaning Tower of Pisa' || wonderName === 'Big Ben'
			|| wonderName === 'Statue of Liberty' || wonderName === 'Cristo Redentor'
			|| wonderName === 'Sydney Opera House' || wonderName === 'United Nations') {
			gameService.productionMultiplier *= 1.5;
		}

		if (wonderName === 'Stonehenge' || wonderName === 'Oracle'
			|| wonderName === 'Machu Pichu' || wonderName === 'Sistine Chapel'
			|| wonderName === 'Porcelain Tower' || wonderName === 'The Louvre'
			|| wonderName === 'Broadway' || wonderName === 'CN Tower'
			|| wonderName === 'Apollo Program' || wonderName === 'International Space Station') {
			gameService.scienceMultiplier *= 1.5;
		}

		if (wonderName === 'Great Wall' || wonderName === 'Forbidden Palace'
			|| wonderName === 'Brandenburg Gate' || wonderName === 'Red Fort'
			|| wonderName === 'Himeji Castle' || wonderName === 'The Kremlin'
			|| wonderName === 'Manhattan Project' || wonderName === 'The Pentagon') {
			gameService.damageMultiplier *= 1.5;
		}

		if (wonderName === 'Earth Defense Grid') {
			gameService.damageMultiplier *= 5.0;
		}
	};

	return service;
});