"use strict";

angular.module("ngTouchend", []).directive("ngTouchend", function () {
  return {
    controller: function ($scope, $element, $attrs) {
      $element.bind('touchend', onTouchEnd);
      
      function onTouchEnd(event) {
        var method = $element.attr('ng-touchend');
        $scope.$event = event;
        $scope.$apply(method);
      };
    }
  };
});
;"use strict";

angular.module("ngTouchstart", []).directive("ngTouchstart", function () {
  return {
    controller: function ($scope, $element, $attrs) {
      $element.bind('touchstart', onTouchStart);
      
      function onTouchStart(event) {
        var method = $element.attr('ng-touchstart');
        $scope.$event = event;
        $scope.$apply(method);
      };
    }
  };
});
;"use strict";

angular.module("ngTouchmove", []).directive("ngTouchmove", function () {
  return {
    controller: function ($scope, $element, $attrs) {
      $element.bind('touchstart', onTouchStart);
      
      function onTouchStart(event) {
        event.preventDefault();
        $element.bind('touchmove', onTouchMove);
        $element.bind('touchend', onTouchEnd);
      };
      
      function onTouchMove(event) {
          var method = $element.attr('ng-touchmove');
          $scope.$event = event;
          $scope.$apply(method);
      };
      
      function onTouchEnd(event) {
        event.preventDefault();
        $element.unbind('touchmove', onTouchMove);
        $element.unbind('touchend', onTouchEnd);
      };
    }
  };
});
;
var articleCtrl = angular.module('articleCtrl', []);

articleCtrl.controller('ArticleListCtrl', function ($http, $scope, $rootScope, $location) {
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
				//$scope.article_detail.ratecap = parseInt($scope.article_detail.ratecap);
				//$scope.article_detail.ratefloor = parseInt($scope.article_detail.ratefloor);
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

});;
var loginCtrl = angular.module('loginCtrl', []);

loginCtrl.controller('LoginCtrl', function ($http, $scope, $rootScope, $location,$timeout) {
    $scope.$root.title = "登陆";
	$scope.loginUser = {
        "mobile": "",
        "password": ""
    };

    $scope.error_code_msg = {
    	    1003:"该用户不存在",
    	    2001:"用户名或密码错误",
    	    1002:"该用户异常",
    	    1:"服务器异常,请稍后再试"
    };

    var check_params = function (params) {
        if (params.mobile == "" || params.password == "") {
            return false;
        }
        return true;
    };
    $scope.changeErrorMsg = function(msg){
		$scope.error_msg = msg;
		$timeout(function() {  
            //$scope.changeErrorMsg("");
            $scope.error_msg = "";
	        }, 5000);
	};
    $scope.textChange =function(e){
            $scope.error_msg = ""
    }
    $scope.loginUser = {
        "mobile":"",
        "code":""
    };
    $scope.ngBlur = function(){
        if($rootScope.isNullOrEmpty($scope.loginUser.mobile)){
            $scope.changeErrorMsg("手机号码不能为空");
            //$scope.error_msg = "手机号码不能为空"
            $("#mobile").focus();
        }else{
            $http({
                url: api_uri+"reg/validateMobile",
                method: "GET",
                params: {"mobile":$scope.loginUser.mobile}
            }).success(function (d) {
                if (d.returnCode == 1001) {
                    $scope.enableMobile = true;
                    //$scope.success_msg = "手机号输入正确";
                }
                else {
                    $scope.enableMobile =false;
                    $scope.changeErrorMsg("手机号未注册");
                }

            }).error(function (d) {
                console.log("login error");
            })
        }
    };
    $scope.login = function () {
        var m_params = $scope.loginUser;
        if (!check_params(m_params)) return;
        $http({
            url: api_uri+"auth/web",
            method: "POST",
            params: m_params           
        }).success(function (d) {
            if (d.returnCode == 0) {
                console.log(d);
                $rootScope.login_user = {
            		"userId":d.result.split("_")[0],
            		"token":d.result.split("_")[1]
            	}
                $rootScope.putSessionObject("login_user", $rootScope.login_user);
            	$location.path("/article/list");
                //$location.path("/user/setting");
            }else {

            	var msg = $scope.error_code_msg[d.returnCode];
            	if(!msg){
            		msg = "登录失败";
            	}
                $scope.error_msg = msg;
            	//$scope.changeErrorMsg(msg);
            }

        }).error(function (d) {
        	$scope.changeErrorMsg("网络故障请稍后再试......");
            $location.path("/login");
        })
    };
    
    $scope.register = function(){
    	$location.path("/register/step1");
    };
    
    $scope.reset = function(){
    	$location.path("/register/reset1");
    };
});;
var registerCtrl = angular.module('registerCtrl', []);

registerCtrl.controller('RegStep1Ctrl', function ($http, $scope, $rootScope, $location,$timeout) {
	$scope.registerUser = {
		"mobile":"",
		"code":""
	}	
	$scope.isVerify = false;//是否允许下一步
	//$scope.isVerify = true;//是否允许下一步
    //$scope.enableMobile = true;//手机号码是否可用
	$scope.enableMobile = false;//手机号码是否可用

	$scope.error_msg = "";
	
	$("#mobile").focus();
	
	$scope.changeErrorMsg = function(msg){
		$scope.error_msg = msg;
		$timeout(function() {  
	              $scope.changeErrorMsg(""); 
	        }, 5000);
	}

	//发送短信 倒计时
	$scope.sms_second = 60;
	$scope.send_sms = true;
	$scope.times = function(){
		if($scope.sms_second > 0){
			$scope.send_sms = false;
		    $scope.sms_second--;
			$timeout(function() {
	              $scope.times();
	        }, 1000);
		}else if ( $scope.sms_second <= 0 ){
			 $scope.send_sms = true;
			 $scope.sms_second = 60;
		}
	}

	$scope.send_code = function(){
		if($rootScope.isNullOrEmpty($scope.registerUser.mobile)){
			$scope.changeErrorMsg("手机号码不能为空");
			$("#mobile").focus();
		}else{
			$http({
	            url: api_uri+"reg/validateMobile",
	            method: "GET",
	            params: {"mobile":$scope.registerUser.mobile}
	        }).success(function (d) {
				console.log(d);
	            if (d.returnCode == 0) {
	                $scope.enableMobile = true;
	                $scope.times();
					$http({
			            url: api_uri+"reg/sendSms",
			            method: "GET",
			            params: {
			            	"mobile":$scope.registerUser.mobile,
			            	"token":$rootScope.encryptByDES($scope.registerUser.mobile),
			            	"timestamp":moment().format('X')
			            }
			        }).success(function (d) {
						console.log(d);
			            if (d.returnCode == 0) {
			                $scope.changeErrorMsg("短信验证码已经发送到你的手机");
			            }
			            else {
			                 $scope.changeErrorMsg(d.returnCode);
			            }

			        }).error(function (d) {
			            console.log("login error");
			        })
	            }
	            else {
	            	$scope.enableMobile =false;
	            	$scope.changeErrorMsg("手机号未注册");
	            }

	        }).error(function (d) {
	            console.log("login error");
	        })
		}
	}

	$scope.changeCode = function(){
		if($scope.enableMobile && !$rootScope.isNullOrEmpty($scope.registerUser.code)){
			$scope.isVerify= true;
		}else{
			$scope.isVerify= false;
		}
	};


	$scope.validateCode = function(){
		if($scope.isVerify){
			$http({
	            url: api_uri+"reg/validateSms",
	            method: "POST",
	            params: $scope.registerUser
	        }).success(function (d) {
				console.log(d);
	            if (d.returnCode == 0) {
	                $location.path("/register/step2/"+$scope.registerUser.mobile+"/"+d.result);
	            }
	            else {
	            	$scope.changeErrorMsg(d.result);
					//$location.path("/register/step2/"+$scope.registerUser.mobile+"/"+d.result);
	            }
	        }).error(function (d) {
	            console.log("login error");
	        })
		}
	};

});

registerCtrl.controller('RegStep2Ctrl', function ($http, $scope, $rootScope, $location,$routeParams,$timeout) {

	$scope.registerUser = {
		"mobile":$routeParams.mobile,
		"password":"",
		"validatePwd":"",
		"token":$routeParams.token
	};

	$scope.changeErrorMsg = function(msg){
		$scope.error_msg = msg;
		$timeout(function() {
	              $scope.changeErrorMsg("");
	        }, 5000);
	};
	$scope.ngBlur = function(){
		console.log("ng-blur")
		var reg_str = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,12}$/;
		if(reg_str.test($scope.registerUser.password)){
		}else{
			$scope.error_msg = "密码必须是6-12位字母+数字"
		}
	}
	$scope.textChange =function(e){
		//console.log("bianhuale")
		var reg_str = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,12}$/;
		if(reg_str.test($scope.registerUser.password)){
			$scope.success_msg = "密码格式正确";
			$scope.error_msg = ""
		}else{
			$scope.success_msg = "";
			$scope.error_msg = "密码必须是6-12位字母+数字"
		}
	}
	$scope.textChange2 =function(e){
		//console.log("bianhuale")
		var reg_str = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,12}$/;
		if($scope.registerUser.password==$scope.registerUser.validatePwd &&reg_str.test($scope.registerUser.password)){
			$scope.success_msg = "点击注册按钮，注册用户";
			$scope.error_msg = ""
		}else{
			$scope.success_msg = "";
			$scope.error_msg = "两次输入的密码不一致"
		}
	}
	$scope.user_register = function(){
		var reg_str = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,12}$/;
		if($scope.registerUser.password==$scope.registerUser.validatePwd &&reg_str.test($scope.registerUser.password)){
			$http({
	            url: api_uri+"reg/regist",
	            method: "POST",
	            params: $scope.registerUser
	        }).success(function (d) {
	            if (d.returnCode == 0) {
	            	alert("注册成功");
	            	$rootScope.putSessionObject("login_mobile",$scope.registerUser.mobile);
	                $http({
			            url: api_uri+"auth/web",
			            method: "POST",
			            params: {
			            	"mobile":$scope.registerUser.mobile,
			            	"password":$scope.registerUser.password
			            }
			        }).success(function (d) {
						console.log(d);
			            if (d.returnCode == 0) {
							$rootScope.login_user = {
			            		"userId":d.result.split("_")[0],
			            		"token":d.result.split("_")[1]
			            	}
							$rootScope.putSessionObject("login_user", $rootScope.login_user);
			            	$location.path("/article/list");
			            }
			            else {
			            	$scope.changeErrorMsg(d.result);
			                console.log(d);
			            }
			        }).error(function (d) {
			            console.log("login error");
			        })
	            }
	            else {
	                console.log(d);
	            }
	        }).error(function (d) {
	            console.log("login error");
	        })
		}else{
			if($scope.registerUser.password!=$scope.registerUser.validatePwd){
				$scope.changeErrorMsg("两次密码输入的不一致");
			}else if(!reg_str.test($scope.registerUser.password)){
				$scope.changeErrorMsg("密码强度不够,必须包含数字和字母");
			}
		}
	};

});

registerCtrl.controller('ResetStep1Ctrl', function ($http, $scope, $rootScope, $location,$timeout) {
	$scope.resetUser = {
		"mobile":"",
		"code":""
	};
	$scope.isVerify = false;//是否允许下一步

	$scope.enableMobile = false;//手机号码是否可用

	$scope.error_msg = "";

	$scope.changeErrorMsg = function(msg){
		$scope.error_msg = msg;
		$timeout(function() {
	              $scope.changeErrorMsg("");
	        }, 5000);
	};

	//发送短信 倒计时
	$scope.sms_second = 60;
	$scope.send_sms = true;
	$scope.times = function(){
		if($scope.sms_second > 0){
			$scope.send_sms = false;
		    $scope.sms_second--;
			$timeout(function() {
	              $scope.times();
	        }, 1000);
		}else if ( $scope.sms_second <= 0 ){
			 $scope.send_sms = true;
			 $scope.sms_second = 60;
		}
	};

	$scope.send_code = function(){
		if($rootScope.isNullOrEmpty($scope.resetUser.mobile)){
			$scope.changeErrorMsg("手机号码不能为空");
			$("#mobile").focus();
		}else{
			$http({
	            url: api_uri+"reg/validateMobile",
	            method: "GET",
	            params: {"mobile":$scope.resetUser.mobile}
	        }).success(function (d) {
	            if (d.returnCode == 1001) {
	            	$scope.enableMobile = true;
	                $scope.times();
					$http({
			            url: api_uri+"reg/sendSms2",
			            method: "GET",
			            params: {
			            	"mobile":$scope.resetUser.mobile,
			            	"token":$rootScope.encryptByDES($scope.resetUser.mobile),
			            	"timestamp":moment().format('X')
			            }
			        }).success(function (d) {
			            if (d.returnCode == 0) {
			            	$("#code").focus();
		                    $scope.changeErrorMsg("短信验证码已经发送到你的手机");
			            }
			            else {
			                $scope.changeErrorMsg(d.result);
			            }

			        }).error(function (d) {
			            console.log("login error");
			        })
	            }
	            else {
	            	$scope.enableMobile =false;
	            	$scope.changeErrorMsg("手机号错误");
	            }

	        }).error(function (d) {
	            console.log("login error");
	        })
		}
	};

	$scope.changeCode = function(){
		if($scope.enableMobile && !$rootScope.isNullOrEmpty($scope.resetUser.code)){
			$scope.isVerify= true;
		}else{
			$scope.isVerify= false;
		}
	};


	$scope.validateCode = function(){
		if($scope.isVerify){
			$http({
	            url: api_uri+"reg/validateSms",
	            method: "POST",
	            params: $scope.resetUser
	        }).success(function (d) {
	            if (d.returnCode == 0) {
	                $location.path("/register/reset2/"+$scope.resetUser.mobile+"/"+d.result);
	            }
	            else {
	            	$scope.changeErrorMsg(d.result);
	            }
	        }).error(function (d) {
	            console.log("login error");
	        })
		}
	};

});

registerCtrl.controller('ResetStep2Ctrl', function ($http, $scope, $rootScope, $location,$routeParams) {

	$scope.resetUser = {
		"mobile":$routeParams.mobile,
		"password":"",
		"validatePwd":"",
		"token":$routeParams.token
	};
	$scope.textChange =function(e){
		//console.log("bianhuale")
		var reg_str = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,12}$/;
		if(reg_str.test($scope.resetUser.password)){
			$scope.success_msg = "密码格式正确";
			$scope.error_msg = ""
		}else{
			$scope.success_msg = "";
			$scope.error_msg = "密码必须是6-12位字母+数字"
		}
	}
	$scope.textChange2 =function(e){
		//console.log("bianhuale")
		var reg_str = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,12}$/;
		if($scope.resetUser.password==$scope.resetUser.validatePwd &&reg_str.test($scope.resetUser.password)){
			$scope.success_msg = "点击重置按钮，重置密码";
			$scope.error_msg = ""
		}else{
			$scope.success_msg = "";
			$scope.error_msg = "两次输入的密码不一致"
		}
	}
	$scope.user_reset = function(){
		$http({
            url: api_uri+"reg/reset",
            method: "POST",
            params: $scope.resetUser
        }).success(function (d) {
            if (d.returnCode == 0) {
            	alert("重置密码成功");
            	$rootScope.putSessionObject("login_mobile",$scope.resetUser.mobile);
                $http({
		            url: api_uri+"auth/web",
		            method: "POST",
		            params: {
		            	"mobile":$scope.resetUser.mobile,
		            	"password":$scope.resetUser.password
		            }
		        }).success(function (d) {
		            if (d.returnCode == 0) {
						$rootScope.login_user = {
		            		"userId":d.result.split("_")[0],
		            		"token":d.result.split("_")[1]
		            	}
						$rootScope.putSessionObject("login_user", $rootScope.login_user);
		            	//$location.path("/article/list");
						$location.path("/user/setting");
		            }
		            else {
		                console.log(d);
		            }
		        }).error(function (d) {
		            console.log("login error");
		        })
            }
            else {
                console.log(d);
            }
        }).error(function (d) {
            console.log("login error");
        })
	};
	
});

;
var userCtrl = angular.module('userCtrl', []);
/*个人中心*/
userCtrl.controller('UserCenterCtrl', function ($http, $scope, $rootScope,$timeout, $location) {
	var result_list =[];
    $scope.init = function () {
        //获取个人信息 以及各种列表数量
         $http({
            url: api_uri + "user/center",
            method: "GET",
            params: $rootScope.login_user
        }).success(function (d) {
            console.log(d);
            if (d.returnCode == 0) {
                $scope.nickname = d.result.nickname;
                $scope.batting = d.result.batting;
                $scope.value = d.result.value;
				$scope.position = d.result.position;
                //$scope.ms = d.result.ms;
                //$scope.cs = d.result.cs;
                $scope.headImg = d.result.headImg;
            }else {
                console.log(d);
            }
        }).error(function (d) {
            console.log(d);
        });
		$scope.list(1,10);
    };

	$scope.message = false;
	$scope.list = function (pageNo,pageSize) {
		if(!$scope.type){
			$scope.type = "1";
		}
		var m_params = {
			userId: $rootScope.login_user.userId,
			token: $rootScope.login_user.token,
			pageNo:pageNo,
			 pageSize:pageSize
		};
		$http({
			url: api_uri+"loanApplication/list",
			method: "GET",
			params: m_params
		}).success(function (d) {
			console.log(d);
			if (d.returnCode == 0) {
				if(d.result.totalCount == 0){
					$scope.message = false;
				}else {

					result_list =result_list.concat(d.result.datas);
					$scope.result_list = result_list;
					$scope.nextPage = d.result.nextPage;
					$scope.pageNo = d.result.pageNo;
					$scope.totalCount = d.result.totalCount;
					angular.forEach($scope.result_list, function(data){
						if($scope.type == 0){
							/*data.jindu = "0";
							data.jindushow = "未发布";
							data.jinduShowM = "0";*/
						}else if($scope.type == 1){
							if(data.status == 1){
								data.jindu = "10";
								data.triangle = "8";
								data.textPosition = "2";
								data.progressText = "审核中";
								$scope.message = true;
							}else if(data.status == 2){
								data.jindu = "50";
								data.triangle = "44";
								data.textPosition = "36";
								data.progressText = "约见中";
								$scope.message = true;
							}else if(data.status == 3){
								data.jindu = "75";
								data.triangle = "66";
								data.textPosition = "58";
								data.progressText = "跟进中";
								$scope.message = true;
							}else if(data.status == 4){
								data.jindu = "100";
								data.triangle = "86";
								data.textPosition = "76";
								data.progressText = "成功融资";
								$scope.message = true;
							}else if(data.status == -1){
								data.jindu = "0";
								data.triangle = "20";
								data.textPosition = "5";
								data.progressText = "申请已经取消";
							}
						}
					});
				}
			}
			else {
				//console.log(d);
			}

		}).error(function (d) {
			console.log("login error");
			//$location.path("/error");
		})
	};
	$scope.result_list = {
		result:{},
		returnCode:0
	}
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
	//$scope.$apply();
	$scope.init();

	$scope.userDetail = function(){
		$location.path("/user/setting/");
	}
	$scope.company_detail = function (id) {
		if (!$rootScope.isNullOrEmpty(id)) {
			$location.path("/user/companyDetail/" + id);
		}
	};
});

articleCtrl.controller('CompanyDetailCtrl', function ($http, $scope, $rootScope, $location, $routeParams) {

	$scope.init = function () {
		$scope.bt_show = 0;
		$http({
			url: api_uri + "loanApplication/detail/" + $routeParams.id,
			method: "GET",
			params: $rootScope.login_user
		}).success(function (d) {
			console.log(d);
			if (d.returnCode == 0) {
				$scope.company = d.result;
				console.log(d.result);
			}else {
				console.log(d);
			}
		}).error(function (d) {
			console.log("login error");
			$location.path("/error");
		});
	};
	$scope.init();
	$scope.alertCancel = function(){
		$(".coverAlert").css("display","block");
		$(".cancelAlert").css("display","block");
	};
	$scope.alertExit = function(){
		$(".coverAlert").css("display","none");
		$(".cancelAlert").css("display","none");
	}

	$scope.cancel =function(){
		var m_params = {
			userId: $rootScope.login_user.userId,
			token: $rootScope.login_user.token,
			status:-1
		};
		$http({
			url: api_uri + "loanApplication/cancel/"+$routeParams.id,
			method: "GET",
			params: m_params
		}).success(function (d) {
			console.log(d);
			if (d.returnCode == 0) {
				$location.path("/user/center/");
			}else {
				console.log(d);
			}
		}).error(function (d) {
			console.log("login error");
			$location.path("/error");
		});
	};


});


userCtrl.controller('SettingCtrl', //用户设置
    ['$scope','$rootScope', '$location', '$http', function ($scope, $rootScope, $location, $http) {
        $scope.init = function () {
            //获取用户信息
            $http({
		        url: api_uri + "user/setting",
		        method: "GET",
		        params: $rootScope.login_user
		    }).success(function (d) {
		    	console.log(d);
		        if (d.returnCode == 0) {
		            $scope.user = d.result;		          
		        }else {
		            console.log(d);
		        }
		    }).error(function (d) {
		        console.log(d);
		    });        	
        	
			$http({
		        url: api_uri + "qiniu/getUpToken",
		        method: "GET",
		        params: $rootScope.login_user
		    }).success(function (d) {
		        console.log(d);
		        if (d.returnCode == 0) {
		            $scope.qiniu_token = d.result.uptoken;
		            var uploader = Qiniu.uploader({
		                runtimes: 'html5,flash,html4',    //上传模式,依次退化
		                browse_button: 'pickfiles',       //上传选择的点选按钮，**必需**
		                //	        uptoken_url: api_uri+"api/qiniu/getUpToken",
		                uptoken: $scope.qiniu_token,
		                //	        get_new_uptoken: true,
		                //save_key: true,
		                domain: $rootScope.qiniu_bucket_domain, //bucket 域名，下载资源时用到，**必需**
		                container: 'upload_container',           //上传区域DOM ID，默认是browser_button的父元素，
		                max_file_size: '10mb',           //最大文件体积限制
		                flash_swf_url: '../../framework/plupload/Moxie.swf',  //引入flash,相对路径
		                max_retries: 3,                   //上传失败最大重试次数
		                dragdrop: false,                   //开启可拖曳上传
		                drop_element: '',        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
		                chunk_size: '4mb',                //分块上传时，每片的体积
		                auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
		                init: {
		                    'FilesAdded': function (up, files) {
		                        //                    plupload.each(files, function(file) {
		                        //                        // 文件添加进队列后,处理相关的事情
		                        //                    });
		                    },
		                    'BeforeUpload': function (up, file) {
		                        $rootScope.uploading = true;
		                        $scope.upload_percent = file.percent;
		                        $rootScope.$apply();
		                    },
		                    'UploadProgress': function (up, file) {
		                        // 每个文件上传时,处理相关的事情
		                        $scope.upload_percent = file.percent;
		                        $scope.$apply();
		                    },
		                    'FileUploaded': function (up, file, info) {
		                        var res = $.parseJSON(info);
		                        var file_url = "http://" + $rootScope.qiniu_bucket_domain + "/" + res.key;
		                        $scope.user.headImg = file_url;
		                        $scope.$apply();
		                        var params = $rootScope.login_user;
		                        params.key = "headImg";
		                        params.value = $scope.user.headImg;
		                        $.post(api_uri + "user/update", params,
								    function (data) {
								        if (data.returnCode == 0) {
								            
								        } else {
								            console.log(data);
								        }
								    },
								"json");
		                    },
		                    'Error': function (up, err, errTip) {
		                        console.log(err);
		                        $rootScope.alert("营业执照上传失败！");
		                    },
		                    'UploadComplete': function () {
		                        //队列文件处理完毕后,处理相关的事情
		                    },
		                    'Key': function (up, file) {
		                        var time = new Date().getTime();
		                        var k = 'user/headImg/' + $rootScope.login_user.userId + '/' + time;
		                        return k;
		                    }
		                }
		            });
		        } else {
		            console.log(d);
		        }
		
		    }).error(function (d) {
		        console.log(d);
		    });
	       
        };
        $scope.init();
        $scope.reset = function(){
            $location.path("/register/reset1");
        };


        $scope.update = function(key,value){
        	if(!$rootScope.isNullOrEmpty(key) ){
        		if($rootScope.isNullOrEmpty(value)) value = "";
        	   $rootScope.putSessionObject("user_update",key+"="+value);
        	   $location.path("/user/update");
        	}
        };

        $scope.logout =  function(){
            $http({
	            url: api_uri + "auth/logout",
	            method: "GET",
	            params: $rootScope.login_user
	        }).success(function (d) {
	        	console.log(d);
	        }).error(function (d) {
	            console.log(d);
	        });
	         $rootScope.removeSessionObject("login_user", $rootScope.login_user);
	         $rootScope.login_user = {};
	         $location.path("/login");
        };
}]);

userCtrl.controller('UserUpdateCtrl',
    ['$scope','$rootScope', '$location', '$http', function ($scope, $rootScope, $location, $http) {
        
        $scope.init = function(){
        	var user_update = $rootScope.getSessionObject("user_update");
	        if(user_update && user_update.indexOf("=")){
	        	$rootScope.removeSessionObject("user_update");
	        	$scope.update_user = {};
	        	$scope.update_user.key = user_update.split("=")[0];
	        	$scope.update_user.value = user_update.split("=")[1];
	        }
        };
       
        $scope.init();
        
        $scope.sure = function(){
        	var params = $rootScope.login_user;
        	params.key = $scope.update_user.key;
        	params.value = $scope.update_user.value;
        	//params.position = $scope.update_user.position;
        	console.log(params);
        	var keys = ["name","position"];
        	if($.inArray(params.key, keys)>=0){
        		$.post(api_uri + "user/update", params,
			    function (data) {
			        if (data.returnCode == 0) {
			            
			        } else {
			            console.log(data);
			        }
		  	    },
			   "json");
        	}
        	$location.path("/user/setting");
        };
}]);;
api_uri = "http://123.206.84.74/api/";
templates_root = "/zhironghao/templates/";
deskey = "abc123.*abc123.*abc123.*abc123.*";

var myApp = angular.module('myApp', [
    'ng', 'ngRoute', 'ngAnimate', 'loginCtrl', 'registerCtrl', 'articleCtrl','userCtrl','ngTouchstart','ngTouchmove','ngTouchend'
], function ($httpProvider) {
    // Use x-www-form-urlencoded Content-Type
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

});


myApp.run(['$location', '$rootScope', '$http',
    function ($location, $rootScope, $http) {

        $rootScope.qiniu_bucket_domain = "o793l6o3p.bkt.clouddn.com";

        // 页面跳转后
        $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
//          var present_route = $location.$$path; //获取当前路由
//          var routes = ["/login","/article/list"];
//          if (!$rootScope.login_user) {
//          	var register_reg = /\/register.*/;
//          	if(register_reg.test(present_route) || routes.indexOf(present_route)>-1){
//          		
//          	}else{
////          		$rootScope.removeObject("login_user");
//                  $location.path("/login");
//          	}    
//          }
        });
        // 页面跳转前
        $rootScope.$on('$routeChangeStart', function (event, current, previous) {
           
            var present_route = $location.$$path; //获取当前路由
            var routes = ["/login","/article/list"];
            if (!$rootScope.login_user) {
            	var register_reg = /\/register.*/;
            	if(register_reg.test(present_route) || routes.indexOf(present_route)>-1){
            		
            	}else{
//          		$rootScope.removeObject("login_user");
                    $location.path("/login");
            	}    
            }
            
            
        });

        /*********************************** 全局方法区 e***************************************/
            // 对象存储
        $rootScope.putObject = function (key, value) {
            localStorage.setItem(key, angular.toJson(value));
        };
        $rootScope.getObject = function (key) {
            return angular.fromJson(localStorage.getItem(key));
        };
        $rootScope.removeObject = function (key) {
            localStorage.removeItem(key);
        };

        $rootScope.putSessionObject = function (key, value) {
            sessionStorage.setItem(key, angular.toJson(value));
        };
        $rootScope.getSessionObject = function (key) {
            return angular.fromJson(sessionStorage.getItem(key));
        };
        $rootScope.removeSessionObject = function (key) {
            angular.fromJson(sessionStorage.removeItem(key));
        };

        /*$rootScope.getAccountInfoKeyValue = function (key) {
            if ($rootScope.account_info != {}) {
                $rootScope.account_info = $rootScope.getSessionObject('account_info');
            }
            if ($rootScope.account_info) {
                return $rootScope.account_info[key];
            } else {
                return null;
            }
        };*/
        $rootScope.isNullOrEmpty = function(strVal) {
            if ($.trim(strVal) == '' || strVal == null || strVal == undefined) {
                return true;
            } else {
                return false;
            }
        }
        //加密 3des
        $rootScope.encryptByDES = function (message) {
            var keyHex = CryptoJS.enc.Utf8.parse(deskey);
            var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
            });
            return encrypted.toString();
        }
        //解密 
        $rootScope.decryptByDES = function (ciphertext) {
            var keyHex = CryptoJS.enc.Utf8.parse(deskey);

            // direct decrypt ciphertext  
            var decrypted = CryptoJS.DES.decrypt({
                ciphertext: CryptoJS.enc.Base64.parse(ciphertext)
            }, keyHex, {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
            });

            return decrypted.toString(CryptoJS.enc.Utf8);
        }
        
        $rootScope.transFn = function(obj) {
		       var str = [];
			   for(var p in obj){
			       str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
			   }
			   return str.join("&").toString();
		 };

        /*$rootScope.close_alert = function () {
            $rootScope.alert_show = null;
        };
        $rootScope.alert = function (data) {
            $rootScope.alert_show = true;
            if (data) {
                $rootScope.alert_str = data;
                setTimeout(function () {
                    $rootScope.alert_show = null;
                    $rootScope.$apply();
                }, 3000);
            } else {
                $rootScope.alert_str = "未知错误";
            }
        };*/
        $rootScope.touchStart = function(){
            console.log("big");
            $(".singleButtonFixed").addClass("singleButton2");
            $(".singleButton1").addClass("singleButton2");
        };
        $rootScope.touchEnd = function(){
            $(".singleButtonFixed").removeClass("singleButton2");
            $(".singleButton1").removeClass("singleButton2");
        }
        $rootScope.check_user = function () {
            $rootScope.login_user = $rootScope.getSessionObject("login_user");
            //console.log($rootScope.login_user);
            if (!$rootScope.login_user) {
                //$rootScope.removeSessionObject("login_user");
                $location.path("/login");
                return false;
            }
            $http({
                url: api_uri + "auth/validateAuth",
                method: "POST",
                params: $rootScope.login_user
            }).success(function (d) {
                if (d.returnCode == 0) {
                    console.log("login success");
                    return true;
                } else {
                	$rootScope.login_user = {};
                    //$rootScope.removeSessionObject("login_user");
                    //$location.path("/login");
                    return false;
                }

            }).error(function (d) {
                //$rootScope.removeSessionObject("login_user");
                //$location.path("/login");
                return false;
            });
        };


        if (!window.localStorage) {
            alert('This browser does NOT support localStorage');
        }

        if (!window.sessionStorage) {
            alert('This browser does NOT support sessionStorage');
        }

        $rootScope.check_user();


    }]);
;/**
 * Created by jiangzhuang on 5/5/16.
 */

//路由设定
myApp.config(function ($routeProvider) {
    $routeProvider
        //登录
        .when('/login', {
            templateUrl: templates_root + 'login/login.html',
            controller: 'LoginCtrl'
        })
        //注册
        .when('/register/step1', {//注册第一步
            templateUrl: templates_root + 'register/step1.html',
            controller: 'RegStep1Ctrl'
        })
        .when('/register/step2/:mobile/:token', {//注册第二步
            templateUrl: templates_root + 'register/step2.html',
            controller: 'RegStep2Ctrl'
        })
        .when('/register/reset1', {//重置第一步
            templateUrl: templates_root + 'register/reset1.html',
            controller: 'ResetStep1Ctrl'
        })
         .when('/register/reset2/:mobile/:token', {//重置第二步
            templateUrl: templates_root + 'register/reset2.html',
            controller: 'ResetStep2Ctrl'
        })
        
        //项目
        .when('/article/list', {//列表
            templateUrl: templates_root + 'article/list.html',
            controller: 'ArticleListCtrl'
        })
        .when('/article/show/:id', {//详情
            templateUrl: templates_root + 'article/show.html',
            controller: 'ArticleShowCtrl'
        })
       .when('/article/apply/:id', {//申请
            templateUrl: templates_root + 'article/apply.html',
            controller: 'applyCtrl'
        })
        .when('/user/center', {//个人中心
            templateUrl: templates_root + 'user/center.html',
            controller: 'UserCenterCtrl'
        })
        .when('/user/companyDetail/:id', {//企业详情
            templateUrl: templates_root + 'user/company_detail.html',
            controller: 'CompanyDetailCtrl'
        })
        .when('/user/setting', {//设置
            templateUrl: templates_root + 'user/setting.html',
            controller: 'SettingCtrl'
        })
        .when('/user/update', {//用户更改参数
            templateUrl: templates_root + 'user/update.html',
            controller: 'UserUpdateCtrl'
        })
        .when('/error', {//用户更改参数
            templateUrl: templates_root + '404.html',
            //controller: 'UserUpdateCtrl'
        })
        .otherwise({redirectTo: '/login'})
});