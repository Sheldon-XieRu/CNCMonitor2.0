var myApp = angular.module('myApp');

myApp.controller('FaultsController',['$scope','$http','$location','$routeParams','$interval','$window',function ($scope,$http,$location,$routeParams,$interval,$window) {
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

        $scope.fault.imageName = $scope.imageName;

		$http.post('api/faults/',$scope.fault).success(function (response) {
			window.location.href='#/faults';
		});
	}


	$scope.updateFault = function () {
		var id = $routeParams.id;
        $scope.fault.imageName = $scope.imageName;

		$http.put('api/faults/'+id,$scope.fault).success(function (response) {
			window.location.href='#/faults';
		});
	}

	$scope.removeFault = function (id) {
		$http.delete('api/faults/'+id).success(function (response) {
			window.location.href = '#/faults';
            window.location.reload();
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



$scope.imageName = '';

    $scope.save = function() {    
        var fd = new FormData();
        var file = document.querySelector('input[type=file]').files[0];
        fd.append('logo', file); 
         $http({
              method:'POST',
              url:"/file-upload",
              data: fd,
              headers: {'Content-Type':undefined},
              transformRequest: angular.identity 
               })   
              .success( function ( response )
                       {
                       //上传成功的操作
                       console.log(response.logo.name);
                       $scope.imageName =  response.logo.name;
                       alert("上传成功");
                       }); 

     
    };










}]);
