var articleCtrl = angular.module('articleCtrl', []);

articleCtrl.controller('ArticleListCtrl',
    ['$http', '$scope', '$rootScope', '$location', '$routeParams',
        function ($http, $scope, $rootScope, $location, $routeParams) {
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
                wx.ready(function () {
                    $rootScope.getUrl($location.absUrl(), $routeParams.id);
                    console.log($routeParams.id, 'xiwanga');
                });
            }
            else {
                // console.log(d.result);
            }
        }).error(function (d) {
            // console.log("login error");
            $location.path("/error");
        })
    };
    $scope.list(1, 100); //TODO:预设100个，没做分页设计，

    $scope.result_list = {
        result: {},
        returnCode: 0
    };
    $scope.article_show = function (id) { //跳转到详情页面
        id.good = true;
        if (!$rootScope.isNullOrEmpty(id.id)) {
            $location.path("/article/show/" + id.id);
            id.good = false;
        }
    };
    $scope.detailActivity = function () { //跳转到活动详情
        $location.path("/article/scb")
    }
    }]);

articleCtrl.controller('ArticleShowCtrl',
    ['$http', '$scope', '$rootScope', '$location', '$routeParams', function ($http, $scope, $rootScope, $location, $routeParams) {
    $scope.init = function () { //详细产品数据
        $scope.bt_show = 0;
        $http({
            url: api_uri + "financialProduct/detail/" + $routeParams.id,
            method: "GET",
        }).success(function (d) {
            console.log(d);
            $rootScope.shareBankname = d.result.bankname + '-';
            $rootScope.shareProductName = d.result.name;
            $rootScope.desc_detail = '额度：' + d.result.loanvalue + '  期限：' + d.result.loanlife + '  利息：' + d.result.rate + '%';
            console.log($rootScope.desc);
            console.log(d);
            wx.ready(function () {
                $rootScope.getUrl($location.absUrl(), $routeParams.id);
                console.log($routeParams.id, 'xiwanga');
            });
            if (d.returnCode == 0) {
                $scope.article_detail = d.result;
                $scope.feature_list = d.result.feature;
                $scope.apply_List = d.result.conditions;
                $scope.id = d.result.id;
                $scope.type = d.result.type;
                console.log($scope.type);
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
                // console.log(d);
            }
        }).error(function (d) {
            // console.log("login error");
            //$location.path("/error");
        });
    };
    $scope.init();
    $scope.apply = function () {
        // $rootScope.present_route = $location.$$path;
        if (!$rootScope.isNullOrEmpty($scope.id)) {
            $location.path("/article/apply/" + $scope.id + $scope.type);
        }
    };
    }]);

articleCtrl.controller('ArticleShowScbCtrl',
    ['$http', '$scope', '$rootScope', '$location', '$routeParams', function ($http, $scope, $rootScope, $location, $routeParams) {
        $scope.show = 0;
        $scope.translateFromClick = function () {
            $scope.show = 1;
        };
        $scope.applyCompany = function () {
            $location.path("/article/apply/f36131316d4847e09fb9eb4ab5a6c66c0");
        };
        $scope.applyPerson = function () {
            $location.path("/article/apply/9c5e51f10f71481eadb052d5e3950e4b2");
        };
    }]);



articleCtrl.controller('ArticleShowActivityCtrl',
    ['$http', '$scope', '$rootScope', '$location', '$routeParams', function ($http, $scope, $rootScope, $location, $routeParams) {
    $scope.apply = function (type) {
        // activityID = "e15813cb5bfd4290a5c2582cbdd164a4";
        $rootScope.present_route = $location.$$path;
        if (!$rootScope.isNullOrEmpty(activityID)) {
            $location.path("/article/apply/" + activityID + type);
        }
    };
    wx.ready(function () {
        $rootScope.getUrl($location.absUrl(), $routeParams.id);
    });
    }]);

articleCtrl.controller('applyCtrl',
    ['$http', '$scope', '$rootScope', '$location', '$timeout', '$routeParams', function ($http, $scope, $rootScope, $location, $timeout, $routeParams) {
    console.log($routeParams.id);
    console.log($routeParams.type);
    $scope.type = $routeParams.type;
    $scope.init = function () {
        //获取用户信息
        $http({
            url: api_uri + "user/setting",
            method: "GET",
            params: $rootScope.login_user
        }).success(function (d) {
            // console.log(d);
            if (d.returnCode == 0) {
                $scope.company = d.result;
                $scope.savePic();
            } else {
                // console.log(d);
            }
        }).error(function (d) {
            // console.log(d);
        });
    };
    $scope.init();
    $scope.savePic = function () {
        //获取用户信息
        $scope.img_list_id = [];
        $scope.img_list_card = [];
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
                    browse_button: 'personID',       //上传选择的点选按钮，**必需**
                    //	        uptoken_url: api_uri+"api/qiniu/getUpToken",
                    uptoken: $scope.qiniu_token,
                    //	        get_new_uptoken: true,
                    //save_key: true,
                    domain: $rootScope.qiniu_bucket_domain, //bucket 域名，下载资源时用到，**必需**
                    container: 'containerID',           //上传区域DOM ID，默认是browser_button的父元素，
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
                            $timeout(function () {
                                $scope.img_list_id.push(file_url);
                            });
                        },
                        'Error': function (up, err, errTip) {
                            // console.log(err);
                            $rootScope.alert("身份证上传失败！");
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
                var Q2 = new QiniuJsSDK();
                var uploader2 = Q2.uploader({
                    runtimes: 'html5,flash,html4',    //上传模式,依次退化
                    browse_button: 'personCard',       //上传选择的点选按钮，**必需**
                    //	        uptoken_url: api_uri+"api/qiniu/getUpToken",
                    uptoken: $scope.qiniu_token,
                    //	        get_new_uptoken: true,
                    //save_key: true,
                    domain: $rootScope.qiniu_bucket_domain, //bucket 域名，下载资源时用到，**必需**
                    container: 'containerCard',           //上传区域DOM ID，默认是browser_button的父元素，
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
                            $timeout(function () {
                                $scope.img_list_card.push(file_url);
                            });
                        },
                        'Error': function (up, err, errTip) {
                            // console.log(err);
                            $rootScope.alert("房产证上传失败！");
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
    $scope.submit = function () {
        var share_msg = $rootScope.getSessionObject("share");
        if (!share_msg) {
            share_msg = {
                shareName: null,
                shareId: null
            }
        }
        var m_params = {
            userId: $rootScope.login_user.userId,
            token: $rootScope.login_user.token,
            companyName: $scope.company.companyName,
            linkman: $scope.company.name,
            mobile: $scope.company.mobile,
            // fee: $scope.company.fee,
            productId: $routeParams.id,
            share: share_msg.shareName,
            shareId: share_msg.shareId,
        };
        var m_params1 = {
            userId: $rootScope.login_user.userId,
            token: $rootScope.login_user.token,
            linkman: $scope.company.name,
            mobile: $scope.company.mobile,
            productId: $routeParams.id,
            share: share_msg.shareName,
            shareId: share_msg.shareId,
        };
        console.log(m_params);
        console.log(m_params1);
        if ($scope.type == 0 || $scope.type == 1) {
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
        } else if($scope.type == 2){
            if (typeof(m_params1.linkman) == "undefined" || m_params1.linkman == '') {
                $scope.company.errorMsg = "联系人不能为空";
                $timeout(function () {
                    $scope.company.errorMsg = "";
                }, 2000);
            } else if (typeof(m_params1.mobile) == "undefined" || m_params1.mobile == '') {
                $scope.company.errorMsg = "联系电话不能为空";
                $timeout(function () {
                    $scope.company.errorMsg = "";
                }, 2000);
            }else{
                console.log("af");
                $.ajax({
                    type: 'POST',
                    url: api_uri + "loanApplication/create",
                    data: m_params1,
                    traditional: true,
                    success: function (data, textStatus, jqXHR) {
                        console.log(data, 'success');

                        if (data.returnCode == 0) {
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
                    error: function (data, textStatus, jqXHR) {
                        console.log(data, 'error');
                    },
                    dataType: 'json',
                });
            }
        }
    };
    $scope.removeImgList = function (id,index) {
        id.splice(index, 1);
    };
    }]);