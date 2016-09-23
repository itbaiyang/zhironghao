
var userCtrl = angular.module('userCtrl', []);
/*个人中心*/
userCtrl.controller('UserCenterCtrl', function ($http, $scope, $rootScope,$timeout, $location) {
	$scope.message = false;//是否有数据，初始化为否

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
				console.log(d);
				if (d.returnCode == 0) {
					$scope.nickname = d.result.nickname;
					$scope.batting = d.result.batting;
					$scope.value = d.result.value;
					$scope.position = d.result.position;
					$scope.headImg = d.result.headImg;
					$scope.msgCount = d.result.msgCount;
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
			// console.log(d);
			if (d.returnCode == 0) {
				$scope.role = d.result;
			} else {

			}
		}).error(function (d) {
		});
	};

	/*获取个人申请列表*/
	$scope.list = function (pageNo,pageSize) {
		if(!$scope.type){
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
			console.log(d);
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

	/*普通*/
	$scope.alert_come = function (status, id, days) {
		$scope.dateTime = days;
		$scope.alert = true;
		$scope.applyId = id;
		$scope.status = status;
		$scope.alertText = "预计时间";
		$scope.alertText2 = "如需备注请在次进行描述";
	};

	/*逾期后*/
	$scope.alert_come1 = function (status, id, days) {
		$scope.dateTime = days;
		$scope.alert = true;
		$scope.applyId = id;
		$scope.status = status;
		$scope.alertText = "延长时间";
		$scope.alertText2 = "请说明原因（必填）";
	};
	// $scope.expectDateBank = "";

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
		if ($scope.stopPropagation) {
			$event.stopPropagation();
		}
	};

	/*客户经理提交状态*/
	$scope.submit_status = function () {
		var params = {
			"userId": $rootScope.login_user.userId,
			"token": $rootScope.login_user.token,
			"expectDateBank": $scope.dateTime,
			"reason": $scope.reason,
			"applyId": $scope.applyId,
			"status": $scope.status,
		};
		if (params.expectDateBank == "") {
			alert("请输入预计时间");
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
});

userCtrl.controller('MessageCtrl', function ($http, $scope, $rootScope, $timeout, $location) {

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
});

userCtrl.controller('CompanyDetailCtrl', function ($http, $scope, $rootScope, $location, $routeParams) {

	$scope.choiceStyle = $routeParams.defineId; //区分任务还是申请的参数

	/*获取详情信息*/
	$scope.init = function () {
		// $scope.bt_show = 0;
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
				}else {
					// console.log(d);
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
						$scope.company.jindu = "50";
						$scope.company.progressText = "下户";
						$scope.company.statusNextText = "审批中";
						$scope.company.progressNext = "审核中";
						$scope.progressTextNext = "开始审批";
						$scope.company.message = true;
					} else if ($scope.company.status == 3) {
						$scope.company.jindu = "75";
						$scope.company.progressText = "审批中";
						$scope.company.statusNextText = "审批通过";
						$scope.company.progressNext = "审核中";
						$scope.progressTextNext = "审核通过";
						$scope.company.message = true;
					} else if ($scope.company.status == 4) {
						$scope.company.jindu = "100";
						$scope.company.progressText = "审批通过";
						$scope.company.statusNextText = "开户";
						$scope.company.progressNext = "审核中";
						$scope.progressTextNext = "马上开户";
						$scope.company.message = true;
					} else if ($scope.company.status == 5) {
						$scope.company.jindu = "100";
						$scope.company.progressText = "开户";
						$scope.company.statusNextText = "放款";
						$scope.company.progressNext = "审核中";
						$scope.progressTextNext = "开始放款";
						$scope.message = true;
					} else if ($scope.company.status == 6) {
						$scope.company.jindu = "100";
						$scope.company.progressText = "放款";
						$scope.company.statusNextText = "完成融资";
						$scope.company.progressNext = "审核中";
						$scope.progressTextNext = "成功融资";
						$scope.company.message = true;
					} else if ($scope.company.status == 7) {
						$scope.company.jindu = "100";
						$scope.company.progressText = "放款";
						$scope.company.statusNextText = "完成融资";
						$scope.company.progressNext = "完成融资";
						$scope.progressTextNext = "成功融资";
						$scope.company.message = true;
					} else if ($scope.company.status == -1) {
						$scope.company.jindu = "0";
						$scope.company.triangle = "20";
						$scope.company.textPosition = "5";
						$scope.progressText = "申请已经取消";
					}
				}
			}).error(function (d) {
				// console.log("login error");
				$location.path("/error");
			});
		};
		$http({
			url: api_uri + "inforTemplate/showBase/" + $routeParams.id,
			method: "GET",
			params: $rootScope.login_user
		}).success(function (d) {
			//console.log(d);
			if (d.returnCode == 0) {
				$scope.company_basic = d.result;
				$scope.template_list = d.result.templateList;
				angular.forEach($scope.company_basic.templateList, function (data) {
				});
			} else {
			}
		}).error(function (d) {
		});
	};
	$scope.init();

	/*取消申请按钮*/
	$scope.alertCancel = function(){
		$(".coverAlert").css("display","block");
		$(".cancelAlert").css("display","block");
	};
	/*关闭弹出框*/
	$scope.alertExit = function(){
		$(".coverAlert").css("display","none");
		$(".cancelAlert").css("display","none");
	};

	/*查看照片列表*/
	$scope.previewImages = function(img,imgList){
		// console.log(img,imgList);
		wx.previewImage({
			current: img,
			urls: imgList
		});
	};

	/*取消申请接口*/
	$scope.cancel =function(){
		var m_params = {
			userId: $rootScope.login_user.userId,
			token: $rootScope.login_user.token,
			status: 0
		};
		$http({
			url: api_uri + "loanApplication/cancel/"+$routeParams.id,
			method: "GET",
			params: m_params
		}).success(function (d) {
			console.log(d);
			if (d.returnCode == 0) {
				alert("取消成功");
				$location.path("/user/center");
			}else {
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
	$scope.alert_come = function (status, id, days) {
		$scope.dateTime = days;
		$scope.alert = true;
		$scope.applyId = id;
		$scope.status = status;
		$(".alert").css("top", $(document).scrollTop());
		$scope.alertText = "预计时间";
		$scope.alertText2 = "如需备注请在次进行描述";
	};

	/*逾期后的弹出框*/
	$scope.alert_come1 = function (status, id, days) {
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
			"expectDateBank": $scope.dateTime,
			"reason": $scope.reason,
			"applyId": $scope.applyId,
			"status": $scope.status,
		};
		if (!params.expectDateBank) {
			alert("请输入预计时间");
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
});

userCtrl.controller('SettingCtrl', //用户设置
    ['$scope','$rootScope', '$location', '$http', function ($scope, $rootScope, $location, $http) {

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
		        }else {
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
        $scope.reset = function(){
            $location.path("/register/reset1");
        };

		/*更新信息*/
        $scope.update = function(key,value){
			if (!$rootScope.isNullOrEmpty(key)) {
        		if($rootScope.isNullOrEmpty(value)) value = "";
        	   $rootScope.putObject("user_update",key+"="+value);
        	   $location.path("/user/update");
        	}
        };

		/*退出登录*/
        $scope.logout =  function(){
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
    ['$scope','$rootScope', '$location', '$http', function ($scope, $rootScope, $location, $http) {
        
        $scope.init = function(){
        	var user_update = $rootScope.getObject("user_update");
	        if(user_update && user_update.indexOf("=")){
	        	$rootScope.removeObject("user_update");
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
}]);