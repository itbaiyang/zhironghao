
var userCtrl = angular.module('userCtrl', []);
/*个人中心*/
userCtrl.controller('UserCenterCtrl', function ($http, $scope, $rootScope,$timeout, $location) {
	var result_list =[];
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
			//$scope.init_role();
			$scope.list(1, $scope.totalCount);
			$scope.myList(1, $scope.myTotalCount);
			console.log("debug");
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
					} else {
						$scope.message = true;
					}
				} else {
					$scope.message_myList = true;
					$scope.my_list = d.result.datas;
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
								data.progressNext = "审核中";
								data.progressTextNext = "开始约见";
								$scope.message = true;
							} else if (data.status == 2) {
								data.jindu = "50";
								data.triangle = "44";
								data.textPosition = "36";
								data.progressText = "约见中";
								data.progressNext = "审核中";
								data.progressTextNext = "继续跟进";
								$scope.message = true;
							} else if (data.status == 3) {
								data.jindu = "75";
								data.triangle = "66";
								data.textPosition = "58";
								data.progressText = "跟进中";
								data.progressNext = "审核中";
								data.progressTextNext = "完成贷款";
								$scope.message = true;
							} else if (data.status == 4) {
								data.jindu = "100";
								data.triangle = "86";
								data.textPosition = "76";
								data.progressText = "成功融资";
								data.progressNext = "已经完成";
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
		//$(".alert").css("margin-top", $(document).scrollTop());
		$scope.alertText = "预计时间";
		$scope.alertText1 = "备注内容";
		$scope.alertText2 = "企业方需要补充一张个人征信表和法人的身份证证件";
	};
	$scope.alert_come1 = function (status, id, days) {
		$scope.dateTime = days;
		$scope.alert = true;
		$scope.applyId = id;
		$scope.status = status;
		//$(".alert").css("margin-top", $(document).scrollTop());

		$scope.alertText = "延长时间";
		$scope.alertText1 = "说明原因";
		$scope.alertText2 = "企业方征信问题没有及时提交，请尽快提交到位";
	};
	$scope.expectDateBank = "";

	$scope.init();

	$scope.userDetail = function(){
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
	$scope.sure = function () {
		var params = {
			"userId": $rootScope.login_user.userId,
			"token": $rootScope.login_user.token,
			"expectDateBank": $scope.dateTime,
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
					$(".alertCenterSubmit").css("display", "block", "top", $(document).scrollTop());
					$timeout(function () {
						$(".alertCenterSubmit").css("display", "none");
						//$location.path("/user/center");
					}, 2000);
					$scope.$apply();

				}
				else {
					console.log(data);
				}
			},
			dataType: 'json',
		});
	};

});

userCtrl.controller('MessageCtrl', function ($http, $scope, $rootScope, $timeout, $location) {
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
					//angular.forEach($scope.result_list, function (data) {
					//
					//});
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
	$scope.list(1, 20);
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
			console.log(d);
			if (d.returnCode == 0) {
				$scope.my_apply(url, 0);
			}
			else {
			}

		}).error(function (d) {
			console.log("login error");
			//$location.path("/error");
		})
	};
	$scope.my_apply = function (urlDetail, defineId) {
		if (!$rootScope.isNullOrEmpty(urlDetail)) {
			$location.path(urlDetail + "/" + defineId);
		}
	};
});

userCtrl.controller('CompanyDetailCtrl', function ($http, $scope, $rootScope, $location, $routeParams) {
	$scope.choiceStyle = $routeParams.defineId;
	$scope.init = function () {
		$scope.bt_show = 0;
		if ($routeParams.defineId == 1) {
			$http({
				url: api_uri + "loanApplication/detail/" + $routeParams.id,
				method: "GET",
				params: $rootScope.login_user
			}).success(function (d) {
				console.log(d);
				if (d.returnCode == 0) {
					$scope.company = d.result;
					console.log(d.result);
				}else {
					console.log(d);
				}
			}).error(function (d) {
				console.log("login error");
				$location.path("/error");
			});
		} else {
			$http({
				url: api_uri + "loanApplication/myDetail/" + $routeParams.id,
				method: "GET",
				params: $rootScope.login_user
			}).success(function (d) {
				//console.log(d);
				if (d.returnCode == 0) {
					$scope.company = d.result;
					console.log(d.result);
					if ($scope.company.status == 1) {
						$scope.company.jindu = "10";
						$scope.company.triangle = "8";
						$scope.company.textPosition = "2";
						$scope.company.progressText = "审核中";
						$scope.progressTextNext = "开始约见";
						$scope.message = true;
					} else if ($scope.company.status == 2) {
						$scope.company.jindu = "50";
						$scope.company.triangle = "44";
						$scope.company.textPosition = "36";
						$scope.company.progressText = "约见中";
						$scope.progressTextNext = "继续跟进";
						$scope.message = true;
					} else if ($scope.company.status == 3) {
						$scope.company.jindu = "75";
						$scope.company.triangle = "66";
						$scope.company.textPosition = "58";
						$scope.company.progressText = "跟进中";
						$scope.progressTextNext = "完成贷款";
						$scope.message = true;
					} else if ($scope.company.status == 4) {
						$scope.company.jindu = "100";
						$scope.company.triangle = "86";
						$scope.company.textPosition = "76";
						$scope.company.progressText = "成功融资";
						$scope.progressTextNext = "贷款结束";
						$scope.message = true;
					} else if ($scope.company.status == -1) {
						$scope.company.jindu = "0";
						$scope.company.triangle = "20";
						$scope.company.textPosition = "5";
						$scope.company.progressText = "申请已经取消";
					}
				} else {
					console.log(d);
				}
			}).error(function (d) {
				console.log("login error");
				$location.path("/error");
			});
		}
		;
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
					if (data.templateType == 3 && data.title == "财务报表") {
						$scope.img_list = data.imgList;
					}
				});
				console.log($scope.img_list);
				console.log(d.result);
			} else {
				console.log(d);
			}
		}).error(function (d) {
			//console.log("login error");
			//$location.path("/error");
		});
	};
	$scope.init();

	$scope.alertCancel = function(){
		$(".coverAlert").css("display","block");
		$(".cancelAlert").css("display","block");
	};
	$scope.alertExit = function(){
		$(".coverAlert").css("display","none");
		$(".cancelAlert").css("display","none");
	};
	$(document).on('click', '#previewImage img',function(event) {
		var imgArray = [];
		var curImageSrc = $(this).attr('src');
		if (curImageSrc ) {
			$('#previewImage img').each(function(index, el) {
				var itemSrc = $(this).attr('src');
				imgArray.push(itemSrc);
			});
			wx.previewImage({
				current: curImageSrc,
				urls: imgArray
			});
		}
	});

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
				$location.path("/user/center");
			}else {
				console.log(d);
			}
		}).error(function (d) {
			console.log("login error");
			$location.path("/error");
		});
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
			"expectDateBank": $scope.dateTime,
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
					//$scope.show();
					//$scope.$apply();

				}
				else {
					console.log(data);
				}
			},
			dataType: 'json',
		});
	};
});

userCtrl.controller('SettingCtrl', //用户设置
    ['$scope','$rootScope', '$location', '$http', function ($scope, $rootScope, $location, $http) {
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
		        }else {
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
        $scope.reset = function(){
            $location.path("/register/reset1");
        };


        $scope.update = function(key,value){
			if (!$rootScope.isNullOrEmpty(key)) {
        		if($rootScope.isNullOrEmpty(value)) value = "";
        	   $rootScope.putObject("user_update",key+"="+value);
        	   $location.path("/user/update");
        	}
        };

        $scope.logout =  function(){
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
        	//params.position = $scope.update_user.position;
        	console.log(params);
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