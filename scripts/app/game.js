'use strict';

angular.module('game')  
.controller('GameCtrl', function ($scope, GameService) {
    $scope.getProduction = function() {
      return GameService.getProduction();
    }

    $scope.science = GameService.science;
    
  }
)
.config(function($stateProvider) {
  $stateProvider      
    .state('game', {
      url: '/game',
      templateUrl: 'scripts/app/game.html',      
      controller: 'GameCtrl'
    })
    .state('game.buildings', {
      url: '/buildings',
      templateUrl: 'scripts/app/buildings.html',
      resolve: {
        availableBuildings : function($q, $http) {
          var defer = $q.defer();
          return $http.get('scripts/app/buildings.json').success (function(data){
            defer.resolve(data.buildings);
          });
          return defer.promise;
        }
      },
      controller : function($scope, GameService, availableBuildings) {
        $scope.availableBuildings = availableBuildings.data.buildings;
        $scope.getProduction = function() {
          return GameService.getProduction();
        }

        $scope.buy = function(building) {
          GameService.setProduction(GameService.getProduction() - building.cost);
          building.cost *= 2;
        }
      }
    })
    .state('game.wonders', {
      url: '/wonders',
      templateUrl: 'scripts/app/wonders.html'
    })
    .state('game.techs', {
      url: '/techs',
      templateUrl: 'scripts/app/techs.html'
    })
    .state('game.units', {
      url: '/units',
      templateUrl: 'scripts/app/units.html'
    });
});
