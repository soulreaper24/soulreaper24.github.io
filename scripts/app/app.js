'use strict';

angular.module('civweb', ['ui.router'])
    .controller('MainCtrl', function ($scope, $state) {        
        $scope.test = 'Hello world';
});