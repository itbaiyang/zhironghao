
var articleCtrl = angular.module('articleCtrl', []);

articleCtrl.controller('ArticleListCtrl', function ($http, $scope, $rootScope, $location) {
	 $scope.init = function(){
		 $scope.shareData = {
			 title: '直融号',
			 desc: '打造企业最低融资成本',
			 link: $rootScope.url_prefix + "#/article/list",
			 imgUrl: $rootScope.url_prefix + '/img/share.png'
		 };
		 wx.ready(function () {
			 console.log("wx share ------");
			 wx.onMenuShareAppMessage($scope.shareData);
			 wx.onMenuShareTimeline($scope.shareData);
			 wx.onMenuShareQQ($scope.shareData);
			 wx.onMenuShareWeibo($scope.shareData);
		 });
	 };

	$scope.init();
	var result_list =[];
	 $scope.list = function (pageNo, pageSize) {
         var m_params = {
             userId: $rootScope.login_user.userId,
             token: $rootScope.login_user.token,
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
				result_list =result_list.concat(d.result.datas);
				$scope.result_list = result_list;
				$scope.result_list = result_list;
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
	$scope.totalHeight = 0;
	$scope.load = function()
	{
		$scope.totalHeight = parseFloat($(window).height()) + parseFloat($(window).scrollTop());     //浏览器的高度加上滚动条的高度
		if ($(document).height() <= $scope.totalHeight)     //当文档的高度小于或者等于总的高度的时候，开始动态加载数据
		{
			$scope.list($scope.nextPage, 10);
			//$scope.$apply();
			console.log($scope.nextPage);

			//$scope.big = 1 + $scope.big;
		}

	};
	angular.element(window).scroll( function() {
		if($scope.pageNo*10 <$scope.totalCount){
			$scope.load();
		}else{
			//console.log("daotoule");
		}
	});
	$scope.article_show = function (id) {
		if (!$rootScope.isNullOrEmpty(id)) {
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

				var desc = "";
				if($scope.article_detail.ratecap && $scope.article_detail.ratefloor){
					desc += "利息率:"+$scope.article_detail.ratecap+"%~"+$scope.article_detail.ratefloor+"%\r\n";
				}
				if($scope.article_detail.loanvalue ){
					desc += "贷款额度:"+$scope.article_detail.loanvalue +"万\r\n";
				}
				if($scope.article_detail.loanlife ){
					desc += "贷款期限:"+$scope.article_detail.loanlife +"年";
				}
				$scope.shareData = {
					title: $scope.article_detail.name,
					desc: desc,
					link: $rootScope.url_prefix + "#/article/show/"+$routeParams.id,
					imgUrl: $rootScope.url_prefix + '/img/share.png'
				};
				wx.ready(function () {
					wx.onMenuShareAppMessage($scope.shareData);
					wx.onMenuShareTimeline($scope.shareData);
					wx.onMenuShareQQ($scope.shareData);
					wx.onMenuShareWeibo($scope.shareData);
				});

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
		if (!$rootScope.isNullOrEmpty(id)) {
			$location.path("/article/apply/"+ id);
		}
	};
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
		console.log(m_params.companyName +"baiyang");
		if(typeof(m_params.companyName) == "undefined" || m_params.companyName ==''){
			$scope.company.errorMsg = "公司名称不能为空";
			$timeout(function() {
				$scope.company.errorMsg = "";
			}, 2000);
		}else{
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
						$location.path("/article/show/"+ $routeParams.id);
					}, 2000);
					$scope.$apply();
				}
				else if(data.returnCode == 1001){
					// console.log(data);
					$scope.company.errorMsg = "贵公司已经申请过此产品";
					$timeout(function() {
						$scope.company.errorMsg = "";
					}, 2000);
					$scope.$apply();
				}
			},
			dataType: 'json',
		});
		}
	};

});