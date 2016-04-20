    angular.module('solomo.controllers')

        .controller('ViewDetailCtrl', function($scope, $ionicHistory, $state,$ionicLoading, $stateParams, Post, UserService, $window, Comment, $localStorage) {
            console.log($stateParams.viewId);
            $scope.load = "";
            $scope.cmt = {};
            $scope.cmt.content = "";

            $scope.sendComment = function(){
                console.log($scope.cmt.content);
                $scope.load = "loading";
                Comment.send({
                        user_token: UserService.getUser().user_token,
                        post_id: $stateParams.viewId,
                        content:$scope.cmt.content,
                        timeout: 10000
                },
                function (success) {
                    var cm = {};
                    cm.user = UserService.getUser();
                    cm.user.avatar = UserService.getUser().picture;
                    console.log(cm.user);
                    cm.content = $scope.cmt.content;
                    $scope.post.comments.comments.unshift(cm);
                    $scope.cmt.content = "";
                    $scope.load = "done";
                    console.log("send comment success ne`");
                    console.log(success);
                },
                function (error) {
                    $ionicLoading.hide();
                    console.log("error send comment ne`");
                    console.log(error);
                });
            };
            var email = UserService.getUser().email;

            //search
            $scope.search = {};
            $scope.search.searchText = "";
            $scope.clear_search = function () {
                $scope.search.searchText = "";
            };

            $ionicLoading.show({
                template: 'loading...',
                duration: 10000
            });

            // call api
            PostRequest();

            //open profile
            $scope.OpenProfile = function (userId) {
                $state.go("tab.user-profile", {userId: userId})
            };

            //pull to refresh
            $scope.doRefresh = function() {
                PostRequest();
            };

            function PostRequest() {
                Post.get({
                    params: {
                        user_token: UserService.getUser().user_token,
                        post_id: $stateParams.viewId
                    },
                    timeout: 10000
                }, function (success) {
                    console.log(success);
                    $scope.post = success;

                    //check like
                    $scope.post.icon_like = "ion-android-star-outline";
                    var success_string = JSON.stringify(success.likes);
                    console.log(success_string.indexOf(email));
                    if (success_string.indexOf(email) > -1) {
                        $scope.post.icon_like = "ion-android-star";
                        $scope.post.liked = 1;
                    }

                    UserService.setObject('mappost',$scope.post);

                    //turn off refresh
                    $scope.$broadcast('scroll.refreshComplete');
                    $ionicLoading.hide();
                }, function (error) {
                    $ionicLoading.hide();
                    $window.alert("error loading feeds");
                    console.log(error);
                })
            }

            //like and unlike
            $scope.like = function () {
                if (!$scope.post.liked) {
                    //like
                    Post.like({
                        user_token: UserService.getUser().user_token,
                        post_id: $stateParams.viewId,
                        timeout: 10000
                    }, function (success) {
                        console.log(success);
                        $scope.post.liked = 1;
                        $scope.post.icon_like = "ion-android-star";
                        $scope.post.likes.count++;
                    }, function (error) {
                        $window.alert("error like");
                        console.log(error);
                    });
                } else {
                    //unlike
                    Post.unlike({
                        user_token: UserService.getUser().user_token,
                        post_id: $stateParams.viewId,
                        timeout: 10000
                    }, function (success) {
                        console.log(success);
                        $scope.post.liked = 0;
                        $scope.post.icon_like = "ion-android-star-outline";
                        $scope.post.likes.count--;
                    }, function (error) {
                        $window.alert("error unlike");
                        console.log(error);
                    });
                }
            };

            //share function
            $scope.Share = function (id) {
                Post.share({
                        user_token: UserService.getUser().user_token,
                        shared_from_id: id
                    }, function (success) {
                        console.log(success);
                        $state.go('tab.account')
                    }, function (error) {
                        console.log(error);
                    }
                )
            };

            //back button
            $scope.GoBack = function () {
                if ($ionicHistory.backView()) {
                    console.log("back");
                    $ionicHistory.goBack();
                } else {
                    $state.go('tab.dash');
                }
            };

            //view post on map
            $scope.ViewMap = function () {
                // $stateParams.feed = {};
                UserService.setObject('mappost',$scope.post);
                $state.go('tab.map');
            }
        })

        // enter to submit
        .directive('enterSubmit', function () {
            return {
                restrict: 'A',
                link: function (scope, elem, attrs) {

                    elem.bind('keydown', function (event) {
                        var code = event.keyCode || event.which;

                        if (code === 13) {
                            if (!event.shiftKey) {
                                event.preventDefault();
                                scope.$apply(attrs.enterSubmit);
                            }
                        }
                    });
                }
            }
        });
