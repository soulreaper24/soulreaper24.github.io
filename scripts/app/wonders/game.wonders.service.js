'use strict';

angular.module('game')  
.service('WondersService', function() {	
	var service = {numAge8Wonders: 1};

	service.setWonderBuilt = function(gameService, wonder) {
		var wonderName = wonder.name;
		if (wonderName !== 'Global Defense Grid') {
			gameService.data.wonders.push(wonderName);
		} else {
			var tempWonder = angular.copy(wonder);
			tempWonder.name = wonderName + ' ' + service.numAge8Wonders;
			gameService.data.availableWonders.push(tempWonder);
			gameService.data.wonders.push(wonderName + ' ' + service.numAge8Wonders);
			service.numAge8Wonders++;
		}

		if (wonderName === 'Pyramids' || wonderName === 'Hanging Gardens'
			|| wonderName === 'Angkor Wat' || wonderName === 'Taj Mahal'
			|| wonderName === 'Leaning Tower of Pisa' || wonderName === 'Big Ben'
			|| wonderName === 'Statue of Liberty' || wonderName === 'Cristo Redentor'
			|| wonderName === 'Sydney Opera House' || wonderName === 'United Nations') {
			gameService.data.productionMultiplier *= 1.2;
		}

		if (wonderName === 'Stonehenge' || wonderName === 'Oracle'
			|| wonderName === 'Machu Pichu' || wonderName === 'Sistine Chapel'
			|| wonderName === 'Porcelain Tower' || wonderName === 'The Louvre'
			|| wonderName === 'Broadway' || wonderName === 'CN Tower'
			|| wonderName === 'Apollo Program' || wonderName === 'International Space Station') {
			gameService.data.scienceMultiplier *= 1.2;
		}

		if (wonderName === 'Great Wall' || wonderName === 'Forbidden Palace'
			|| wonderName === 'Brandenburg Gate' || wonderName === 'Red Fort'
			|| wonderName === 'Himeji Castle' || wonderName === 'The Kremlin'
			|| wonderName === 'Manhattan Project' || wonderName === 'The Pentagon') {
			gameService.data.hpMultiplier *= 1.1;
		}

		if (wonderName === 'Global Defense Grid') {
			gameService.data.hpMultiplier *= 1.05;
			var wonder = gameService.findWonderWithName('Global Defense Grid');
			wonder.lossPerTurn = Math.ceil(wonder.lossPerTurn * gameService.data.GROWTH_COEFF);
		}
	};

	return service;
});