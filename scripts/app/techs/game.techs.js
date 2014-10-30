'use strict';

angular.module('game')
.controller('TechsCtrl', function($scope, GameService, availableTechs) {
	GameService.availableTechs = availableTechs;
	$scope.availableTechs = availableTechs.data.techs;
	$scope.getScience = function() {
	  return GameService.getScience();
	}

	$scope.research = function(tech) {
	  GameService.setScience(GameService.getScience() - tech.cost);
	  GameService.setResearchedTech(tech.name);
	}

	$scope.notResearchedTech = function(techName) {
		return GameService.techs.indexOf(techName) > -1;
	}
})
.config(function($stateProvider) {
  $stateProvider          
    .state('game.techs', {
      url: '/techs',
      templateUrl: 'scripts/app/techs/game.techs.html',
      resolve: {
        availableTechs : function($q, $http, GameService) {
          if (!GameService.availableTechs) {
	          var defer = $q.defer();
	          return $http.get('scripts/app/techs/techs.json').success (function(data){
	            defer.resolve(data);
	          });
	          return defer.promise;
	      } else {
	      	return GameService.availableTechs;
	      }
        }
      },
      controller: 'TechsCtrl'
    });
});