var myApp = angular.module('myApp',['ngRoute']);


myApp.config(function ($routeProvider) {
	$routeProvider.when('/',{
		controller:'FaultsController',
		templateUrl:'views/faults.html',

	})

	.when('/faults',{
		controller:'FaultsController',
		templateUrl:'views/faults.html',

	})

	.when('/faults/detail/:id',{
		controller:'FaultsController',
		templateUrl:'views/fault_detail.html',

	})
	.when('/faults/add',{
		controller:'FaultsController',
		templateUrl:'views/add_fault.html',

	})
	.when('/faults/edit/:id',{
		controller:'FaultsController',
		templateUrl:'views/edit_fault.html',

	})

	.otherwise({
		redirectTo:'/'
	})
})