angular.module('solomo.controllers')

    .controller('ProfileCtrl', function($scope, UserService, $ionicActionSheet, $state, $ionicLoading, Post, $stateParams){

        $ionicLoading.show({
            template: '<ion-spinner icon="lines"></ion-spinner>',
            duration: 15000
        });

        $scope.OpenDetail = function (viewId) {
            $state.go("tab.view-detail", {viewId: viewId})
        };

        Post.feeds({
            params: {
                user_token: UserService.getUser().user_token,
                user_id: $stateParams.userId
            },
            timeout: 15000
        }, function (success) {
            console.log(success);
            $scope.feeds = success.posts;
            $ionicLoading.hide();
        }, function (error) {
            $ionicLoading.hide();
            console.log(error);
        });

    });
