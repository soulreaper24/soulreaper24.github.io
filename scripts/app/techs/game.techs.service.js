'use strict';

angular.module('game')  
.service('TechsService', function() {	
	var service = {};

	service.setTechResearched = function(gameService, techName) {
		if ('Advanced Lasers Weaponry' !== techName) {
			gameService.techs.push(techName);
		}

		if (techName === 'Mining' || techName === 'Bronze Works') {
			gameService.findBuildingWithName('Mine').multiplier *= 2;
		}
		if (techName === 'Writing' || techName === 'Calendar') {
			gameService.findBuildingWithName('Library').multiplier *= 2;
		}

		if (techName === 'Engineering' || techName === 'Iron Works') {
			gameService.findBuildingWithName('Workshop').multiplier *= 2;
		}
		if (techName === 'Philosophy') {
			gameService.findBuildingWithName('Temple').multiplier *= 4;
		}

		if (techName === 'Steel Works' || techName === 'Machinery') {
			gameService.findBuildingWithName('Forge').multiplier *= 2;
		}
		if (techName === 'Education' || techName === 'Theology') {
			gameService.findBuildingWithName('University').multiplier *= 2;
		}

		if (techName === 'Architecture' || techName === 'Economics') {
			gameService.findBuildingWithName('Windmill').multiplier *= 2;
		}
		if (techName === 'Astronomy' || techName === 'Printing Press') {
			gameService.findBuildingWithName('Observatory').multiplier *= 2;
		}

		if (techName === 'Industrialization' || techName === 'Steam Power') {
			gameService.findBuildingWithName('Factory').multiplier *= 2;
		}
		if (techName === 'Scientific Theory') {
			gameService.findBuildingWithName('Public School').multiplier *= 4;
		}

		if (techName === 'Replaceable Parts' || techName === 'Plastic') {
			gameService.findBuildingWithName('Assembly Line').multiplier *= 2;
		}
		if (techName === 'Combustion' || techName === 'Plastic') {
			gameService.findBuildingWithName('Research Lab').multiplier *= 2;
		}

		if (techName === 'Atomic Theory') {
			gameService.findBuildingWithName('Nuclear Plant').multiplier *= 4;
		}
		if (techName === 'Penicillin' || techName === 'Ecology') {
			gameService.findBuildingWithName('Medical Lab').multiplier *= 2;
		}

		if (techName === 'Robotics' || techName === 'Globalization') {
			gameService.findBuildingWithName('Robotic Factory').multiplier *= 2;
		}
		if (techName === 'Nanotechnology' || techName === 'Globalization') {
			gameService.findBuildingWithName('Biotech Lab').multiplier *= 2;
		}

		if (techName === 'Sentient AI') {
			gameService.findBuildingWithName('Biofactory').multiplier *= 4;
		}
		if (techName === 'Genetic Engineering') {
			gameService.findBuildingWithName('Genetics Lab').multiplier *= 4;
		}		

		if (techName === 'Agriculture' || techName === 'Animal Husbandry'
			|| techName === 'Currency' || techName === 'Metal Casting'
			|| techName === 'Banking' || techName === 'Fertilizer'
			|| techName === 'Electricity' || techName === 'Refrigeration'
			|| techName === 'Railroad' || techName === 'Eletronics'
			|| techName === 'Flight' || techName === 'Computers'
			|| techName === 'The Internet') {
			gameService.productionMultiplier *= 1.2;
		}

		if (techName === 'Mathematics' || techName === 'Physics'
			|| techName === 'Chemistry' || techName === 'Biology'
			|| techName === 'Electricity' || techName === 'Eletronics'
			|| techName === 'Flight' || techName === 'Computers'
			|| techName === 'Radar' || techName === 'Nuclear Fission'
			|| techName === 'The Internet' || techName === 'Particle Physics'
			|| techName === 'Telecommunications' || techName === 'Satellites'
			|| techName === 'Lasers') {
			gameService.scienceMultiplier *= 1.2;
		}

		if (techName === 'Chivalry' || techName === 'Metallurgy'
			|| techName === 'Gunpowder' || techName === 'Military Science'
			|| techName === 'Rifling' || techName === 'Dynamite'
			|| techName === 'Combustion' || techName === 'Ballistics'
			|| techName === 'Rocketry' || techName === 'Nuclear Fission'
			|| techName === 'Combined Arms' || techName === 'Nuclear Fission') {
			gameService.damageMultiplier *= 1.2;
		}

		if (techName === 'Advanced Lasers Weaponry') {
			gameService.damageMultiplier *= 1.5;	
		}
	};

	return service;
});