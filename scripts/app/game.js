'use strict';

angular.module('game')  
.controller('GameCtrl', function ($scope, GameService, availableBuildings, availableTechs, availableWonders) {
    if (availableBuildings.data) {
      GameService.setAvailableBuildings(availableBuildings.data.buildings);
    }
    if (availableTechs.data) {
      GameService.availableTechs = availableTechs.data.techs;
    }
    if (availableWonders.data) {
      GameService.availableWonders = availableWonders.data.wonders;
    }
    $scope.getYear = function() {
      if (GameService.year < 0) {
        return (0 - GameService.year) + 'BC';
      } else {
        return GameService.year + 'AD';
      }
    };

    $scope.getProduction = function() {
      return GameService.getProduction();
    };

    $scope.getProductionPerTurn = function() {
      return GameService.getProductionPerTurn();
    };

    $scope.getScience = function() {
      return GameService.getScience();
    };

    $scope.getSciencePerTurn = function() {
      return GameService.getSciencePerTurn();
    };

    $scope.endTurn = function() {
      GameService.setScience(GameService.getScience() + GameService.getSciencePerTurn());
      GameService.setProduction(GameService.getProduction() + GameService.getProductionPerTurn());
      GameService.year += 4;
    };
  }
)
.config(function($stateProvider) {
  $stateProvider      
    .state('game', {
      url: '/game',
      templateUrl: 'scripts/app/game.html',      
      resolve: {
        availableBuildings : function($q, $http, GameService) {
            if (!GameService.availableBuildings) {
              var defer = $q.defer();
              return $http.get('scripts/app/buildings/buildings.json').success (function(data){
                defer.resolve(data.buildings);
              });
              return defer.promise;
          } else {
            return GameService.availableBuildings;
          }
        },
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
        },
        availableWonders : function($q, $http, GameService) {
            if (!GameService.availableWonders) {
              var defer = $q.defer();
              return $http.get('scripts/app/wonders/wonders.json').success (function(data){
                defer.resolve(data);
              });
              return defer.promise;
          } else {
            return GameService.availableWonders;
          }
        }
      },
      controller: 'GameCtrl'
    })        
    .state('game.units', {
      url: '/units',
      templateUrl: 'scripts/app/units.html'
    });
});
