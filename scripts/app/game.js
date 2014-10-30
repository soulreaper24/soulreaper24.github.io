'use strict';

angular.module('game')  
.controller('GameCtrl', function ($scope, GameService) {
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
      controller: 'GameCtrl'
    })    
    .state('game.wonders', {
      url: '/wonders',
      templateUrl: 'scripts/app/wonders.html'
    })
    .state('game.units', {
      url: '/units',
      templateUrl: 'scripts/app/units.html'
    });
});
