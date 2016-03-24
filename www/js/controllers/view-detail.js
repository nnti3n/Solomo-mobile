angular.module('solomo.controllers')

    .controller('ViewDetailCtrl', function($scope, $ionicHistory, $state,$ionicLoading, $stateParams, Post, UserService, $window) {
        console.log($stateParams.viewId);

        var email = UserService.getUser().email;

        //search
        $scope.search = {};
        $scope.search.searchText = "";
        $scope.clear_search = function () {
            $scope.search.searchText = "";
        };

        $ionicLoading.show({
            template: 'loading..',
            duration: 10000
        });

        // call api
        PostRequest();

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

        //back button
        $scope.GoBack = function () {
            //if ($ionicHistory.viewHistory()) {
            //    $ionicHistory.goBack();
            //} else {
            //    $state.go('tab.dash');
            //}
            $state.go('tab.dash');
        }


    });
