'use strict';

angular.module('game')  
.service('TechsService', function() {	
	var service = {};

	service.setTechResearched = function(gameService, tech) {
		var techName = tech.name;
		gameService.data.techs.push(techName);

		if (techName === 'Mining' || techName === 'Bronze Works') {
			gameService.findBuildingWithName('Mine').multiplier *= 2;
		}
		if (techName === 'Writing' || techName === 'Calendar') {
			gameService.findBuildingWithName('Library').multiplier *= 2;
		}

		if (techName === 'Engineering' || techName === 'Iron Works') {
			gameService.findBuildingWithName('Workshop').multiplier *= 2;
		}
		if (techName === 'Philosophy' || techName === 'Drama & Poetry') {
			gameService.findBuildingWithName('Temple').multiplier *= 2;
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
		if (techName === 'Scientific Theory' || techName === 'Biology') {
			gameService.findBuildingWithName('Public School').multiplier *= 2;
		}

		if (techName === 'Replaceable Parts' || techName === 'Plastic') {
			gameService.findBuildingWithName('Assembly Line').multiplier *= 2;
		}
		if (techName === 'Combustion' || techName === 'Plastic') {
			gameService.findBuildingWithName('Research Lab').multiplier *= 2;
		}

		if (techName === 'Atomic Theory' || techName === 'Nuclear Fission') {
			gameService.findBuildingWithName('Nuclear Plant').multiplier *= 2;
		}
		if (techName === 'Penicillin' || techName === 'Ecology') {
			gameService.findBuildingWithName('Medical Lab').multiplier *= 2;
		}

		if (techName === 'Robotics' || techName === 'Globalization') {
			gameService.findBuildingWithName('Robotic Factory').multiplier *= 2;
		}
		if (techName === 'Nanotechnology' || techName === 'Lasers') {
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
			|| techName === 'Electricity' || techName === 'Railroad' 
			|| techName === 'Computers' || techName === 'The Internet') {
			gameService.data.productionMultiplier *= 1.1;
		}

		if (techName === 'Mathematics' || techName === 'Physics'
			|| techName === 'Chemistry' || techName === 'Archaeology' 
			|| techName === 'Radio' || techName === 'Radar' 
			|| techName === 'Flight' || techName === 'Refrigeration'
			|| techName === 'Particle Physics'
			|| techName === 'Telecommunications' || techName === 'Satellites') {
			gameService.data.scienceMultiplier *= 1.1;
		}

		if (techName === 'Chivalry' || techName === 'Metallurgy'
			|| techName === 'Gunpowder' || techName === 'Military Science'
			|| techName === 'Rifling' || techName === 'Dynamite'
			|| techName === 'Combustion' || techName === 'Ballistics'
			|| techName === 'Rocketry' || techName === 'Nuclear Fission'
			|| techName === 'Combined Arms' || techName === 'Mobile Tactics'
			|| techName === 'Advanced Ballistics' || techName === 'Stealth') {
			gameService.data.damageMultiplier *= 1.1;
		}

		if (techName.indexOf('Neosteel Weapon') === 0) {
			gameService.data.damageMultiplier *= 1.1;
		}

		if (techName.indexOf('Neosteel Armor') === 0) {
			gameService.data.hpMultiplier *= 1.1;
		}

		if (techName === 'Punisher Missiles') {
			gameService.findUnitWithName('Thor').trait = 'Splash Damage';
		}

		if (techName === 'Warp Drive') {
			gameService.findUnitWithName('Battlecruiser').trait = undefined;	
		}

		if (techName.indexOf('Reactor Core') === 0) {
			gameService.findUnitWithName('Space Marine').cost = Math.ceil(gameService.findUnitWithName('Space Marine').cost * 0.9);
			gameService.findUnitWithName('Reaper').cost = Math.ceil(gameService.findUnitWithName('Reaper').cost * 0.9);
			gameService.findUnitWithName('Thor').cost = Math.ceil(gameService.findUnitWithName('Thor').cost * 0.9);
			gameService.findUnitWithName('Battlecruiser').cost = Math.ceil(gameService.findUnitWithName('Battlecruiser').cost * 0.9);
		}

		if (techName.indexOf('Fusion Core') === 0) {
			gameService.findUnitWithName('Space Marine').cost = Math.ceil(gameService.findUnitWithName('Space Marine').cost * 0.85);
			gameService.findUnitWithName('Reaper').cost = Math.ceil(gameService.findUnitWithName('Reaper').cost * 0.85);
			gameService.findUnitWithName('Thor').cost = Math.ceil(gameService.findUnitWithName('Thor').cost * 0.85);
			gameService.findUnitWithName('Battlecruiser').cost = Math.ceil(gameService.findUnitWithName('Battlecruiser').cost * 0.85);
		}
	};

	return service;
});