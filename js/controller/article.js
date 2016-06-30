/**
 * Created by jiangzhuang on 5/5/16.
 */

var articleCtrl = angular.module('articleCtrl', []);

articleCtrl.controller('ArticleListCtrl', function ($http, $scope, $rootScope, $location) {

	 $scope.list = function (pageNo, pageSize) {
         var m_params = {
             userId: $rootScope.login_user.userId,
             token: $rootScope.getAccountInfoKeyValue("token"),
             pageNo:pageNo,
             pageSize:pageSize
         };
        $http({
            url: api_uri+"financialProduct/list",
            method: "GET",
            params: m_params
        }).success(function (d) {
        	console.log(d);
            if (d.returnCode == 0) {
                $scope.result_list = d.result.datas;
				console.log($scope.result_list);
            }
            else {
                console.log(d.result);
            }

        }).error(function (d) {
            console.log("login error");
            $location.path("/error");
        })
    };

    $scope.list(1,10);
    $scope.result_list = {
		result:{},
        returnCode:0

    };
	/*var totalHeight = 0;     //定义一个总的高度变量
	function load()
	{
		totalHeight = parseFloat($(window).height()) + parseFloat($(window).scrollTop());     //浏览器的高度加上滚动条的高度

		if ($(document).height() <= totalHeight)     //当文档的高度小于或者等于总的高度的时候，开始动态加载数据
		{
			//加载数据
			var i = i+1;
			$scope.list(i,10);
		}
	}

	$(window).scroll( function() {
		console.log("滚动条到顶部的垂直高度: "+$(document).scrollTop());
		console.log("页面的文档高度 ："+$(document).height());
		console.log('浏览器的高度：'+$(window).height());
		load();
	});*/
	$scope.article_show = function (id) {
		if (!isNullOrEmpty(id)) {
			$location.path("/article/show/" + id);
		}
	};
});

articleCtrl.controller('ArticleShowCtrl', function ($http, $scope, $rootScope, $location, $routeParams) {

	$scope.init = function () {
		$scope.bt_show = 0;
		$http({
			url: api_uri + "financialProduct/detail/" + $routeParams.id,
			method: "GET",
			params: $rootScope.login_user
		}).success(function (d) {
			console.log(d);
			if (d.returnCode == 0) {
				$scope.article_detail = d.result;
				$scope.feature_list = d.result.feature;
				$scope.apply_List = d.result.conditions;
				$scope.id = d.result.id;
				$scope.article_detail.ratecap = parseInt($scope.article_detail.ratecap);
				$scope.article_detail.ratefloor = parseInt($scope.article_detail.ratefloor);
			}else {
				console.log(d);
			}
		}).error(function (d) {
			console.log("login error");
			//$location.path("/error");
		});
	};
	$scope.init();
	$scope.apply = function (id) {
		if (!isNullOrEmpty(id)) {
			$location.path("/article/apply/"+ id);
		}
	};
 /*  $scope.apply =function(){
       $location.path("/article/apply/");
   }
*/
});

articleCtrl.controller('applyCtrl', function ($http, $scope, $rootScope, $location, $timeout,$routeParams) {
	$scope.init = function () {
		//获取用户信息
		$http({
			url: api_uri + "user/setting",
			method: "GET",
			params: $rootScope.login_user
		}).success(function (d) {
			console.log(d);
			if (d.returnCode == 0) {
				//$scope.user = d.result;
				$scope.company = d.result;
			} else {
				console.log(d);
			}
		}).error(function (d) {
			console.log(d);
		});
	};
		$scope.init();
	$scope.submit = function () {
		var m_params = {
			userId: $rootScope.login_user.userId,
			token: $rootScope.login_user.token,
			companyName:$scope.company.companyName,
			linkman:$scope.company.name,
			mobile:$scope.company.mobile,
			productId:$routeParams.id
		};
		console.log(m_params.productId +"baiyang");
		$.ajax({
			type: 'POST',
			url: api_uri + "loanApplication/create",
			data: m_params,
			traditional: true,
			success: function (data, textStatus, jqXHR) {
				 console.log(data);
				if (data.returnCode == 0) {
					//$scope.get_telesales_detail();
					$(".alertApply").css("display","block");
					$timeout(function() {
						$(".alertApply").css("display","none");
						$location.path("/user/center/");
					}, 3000);
					$scope.$apply();
				}
				else {
					// console.log(data);
				}
			},
			dataType: 'json',
		});

	};

});