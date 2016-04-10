angular.module('solomo.controllers')

    .controller('TabCtrl', function($scope, NotiService, UserService, $rootScope, $ionicHistory) {

        $rootScope.badge = {};
        $rootScope.badge.noti = 0;

        getnoti();

        $scope.onselected = function () {
            $ionicHistory.clearHistory();
        };

        function getnoti () {
            NotiService.get({
                params: {
                    user_token: UserService.getUser().user_token,
                    read: 0
                }
            }, function(success) {
                console.log(success);
                $rootScope.badge.noti = success.notifications.length;
            }, function(error) {
                console.log(error);
                window.alert(error);
            })
        }
    });
