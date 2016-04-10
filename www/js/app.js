angular.module('solomo.controllers', []);

angular.module('solomo.services', []);

angular.module('angularRestful', []);

angular.module('solomo', ['ionic', 'solomo.controllers', 'solomo.services', 'ngCordova', 'ngStorage', 'angularRestful', 'ionic-material'])

.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }

        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }

    });
})

.run(function ($rootScope, $state, UserService) {
    $rootScope.$on('$stateChangeStart', function (event,next) {

        if (!UserService.getUser().userID) {
            if (next.name !== 'login') {
                event.preventDefault();
                $state.go('login');
            }
        }
    });

    //notification bind
    if (UserService.getUser().userID) {
        //console.log("hello noti");
        //NotiService.noti();
        var pusher = new Pusher('0c17cd4dfacbde4ad303', {
            cluster: 'ap1',
            encrypted: true
        });

        var channel = pusher.subscribe('notification_user_' + UserService.getUser().userID);
        channel.bind('new_notification', function(data) {
            $rootScope.badge.noti ++;
            console.log("noti increased");
            $rootScope.$apply();
        });

        // Enable pusher logging - don't include this in production
        Pusher.log = function(message) {
            if (window.console && window.console.log) {
                window.console.log(message);
            }
        };
    }

    //-------------------- GET LOCATION---------------------------
    var options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
    };

    function success(pos) {
        console.log("success");
        UserService.setLat(pos.coords.latitude);
        UserService.setLong(pos.coords.longitude);
    }

    function error(err) {
        console.warn('ERROR(' + err.code + '): ' + err.message);
        UserService.setLat(10.7756590);
        UserService.setLong(106.7004240);
    }

    navigator.geolocation.getCurrentPosition(success, error, options);
    //-------------------- GET LOCATION---------------------------
})

.config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider

    // login
    .state('login', {
        url: "/login",
        templateUrl: "templates/login.html",
        controller: 'LoginCtrl'
    })

    // setup an abstract state for the tabs directive
    .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html',
        controller: 'TabCtrl'
    })

    // Each tab has its own nav history stack:

    .state('tab.dash', {
        url: '/dash',
        views: {
            'tab-dash': {
                templateUrl: 'templates/tab-dash.html',
                controller: 'DashCtrl'
            }
        }
    })

    .state('tab.view-detail', {
        url: '/view-detail/:viewId',
        views: {
            'tab-dash': {
                templateUrl: 'templates/view-detail.html',
                controller: 'ViewDetailCtrl'
            }
        },
        cache: false
    })

    .state('tab.user-profile', {
        url: '/profile/:userId',
        views: {
            'tab-dash': {
                templateUrl: 'templates/user-profile.html',
                controller: 'ProfileCtrl'
            }
        },
        cache: false
    })

    .state('tab.noti', {
        url: '/noti',
        views: {
            'tab-noti': {
                templateUrl: 'templates/tab-noti.html',
                controller: 'NotiCtrl'
            }
        },
        cache: false
    })

    .state('tab.post', {
        url: '/post',
        views: {
            'tab-post': {
                templateUrl: 'templates/tab-post.html',
                controller: 'PostCtrl'
            }
        }
    })

    .state('tab.map', {
        url: '/map',
        views: {
            'tab-map': {
                templateUrl: 'templates/tab-map.html',
                controller: 'MapCtrl'
            }
        }
    })

    .state('tab.account', {
        url: '/account',
        views: {
            'tab-account': {
                templateUrl: 'templates/tab-account.html',
                controller: 'AccountCtrl'
            }
        }
    });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('login');

})

.config(function ($ionicConfigProvider) {
    $ionicConfigProvider.navBar.alignTitle('center');
    $ionicConfigProvider.tabs.position('bottom');
})

.config(function($compileProvider){
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
})

.directive('hideTabs', function($rootScope) {
    return {
        restrict: 'A',
        link: function($scope, $el) {
            $rootScope.hideTabs = true;
            $scope.$on('$destroy', function() {
                $rootScope.hideTabs = false;
            });
        }
    };
})

.directive('backImg', function(){
    return function(scope, element, attrs){
        var url = attrs.backImg;
        element.css({
            'background-image': 'url(' + url +')',
            //'background-size' : 'cover'
        });
    };
});

var baseUrl = "https://solomo-api.herokuapp.com/api/v1";
