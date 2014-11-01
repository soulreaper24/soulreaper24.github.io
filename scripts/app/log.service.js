'use strict';

angular.module('game')  
.service('LogService', function($filter) {
	var MAX_MESSAGES  = 50;

	var service = {logMessages : []};

	service.getLog = function() {
		var logMsg = '';
		for (var i = 0; i < service.logMessages.length; i++) {
			logMsg += '[' + $filter('date')(new Date(), 'dd-MM-yyyy hh:mm:ss') + '] ' + service.logMessages[i] + '<br/>';
		}
		return logMsg;
	}	

	service.log = function(msg) {
		if (service.logMessages.length > MAX_MESSAGES) {			
			service.logMessages.splice(0, 1);
		}	
		service.logMessages.push(msg);	
	};

	service.logAlert = function(msg) {
		msg = '<span class="red">' + msg + '</span>';
		service.log(msg);
	};

	return service;
});