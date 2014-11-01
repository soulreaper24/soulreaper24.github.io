'use strict';

angular.module('game', [ 'ui.router', 'mm.foundation'])  
  .config(function($stateProvider) {
    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'scripts/app/home.html'
      });
  })
  .controller('MainCtrl', function($scope, $state) {

  });
