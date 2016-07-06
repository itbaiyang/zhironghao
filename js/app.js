
//api_uri = "http://123.206.84.74/api/";
api_uri = "http://api.supeiyunjing.com/";
//api_uri = "http://172.17.2.13:8080/api/";
templates_root = "/app/zhironghao/templates/";
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
