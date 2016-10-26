
var registerCtrl = angular.module('registerCtrl', []);

registerCtrl.controller('RegStep1Ctrl',
	['$http', '$scope', '$rootScope', '$location', '$timeout', function ($http, $scope, $rootScope, $location, $timeout) {
	$scope.registerUser = {
		"mobile":"",
		"code":""
	};
	$scope.isVerify = false;//是否允许下一步
	//$scope.isVerify = true;//是否允许下一步
    //$scope.enableMobile = true;//手机号码是否可用
	$scope.enableMobile = false;//手机号码是否可用

	$scope.error_msg = "";
	
	$("#mobile").focus();
	
	$scope.changeErrorMsg = function(msg){
		$scope.error_msg = msg;
		// $timeout(function() {  
		//          $scope.changeErrorMsg(""); 
		//    }, 5000);
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
		if($rootScope.isNullOrEmpty($scope.registerUser.mobile)){
			$scope.changeErrorMsg("手机号码不能为空");
			$("#mobile").focus();
		}else{
			$http({
	            url: api_uri+"reg/validateMobile",
	            method: "GET",
	            params: {"mobile":$scope.registerUser.mobile}
	        }).success(function (d) {
				// console.log(d);
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
						// console.log(d);
			            if (d.returnCode == 0) {
			                $scope.changeErrorMsg("短信验证码已经发送到你的手机");
			            }
			            else {
			                 $scope.changeErrorMsg(d.returnCode);
			            }

			        }).error(function (d) {
			            // console.log("login error");
			        })
	            }else if(d.returnCode == 1001){
					$scope.enableMobile =false;
					$scope.changeErrorMsg("用户已经注册");
				}else if(d.returnCode == 2102){
	            	$scope.enableMobile =false;
	            	$scope.changeErrorMsg("手机号错误");
	            }else{
					$scope.changeErrorMsg(d.returnCode);
				}

	        }).error(function (d) {
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
				// console.log(d);
	            if (d.returnCode == 0) {
	                $location.path("/register/step2/"+$scope.registerUser.mobile+"/"+d.result);
	            }
	            else {
	            	$scope.changeErrorMsg(d.result);
	            }
	        }).error(function (d) {
	        })
		}
	};

	}]);

registerCtrl.controller('RegStep2Ctrl',
	['$http', '$scope', '$rootScope', '$location', '$routeParams', '$timeout', function ($http, $scope, $rootScope, $location, $routeParams, $timeout) {
	var share_msg = $rootScope.getSessionObject("share");
	if(!share_msg){
		share_msg ={
			shareName: null,
			shareId:null
		}
	}
	$scope.registerUser = {
		"mobile":$routeParams.mobile,
		"password":"",
		"validatePwd":"",
		"token": $routeParams.token,
		"share": share_msg.shareName,
		"shareId": share_msg.shareId
	};

	$scope.changeErrorMsg = function(msg){
		$scope.error_msg = msg;
		$timeout(function() {
	              $scope.changeErrorMsg("");
	        }, 5000);
	};
	$scope.textChange = function () {
		if ($scope.registerUser.password == $scope.registerUser.validatePwd) {
			$scope.success_msg = "点击注册按钮，注册用户";
			$scope.error_msg = ""
		}else{
			$scope.success_msg = "";
			$scope.error_msg = "两次输入的密码不一致"
		}
	};
	$scope.user_register = function(){
		if ($scope.registerUser.password == $scope.registerUser.validatePwd) {
			$http({
	            url: api_uri+"reg/regist",
	            method: "POST",
	            params: $scope.registerUser
	        }).success(function (d) {
	            if (d.returnCode == 0) {
	            	alert("注册成功");
	            	$rootScope.putObject("login_mobile",$scope.registerUser.mobile);
	                $http({
			            url: api_uri+"auth/web",
			            method: "POST",
			            params: {
			            	"mobile":$scope.registerUser.mobile,
			            	"password":$scope.registerUser.password
			            }
			        }).success(function (d) {
						// console.log(d);
			            if (d.returnCode == 0) {
							$rootScope.login_user = {
			            		"userId":d.result.split("_")[0],
			            		"token":d.result.split("_")[1]
							};
							$rootScope.putObject("login_user", $rootScope.login_user);
							$location.path("/user/center");
			            }
			            else {
			            	$scope.changeErrorMsg(d.result);
			            }
			        }).error(function (d) {
			            // console.log("login error");
			        })
				} else {
	            }
	        }).error(function (d) {
	        })
		}else{
				$scope.changeErrorMsg("两次密码输入的不一致");
		}
	};

	}]);

registerCtrl.controller('ResetStep1Ctrl',
	['$http', '$scope', '$rootScope', '$location', '$timeout', function ($http, $scope, $rootScope, $location, $timeout) {
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
						// console.log(d);
			            if (d.returnCode == 0) {
			            	$("#code").focus();
		                    $scope.changeErrorMsg("短信验证码已经发送到你的手机");
			            }
			            else{
			                $scope.changeErrorMsg(d.result);
			            }
			        }).error(function (d) {
			            // console.log("login error");
			        })
	            }else if(d.returnCode == 2102){
					// console.log(d);
	            	$scope.enableMobile =false;
	            	$scope.changeErrorMsg("手机号码错误");
	            }else if(d.returnCode == 0){
					// console.log(d);
					$scope.enableMobile =false;
					$scope.changeErrorMsg("手机号码未注册");
				}

	        }).error(function (d) {
	            // console.log("login error");
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
	            // console.log("login error");
	        })
		}
	};

	}]);

registerCtrl.controller('ResetStep2Ctrl',
	['$http', '$scope', '$rootScope', '$location', '$routeParams', function ($http, $scope, $rootScope, $location, $routeParams) {
	$scope.resetUser = {
		"mobile":$routeParams.mobile,
		"password":"",
		"validatePwd":"",
		"token":$routeParams.token
	};

	$scope.textChange2 = function () {
		if ($scope.resetUser.password == $scope.resetUser.validatePwd) {
			$scope.success_msg = "点击重置按钮，重置密码";
			$scope.error_msg = ""
		}else{
			$scope.success_msg = "";
			$scope.error_msg = "两次输入的密码不一致"
		}
	};
	$scope.user_reset = function(){
		$http({
            url: api_uri+"reg/reset",
            method: "POST",
            params: $scope.resetUser
        }).success(function (d) {
            if (d.returnCode == 0) {
            	alert("重置密码成功");
            	$rootScope.putObject("login_mobile",$scope.resetUser.mobile);
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
						$rootScope.putObject("login_user", $rootScope.login_user);
						$location.path("/user/center");
		            }
		            else {
		            }
				}).error(function (d) {
		        })
            }
            else {
            }
        }).error(function (d) {
        })
	};

	}]);

