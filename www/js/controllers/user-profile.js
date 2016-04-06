angular.module('solomo.controllers')

    .controller('ProfileCtrl', function($scope, UserService, $ionicActionSheet, $state, $ionicLoading, Post, $stateParams, Follow, $ionicHistory){

        $ionicLoading.show({
            template: '<ion-spinner icon="lines"></ion-spinner>',
            duration: 15000
        });

        userfeed();

        //back button
        $scope.GoBack = function () {
            if ($ionicHistory.backView()) {
                console.log("back");
                $ionicHistory.goBack();
            } else {
                $state.go('tab.dash');
            }
            //$state.go('tab.dash');
        };

        $scope.doRefresh = function() {
            userfeed();
        };

        $scope.OpenDetail = function (viewId) {
            $state.go("tab.view-detail", {viewId: viewId})
        };

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
            Follow.follow({
                user_token: UserService.getUser().user_token,
                following_id:$stateParams.userId
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

        function userfeed() {
            Post.feeds({
                params: {
                    user_token: UserService.getUser().user_token,
                    user_id: $stateParams.userId
                },
                timeout: 15000
            }, function (success) {
                console.log(success);
                $scope.feeds = success.posts;
                $scope.$broadcast('scroll.refreshComplete');
                $ionicLoading.hide();
            }, function (error) {
                $ionicLoading.hide();
                console.log(error);
            });
        }

    });
