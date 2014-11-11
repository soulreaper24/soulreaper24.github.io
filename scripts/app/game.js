'use strict';

angular.module('game')  
.controller('GameCtrl', function ($scope, $state, $location, $route, $modal, GameService, CombatService, LogService, DebugService, 
  availableBuildings, availableTechs, availableWonders, availableUnits, aliens) {    
    $scope.totalProd = function (){ return GameService.totalProd;};
    $scope.totalSci = function (){ return GameService.totalSci;};

    if (availableBuildings.data) {
      GameService.setAvailableBuildings(availableBuildings.data.buildings);
    };

    if (availableTechs.data) {
      GameService.availableTechs = availableTechs.data.techs;
    };

    if (availableWonders.data) {
      GameService.availableWonders = availableWonders.data.wonders;
    };

    if (availableUnits.data) {
      GameService.setAvailableUnits(availableUnits.data.units);
    };

    if (aliens.data) {
      GameService.aliens = aliens.data.aliens;
    };

    //DebugService.setDebugAge(2);

    $scope.getStateName = function() {
      return $state.$current.name;
    };

    $scope.getNumTurns = function() {
      return GameService.turnsSinceAlienInvaded;
    };

    $scope.getYearNum = function() {
      return GameService.year;
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

    $scope.endTurn = function() {
      GameService.endTurn();
      if (GameService.age < 8 && GameService.numberOfAvailableTechs() === 0) {
        $scope.openNewAgeModal();
      }

      if (GameService.year === 2030 && GameService.turnsSinceAlienInvaded === -3) {
        $scope.openAlienModal();
      }

      if (GameService.age === 8 || GameService.year >= 2030) {
          GameService.turnsSinceAlienInvaded++;
          if (GameService.turnsSinceAlienInvaded === 10) {
            GameService.won = true;
            $scope.openGameEndModal();
          }

          if (GameService.turnsSinceAlienInvaded > 0) {
            if (!CombatService.conquest(GameService.availableUnits, GameService.damageMultiplier, GameService.hpMultiplier, GameService.aliens)) {
              LogService.logAlert('Your army lost.');
              GameService.won = false;
              $scope.openGameEndModal();
            } else {
              for (var i = 0; i < GameService.aliens.length; i++) {
                GameService.aliens[i].baseCount = Math.ceil(GameService.aliens[i].baseCount * GameService.GROWTH_COEFF);
                GameService.aliens[i].count = GameService.aliens[i].baseCount;
              }
            }
          }
        }
    };

    $scope.openNewAgeModal = function () {        
        var modalInstance = $modal.open({
            templateUrl: 'scripts/app/newAge.html',
            backdrop : 'static',
            controller: function ($scope, $modalInstance, GameService) {
              $scope.options = {production: false, science: false, units: false};
              $scope.nextAge = GameService.getAgeName(GameService.age + 1);
              $scope.unit = GameService.availableUnits[GameService.age + 2];
              $scope.enemyName = GameService.availableUnits[GameService.age + 1].name;

              $scope.openAlienModal = function () {        
                  var modalInstance = $modal.open({
                      templateUrl: 'scripts/app/alien.html',
                      backdrop : 'static',
                      controller: function ($scope, $modalInstance, GameService) {
                          $scope.cancel = function () {
                              $modalInstance.dismiss('cancel');
                          };
                      }
                  });
              };

              $scope.ok = function () {
                  $modalInstance.close($scope.options);
                  console.log(GameService.age);
                  if (GameService.age === 7) {
                    GameService.turnsSinceAlienInvaded = -2;
                    $scope.openAlienModal();
                  }
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

    $scope.openGameEndModal = function () {        
        var modalInstance = $modal.open({
            templateUrl: 'scripts/app/gameEnd.html',
            backdrop : 'static',
            controller: function ($scope, $modalInstance, GameService) {
                $scope.turns = GameService.turnsSinceAlienInvaded;
                $scope.won = GameService.won;

                $scope.ok = function (endless) {
                    $modalInstance.close(endless);
                };

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            }
        });

        modalInstance.result.then(function (endless) {
            if (!endless) {
                window.location = '/';
            }
        });
    };

    $scope.openAlienModal = function () {        
        var modalInstance = $modal.open({
            templateUrl: 'scripts/app/alien.html',
            backdrop : 'static',
            controller: function ($scope, $modalInstance, GameService) {
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            }
        });
    };

    $scope.getLog = function() {      
      return LogService.getLog();
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
        }, 
        aliens : function($q, $http) {            
            var defer = $q.defer();
            return $http.get('scripts/app/units/aliens.json').success (function(data){
              defer.resolve(data);
            });
            return defer.promise;          
        }
      },
      controller: 'GameCtrl'
    });
});
