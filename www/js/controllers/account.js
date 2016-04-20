angular.module('solomo.controllers')

    .controller('AccountCtrl', function($scope, UserService, $ionicActionSheet, $ionicModal, $state, $ionicLoading, Post, Follow, Feeds){

        //search data
        $scope.data = {};
        $scope.data.search = "";
        $scope.data.items = [];
        $scope.data.loading = 0;

        $ionicLoading.show({
            template: '<ion-spinner icon="lines"></ion-spinner>',
            duration: 15000
        });

        $scope.profile = UserService.getUser();

        //open post
        $scope.OpenDetail = function (viewId) {
            $scope.clear_search();
            $scope.toggleHide();
            $state.go("tab.view-detail", {viewId: viewId})
        };

        //open profile
        $scope.GotoProfile = function (userId) {
            $scope.clear_search();
            $scope.toggleHide();
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

        //search function
        $scope.clear_search = function () {
            $scope.data.search = "";
        };

        $scope.$on('modal.hidden', function() {
            $scope.clear_search();
        });

        $scope.search = function () {
            $scope.data.loading = 1;
            Feeds.search_all({
                params: {
                    user_token: UserService.getUser().user_token,
                    q: $scope.data.search
                }
            }, function (success) {
                console.log(success);
                $scope.data.loading = 0;
                $scope.data.items = success.results;
            }, function (error) {
                $scope.data.loading = 0;
                console.log(error);
            });
        };

        $ionicModal.fromTemplateUrl('modal-search.html', function($ionicModal) {
            $scope.toggleHide = function () {
                $ionicModal.hide();
            };

            $scope.toggleModal = function (exit) {
                if ($ionicModal.isShown() || exit) {
                    $ionicModal.hide();
                } else {
                    $ionicModal.show();
                }
            }
        }, {
            // Use our scope for the scope of the modal to keep it simple
            scope: $scope,
            // The animation we want to use for the modal entrance
            animation: 'no-animation'
        });

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
