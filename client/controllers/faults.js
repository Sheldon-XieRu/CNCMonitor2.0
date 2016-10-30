var myApp = angular.module('myApp');

myApp.controller('FaultsController',['$scope','$http','$location','$routeParams','$interval',function ($scope,$http,$location,$routeParams,$interval) {
	console.log('FaultsController loaded');

	$scope.getFaults = function () {
		$http.get('api/faults').success(function (response) {
			console.log(response);
			$scope.faults = response;
		});
	}

	$scope.getFault = function () {
		var id = $routeParams.id;

		$http.get('api/faults/' + id).success(function (response) {
			$scope.fault = response;
		});
	}


	$scope.addFault = function () {

		$http.post('api/faults/',$scope.fault).success(function (response) {
			window.location.href='#/faults';
		});
	}


	$scope.updateFault = function () {
		var id = $routeParams.id;

		$http.put('api/faults/'+id,$scope.fault).success(function (response) {
			window.location.href='#/faults';
		});
	}

	$scope.removeFault = function (id) {
		$http.delete('api/faults/'+id).success(function (response) {
			window.location.href = '#/faults'
		});
	}
	$scope.isCollapsed = true;


	$scope.dataReceiving = false;
	//获取传感器数据
    var requestData = function () {
        $http.get('/datalist').success(function (response) {
            if (response.length > 0){
                console.log("I get the data");
                $scope.dataReceiving = true;

                refreshChart(response);
            }else {
                $scope.dataReceiving = false;
            }


        });
    }

    $interval(function () {
        requestData();
    },5000);
    // requestData();

    $(".form_datetime").datetimepicker({
        format: "yyyy-mm-dd",
        autoclose: true,
        todayBtn: true,
        todayHighlight: true,
        showMeridian: true,
        pickerPosition: "bottom-left",
        language: 'zh-CN',//中文，需要引用zh-CN.js包
        startView: 2,//月视图
        minView: 2//日期时间选择器所能够提供的最精确的时间选择视图
    });


    var refreshChart = function (data) {
        $(function () {
            $('#container2').highcharts({
                chart: {
                    zoomType: 'x'
                },
                title: {
                    text: '实时数据频域图'
                },
                // subtitle: {
                //     text: document.ontouchstart === undefined ?
                //         'Click and drag in the plot area to zoom in' :
                //         'Pinch the chart to zoom in'
                // },
                xAxis: {
                    // type: 'datetime',
                    minRange: 11024  // fourteen days
                },
                yAxis: {
                    title: {
                        text: '幅值'
                    }
                    // minRange: 1e-5
                },
                legend: {
                    enabled: false
                },
                plotOptions: {
                    area: {
                        fillColor: {
                            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
                            stops: [
                                [0, Highcharts.getOptions().colors[0]],
                                [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                            ]
                        },
                        marker: {
                            radius: 2
                        },
                        lineWidth: 1,
                        states: {
                            hover: {
                                lineWidth: 1
                            }
                        },
                        threshold: null
                    }
                },
                series: [{
                    type: 'area',
                    name: '幅值',
                    pointInterval: 1,
                    pointStart: 0,
                    data: data
                }]
            });
        });
    }
	// $scope.reverse = function () {
	// 	console.log("reverse");
	// 	$scope.isCollapsed = !$scope.isCollapsed;
	// 	console.log($scope.isCollapsed);
	// }

}]);
