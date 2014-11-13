'use strict';

angular.module('game')  
.controller('GameCtrl', function ($scope, $state, $location, $route, $modal, GameService, CombatService, LogService, DebugService, ChanceService,
  availableBuildings, availableTechs, availableWonders, availableUnits, aliens) {
    $scope.getDebug = function() { return GameService.debug;};
    $scope.totalProd = function (){ return GameService.totalProd;};
    $scope.totalSci = function (){ return GameService.totalSci;};

    if (availableBuildings.data) {
      GameService.setAvailableBuildings(availableBuildings.data.buildings);
    };

    if (availableTechs.data) {
      GameService.data.availableTechs = availableTechs.data.techs;
    };

    if (availableWonders.data) {
      GameService.data.availableWonders = availableWonders.data.wonders;
    };

    if (availableUnits.data) {
      GameService.setAvailableUnits(availableUnits.data.units);
    };

    if (aliens.data) {
      GameService.data.aliens = aliens.data.aliens;
    };

    if (GameService.debug) {
      DebugService.setDebugAge(7);
    }
    
    $scope.getStateName = function() {
      return $state.$current.name;
    };

    $scope.getNumTurns = function() {
      return GameService.data.turnsSinceAlienInvaded;
    };

    $scope.getYearNum = function() {
      return GameService.data.year;
    };

    $scope.getYear = function() {
      if (GameService.data.year < 0) {
        return (0 - GameService.data.year) + 'BC';
      } else {
        return GameService.data.year + 'AD';
      }
    };

    $scope.getAge = function() {
      return GameService.getAgeName(GameService.data.age);
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

    var increaseAlienStrength = function() {
      var i, multiplier = GameService.data.GROWTH_COEFF;

      for (i = 0; i < GameService.data.aliens.length; i++) {
        GameService.data.aliens[i].baseCount = Math.ceil(ChanceService.getRandomInRange(GameService.data.aliens[i].baseCount * multiplier * 0.9, GameService.data.aliens[i].baseCount * multiplier * 1.1));
        if (!ChanceService.smallChance()) {
          GameService.data.aliens[i].count = GameService.data.aliens[i].baseCount;
        } else {
          GameService.data.aliens[i].count = 10;
        }
      }

      if (GameService.data.turnsSinceAlienInvaded % 15 === 0) {
        for (i = 0; i < GameService.data.aliens.length; i++) {
          GameService.data.aliens[i].hp = Math.ceil(multiplier * GameService.data.aliens[i].hp);
        }
      }

      if (GameService.data.turnsSinceAlienInvaded % 15 === 5) {
        for (i = 0; i < GameService.data.aliens.length; i++) {
          GameService.data.aliens[i].damage = Math.ceil(multiplier * GameService.data.aliens[i].damage); 
        }
      }

      if (GameService.data.turnsSinceAlienInvaded === 10) {
        GameService.data.aliens[0].name = 'Evolved Zergling';
        GameService.data.aliens[0].trait = 'First Strike';
      }

      if (GameService.data.turnsSinceAlienInvaded === 20) {
        GameService.data.aliens[1].name = 'Evolved Hydralisk';
        GameService.data.aliens[1].trait = 'Splash Damage';
      }

      if (GameService.data.turnsSinceAlienInvaded === 35) {
        GameService.data.aliens[2].name = 'Evolved Ultralisk';
        GameService.data.aliens[2].trait = undefined;
      }
    };

    $scope.endTurn = function() {
      GameService.endTurn();
      if (GameService.data.age < 8 && GameService.numberOfAvailableTechs() === 0) {
        $scope.openNewAgeModal();
      }

      if (GameService.data.age === 8) {
          GameService.data.turnsSinceAlienInvaded++;
          if (GameService.data.turnsSinceAlienInvaded === 10) {
            GameService.data.won = true;
            $scope.openGameEndModal();
          }

          if (GameService.data.turnsSinceAlienInvaded > 0) {
            if (!CombatService.conquest(GameService.data.availableUnits, GameService.data.damageMultiplier, GameService.data.hpMultiplier, GameService.data.aliens)) {
              LogService.logAlert('Your army failed to defend Earth against a wave of Alien invasion. Earth is lost...');
              GameService.data.won = false;
              $scope.openGameEndModal();
            } else {
              LogService.logSuccess('Your army successfully defended Earth against a wave of Alien invasion. Their forces grow stronger.');
              increaseAlienStrength();
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
              $scope.nextAge = GameService.getAgeName(GameService.data.age + 1);
              $scope.unit = GameService.data.availableUnits[GameService.data.age + 2];
              $scope.enemyName = GameService.data.availableUnits[GameService.data.age + 1].name;

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
                  if (GameService.data.age === 7) {
                    GameService.data.turnsSinceAlienInvaded = -2;
                    GameService.save = angular.copy(GameService.data);           
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
            controller: function ($scope, $state, $modalInstance, GameService) {
                $scope.turns = GameService.data.turnsSinceAlienInvaded;
                $scope.won = GameService.data.won;

                $scope.load = function() {
                    GameService.data = angular.copy(GameService.save);
                    if (GameService.data.year < 2000) {
                      GameService.data.year -= 2;
                    } else {
                      GameService.data.year -= 1;
                    }
                    GameService.setProduction(GameService.getProduction() - GameService.getProductionPerTurn());
                    GameService.setScience(GameService.getScience() - GameService.getSciencePerTurn());

                    $scope.cancel();                    
                };

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
