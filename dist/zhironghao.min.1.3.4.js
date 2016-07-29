/*! zhironghao 29-07-2016 */
var articleCtrl = angular.module("articleCtrl", []);
articleCtrl.controller("ArticleListCtrl", function ($http, $scope, $rootScope, $location) {
    $scope.init = function () {
        $scope.shareData = {
            title: "直融号",
            desc: "打造企业最低融资成本",
            link: "http://app.supeiyunjing.com/#/article/list",
            imgUrl: "http://app.supeiyunjing.com/img/share.png"
        }, wx.ready(function () {
            wx.onMenuShareAppMessage($scope.shareData), wx.onMenuShareTimeline($scope.shareData), wx.onMenuShareQQ($scope.shareData), wx.onMenuShareWeibo($scope.shareData)
        })
    }, $scope.init();
    $scope.list = function (pageNo, pageSize) {
        var m_params = {pageNo: pageNo, pageSize: pageSize};
        $http({url: api_uri + "financialProduct/list", method: "GET", params: m_params}).success(function (d) {
            console.log(d), 0 == d.returnCode ? ($scope.result_list = d.result.datas, $scope.totalCount = d.result.totalCount) : console.log(d.result)
        }).error(function (d) {
            console.log("login error"), $location.path("/error")
        })
    }, $scope.list(1, 100), $scope.result_list = {result: {}, returnCode: 0}, $scope.article_show = function (id) {
        id.good = !0, $rootScope.isNullOrEmpty(id.id) || ($location.path("/article/show/" + id.id), id.good = !1)
    }
}), articleCtrl.controller("ArticleShowCtrl", function ($http, $scope, $rootScope, $location, $routeParams) {
    $scope.init = function () {
        $scope.bt_show = 0, $http({
            url: api_uri + "financialProduct/detail/" + $routeParams.id,
            method: "GET"
        }).success(function (d) {
            if (console.log(d), 0 == d.returnCode) {
                $scope.article_detail = d.result, $scope.feature_list = d.result.feature, $scope.apply_List = d.result.conditions, $scope.id = d.result.id;
                var desc = "";
                $scope.article_detail.ratecap && $scope.article_detail.ratefloor && (desc += "利息率:" + $scope.article_detail.ratecap + "%~" + $scope.article_detail.ratefloor + "%\r\n"), $scope.article_detail.loanvalue && (desc += "贷款额度:" + $scope.article_detail.loanvalue + "万\r\n"), $scope.article_detail.loanlife && (desc += "贷款期限:" + $scope.article_detail.loanlife + "年"), $scope.shareData = {
                    title: $scope.article_detail.name,
                    desc: desc,
                    link: "http://app.supeiyunjing.com/#/article/show/" + $routeParams.id,
                    imgUrl: "http://app.supeiyunjing.com/img/share.png"
                }, wx.ready(function () {
                    wx.onMenuShareAppMessage($scope.shareData), wx.onMenuShareTimeline($scope.shareData), wx.onMenuShareQQ($scope.shareData), wx.onMenuShareWeibo($scope.shareData)
                })
            } else console.log(d)
        }).error(function (d) {
            console.log("login error")
        })
    }, $scope.init(), $scope.apply = function (id) {
        $rootScope.present_route = $location.$$path, $rootScope.isNullOrEmpty(id) || $location.path("/article/apply/" + id)
    }
}), articleCtrl.controller("applyCtrl", function ($http, $scope, $rootScope, $location, $timeout, $routeParams) {
    $scope.init = function () {
        $http({url: api_uri + "user/setting", method: "GET", params: $rootScope.login_user}).success(function (d) {
            console.log(d), 0 == d.returnCode ? ($scope.company = d.result, $scope.init_role()) : console.log(d)
        }).error(function (d) {
            console.log(d)
        })
    }, $scope.init(), $scope.init_role = function () {
        $scope.bt_show = 0, $http({
            url: api_uri + "user/role",
            method: "GET",
            params: $rootScope.login_user
        }).success(function (d) {
            console.log(d), 0 == d.returnCode ? ($scope.role = d.result, console.log($scope.role, "baiyang")) : console.log(d)
        }).error(function (d) {
        })
    }, $scope.submit = function () {
        var m_params = {
            userId: $rootScope.login_user.userId,
            token: $rootScope.login_user.token,
            companyName: $scope.company.companyName,
            linkman: $scope.company.name,
            mobile: $scope.company.mobile,
            fee: $scope.company.fee,
            productId: $routeParams.id
        };
        console.log(m_params.companyName + "baiyang"), "undefined" == typeof m_params.companyName || "" == m_params.companyName ? ($scope.company.errorMsg = "公司名称不能为空", $timeout(function () {
            $scope.company.errorMsg = ""
        }, 2e3)) : "undefined" == typeof m_params.linkman || "" == m_params.linkman ? ($scope.company.errorMsg = "联系人不能为空", $timeout(function () {
            $scope.company.errorMsg = ""
        }, 2e3)) : "undefined" == typeof m_params.mobile || "" == m_params.mobile ? ($scope.company.errorMsg = "联系电话不能为空", $timeout(function () {
            $scope.company.errorMsg = ""
        }, 2e3)) : $.ajax({
            type: "POST",
            url: api_uri + "loanApplication/create",
            data: m_params,
            traditional: !0,
            success: function (data, textStatus, jqXHR) {
                console.log(data), 0 == data.returnCode ? ($(".alertApply").css("display", "block"), $timeout(function () {
                    $(".alertApply").css("display", "none"), $location.path("/user/center")
                }, 2e3), $scope.$apply()) : 1001 == data.returnCode ? ($scope.company.errorMsg = "贵公司已经申请过此产品", $timeout(function () {
                    $scope.company.errorMsg = ""
                }, 2e3), $scope.$apply()) : 1004 == data.returnCode || $location.path("/login")
            },
            dataType: "json"
        })
    }
});
var loginCtrl = angular.module("loginCtrl", []);
loginCtrl.controller("LoginCtrl", function ($http, $scope, $rootScope, $location, $timeout) {
    $scope.$root.title = "登陆", $scope.loginUser = {mobile: "", password: ""}, $scope.error_code_msg = {
        1003: "该用户不存在",
        2001: "用户名或密码错误",
        1002: "该用户异常",
        1: "服务器异常,请稍后再试"
    };
    var check_params = function (params) {
        return "" != params.mobile && "" != params.password
    };
    $scope.changeErrorMsg = function (msg) {
        $scope.error_msg = msg, $timeout(function () {
            $scope.error_msg = ""
        }, 5e3)
    }, $scope.textChange = function (e) {
        $scope.error_msg = ""
    }, $scope.loginUser = {mobile: "", code: ""}, $scope.ngBlur = function () {
        $rootScope.isNullOrEmpty($scope.loginUser.mobile) ? ($scope.changeErrorMsg("手机号码不能为空"), $("#mobile").focus()) : $http({
            url: api_uri + "reg/validateMobile",
            method: "GET",
            params: {mobile: $scope.loginUser.mobile}
        }).success(function (d) {
            1001 == d.returnCode ? $scope.enableMobile = !0 : ($scope.enableMobile = !1, $scope.changeErrorMsg("手机号未注册"))
        }).error(function (d) {
            console.log("login error")
        })
    }, $scope.login_zrh = function () {
        var m_params = $scope.loginUser;
        check_params(m_params) && $http({
            url: api_uri + "auth/web",
            method: "POST",
            params: m_params
        }).success(function (d) {
            if (0 == d.returnCode) {
                console.log(d), $rootScope.login_user = {
                    userId: d.result.split("_")[0],
                    token: d.result.split("_")[1]
                }, $rootScope.putObject("login_user", $rootScope.login_user);
                var present_route = $rootScope.getSessionObject("present_route"), redirect_uri = "";
                null != present_route && "" != present_route && present_route ? present_route.indexOf("/article/apply/") > -1 ? (redirect_uri = present_route, $rootScope.removeSessionObject("present_route")) : (redirect_uri = "/user/center", $rootScope.removeSessionObject("present_route")) : redirect_uri = "/user/center", $rootScope.wx_client ? window.location.href = api_uri + "wx/toOAuth?url=" + encodeURIComponent(root_uri + redirect_uri) : $location.path(redirect_uri)
            } else {
                var msg = $scope.error_code_msg[d.returnCode];
                msg || (msg = "登录失败"), $scope.error_msg = msg
            }
        }).error(function (d) {
            $scope.changeErrorMsg("网络故障请稍后再试......"), $location.path("/login")
        })
    }, $scope.register_zrh = function () {
        $location.path("/register/step1")
    }, $scope.reset = function () {
        $location.path("/register/reset1")
    }
});
var registerCtrl = angular.module("registerCtrl", []);
registerCtrl.controller("RegStep1Ctrl", function ($http, $scope, $rootScope, $location, $timeout) {
    $scope.registerUser = {
        mobile: "",
        code: ""
    }, $scope.isVerify = !1, $scope.enableMobile = !1, $scope.error_msg = "", $("#mobile").focus(), $scope.changeErrorMsg = function (msg) {
        $scope.error_msg = msg, $timeout(function () {
            $scope.changeErrorMsg("")
        }, 5e3)
    }, $scope.sms_second = 60, $scope.send_sms = !0, $scope.times = function () {
        $scope.sms_second > 0 ? ($scope.send_sms = !1, $scope.sms_second--, $timeout(function () {
            $scope.times()
        }, 1e3)) : $scope.sms_second <= 0 && ($scope.send_sms = !0, $scope.sms_second = 60)
    }, $scope.send_code = function () {
        $rootScope.isNullOrEmpty($scope.registerUser.mobile) ? ($scope.changeErrorMsg("手机号码不能为空"), $("#mobile").focus()) : $http({
            url: api_uri + "reg/validateMobile",
            method: "GET",
            params: {mobile: $scope.registerUser.mobile}
        }).success(function (d) {
            console.log(d), 0 == d.returnCode ? ($scope.enableMobile = !0, $scope.times(), $http({
                url: api_uri + "reg/sendSms",
                method: "GET",
                params: {
                    mobile: $scope.registerUser.mobile,
                    token: $rootScope.encryptByDES($scope.registerUser.mobile),
                    timestamp: moment().format("X")
                }
            }).success(function (d) {
                console.log(d), 0 == d.returnCode ? $scope.changeErrorMsg("短信验证码已经发送到你的手机") : $scope.changeErrorMsg(d.returnCode)
            }).error(function (d) {
                console.log("login error")
            })) : 1001 == d.returnCode ? ($scope.enableMobile = !1, $scope.changeErrorMsg("用户已经注册")) : 2102 == d.returnCode ? ($scope.enableMobile = !1, $scope.changeErrorMsg("手机号错误")) : $scope.changeErrorMsg(d.returnCode)
        }).error(function (d) {
            console.log("login error")
        })
    }, $scope.changeCode = function () {
        $scope.enableMobile && !$rootScope.isNullOrEmpty($scope.registerUser.code) ? $scope.isVerify = !0 : $scope.isVerify = !1
    }, $scope.validateCode = function () {
        $scope.isVerify && $http({
            url: api_uri + "reg/validateSms",
            method: "POST",
            params: $scope.registerUser
        }).success(function (d) {
            console.log(d), 0 == d.returnCode ? $location.path("/register/step2/" + $scope.registerUser.mobile + "/" + d.result) : $scope.changeErrorMsg(d.result)
        }).error(function (d) {
            console.log("login error")
        })
    }
}), registerCtrl.controller("RegStep2Ctrl", function ($http, $scope, $rootScope, $location, $routeParams, $timeout) {
    $scope.registerUser = {
        mobile: $routeParams.mobile,
        password: "",
        validatePwd: "",
        token: $routeParams.token
    }, $scope.changeErrorMsg = function (msg) {
        $scope.error_msg = msg, $timeout(function () {
            $scope.changeErrorMsg("")
        }, 5e3)
    }, $scope.ngBlur = function () {
        console.log("ng-blur");
        var reg_str = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,12}$/;
        reg_str.test($scope.registerUser.password) || ($scope.error_msg = "密码必须是6-12位字母+数字")
    }, $scope.textChange = function (e) {
        var reg_str = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,12}$/;
        reg_str.test($scope.registerUser.password) ? ($scope.success_msg = "密码格式正确", $scope.error_msg = "") : ($scope.success_msg = "", $scope.error_msg = "密码必须是6-12位字母+数字")
    }, $scope.textChange2 = function (e) {
        var reg_str = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,12}$/;
        $scope.registerUser.password == $scope.registerUser.validatePwd && reg_str.test($scope.registerUser.password) ? ($scope.success_msg = "点击注册按钮，注册用户", $scope.error_msg = "") : ($scope.success_msg = "", $scope.error_msg = "两次输入的密码不一致")
    }, $scope.user_register = function () {
        var reg_str = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,12}$/;
        $scope.registerUser.password == $scope.registerUser.validatePwd && reg_str.test($scope.registerUser.password) ? $http({
            url: api_uri + "reg/regist",
            method: "POST",
            params: $scope.registerUser
        }).success(function (d) {
            0 == d.returnCode ? (alert("注册成功"), $rootScope.putObject("login_mobile", $scope.registerUser.mobile), $http({
                url: api_uri + "auth/web",
                method: "POST",
                params: {mobile: $scope.registerUser.mobile, password: $scope.registerUser.password}
            }).success(function (d) {
                console.log(d), 0 == d.returnCode ? ($rootScope.login_user = {
                    userId: d.result.split("_")[0],
                    token: d.result.split("_")[1]
                }, $rootScope.putObject("login_user", $rootScope.login_user), $location.path("/article/list")) : ($scope.changeErrorMsg(d.result), console.log(d))
            }).error(function (d) {
                console.log("login error")
            })) : console.log(d)
        }).error(function (d) {
            console.log("login error")
        }) : $scope.registerUser.password != $scope.registerUser.validatePwd ? $scope.changeErrorMsg("两次密码输入的不一致") : reg_str.test($scope.registerUser.password) || $scope.changeErrorMsg("密码强度不够,必须包含数字和字母")
    }
}), registerCtrl.controller("ResetStep1Ctrl", function ($http, $scope, $rootScope, $location, $timeout) {
    $scope.resetUser = {
        mobile: "",
        code: ""
    }, $scope.isVerify = !1, $scope.enableMobile = !1, $scope.error_msg = "", $scope.changeErrorMsg = function (msg) {
        $scope.error_msg = msg, $timeout(function () {
            $scope.changeErrorMsg("")
        }, 5e3)
    }, $scope.sms_second = 60, $scope.send_sms = !0, $scope.times = function () {
        $scope.sms_second > 0 ? ($scope.send_sms = !1, $scope.sms_second--, $timeout(function () {
            $scope.times()
        }, 1e3)) : $scope.sms_second <= 0 && ($scope.send_sms = !0, $scope.sms_second = 60)
    }, $scope.send_code = function () {
        $rootScope.isNullOrEmpty($scope.resetUser.mobile) ? ($scope.changeErrorMsg("手机号码不能为空"), $("#mobile").focus()) : $http({
            url: api_uri + "reg/validateMobile",
            method: "GET",
            params: {mobile: $scope.resetUser.mobile}
        }).success(function (d) {
            1001 == d.returnCode ? ($scope.enableMobile = !0, $scope.times(), $http({
                url: api_uri + "reg/sendSms2",
                method: "GET",
                params: {
                    mobile: $scope.resetUser.mobile,
                    token: $rootScope.encryptByDES($scope.resetUser.mobile),
                    timestamp: moment().format("X")
                }
            }).success(function (d) {
                console.log(d), 0 == d.returnCode ? ($("#code").focus(), $scope.changeErrorMsg("短信验证码已经发送到你的手机")) : $scope.changeErrorMsg(d.result)
            }).error(function (d) {
                console.log("login error")
            })) : 2102 == d.returnCode ? (console.log(d), $scope.enableMobile = !1, $scope.changeErrorMsg("手机号码错误")) : 0 == d.returnCode && (console.log(d), $scope.enableMobile = !1, $scope.changeErrorMsg("手机号码未注册"))
        }).error(function (d) {
            console.log("login error")
        })
    }, $scope.changeCode = function () {
        $scope.enableMobile && !$rootScope.isNullOrEmpty($scope.resetUser.code) ? $scope.isVerify = !0 : $scope.isVerify = !1
    }, $scope.validateCode = function () {
        $scope.isVerify && $http({
            url: api_uri + "reg/validateSms",
            method: "POST",
            params: $scope.resetUser
        }).success(function (d) {
            0 == d.returnCode ? $location.path("/register/reset2/" + $scope.resetUser.mobile + "/" + d.result) : $scope.changeErrorMsg(d.result)
        }).error(function (d) {
            console.log("login error")
        })
    }
}), registerCtrl.controller("ResetStep2Ctrl", function ($http, $scope, $rootScope, $location, $routeParams) {
    $scope.resetUser = {
        mobile: $routeParams.mobile,
        password: "",
        validatePwd: "",
        token: $routeParams.token
    }, $scope.textChange = function (e) {
        var reg_str = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,12}$/;
        reg_str.test($scope.resetUser.password) ? ($scope.success_msg = "密码格式正确", $scope.error_msg = "") : ($scope.success_msg = "", $scope.error_msg = "密码必须是6-12位字母+数字")
    }, $scope.textChange2 = function (e) {
        var reg_str = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,12}$/;
        $scope.resetUser.password == $scope.resetUser.validatePwd && reg_str.test($scope.resetUser.password) ? ($scope.success_msg = "点击重置按钮，重置密码", $scope.error_msg = "") : ($scope.success_msg = "", $scope.error_msg = "两次输入的密码不一致")
    }, $scope.user_reset = function () {
        $http({url: api_uri + "reg/reset", method: "POST", params: $scope.resetUser}).success(function (d) {
            0 == d.returnCode ? (alert("重置密码成功"), $rootScope.putObject("login_mobile", $scope.resetUser.mobile), $http({
                url: api_uri + "auth/web",
                method: "POST",
                params: {mobile: $scope.resetUser.mobile, password: $scope.resetUser.password}
            }).success(function (d) {
                0 == d.returnCode ? ($rootScope.login_user = {
                    userId: d.result.split("_")[0],
                    token: d.result.split("_")[1]
                }, $rootScope.putObject("login_user", $rootScope.login_user), $location.path("/article/list")) : console.log(d)
            }).error(function (d) {
                console.log("login error")
            })) : console.log(d)
        }).error(function (d) {
            console.log("login error")
        })
    }
});
var userCtrl = angular.module("userCtrl", []);
userCtrl.controller("UserCenterCtrl", function ($http, $scope, $rootScope, $timeout, $location) {
    $scope.init = function () {
        null == $rootScope.login_user.userId || "" == $rootScope.login_user.userId ? $location.path("/login") : ($http({
            url: api_uri + "user/center",
            method: "GET",
            params: $rootScope.login_user
        }).success(function (d) {
            console.log(d), 0 == d.returnCode ? ($scope.nickname = d.result.nickname, $scope.batting = d.result.batting, $scope.value = d.result.value, $scope.position = d.result.position, $scope.headImg = d.result.headImg) : (console.log(d), $rootScope.removeObject("login_user"), $location.path("/login")), $scope.init_role()
        }).error(function (d) {
            console.log(d), $rootScope.removeObject("login_user"), $location.path("/login")
        }), $scope.list(1, $scope.totalCount), $scope.myList(1, $scope.myTotalCount))
    }, $scope.message = !1, $scope.init_role = function () {
        $scope.bt_show = 0, $http({
            url: api_uri + "user/role",
            method: "GET",
            params: $rootScope.login_user
        }).success(function (d) {
            console.log(d), 0 == d.returnCode ? ($scope.role = d.result, console.log($scope.role, "baiyang")) : console.log(d)
        }).error(function (d) {
        })
    }, $scope.list = function (pageNo, pageSize) {
        $scope.type || ($scope.type = "1");
        var m_params = {
            userId: $rootScope.login_user.userId,
            token: $rootScope.login_user.token,
            pageNo: pageNo,
            pageSize: pageSize
        };
        $http({url: api_uri + "loanApplication/list", method: "GET", params: m_params}).success(function (d) {
            console.log(d), 0 == d.returnCode && (0 == d.result.totalCount ? $scope.message_list = !1 : ($scope.result_list = d.result.datas, $scope.totalCount = d.result.totalCount, angular.forEach($scope.result_list, function (data) {
                0 == $scope.type || 1 == $scope.type && (1 == data.status ? (data.jindu = "10", data.triangle = "8", data.textPosition = "2", data.progressText = "审核中", $scope.message = !0) : 2 == data.status ? (data.jindu = "50", data.triangle = "44", data.textPosition = "36", data.progressText = "约见中", $scope.message = !0) : 3 == data.status ? (data.jindu = "75", data.triangle = "66", data.textPosition = "58", data.progressText = "跟进中", $scope.message = !0) : 4 == data.status ? (data.jindu = "100", data.triangle = "86", data.textPosition = "76", data.progressText = "成功融资", $scope.message = !0) : data.status == -1 && (data.jindu = "0", data.triangle = "20", data.textPosition = "5", data.progressText = "申请已经取消"))
            })))
        }).error(function (d) {
            console.log("login error")
        })
    }, $scope.result_list = {result: {}, returnCode: 0}, $scope.myList = function (pageNo, pageSize) {
        $scope.type || ($scope.type = "1");
        var m_params = {
            userId: $rootScope.login_user.userId,
            token: $rootScope.login_user.token,
            pageNo: pageNo,
            pageSize: pageSize
        };
        $http({url: api_uri + "loanApplication/myList", method: "GET", params: m_params}).success(function (d) {
            console.log(d), 0 == d.returnCode && (0 == d.result.totalCount ? ($scope.message_myList = !1, 0 == $scope.message_myList && 0 == $scope.message_list && ($scope.message = !1)) : ($scope.my_list = d.result.datas, $scope.myTotalCount = d.result.totalCount, angular.forEach($scope.my_list, function (data) {
                0 == $scope.type || 1 == $scope.type && (1 == data.status ? (data.jindu = "10", data.triangle = "8", data.textPosition = "2", data.progressText = "审核中", data.progressTextNext = "开始约见", $scope.message = !0) : 2 == data.status ? (data.jindu = "50", data.triangle = "44", data.textPosition = "36", data.progressText = "约见中", data.progressTextNext = "继续跟进", $scope.message = !0) : 3 == data.status ? (data.jindu = "75", data.triangle = "66", data.textPosition = "58", data.progressText = "跟进中", data.progressTextNext = "完成贷款", $scope.message = !0) : 4 == data.status ? (data.jindu = "100", data.triangle = "86", data.textPosition = "76", data.progressText = "成功融资", $scope.message = !0) : data.status == -1 && (data.jindu = "0", data.triangle = "20", data.textPosition = "5", data.progressText = "申请已经取消"))
            })))
        }).error(function (d) {
            console.log("login error")
        })
    }, $scope.result_list = {
        result: {},
        returnCode: 0
    }, $scope.alert = !1, $scope.alert_come = function (status, id, days) {
        $scope.dateTime = days, $scope.alert = !0, $scope.applyId = id, $scope.status = status, $(".alert").css("top", $(document).scrollTop()), $scope.alertText = "预计时间", $scope.alertText1 = "备注内容", $scope.alertText2 = "企业方需要补充一张个人征信表和法人的身份证证件"
    }, $scope.alert_come1 = function (status, id, days) {
        $scope.dateTime = days, $scope.alert = !0, $scope.applyId = id, $scope.status = status, $(".alert").css("top", $(document).scrollTop()), $scope.alertText = "延长时间", $scope.alertText1 = "说明原因", $scope.alertText2 = "企业方征信问题没有及时提交，请尽快提交到位"
    }, $scope.expectDateBank = "", $scope.init(), $scope.userDetail = function () {
        $location.path("/user/setting/")
    }, $scope.company_detail = function (id) {
        $rootScope.isNullOrEmpty(id) || $location.path("/user/companyDetail/" + id)
    }, $scope.closeAlert = function (name, $event) {
        $scope.alert = !1, $scope.stopPropagation && $event.stopPropagation()
    }, $scope.sure = function () {
        var params = {
            userId: $rootScope.login_user.userId,
            token: $rootScope.login_user.token,
            days: $scope.dateTime,
            reason: $scope.reason,
            applyId: $scope.applyId,
            status: $scope.status
        };
        console.log(params), $.ajax({
            type: "POST",
            url: api_uri + "applyBankDeal/refer",
            data: params,
            traditional: !0,
            success: function (data, textStatus, jqXHR) {
                console.log(data), 0 == data.returnCode ? ($scope.alert = !1, $scope.show(), $scope.$apply()) : console.log(data)
            },
            dataType: "json"
        })
    }, $scope.show = function () {
        $scope.bt_show = 0, $http({
            url: api_uri + "applyBankDeal/show",
            method: "GET",
            params: $rootScope.login_user
        }).success(function (d) {
            console.log(d), 0 == d.returnCode || console.log(d)
        }).error(function (d) {
        })
    }
}), articleCtrl.controller("CompanyDetailCtrl", function ($http, $scope, $rootScope, $location, $routeParams) {
    $scope.init = function () {
        $scope.bt_show = 0, $http({
            url: api_uri + "loanApplication/detail/" + $routeParams.id,
            method: "GET",
            params: $rootScope.login_user
        }).success(function (d) {
            console.log(d), 0 == d.returnCode ? ($scope.company = d.result, console.log(d.result)) : console.log(d)
        }).error(function (d) {
            console.log("login error"), $location.path("/error")
        })
    }, $scope.init(), $scope.alertCancel = function () {
        $(".coverAlert").css("display", "block"), $(".cancelAlert").css("display", "block")
    }, $scope.alertExit = function () {
        $(".coverAlert").css("display", "none"), $(".cancelAlert").css("display", "none")
    }, $scope.cancel = function () {
        var m_params = {userId: $rootScope.login_user.userId, token: $rootScope.login_user.token, status: -1};
        $http({
            url: api_uri + "loanApplication/cancel/" + $routeParams.id,
            method: "GET",
            params: m_params
        }).success(function (d) {
            console.log(d), 0 == d.returnCode ? $location.path("/user/center") : console.log(d)
        }).error(function (d) {
            console.log("login error"), $location.path("/error")
        })
    }
}), userCtrl.controller("SettingCtrl", ["$scope", "$rootScope", "$location", "$http", function ($scope, $rootScope, $location, $http) {
    $scope.init = function () {
        $http({url: api_uri + "user/setting", method: "GET", params: $rootScope.login_user}).success(function (d) {
            console.log(d), 0 == d.returnCode ? $scope.user = d.result : console.log(d)
        }).error(function (d) {
            console.log(d)
        }), $http({
            url: api_uri + "qiniu/getUpToken",
            method: "GET",
            params: $rootScope.login_user
        }).success(function (d) {
            if (console.log(d), 0 == d.returnCode) {
                $scope.qiniu_token = d.result.uptoken;
                Qiniu.uploader({
                    runtimes: "html5,flash,html4",
                    browse_button: "pickfiles",
                    uptoken: $scope.qiniu_token,
                    domain: $rootScope.qiniu_bucket_domain,
                    container: "upload_container",
                    max_file_size: "10mb",
                    flash_swf_url: "../../framework/plupload/Moxie.swf",
                    max_retries: 3,
                    dragdrop: !1,
                    drop_element: "",
                    chunk_size: "4mb",
                    auto_start: !0,
                    init: {
                        FilesAdded: function (up, files) {
                        }, BeforeUpload: function (up, file) {
                            $rootScope.uploading = !0, $scope.upload_percent = file.percent, $rootScope.$apply()
                        }, UploadProgress: function (up, file) {
                            $scope.upload_percent = file.percent, $scope.$apply()
                        }, FileUploaded: function (up, file, info) {
                            var res = $.parseJSON(info), file_url = "http://" + $rootScope.qiniu_bucket_domain + "/" + res.key;
                            $scope.user.headImg = file_url, $scope.$apply();
                            var params = $rootScope.login_user;
                            params.key = "headImg", params.value = $scope.user.headImg, $.post(api_uri + "user/update", params, function (data) {
                                0 == data.returnCode || console.log(data)
                            }, "json")
                        }, Error: function (up, err, errTip) {
                            console.log(err), $rootScope.alert("营业执照上传失败！")
                        }, UploadComplete: function () {
                        }, Key: function (up, file) {
                            var time = (new Date).getTime(), k = "user/headImg/" + $rootScope.login_user.userId + "/" + time;
                            return k
                        }
                    }
                })
            } else console.log(d)
        }).error(function (d) {
            console.log(d)
        })
    }, $scope.init(), $scope.reset = function () {
        $location.path("/register/reset1")
    }, $scope.update = function (key, value) {
        $rootScope.isNullOrEmpty(key) || ($rootScope.isNullOrEmpty(value) && (value = ""), $rootScope.putObject("user_update", key + "=" + value), $location.path("/user/update"))
    }, $scope.logout = function () {
        $http({url: api_uri + "auth/logout", method: "GET", params: $rootScope.login_user}).success(function (d) {
            console.log(d)
        }).error(function (d) {
            console.log(d)
        }), $rootScope.removeObject("login_user", $rootScope.login_user), $rootScope.login_user = {}, $location.path("/login")
    }
}]), userCtrl.controller("UserUpdateCtrl", ["$scope", "$rootScope", "$location", "$http", function ($scope, $rootScope, $location, $http) {
    $scope.init = function () {
        var user_update = $rootScope.getObject("user_update");
        user_update && user_update.indexOf("=") && ($rootScope.removeObject("user_update"), $scope.update_user = {}, $scope.update_user.key = user_update.split("=")[0], $scope.update_user.value = user_update.split("=")[1])
    }, $scope.init(), $scope.sure = function () {
        var params = $rootScope.login_user;
        params.key = $scope.update_user.key, params.value = $scope.update_user.value, console.log(params);
        var keys = ["name", "position"];
        $.inArray(params.key, keys) >= 0 && $.post(api_uri + "user/update", params, function (data) {
            0 == data.returnCode || console.log(data)
        }, "json"), $location.path("/user/setting")
    }
}]), api_uri = "http://123.206.84.74/api/", templates_root = "templates/", deskey = "abc123.*abc123.*abc123.*abc123.*", root_uri = "http://app.supeiyunjing.com/#";
var myApp = angular.module("myApp", ["ng", "ngRoute", "ngAnimate", "loginCtrl", "registerCtrl", "articleCtrl", "userCtrl", "ngTouchstart", "ngTouchmove", "ngTouchend"], function ($httpProvider) {
    $httpProvider.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded;charset=utf-8", $httpProvider.defaults.headers.put["Content-Type"] = "application/x-www-form-urlencoded;charset=utf-8"
});
myApp.run(["$location", "$rootScope", "$http", "$routeParams", function ($location, $rootScope, $http, $routeParams) {
    $rootScope.qiniu_bucket_domain = "o793l6o3p.bkt.clouddn.com";
    var no_check_route = ["/article/list", "/login", "/register/step1", "/register/step2", "/register/reset1", "/register/reset2"], ua = navigator.userAgent.toLowerCase();
    $rootScope.wx_client = ua.indexOf("micromessenger") != -1, $rootScope.wx_client = !1, $rootScope.isIos = ua.indexOf("iphone") != -1 || ua.indexOf("ipad") != -1, $rootScope.wx_client && $http({
        url: api_uri + "wx/share",
        method: "GET",
        params: {url: $location.absUrl()}
    }).success(function (d) {
        0 == d.returnCode && (wx.config({
            debug: !1,
            appId: d.result.appid,
            timestamp: d.result.timestamp,
            nonceStr: d.result.noncestr,
            signature: d.result.signature,
            jsApiList: ["checkJsApi", "onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQQ", "onMenuShareWeibo", "hideMenuItems", "showMenuItems", "hideAllNonBaseMenuItem", "showAllNonBaseMenuItem", "translateVoice"]
        }), wx.ready(function () {
        }), wx.error(function (res) {
            console.log(res)
        }))
    }).error(function (data) {
    }), $rootScope.$on("$routeChangeSuccess", function (event, current, previous) {
        function onBridgeReady() {
            wx.hideOptionMenu()
        }

        var present_route = $location.$$path, openid = $routeParams.openid;
        if (openid) {
            $rootScope.putObject("openid", openid);
            var m_params = {userId: $rootScope.login_user.userId, token: $rootScope.login_user.userId, openid: openid};
            $http({url: api_uri + "user/wxBind", method: "GET", params: m_params}).success(function (d) {
                console.log(d)
            })
        }
        $rootScope.removeSessionObject("showID"), "/article/list" == present_route || present_route.indexOf("/article/show/") > -1 || ("undefined" == typeof WeixinJSBridge ? document.addEventListener ? document.addEventListener("WeixinJSBridgeReady", onBridgeReady, !1) : document.attachEvent && (document.attachEvent("WeixinJSBridgeReady", onBridgeReady), document.attachEvent("onWeixinJSBridgeReady", onBridgeReady)) : onBridgeReady())
    }), $rootScope.$on("$routeChangeStart", function (event, current, previous) {
        var present_route = $location.$$path;
        $rootScope.check_user(), $rootScope.login_user ? console.log(present_route) : no_check_route.indexOf(present_route) > -1 ? console.log(present_route) : no_check_route.indexOf(present_route) <= -1 && present_route.indexOf("/article/show/") > -1 ? console.log(present_route) : no_check_route.indexOf(present_route) <= -1 && present_route.indexOf("register/step2") > -1 ? console.log(present_route) : no_check_route.indexOf(present_route) <= -1 && present_route.indexOf("register/reset2") > -1 ? console.log(present_route) : (console.log($rootScope.login_user), $rootScope.removeObject("login_user"), $rootScope.putSessionObject("present_route", present_route), console.log(present_route), $location.path("/login"))
    }), $rootScope.putObject = function (key, value) {
        localStorage.setItem(key, angular.toJson(value))
    }, $rootScope.getObject = function (key) {
        return angular.fromJson(localStorage.getItem(key))
    }, $rootScope.removeObject = function (key) {
        localStorage.removeItem(key)
    }, $rootScope.putSessionObject = function (key, value) {
        sessionStorage.setItem(key, angular.toJson(value))
    }, $rootScope.getSessionObject = function (key) {
        return angular.fromJson(sessionStorage.getItem(key))
    }, $rootScope.removeSessionObject = function (key) {
        angular.fromJson(sessionStorage.removeItem(key))
    }, $rootScope.change = function ($event) {
        $event.stopPropagation()
    }, $rootScope.isNullOrEmpty = function (strVal) {
        return "" == $.trim(strVal) || null == strVal || void 0 == strVal
    }, $rootScope.encryptByDES = function (message) {
        var keyHex = CryptoJS.enc.Utf8.parse(deskey), encrypted = CryptoJS.DES.encrypt(message, keyHex, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        return encrypted.toString()
    }, $rootScope.decryptByDES = function (ciphertext) {
        var keyHex = CryptoJS.enc.Utf8.parse(deskey), decrypted = CryptoJS.DES.decrypt({ciphertext: CryptoJS.enc.Base64.parse(ciphertext)}, keyHex, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        return decrypted.toString(CryptoJS.enc.Utf8)
    }, $rootScope.transFn = function (obj) {
        var str = [];
        for (var p in obj)str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        return str.join("&").toString()
    }, $rootScope.touchStart = function () {
        $(".singleButtonFixed").addClass("singleButton2"), $(".singleButton1").addClass("singleButton2")
    }, $rootScope.touchEnd = function () {
        $(".singleButtonFixed").removeClass("singleButton2"), $(".singleButton1").removeClass("singleButton2")
    }, $rootScope.check_user = function () {
        $rootScope.login_user = $rootScope.getObject("login_user"), console.log($rootScope.login_user), $http({
            url: api_uri + "auth/validateAuth",
            method: "POST",
            params: $rootScope.login_user
        }).success(function (d) {
            return 0 == d.returnCode ? (console.log("login success"), !0) : ($rootScope.login_user = {}, $rootScope.removeObject("login_user"), $rootScope.present_route = $location.$$path, no_check_route.indexOf($rootScope.present_route) <= -1 && $rootScope.present_route.indexOf("register/step2") <= -1 && $rootScope.present_route.indexOf("register/reset2") <= -1 ? $rootScope.putSessionObject("present_route", $rootScope.present_route) : ($rootScope.present_route = "/login") && $rootScope.putSessionObject("present_route", $rootScope.present_route), !1)
        }).error(function (d) {
            return !1
        })
    }, window.localStorage || alert("This browser does NOT support localStorage"), window.sessionStorage || alert("This browser does NOT support sessionStorage")
}]), myApp.config(function ($routeProvider) {
    $routeProvider.when("/login", {
        templateUrl: templates_root + "login/login.html",
        controller: "LoginCtrl"
    }).when("/register/step1", {
        templateUrl: templates_root + "register/step1.html",
        controller: "RegStep1Ctrl"
    }).when("/register/step2/:mobile/:token", {
        templateUrl: templates_root + "register/step2.html",
        controller: "RegStep2Ctrl"
    }).when("/register/reset1", {
        templateUrl: templates_root + "register/reset1.html",
        controller: "ResetStep1Ctrl"
    }).when("/register/reset2/:mobile/:token", {
        templateUrl: templates_root + "register/reset2.html",
        controller: "ResetStep2Ctrl"
    }).when("/article/list", {
        templateUrl: templates_root + "article/list.html",
        controller: "ArticleListCtrl"
    }).when("/article/show/:id", {
        templateUrl: templates_root + "article/show.html",
        controller: "ArticleShowCtrl"
    }).when("/article/apply/:id", {
        templateUrl: templates_root + "article/apply.html",
        controller: "applyCtrl"
    }).when("/user/center", {
        templateUrl: templates_root + "user/center.html",
        controller: "UserCenterCtrl"
    }).when("/user/companyDetail/:id", {
        templateUrl: templates_root + "user/company_detail.html",
        controller: "CompanyDetailCtrl"
    }).when("/user/setting", {
        templateUrl: templates_root + "user/setting.html",
        controller: "SettingCtrl"
    }).when("/user/update", {
        templateUrl: templates_root + "user/update.html",
        controller: "UserUpdateCtrl"
    }).when("/error", {templateUrl: templates_root + "404.html"}).otherwise({redirectTo: "/login"})
});