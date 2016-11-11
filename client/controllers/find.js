var myApp = angular.module('myApp');

myApp.controller('FindController',['$scope','$http',function ($scope,$http) {

	console.log('FindController is loaded');



	$scope.findWithDate = function () {
		$http.get('api/findFaultsWithDate/'+$scope.begin_date + '/' + $scope.end_date).success(function (response) {
			$scope.faults = response;
		});
	};


	$('.form_date').datetimepicker({
        language:  'zh-CN',
        format: 'yyyy-MM-dd',
        weekStart: 1,
        todayBtn:  1,
        autoclose: 1,
        todayHighlight: 1,
        startView: 2,
        minView: 2,
        forceParse: 1
    });
}])