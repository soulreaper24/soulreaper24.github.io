'use strict';

angular.module('game')  
.controller('GameCtrl', function ($scope, $state, $modal, GameService, LogService, availableBuildings, availableTechs, availableWonders, availableUnits) {   
    if (availableBuildings.data) {
      GameService.setAvailableBuildings(availableBuildings.data.buildings);
    }

    if (availableTechs.data) {
      GameService.availableTechs = availableTechs.data.techs;
    }

    if (availableWonders.data) {
      GameService.availableWonders = availableWonders.data.wonders;
    }

    if (availableUnits.data) {
      GameService.setAvailableUnits(availableUnits.data.units);
    }

    $scope.getStateName = function() {
      return $state.$current.name;
    };

    $scope.getYear = function() {
      if (GameService.year < 0) {
        return (0 - GameService.year) + 'BC';
      } else {
        return GameService.year + 'AD';
      }
    };

    $scope.getAge = function() {
      return GameService.getAgeName(GameService.age);
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

    var numberOfAvailableTechs = function() {
      var count = 0;
      for (var i = 0; i < GameService.availableTechs.length; i++) {
        if (GameService.availableTechs[i].age <= GameService.age) {
          count ++;
        }
      }
      return count - GameService.techs.length;
    }

    $scope.endTurn = function() {
      GameService.endTurn();
      if (numberOfAvailableTechs() === 0) {
        $scope.openModal();
      }
    };

    $scope.openModal = function () {        
        var modalInstance = $modal.open({
            templateUrl: 'scripts/app/newAge.html',
            controller: function ($scope, $modalInstance, GameService) {
              $scope.options = {production: false, science: false, units: false};
              $scope.nextAge = GameService.getAgeName(GameService.age + 1);
              $scope.unitName = GameService.availableUnits[GameService.age + 2].name;
              $scope.enemyName = GameService.availableUnits[GameService.age + 1].name;

              $scope.ok = function () {
                  $modalInstance.close($scope.options);
              };

              $scope.cancel = function () {
                  $modalInstance.dismiss('cancel');
              };
            }
        });

        modalInstance.result.then(function (options) {
            GameService.newAge(options);
        });
    };
  }
)
.config(function($stateProvider) {
  $stateProvider      
    .state('game', {
      url: '/game',
      templateUrl: 'scripts/app/game.html',      
      resolve: {
        availableBuildings : function($q, $http) {
            var defer = $q.defer();
            return $http.get('scripts/app/buildings/buildings.json').success (function(data){
              defer.resolve(data.buildings);
            });
            return defer.promise;
        },
        availableTechs : function($q, $http) {
            var defer = $q.defer();
            return $http.get('scripts/app/techs/techs.json').success (function(data){
              defer.resolve(data);
            });
            return defer.promise;
        },
        availableWonders : function($q, $http) {            
            var defer = $q.defer();
            return $http.get('scripts/app/wonders/wonders.json').success (function(data){
              defer.resolve(data);
            });
            return defer.promise;          
        },
        availableUnits : function($q, $http) {            
            var defer = $q.defer();
            return $http.get('scripts/app/units/units.json').success (function(data){
              defer.resolve(data);
            });
            return defer.promise;          
        }
      },
      controller: 'GameCtrl'
    }).state('game.log', {
      url: '/log',
      templateUrl: 'scripts/app/log.html',
      controller: function($scope, LogService) {
        $scope.getLog = function() {
          return LogService.getLog();
        };
      }
    });
});
