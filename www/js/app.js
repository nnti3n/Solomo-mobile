angular.module('solomo.controllers', []);

angular.module('solomo.services', []);

angular.module('angularRestful', []);

angular.module('solomo', ['ionic', 'solomo.controllers', 'solomo.services', 'ngCordova', 'ngStorage', 'angularRestful'])

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
                templateUrl: 'templates/tabs.html'
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
                }

            })

            .state('tab.noti', {
                url: '/noti',
                views: {
                    'tab-noti': {
                        templateUrl: 'templates/tab-noti.html',
                        controller: 'NotiCtrl'
                    }
                }
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
    });

var baseUrl = "https://solomo-api.herokuapp.com/api/v1";
