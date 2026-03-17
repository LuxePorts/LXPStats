'use strict';

/* Init Angular App */

var netStatsApp = angular.module('netStatsApp', ['netStatsApp.filters', 'netStatsApp.directives', 'ngStorage']);


/* Services */

netStatsApp.factory('socket', function ($rootScope) {
	var socket = new Primus();
	return socket;
});

netStatsApp.factory('toastr', function ($rootScope) {
	toastr = window.toastr;
	toastr.options = {
		"closeButton": false,
		"debug": false,
		"progressBar": false,
		"newestOnTop": true,
		"positionClass": "toast-top-right",
		"preventDuplicates": false,
		"onclick": null,
		"showDuration": "300",
		"hideDuration": "1000",
		"timeOut": "5000",
		"extendedTimeOut": "1000",
		"showEasing": "swing",
		"hideEasing": "linear",
		"showMethod": "fadeIn",
		"hideMethod": "fadeOut"
	};
	return toastr;
});

netStatsApp.factory('_', function ($rootScope) {
	var lodash = window._;
	return lodash;
});

/* Theme Controller */
netStatsApp.controller('ThemeCtrl', function($scope, $localStorage) {
	// Check for saved preference or system preference
	if(typeof $localStorage.isLightTheme === 'undefined') {
		// Check system preference
		var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
		$localStorage.isLightTheme = !prefersDark;
	}
	
	$scope.isLightTheme = $localStorage.isLightTheme;
	
	// Apply theme to parent scope
	$scope.$parent.isLightTheme = $scope.isLightTheme;
	
	$scope.toggleTheme = function() {
		$scope.isLightTheme = !$scope.isLightTheme;
		$localStorage.isLightTheme = $scope.isLightTheme;
		$scope.$parent.isLightTheme = $scope.isLightTheme;
	};
});
