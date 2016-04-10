angular.module('solomo.controllers')

    .controller('AccountCtrl', function($scope, UserService, $ionicActionSheet, $state, $ionicLoading, Post, Follow){

        $scope.profile = UserService.getUser();

        $scope.OpenDetail = function (viewId) {
            $state.go("tab.view-detail", {viewId: viewId})
        };

        Post.posts({
            params: {
                user_token: UserService.getUser().user_token,
                user_id: UserService.getUser().userID
            },
            timeout: 10000
        }, function (success) {
            console.log(success);
            $scope.feeds = success.posts;
            $ionicLoading.hide();
        }, function (error) {
            $ionicLoading.hide();
            console.log(error);
        });

        Follow.follower({
                params:{
                    user_token:UserService.getUser().user_token,
                    user_id:UserService.getUser().userId
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
                    user_id:UserService.getUser().userId
                }},
            function(success){
                $scope.followings_number = success.followings.length;
                $scope.followings = success.followings;
            },
            function(error) {
                console.log("error trying to get user followings" + UserService.getUser().user_token)
            }
        );

        $scope.showLogOutMenu = function() {
            var hideSheet = $ionicActionSheet.show({
                destructiveText: 'Logout',
                titleText: 'Are you sure you want to logout? This app is awsome so I recommend you to stay.',
                cancelText: 'Cancel',
                cancel: function() {},
                buttonClicked: function(index) {
                    return true;
                },
                destructiveButtonClicked: function(){
                    $ionicLoading.show({
                        template: 'Logging out...'
                    });

                    // Facebook logout
                    facebookConnectPlugin.logout(function(){
                            $ionicLoading.hide();
                            $state.go('login');
                        },
                        function(fail){
                            $ionicLoading.hide();
                            $state.go('login');
                        });
                }
            });
        };
    });
