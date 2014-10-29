/*global $:false */

'use strict';
angular.module('game', [ 'ui.router'])  
  .config(function($stateProvider) {
    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'scripts/app/home.html'
      })
      .state('game', {
        url: '/game',
        templateUrl: 'scripts/app/game.html',
        resolve: {
          
        },
        controller: function ($scope) {
            
        }
      })
      .state('game.buildings', {
        url: '/buildings',
        templateUrl: 'scripts/app/buildings.html'
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
      })
      ;
  })
  .controller('MainCtrl', function($scope, $state) {

  });
