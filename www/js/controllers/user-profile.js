angular.module('solomo.controllers')

    .controller('ProfileCtrl', function($scope, UserService, $ionicActionSheet, $state, $ionicLoading, Post, $stateParams, Follow){

        $ionicLoading.show({
            template: '<ion-spinner icon="lines"></ion-spinner>',
            duration: 15000
        });

        $scope.OpenDetail = function (viewId) {
            $state.go("tab.view-detail", {viewId: viewId})
        };
        console.log($stateParams.userId);
        console.log(UserService.getUser().user_token);
        Follow.follower({
            params:{
                user_token:UserService.getUser().user_token,
                user_id:$stateParams.userId
            }},
            function(success){
                console.log(success);
                $scope.followers_number = success.followers.length;
                $scope.followers = success.followers;
            },
            function(error) {
                console.log("error trying to get user followers" + UserService.getUser().user_token)
            }
        );

        Follow.following({
            params:{
                user_token:UserService.getUser().user_token,
                user_id:$stateParams.userId
            }},
            function(success){
                $scope.followings_number = success.followings.length;
                $scope.followings = success.followings;
            },
            function(error) {
                console.log("error trying to get user followings" + UserService.getUser().user_token)
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
