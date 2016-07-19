
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
    $scope.login_zrh = function () {
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
                };
                $rootScope.putObject("login_user", $rootScope.login_user);
                var present_route = $rootScope.getSessionObject("present_route");


                var redirect_uri = "";

                if (present_route == null || present_route == "" || !present_route) {
                    redirect_uri = "/user/center";
                } else if (present_route.indexOf("/article/apply/") > -1) {
                    redirect_uri = present_route;
                    $rootScope.removeSessionObject("present_route");
                } else {
                    redirect_uri = "/user/center";
                    $rootScope.removeSessionObject("present_route");
                }
                if ($rootScope.wx_client) {
                    window.location.href = api_uri + "wx/toOAuth?url=" + encodeURIComponent(root_uri + redirect_uri);
                } else {
                    $location.path(redirect_uri);
                }
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

    $scope.register_zrh = function () {
    	$location.path("/register/step1");
    };
    
    $scope.reset = function(){
    	$location.path("/register/reset1");
    };
});