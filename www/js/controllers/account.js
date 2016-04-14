angular.module('solomo.controllers')

    .controller('AccountCtrl', function($scope, UserService, $ionicActionSheet, $state, $ionicLoading, Post, Follow){

        $ionicLoading.show({
            template: '<ion-spinner icon="lines"></ion-spinner>',
            duration: 15000
        });

        $scope.profile = UserService.getUser();

        //open post
        $scope.OpenDetail = function (viewId) {
            $state.go("tab.view-detail", {viewId: viewId})
        };

        //open profile
        $scope.OpenProfile = function (userId) {
            $state.go("tab.user-profile", {userId: userId})
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
            $scope.show = "posts";
            $ionicLoading.hide();
        }, function (error) {
            $ionicLoading.hide();
            console.log(error);
        });

        Post.likedposts({
            params: {
                user_token: UserService.getUser().user_token,
                liked_by_id: UserService.getUser().userID
            },
            timeout: 10000
        }, function (success) {
            console.log(success);
            $scope.liked = success.posts;
            $ionicLoading.hide();
        }, function (error) {
            $ionicLoading.hide();
            console.log(error);
        });

        //show post
        $scope.ShowPosts = function () {
            $scope.show = "posts";
        };

        //show liked posts
        $scope.ShowLikedPosts = function () {
            $scope.show = "likedposts";
        };

        //show followers
        $scope.ShowFollowing = function () {
            $scope.show = "followings";
        };

        //show followers
        $scope.ShowFollowers = function () {
            $scope.show = "followers";
        };

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
                console.log(success);
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
