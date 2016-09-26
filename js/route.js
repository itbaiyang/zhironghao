/**
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
        .when('/article/showActivity', {//详情
            templateUrl: templates_root + 'article/showActivity.html',
            controller: 'ArticleShowActivityCtrl'
        })
        .when('/article/show/:id', {//详情
            templateUrl: templates_root + 'article/show.html',
            controller: 'ArticleShowCtrl'
        })
       .when('/article/apply/:id:type', {//申请
            templateUrl: templates_root + 'article/apply.html',
            controller: 'applyCtrl'
        })
        .when('/user/center', {//个人中心
            templateUrl: templates_root + 'user/center.html',
            controller: 'UserCenterCtrl'
        })
        .when('/user/message', {//消息
            templateUrl: templates_root + 'user/message.html',
            controller: 'MessageCtrl'
        })
        .when('/user/companyDetail/:id/:defineId', {//企业详情
            templateUrl: templates_root + 'user/company_detail.html',
            controller: 'CompanyDetailCtrl'
        })
        .when('/user/setting', {//设置
            templateUrl: templates_root + 'user/setting.html',
            controller: 'SettingCtrl'
        })
        .when('/user/add_name', {//添加名字职位
            templateUrl: templates_root + 'user/add_name.html',
            controller: 'AddMessageCtrl'
        })
        .when('/user/update/:id', {//用户更改参数
            templateUrl: templates_root + 'user/update.html',
            controller: 'UserUpdateCtrl'
        })
        .when('/error', {//用户更改参数
            templateUrl: templates_root + '404.html',
            //controller: 'UserUpdateCtrl'
        })
        .otherwise({redirectTo: '/login'})
});