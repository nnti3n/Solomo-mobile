angular.module('solomo.controllers')

    .controller('ProfileCtrl', function($scope, UserService, $ionicActionSheet, $state, $ionicLoading, Post, $stateParams, Follow){

        $ionicLoading.show({
            template: '<ion-spinner icon="lines"></ion-spinner>',
            duration: 15000
        });

        $scope.OpenDetail = function (viewId) {
            $state.go("tab.view-detail", {viewId: viewId})
        };

        Follow.follower({
            user_token:UserService.getUser().user_token
            },
            function(success){

            },
            function(error) {

            }
        );

        $scope.Follow = function(){
            console.log($scope.cmt.content);
            Follow.follow({
                user_token: UserService.getUser().user_token,
                user_id:$stateParams.userId
            },
            function (success) {
                console.log("follow success ne`");
                console.log(success);
            },
            function (error) {
                $ionicLoading.hide();
                console.log("error follow ne`");
                console.log(error);
            });
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
