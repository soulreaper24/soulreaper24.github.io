'use strict';

angular.module('game')  
.service('LogService', function($filter) {
	var MAX_MESSAGES  = 100;

	var service = {logMessages : []};

	service.getLog = function() {
		var logMsg = '';
		for (var i = 0; i < service.logMessages.length; i++) {
			logMsg += service.logMessages[i] + '<br/>';
		}
		return logMsg;
	}	

	service.log = function(msg) {
		if (service.logMessages.length > MAX_MESSAGES) {			
			service.logMessages.splice(0, 1);
		}	
		service.logMessages.push('[' + $filter('date')(new Date(), 'HH:mm:ss') + '] ' + msg);	
	};

	service.logAlert = function(msg) {
		msg = '<span class="red">' + msg + '</span>';
		service.log(msg);
	};

	service.logSuccess = function(msg) {
		msg = '<span class="green">' + msg + '</span>';
		service.log(msg);
	};

	return service;
});