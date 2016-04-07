angular.module('solomo.controllers')

    .controller('NotiCtrl', function($scope, NotiService, UserService, $ionicLoading, $state, $rootScope) {

        $ionicLoading.show({
            template: '<ion-spinner icon="lines"></ion-spinner>',
            duration: 15000
        });

        $scope.request = {};
        $scope.request.page = 1;
        $scope.notifications = [];
        $scope.profile = UserService.getUser();

        getnoti();

        $scope.doRefresh = function() {
            $scope.request.page = 1;
            getnoti();
        };

        $scope.loadMore = function() {

            if ($scope.request.limit && $scope.request.page >= $scope.request.limit) {
                $scope.$broadcast('scroll.infiniteScrollComplete');
                return false;
            }

            NotiService.get({
                params:{
                    user_token:UserService.getUser().user_token,
                    page:$scope.request.page+1
                },
                timeout: 15000
            }, function(success){
                $scope.notifications = $scope.notifications.concat(success.notifications);
                $scope.$broadcast('scroll.infiniteScrollComplete');
                $scope.request.limit = success.pagination.total_pages;
                $scope.request.page++;
                $ionicLoading.hide();
            },function(error){
                $scope.$broadcast('scroll.infiniteScrollComplete');
                $ionicLoading.hide();
                console.log(error);
            });
        };

        $scope.OpenDetail = function (notiId, refId, type) {
            //read noti then state go
            console.log(refId);
            readnoti(notiId);
            if (type == "follow") {
                $state.go("tab.user-profile", {userId: refId});
            } else {
                $state.go("tab.view-detail", {viewId: refId});
            }
        };

        function getnoti () {
            NotiService.get({
                params: {
                    user_token: UserService.getUser().user_token,
                    page: $scope.request.page
                }
            }, function(success) {
                console.log(success);
                $scope.notifications = success.notifications;
                $scope.$broadcast('scroll.refreshComplete');
                $ionicLoading.hide();
            }, function(error) {
                console.log(error);
                $scope.$broadcast('scroll.refreshComplete');
                $ionicLoading.hide();
            });

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
            });
        }

        function readnoti(notiId) {

            NotiService.read({
                user_token: UserService.getUser().user_token,
                notification_ids: notiId
            }, function (success) {
                if ($rootScope.badge.noti) {
                    $rootScope.badge.noti --;
                }
                console.log(success);
            }, function (error) {
                console.log(error);
            });
        }
    });
