var articleCtrl = angular.module('articleCtrl', []);

articleCtrl.controller('ArticleListCtrl', function ($http, $scope, $rootScope, $location) {

    $scope.init = function () {//微信分享
        $scope.shareData = {
            title: '直融号',
            desc: '打造企业最低融资成本',
            link: "http://app.supeiyunjing.com/#/article/list",
            imgUrl: "http://app.supeiyunjing.com/img/share.png"
        };
        wx.ready(function () {
            wx.onMenuShareAppMessage($scope.shareData);
            wx.onMenuShareTimeline($scope.shareData);
            wx.onMenuShareQQ($scope.shareData);
            wx.onMenuShareWeibo($scope.shareData);
        });
    };

    $scope.init();

    var result_list = [];

    $scope.list = function (pageNo, pageSize) {//产品列表
        var m_params = {
            pageNo: pageNo,
            pageSize: pageSize
        };
        $http({
            url: api_uri + "financialProduct/list",
            method: "GET",
            params: m_params
        }).success(function (d) {
            console.log(d);
            if (d.returnCode == 0) {
                //result_list = result_list.concat(d.result.datas);
                //$scope.result_list = result_list;
                $scope.result_list = d.result.datas;
                //$scope.nextPage = d.result.nextPage;
                //$scope.pageNo = d.result.pageNo;
                $scope.totalCount = d.result.totalCount;
                //$scope.totalPage = d.result.totalPage;
                //if($scope.totalCount >10){
                // $scope.list(1,$scope.totalCount);
                //}
            }
            else {
                console.log(d.result);
            }

        }).error(function (d) {
            console.log("login error");
            $location.path("/error");
        })
    };
    $scope.list(1, 100);


    $scope.result_list = {
        result: {},
        returnCode: 0
    };

    $scope.article_show = function (id) {
        id.good = true;
        if (!$rootScope.isNullOrEmpty(id.id)) {

            //$rootScope.putSessionObject("showID",id.id);
            $location.path("/article/show/" + id.id);
            id.good = false;
            //console.log(id.id);
        }
    };

});

articleCtrl.controller('ArticleShowCtrl', function ($http, $scope, $rootScope, $location, $routeParams) {

    $scope.init = function () {
        $scope.bt_show = 0;
        $http({
            url: api_uri + "financialProduct/detail/" + $routeParams.id,
            method: "GET",
            //params: $rootScope.login_user
        }).success(function (d) {
            console.log(d);
            if (d.returnCode == 0) {
                $scope.article_detail = d.result;
                $scope.feature_list = d.result.feature;
                $scope.apply_List = d.result.conditions;
                $scope.id = d.result.id;

                var desc = "";
                if ($scope.article_detail.ratecap && $scope.article_detail.ratefloor) {
                    desc += "利息率:" + $scope.article_detail.ratecap + "%~" + $scope.article_detail.ratefloor + "%\r\n";
                }
                if ($scope.article_detail.loanvalue) {
                    desc += "贷款额度:" + $scope.article_detail.loanvalue + "万\r\n";
                }
                if ($scope.article_detail.loanlife) {
                    desc += "贷款期限:" + $scope.article_detail.loanlife + "年";
                }
                $scope.shareData = {
                    title: $scope.article_detail.name,
                    desc: desc,
                    link: "http://app.supeiyunjing.com/#/article/show/" + $routeParams.id,
                    imgUrl: "http://app.supeiyunjing.com/img/share.png"
                };
                wx.ready(function () {
                    wx.onMenuShareAppMessage($scope.shareData);
                    wx.onMenuShareTimeline($scope.shareData);
                    wx.onMenuShareQQ($scope.shareData);
                    wx.onMenuShareWeibo($scope.shareData);
                });

            } else {
                console.log(d);
            }
        }).error(function (d) {
            console.log("login error");
            //$location.path("/error");
        });


    };
    $scope.init();
    $scope.apply = function (id) {
        $rootScope.present_route = $location.$$path;
        if (!$rootScope.isNullOrEmpty(id)) {
            $location.path("/article/apply/" + id);
        }
    };
});

articleCtrl.controller('applyCtrl', function ($http, $scope, $rootScope, $location, $timeout, $routeParams) {
    $scope.init = function () {
        //获取用户信息
        $http({
            url: api_uri + "user/setting",
            method: "GET",
            params: $rootScope.login_user
        }).success(function (d) {
            console.log(d);
            if (d.returnCode == 0) {
                $scope.company = d.result;
                $scope.init_role();
            } else {
                console.log(d);
            }
        }).error(function (d) {
            console.log(d);
        });
    };
    $scope.init();
    $scope.init_role = function () {
        $scope.bt_show = 0;
        $http({
            url: api_uri + "user/role",
            method: "GET",
            params: $rootScope.login_user
        }).success(function (d) {
            console.log(d);
            if (d.returnCode == 0) {
                $scope.role = d.result;
                console.log($scope.role, "baiyang");
            } else {
                console.log(d);
            }
        }).error(function (d) {
        });
    };
    $scope.submit = function () {
        var m_params = {
            userId: $rootScope.login_user.userId,
            token: $rootScope.login_user.token,
            companyName: $scope.company.companyName,
            linkman: $scope.company.name,
            mobile: $scope.company.mobile,
            fee: $scope.company.fee,
            productId: $routeParams.id
        };
        console.log(m_params.companyName + "baiyang");
        if (typeof(m_params.companyName) == "undefined" || m_params.companyName == '') {
            $scope.company.errorMsg = "公司名称不能为空";
            $timeout(function () {
                $scope.company.errorMsg = "";
            }, 2000);
        } else if (typeof(m_params.linkman) == "undefined" || m_params.linkman == '') {
            $scope.company.errorMsg = "联系人不能为空";
            $timeout(function () {
                $scope.company.errorMsg = "";
            }, 2000);
        } else if (typeof(m_params.mobile) == "undefined" || m_params.mobile == '') {
            $scope.company.errorMsg = "联系电话不能为空";
            $timeout(function () {
                $scope.company.errorMsg = "";
            }, 2000);
        } else {
            $.ajax({
                type: 'POST',
                url: api_uri + "loanApplication/create",
                data: m_params,
                traditional: true,
                success: function (data, textStatus, jqXHR) {
                    console.log(data);
                    if (data.returnCode == 0) {
                        //$scope.get_telesales_detail();
                        $(".alertApply").css("display", "block");
                        $timeout(function () {
                            $(".alertApply").css("display", "none");
                            $location.path("/user/center");
                        }, 2000);
                        $scope.$apply();
                    }
                    else if (data.returnCode == 1001) {
                        // console.log(data);
                        $scope.company.errorMsg = "贵公司已经申请过此产品";
                        $timeout(function () {
                            $scope.company.errorMsg = "";
                        }, 2000);
                        $scope.$apply();
                    } else if (data.returnCode == 1004) {

                    } else {
                        $location.path("/login");
                    }
                },
                dataType: 'json',
            });
        }
    };

});
;
var loginCtrl = angular.module('loginCtrl', []);

loginCtrl.controller('LoginCtrl', function ($http, $scope, $rootScope, $location, $timeout) {
    $scope.$root.title = "登陆";
    $scope.loginUser = {
        "mobile": "",
        "password": ""
    };

    $scope.error_code_msg = {
        1003: "该用户不存在",
        2001: "用户名或密码错误",
        1002: "该用户异常",
        1: "服务器异常,请稍后再试"
    };

    var check_params = function (params) {
        if (params.mobile == "" || params.password == "") {
            return false;
        }
        return true;
    };
    $scope.changeErrorMsg = function (msg) {
        $scope.error_msg = msg;
        $timeout(function () {
            //$scope.changeErrorMsg("");
            $scope.error_msg = "";
        }, 5000);
    };

    $scope.textChange = function (e) {
        $scope.error_msg = ""
    };

    $scope.loginUser = {
        "mobile": "",
        "code": ""
    };

    $scope.ngBlur = function () {
        if ($rootScope.isNullOrEmpty($scope.loginUser.mobile)) {
            $scope.changeErrorMsg("手机号码不能为空");
            //$scope.error_msg = "手机号码不能为空"
            $("#mobile").focus();
        } else {
            $http({
                url: api_uri + "reg/validateMobile",
                method: "GET",
                params: {"mobile": $scope.loginUser.mobile}
            }).success(function (d) {
                if (d.returnCode == 1001) {
                    $scope.enableMobile = true;
                    //$scope.success_msg = "手机号输入正确";
                }
                else {
                    $scope.enableMobile = false;
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
            url: api_uri + "auth/web",
            method: "POST",
            params: m_params
        }).success(function (d) {
            if (d.returnCode == 0) {
                console.log(d);
                $rootScope.login_user = {
                    "userId": d.result.split("_")[0],
                    "token": d.result.split("_")[1]
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
            } else {

                var msg = $scope.error_code_msg[d.returnCode];
                if (!msg) {
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

    $scope.reset = function () {
        $location.path("/register/reset1");
    };
});
;
var registerCtrl = angular.module('registerCtrl', []);

registerCtrl.controller('RegStep1Ctrl', function ($http, $scope, $rootScope, $location, $timeout) {
    $scope.registerUser = {
        "mobile": "",
        "code": ""
    };
    $scope.isVerify = false;//是否允许下一步
    //$scope.isVerify = true;//是否允许下一步
    //$scope.enableMobile = true;//手机号码是否可用
    $scope.enableMobile = false;//手机号码是否可用

    $scope.error_msg = "";

    $("#mobile").focus();

    $scope.changeErrorMsg = function (msg) {
        $scope.error_msg = msg;
        $timeout(function () {
            $scope.changeErrorMsg("");
        }, 5000);
    };

    //发送短信 倒计时
    $scope.sms_second = 60;
    $scope.send_sms = true;
    $scope.times = function () {
        if ($scope.sms_second > 0) {
            $scope.send_sms = false;
            $scope.sms_second--;
            $timeout(function () {
                $scope.times();
            }, 1000);
        } else if ($scope.sms_second <= 0) {
            $scope.send_sms = true;
            $scope.sms_second = 60;
        }
    }

    $scope.send_code = function () {
        if ($rootScope.isNullOrEmpty($scope.registerUser.mobile)) {
            $scope.changeErrorMsg("手机号码不能为空");
            $("#mobile").focus();
        } else {
            $http({
                url: api_uri + "reg/validateMobile",
                method: "GET",
                params: {"mobile": $scope.registerUser.mobile}
            }).success(function (d) {
                console.log(d);
                if (d.returnCode == 0) {
                    $scope.enableMobile = true;
                    $scope.times();
                    $http({
                        url: api_uri + "reg/sendSms",
                        method: "GET",
                        params: {
                            "mobile": $scope.registerUser.mobile,
                            "token": $rootScope.encryptByDES($scope.registerUser.mobile),
                            "timestamp": moment().format('X')
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
                } else if (d.returnCode == 1001) {
                    $scope.enableMobile = false;
                    $scope.changeErrorMsg("用户已经注册");
                } else if (d.returnCode == 2102) {
                    $scope.enableMobile = false;
                    $scope.changeErrorMsg("手机号错误");
                } else {
                    $scope.changeErrorMsg(d.returnCode);
                }

            }).error(function (d) {
                console.log("login error");
            })
        }
    }

    $scope.changeCode = function () {
        if ($scope.enableMobile && !$rootScope.isNullOrEmpty($scope.registerUser.code)) {
            $scope.isVerify = true;
        } else {
            $scope.isVerify = false;
        }
    };


    $scope.validateCode = function () {
        if ($scope.isVerify) {
            $http({
                url: api_uri + "reg/validateSms",
                method: "POST",
                params: $scope.registerUser
            }).success(function (d) {
                console.log(d);
                if (d.returnCode == 0) {
                    $location.path("/register/step2/" + $scope.registerUser.mobile + "/" + d.result);
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

registerCtrl.controller('RegStep2Ctrl', function ($http, $scope, $rootScope, $location, $routeParams, $timeout) {

    $scope.registerUser = {
        "mobile": $routeParams.mobile,
        "password": "",
        "validatePwd": "",
        "token": $routeParams.token
    };

    $scope.changeErrorMsg = function (msg) {
        $scope.error_msg = msg;
        $timeout(function () {
            $scope.changeErrorMsg("");
        }, 5000);
    };
    $scope.ngBlur = function () {
        console.log("ng-blur")
        var reg_str = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,12}$/;
        if (reg_str.test($scope.registerUser.password)) {
        } else {
            $scope.error_msg = "密码必须是6-12位字母+数字"
        }
    }
    $scope.textChange = function (e) {
        //console.log("bianhuale")
        var reg_str = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,12}$/;
        if (reg_str.test($scope.registerUser.password)) {
            $scope.success_msg = "密码格式正确";
            $scope.error_msg = ""
        } else {
            $scope.success_msg = "";
            $scope.error_msg = "密码必须是6-12位字母+数字"
        }
    }
    $scope.textChange2 = function (e) {
        //console.log("bianhuale")
        var reg_str = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,12}$/;
        if ($scope.registerUser.password == $scope.registerUser.validatePwd && reg_str.test($scope.registerUser.password)) {
            $scope.success_msg = "点击注册按钮，注册用户";
            $scope.error_msg = ""
        } else {
            $scope.success_msg = "";
            $scope.error_msg = "两次输入的密码不一致"
        }
    }
    $scope.user_register = function () {
        var reg_str = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,12}$/;
        if ($scope.registerUser.password == $scope.registerUser.validatePwd && reg_str.test($scope.registerUser.password)) {
            $http({
                url: api_uri + "reg/regist",
                method: "POST",
                params: $scope.registerUser
            }).success(function (d) {
                if (d.returnCode == 0) {
                    alert("注册成功");
                    $rootScope.putObject("login_mobile", $scope.registerUser.mobile);
                    $http({
                        url: api_uri + "auth/web",
                        method: "POST",
                        params: {
                            "mobile": $scope.registerUser.mobile,
                            "password": $scope.registerUser.password
                        }
                    }).success(function (d) {
                        console.log(d);
                        if (d.returnCode == 0) {
                            $rootScope.login_user = {
                                "userId": d.result.split("_")[0],
                                "token": d.result.split("_")[1]
                            }
                            $rootScope.putObject("login_user", $rootScope.login_user);
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
        } else {
            if ($scope.registerUser.password != $scope.registerUser.validatePwd) {
                $scope.changeErrorMsg("两次密码输入的不一致");
            } else if (!reg_str.test($scope.registerUser.password)) {
                $scope.changeErrorMsg("密码强度不够,必须包含数字和字母");
            }
        }
    };

});

registerCtrl.controller('ResetStep1Ctrl', function ($http, $scope, $rootScope, $location, $timeout) {
    $scope.resetUser = {
        "mobile": "",
        "code": ""
    };
    $scope.isVerify = false;//是否允许下一步

    $scope.enableMobile = false;//手机号码是否可用

    $scope.error_msg = "";

    $scope.changeErrorMsg = function (msg) {
        $scope.error_msg = msg;
        $timeout(function () {
            $scope.changeErrorMsg("");
        }, 5000);
    };

    //发送短信 倒计时
    $scope.sms_second = 60;
    $scope.send_sms = true;
    $scope.times = function () {
        if ($scope.sms_second > 0) {
            $scope.send_sms = false;
            $scope.sms_second--;
            $timeout(function () {
                $scope.times();
            }, 1000);
        } else if ($scope.sms_second <= 0) {
            $scope.send_sms = true;
            $scope.sms_second = 60;
        }
    };

    $scope.send_code = function () {
        if ($rootScope.isNullOrEmpty($scope.resetUser.mobile)) {
            $scope.changeErrorMsg("手机号码不能为空");
            $("#mobile").focus();
        } else {
            $http({
                url: api_uri + "reg/validateMobile",
                method: "GET",
                params: {"mobile": $scope.resetUser.mobile}
            }).success(function (d) {
                if (d.returnCode == 1001) {
                    $scope.enableMobile = true;
                    $scope.times();
                    $http({
                        url: api_uri + "reg/sendSms2",
                        method: "GET",
                        params: {
                            "mobile": $scope.resetUser.mobile,
                            "token": $rootScope.encryptByDES($scope.resetUser.mobile),
                            "timestamp": moment().format('X')
                        }
                    }).success(function (d) {
                        console.log(d);
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
                } else if (d.returnCode == 2102) {
                    console.log(d);
                    $scope.enableMobile = false;
                    $scope.changeErrorMsg("手机号码错误");
                } else if (d.returnCode == 0) {
                    console.log(d);
                    $scope.enableMobile = false;
                    $scope.changeErrorMsg("手机号码未注册");
                }

            }).error(function (d) {
                console.log("login error");
            })
        }
    };

    $scope.changeCode = function () {
        if ($scope.enableMobile && !$rootScope.isNullOrEmpty($scope.resetUser.code)) {
            $scope.isVerify = true;
        } else {
            $scope.isVerify = false;
        }
    };


    $scope.validateCode = function () {
        if ($scope.isVerify) {
            $http({
                url: api_uri + "reg/validateSms",
                method: "POST",
                params: $scope.resetUser
            }).success(function (d) {
                if (d.returnCode == 0) {
                    $location.path("/register/reset2/" + $scope.resetUser.mobile + "/" + d.result);
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

registerCtrl.controller('ResetStep2Ctrl', function ($http, $scope, $rootScope, $location, $routeParams) {

    $scope.resetUser = {
        "mobile": $routeParams.mobile,
        "password": "",
        "validatePwd": "",
        "token": $routeParams.token
    };
    $scope.textChange = function (e) {
        //console.log("bianhuale")
        var reg_str = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,12}$/;
        if (reg_str.test($scope.resetUser.password)) {
            $scope.success_msg = "密码格式正确";
            $scope.error_msg = ""
        } else {
            $scope.success_msg = "";
            $scope.error_msg = "密码必须是6-12位字母+数字"
        }
    }
    $scope.textChange2 = function (e) {
        //console.log("bianhuale")
        var reg_str = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,12}$/;
        if ($scope.resetUser.password == $scope.resetUser.validatePwd && reg_str.test($scope.resetUser.password)) {
            $scope.success_msg = "点击重置按钮，重置密码";
            $scope.error_msg = ""
        } else {
            $scope.success_msg = "";
            $scope.error_msg = "两次输入的密码不一致"
        }
    }
    $scope.user_reset = function () {
        $http({
            url: api_uri + "reg/reset",
            method: "POST",
            params: $scope.resetUser
        }).success(function (d) {
            if (d.returnCode == 0) {
                alert("重置密码成功");
                $rootScope.putObject("login_mobile", $scope.resetUser.mobile);
                $http({
                    url: api_uri + "auth/web",
                    method: "POST",
                    params: {
                        "mobile": $scope.resetUser.mobile,
                        "password": $scope.resetUser.password
                    }
                }).success(function (d) {
                    if (d.returnCode == 0) {
                        $rootScope.login_user = {
                            "userId": d.result.split("_")[0],
                            "token": d.result.split("_")[1]
                        }
                        $rootScope.putObject("login_user", $rootScope.login_user);
                        $location.path("/article/list");
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
userCtrl.controller('UserCenterCtrl', function ($http, $scope, $rootScope, $timeout, $location) {
    var result_list = [];
    $scope.init = function () {
        //获取个人信息 以及各种列表数量
        if ($rootScope.login_user.userId == null || $rootScope.login_user.userId == "") {
            $location.path("/login");
        } else {
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
                    $scope.headImg = d.result.headImg;
                } else {
                    console.log(d);
                    $rootScope.removeObject("login_user");
                    $location.path("/login");
                }
                $scope.init_role();
            }).error(function (d) {
                console.log(d);
                $rootScope.removeObject("login_user");
                $location.path("/login");
            });
            $scope.list(1, $scope.totalCount);
            $scope.myList(1, $scope.myTotalCount);
        }
    };
    $scope.message = false;

    $scope.init_role = function () {
        $scope.bt_show = 0;
        $http({
            url: api_uri + "user/role",
            method: "GET",
            params: $rootScope.login_user
        }).success(function (d) {
            console.log(d);
            if (d.returnCode == 0) {
                $scope.role = d.result;
                console.log($scope.role, "baiyang");
            } else {
                console.log(d);
            }
        }).error(function (d) {
        });
    };

    $scope.list = function (pageNo, pageSize) {
        if (!$scope.type) {
            $scope.type = "1";
        }
        var m_params = {
            userId: $rootScope.login_user.userId,
            token: $rootScope.login_user.token,
            pageNo: pageNo,
            pageSize: pageSize
        };
        $http({
            url: api_uri + "loanApplication/list",
            method: "GET",
            params: m_params
        }).success(function (d) {
            console.log(d);
            if (d.returnCode == 0) {
                if (d.result.totalCount == 0) {
                    $scope.message_list = false;
                } else {
                    $scope.result_list = d.result.datas;
                    $scope.totalCount = d.result.totalCount;
                    angular.forEach($scope.result_list, function (data) {
                        if ($scope.type == 0) {
                            /*data.jindu = "0";
                             data.jindushow = "未发布";
                             data.jinduShowM = "0";*/
                        } else if ($scope.type == 1) {
                            if (data.status == 1) {
                                data.jindu = "10";
                                data.triangle = "8";
                                data.textPosition = "2";
                                data.progressText = "审核中";
                                $scope.message = true;
                            } else if (data.status == 2) {
                                data.jindu = "50";
                                data.triangle = "44";
                                data.textPosition = "36";
                                data.progressText = "约见中";
                                $scope.message = true;
                            } else if (data.status == 3) {
                                data.jindu = "75";
                                data.triangle = "66";
                                data.textPosition = "58";
                                data.progressText = "跟进中";
                                $scope.message = true;
                            } else if (data.status == 4) {
                                data.jindu = "100";
                                data.triangle = "86";
                                data.textPosition = "76";
                                data.progressText = "成功融资";
                                $scope.message = true;
                            } else if (data.status == -1) {
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
        result: {},
        returnCode: 0
    };

    $scope.myList = function (pageNo, pageSize) {
        if (!$scope.type) {
            $scope.type = "1";
        }
        var m_params = {
            userId: $rootScope.login_user.userId,
            token: $rootScope.login_user.token,
            pageNo: pageNo,
            pageSize: pageSize
        };
        $http({
            url: api_uri + "loanApplication/myList",
            method: "GET",
            params: m_params
        }).success(function (d) {
            console.log(d);
            if (d.returnCode == 0) {
                if (d.result.totalCount == 0) {
                    $scope.message_myList = false;
                    if ($scope.message_myList == false && $scope.message_list == false) {
                        $scope.message = false;
                    }
                } else {

                    //result_list =result_list.concat(d.result.datas);
                    $scope.my_list = d.result.datas;
                    //$scope.nextPage = d.result.nextPage;
                    //$scope.pageNo = d.result.pageNo;
                    $scope.myTotalCount = d.result.totalCount;
                    angular.forEach($scope.my_list, function (data) {
                        if ($scope.type == 0) {
                            /*data.jindu = "0";
                             data.jindushow = "未发布";
                             data.jinduShowM = "0";*/
                        } else if ($scope.type == 1) {
                            if (data.status == 1) {
                                data.jindu = "10";
                                data.triangle = "8";
                                data.textPosition = "2";
                                data.progressText = "审核中";
                                data.progressTextNext = "开始约见";
                                $scope.message = true;
                            } else if (data.status == 2) {
                                data.jindu = "50";
                                data.triangle = "44";
                                data.textPosition = "36";
                                data.progressText = "约见中";
                                data.progressTextNext = "继续跟进";
                                $scope.message = true;
                            } else if (data.status == 3) {
                                data.jindu = "75";
                                data.triangle = "66";
                                data.textPosition = "58";
                                data.progressText = "跟进中";
                                data.progressTextNext = "完成贷款";
                                $scope.message = true;
                            } else if (data.status == 4) {
                                data.jindu = "100";
                                data.triangle = "86";
                                data.textPosition = "76";
                                data.progressText = "成功融资";
                                $scope.message = true;
                            } else if (data.status == -1) {
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
        result: {},
        returnCode: 0
    };

    $scope.alert = false;
    $scope.alert_come = function (status, id, days) {
        $scope.dateTime = days;
        $scope.alert = true;
        $scope.applyId = id;
        $scope.status = status;
        $(".alert").css("top", $(document).scrollTop());
        $scope.alertText = "预计时间";
        $scope.alertText1 = "备注内容";
        $scope.alertText2 = "企业方需要补充一张个人征信表和法人的身份证证件";
    };
    $scope.alert_come1 = function (status, id, days) {
        $scope.dateTime = days;
        $scope.alert = true;
        $scope.applyId = id;
        $scope.status = status;
        $(".alert").css("top", $(document).scrollTop());

        $scope.alertText = "延长时间";
        $scope.alertText1 = "说明原因";
        $scope.alertText2 = "企业方征信问题没有及时提交，请尽快提交到位";
    };
    $scope.expectDateBank = "";
    $scope.init();

    $scope.userDetail = function () {
        $location.path("/user/setting/");
    };

    $scope.company_detail = function (id) {
        if (!$rootScope.isNullOrEmpty(id)) {
            $location.path("/user/companyDetail/" + id);
        }
    };

    $scope.closeAlert = function (name, $event) {
        $scope.alert = false;
        if ($scope.stopPropagation) {
            $event.stopPropagation();
        }
    };
    $scope.sure = function () {
        var params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "days": $scope.dateTime,
            "reason": $scope.reason,
            "applyId": $scope.applyId,
            "status": $scope.status,
        };
        console.log(params);
        $.ajax({
            type: 'POST',
            url: api_uri + "applyBankDeal/refer",
            data: params,
            traditional: true,
            success: function (data, textStatus, jqXHR) {
                console.log(data);
                if (data.returnCode == 0) {
                    $scope.alert = false;
                    $scope.show();
                    $scope.$apply();

                }
                else {
                    console.log(data);
                }
            },
            dataType: 'json',
        });
    };

    $scope.show = function () {
        $scope.bt_show = 0;
        $http({
            url: api_uri + "applyBankDeal/show",
            method: "GET",
            params: $rootScope.login_user
        }).success(function (d) {
            console.log(d);
            if (d.returnCode == 0) {
            } else {
                console.log(d);
            }
        }).error(function (d) {
        });
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
            } else {
                console.log(d);
            }
        }).error(function (d) {
            console.log("login error");
            $location.path("/error");
        });
    };
    $scope.init();

    $scope.alertCancel = function () {
        $(".coverAlert").css("display", "block");
        $(".cancelAlert").css("display", "block");
    };
    $scope.alertExit = function () {
        $(".coverAlert").css("display", "none");
        $(".cancelAlert").css("display", "none");
    }

    $scope.cancel = function () {
        var m_params = {
            userId: $rootScope.login_user.userId,
            token: $rootScope.login_user.token,
            status: -1
        };
        $http({
            url: api_uri + "loanApplication/cancel/" + $routeParams.id,
            method: "GET",
            params: m_params
        }).success(function (d) {
            console.log(d);
            if (d.returnCode == 0) {
                $location.path("/user/center");
            } else {
                console.log(d);
            }
        }).error(function (d) {
            console.log("login error");
            $location.path("/error");
        });
    };


});


userCtrl.controller('SettingCtrl', //用户设置
    ['$scope', '$rootScope', '$location', '$http', function ($scope, $rootScope, $location, $http) {
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
                } else {
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
        $scope.reset = function () {
            $location.path("/register/reset1");
        };


        $scope.update = function (key, value) {
            if (!$rootScope.isNullOrEmpty(key)) {
                if ($rootScope.isNullOrEmpty(value)) value = "";
                $rootScope.putObject("user_update", key + "=" + value);
                $location.path("/user/update");
            }
        };

        $scope.logout = function () {
            $http({
                url: api_uri + "auth/logout",
                method: "GET",
                params: $rootScope.login_user
            }).success(function (d) {
                console.log(d);
            }).error(function (d) {
                console.log(d);
            });
            $rootScope.removeObject("login_user", $rootScope.login_user);
            $rootScope.login_user = {};
            $location.path("/login");
        };
    }]);

userCtrl.controller('UserUpdateCtrl',
    ['$scope', '$rootScope', '$location', '$http', function ($scope, $rootScope, $location, $http) {

        $scope.init = function () {
            var user_update = $rootScope.getObject("user_update");
            if (user_update && user_update.indexOf("=")) {
                $rootScope.removeObject("user_update");
                $scope.update_user = {};
                $scope.update_user.key = user_update.split("=")[0];
                $scope.update_user.value = user_update.split("=")[1];
            }
        };

        $scope.init();

        $scope.sure = function () {
            var params = $rootScope.login_user;
            params.key = $scope.update_user.key;
            params.value = $scope.update_user.value;
            //params.position = $scope.update_user.position;
            console.log(params);
            var keys = ["name", "position"];
            if ($.inArray(params.key, keys) >= 0) {
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
    }]);
;api_uri = "http://123.206.84.74/api/";
//api_uri = "http://api.supeiyunjing.com/";
//api_uri = "http://172.17.2.13:8080/api/";
//api_uri = "http://172.16.97.95:8080/api/";
templates_root = "templates/";
deskey = "abc123.*abc123.*abc123.*abc123.*";
root_uri = "http://app.supeiyunjing.com/#";

var myApp = angular.module('myApp', [
    'ng', 'ngRoute', 'ngAnimate', 'loginCtrl', 'registerCtrl', 'articleCtrl', 'userCtrl', 'ngTouchstart', 'ngTouchmove', 'ngTouchend'
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
        $rootScope.wx_client = false;
        // var isAndroid = ua.indexOf('android') != -1;
        $rootScope.isIos = (ua.indexOf('iphone') != -1) || (ua.indexOf('ipad') != -1);
        // 微信初始化
        if ($rootScope.wx_client) {
            $http({
                url: api_uri + "wx/share",
                method: "GET",
                params: {
                    "url": $location.absUrl()
                }
            }).success(function (d) {
                if (d.returnCode == 0) {
                    wx.config({
                        debug: false,
                        appId: d.result.appid,
                        timestamp: d.result.timestamp,
                        nonceStr: d.result.noncestr,
                        signature: d.result.signature,
                        jsApiList: ["checkJsApi", "onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQQ", "onMenuShareWeibo", "hideMenuItems", "showMenuItems", "hideAllNonBaseMenuItem", "showAllNonBaseMenuItem", "translateVoice"],

                    });

                    wx.ready(function () {

                    });
                    wx.error(function (res) {
                        console.log(res);
                    });
                }

            }).error(function (data) {
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


            }
            ;
            $rootScope.removeSessionObject("showID");

            if (present_route == "/article/list") {//列表

            } else if (present_route.indexOf("/article/show/") > -1) {//详情

            } else {//其他 无需分享页面
                function onBridgeReady() {
                    wx.hideOptionMenu();
                }

                if (typeof WeixinJSBridge == "undefined") {
                    if (document.addEventListener) {
                        document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                    } else if (document.attachEvent) {
                        document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                        document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                    }
                } else {
                    onBridgeReady();
                }
            }
        });

        // 页面跳转前

        $rootScope.$on('$routeChangeStart', function (event, current, previous) {
            //$rootScope.showID = $rootScope.getSessionObject("showID");
            var present_route = $location.$$path; //获取当前路由
            $rootScope.check_user();
            if (!$rootScope.login_user) {
                if (no_check_route.indexOf(present_route) > -1) {
                    console.log(present_route);
                } else if (no_check_route.indexOf(present_route) <= -1 && present_route.indexOf("/article/show/") > -1) {//详情
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
        $rootScope.isNullOrEmpty = function (strVal) {
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

        $rootScope.transFn = function (obj) {
            var str = [];
            for (var p in obj) {
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
        $rootScope.touchStart = function () {
            //console.log("big");
            $(".singleButtonFixed").addClass("singleButton2");
            $(".singleButton1").addClass("singleButton2");
        };
        $rootScope.touchEnd = function () {
            $(".singleButtonFixed").removeClass("singleButton2");
            $(".singleButton1").removeClass("singleButton2");
        }
        $rootScope.check_user = function () {
            $rootScope.login_user = $rootScope.getObject("login_user");
            console.log($rootScope.login_user);
            //if (!$rootScope.login_user) {
            //    $rootScope.removeObject("login_user");
            //    //$location.path("/login");
            //    return false;
            //}
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
                    $rootScope.removeObject("login_user");
                    $rootScope.present_route = $location.$$path;
                    if (no_check_route.indexOf($rootScope.present_route) <= -1 && $rootScope.present_route.indexOf("register/step2") <= -1 && $rootScope.present_route.indexOf("register/reset2") <= -1) {
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
        };


        if (!window.localStorage) {
            alert('This browser does NOT support localStorage');
        }

        if (!window.sessionStorage) {
            alert('This browser does NOT support sessionStorage');
        }
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