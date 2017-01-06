var userCtrl = angular.module('userCtrl', ['mobiscroll-select']);
/*个人中心*/
userCtrl.controller('UserCenterCtrl',
    ['$http', '$scope', '$rootScope', '$timeout', '$location', '$interval', function ($http, $scope, $rootScope, $timeout, $location, $interval) {
        $scope.message = false;//是否有数据，初始化为否
        $scope.msg_red_see = false;
        $scope.settings = {
            theme: 'ios',
            mode: 'scroller',
            display: 'inline',
            lang: ''
        };
        /*初始化个人信息*/
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
                if (d.returnCode == 0) {
                    $scope.nickname = d.result.nickname;
                    $scope.batting = d.result.batting;
                    $scope.value = d.result.value;
                    $scope.position = d.result.position;
                    $scope.headImg = d.result.headImg;
                    $scope.msgCount = d.result.msgCount;
                    if (!$scope.nickname) {
                        $location.path("/user/add_name");
                    }
                } else {
                    // console.log(d);
                    $rootScope.removeObject("login_user");
                    $location.path("/login");
                }
                $scope.init_role();
            }).error(function (d) {
                // console.log(d);
                $rootScope.removeObject("login_user");
                $location.path("/login");
            });
                //$scope.init_role();
                $scope.list(1, 100);
                $scope.myList(1, 100);
                // console.log("debug");
            }
        };

        /*验证用户身份*/
        $scope.init_role = function () {
            // $scope.bt_show = 0;
            $http({
                url: api_uri + "user/role",
                method: "GET",
                params: $rootScope.login_user
            }).success(function (d) {
                if (d.returnCode == 0) {
                    console.log(d)
                    $scope.role = d.result;
                } else {

            }
            }).error(function (d) {
            });
        };

        /*获取个人申请列表*/
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
                if (d.returnCode == 0) {
                    if (d.result.totalCount == 0) {
                        $scope.message_list = false;
                    } else {
                        $scope.message_list = true;
                        $scope.result_list = d.result.datas;
                        $scope.totalCount = d.result.totalCount;
                        angular.forEach($scope.result_list, function (data) {
                            if ($scope.type == 0) {

                            } else if ($scope.type == 1) {
                                if (data.status == 0 || data.status == 1) {
                                    data.jindu = "10";
                                    data.progressText = "准备中";
                                    $scope.message = true;
                                } else if (data.status == 2) {
                                    data.jindu = "25";
                                    data.progressText = "下户";
                                    $scope.message = true;
                                } else if (data.status == 3) {
                                    data.jindu = "40";
                                    data.progressText = "审批中";
                                    $scope.message = true;
                                } else if (data.status == 4) {
                                    data.jindu = "55";
                                    data.progressText = "审批通过";
                                    $scope.message = true;
                                } else if (data.status == 5) {
                                    data.jindu = "70";
                                    data.progressText = "开户";
                                    $scope.message = true;
                                } else if (data.status == 6) {
                                    data.jindu = "85";
                                    data.progressText = "放款";
                                    $scope.message = true;
                                } else if (data.status == 7) {
                                    data.jindu = "100";
                                    data.progressText = "完成融资";
                                    $scope.message = true;
                                } else if (data.status == -1) {
                                    data.jindu = "0";
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
                // console.log("login error");
                //$location.path("/error");
            })
        };

        /*获取任务列表*/
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
                if (d.returnCode == 0) {
                    if (d.result.totalCount == 0) {
                        $scope.message_myList = false;
                        if ($scope.message_myList == false && $scope.message_list == false) {
                            $scope.message = false;
                    } else {
                            $scope.message = true;
                        }
                    } else {
                        $scope.message_myList = true;
                        $scope.my_list = d.result.datas;
                        $scope.myTotalCount = d.result.totalCount;
                        angular.forEach($scope.my_list, function (data) {
                            if ($scope.type == 0) {

                            } else if ($scope.type == 1) {
                                if (data.status == 0 || data.status == 1) {
                                    data.jindu = "10";
                                    data.progressText = "准备中";
                                    data.statusNextText = "下户";
                                    data.progressNext = "审核中";
                                    data.progressTextNext = "开始下户";
                                    $scope.message = true;
                                } else if (data.status == 2) {
                                    data.jindu = "25";
                                    data.progressText = "下户";
                                    data.statusNextText = "审批中";
                                    data.progressNext = "审核中";
                                    data.progressTextNext = "开始审批";
                                    $scope.message = true;
                                } else if (data.status == 3) {
                                    data.jindu = "40";
                                    data.progressText = "审批中";
                                    data.statusNextText = "审批通过";
                                    data.progressNext = "审核中";
                                    data.progressTextNext = "审核通过";
                                    $scope.message = true;
                                } else if (data.status == 4) {
                                    data.jindu = "55";
                                    data.progressText = "审批通过";
                                    data.statusNextText = "开户";
                                    data.progressNext = "审核中";
                                    data.progressTextNext = "马上开户";
                                    $scope.message = true;
                                } else if (data.status == 5) {
                                    data.jindu = "70";
                                    data.progressText = "开户";
                                    data.statusNextText = "放款";
                                    data.progressNext = "审核中";
                                    data.progressTextNext = "开始放款";
                                    $scope.message = true;
                                } else if (data.status == 6) {
                                    data.jindu = "85";
                                    data.progressText = "放款";
                                    data.statusNextText = "完成融资";
                                    data.progressNext = "审核中";
                                    data.progressTextNext = "成功融资";
                                    $scope.message = true;
                                } else if (data.status == 7) {
                                    data.jindu = "100";
                                    data.progressText = "完成融资";
                                    data.statusNextText = "完成融资";
                                    data.progressNext = "审核中";
                                    data.progressTextNext = "完成融资";
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
                }

            }).error(function (d) {
            })
        };

        /*弹出框*/
        $scope.alert = false;
        $scope.alert_over = false;

        /*普通*/
        $scope.alert_common = function (status, id) {
            $scope.alert = true;
            $scope.applyId = id;
            $scope.status = status;
            console.log(status, id);
        };

        /*逾期后*/
        $scope.alert_overdue = function (status, id, days) {
            $scope.dateTime = days;
            $scope.alert_over = true;
            $scope.applyId = id;
            $scope.status = status;
            $scope.alertText = "延长时间";
            $scope.alertText2 = "请说明原因（必填）";
        };
        // $scope.expectDateBank = "";
        $scope.alert_come2 = function (id) {
            $scope.alert_stop = true;
            $scope.applyId = id;
            $scope.alertText2 = "请说明中止原因（必填）";
        };
        $scope.init();

        /*跳转页面*/
        $scope.userSetting = function () {
            $location.path("/user/setting/");
        };

        $scope.userMessage = function () {
            $location.path("/user/message");
        };

        $scope.my_apply = function (id, defineId) {
            if (!$rootScope.isNullOrEmpty(id)) {
                $location.path("/user/companyDetail/" + id + "/" + defineId);
            }
        };

        $scope.my_work = function (id, defineId) {
            if (!$rootScope.isNullOrEmpty(id)) {
                $location.path("/user/companyDetail/" + id + "/" + defineId);
            }
        };

        $scope.closeAlert = function (name, $event) {
            $scope.alert = false;
            $scope.alert_stop = false;
            if ($scope.stopPropagation) {
                $event.stopPropagation();
            }
        };

        /*接受拒绝分配*/
        $scope.receive = function (id) {
            var params = {
                "userId": $rootScope.login_user.userId,
                "token": $rootScope.login_user.token,
                "applyId": id
        };
            $.ajax({
                type: 'POST',
                url: api_uri + "applyBankDeal/receive",
                data: params,
                traditional: true,
                success: function (data, textStatus, jqXHR) {
                    if (data.returnCode == 0) {
                        $scope.list(1, 100);
                        $scope.myList(1, 100);
                        $scope.$apply();

                    }
                    else {
                        console.log(data);
                    }
                },
                dataType: 'json',
            });
        };

        $scope.rejected = function (id) {
            var params = {
                "userId": $rootScope.login_user.userId,
                "token": $rootScope.login_user.token,
                "applyId": id
        };
            console.log(params);
            $.ajax({
                type: 'POST',
                url: api_uri + "applyBankDeal/rejected",
                data: params,
                traditional: true,
                success: function (data, textStatus, jqXHR) {
                    console.log(data);
                    if (data.returnCode == 0) {
                        $scope.list(1, 100);
                        $scope.myList(1, 100);
                        $scope.$apply();
                    }
                    else {
                        console.log(data);
                    }
                },
                error: function (data, textStatus, jqXHR) {
                    console.log(data);
                },
                dataType: 'json',
            });
        };

        $scope.stop = function () {
            var params = {
                "userId": $rootScope.login_user.userId,
                "token": $rootScope.login_user.token,
                "applyId": $scope.applyId,
                "reason": $scope.reason
            };
            console.log(params);
            $.ajax({
                type: 'POST',
                url: api_uri + "applyBankDeal/stop",
                data: params,
                traditional: true,
                success: function (data, textStatus, jqXHR) {
                    console.log(data);
                    if (data.returnCode == 0) {
                        $scope.alert_stop = false;
                        $scope.list(1, 100);
                        $scope.myList(1, 100);
                        $scope.$apply();
                    }
                    else {
                    console.log(data);
                    }
                },
                error: function (data, textStatus, jqXHR) {
                    console.log(data);
                },
                dataType: 'json',
            });
        };
        /*客户经理提交状态*/
        $scope.submit_status = function () {
            var params = {
                "userId": $rootScope.login_user.userId,
                "token": $rootScope.login_user.token,
                "expectDateBank": $scope.days,
                "reason": $scope.reason,
                "applyId": $scope.applyId,
                "status": $scope.status,
        };
            console.log(params);
            if (!params.expectDateBank) {
                $scope.msg_red = "请输入预计时间";
                $scope.msg_red_see = true;
                $timeout(function () {
                    $scope.msg_red_see = false;
                }, 3000);
            } else {
            $.ajax({
                type: 'POST',
                url: api_uri + "applyBankDeal/refer",
                data: params,
                traditional: true,
                success: function (data, textStatus, jqXHR) {
                    // console.log(data);
                    if (data.returnCode == 0) {
                        $scope.alert = false;
                        $(".alertCenterSubmit").css("display", "block");
                        $timeout(function () {
                            $(".alertCenterSubmit").css("display", "none");
                        }, 2000);
                        // alert("成功提交");
                        $scope.list(1, 100);
                        $scope.myList(1, 100);
                        $scope.$apply();

                    }
                    else {
                        console.log(data);
                    }
                },
                dataType: 'json',
            });
            }
        };

        $scope.searchCompany = function () {
            $location.path("/user/search");
        }

    }]);
userCtrl.controller('SearchCtrl',
    ['$scope', '$http', '$rootScope', '$timeout', '$location', function ($scope, $http, $rootScope, $timeout, $location) {
        $scope.search_text = '';
        $scope.search_loading = false;
        $scope.search = function () {
            var input = document.getElementById("your-input-id");
            input.blur();
            $timeout(function () {
                $scope.search_loading = true;
            }, 300);
            var m_params = {
                "userId": $rootScope.login_user.userId,
                "token": $rootScope.login_user.token,
                "pageNo": 1,
                "pageSize": 20,
                "wd": $scope.search_text
            };
            console.log(m_params);
            $http({
                url: api_uri + "company/query/pageCompanyName2",
                method: "GET",
                params: m_params
            }).success(function (d) {
                console.log(d);
                if (d.returnCode == 0) {
                    $scope.result_list = d.result.datas;
                    $scope.search_loading = false;
                }
                else {

                }
            }).error(function (d) {
            })
        };

        $scope.searchDetail = function (id) {
            console.log(id);
            $location.path("/user/search/detail/" + id);
        }
    }]);
userCtrl.controller('SearchDetailCtrl',
    ['$scope', '$http', '$rootScope', '$routeParams', '$location', function ($scope, $http, $rootScope, $routeParams, $location) {
        $scope.search_detail = false;
        $scope.detail = function () {
            var m_params = {
                "userId": $rootScope.login_user.userId,
                "token": $rootScope.login_user.token,
                "companyId": $routeParams.id
            };
            $http({
                url: api_uri + "company/query/byCompanyId2",
                method: "GET",
                params: m_params
            }).success(function (d) {
                $scope.search_detail = true;
                console.log(d);
                if (d.returnCode == 0) {
                    $scope.companyName = d.result.companyName;
                    $scope.gongshangInfo = d.result.gongshangInfo; //工商信息
                    $scope.shuiwuInfo = d.result.shuiwuInfo; //税务信息
                    $scope.zibenInfo = d.result.zibenInfo; //资本信息
                    $scope.zhuyaorenyuanInfo = d.result.zhuyaorenyuanInfo; //主要人员
                    $scope.touzirenInfo = d.result.touzirenInfo; //投资人
                    $scope.zaitouziInfo = d.result.zaitouziInfo; //再投资
                }
                else {

                }
            }).error(function (d) {
                console.log(d);
            })
        };
        $scope.detail();
    }]);
userCtrl.controller('MessageCtrl',
    ['$http', '$scope', '$rootScope', '$timeout', '$location', function ($http, $scope, $rootScope, $timeout, $location) {

        /*消息列表*/
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
                url: api_uri + "zrh/message/listc",
                method: "GET",
                params: m_params
            }).success(function (d) {
                console.log(d);
                if (d.returnCode == 0) {
                    if (d.result.totalCount == 0) {
                        $scope.message_list = false;
                    } else {
                        $scope.message_list = d.result.datas;
                        $scope.totalCount = d.result.totalCount;
                }
                }
                else {
                    //console.log(d);
                }

            }).error(function (d) {
                // console.log("login error");
                //$location.path("/error");
            })
        };
        $scope.list(1, 20);

        /*标记已读信息*/
        $scope.read_message = function (id, url) {
            var m_params = {
                userId: $rootScope.login_user.userId,
                token: $rootScope.login_user.token,
                id: id
        };
            $http({
                url: api_uri + "zrh/message/detailc",
                method: "GET",
                params: m_params
            }).success(function (d) {
                // console.log(d);
                if (d.returnCode == 0) {
                    $scope.my_apply(url, 0);
                }
                else {
                }

            }).error(function (d) {
            })
        };

        /*跳转页面*/
        $scope.my_apply = function (urlDetail, defineId) {
            if (!$rootScope.isNullOrEmpty(urlDetail)) {
                $location.path(urlDetail + "/" + defineId);
            }
        };
    }]);

userCtrl.controller('CompanyDetailCtrl',
    ['$http', '$scope', '$rootScope', '$timeout', '$location', '$routeParams', function ($http, $scope, $rootScope, $timeout, $location, $routeParams) {
        $scope.msg_red_see = false;
        $scope.choiceStyle = $routeParams.defineId; //区分任务还是申请的参数
        $scope.showImg = false;
        $scope.settings = {
            theme: 'ios',
            mode: 'scroller',
            display: 'inline',
            lang: ''
        };
        /*获取详情信息*/
        $scope.init = function () {
            if ($routeParams.defineId == 1) {
            $http({
                url: api_uri + "loanApplication/detail/" + $routeParams.id,
                method: "GET",
                params: $rootScope.login_user
            }).success(function (d) {
                console.log(d);
                if (d.returnCode == 0) {
                    $scope.company = d.result;
                    // console.log(d.result);
                } else {
                    console.log(d);
                }
            }).error(function (d) {
                // console.log("login error");
                $location.path("/error");
            });
            } else {
            $http({
                url: api_uri + "loanApplication/myDetail/" + $routeParams.id,
                method: "GET",
                params: $rootScope.login_user
            }).success(function (d) {
                console.log(d);
                if (d.returnCode == 0) {
                    $scope.company = d.result;
                    if ($scope.company.status == 0 || $scope.company.status == 1) {
                        $scope.company.jindu = "10";
                        $scope.company.progressText = "准备中";
                        $scope.company.statusNextText = "下户";
                        $scope.company.progressNext = "审核中";
                        $scope.progressTextNext = "开始下户";
                        $scope.company.message = true;
                    } else if ($scope.company.status == 2) {
                        $scope.company.jindu = "25";
                        $scope.company.progressText = "下户";
                        $scope.company.statusNextText = "审批中";
                        $scope.company.progressNext = "审核中";
                        $scope.progressTextNext = "开始审批";
                        $scope.company.message = true;
                    } else if ($scope.company.status == 3) {
                        $scope.company.jindu = "40";
                        $scope.company.progressText = "审批中";
                        $scope.company.statusNextText = "审批通过";
                        $scope.company.progressNext = "审核中";
                        $scope.progressTextNext = "审核通过";
                        $scope.company.message = true;
                    } else if ($scope.company.status == 4) {
                        $scope.company.jindu = "55";
                        $scope.company.progressText = "审批通过";
                        $scope.company.statusNextText = "开户";
                        $scope.company.progressNext = "审核中";
                        $scope.progressTextNext = "马上开户";
                        $scope.company.message = true;
                    } else if ($scope.company.status == 5) {
                        $scope.company.jindu = "70";
                        $scope.company.progressText = "开户";
                        $scope.company.statusNextText = "放款";
                        $scope.company.progressNext = "审核中";
                        $scope.progressTextNext = "开始放款";
                        $scope.message = true;
                    } else if ($scope.company.status == 6) {
                        $scope.company.jindu = "85";
                        $scope.company.progressText = "放款";
                        $scope.company.statusNextText = "完成融资";
                        $scope.company.progressNext = "审核中";
                        $scope.progressTextNext = "成功融资";
                        $scope.company.message = true;
                    } else if ($scope.company.status == 7) {
                        $scope.company.jindu = "100";
                        $scope.company.progressText = "完成融资";
                        $scope.company.message = true;
                    } else if ($scope.company.status == -1) {
                        $scope.company.jindu = "0";
                        $scope.company.triangle = "20";
                        $scope.company.textPosition = "5";
                        $scope.progressText = "申请已经取消";
                    }
                }
            }).error(function (d) {
            });
            }
            $http({
                url: api_uri + "inforTemplate/showBase/" + $routeParams.id,
                method: "GET",
                params: $rootScope.login_user
            }).success(function (d) {
                console.log(d);
                if (d.returnCode == 0) {
                    $scope.template_list = d.result.templateList;
                    if ($scope.template_list.length > 0) {
                        $scope.showImg = true;
                        console.log('true');
                    } else {
                        $scope.showImg = false;
                        console.log('false');
                    }
                    $scope.company_basic = d.result;
                } else {
                }
            }).error(function (d) {
            });
        };
        $scope.init();

        /*取消申请按钮*/
        $scope.alertCancel = function () {
            $(".coverAlert").css("display", "block");
            $(".cancelAlert").css("display", "block");
        };
        /*关闭弹出框*/
        $scope.alertExit = function () {
            $(".coverAlert").css("display", "none");
            $(".cancelAlert").css("display", "none");
        };

        /*查看照片列表*/
        $scope.previewImages = function (img, imgList) {
            // console.log(img,imgList);
            wx.previewImage({
                current: img,
                urls: imgList
            });
        };

        /*取消申请接口*/
        $scope.cancel = function () {
            var m_params = {
                userId: $rootScope.login_user.userId,
                token: $rootScope.login_user.token,
                status: 0
        };
            $http({
                url: api_uri + "loanApplication/cancel/" + $routeParams.id,
                method: "GET",
                params: m_params
            }).success(function (d) {
                // console.log(d);
                if (d.returnCode == 0) {
                    alert("取消成功");
                    $location.path("/user/center");
            } else {
                    // console.log(d);
            }
            }).error(function (d) {
                // console.log("login error");
                $location.path("/error");
            });
        };

        /*客户经理进度跟进弹出框*/
        $scope.alert = false;

        /*普通弹出框显示*/
        $scope.alert_common = function (status, id, days) {
            $scope.dateTime = days;
            $scope.alert = true;
            $scope.applyId = id;
            $scope.status = status;
            // $(".alert").css("top", $(document).scrollTop());
            $scope.alertText = "预计时间";
            $scope.alertText2 = "如需备注请在次进行描述";
        };

        /*中止项目弹窗*/
        $scope.alert_stop = function () {
            alert("asdfa");
        };
        /*逾期后的弹出框*/
        $scope.alert_overdue = function (status, id, days) {
            $scope.dateTime = days;
            $scope.alert = true;
            $scope.applyId = id;
            $scope.status = status;
            $(".alert").css("top", $(document).scrollTop());
            $scope.alertText = "延长时间";
            $scope.alertText2 = "请说明原因（必填）";
        };
        // $scope.expectDateBank = "";

        /*关闭弹出框*/
        $scope.closeAlert = function (name, $event) {
            $scope.alert = false;
            if ($scope.stopPropagation) {
                $event.stopPropagation();
            }
        };

        /*客户经理提交状态*/
        $scope.submit_status = function () {
            var params = {
                "userId": $rootScope.login_user.userId,
                "token": $rootScope.login_user.token,
                "expectDateBank": $scope.dateTimePro,
                "reason": $scope.reason,
                "applyId": $scope.applyId,
                "status": $scope.status,
        };
            if (!params.expectDateBank) {
                $scope.msg_red = "请输入预计时间";
                $scope.msg_red_see = true;
                $timeout(function () {
                    $scope.msg_red_see = false;
                }, 3000);
            } else {
                $.ajax({
                    type: 'POST',
                    url: api_uri + "applyBankDeal/refer",
                    data: params,
                    traditional: true,
                    success: function (data, textStatus, jqXHR) {
                        if (data.returnCode == 0) {
                            $scope.alert = false;
                        }
                        else {
                            console.log(data);
                        }
                    },
                    dataType: 'json',
                });
            }

        };
    }]);

userCtrl.controller('SettingCtrl', //用户设置
    ['$scope', '$rootScope', '$location', '$http', function ($scope, $rootScope, $location, $http) {

        /*初始化信息*/
        $scope.init = function () {
            //获取用户信息
            $http({
                url: api_uri + "user/setting",
                method: "GET",
                params: $rootScope.login_user
            }).success(function (d) {
                // console.log(d);
                if (d.returnCode == 0) {
                    $scope.user = d.result;
                } else {
                    // console.log(d);
                }
            }).error(function (d) {
                // console.log(d);
            });

            $http({
                url: api_uri + "qiniu/getUpToken",
                method: "GET",
                params: $rootScope.login_user
            }).success(function (d) {
                // console.log(d);
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
                                            // console.log(data);
                                        }
                                    },
                                    "json");
                            },
                            'Error': function (up, err, errTip) {
                                // console.log(err);
                                $rootScope.alert("头像上传失败！");
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
                    // console.log(d);
                }

            }).error(function (d) {
                // console.log(d);
            });

        };
        $scope.init();

        /*跳转页面*/
        $scope.reset = function () {
            $location.path("/register/reset1");
        };

        /*更新信息*/
        $scope.update = function (key) {
            $location.path("/user/update/" + key);
        };

        /*退出登录*/
        $scope.logout = function () {
            $http({
                url: api_uri + "auth/logout",
                method: "GET",
                params: $rootScope.login_user
            }).success(function (d) {
                // console.log(d);
            }).error(function (d) {
                // console.log(d);
            });
            $rootScope.removeObject("login_user", $rootScope.login_user);
            $rootScope.login_user = {};
            $location.path("/login");
        };
    }]);

userCtrl.controller('UserUpdateCtrl',
    ['$scope', '$rootScope', '$location', '$routeParams', function ($scope, $rootScope, $location, $routeParams) {
        $scope.typeKey = $routeParams.id;
        $scope.sure = function () {
            var params = {
                "userId": $rootScope.login_user.userId,
                "token": $rootScope.login_user.token,
                "j": JSON.stringify({
                    "name": $scope.userName,
                    "position": $scope.position,
                })
        };
            $.ajax({
                type: 'POST',
                url: api_uri + "user/updateNew",
                data: params,
                traditional: true,
                success: function (data, textStatus, jqXHR) {
                    if (data.returnCode == 0) {
                        $location.path("/user/center");
                    }
                    else {
                        console.log(data);
                    }
                },
                dataType: 'json',
            });
            $location.path("/user/setting");
        };
    }]);

userCtrl.controller('AddMessageCtrl',
    ['$scope', '$rootScope', '$location', function ($scope, $rootScope, $location) {
        $scope.sure = function () {
            var params = {
                "userId": $rootScope.login_user.userId,
                "token": $rootScope.login_user.token,
                "j": JSON.stringify({
                    "name": $scope.userName,
                    "position": $scope.position,
                })
            };
            $.ajax({
                type: 'POST',
                url: api_uri + "user/updateNew",
                data: params,
                traditional: true,
                success: function (data, textStatus, jqXHR) {
                    if (data.returnCode == 0) {
                        $location.path("/user/center");
                    }
                    else {
                        console.log(data);
                    }
                },
                dataType: 'json',
            });
        };
    }]);