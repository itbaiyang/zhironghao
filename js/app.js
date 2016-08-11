 // api_uri = "http://123.206.84.74/api/";
api_uri = "http://api.supeiyunjing.com/";
//api_uri = "http://172.17.2.13:8080/api/";
//api_uri = "http://172.16.97.95:8080/api/";
templates_root = "templates/";
deskey = "abc123.*abc123.*abc123.*abc123.*";
root_uri = "http://app.supeiyunjing.com/#";

var myApp = angular.module('myApp', [
    'ng', 'ngRoute', 'ngAnimate', 'loginCtrl', 'registerCtrl', 'articleCtrl','userCtrl','ngTouchstart','ngTouchmove','ngTouchend'
], function ($httpProvider) {
    // Use x-www-form-urlencoded Content-Type
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

});


myApp.run(['$location', '$rootScope', '$http', '$routeParams',
    function ($location, $rootScope, $http, $routeParams) {

        $rootScope.qiniu_bucket_domain = "o793l6o3p.bkt.clouddn.com";

        var no_check_route = ["/article/list", "/login", "/register/step1", "/register/step2", "/register/reset1", "/register/reset2"];

        // 浏览器鉴别
        var ua = navigator.userAgent.toLowerCase();
        $rootScope.wx_client = ua.indexOf('micromessenger') != -1;
         // $rootScope.wx_client = false;
        // var isAndroid = ua.indexOf('android') != -1;
        $rootScope.isIos = (ua.indexOf('iphone') != -1) || (ua.indexOf('ipad') != -1);
        // 微信初始化
        if($rootScope.wx_client){
            $http({
                url: api_uri + "wx/share",
                method: "GET",
                 params: {
                     "url":$location.absUrl()
                 }
            }).success(function(d){
                if (d.returnCode == 0) {
                    wx.config({
                        debug: false,
                        appId: d.result.appid,
                        timestamp: d.result.timestamp,
                        nonceStr: d.result.noncestr,
                        signature: d.result.signature,
                        jsApiList: ["checkJsApi","onMenuShareTimeline","onMenuShareAppMessage","onMenuShareQQ","onMenuShareWeibo","hideMenuItems","showMenuItems","hideAllNonBaseMenuItem","showAllNonBaseMenuItem","translateVoice"],

                    });

                    wx.ready(function(){

                    });
                    wx.error(function(res){
                        console.log(res);
                    });
                }

            }).error(function(data){
                // TODO 请求用户信息异常
            });
        }


        // 页面跳转后
        $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
            var present_route = $location.$$path; //获取当前路由
            var openid = $routeParams.openid;
            //console.log(openid);
            if (openid) {
                $rootScope.putObject("openid", openid);
                var m_params = {
                    "userId": $rootScope.login_user.userId,
                    "token": $rootScope.login_user.userId,
                    "openid": openid
                };
                $http({
                    url: api_uri + "user/wxBind",
                    method: "GET",
                    params: m_params
                }).success(function (d) {
                    console.log(d);
                });


            };
            $rootScope.removeSessionObject("showID");

            if(present_route == "/article/list"){//列表

            }else if(present_route.indexOf("/article/show/")>-1){//详情

            }else if(present_route == "/article/showActivity"){//活动详情

            }else{//其他 无需分享页面
                function onBridgeReady(){
                    wx.hideOptionMenu();
                }
                if (typeof WeixinJSBridge == "undefined"){
                    if( document.addEventListener ){
                        document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                    }else if (document.attachEvent){
                        document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                        document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                    }
                }else{
                    onBridgeReady();
                }
            }
        });

        // 页面跳转前

        $rootScope.$on('$routeChangeStart', function (event, current, previous) {
            //$rootScope.showID = $rootScope.getSessionObject("showID");
            var present_route = $location.$$path; //获取当前路由
            //console.log(present_route);
            $rootScope.check_user();
            if (!$rootScope.login_user) {
                if (no_check_route.indexOf(present_route) > -1) {
                    console.log(present_route);
                } else if (no_check_route.indexOf(present_route) <= -1 && present_route.indexOf("/article/show") > -1) {//详情
                    console.log(present_route);
                } else if (no_check_route.indexOf(present_route) <= -1 && present_route.indexOf("register/step2") > -1) {//详情
                    console.log(present_route);
                } else if (no_check_route.indexOf(present_route) <= -1 && present_route.indexOf("register/reset2") > -1) {//详情
                    console.log(present_route);
                } else {
                    console.log($rootScope.login_user);
                    $rootScope.removeObject("login_user");
                    $rootScope.putSessionObject("present_route", present_route);
                    console.log(present_route);
                    $location.path("/login");
                }
            } else {
                console.log(present_route);
                if (present_route == "/login") {
                    //$location.path("/user/center");
                    //function onBridgeReady() {
                    //    wx.closeWindow();
                    //}
                    //
                    //if (typeof WeixinJSBridge == "undefined") {
                    //    if (document.addEventListener) {
                    //        document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                    //    } else if (document.attachEvent) {
                    //        document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                    //        document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                    //    }
                    //} else {
                    //    onBridgeReady();
                    //}
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
        $rootScope.change = function ($event) {
            $event.stopPropagation();
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
        };
        
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
            //console.log("big");
            $(".singleButtonFixed").addClass("singleButton2");
            $(".singleButton1").addClass("singleButton2");
        };
        $rootScope.touchEnd = function(){
            $(".singleButtonFixed").removeClass("singleButton2");
            $(".singleButton1").removeClass("singleButton2");
        };
        $rootScope.check_user = function () {
            $rootScope.login_user = $rootScope.getObject("login_user");
            if (!$rootScope.login_user) {
                $rootScope.removeObject("login_user");
                $rootScope.present_route = $location.$$path;
                return false;
            }else{
                $http({
                    url: api_uri + "auth/validateAuth",
                    method: "POST",
                    params: $rootScope.login_user
                }).success(function (d) {
                    if (d.returnCode == 0) {
                        console.log("login success");
                        return true;
                    } else {
                        //$rootScope.login_user = {};
                        $rootScope.removeObject("login_user");
                        $rootScope.present_route = $location.$$path;
                        console.log($rootScope.present_route,'nihao');
                        if (no_check_route.indexOf($rootScope.present_route) <= -1
                            && $rootScope.present_route.indexOf("article/show")<= -1
                            && $rootScope.present_route.indexOf("register/step2") <= -1
                            && $rootScope.present_route.indexOf("register/reset2") <= -1) {
                            $rootScope.putSessionObject("present_route", $rootScope.present_route);
                        } else if ($rootScope.present_route = "/login") {
                            $rootScope.putSessionObject("present_route", $rootScope.present_route);
                        }

                        return false;
                    }

                }).error(function (d) {
                    //$rootScope.removeObject("login_user");
                    //$rootScope.present_route = $location.$$path;
                    //$rootScope.putSessionObject("present_route", $rootScope.present_route);
                    //$location.path("/login");
                    return false;
                });
            }

        };


        if (!window.localStorage) {
            alert('This browser does NOT support localStorage');
        }

        if (!window.sessionStorage) {
            alert('This browser does NOT support sessionStorage');
        }
    }]);
