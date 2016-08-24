
var articleCtrl = angular.module('articleCtrl', []);

articleCtrl.controller('ArticleListCtrl', function ($http, $scope, $rootScope, $location) {
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
                $scope.result_list = d.result.datas;
                $scope.totalCount = d.result.totalCount;
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
    $scope.detailActivity = function () {
        $location.path("/article/showActivity")
    }
});

articleCtrl.controller('ArticleShowCtrl', function ($http, $scope, $rootScope, $location, $routeParams) {

    $scope.init = function () {
        $scope.bt_show = 0;
        $http({
            url: api_uri + "financialProduct/detail/" + $routeParams.id,
            method: "GET",
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
articleCtrl.controller('ArticleShowActivityCtrl', function ($http, $scope, $rootScope, $location, $routeParams) {
    $scope.id = "e15813cb5bfd4290a5c2582cbdd164a4";//测试活动
    // $scope.id = "71a28b4d3c60481ebfb6270eb27fde2c";//正式活
    $scope.apply = function () {
        $rootScope.present_route = $location.$$path;
        if (!$rootScope.isNullOrEmpty($scope.id)) {
            $location.path("/article/apply/" + $scope.id);
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
        var share_msg = $rootScope.getSessionObject("share");
        if(!share_msg){
            share_msg ={
                shareName: null,
                shareId:null
            }
        }
        var m_params = {
            userId: $rootScope.login_user.userId,
            token: $rootScope.login_user.token,
            companyName: $scope.company.companyName,
            linkman: $scope.company.name,
            mobile: $scope.company.mobile,
            fee: $scope.company.fee,
            productId: $routeParams.id,
            share: share_msg.shareName,
            shareId: share_msg.shareId
        };
        console.log(m_params, "baiyang");
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